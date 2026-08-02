# Safe and Constrained RL content spec

## Reader contract

이 글은 “충돌에 큰 음수 보상을 주면 안전하다”는 오해에서 시작해, 성과
점수와 위험 측정을 분리하고 학습 중 제약, 실행 직전 action gate와 물리
정지 장치의 책임을 나누는 데까지 간다. 독자는 알고리즘 이름을 외우는 대신
각 보장이 평균, 한 trajectory, 한 action, 실제 actuator 중 어느 경계에
적용되는지 판정할 수 있어야 한다.

## Direct entry contract

첫 화면은 reward, policy, expected cost, constraint, episode를 전제하지
않는다. 빠른 배달에 1,000점, 충돌에 -100점을 주면 충돌 뒤에도 900점이
남는 익숙한 점수 장면을 먼저 둔다. 그 다음 더 크게 만들 성과 점수를
`보상`, 별도 상한을 둘 충돌·힘·온도를 `안전 비용`이라고 이름 붙인다.
첫 기술 질문은 이 정의 뒤에만 나온다.

## Narrative order

1. 성과 점수와 넘지 말아야 할 선은 다르다.
2. 기대 위반 횟수와 한 번 이상 사고 날 확률을 분리한다.
3. 고정 벌점과 움직이는 위험 가격을 구분한다.
4. CPO의 local update가 보장하는 범위를 계산한다.
5. Lyapunov 조건이 state별 남은 안전 여유를 어떻게 표현하는지 읽는다.
6. Recovery RL의 위험 감지와 실제 제동 성공을 분리한다.
7. 학습, runtime gate와 hardware interlock을 독립 증거로 닫는다.

## Source and claim boundaries

- Altman은 expected cumulative cost constraint의 수학적 기반이다.
- CPO는 local surrogate와 trust-region 근사 아래의 expected-cost update를
  다루며 모든 순간의 무사고를 보장하지 않는다.
- Lyapunov 기반 방법은 feasible baseline과 local condition을 전제로 한다.
- Recovery RL의 learned safety critic과 recovery policy는 formal hardware
  safety guarantee가 아니다. Detection latency와 braking envelope가 남는다.
- Safety Gym은 비교 환경이지 실제 로봇의 release certificate가 아니다.

## Hidden transfer checks

본문만 읽은 독자는 다음을 해결해야 한다.

1. 성공 +1,000, 충돌 -100인 선택이 왜 충돌을 허용할 수 있는지 계산한다.
2. step당 독립 위반 확률 0.5%, 200 step에서 기대 위반 수와 한 번 이상
   위반 확률을 각각 계산하고 둘이 다른 요구사항임을 설명한다.
3. 고정 penalty와 budget 초과량에 따라 갱신되는 multiplier를 구분한다.
4. CPO의 reward gradient, 선형 cost boundary와 이차 KL boundary를 찾는다.
5. risk score가 높아도 detection, handoff와 braking time의 합이
   time-to-collision보다 길면 막지 못하는 이유를 설명한다.
6. 학습 제약, runtime shield와 hardware interlock 중 하나만 통과한 결과를
   전체 안전 보장이라고 부르지 않는다.

## Formula and visual contract

- 모든 display 수식에는 한국어 내부 annotation과 인접 FormulaNote가 있다.
- 기대 횟수와 사고 확률, Lagrangian, CPO, Lyapunov, risk gate와 제동
  margin은 서로 다른 시각적 책임을 갖는다.
- Lab control은 44px 이상이며 360, 390, 768, 1440px에서 잘리거나 내부
  가로 스크롤을 만들지 않는다.
- `BeginnerOpening`이 첫 `QuestionLead`보다 앞서고, 첫 질문은 기술 약어
  없이 이해할 수 있어야 한다.
