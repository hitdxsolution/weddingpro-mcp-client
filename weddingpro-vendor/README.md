# weddingpro-vendor 플러그인

웨딩프로 **거래처(vendor)** 조회 커넥터(MCP) + 배경지식(스킬)을 담은 Claude 플러그인. 운영(prod) 서버 고정.

## 구성

```
weddingpro-vendor/
├── .claude-plugin/plugin.json  # 매니페스트
├── .mcp.json                   # 커넥터 'weddingpro-vendor' → server/index.js (mcp/vendor, prod 고정)
├── server/index.js             # 브리지: 대화 내 로그인 + 토큰 자동갱신
└── skills/                     # 폴더명 전부 weddingpro- prefix 통일
    ├── weddingpro-terms/        # 거래처 관점/용어
    ├── weddingpro-login/        # 로그인을 선택형 질문(AskUserQuestion)으로 안내
    └── weddingpro-browser-rule/ # 브라우저 접근 시 조회 전용·변경 금지·반복 패턴화 규칙
```

## 로그인

대화에서 "로그인해줘" → `wedding_pro_login` 으로 **거래처 계정** 로그인. 입력창 지원 시 폼, 아니면 이메일/비밀번호를 물어보니 입력. 토큰은 메모리 보관·자동 갱신.

## 빌드

상위 `mcp-extensions/build.sh` 로 빌드한다. 서버 주소는 운영(prod) 고정 — 다른 서버가 필요하면 `.mcp.json` 의 `MCP_URL` 을 직접 바꾼다.
