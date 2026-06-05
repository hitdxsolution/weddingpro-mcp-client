---
description: 웨딩프로 커넥터가 연결되지 않거나 도구가 안 보일 때(특히 Node.js 미설치) 설치·재시작·연결을 안내한다. "커넥터 연결 안 됨", "도구가 안 보임", "node 없음", "command not found" 상황에 사용.
---

# 웨딩프로 커넥터 설치/연결 안내

웨딩프로 커넥터는 동봉된 작은 브리지를 **Node.js 로 실행**한다. 그래서 사용하는 PC에 **Node.js 18 이상**이 설치돼 있어야 한다. 커넥터가 연결되지 않거나 도구가 안 보이면 대개 Node.js 가 없거나, 설치 후 **재시작을 안 해서** PATH 가 안 잡힌 경우다.

## 1. 증상 확인

다음 중 하나면 이 안내를 따른다.

- 커넥터(weddingpro)가 "연결됨"으로 안 바뀌고 실패한다
- 대화에서 `wedding_pro_*` 도구가 보이지 않는다
- 로그에 `command not found: node` / `spawn node ENOENT` 류 오류가 보인다

## 2. Node.js 설치 여부 확인

터미널(Windows: PowerShell/명령프롬프트, macOS: 터미널)에서:

```bash
node --version
```

- `v18.x` 이상이 나오면 Node 는 정상 → **4. 재시작**으로.
- 명령을 못 찾거나 `v16` 이하면 → **3. 설치**.

## 3. Node.js 설치 (OS별)

### Windows
**방법 A — winget (권장, 한 줄)**: PowerShell 에서
```powershell
winget install OpenJS.NodeJS.LTS
```
**방법 B — 설치 파일**: https://nodejs.org 에서 **LTS** `.msi` 다운로드 → 실행 → 설치 중 **"Add to PATH" 체크 유지** → 끝까지 설치.

### macOS
**방법 A — 설치 파일(권장)**: https://nodejs.org 에서 **LTS** `.pkg` 다운로드 → 실행해 설치.
**방법 B — Homebrew**(Homebrew 가 깔려 있으면):
```bash
brew install node
```

설치가 끝나면 **반드시 4번(재시작)** 을 해야 적용된다.

## 4. ★ 재시작 (필수)

Node 를 새로 설치/업그레이드하면, **이미 켜져 있던 프로그램은 새 PATH 를 모른다.** 그래서 재시작이 필수다.

- **Claude Desktop(앱)**: 앱을 **완전히 종료** 후 다시 실행한다.
  - Windows: 작업 표시줄 트레이 아이콘에서 Claude 우클릭 → 종료(Quit) 후 재실행 (창만 닫으면 백그라운드로 남아 적용 안 됨)
  - macOS: `Cmd+Q` 또는 메뉴바 Claude → Quit 으로 완전 종료 후 재실행 (빨간 닫기 버튼만 누르면 적용 안 됨)
- **Claude Code / 터미널**: 열려 있던 **터미널 창을 닫고 새로 연다**(또는 Claude Code 세션 재시작). 그래야 `node` 가 PATH 에 잡힌다.

재시작 후 다시 `node --version` 으로 18 이상인지 확인한다.

## 5. 재연결

재시작했는데도 커넥터가 안 잡히면:

1. 설정에서 weddingpro 커넥터를 **껐다가 다시 연결**한다.
2. 연결되면 `wedding_pro_login` 으로 로그인한다(자세한 건 로그인 안내 스킬 참고).

## 6. 그래도 안 되면

- `node --version` 은 되는데 커넥터만 실패하면, **앱/터미널을 완전히 재시작했는지** 다시 확인한다(가장 흔한 원인).
- 회사 관리 PC라 설치 권한이 없으면 IT 담당자에게 **Node.js LTS 설치**를 요청한다.
- Windows 에서 `winget` 이 없으면(구버전 Windows) 3번 방법 B(.msi 설치 파일)를 쓴다.
