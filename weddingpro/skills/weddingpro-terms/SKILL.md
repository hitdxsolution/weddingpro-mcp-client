---
description: 웨딩프로 직원 업무 용어와 MCP 도구 매핑. 사용자가 일정·홀일정·홀·거래처·발주·고객 등 도메인 용어로 조회를 요청하거나, 어떤 조회 도구를 써야 할지 모호할 때 먼저 참고한다.
---

# 웨딩프로 업무 용어 ↔ 도구 매핑 (직원)

비슷해 보이지만 서로 다른 도구를 가리키는 용어가 있다. 특히 **"일정"과 "홀일정"은 완전히 다르다.**

## 핵심: 일정 ≠ 홀일정

- **일정 / 오늘 일정 / 상담 일정 / 미팅** = 고객과의 상담·미팅 일정.
  → `get_meeting_list`, `get_meeting_search`, `get_meeting_quick_search`, `get_meeting_detail`, `get_meeting_sidebar` 등 **meeting 계열** 도구.
  → 사용자가 그냥 "일정"이라고 하면 거의 항상 이쪽이다.
- **홀일정 / 예식 일정 / 홀 스케줄** = 예식장(홀) 자체의 운영·예약 일정. 고객 상담 일정이 아니다.
  → `get_hall_schedule_list`, `get_hall_schedule_detail`, `get_hall_schedule_search` 등 **hall/schedule 계열** 도구.
- **홀 / 예식장** = 예식장 자체 정보(목록/상세). → `get_hall`, `get_hall_detail`.

> 사용자가 "일정 조회해줘"라고 하면 홀일정(`get_hall_schedule_*`)이 아니라 **미팅 일정(`get_meeting_*`)** 을 먼저 조회한다. 예식장 운영 일정이 필요한 게 명확할 때만 hall/schedule 도구를 쓴다.

## 기타 용어

- **거래처 (vendor)** = 협력 업체.
- **고객 (client)** = 신랑신부 등 상담 고객.
- **발주 (order)** = 거래처 대상 발주.
- **지점 (office)** = 직원이 속한 지점.

## 로그인

조회 전 반드시 `wedding_pro_login` 으로 로그인한다. 미로그인 시 401. 계정 전환 시 다시 로그인한다.
