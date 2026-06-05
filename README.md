# weddingpro-mcp-client

웨딩프로 조회를 Claude(데스크탑/웹/Code)에서 쓰기 위한 **Claude Code 플러그인 마켓플레이스**입니다. 각 플러그인은 커넥터(MCP) + 업무 배경지식(스킬)을 한 꾸러미로 담습니다.

| 플러그인 | 대상 | 폴더 |
|---|---|---|
| `weddingpro` | 직원 | `./weddingpro` |
| `weddingpro-vendor` | 거래처(vendor) | `./weddingpro-vendor` |

## 요구사항

- **Node.js 18 이상.** 커넥터는 동봉 브리지를 Node 로 실행하므로 사용하는 PC에 Node.js 18+ 가 설치돼 있어야 합니다. 없으면 커넥터가 연결되지 않습니다(설치: https://nodejs.org 의 LTS).
- 웨딩프로 계정(이메일/비밀번호). 설치만으로는 데이터에 접근하지 않으며, 대화에서 로그인해야 조회가 됩니다.

## 설치 (Claude Code)

```bash
# 1) 이 마켓플레이스 등록
/plugin marketplace add hitdxsolution/weddingpro-mcp-client

# 2) 플러그인 설치 (직원용 또는 거래처용)
/plugin install weddingpro@weddingpro-mcp-client
/plugin install weddingpro-vendor@weddingpro-mcp-client
```

설치 후 커넥터 사용 승인 → 대화에서 로그인하면 조회 도구가 동작합니다. 연결이 안 되거나 도구가 안 보이면 동봉된 `weddingpro-setup` 스킬이 OS별 Node 설치·재연결을 안내합니다.

## 구성

- `weddingpro/`, `weddingpro-vendor/` — 각 플러그인(자체 완결형 번들: `.mcp.json` + `server/index.js` 브리지 + 스킬 + 아이콘)
- `.claude-plugin/marketplace.json` — 마켓플레이스 카탈로그

> 노출 도구는 GET 조회 한정입니다. 변경/관리자 기능은 포함하지 않습니다.
