# AI MCP 요청 경로 · Batch 36

## 범위

이번 묶음은 “결제 오류를 장애 티켓으로 등록해 줘”라는 요청 한 건이 연결 규칙부터 실제 외부 효과까지 가는 경로를 네 글로 나눕니다.

1. `mcp-protocol` — Host·client·server의 책임과 요청 자체 설명 방식을 구분합니다.
2. `mcp-primitives` — Tool·Resource·Prompt와 결과 상태를 구분합니다.
3. `mcp-transports` — 같은 JSON-RPC 메시지가 stdio와 Streamable HTTP를 지나는 방식을 대조합니다.
4. `mcp-server-operations` — 현재 권한, 안정된 작업 식별자, 실행 영수증으로 중복 효과를 막습니다.

## 추적 사례

모든 글에서 같은 `tickets.create` 요청과 `operationId=tenant7:ticket:42`를 사용합니다. 각 글은 하나의 판단만 소유하고 확인한 사실을 직속 부모 지도에 되돌려 놓습니다.

`연결 → 기능 → 운반 → 실행`

## 공식 근거

- MCP 2026-07-28 core의 요청별 version·capability, `server/discover`, stateless request를 확인했습니다.
- Tool 목록·호출·result type·cache hint와 JSON Schema 경계를 확인했습니다.
- stdio·Streamable HTTP의 framing, routing header, request-scoped SSE, cancellation·subscription 수명을 확인했습니다.
- HTTP authorization이 선택 사항인 protocol profile이며 실제 domain ACL과 사용자 동의는 별도 책임임을 확인했습니다.
- 2026-07-28과 이전 handshake 기반 revision의 호환 경로를 구분했습니다.

## 작성 원칙

- 본문보다 먼저 동일한 티켓 요청의 현재 단계를 시각화합니다.
- Protocol message, transport 연결, 권한 판단, 외부 effect를 한 상태로 뭉뚱그리지 않습니다.
- Animation은 명시적 재생과 장면 이동에만 반응합니다.
- JavaScript가 꺼져도 네 단계와 결론을 같은 순서로 읽을 수 있게 합니다.

## 검증

- [x] TypeScript 검사
- [x] 전체 production build
- [x] 문서·학습·수식·계산·읽기 순서·한국어·용어·topology·runtime strict audit
- [x] 390×844 모바일과 1440×1000 데스크톱
- [x] 키보드 좌우 이동과 명시적 재생
- [x] reduced-motion에서 자동 진행 없음
- [x] JavaScript 비활성 상태에서 모든 장면과 결론 노출
- [ ] 공개 경로 배포 후 같은 검증 반복
