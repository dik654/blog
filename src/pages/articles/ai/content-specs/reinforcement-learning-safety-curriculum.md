# Safety & Constrained RL content specification

## Reader contract

이 글은 “충돌에 음의 보상을 주면 안전하다”를 해체하고, 다음 세 질문을 서로 다른 증거 층으로 답하게 한다.

1. 어떤 policy가 expected safety budget을 만족하는가: CMDP, Lagrangian, CPO, Lyapunov.
2. 학습 중 각 update가 budget 근처에서 얼마나 안정적인가: feasible start, local surrogate, sample error.
3. 배포 중 위험 action이 actuator까지 가지 않게 누가 가로채는가: risk critic, recovery policy, hardware interlock.

## Private hardest problem

과수원 robot은 100 step 동안 row를 따라가며, action은 `fast`, `slow`, `stop`이다. Task reward는 각각 `10, 6, 1`, 한 step의 collision probability estimate는 `0.012, 0.002, 0.0001`이다. Expected collision-count budget은 `d=0.3`이다. Offline data에는 정상 주행 50,000 transition과 collision 근처 800 transition이 있다. Safety critic은 validation AUROC 0.97이지만 time-to-collision 300ms 이하 구간에서 false negative rate가 11%다. Recovery controller의 braking time은 420ms다.

본문만 읽은 독자는 다음을 해결해야 한다.

- `fast`만 실행할 때 expected collision count와 한 번 이상 collision할 확률을 각각 계산하고 둘이 다른 요구사항임을 설명한다.
- Fixed penalty lambda 하나가 task success와 budget satisfaction을 동시에 보장하지 않는 반례를 만든다.
- CPO objective의 `g`, `b`, `c`, `H`, `delta`를 이 robot log에서 어떤 estimator로 얻을지 말한다.
- Initial policy가 budget을 넘을 때 reward update보다 recovery direction이 먼저 필요한 이유를 설명한다.
- Lyapunov local feasible set을 만들기 위해 필요한 feasible baseline과 stopping-time 가정을 확인한다.
- AUROC가 높아도 실제 shield가 안전하지 않은 이유를 false-negative location과 braking horizon으로 진단한다.
- Learned recovery보다 먼저 적용할 speed cap, geofence, watchdog, emergency stop을 배치한다.

## Source intent ledger

| Source | Author intent | What the prose may claim | What it must not claim |
|---|---|---|---|
| Altman 1999 CMDP | Reward objective와 expected cumulative cost constraints를 하나의 decision problem으로 형식화 | Reward와 cost budget을 분리하는 수학적 기반 | 개별 trajectory의 무사고 또는 deep RL의 practical stability |
| Achiam et al. 2017 CPO | Average-divergence performance bound에서 practical trust-region CMDP update를 유도 | Near-constraint satisfaction, local surrogate, CPO vs PDO/FPO evidence | Neural implementation에서 zero violation 또는 hard real-time guarantee |
| Chow et al. 2018 | Lyapunov function으로 global safety constraint를 local linear policy constraints로 변환 | Feasible baseline·transient CMDP 아래 consistent feasibility의 원리 | Arbitrary unsafe initialization, inaccurate function approximation에서도 무조건 안전 |
| Thananjeyan et al. 2021 | Offline violation data와 task/recovery policy 분리로 robot exploration의 violation을 줄임 | Safety critic gate, recovery set, action relabeling, reported empirical tradeoff | Formal safety guarantee, critic 경고 뒤 recovery가 항상 성공한다는 주장 |

## Prose-to-viz contract

- Safety Budget Lab: expected count와 `P(any violation)`을 한 화면에 두고 budget feasibility와 chance safety를 혼동하지 않게 한다.
- Dual Pressure Lab: lambda slider 하나가 `fast -> slow -> stop` ranking을 바꾸되 budget을 직접 enforce하지 않는 것을 보인다.
- CPO Local Step Lab: 1D slice에서 reward 방향, safety half-space와 KL trust interval을 동시에 계산한다. `g=1, b=.6, H=1, c=.04, delta=.08`이면 trust limit은 `.4`, safety upper bound는 `-.0667`, 선택 step은 `-.067`이다. `delta=.001`이면 recovery boundary가 trust interval 밖이라 local problem이 infeasible하다.
- Lyapunov Slack Lab: `fast` local backup `1.30`, `slow` backup `1.12`, current `L(s)=1.20`을 고정한다. Fast probability `.25`이면 mixture backup `1.165`, slack `.035`; `.60`이면 backup `1.228`, slack `-.028`이다.
- Recovery Timing Lab: risk gate와 physical recovery 가능성을 직렬로 둔다. 기본 `Q_risk=.74`, threshold `.30`, TTC `300ms`, detection `60ms`, handoff `20ms`, braking `420ms`이면 gate는 켜지지만 margin은 `-200ms`다. TTC `700ms`에서는 `+200ms`, risk `.18`에서는 task action이 그대로 실행된다.
- Step Viz: `cost contract -> on-policy estimate -> constrained update -> risk gate -> recovery/hardware`의 실행 순서를 유지한다.
- 수식은 모든 underbrace 설명을 한국어로 렌더하고, 모바일에서 의미 단위별 행으로 나눈다.
- 빨간색은 실제 violation 또는 보장 경계에만 쓰고, 일반 data flow는 teal, blue, violet을 분산 사용한다.

## Formula contract

Display equation 10개와 FormulaNote 10개가 다음 책임을 가진다.

1. Expected count와 any-event probability는 독립 Bernoulli 교육용 반례임을 밝힌다.
2. CMDP objective는 expected cumulative reward와 cost budget을 분리한다.
3. Lagrangian은 fixed price와 learned multiplier의 역할을 설명하되 iterate safety로 과장하지 않는다.
4. CPO QCQP는 reward gradient, current gap, cost gradient와 KL curvature를 local approximation으로 읽는다.
5. CPO true-cost upper bound는 budget 뒤 residual term이 남음을 보인다.
6. Lyapunov function set은 feasible baseline의 Bellman inequality와 initial budget을 함께 요구한다.
7. Local feasible set은 candidate policy의 one-step cost backup이 state budget을 늘리지 않는 조건이다.
8. Recovery risk critic은 binary terminal gate와 discounted future risk를 분리한다.
9. Composite policy는 proposed task action과 executed recovery action을 구분한다.
10. Timing margin은 detection, handoff와 braking latency를 TTC에서 빼며 learned risk score와 다른 물리 단위임을 명시한다.

## Publication QA

- 모든 display math가 KaTeX로 렌더되고 raw backslash가 보이지 않는다.
- 360px에서 document overflow와 formula horizontal scroll이 0이다.
- Safety Budget Lab의 slider를 움직일 때 expected cost와 event probability가 독립적으로 갱신된다.
- Dual Pressure Lab은 lambda `4/20/150`에서 각각 fast/slow/stop 선택을 재현한다.
- CPO Lab은 over-budget recovery, too-small trust region의 infeasible 상태와 within-budget reward step을 재현한다.
- Lyapunov Lab은 fast mixture probability `.25/.60`의 positive/negative slack을 재현한다.
- Recovery Lab은 late trigger, recoverable trigger와 risk false negative를 서로 다른 상태로 표시한다.
- Display equation 10개, FormulaNote 10개, missing Korean annotation 0을 검사한다.
- 390, 768, 1440px에서 document, formula와 모든 Viz overflow가 1px 이하이고 formula font가 12px 이상이다.
- Step Viz 5개 장면이 play, next, reset으로 전환되고 stage 높이가 흔들리지 않는다.
- CPO, Lyapunov, Recovery RL 논문 글은 저자 의도, evidence, assumption, failure와 next reading을 모두 포함한다.
- “보장” 표현은 expectation, iteration, approximation, runtime 중 어느 층인지 문장 안에서 밝힌다.
