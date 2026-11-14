# weddingpro-mcp-client

웨딩프로 조회를 Claude(데스크탑/웹/Code)에서 쓰기 위한 **Claude Code 플러그인 마켓플레이스**입니다. 각 플러그인은 커넥터(MCP) + 업무 배경지식(스킬)을 한 꾸러미로 담습니다.

| 플러그인 | 대상 | 폴더 |
|---|---|---|
| `weddingpro` | 직원 | `./weddingpro` |
| `weddingpro-vendor` | 거래처(vendor) | `./weddingpro-vendor` |

## 설치

Claude 데스크탑/웹의 **설정 → 플러그인(마켓플레이스)** 에서 `hitdxsolution/weddingpro-mcp-client` 마켓플레이스를 추가한 뒤, 직원은 `weddingpro`, 거래처는 `weddingpro-vendor` 플러그인을 설치하세요.

Claude 설정에서 WeddingPro 커넥터를 연결하고 브라우저에서 로그인하면 조회 도구를 사용할 수 있습니다. 직원과 거래처는 각자의 계정으로 별도 연결합니다.

| 계정 | API 연결 주소 |
| --- | --- |
| 직원 | `https://pro.villadegd-server.click/mcp/employee` |
| 거래처 | `https://pro.villadegd-server.click/mcp/vendor` |

브라우저 로그인 뒤 토큰 갱신은 클라이언트가 처리합니다. 원격 HTTP MCP와 OAuth를 지원하는 클라이언트를 사용하세요.
