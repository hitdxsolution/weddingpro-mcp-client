---
description: 웨딩프로 거래처(vendor) 기능 사용법 안내. 사용자가 "X 어떻게 해요?", "X 사용법 알려줘", "어디서 하나요?", "안 돼요/모르겠어요"처럼 거래처 화면·기능(발주 확인, 서명, 거래원장, 거래명세서, 품목관리, 지점관리·연결, 회원가입, 비밀번호 등)의 사용 방법을 물으면, 공개 노션 사용 설명 사이트에서 해당 기능 문서를 찾아 노션 페이지 링크와 튜토리얼 영상(YouTube) URL을 제시하고 페이지 본문 내용을 가져와 설명한다. 공개 노션 사이트(notion.site)에서 자료를 가져오는 방법 포함.
---

# 웨딩프로 사용법 안내 — 거래처 (노션 사용 설명 사이트 조회)

사용자가 기능 사용 방법을 물으면 **공개 노션 사용 설명 사이트**에서 해당 문서를 찾아 안내한다.

## 사용 설명 사이트 주소

- 사이트: `https://plume-mandolin-6cf.notion.site`
- 루트 페이지 ID: `d60e1160-ad92-4922-8324-2679989a1e4d` ("WEDDINGPRO 사용 설명" — CRM/VENDOR 문서 데이터베이스 포함)

이 주소가 안 열리거나 내용이 비어 있으면(사이트 이전 가능성) 사용자에게 새 주소를 확인하고, 대화에서 다른 주소를 공유받았다면 그 주소를 우선한다.

## 이 스킬이 발동해야 하는 질문

아래 패턴이면 데이터 조회(`get_*` 도구)가 아니라 **사용법 안내**가 목적이므로 이 스킬을 쓴다:

- **방법 질문**: "~어떻게 해요?", "~하는 법", "~사용법", "~방법 알려줘", "~추가/등록/수정/삭제하려면?"
- **위치 질문**: "어디서 해요?", "그 메뉴 어디 있어요?", "어느 화면에서 해요?"
- **막힘/문제**: "~이 안 돼요", "~모르겠어요", "버튼이 안 보여요", "처음 쓰는데 알려주세요"
- **교육/온보딩**: "처음 연결했는데 뭐부터 해요?", "튜토리얼/설명 영상 있어요?", "매뉴얼 줘"

기능 키워드 예 (이 단어들과 함께 사용법을 물으면 발동):

| 영역 | 키워드 |
|---|---|
| 발주 | 발주 확인, 서명(전자서명/인감), 발주 상세, 메모 |
| 정산 | 거래원장 조회, 거래명세서 다운로드, 엑셀 다운로드 |
| 품목 | 품목관리, 품목 등록, 품목 일괄등록 |
| 지점 | 지점관리, 지점 연결, 연결 승인/대기 |
| 계정 | 회원가입, 로그인, 비밀번호 찾기/변경 |

반대로 "오늘 들어온 발주 보여줘" 같은 **데이터 조회 요청**은 이 스킬이 아니라 조회 도구를 쓴다.

## 답변 절차

1. 사용 설명 사이트 루트 페이지를 로드해 문서 목록(데이터베이스)을 확보한다 (아래 "노션 자료 가져오는 방법" 참고).
2. 사용자의 질문 키워드를 문서 제목·"기능" 속성과 매칭한다. 이 커넥터는 거래처용이므로 **VENDOR 사용법 문서를 우선** 매칭한다.
3. 매칭된 문서에 대해 다음을 제시한다:
   - **노션 문서 링크** — `https://<사이트 호스트>/<페이지 ID에서 dash를 뺀 32자리>`
   - **튜토리얼 영상 URL** — 행 속성에 YouTube 링크가 있으면 함께 제시
4. 해당 문서 페이지의 **본문을 직접 가져와서** 단계별 사용 방법을 설명한다. 링크만 던지지 말 것.
5. 정확히 일치하는 문서가 없으면 비슷한 문서 목록을 보여주고 고르게 한다.

답변 형식 예:

> **품목 일괄등록 방법** (본문 기반 단계 설명)
> 1. … 2. … 3. …
> 📄 자세한 문서: <노션 링크> / 🎬 영상: <YouTube 링크>

## 공개 노션 사이트(notion.site)에서 자료 가져오는 방법

노션 공개 페이지는 JavaScript 렌더링이라 일반 fetch(WebFetch)로는 본문이 비어 보인다. **노션 내부 API를 직접 호출**해야 한다. 인증은 필요 없다(공개 사이트 한정). JS 실행도 필요 없다 — 아래 전 과정이 일반 HTTP 호출(curl)만으로 동작함을 실제 검증했다(목록 조회 → 문서 본문 → 영상 링크까지).

### 1단계: 루트 페이지 ID 추출

위의 "사용 설명 사이트 주소"에 적힌 루트 페이지 ID를 그대로 쓰면 이 단계는 건너뛴다. 다른 주소를 받았을 때: URL 끝에 32자리 hex가 붙어 있으면 그것이 페이지 ID다(8-4-4-4-12 dash 형식으로 변환해 사용). iframe 임베드 주소(`https://<사이트 호스트>/ebd/<32자리>`)를 공유받았다면 `/ebd/` 뒤 32자리가 그대로 루트 페이지 ID다. 둘 다 없으면 HTML에서 추출한다:

```bash
curl -sL '<사이트 URL>' | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | sort -u
```

### 2단계: 페이지 본문 로드 — `loadCachedPageChunkV2`

```bash
curl -s 'https://<사이트 호스트>/api/v3/loadCachedPageChunkV2' \
  -H 'Content-Type: application/json' \
  --data '{"page":{"id":"<페이지 UUID>"},"limit":100,"cursor":{"stack":[]},"chunkNumber":0,"verticalColumns":false}'
```

- 응답의 `recordMap.block.<블록ID>.value.value`에 블록이 들어 있다 (`value.value`가 아니라 `value` 바로 밑일 수도 있으니 둘 다 처리).
- 주요 필드: `type`(page / text / sub_header / bulleted_list / numbered_list / image / video / collection_view …), `properties.title`, `content`(자식 블록 ID 순서).
- 텍스트는 세그먼트 배열이다: `[["문장", [["a","https://..."]]], …]` — 각 세그먼트의 첫 요소가 텍스트, 둘째 요소의 `["a", URL]`이 하이퍼링크.
- 블록이 잘리면 `limit`을 늘리거나 `chunkNumber`를 올려 추가 호출한다.

### 3단계: 데이터베이스(문서 목록) 조회 — `queryCollection`

`type: collection_view` 블록에서 `collection_id`와 `view_ids[0]`을 꺼낸 뒤:

```bash
curl -s 'https://<사이트 호스트>/api/v3/queryCollection' \
  -H 'Content-Type: application/json' \
  --data '{"collection":{"id":"<collection_id>"},"collectionView":{"id":"<view_id>"},"loader":{"type":"reducer","reducers":{"collection_group_results":{"type":"results","limit":200}},"searchQuery":"","userTimeZone":"Asia/Seoul"}}'
```

- 행 ID 목록: `result.reducerResults.collection_group_results.blockIds`
- 각 행은 `recordMap.block.<행ID>`의 page 블록. `properties`에 제목(`title`)과 그 외 속성(기능 분류, 동영상 URL 등)이 있다.
- 속성 키 ↔ 이름 매핑: `recordMap.collection.<collection_id>.value.schema` (블록과 마찬가지로 `value.value.schema`로 한 겹 더 감싸져 올 수 있으니 둘 다 처리). 실측 예: 속성 이름이 `이름`(title)·`기능`·`동영상 자료`였다 — 단, 속성명도 바뀔 수 있으니 schema에서 매번 확인할 것.
- YouTube 등 영상 링크는 보통 행 속성의 세그먼트 안 `["a", URL]` 또는 텍스트 자체로 들어 있다(둘 다 같은 URL인 경우가 많음).
- 루트 페이지에 데이터베이스가 여러 개(직원용/거래처용/배포 전 등) 있을 수 있다 — 거래처 질문이면 VENDOR collection을 골라 조회한다.

### 4단계: 하위 문서 페이지 링크 / 본문

- 행(문서)의 공개 링크: `https://<사이트 호스트>/<행 페이지 ID에서 dash 제거>`
- 행의 본문 내용: 행 페이지 ID로 2단계(`loadCachedPageChunkV2`)를 다시 호출.

### 파싱 스니펫 (python3)

```bash
python3 -c "
import json, sys
data = json.load(open(sys.argv[1]))
blocks = data['recordMap'].get('block', {})
for bid, b in blocks.items():
    v = b.get('value', {}).get('value', b.get('value', {}))
    title = v.get('properties', {}).get('title')
    text = ''.join(s[0] for s in title if isinstance(s, list) and s and isinstance(s[0], str)) if title else ''
    print(v.get('type'), '|', bid, '|', text[:100])
" /tmp/notion.json
```

## 주의

- 같은 대화 안에서는 목록 조회 결과를 재사용하고, 같은 API를 불필요하게 반복 호출하지 않는다.
- "별도 공개 예정" 등으로 표시된 문서는 아직 내용이 없을 수 있다 — 그대로 안내한다.
- 본문의 스크린샷(image 블록)은 파일 URL이 서명(signed) URL이라 직접 첨부·재사용이 어렵다. 이미지 자체를 옮기려 하지 말고 **단계별 텍스트 설명 + 노션 문서 링크 + 영상 링크**로 안내한다.
- 이 방법은 **공개(public) 노션 사이트 전용**이다. 비공개 페이지는 가져올 수 없다. authenticate/OAuth 같은 인증 절차는 시도하지 않는다(불필요).
