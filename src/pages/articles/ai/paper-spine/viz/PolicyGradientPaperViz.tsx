import {
  Activity,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const reinforceScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Stochastic action owner',
    title: 'Policy는 정답 행동을 출력하지 않고 행동별 확률을 만든 뒤 하나를 표본화한다',
    body: '같은 state에서도 여러 action이 나올 수 있어야 결과 차이와 행동 확률의 상관을 관측할 수 있다. Reward를 받기 전에는 어느 sample이 좋았는지 알 수 없다.',
    icon: Network,
    layout: 'tree',
    items: [
      {
        label: '현재 입력',
        value: 's · 같은 입력',
        detail: 'Policy가 읽는 조건이며 아직 reward는 없다.',
        tone: 'cyan',
      },
      {
        label: '왼쪽 후보',
        value: 'πθ(a₁|s)=0.55',
        detail: '확률을 출력하지만 이번에 실행되지 않을 수도 있다.',
        tone: 'violet',
      },
      {
        label: '정지 후보',
        value: 'πθ(a₂|s)=0.30',
        detail: 'Counterfactual 후보에는 직접 reward label이 붙지 않는다.',
        tone: 'muted',
      },
      {
        label: '오른쪽 후보',
        value: 'πθ(a₃|s)=0.15',
        detail: '표본화되면 environment가 실제 결과를 만든다.',
        tone: 'gold',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{p_k}_{\text{행동 }k\text{의 확률}}
      &=
      \pi_\theta(a_k\mid s),
      \qquad k\in\{1,2,3\}\\[3pt]
      \underbrace{a}_{\text{실제로 실행할 한 행동}}
      &\sim
      \underbrace{\pi_\theta(\cdot\mid s)}_{\text{현재 policy 분포}}
    \end{aligned}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{p_k}_{\text{후보 확률}}&=\pi_\theta(a_k\mid s)\\[3pt]
      \underbrace{a}_{\text{실행 표본}}&\sim\pi_\theta(\cdot\mid s)
    \end{aligned}`,
    formulaNote: '확률 vector와 실제 action sample은 다른 artifact다. Update는 모든 후보의 가상 reward가 아니라 실제로 뽑혀 실행된 action의 log-probability를 사용한다.',
    callout: 'REINFORCE의 탐색은 별도 argmax 규칙이 아니라 stochastic policy 자체에서 나온다. Deterministic action만 내면 결과와 확률 변화의 상관을 이 방식으로 추정할 수 없다.',
    owner: 'Stochastic policy πθ',
    output: 'action probabilities · sampled action a',
    invariant: 'probability vector and executed sample stay distinct',
  },
  {
    eyebrow: '02 · Environment evidence',
    title: '환경을 미분하지 않고 실행 결과에서 scalar reinforcement만 돌려받는다',
    body: 'Action 뒤의 transition은 simulator, 사람, 물리 세계처럼 미분할 수 없는 과정이어도 된다. Policy가 받은 증거는 선택한 action 뒤 실제로 관측한 reinforcement다.',
    icon: Activity,
    layout: 'flow',
    items: [
      {
        label: '실행',
        value: 'env.step(a)',
        detail: 'Sample된 action만 바깥 세계에 적용',
        tone: 'gold',
      },
      {
        label: 'Black-box 전이',
        value: 's → outcome',
        detail: '환경 Jacobian이나 dynamics model을 요구하지 않음',
        tone: 'violet',
      },
      {
        label: '관측 증거',
        value: 'reinforcement R',
        detail: '좋고 나쁨을 압축한 scalar sample',
        tone: 'green',
      },
      {
        label: '미관측 대안',
        value: 'R(a′) = unknown',
        detail: '실행하지 않은 action의 counterfactual 결과는 없음',
        tone: 'red',
      },
    ],
    formula: String.raw`\underbrace{a\sim\pi_\theta(\cdot\mid s)}_{\text{policy가 만든 표본}}
      \xrightarrow{\ \text{미분하지 않는 환경}\ }
      \underbrace{R}_{\text{실제로 관측한 강화 신호}}`,
    formulaNote: 'Gradient가 통과하는 곳은 policy의 확률 계산뿐이다. Environment transition과 reward 생성 과정을 backpropagation graph에 넣지 않는다.',
    callout: 'Model-free는 결과의 원인을 모른다는 뜻이 아니라, update에 environment derivative가 필요 없다는 뜻이다. 그 대가로 같은 policy에서 여러 sample을 모아 평균 방향을 추정해야 한다.',
    owner: 'Environment or evaluator',
    output: 'observed reinforcement R for executed a',
    invariant: 'unexecuted actions have no observed reward',
  },
  {
    eyebrow: '03 · Characteristic eligibility',
    title: '선택의 책임은 reward 미분이 아니라 sampled action의 log-probability 기울기에서 나온다',
    body: 'Log를 쓰면 trajectory probability의 곱이 시간별 합으로 바뀌고, 선택한 action 확률을 parameter가 어느 방향으로 바꾸는지 국소적으로 계산할 수 있다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      {
        label: '선택 기록',
        value: 'log πθ(a|s)',
        detail: '실행한 action의 현재 log-likelihood',
        tone: 'cyan',
      },
      {
        label: 'Local derivative',
        value: 'eθ = ∇θ log πθ',
        detail: '이번 선택을 만든 parameter 책임',
        tone: 'violet',
      },
      {
        label: '결과 중심화',
        value: 'R − b',
        detail: '비교 기준보다 좋았는지 나빴는지',
        tone: 'gold',
      },
      {
        label: 'Policy 이동',
        value: 'Δθ = α(R−b)eθ',
        detail: '좋은 sample 확률은 올리고 나쁜 sample은 낮춤',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{e_\theta}_{\text{선택의 parameter 책임}}
      &=
      \underbrace{\nabla_\theta\log\pi_\theta(a\mid s)}_{\text{실행 action의 log-prob 기울기}}\\[3pt]
      \underbrace{\Delta\theta}_{\text{policy parameter 변화}}
      &=
      \underbrace{\alpha}_{\text{학습률}}\,
      \underbrace{(R-b)}_{\text{기준 대비 결과}}\,
      \underbrace{e_\theta}_{\text{선택 책임}}
    \end{aligned}`,
    formulaNote: 'R 자체를 θ로 미분하지 않는다. R은 sampled outcome의 weight이고, 실제 미분 대상은 πθ(a|s)다. 같은 positive reward라도 baseline보다 낮으면 선택 확률을 내리는 방향이 될 수 있다.',
    callout: 'Eligibility는 “그 action이 좋은 이유”가 아니라 “그 action을 더 자주 만들려면 parameter를 어느 방향으로 움직여야 하는가”를 말한다.',
    owner: 'Autodiff on sampled log-probability',
    output: 'reinforcement-weighted policy gradient sample',
    invariant: 'reward is a weight, not a differentiated path',
  },
  {
    eyebrow: '04 · Baseline cancellation',
    title: 'Action과 무관한 baseline은 평균 gradient를 바꾸지 않고 sample 흔들림을 줄인다',
    body: '같은 state에서 모든 action에 같은 b를 빼면 score function의 기대가 0이어서 baseline 항이 상쇄된다. 현재 sampled action에 따라 b를 바꾸면 이 cancellation이 깨질 수 있다.',
    icon: Gauge,
    layout: 'compare',
    items: [
      {
        label: 'Baseline 없음',
        value: 'R · ∇ log π',
        detail: 'Reward offset까지 gradient scale에 들어와 흔들림이 큼',
        tone: 'red',
        metric: 'high variance',
      },
      {
        label: '허용 baseline',
        value: '(R−b(s)) · ∇ log π',
        detail: 'State 난이도는 빼되 현재 action sample에는 의존하지 않음',
        tone: 'green',
        metric: 'same mean direction',
      },
      {
        label: '위험 baseline',
        value: 'b(s,a) without correction',
        detail: 'Action별로 다른 항이 남아 expected update를 바꿀 수 있음',
        tone: 'red',
        metric: 'possible bias',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{B(s)}_{\text{baseline의 평균 항}}
      &=
      \mathbb E_{a\sim\pi_\theta}
      \!\left[b(s)\nabla_\theta\log\pi_\theta(a\mid s)\right]\\[3pt]
      &=
      b(s)\nabla_\theta
      \underbrace{\sum_a\pi_\theta(a\mid s)}_{\text{확률 합은 }1}\\[3pt]
      &=
      \underbrace{0}_{\text{평균 update 방향 보존}}
    \end{aligned}`,
    formulaNote: '상쇄 조건은 현재 action에 대해 같은 baseline이라는 점이다. State-dependent value baseline은 가능하지만 action-dependent control variate는 별도 보정 없이 같은 결론을 쓸 수 없다.',
    callout: 'Baseline은 reward를 바꾸는 새 목표가 아니라 gradient estimator의 control variate다. Mean reward가 언제나 variance-minimizing baseline이라는 뜻도 아니다.',
    owner: 'Baseline estimator independent of current action',
    output: 'centered reinforcement R−b',
    invariant: 'baseline contribution has zero expected score',
  },
  {
    eyebrow: '05 · Theorem and transfer boundary',
    title: '1992년 정리의 기대 방향과 현대 trajectory REINFORCE를 같은 보장으로 과장하지 않는다',
    body: '원 논문의 중심 정리는 associative immediate-reinforcement task에서 평균 update가 기대 reinforcement의 gradient와 정렬됨을 보인다. 지연 보상은 제한된 episodic 형태로 확장된다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '원 논문이 지지',
        value: 'Expected update가 expected reinforcement 증가 방향과 정렬',
        detail: '공통 positive rate factor에서는 gradient에 정확히 비례하는 unbiased sample을 얻음',
        tone: 'green',
      },
      {
        label: '원 논문이 지지하지 않음',
        value: '한 trajectory가 정확하거나 finite batch variance가 작음',
        detail: 'Unbiasedness는 빠른 수렴, global optimum, 안정적인 한 번의 update 보장이 아님',
        tone: 'red',
      },
      {
        label: '현대적 확장',
        value: '각 action에 이후 return-to-go Gₜ를 연결',
        detail: 'Trajectory likelihood-ratio 표기로 긴 episodic credit을 구성',
        tone: 'green',
      },
      {
        label: '다음 병목',
        value: '긴 horizon에서 credit noise가 누적',
        detail: 'Critic과 GAE가 baseline과 horizon mixture를 더 정교하게 다룸',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{g_t}_{\text{시점 }t\text{의 기여}}
      &=
      \underbrace{G_t}_{\text{행동 뒤 return}}\,
      \underbrace{\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{선택 책임}}\\[3pt]
      \underbrace{\nabla_\theta J(\theta)}_{\text{기대 return 기울기}}
      &=
      \mathbb E_{\tau\sim\pi_\theta}
      \!\left[\sum_t g_t\right]
    \end{aligned}`,
    formulaNote: '이 식은 원 논문의 score-function 원리를 현대 trajectory 표기로 연결한 것이다. 원문이 임의의 장기 MDP, critic, trust region, PPO까지 이미 증명했다는 뜻은 아니다.',
    callout: 'REINFORCE의 핵심 유산은 “reward를 미분한다”가 아니라 “sample probability의 log derivative로 black-box outcome의 기대값을 미분한다”는 점이다.',
    owner: 'Paper claim reviewer',
    output: 'gradient identity · delayed-credit transfer limit',
    invariant: 'expected direction is not finite-sample convergence',
  },
];

const gaeScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Freeze rollout provenance',
    title: 'Advantage를 만들기 전에 rollout policy와 critic snapshot을 먼저 고정한다',
    body: '현재 policy로 trajectory를 모으고 같은 시점의 value estimate를 저장한다. GAE를 계산하는 중간에 policy나 critic을 먼저 바꾸면 하나의 estimator 안에 서로 다른 model version이 섞인다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      {
        label: '수집 policy',
        value: 'πθᵢ',
        detail: 'State와 action을 만든 on-policy owner',
        tone: 'cyan',
      },
      {
        label: '실제 rollout',
        value: 'sₜ,aₜ,rₜ,dₜ',
        detail: 'Environment에서 순서대로 관측한 기록',
        tone: 'green',
      },
      {
        label: 'Critic snapshot',
        value: 'Vφᵢ(sₜ)',
        detail: 'Policy update 전에 모든 state value 저장',
        tone: 'violet',
      },
      {
        label: '고정 batch',
        value: 'Bᵢ',
        detail: 'Advantage 계산 동안 provenance 불변',
        tone: 'gold',
      },
    ],
    formula: String.raw`\underbrace{\mathcal B_i}_{\text{고정 rollout}}
      =
      \left\{
      \underbrace{s_t,a_t,r_t,d_t}_{\text{환경 기록}},
      \underbrace{V_{\phi_i}(s_t)}_{\text{update 전 critic 값}}
      \right\}_{t=0}^{T-1}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{\mathcal B_i}_{\text{고정 rollout}}&=\{s_t,a_t,r_t,d_t,V_i(s_t)\}\\[3pt]
      \underbrace{V_i}_{\text{update 전 critic}}&=V_{\phi_i}
    \end{aligned}`,
    formulaNote: '원 논문의 실험 절차는 Vφᵢ로 advantage를 만든 뒤 policy θᵢ₊₁을 계산하고, 그 다음 critic φᵢ₊₁을 fit한다. 새 critic으로 같은 batch advantage를 소급해 다시 쓰지 않는다.',
    callout: 'GAE는 replay buffer를 섞는 off-policy estimator가 아니다. 이 논문의 기본 계약은 update 직전 policy가 만든 rollout과 그 시점 critic의 결합이다.',
    owner: 'On-policy collector + critic snapshot',
    output: 'immutable rollout batch Bᵢ',
    invariant: 'θᵢ and φᵢ provenance stay fixed during estimation',
  },
  {
    eyebrow: '02 · One-step surprise',
    title: 'TD residual은 실제 한-step reward와 critic의 두 value를 결합한 local surprise다',
    body: '현재 action 뒤 실제 reward를 받고 다음 state value를 bootstrap한 뒤 현재 value를 뺀다. 따라서 δ는 순수 관측도, 순수 critic 출력도 아닌 혼합 target이다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      {
        label: '현재 기준',
        value: 'Vφ(sₜ)',
        detail: 'Action 전 critic이 예상한 평균 return',
        tone: 'muted',
      },
      {
        label: '실제 증거',
        value: 'reward rₜ',
        detail: 'Environment가 action 뒤 돌려준 값',
        tone: 'green',
      },
      {
        label: '미래 추정',
        value: 'γmₜVφ(sₜ₊₁)',
        detail: '경계가 아니면 다음 value를 bootstrap',
        tone: 'violet',
      },
      {
        label: '한-step 잔차',
        value: 'δₜ = target − Vφ(sₜ)',
        detail: '평균 예측보다 좋고 나빴던 local 신호',
        tone: 'gold',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{m_t}_{\text{bootstrap mask}}
      &=1-\underbrace{d_t}_{\text{실제 terminal}}\\[3pt]
      \underbrace{v_{t+1}}_{\text{허용된 미래값}}
      &=m_tV_\phi(s_{t+1})\\[3pt]
      \underbrace{y_t}_{\text{한 step 표적}}
      &=\underbrace{r_t}_{\text{실제 보상}}+\gamma v_{t+1}\\[3pt]
      \underbrace{\delta_t^V}_{\text{TD 잔차}}
      &=y_t-\underbrace{V_\phi(s_t)}_{\text{현재 기준값}}
    \end{aligned}`,
    formulaNote: '실제 terminal이면 mₜ=0으로 미래값을 제거한다. Time-limit truncation은 환경이 끝난 것이 아니므로 별도 final observation이 있으면 bootstrap할 수 있어 둘을 같은 done으로 합치지 않는다.',
    callout: 'Critic이 정확할 때 δₜ는 action advantage의 unbiased one-step sample로 볼 수 있다. Critic error가 있으면 낮은 λ에서 그 error가 policy signal에 더 직접 들어간다.',
    owner: 'Reward record + frozen critic',
    output: 'one-step residual δₜ',
    invariant: 'terminal and truncation masks remain distinct',
  },
  {
    eyebrow: '03 · Mix credit horizons',
    title: 'GAE는 한 horizon을 고르는 대신 1-step부터 긴 return까지 지수적으로 섞는다',
    body: '미래 residual을 더 많이 포함할수록 critic bootstrap 의존은 줄지만 trajectory noise는 늘어난다. λ는 이 두 종류의 오차 사이에서 credit 길이를 선택한다.',
    icon: Sparkles,
    layout: 'bars',
    items: [
      {
        label: 'λ = 0.00',
        value: 'δₜ only',
        detail: 'One-step critic에 가장 강하게 의존하고 variance는 짧게 자름',
        tone: 'violet',
        metric: '12',
      },
      {
        label: 'λ = 0.50',
        value: 'δₜ + 0.5γδₜ₊₁ + …',
        detail: '가까운 미래 residual을 중심으로 혼합',
        tone: 'cyan',
        metric: '46',
      },
      {
        label: 'λ = 0.95',
        value: '긴 residual trace',
        detail: '현대 on-policy control에서 자주 쓰지만 task별 검증이 필요',
        tone: 'gold',
        metric: '84',
      },
      {
        label: 'λ = 1.00',
        value: 'return − V(sₜ)',
        detail: '올바른 episode 경계에서 Monte Carlo 형태로 telescoping',
        tone: 'green',
        metric: '100',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widehat A_t^{\mathrm{GAE}(\gamma,\lambda)}}_{\text{여러 길이의 advantage 혼합}}
      &=
      \underbrace{\delta_t^V}_{\text{지금 surprise}}
      +
      \underbrace{\gamma\lambda\,\delta_{t+1}^V}_{\text{한 step 뒤 credit}}\\[-1pt]
      &\quad+
      \underbrace{(\gamma\lambda)^2\delta_{t+2}^V+\cdots}_{\text{먼 residual은 지수 감쇠}}
    \end{aligned}`,
    formulaNote: '막대 길이는 실제 성능이 아니라 residual이 전달되는 상대적 credit horizon을 나타낸다. λ가 크다고 항상 더 좋거나 더 정확하다는 뜻이 아니다.',
    callout: 'GAE는 reward들을 그냥 평균내지 않는다. 먼저 value-shaped TD residual로 바꾼 뒤 그 residual의 시간 범위를 λ로 조절한다.',
    owner: 'GAE target constructor',
    output: 'advantage estimate Âₜ',
    invariant: 'lambda changes credit horizon, not rollout data',
  },
  {
    eyebrow: '04 · Backward recurrence and two knobs',
    title: '같은 weighted sum을 뒤에서 한 번 훑어 계산하되 γ와 λ의 역할은 합치지 않는다',
    body: '구현은 마지막 시점부터 residual을 접어 O(T)에 계산한다. γ는 어떤 미래 reward를 objective에 남길지, λ는 approximate critic을 쓸 때 residual을 얼마나 멀리 전달할지 정한다.',
    icon: RefreshCw,
    layout: 'compare',
    items: [
      {
        label: 'Discount γ',
        value: '미래 reward의 시간척도',
        detail: '논문의 undiscounted objective에 대해 γ<1 자체가 먼 효과를 버리는 bias를 도입',
        tone: 'cyan',
        metric: 'objective approximation',
      },
      {
        label: 'Trace λ',
        value: 'Residual credit의 시간척도',
        detail: 'Approximate V의 bias와 sampled trajectory variance 사이를 조절',
        tone: 'violet',
        metric: 'estimator mixture',
      },
      {
        label: 'Reverse scan',
        value: 'Âₜ = δₜ + γλmₜÂₜ₊₁',
        detail: '마지막부터 한 번 순회해 명시적 합과 같은 결과 계산',
        tone: 'green',
        metric: 'O(T)',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widehat A_T}_{\text{경계 뒤 credit}}&=0\\[3pt]
      \underbrace{\widehat A_t}_{\text{현재 action의 advantage}}
      &=
      \underbrace{\delta_t^V}_{\text{현재 TD 잔차}}
      +
      \underbrace{\gamma\lambda m_t\widehat A_{t+1}}_{\text{경계를 넘지 않는 미래 credit}}
    \end{aligned}`,
    formulaNote: 'Finite rollout이 실제 terminal이 아니라 truncation이면 마지막 V(sT)를 δT−1에 넣어 tail을 bootstrap해야 한다. ÂT=0은 residual recurrence의 끝이지 V(sT)=0이라는 뜻이 아니다.',
    callout: 'Advantage normalization은 이 계산 뒤 batch scale을 바꾸는 별도 처리다. Normalization을 GAE 정의나 λ의 역할로 섞지 않는다.',
    owner: 'Reverse-scan implementation',
    output: 'Â[0:T] with explicit boundary semantics',
    invariant: 'gamma, lambda, and boundary mask stay separate',
  },
  {
    eyebrow: '05 · Evidence and optimizer boundary',
    title: '좋은 locomotion 결과는 GAE, policy trust region, value trust region의 결합 증거다',
    body: '논문은 cart-pole에서 γ·λ sweep을 21개 seed로 비교하고, 3D locomotion에서는 제한된 λ 조건과 no-value 조건을 비교했다. Policy와 critic 모두 trust-region 절차를 사용했다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '원 논문이 지지',
        value: '중간 γ·λ가 cart-pole에서 빠른 개선을 보임',
        detail: 'γ 0.96–0.99, λ 0.92–0.99 부근이 해당 설정의 좋은 영역으로 보고됨',
        tone: 'green',
      },
      {
        label: '결합 시스템 증거',
        value: 'GAE + policy TRPO + value trust region으로 3D locomotion 학습',
        detail: 'Raw kinematics에서 torque를 내는 neural policy와 value function을 함께 사용',
        tone: 'green',
      },
      {
        label: '원 논문이 지지하지 않음',
        value: 'λ=0.95가 모든 환경의 보편 최적값',
        detail: '3D 실험은 compute 제약으로 γ=0.995와 제한된 λ 조건만 비교',
        tone: 'red',
      },
      {
        label: '남는 경계',
        value: 'GAE가 policy update 크기까지 자동 제한',
        detail: 'Estimator target과 trust-region optimizer는 다른 책임이며 PPO도 이후 별도 층',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widehat A_t}_{\text{GAE가 만든 방향 신호}}
      &\longrightarrow
      \underbrace{\widehat g}_{\text{policy gradient 추정}}\\[3pt]
      \underbrace{\theta_i\rightarrow\theta_{i+1}}_{\text{policy 이동 제한}}
      &\quad\text{is owned by }\underbrace{\mathrm{TRPO}}_{\text{별도 optimizer 계약}}
    \end{aligned}`,
    formulaNote: 'GAE는 action의 상대적 credit을 만든다. KL trust region은 그 신호를 따라 policy가 한 번에 얼마나 움직이는지 제한한다. 실험 성능을 GAE 한 요소에만 귀속하지 않는다.',
    callout: '다음 PPO 글에서는 같은 rollout을 여러 epoch 재사용할 때 old/new probability ratio와 clipping이 왜 필요한지 이어서 본다.',
    owner: 'Experiment and optimizer-boundary reviewer',
    output: 'lambda evidence · combined-system claim · limits',
    invariant: 'advantage estimator is not the policy optimizer',
  },
];

export function ReinforceMechanismViz() {
  return (
    <div data-policy-gradient-paper-viz="reinforce">
      <PaperSceneViz
        scenes={reinforceScenes}
        ariaLabel="REINFORCE · Stochastic action sample에서 expected policy gradient까지"
      />
    </div>
  );
}

export function GaeMechanismViz() {
  return (
    <div data-policy-gradient-paper-viz="gae">
      <PaperSceneViz
        scenes={gaeScenes}
        ariaLabel="GAE · 고정 rollout에서 advantage credit horizon과 evidence boundary까지"
      />
    </div>
  );
}
