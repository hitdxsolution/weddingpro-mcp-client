---
description: 웨딩프로 커넥터가 연결되지 않거나 도구가 안 보일 때(특히 Node.js 미설치) 설치·연결을 안내한다. "커넥터 연결 안 됨", "도구가 안 보임", "node 없음", "command not found" 상황에 사용.
---

# 웨딩프로 커넥터 설치/연결 안내

웨딩프로 커넥터는 동봉된 작은 브리지를 **Node.js 로 실행**한다. 그래서 사용하는 PC에 **Node.js 18 이상**이 설치돼 있어야 한다. 커넥터가 연결되지 않거나 도구가 안 보이면 대개 Node.js 가 없거나 구버전이다.

## 1. 증상 확인

다음 중 하나면 이 안내를 따른다.

- 커넥터(weddingpro)가 "연결됨"으로 안 바뀌고 실패한다
- 대화에서 `wedding_pro_*` 도구가 보이지 않는다
- 로그에 `command not found: node` / `spawn node ENOENT` 류 오류가 보인다

## 2. Node.js 설치 여부 확인

터미널에서:

```bash
node --version
```

- `v18.x` 이상이 나오면 Node 는 정상 → 4번(재연결)으로.
- 명령을 못 찾거나 `v16` 이하면 → 3번(설치).

> Claude Code(터미널 환경)에서 도와주는 경우, 위 명령을 직접 실행해 버전을 확인한 뒤 안내한다.

## 3. Node.js 설치 (OS별)

설치 후 **터미널/Claude 앱을 재시작**해야 PATH 가 반영된다.

### macOS
- 공식 설치 파일: https://nodejs.org 에서 **LTS** 버전 다운로드 후 설치
- 또는 Homebrew: `brew install node`

### Windows
- 공식 설치 파일: https://nodejs.org 에서 **LTS** 설치 (설치 중 "Add to PATH" 유지)
- 또는 winget: `winget install OpenJS.NodeJS.LTS`

### Linux
- nvm 권장: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash` → 새 터미널에서 `nvm install --lts`
- 또는 배포판 패키지(예: Debian/Ubuntu): NodeSource LTS 저장소 사용

설치 후 다시 `node --version` 으로 18 이상인지 확인한다.

## 4. 재연결

Node 설치/업그레이드 후:

1. Claude 앱(또는 Claude Code)을 **재시작**한다.
2. 설정에서 weddingpro 커넥터를 **껐다가 다시 연결**한다.
3. 연결되면 `wedding_pro_login` 으로 로그인한다(자세한 건 로그인 안내 스킬 참고).

## 5. 그래도 안 되면

- `node --version` 은 되는데 커넥터만 실패하면, Node 가 PATH 에 있는지(앱을 터미널 PATH 로 재시작했는지) 확인한다.
- 회사 관리 PC라 설치 권한이 없으면 IT 담당자에게 Node.js LTS 설치를 요청한다.
