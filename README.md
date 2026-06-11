# weddingpro-mcp-client

웨딩프로 조회를 Claude(데스크탑/웹/Code)에서 쓰기 위한 **Claude Code 플러그인 마켓플레이스**입니다. 각 플러그인은 커넥터(MCP) + 업무 배경지식(스킬)을 한 꾸러미로 담습니다.

| 플러그인 | 대상 | 폴더 |
|---|---|---|
| `weddingpro` | 직원 | `./weddingpro` |
| `weddingpro-vendor` | 거래처(vendor) | `./weddingpro-vendor` |

## 설치

Claude 데스크탑/웹의 **설정 → 플러그인(마켓플레이스)** 에서 `hitdxsolution/weddingpro-mcp-client` 마켓플레이스를 추가한 뒤, 직원은 `weddingpro`, 거래처는 `weddingpro-vendor` 플러그인을 설치하세요.

설치 후 커넥터 사용 승인 → 대화에서 로그인하면 조회 도구가 동작합니다. PC에 **Node.js 18+ 가 필요**합니다 — 없거나 모르겠으면 아래 [요구사항](#요구사항)을 먼저 확인하세요. 연결이 안 되거나 도구가 안 보이면 동봉된 `weddingpro-setup` 스킬이 OS별 Node 설치·재연결을 안내합니다.

### 플러그인 업데이트

새 버전이 나와도 **업데이트 버튼이 비활성화되거나, 재설치해도 구버전이 깔리는 알려진 문제**가 있습니다(Claude가 마켓플레이스를 처음 받은 시점의 스냅샷을 재사용하기 때문 — Claude 자체 버그로 보고되어 있음). 플러그인만 지웠다 다시 설치하면 구버전이 다시 깔립니다. 순서대로:

1. **플러그인 제거** 후, **마켓플레이스(weddingpro-mcp-client) 자체도 제거**
2. Claude Desktop **완전 종료 후 재실행** (macOS `Cmd+Q`, Windows 트레이 우클릭 → 종료)
3. 마켓플레이스 다시 추가 → 플러그인 설치 → 상세 화면에서 **버전 숫자가 올라갔는지 확인**
4. 그래도 구버전이면 서버 캐시가 남은 것이니 **30분~1시간 뒤** 1~3을 다시 시도

## 요구사항

- **Node.js 18 이상.** 커넥터는 동봉 브리지를 Node 로 실행하므로 사용하는 PC에 Node.js 18+ 가 있어야 합니다. 없으면 커넥터가 연결되지 않습니다.
- 웨딩프로 계정(이메일/비밀번호). 설치만으로는 데이터에 접근하지 않으며, 대화에서 로그인해야 조회가 됩니다.

### Node.js 설치

먼저 이미 설치돼 있는지 확인하세요.

- **Windows**: 시작 메뉴에서 `PowerShell` 검색 → 실행 → `node --version` 입력 후 Enter
- **macOS**: `Cmd+Space`(Spotlight) → `터미널` 검색 → 실행 → `node --version` 입력 후 Enter

`v18.x.x` 이상(예: `v20.11.0`)이 출력되면 이미 설치된 것이므로 이 절은 건너뛰어도 됩니다. `'node'은(는) 내부 또는 외부 명령... 아닙니다` / `command not found` 가 나오면 아래 절차대로 설치하세요.

#### Windows 설치 방법

**방법 1 — 공식 설치 파일(.msi) (권장, 가장 간단)**

1. 웹 브라우저에서 https://nodejs.org 접속
2. 초록색 **LTS** 버튼 클릭 → `node-v22.x.x-x64.msi` 같은 설치 파일이 다운로드됩니다.
   - 대부분의 PC는 64비트이므로 기본 제공되는 x64 버전이면 됩니다.
3. 다운로드된 `.msi` 파일을 더블클릭하여 설치 마법사 실행
4. 설치 단계는 전부 기본값으로 **Next** 만 누르면 됩니다.
   - License Agreement → 동의(I accept...) 체크 후 Next
   - Destination Folder → 그대로 Next
   - Custom Setup → 그대로 Next (**"Add to PATH" 항목이 설치 목록에 포함돼 있는지만 확인** — 기본으로 포함돼 있습니다)
   - "Tools for Native Modules"(Chocolatey 등 자동 설치) 체크 화면 → **체크하지 않고** Next (필요 없습니다)
5. **Install** 클릭 → 사용자 계정 컨트롤(UAC) 창이 뜨면 **예** 클릭
6. **Finish** 로 완료
7. 설치 확인: 시작 메뉴 → `PowerShell` **새로 실행**(기존에 열려 있던 창은 안 됨) → 아래 입력
   ```powershell
   node --version
   npm --version
   ```
   각각 `v22.x.x`, `10.x.x` 같은 버전이 나오면 성공입니다.

**방법 2 — winget (명령 한 줄, Windows 10 1709 이상)**

1. 시작 메뉴 → `PowerShell` 검색 → 실행
2. 아래 명령 입력 후 Enter
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
3. 설치 동의(약관) 문구가 나오면 `Y` 입력 후 Enter
4. 설치가 끝나면 PowerShell 창을 **닫고 새로 연 뒤** `node --version` 으로 확인

> 흔한 문제: 설치 직후 `node --version` 이 안 될 때 — 설치 **전에** 열어 둔 PowerShell/터미널은 새 PATH 를 모릅니다. 창을 닫고 새로 여세요. 그래도 안 되면 PC 를 한 번 재부팅하면 해결됩니다.

#### macOS 설치 방법

**방법 1 — 공식 설치 파일(.pkg) (권장, 가장 간단)**

1. 웹 브라우저에서 https://nodejs.org 접속
2. 초록색 **LTS** 버튼 클릭 → `node-v22.x.x.pkg` 다운로드
   - Apple Silicon(M1~M4)/Intel 구분은 자동으로 맞춰 제공됩니다.
3. 다운로드된 `.pkg` 파일 더블클릭 → 설치 마법사에서 **계속**(Continue) → 약관 **동의** → **설치**(Install)
4. Mac 로그인 비밀번호 입력 → 설치 완료 후 **닫기**
5. 설치 확인: `Cmd+Space` → `터미널` 실행(이미 열려 있었다면 새 창으로) → 아래 입력
   ```bash
   node --version
   npm --version
   ```
   버전이 출력되면 성공입니다.

**방법 2 — Homebrew (Homebrew 를 이미 쓰고 있는 경우)**

```bash
brew install node
```

설치 후 새 터미널 창에서 `node --version` 으로 확인하세요. Homebrew 가 없는 분은 방법 1 을 쓰는 것이 더 간단합니다.

### ★ 설치 후 재시작 (필수)

Node 를 새로 설치하면 **이미 켜져 있던 Claude 는 새 PATH 를 모릅니다.** 반드시 재시작하세요.
- **Claude Desktop**: 완전 종료 후 재실행 — Windows 는 트레이 아이콘 우클릭 → 종료, macOS 는 `Cmd+Q`(창만 닫으면 안 됨).
- **Claude Code/터미널**: 터미널 창을 닫고 새로 엽니다.

재시작 후 커넥터를 껐다 다시 연결하면 됩니다. 막히면 동봉 `weddingpro-setup` 스킬이 단계별로 안내합니다.

## 구성

- `weddingpro/`, `weddingpro-vendor/` — 각 플러그인(자체 완결형 번들: `.mcp.json` + `server/index.js` 브리지 + 스킬 + 아이콘)
- `.claude-plugin/marketplace.json` — 마켓플레이스 카탈로그

> 노출 도구는 GET 조회 한정입니다. 변경/관리자 기능은 포함하지 않습니다.
