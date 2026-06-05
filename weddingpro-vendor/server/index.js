#!/usr/bin/env node
// wedding-pro MCP 확장 — stdio <-> HTTP 브리지 + 대화 내 로그인.
//
// wedding_pro_login 을 호출하면 입력창(elicitation) 또는 email/password 인자로 로그인하고 토큰을 메모리에 보관한다.
// 이후 도구 호출에 Authorization 을 붙이고 만료 시 refresh 로 갱신한다. 서버 주소는 MCP_URL(.mcp.json) 에 고정.
// Node 내장 모듈만 사용(외부 의존성·npx 불필요).
const readline = require('node:readline');

const mcpUrl = process.env.MCP_URL;
const accountType = process.env.MCP_ACCOUNT_TYPE || 'employee';
if (!mcpUrl) {
  process.stderr.write('MCP_URL 이 필요합니다 (.mcp.json 의 env 에 설정).\n');
  process.exit(1);
}

const origin = new URL(mcpUrl).origin;
const loginUrl = `${origin}/auth/login`;
const refreshUrl = `${origin}/auth/refresh`;

let accessToken = null;
let refreshToken = null;

const LOGIN_TOOL = {
  name: 'wedding_pro_login',
  description:
    'wedding-pro 에 로그인한다. email/password 인자를 받는다. 인자 없이 호출하면 입력창(elicitation)을 먼저 시도하고, 입력창을 못 띄우는 환경이면 "이메일과 비밀번호를 알려달라"는 안내를 반환한다 — 그때는 사용자에게 이메일과 비밀번호를 물어본 뒤 받은 값을 email/password 인자로 넣어 다시 호출한다. 다른 도구 사용 전에 먼저 호출하고, 계정 전환 시 다시 호출한다.',
  inputSchema: {
    type: 'object',
    properties: {
      email: { type: 'string', description: '로그인 이메일. 입력창이 없는 환경에서는 사용자에게 받아 이 인자로 전달한다.' },
      password: { type: 'string', description: '로그인 비밀번호. 입력창이 없는 환경에서는 사용자에게 받아 이 인자로 전달한다.' },
    },
  },
};
const LOGOUT_TOOL = { name: 'wedding_pro_logout', description: '로그아웃한다(메모리 토큰 삭제).', inputSchema: { type: 'object', properties: {} } };

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}
function toolResult(id, text, isError) {
  send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }], ...(isError ? { isError: true } : {}) } });
}

// 서버→클라이언트 요청(elicitation). 응답이 stdin 으로 오면 pending 에서 resolve
const pending = new Map();
let reqSeq = 0;
function sendClientRequest(method, params) {
  const id = `bridge-${++reqSeq}`;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    send({ jsonrpc: '2.0', id, method, params });
  });
}

// 입력창으로 이메일/비밀번호 받기. accept→{email,password}, 미지원/거부→null
async function elicitCredentials() {
  const resp = await sendClientRequest('elicitation/create', {
    message: 'wedding-pro 로그인 정보를 입력하세요.',
    requestedSchema: {
      type: 'object',
      properties: { email: { type: 'string', title: '이메일' }, password: { type: 'string', title: '비밀번호' } },
      required: ['email', 'password'],
    },
  });
  // 미지원 클라이언트는 error 응답 → resp.result 없음
  if (resp && resp.result && resp.result.action === 'accept' && resp.result.content) return resp.result.content;
  return null;
}

function expiringSoon(jwt) {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'));
    return !payload.exp || payload.exp * 1000 < Date.now() + 60_000;
  } catch {
    return true;
  }
}

async function doLogin(creds) {
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: creds.email, password: creds.password, type: accountType }),
  });
  const json = await res.json().catch(() => null);
  if (json && json.data && json.data.token) {
    accessToken = json.data.token;
    refreshToken = json.data.refresh ?? null;
    return { ok: true };
  }
  return { ok: false, message: (json && json.message) || `로그인 실패 (HTTP ${res.status})` };
}

let refreshing = null;
async function ensureFreshToken() {
  if (!accessToken || !refreshToken || !expiringSoon(accessToken)) return;
  if (!refreshing) {
    refreshing = (async () => {
      const res = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json().catch(() => null);
      if (json && json.data && json.data.token) {
        accessToken = json.data.token;
        refreshToken = json.data.refresh ?? refreshToken;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  await refreshing;
}

async function relay(message) {
  await ensureFreshToken();
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;
  const res = await fetch(mcpUrl, { method: 'POST', headers, body: JSON.stringify(message) });
  if (res.status === 202) return null;
  const text = (await res.text()).trim();
  return text ? JSON.parse(text) : null;
}

async function handleLogin(id, args) {
  let creds = args || {};
  if (!(creds.email && creds.password)) {
    // 입력창을 항상 시도. 미지원이면 elicitCredentials 가 null 반환
    creds = await elicitCredentials();
    if (!creds) {
      toolResult(id, '로그인할 이메일과 비밀번호를 알려주세요. 입력해 주시면 그 값으로 로그인합니다.', true);
      return;
    }
  }
  const result = await doLogin(creds);
  toolResult(id, result.ok ? '로그인 성공' : `로그인 실패: ${result.message}`, !result.ok);
}

async function handle(message) {
  const method = message.method;

  if (method === 'tools/list') {
    // relay 가 실패해도 로그인/로그아웃 도구는 항상 노출한다.
    let resp = null;
    try {
      resp = await relay(message);
    } catch (err) {
      process.stderr.write(`tools/list relay 실패: ${err instanceof Error ? err.message : String(err)}\n`);
    }
    const tools = resp && resp.result && Array.isArray(resp.result.tools) ? resp.result.tools : [];
    tools.push(LOGIN_TOOL, LOGOUT_TOOL);
    const result = resp && resp.result ? { ...resp.result, tools } : { tools };
    send({ jsonrpc: '2.0', id: message.id, result });
    return;
  }

  if (method === 'tools/call') {
    const name = message.params && message.params.name;
    if (name === 'wedding_pro_login') {
      await handleLogin(message.id, message.params && message.params.arguments);
      return;
    }
    if (name === 'wedding_pro_logout') {
      accessToken = null;
      refreshToken = null;
      toolResult(message.id, '로그아웃 되었습니다');
      return;
    }
    const resp = await relay(message);
    if (resp) send(resp);
    return;
  }

  const resp = await relay(message);
  if (resp) send(resp);
}

readline.createInterface({ input: process.stdin }).on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let message;
  try {
    message = JSON.parse(trimmed);
  } catch {
    return;
  }

  // 우리가 보낸 요청(elicitation)에 대한 응답이면 pending 으로 라우팅
  if (message.method === undefined && message.id !== undefined && pending.has(message.id)) {
    const resolve = pending.get(message.id);
    pending.delete(message.id);
    resolve(message);
    return;
  }

  handle(message).catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`bridge error: ${msg}\n`);
    if (message && message.id !== undefined && message.id !== null) {
      send({ jsonrpc: '2.0', id: message.id, error: { code: -32000, message: msg } });
    }
  });
});
