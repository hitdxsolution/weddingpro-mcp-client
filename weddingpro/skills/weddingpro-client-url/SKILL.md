---
description: 웨딩프로 프론트(웹) 화면 URL 사전. 사용자가 "어디서 하나요", "그 화면 링크 줘", "바로가기 알려줘"라고 묻거나, 안내문·자료에 화면 바로가기 URL을 넣어야 할 때, 조회 결과(PK)로 상세 화면 링크나 검색 조건이 걸린 목록 링크를 만들어줄 때 참고한다. 화면별 경로·path/query 파라미터·검색 쿼리·예시 URL 포함.
---

# 웨딩프로 프론트 URL 안내

사용자를 정확한 화면으로 보내거나, 자료에 바로가기 링크를 넣을 때 쓰는 URL 사전이다.
조회 도구(`get_*`)로 얻은 PK를 아래 경로에 끼워 넣으면 해당 건의 상세 화면 링크가 된다.

## 베이스 URL


| 시스템     | 대상  | 주소                                      |
| ------- | --- | --------------------------------------- |
| CRM/ERP | 직원  | `https://weddingpro.web.app`            |
| vendor  | 거래처 | `https://weddingpro-erp-vendor.web.app` |


링크 = 베이스 URL + 아래 표의 경로. 예: 고객 PK 4956의 상담·정보 탭 → `https://weddingpro.web.app/client/detail/4956/consult`

## 공통 규칙

- **로그인 필수.** `/login`, `/signup`, `/find-password`, `/reset-password` 외 모든 경로는 미로그인 시 `/login`으로 리다이렉트된다.
- **404**: 정의되지 않은 경로는 404 화면으로 매칭된다.
- **`memoPk` 쿼리(공통 컨벤션)**: 상세/수정 화면의 메모 섹션에서 특정 메모로 스크롤·포커스한다. 상담카드 상세, 고객상세(상담·일정 탭), 일정/홀일정 수정, 발주 품목 메모에서 동작. 예: `?memoPk=123`
- 상세 화면(상담카드 상세, 고객상세, 홀일정 수정, vendor 발주상세 등)에는 **URL 복사 버튼**이 있다 — 아래 URL 형식은 그 버튼이 복사하는 것과 동일하므로 외부 공유에 그대로 써도 된다.
- 루트 `/` 접근 시 자동 분기: 직원은 부서에 따라 `/home`(예약·경영지원·마케팅 등) 또는 `/order`(조리부·연회부), 거래처는 `/order-vendor`.

---

## 직원용 (CRM/ERP) — `https://weddingpro.web.app`

### 홈 · 고객관리


| 경로                                   | 화면                | 설명                                     | 예시                                       |
| ------------------------------------ | ----------------- | -------------------------------------- | ---------------------------------------- |
| `/home`                              | 홈                 | 메인 대시보드 (로그인 후 기본 진입)                  | `/home`                                  |
| `/client`                            | 고객관리              | 고객 목록 조회·검색                            | `/client`                                |
| `/client/detail/{clientPk}`          | 고객상세              | 접근 시 자동으로 `/consult` 탭으로 리다이렉트됨        | `/client/detail/4956`                    |
| `/client/detail/{clientPk}/consult`  | 고객상세 — 상담·정보 탭    | 상담 내역·기본 정보 + 메모. `?memoPk=` 지원        | `/client/detail/4956/consult?memoPk=123` |
| `/client/detail/{clientPk}/calendar` | 고객상세 — 일정·홀일정 탭   | 해당 고객의 미팅·홀일정. `?memoPk=` 지원           | `/client/detail/4956/calendar`           |
| `/client/detail/{clientPk}/document` | 고객상세 — 견적·계약·정산 탭 | 해당 고객의 문서 발행·조회                        | `/client/detail/4956/document`           |
| `/client/detail/{clientPk}/question` | 고객상세 — 고객 평가 탭    | 설문/평가 조회                               | `/client/detail/4956/question`           |
| `/client/excel_upload`               | 고객 엑셀 업로드         | 엑셀로 고객 일괄 등록 (`excel_upload` 언더스코어 주의) | `/client/excel_upload`                   |


> 고객상세 링크는 **탭 경로까지 포함해서** 만들 것. `/client/detail/4956`에 쿼리를 붙이면 리다이렉트되며 쿼리가 유실된다.

### 상담카드


| 경로                                     | 화면      | 설명                                       | 예시                                     |
| -------------------------------------- | ------- | ---------------------------------------- | -------------------------------------- |
| `/consult-card`                        | 상담카드    | 상담카드(설문 응답 리드) 목록                        | `/consult-card`                        |
| `/consult-card/detail/{consultCardPk}` | 상담카드 상세 | 신랑/신부 정보, 연락여부, 고객 전환, 메모. `?memoPk=` 지원 | `/consult-card/detail/1234?memoPk=567` |


### 일정 · 홀일정


| 경로                                     | 화면     | 설명                          | 예시                                       |
| -------------------------------------- | ------ | --------------------------- | ---------------------------------------- |
| `/meeting-schedule`                    | 일정     | 상담·미팅 일정 캘린더 (홀일정과 다름!)     | `/meeting-schedule`                      |
| `/meeting-schedule/edit/{meetingPk}`   | 일정 수정  | 일정 수정 다이얼로그. `?memoPk=` 지원  | `/meeting-schedule/edit/8775?memoPk=123` |
| `/hall-schedule`                       | 홀일정    | 예식(홀) 일정 캘린더                | `/hall-schedule`                         |
| `/hall-schedule/edit/{hallSchedulePk}` | 홀일정 수정 | 홀일정 수정 다이얼로그. `?memoPk=` 지원 | `/hall-schedule/edit/4321`               |


### 견적·계약·정산 · 메시지


| 경로                | 화면          | 설명                                    | 예시                |
| ----------------- | ----------- | ------------------------------------- | ----------------- |
| `/document`       | 견적·계약·정산    | 지점 문서 통합 목록 (견적/계약/정산 탭은 URL에 반영 안 됨) | `/document`       |
| `/message-single` | 메시지 — 일반 발송 | 단건 메시지 발송·내역                          | `/message-single` |
| `/message-bulk`   | 메시지 — 대량 발송 | 대량 메시지 발송·내역                          | `/message-bulk`   |


### 발주 (ERP)


| 경로                                           | 화면       | 설명                                              | 예시                             |
| -------------------------------------------- | -------- | ----------------------------------------------- | ------------------------------ |
| `/order`                                     | 발주       | 발주 목록 (그리드/월별/캘린더)                              | `/order`                       |
| `/order/add`                                 | 발주등록     | 새 발주 작성. 쿼리는 아래 표 참고                            | `/order/add?loadOrderPk=345`   |
| `/order/temp/{orderPk}`                      | 발주임시저장   | 임시저장 발주 이어서 작성                                  | `/order/temp/345`              |
| `/order/detail/{orderPk}`                    | 발주상세     | 발주 1건 상세 (품목·서명·메모)                             | `/order/detail/345`            |
| `/order/detail/{orderPk}/memo/{orderItemPk}` | 발주 품목 메모 | 품목별 메모 다이얼로그. `?memoPk=` 지원                     | `/order/detail/345/memo/789`   |
| `/order/detail/{orderPk}/total-memo`         | 전체 메모    | 발주 1건의 메모 모아보기                                  | `/order/detail/345/total-memo` |
| `/order/payment`                             | 결제상세     | 발주 결제 처리 — **직링크 비추천** (결제 대상은 화면 내 선택으로만 전달됨)  | `/order/payment`               |
| `/order/ledger`                              | 거래원장 조회  | 거래처별 원장 조회 다이얼로그 (거래처 미등록 시 `/order`로 돌려보냄)     | `/order/ledger`                |
| `/order/spec`                                | 거래명세서 조회 | 거래명세서 조회·PDF 일괄 다운로드 (거래처 미등록 시 `/order`로 돌려보냄) | `/order/spec`                  |


`/order/add` 쿼리 파라미터:


| 파라미터          | 값          | 의미                    |
| ------------- | ---------- | --------------------- |
| `vendorPk`    | 거래처 PK(정수) | 해당 거래처를 미리 선택한 상태로 진입 |
| `loadOrderPk` | 발주 PK(정수)  | 기존 발주를 불러와 복제 발주 작성   |


### 품목 · 재고실사 (ERP)


| 경로                                | 화면             | 설명                                           | 예시                               |
| --------------------------------- | -------------- | -------------------------------------------- | -------------------------------- |
| `/product`                        | 품목관리           | 품목 목록·검색·기록 조회                               | `/product`                       |
| `/product/order/detail/{orderPk}` | 발주상세 (품목 컨텍스트) | 품목 입고내역에서 보는 발주 상세 (화면은 `/order/detail`과 동일) | `/product/order/detail/1234`     |
| `/stock`                          | 재고실사           | 실사 목록 조회·검색                                  | `/stock`                         |
| `/stock/add`                      | 실사 작성          | 신규 재고실사. `?vendorPks=` 지원                    | `/stock/add?vendorPks=12,34`     |
| `/stock/detail/{stockPk}`         | 실사 상세          | 실사 1건 조회·수정. `?vendorPks=` 지원                | `/stock/detail/567?vendorPks=12` |


`vendorPks` 쿼리: 콤마로 구분한 거래처 PK 목록 — 해당 거래처만 초기 필터로 선택된 상태로 열린다.

### 거래처 · 플래너 · 소셜 · 통계 · 계정


| 경로                        | 화면           | 설명                                                             | 예시                        |
| ------------------------- | ------------ | -------------------------------------------------------------- | ------------------------- |
| `/vendor-manage-register` | 거래처관리 — 등록업체 | 자가 등록 거래처 목록·등록                                                | `/vendor-manage-register` |
| `/vendor-manage-link`     | 거래처관리 — 연동업체 | 연동 거래처 목록·찾기·수정                                                | `/vendor-manage-link`     |
| `/planner`                | 플래너관리        | 플래너 업체 목록 (업체별 고객·결제·리베이트)                                     | `/planner`                |
| `/social-monitor`         | 소셜 모니터       | 플랫폼별 크롤링 게시글/리뷰 모니터링                                           | `/social-monitor`         |
| `/statistics`             | 통계           | Looker Studio 임베드 대시보드                                         | `/statistics`             |
| `/statistics/form`        | 엑셀통계         | 통계 양식 목록·다운로드 — **데이터관리자/관리자 권한 필요** (없으면 `/statistics`로 돌려보냄) | `/statistics/form`        |
| `/statistics/form/add`    | 양식추가         | 새 엑셀 통계 양식 등록 — 권한 동일                                          | `/statistics/form/add`    |
| `/employee`               | 계정관리         | 직원 계정·직급 관리                                                    | `/employee`               |


### 설정 · 도움말


| 경로                   | 화면         | 설명                             | 예시                   |
| -------------------- | ---------- | ------------------------------ | -------------------- |
| `/office-setting`    | 설정 — 지점설정  | 그룹관리/홀관리/일반 (내부 탭은 URL 반영 안 됨) | `/office-setting`    |
| `/form-setting`      | 설정 — 양식설정  | 문서양식/메모양식                      | `/form-setting`      |
| `/messenger-setting` | 설정 — 메신저설정 | 알림톡/메시지/디스코드 웹훅                | `/messenger-setting` |
| `/survey-setting`    | 설정 — 설문설정  | 설문 양식 관리                       | `/survey-setting`    |
| `/help`              | 사용방법       | 도움말 화면 (직원·거래처 시스템 양쪽에 존재)     | `/help`              |


### 로그인 · 계정 (비로그인 접근 가능)


| 경로                | 화면      | 설명                                   | 예시                          |
| ----------------- | ------- | ------------------------------------ | --------------------------- |
| `/login`          | 로그인     | 이메일/비밀번호 로그인                         | `/login`                    |
| `/signup`         | 회원가입    | 직원 가입 (vendor 시스템에서는 거래처 가입 화면)      | `/signup`                   |
| `/find-password`  | 비밀번호 찾기 | 재설정 메일 발송                            | `/find-password`            |
| `/reset-password` | 비밀번호 변경 | 메일 링크로 진입. `?token=` 필수 (메일에 포함된 토큰) | `/reset-password?token=...` |


---

## 검색 쿼리 파라미터 (목록 화면)

아래 10개 목록 화면은 **검색 상태가 URL 쿼리로 동기화**된다. 검색 조건이 걸린 목록 링크를 만들 수 있다.

공통 규칙:

- **빠른검색**: `?words=검색어` 키 하나만 쓴다. 상세검색 키와 같이 쓸 수 없다(`words`가 있으면 나머지 무시). 소셜 모니터만 `words` 미지원.
- **상세검색**: 아래 표의 키를 `&`로 조합. 값이 빈 키는 생략.
- 복수 선택 값은 **콤마(,) 구분**, 날짜는 `yyyy-MM-dd`, 시간은 `HH:mm`(10분 단위).
- `~Pks`/`~Pk` 키는 PK 숫자 목록 — 거래처·직원 등의 PK는 조회 도구(`get_*`)로 먼저 확인한다.
- 한글 값(상담카드 `visitFrom` 등)은 URL 인코딩되어도 정상 동작한다.

조합 예시: `/order?status=pending,receive&vendorPks=12&minOrderAt=2026-06-01&maxOrderAt=2026-06-30`

### `/order` — 발주

| 파라미터 | 필드 | 값 |
|---|---|---|
| `pk` | 발주번호 | 숫자 |
| `vendorPks` | 거래처 | 거래처 PK 콤마 목록 |
| `type` | 유형 | `link`=연동, `self`=등록 |
| `belongToPks` | 발주담당자 | 직원 PK 콤마 목록 |
| `department` | 부서 | `reserve`=예약부, `cook`=조리부, `banquet`=연회부, `management`=경영지원부, `marketing`=마케팅팀, `etc`=기타 |
| `minPayPrice` / `maxPayPrice` | 공급가액 | 숫자 |
| `minPayAmount` / `maxPayAmount` | 결제금액 | 숫자 |
| `minOrderAt` / `maxOrderAt` | 발주일자 | `yyyy-MM-dd` |
| `minShippedAt` / `maxShippedAt` | 출고일자 | `yyyy-MM-dd` |
| `minInboundAt` / `maxInboundAt` | 입고일자 | `yyyy-MM-dd` |
| `minModifyAt` / `maxModifyAt` | 수정일자 | `yyyy-MM-dd` |
| `status` | 상태 | `pending`=접수중, `receive`=접수완료, `shipped`=출고완료, `complete`=입고완료, `cancel`=취소 |
| `paymentStatus` | 결제상태 | `unpaid`=결제전, `paid`=결제완료 |
| `isSigned` | 서명 | `none`=미서명, `signed`=서명완료 |

### `/consult-card` — 상담카드

| 파라미터 | 필드 | 값 |
|---|---|---|
| `name` | 고객명 | 텍스트 |
| `phone` | 연락처 | 텍스트 (부분 번호 검색 가능) |
| `minPredictWeddingDate` / `maxPredictWeddingDate` | 예상 예식일자 | `yyyy-MM-dd` |
| `minCreateAt` / `maxCreateAt` | 생성일자 | `yyyy-MM-dd` |
| `visitFrom` | 예약경로 | **한국어 값 그대로**: `지점 예약`, `랜딩페이지 예약`, `웨딩플래너 예약` |
| `contactStatus` | 연락여부 | `notContacted`=미연락, `missed`=부재중, `contacted`=연락완료 |
| `tag` | 태그 | `none`=태그 없음, `otherVisit`=타지점, `hurryConsult`=급한 상담건 |

### `/meeting-schedule` — 일정

| 파라미터 | 필드 | 값 |
|---|---|---|
| `title` | 제목 | 텍스트 |
| `clientName` | 고객명 | 텍스트 |
| `startDate` / `endDate` | 날짜 | `yyyy-MM-dd` |
| `startTime` / `endTime` | 시간 | `HH:mm` (10분 단위) |
| `clientStatus` | 고객 상태 | `consult`=상담, `estimation`=견적, `contract`=계약, `receipt`=정산, `cancel`=취소 |
| `scheduleTypePks` | 유형 | 일정유형 PK 콤마 목록 (지점 설정값) |
| `belongToPks` | 담당자 | 직원 PK 콤마 목록 |

### `/hall-schedule` — 홀일정

일정과 동일한 키(`title`, `clientName`, `startDate`/`endDate`, `startTime`/`endTime`, `scheduleTypePks`, `belongToPks`)에 더해:

| 파라미터 | 필드 | 값 |
|---|---|---|
| `hallPks` | 홀 | 홀 PK 콤마 목록 |

### `/message-single` — 메시지 일반 발송

| 파라미터 | 필드 | 값 |
|---|---|---|
| `name` | 고객명 | 텍스트 |
| `phone` | 연락처 | 텍스트 |
| `sendStartDate` / `sendEndDate` | 발송일자 | `yyyy-MM-dd` |
| `senderPk` | 발송자 | 직원 PK 콤마 목록 |

### `/message-bulk` — 메시지 대량 발송

| 파라미터 | 필드 | 값 |
|---|---|---|
| `sendStartDate` / `sendEndDate` | 발송일자 | `yyyy-MM-dd` |
| `senderPk` | 발송자 | 직원 PK 콤마 목록 |

(`words` 빠른검색은 받는사람 이름·연락처 검색)

### `/social-monitor` — 소셜 모니터 (`words` 미지원)

| 파라미터 | 필드 | 값 |
|---|---|---|
| `content` | 리뷰 내용 | 텍스트 (부분 검색) |
| `minDate` / `maxDate` | 날짜 | `yyyy-MM-dd` |
| `platform` | 플랫폼 | `iWedding`=아이웨딩, `naverPlace`=네이버 지도, `googlePlace`=구글 지도, `kakaoPlace`=카카오 지도, `naverCafe`=네이버 카페, `naverBlog`=네이버 블로그 |
| `keyword` | 키워드 | 지점에 등록된 모니터링 키워드 원문 콤마 목록 |
| `sentiment` | 감정분석 | `positive`=긍정, `neutral`=중립, `negative`=부정 |

### `/document` — 견적·계약·정산

| 파라미터 | 필드 | 값 |
|---|---|---|
| `title` | 제목 | 텍스트 |
| `clientName` | 고객명 | 텍스트 |
| `phone` | 연락처 | 텍스트 (부분 번호 검색 가능) |
| `belongToPks` | 담당자 | 직원 PK 콤마 목록 |
| `createByPks` | 발행자 | 직원 PK 콤마 목록 |
| `salesStartDate` / `salesEndDate` | 매출일자 | `yyyy-MM-dd` |
| `minUpdateAt` / `maxUpdateAt` | 수정일자 | `yyyy-MM-dd` |
| `minCreateAt` / `maxCreateAt` | 생성일자 | `yyyy-MM-dd` |
| `type` | 유형 | `estimation`=견적서, `contract`=계약서, `receipt`=정산서 |
| `receiptStartPercent` / `receiptEndPercent` | 정산현황(%) | 숫자 0~100 |
| `totalCostMin` / `totalCostMax` | 총액(원) | 숫자 |

### `/product` — 품목관리

| 파라미터 | 필드 | 값 |
|---|---|---|
| `id` | 품목번호 | 텍스트 |
| `name` | 품목명 | 텍스트 |
| `standard` | 규격 | 텍스트 |
| `unit` | 단위 | 텍스트 |
| `remarks` | 비고 | 텍스트 |
| `minPrice` / `maxPrice` | 단가 | 숫자 |
| `minPriceWithTax` / `maxPriceWithTax` | 부가세포함 단가 | 숫자 |
| `minStock` / `maxStock` | 재고수량 | 숫자 |
| `minPriceModifiedAt` / `maxPriceModifiedAt` | 변동일자 | `yyyy-MM-dd` |
| `vendorPks` | 거래처 | 거래처 PK 콤마 목록 |
| `type` | 거래처 유형 | `link`=연동, `self`=등록 |
| `productType` | 유형 | `equipment`=비품, `food`=식자재 |
| `category` | 대분류 | `prod`=공산품, `fish`=수산, `meat`=육류, `fruit`=과일, `vegetable`=채소, `etc`=기타 |
| `tax` | 과세여부 | `include`=과세, `free`=비과세 |
| `priceType` | 단가유형 | `constantPrice`=고정가, `marketPrice`=시가 |

(변동률 `minPriceChangeRate`/`maxPriceChangeRate`는 URL 복원이 안 되므로 링크에 쓰지 말 것)

### `/stock` — 재고실사

| 파라미터 | 필드 | 값 |
|---|---|---|
| `pk` | 실사번호 | 숫자 |
| `minItemCount` / `maxItemCount` | 실사품목 수 | 숫자 |
| `minPreviousStockPrice` / `maxPreviousStockPrice` | (전)재고금액 | 숫자(원) |
| `minDxPrice` / `maxDxPrice` | 증감금액 | 숫자(원, 음수 가능) |
| `minStockPrice` / `maxStockPrice` | 재고금액 | 숫자(원) |
| `minStockAt` / `maxStockAt` | 실사일자 | `yyyy-MM-dd` |
| `belongToPks` | 실사담당자 | 직원 PK 콤마 목록 |
| `vendorPks` | 거래처 | 거래처 PK 콤마 목록 |

---

## 거래처용 (vendor) — `https://weddingpro-erp-vendor.web.app`

거래처 계정 전용 시스템. 직원용과 경로가 다르다 (`-vendor` 접미사).


| 경로                                          | 화면       | 설명                                                  | 예시                                     |
| ------------------------------------------- | -------- | --------------------------------------------------- | -------------------------------------- |
| `/order-vendor`                             | 발주       | 들어온 발주 목록·검색·서명 (로그인 후 기본 진입)                       | `/order-vendor`                        |
| `/order-vendor/ledger`                      | 거래원장 조회  | 지점별/기간별 원장 조회·PDF (연결 지점 없으면 `/order-vendor`로 돌려보냄) | `/order-vendor/ledger`                 |
| `/order-vendor/spec`                        | 거래명세서 조회 | 거래명세서 조회·다운로드 (연결 지점 필요)                            | `/order-vendor/spec`                   |
| `/order-vendor/detail/{orderPk}`            | 발주 상세    | 품목·서명·명세서 다운로드·카카오 공유                               | `/order-vendor/detail/1234`            |
| `/order-vendor/detail/{orderPk}/total-memo` | 전체 메모    | 발주 1건 메모 모아보기                                       | `/order-vendor/detail/1234/total-memo` |
| `/product-vendor`                           | 품목관리     | 납품 품목 관리                                            | `/product-vendor`                      |
| `/office-vendor`                            | 지점관리     | 연결 지점(웨딩홀) 상태 관리 (대기/승인)                            | `/office-vendor`                       |


`/login`, `/signup`(거래처 가입), `/find-password`, `/reset-password`는 직원용과 동일 경로로 존재한다.

---

## 주의 — 링크로 만들면 안 되는 것

- **`/statistics/form/edit/{pk}`** — enum에만 있고 라우터 미등록. 직접 진입하면 404. 양식 수정은 `/statistics/form` 화면의 버튼으로만 가능.
- **`/product/order/detail/{pk}/memo/{pk}`** — 라우터 미등록(404). 품목 메모는 `/order/detail/...` 경로를 쓸 것.
- **`/order/payment` 직링크** — 열리긴 하지만 결제 대상 목록이 비어 있다. 발주 화면에서 선택 후 진입하도록 안내할 것.
- **`?dialog=detail`** — 레거시 파라미터(Deprecated). 새 링크에 쓰지 말 것.
- 고객상세 URL에 가끔 보이는 `initSelectedTabIndex`, `docPk`, `docType`, `isQuickLink`, `isOther`, `officeName`, `isFromConsult` 쿼리는 **앱이 기록만 하는 값**이라 직링크에 넣어도 무시된다. 탭 이동은 탭 경로(`/consult` 등)로 지정할 것.
- `/test`, `/log-button-example`은 내부 개발용 — 안내 금지.
- `/document`의 견적/계약/정산 탭, 설정 화면들의 내부 탭은 URL에 반영되지 않으므로 "특정 탭" 링크는 만들 수 없다.
- 검색 조건 링크는 위 [검색 쿼리 파라미터](#검색-쿼리-파라미터-목록-화면) 섹션의 10개 화면만 지원한다. 그 외 목록(`/client`, `/employee`, `/planner`, 거래처관리 등)의 검색 상태는 URL에 반영되지 않는다.

---

*기준: 2026-06-11 프론트 코드 검증(`lib/enums/app_route.dart` · `lib/routing/app_page.dart` · 검색 컨트롤러). 프론트 화면이 바뀌면 이 표도 갱신할 것. 프론트 관련 다른 주제(화면 사용법 등)는 `weddingpro-client-guide` 등 후속 스킬로 분리 예정.*