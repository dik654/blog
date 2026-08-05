# Model-based RL · World Models content spec

## Direct entry contract

첫 화면은 environment model, validation loss, policy, state와 rollout을
알고 있다고 가정하지 않는다. 교차로마다 위치를 조금씩 틀리게 표시하는
지도를 먼저 보여 주고, 한 단계 예측을 여러 번 이어 쓰면 작은 오차가 긴
계획에서 커진다는 장면을 만든다. 그 뒤에만 현재 상황과 행동에서 다음
상황을 예측하는 규칙을 `환경 모형`, 그 안에서 후보 행동을 비교하는 일을
`계획`이라고 부른다.

첫 질문은 “다음 한 장면을 잘 맞히면 긴 계획도 믿을 수 있는가”여야 한다.
독자는 이 질문과 1차 답을 기술 용어 없이 이해한 다음 one-step loss,
planning horizon, model exploitation과 real-return gap으로 내려간다.

## Reader contract

이 글을 끝낸 독자는 “world model이 미래를 예측한다”를 반복하는 대신 다음을 실행할 수 있어야 한다.

1. 실제 transition, learned-model transition, search target과 imagined trajectory의 증거 출처를 구분한다.
2. Dyna의 planning update 수가 정확한 target과 stale target을 모두 빠르게 value에 새긴다는 것을 계산한다.
3. One-step prediction error와 H-step rollout error, optimized-policy predicted return과 real return을 다른 지표로 측정한다.
4. World Models의 V·M·C, MuZero의 h·g·f, Dreamer의 posterior·prior·actor·critic이 소비하는 input과 target을 추적한다.
5. Terminal 또는 continue prediction이 imagined lambda-return을 어디서 끊는지 역산한다.

## Minimum source cutoff

- Sutton, *Integrated Architectures for Learning, Planning, and Reacting*: real experience, model learning과 incremental planning의 Dyna 경계.
- Ha and Schmidhuber, *World Models*: VAE V, MDN-RNN M, compact C, z versus z+h, dream transfer와 model exploitation.
- Schrittwieser et al., *MuZero*: representation h, recurrent dynamics g, prediction f, reward·search policy·value targets와 reconstruction-free planning.
- Hafner et al., *DreamerV3*: RSSM posterior and prior, reward and continuation heads, imagined actor-critic와 bootstrapped lambda-return.

이 네 원문 이전의 model-based control 역사를 필수 경로로 계속 확장하지 않는다. Action-time CEM·MPC와 physical release evidence는 `world-model-planning-closed-loop`가 소유한다. 현재 글은 RL 학습 target과 imagined data의 소유권을 설명한다.

## Claim boundaries

- Planning update는 새 현실 data가 아니라 현재 model assumption을 다시 쓰는 compute다.
- Scalar Dyna Lab은 고정 target에 대한 반복 TD backup을 격리한 정확한 계산이다. 일반 nonlinear Q-learning convergence 증명이 아니다.
- `Delta x = .5 b H^2`는 한 model step을 1초로 둔 `Δt=1s` 교육용 계산에서 일정 acceleration bias를 둔 반례다. Neural world model의 보편적 rollout-error bound가 아니다.
- World Models의 temperature는 특정 dream artifact exploit을 줄인 원 논문의 장치다. Calibration이나 real safety 보장이 아니다.
- MuZero가 reconstruction target을 생략해도 dynamics를 전혀 학습하지 않는다는 뜻은 아니다. Planning target에 필요한 latent transition을 학습한다.
- Dreamer의 continue head는 learned prediction이다. 수식에서 future를 차단하더라도 잘못 예측한 terminal은 imagined return을 오염시킨다.

## Private transfer problem

한 물류 로봇의 좁은 통로 shortcut은 과거에는 reward target 5였지만 선반 이동 뒤 실제 target이 0이 되었다. 기존 Q는 5이며 실제 transition 한 번과 learning rate .2 때문에 Q가 4로 내려갔다. Model은 아직 옛 target 5를 보관한다.

1. Planning update `n=0,5,50` 뒤 `Q_n = y_hat + (Q_0-y_hat)(1-alpha)^n`을 계산한다. Stale model에서는 `4.00, 4.67, 5.00`, refreshed target 0에서는 `4.00, 1.31, 0.00`이 된다.
2. 한 model step을 `Δt=1s`로 두고 acceleration bias `.04m/s²`, horizon 12에서 one-step position error `.020m`, H-step error `2.88m`, amplification `144x`를 계산하고 이것이 보편적 neural error bound가 아닌 이유를 설명한다.
3. World Models에서 V의 reconstruction, M의 next-latent distribution과 done, C의 reward objective가 서로 다른 data와 target을 쓰는 이유를 쓴다. Controller가 decoded next frame이 아니라 z+h를 받는 이유도 포함한다.
4. MuZero depth 1~3의 action과 실제 reward, MCTS visit policy, bootstrapped value target을 h·g·f의 output에 대응시킨다. Pixel target이 없어도 search 가능한 이유와 safety variable이 사라질 수 있는 경계를 설명한다.
5. Dreamer imagined rewards `[1,2,5]`, values `[2,1.5,1,4]`, gamma `.9`, lambda `.8`, continue `[1,1,0]`에서 `R2=5.00`, `R1=5.87`, `R0=5.59`를 역산한다. `c2=1`로 잘못 예측하면 `R0=7.17`이 되어 actor가 존재하지 않는 미래를 높게 평가하는 경로를 설명한다.
6. 최종 선택에서 Dyna, World Models, MuZero, Dreamer를 인기 순서로 고르지 않는다. Model target, action-time search 필요성, real data cost, terminal/contact coverage, compute budget과 predicted-to-real gap으로 baseline을 선택한다.

문제 문장은 본문에 그대로 노출하지 않는다. 각 답은 prose, formula, interactive Lab, capability check와 Playwright oracle에 일대일 대응한다.

## Narrative order

1. **Model contract.** Value prediction과 action-conditioned transition, planning과 imagination을 분리한다.
2. **Dyna.** Real transition 하나가 direct value update와 model fit을 동시에 만들고, model-generated transition이 같은 backup을 재사용한다.
3. **Staleness.** 환경 변화 뒤 stale target에 planning compute를 늘리면 실제 교정이 지워지는 수치를 먼저 본다.
4. **Horizon bias.** One-step error, open-loop multi-step error와 optimized-policy real-return gap을 분리한다.
5. **World Models.** V·M·C를 model별 이름 표가 아니라 input→target→consumer→failure 순서로 재구성한다.
6. **MuZero.** h·g·f와 replay reward·MCTS policy·bootstrapped value target을 depth별로 연결한다.
7. **Dreamer.** Replay posterior를 anchor로 삼아 prior imagination, reward·continue, critic bootstrap과 actor update로 간다.
8. **Decision audit.** Target, horizon, policy, safety 네 evidence를 독립적으로 확인한다.

## Formula contract

Display equation은 10개다.

1. Model fit and generated transition
2. Simulated Q backup
3. Repeated scalar backup closed form
4. Constant acceleration-bias horizon error
5. World Models latent distribution
6. World Models compact controller
7. MuZero h·g·f unroll
8. MuZero reward·value·policy loss
9. Dreamer posterior/prior state
10. Dreamer lambda-return

각 식은 한국어 내부 annotation과 바로 아래 FormulaNote를 가진다. 390px에서 annotation을 12px 미만으로 축소하거나 내부 horizontal scroll로 숨기지 않는다.

## Visual contract

- 기존 `WorldModelSequenceViz`는 real evidence → direct/model fit → imagination → simulated backup → real-return gap의 시간 흐름을 정확히 담당하므로 유지한다.
- `DynaStalenessLab`은 정확한 scalar recurrence만 표시하고 percentage accuracy로 imagined update를 맞음·틀림 count로 나누지 않는다.
- `MuZeroTargetTrace`는 depth별 target source를 보여 주며 reconstructed image를 암시하지 않는다.
- `DreamerReturnLab`은 posterior anchor와 prior rollout을 색과 공간으로 구분하고 terminal toggle이 실제 수치를 바꾼다.
- 선은 정보 흐름에만 사용하고, 장식용 connector와 과도하게 두꺼운 stroke를 넣지 않는다.
- 390, 768, 1440px에서 document, formula와 각 Viz의 overflow가 1px 이하다.

## Browser verification

- Display formula 10개, FormulaNote 10개, missing annotation 0, article table 0.
- Dyna stale `n=5` Q `4.67`, stale `n=50` Q `5.00`, refreshed `n=5` Q `1.31`, refreshed `n=50` Q `0.00`.
- Model bias 기본 `0.020m`, `2.88m`, `144x`; horizon 20이면 `8.00m`, `400x`.
- MuZero depth 1과 3에서 action, reward, policy와 value target이 바뀐다.
- Dreamer terminal lambda `.8`에서 `R0 5.59`, no-terminal에서 `R0 7.17`, lambda 0 terminal에서 `R0 2.80`.
- 기존 animation 하나가 유지되고 reduced-motion 계약을 그대로 사용한다.
- Console error와 page error가 없다.
- `BeginnerOpening`이 첫 `QuestionLead`보다 먼저 렌더링되고 390px 첫 화면에서
  일상 장면과 첫 절 제목이 확인된다.
