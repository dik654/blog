# Claude review backfill: architecture hybrid assist

Date: 2026-07-23

## Result

`llm-architecture-hybrid-linear` 한 글을 Context Manager로 검증했다. 응답의 첫 transport header가
`[claude-code:sonnet`으로 시작한 두 실행만 채택했다. Broad timeout과 connector failure는
폐기했다.

| review focus | accepted header | result | disposition |
|---|---|---|---|
| SSM·Delta·KDA 수식과 source boundary | `[claude-code:sonnet · L3 · $0.0000 · 137872ms]` | medium 1 | `confirmed_then_fixed` |
| content spec과 Playwright 계약 | `[claude-code:sonnet · L3 · $0.0000 · 58423ms]` | medium 1 | `confirmed_then_fixed` |

Unique accepted slug는 1개다. 전체 실행 4건 중 true-Claude 2건을 채택하고 2건을 폐기했다.

## Finding 1: Matrix Product Order

기존 SSM unroll 식은 일반 matrix-valued transition을
`\prod_{j=i+1}^{t} A_j`로 썼다. 행렬은 일반적으로 교환되지 않으므로 이 표기는 적용 순서를
모호하게 만든다.

현재 `llm-architecture-hybrid-linear.tsx:141-147`은 다음을 명시한다.

- 나중 transition이 왼쪽에 오는 `A_t A_{t-1} ... A_{i+1}` 순서
- 오른쪽의 이른 transition부터 state에 적용된다는 설명
- `i=t`일 때 빈 곱은 identity라는 경계

따라서 disposition은 `confirmed_then_fixed`다.

## Finding 2: Exact Cadence Oracle

Content spec `:60,93`은 48칸이 정확히 `S,S,S,A` cadence를 이루는지 검증하도록 요구한다.
그러나 test `:67`은 `[data-layer-cadence] > *`의 개수가 48인지밖에 검사하지 않는다.

현재 `StateMemoryLedgerLab.tsx:61-70`은 올바른 순서를 출력하지만, 다음 회귀는 테스트를
통과할 수 있다.

- 48칸이 모두 `S`
- 48칸이 모두 `A`
- `S` 36개와 `A` 12개지만 순서가 틀림

최소 보강은 36개 `S`, 12개 `A`, 전체 또는 대표 prefix의 `S,S,S,A` 순서를 함께 assert하는
것이다. 최초 보고서 작성 시점에는 `confirmed_open_at_report_time`이었으나, 현재 test
`:67-71`은 48개 전체 순서와 36개 `S`·12개 `A` 개수를 모두 assert한다. 최종 disposition은
`confirmed_then_fixed`다.

## Rejected Attempts

| route | scope | result | disposition |
|---|---|---|---|
| `cm_route_delegate` | article·direct imports·spec·test broad audit | timeout, 257017ms | rejected |
| `cm_route_delegate` | narrow spec-to-test audit | unable to connect | rejected |

## Coverage Boundary

첫 accepted pass는 SSM recurrence부터 DeltaNet, Gated DeltaNet, KDA, chunk recurrence까지의
수식·source boundary를 검토했다. 두 번째 accepted pass는 content spec과 Playwright contract,
그리고 cadence를 만드는 direct component를 비교했다.

Responsive assertion의 존재와 누락은 검토했지만 이 assist가 Playwright screenshot을 새로
실행한 것은 아니다. 새 visual QA 실행으로 집계하면 안 된다.
