#!/usr/bin/env node
// wedding-pro MCP 확장 — stdio <-> HTTP 브리지 + 대화 내 로그인.
//
// wedding_pro_login 을 호출하면 입력창(elicitation) 또는 email/password 인자로 로그인하고 토큰을 보관한다.
// 토큰은 메모리 + 사용자 홈(~/.weddingpro, 0600 파일)에 이중 보관해, 프로세스가 재시작돼도(새 대화/앱 재시작/재연결)
// 다시 로그인하지 않게 한다. 이후 도구 호출에 Authorization 을 붙이고 만료 임박 시 refresh 로 갱신한다.
// 서버 주소는 MCP_URL(.mcp.json) 에 고정. Node 내장 모듈만 사용(외부 의존성·npx 불필요).
const readline = require("node:readline");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

const mcpUrl = process.env.MCP_URL;
const accountType = process.env.MCP_ACCOUNT_TYPE || "employee";
if (!mcpUrl) {
  process.stderr.write("MCP_URL 이 필요합니다 (.mcp.json 의 env 에 설정).\n");
  process.exit(1);
}

const origin = new URL(mcpUrl).origin;
const loginUrl = `${origin}/auth/login`;
const refreshUrl = `${origin}/auth/refresh`;

let accessToken = null;
let refreshToken = null;

// 토큰 영속화 — refreshToken 은 장기(90일) 자격증명이므로 사용자 전용(0600) 파일에만 저장하고
// repo/플러그인 폴더에는 절대 두지 않는다. 서버(origin)+계정유형별로 파일을 분리해 충돌을 막는다.
const tokenDir = path.join(os.homedir(), ".weddingpro");
const tokenKey = crypto
  .createHash("sha256")
  .update(`${origin}|${accountType}`)
  .digest("hex")
  .slice(0, 12);
const tokenFile = path.join(tokenDir, `token-${accountType}-${tokenKey}.json`);

function loadTokens() {
  try {
    const saved = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
    if (saved && typeof saved.accessToken === "string")
      accessToken = saved.accessToken;
    if (saved && typeof saved.refreshToken === "string")
      refreshToken = saved.refreshToken;
  } catch {
    // 파일 없음/손상 → 무시(첫 로그인 필요)
  }
}
function saveTokens() {
  try {
    fs.mkdirSync(tokenDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(tokenFile, JSON.stringify({ accessToken, refreshToken }), {
      mode: 0o600,
    });
    fs.chmodSync(tokenFile, 0o600); // 기존 파일이 있던 경우에도 권한 강제(0600)
  } catch (err) {
    process.stderr.write(
      `토큰 저장 실패: ${err instanceof Error ? err.message : String(err)}\n`,
    );
  }
}
function clearTokensFile() {
  try {
    fs.unlinkSync(tokenFile);
  } catch {
    // 파일 없으면 무시
  }
}

loadTokens(); // 시작 시 저장된 토큰 복원 → 재시작에도 로그인 유지

const LOGIN_TOOL = {
  name: "wedding_pro_login",
  description:
    'wedding-pro 에 로그인한다. email/password 인자를 받는다. 인자 없이 호출하면 입력창(elicitation)을 먼저 시도하고, 입력창을 못 띄우는 환경이면 "이메일과 비밀번호를 알려달라"는 안내를 반환한다 — 그때는 사용자에게 이메일과 비밀번호를 물어본 뒤 받은 값을 email/password 인자로 넣어 다시 호출한다. 다른 도구 사용 전에 먼저 호출하고, 계정 전환 시 다시 호출한다.',
  inputSchema: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description:
          "로그인 이메일. 입력창이 없는 환경에서는 사용자에게 받아 이 인자로 전달한다.",
      },
      password: {
        type: "string",
        description:
          "로그인 비밀번호. 입력창이 없는 환경에서는 사용자에게 받아 이 인자로 전달한다.",
      },
    },
  },
};
const LOGOUT_TOOL = {
  name: "wedding_pro_logout",
  description: "로그아웃한다(메모리 및 저장된 토큰 파일 삭제).",
  inputSchema: { type: "object", properties: {} },
};

// 제보(CS) → Discord webhook. 이 URL 은 public 배포물에 포함되므로 "그 채널에 쓰기"만 가능한 저위험 자원이다.
// 악용(스팸) 시 Discord 에서 webhook 삭제/재발급으로 즉시 무효화한다(데이터 접근·삭제 불가).
const REPORT_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1512418309130293390/AcaU24r0Az7sUFzOq0rnKGvJXPfE3_ZYNtl8hKa3IDMKuhyxXqgCSolTOmSACbb_d76b";
const REPORT_TOOL = {
  name: "wedding_pro_report",
  description:
    "웨딩프로 플러그인 사용 중 불편/버그/개선 요청을 운영팀에 제보한다. 사용자가 '제보', '불편해요', '버그 신고', '이거 안 돼요' 등을 말하면 이 도구를 호출한다. message 에 내용을 담아 호출하면 운영팀 채널로 전달된다(로그인 상태면 작성자도 함께 기록).",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "제보 내용(불편한 점/버그/개선 요청). 필수.",
      },
      category: {
        type: "string",
        description:
          "분류(선택): bug(버그) / improvement(개선) / question(문의) 등",
      },
    },
    required: ["message"],
  },
};

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}
function toolResult(id, text, isError) {
  send({
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text }],
      ...(isError ? { isError: true } : {}),
    },
  });
}

// 서버→클라이언트 요청(elicitation). 응답이 stdin 으로 오면 pending 에서 resolve
const pending = new Map();
let reqSeq = 0;
function sendClientRequest(method, params) {
  const id = `bridge-${++reqSeq}`;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    send({ jsonrpc: "2.0", id, method, params });
  });
}

// 입력창으로 이메일/비밀번호 받기. accept→{email,password}, 미지원/거부→null
async function elicitCredentials() {
  const resp = await sendClientRequest("elicitation/create", {
    message: "wedding-pro 로그인 정보를 입력하세요.",
    requestedSchema: {
      type: "object",
      properties: {
        email: { type: "string", title: "이메일" },
        password: { type: "string", title: "비밀번호" },
      },
      required: ["email", "password"],
    },
  });
  // 미지원 클라이언트는 error 응답 → resp.result 없음
  if (
    resp &&
    resp.result &&
    resp.result.action === "accept" &&
    resp.result.content
  )
    return resp.result.content;
  return null;
}

function expiringSoon(jwt) {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64url").toString("utf8"),
    );
    return !payload.exp || payload.exp * 1000 < Date.now() + 60_000;
  } catch {
    return true;
  }
}

async function doLogin(creds) {
  const res = await fetch(loginUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: creds.email,
      password: creds.password,
      type: accountType,
    }),
  });
  const json = await res.json().catch(() => null);
  if (json && json.data && json.data.token) {
    accessToken = json.data.token;
    refreshToken = json.data.refresh ?? null;
    saveTokens();
    return { ok: true };
  }
  return {
    ok: false,
    message: (json && json.message) || `로그인 실패 (HTTP ${res.status})`,
  };
}

let refreshing = null;
async function ensureFreshToken() {
  if (!accessToken || !refreshToken || !expiringSoon(accessToken)) return;
  if (!refreshing) {
    refreshing = (async () => {
      const res = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json().catch(() => null);
      if (json && json.data && json.data.token) {
        accessToken = json.data.token;
        refreshToken = json.data.refresh ?? refreshToken;
        saveTokens();
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  await refreshing;
}

async function relay(message) {
  await ensureFreshToken();
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;
  const res = await fetch(mcpUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(message),
  });
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
      toolResult(
        id,
        "로그인할 이메일과 비밀번호를 알려주세요. 입력해 주시면 그 값으로 로그인합니다.",
        true,
      );
      return;
    }
  }
  const result = await doLogin(creds);
  toolResult(
    id,
    result.ok ? "로그인 성공" : `로그인 실패: ${result.message}`,
    !result.ok,
  );
}

// accessToken(JWT) 에서 작성자 정보 추출. 비로그인/디코드 실패 시 기본값.
function decodeReporter() {
  if (!accessToken) return { email: "(비로그인)", pk: null, type: accountType };
  try {
    const p = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString("utf8"),
    );
    return {
      email: p.email || "(unknown)",
      pk: p.pk ?? null,
      type: p.type || accountType,
    };
  } catch {
    return { email: "(unknown)", pk: null, type: accountType };
  }
}

// 제보를 Discord webhook 으로 전송 (embed 포맷)
async function handleReport(id, args) {
  const message =
    args && typeof args.message === "string" ? args.message.trim() : "";
  if (!message) {
    toolResult(id, "제보 내용을 message 인자에 담아 알려주세요.", true);
    return;
  }
  const category =
    args && typeof args.category === "string" && args.category
      ? args.category
      : "미지정";
  const who = decodeReporter();
  const payload = {
    username: "WeddingPro 제보",
    embeds: [
      {
        title: "웨딩프로 플러그인 제보",
        description: message.slice(0, 3800),
        color: 0xe67e22,
        fields: [
          {
            name: "작성자",
            value: `${who.email}${who.pk != null ? ` (pk:${who.pk})` : ""}`,
            inline: true,
          },
          { name: "계정유형", value: String(who.type), inline: true },
          { name: "분류", value: category, inline: true },
          { name: "서버", value: origin, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "weddingpro-mcp-client" },
      },
    ],
  };
  try {
    const res = await fetch(REPORT_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok || res.status === 204) {
      toolResult(id, "제보가 운영팀에 전달되었습니다. 감사합니다!");
    } else {
      toolResult(id, `제보 전송 실패 (HTTP ${res.status})`, true);
    }
  } catch (err) {
    toolResult(
      id,
      `제보 전송 실패: ${err instanceof Error ? err.message : String(err)}`,
      true,
    );
  }
}

async function handle(message) {
  const method = message.method;

  if (method === "tools/list") {
    // relay 가 실패해도 로그인/로그아웃 도구는 항상 노출한다.
    let resp = null;
    try {
      resp = await relay(message);
    } catch (err) {
      process.stderr.write(
        `tools/list relay 실패: ${err instanceof Error ? err.message : String(err)}\n`,
      );
    }
    const tools =
      resp && resp.result && Array.isArray(resp.result.tools)
        ? resp.result.tools
        : [];
    tools.push(LOGIN_TOOL, LOGOUT_TOOL, REPORT_TOOL);
    const result = resp && resp.result ? { ...resp.result, tools } : { tools };
    send({ jsonrpc: "2.0", id: message.id, result });
    return;
  }

  if (method === "tools/call") {
    const name = message.params && message.params.name;
    if (name === "wedding_pro_login") {
      await handleLogin(message.id, message.params && message.params.arguments);
      return;
    }
    if (name === "wedding_pro_logout") {
      accessToken = null;
      refreshToken = null;
      clearTokensFile();
      toolResult(message.id, "로그아웃 되었습니다");
      return;
    }
    if (name === "wedding_pro_report") {
      await handleReport(
        message.id,
        message.params && message.params.arguments,
      );
      return;
    }
    const resp = await relay(message);
    if (resp) send(resp);
    return;
  }

  const resp = await relay(message);
  if (resp) send(resp);
}

readline.createInterface({ input: process.stdin }).on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let message;
  try {
    message = JSON.parse(trimmed);
  } catch {
    return;
  }

  // 우리가 보낸 요청(elicitation)에 대한 응답이면 pending 으로 라우팅
  if (
    message.method === undefined &&
    message.id !== undefined &&
    pending.has(message.id)
  ) {
    const resolve = pending.get(message.id);
    pending.delete(message.id);
    resolve(message);
    return;
  }

  handle(message).catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`bridge error: ${msg}\n`);
    if (message && message.id !== undefined && message.id !== null) {
      send({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32000, message: msg },
      });
    }
  });
});
