# WeddingPro 거래처 커넥터

Claude에서 커넥터를 연결하면 브라우저에 WeddingPro 로그인 화면이 열립니다. **거래처 계정**으로 로그인하고 Claude로 돌아오면 조회 도구를 사용할 수 있습니다.

비밀번호는 WeddingPro 로그인 화면에 입력합니다. Claude가 토큰 저장과 갱신을 처리합니다.

| 환경 | 직접 연결 주소 |
| --- | --- |
| 운영 | `https://pro.villadegd-server.click/mcp/vendor` |
| 개발 | `https://dev.villadegd-server.click/mcp/vendor` |

로그인 화면이 열리지 않거나 조회 도구가 표시되지 않으면 연결 주소와 클라이언트의 원격 HTTP MCP·OAuth 지원 여부를 확인하세요. 연결이 만료됐거나 계정을 바꾸려면 Claude 커넥터 설정에서 기존 연결을 해제하고 다시 연결하세요.
