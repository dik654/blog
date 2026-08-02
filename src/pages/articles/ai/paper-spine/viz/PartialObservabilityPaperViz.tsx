import {
  BrainCircuit,
  Database,
  EyeOff,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  Radar,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const pomdpScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Observation is not state',
    title: '같은 observation이 서로 다른 world state에서 올 수 있으면 현재 화면만으로 행동을 정할 수 없다',
    body: '복도 두 곳이 똑같이 보이거나 sensor가 junction을 혼동하면 observation은 latent state의 noisy evidence일 뿐이다. Observation-action mapping은 같은 모양에서 같은 행동을 반복해 deterministic loop에 빠질 수 있다.',
    icon: EyeOff,
    layout: 'compare',
    items: [
      {
        label: 'Latent state A',
        value: '북동쪽 4층 복도',
        detail: '직접 보이지 않는 실제 위치 후보',
        tone: 'cyan',
        metric: 's₁',
      },
      {
        label: 'Latent state B',
        value: '북동쪽 7층 복도',
        detail: '다른 위치지만 같은 모양을 낼 수 있음',
        tone: 'violet',
        metric: 's₂',
      },
      {
        label: 'Current observation',
        value: '“T자 복도”',
        detail: '두 state를 한 번에 구분하지 못하는 sensor evidence',
        tone: 'red',
        metric: 'same o',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{s_1\neq s_2}_{\text{서로 다른 실제 state}}
      &,\qquad
      \underbrace{o_t=o}_{\text{같은 현재 관측}}\\[3pt]
      \underbrace{\Pr(o\mid s_1)>0}_{\text{state 1도 설명}}
      &,\qquad
      \underbrace{\Pr(o\mid s_2)>0}_{\text{state 2도 설명}}
    \end{aligned}`,
    formulaNote: 'Observation이 같다는 사실은 state가 같다는 뜻이 아니다. 이전 action과 observation history가 다음 state 분포를 구분하는 추가 evidence가 된다.',
    callout: '부분 관측은 sensor noise만을 뜻하지 않는다. Sensor가 완벽해도 한 화면에 velocity, hidden card, 가려진 object처럼 decision에 필요한 변수가 없으면 POMDP다.',
    owner: 'Environment observation model',
    output: 'ambiguous evidence o',
    invariant: 'observation and latent state remain distinct',
  },
  {
    eyebrow: '02 · Belief as history summary',
    title: 'Action-observation history를 state 후보의 posterior distribution 하나로 압축한다',
    body: 'Belief는 가장 가능성 높은 state 하나가 아니라 모든 state 후보의 확률표다. 모델이 정확하면 current belief는 과거 history가 현재 state에 주는 정보를 보존하는 sufficient statistic이고 policy는 belief를 입력으로 받는다.',
    icon: BrainCircuit,
    layout: 'flow',
    items: [
      {
        label: 'Previous belief',
        value: 'bₜ(s)',
        detail: '이전 history까지 반영한 state 후보 확률',
        tone: 'cyan',
      },
      {
        label: 'Last action',
        value: 'aₜ',
        detail: '어떻게 world를 움직였는지 알려주는 원인',
        tone: 'violet',
      },
      {
        label: 'New observation',
        value: 'oₜ₊₁',
        detail: '이동 뒤 sensor가 준 likelihood evidence',
        tone: 'gold',
      },
      {
        label: 'Belief policy',
        value: 'aₜ₊₁ = π(bₜ₊₁)',
        detail: '불확실성의 모양까지 보고 다음 action 선택',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{H_t}_{\text{지금까지의 history}}
      &=(o_0,a_0,\ldots,a_{t-1},o_t)\\[3pt]
      \underbrace{b_t(s)}_{\text{state posterior}}
      &=\Pr(s_t=s\mid H_t)\\[3pt]
      \underbrace{a_t}_{\text{policy의 결정}}
      &=\pi(b_t)
    \end{aligned}`,
    formulaNote: 'Sufficient statistic이라는 말은 known POMDP model 아래 current-state inference와 expected-reward decision에 과거 raw history가 더 필요 없다는 뜻이다. Model misspecification까지 없애는 압축 보장은 아니다.',
    callout: 'MAP state 하나만 남기면 51:49와 99:1을 같은 확신으로 취급한다. Belief policy는 uncertainty 정도에 따라 sensing action과 task action을 다르게 고를 수 있다.',
    owner: 'State estimator + belief policy',
    output: 'posterior belief · selected action',
    invariant: 'probability mass, not one guessed state, is preserved',
  },
  {
    eyebrow: '03 · Bayesian state estimator',
    title: 'Action으로 prior를 먼저 이동시키고 observation likelihood로 고친 뒤 합을 1로 맞춘다',
    body: 'Belief update의 순서는 prediction, evidence weighting, normalization이다. Observation은 action 뒤 도착한 state가 만들므로 이전 belief에 바로 곱하지 않고 transition으로 next-state prior를 먼저 계산한다.',
    icon: RefreshCw,
    layout: 'flow',
    items: [
      {
        label: 'Predict',
        value: 'b̄(s′) = ΣₛT(s,a,s′)b(s)',
        detail: 'Action uncertainty로 probability mass 이동',
        tone: 'cyan',
      },
      {
        label: 'Weight',
        value: 'w(s′) = O(s′,a,o)b̄(s′)',
        detail: '실제 observation을 잘 설명하는 state 강조',
        tone: 'violet',
      },
      {
        label: 'Normalize',
        value: 'Z = Σₛ′w(s′)',
        detail: '이번 observation의 전체 probability mass',
        tone: 'gold',
      },
      {
        label: 'Posterior',
        value: 'b′(s′) = w(s′)/Z',
        detail: '합이 1인 다음 belief',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\bar b(s')}_{\text{action 뒤 prior}}
      &=\sum_sT(s,a,s')b(s)\\[3pt]
      \underbrace{w(s')}_{\text{관측을 반영한 mass}}
      &=O(s',a,o)\bar b(s')\\[3pt]
      \underbrace{Z}_{\text{전체 evidence mass}}
      &=\sum_{s'}w(s')\\[3pt]
      \underbrace{b'(s')}_{\text{정규화한 posterior}}
      &=w(s')/Z
    \end{aligned}`,
    formulaNote: 'Z가 0에 가깝다면 model이 실제 observation을 거의 불가능하다고 본다는 뜻이다. 작은 수로 억지 normalization하기 전에 observation model, numerical underflow, out-of-model event를 진단해야 한다.',
    callout: 'Prediction과 correction의 owner를 바꾸면 time index가 틀어진다. T는 action 뒤 state를 만들고 O는 그 resulting state가 observation을 낼 likelihood를 준다.',
    owner: 'Known transition and observation model',
    output: 'normalized posterior b′',
    invariant: 'predict before correct; posterior sums to one',
  },
  {
    eyebrow: '04 · Information has decision value',
    title: 'Tiger 문제의 listen은 즉시 reward보다 다음 결정을 더 정확하게 만드는 action이다',
    body: '두 문 중 어디에 tiger가 있는지 애매할 때 바로 열면 큰 손실 위험이 있다. Listen은 비용을 내고 observation distribution을 바꾸며, posterior가 충분히 한쪽으로 기울면 tiger 반대 문을 연다.',
    icon: Radar,
    layout: 'timeline',
    items: [
      {
        label: 'Uncertain belief',
        value: 'p(tiger left) ≈ 0.5',
        detail: '두 문을 바로 열기에는 손실 위험이 큼',
        tone: 'red',
      },
      {
        label: 'Listen',
        value: 'small immediate cost',
        detail: 'World를 크게 바꾸기보다 새 observation을 얻음',
        tone: 'gold',
      },
      {
        label: 'Posterior shift',
        value: 'p → 0 또는 p → 1',
        detail: 'Noisy evidence를 누적해 state 후보 분리',
        tone: 'violet',
      },
      {
        label: 'Task action',
        value: 'open safer door',
        detail: '정보가 충분할 때 높은 expected return 선택',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{Q(b,\text{listen})}_{\text{정보 action 가치}}
      &=\underbrace{R(b,\text{listen})}_{\text{즉시 비용}}
      +\gamma\mathbb E_o[V(b'_o)]\\[3pt]
      \underbrace{\pi^*(b)}_{\text{belief policy}}
      &=\arg\max_a Q(b,a)
    \end{aligned}`,
    formulaNote: 'Listen의 가치는 observation 자체에 보상 점수를 붙여서 생기는 것이 아니다. 그 observation이 posterior와 이후 action을 바꿔 미래 손실을 줄이는 효과가 Bellman value에 들어간다.',
    callout: 'POMDP는 sensing action과 world-changing action을 별도 종류로 강제하지 않는다. 하나의 action이 state와 observation 양쪽에 영향을 주며 expected long-term value가 둘을 함께 평가한다.',
    owner: 'Belief-space Bellman planner',
    output: 'information-aware action',
    invariant: 'information value is counted through future decisions',
  },
  {
    eyebrow: '05 · Alpha-vector geometry',
    title: '각 conditional policy tree는 belief 위의 한 평면이고 최적 가치는 그 upper envelope다',
    body: 'Policy tree는 root action과 observation별 다음 subtree를 정한다. True state별 return을 alpha vector에 담으면 belief value는 선형이고, 모든 tree 중 maximum은 finite horizon에서 piecewise-linear convex surface가 된다.',
    icon: Layers3,
    layout: 'boundary',
    items: [
      {
        label: '한 policy tree',
        value: 'αₚ(s): state별 return',
        detail: 'Belief와 내적하면 tree p의 expected value',
        tone: 'cyan',
      },
      {
        label: 'Upper envelope',
        value: 'V(b) = maxₚ b·αₚ',
        detail: 'Belief region마다 다른 tree가 최적',
        tone: 'green',
      },
      {
        label: '유용 vector 찾기',
        value: '유용한 belief region이 없는 vector 제거',
        detail: 'Exact backup에서 불필요한 policy tree를 줄임',
        tone: 'gold',
      },
      {
        label: '계산 경계',
        value: 'State·observation·horizon 증가 시 폭발',
        detail: 'Infinite horizon은 facet이 무한히 많을 수도 있음',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{V_p(b)}_{\text{tree }p\text{의 belief value}}
      &=\sum_s b(s)\alpha_p(s)\\[3pt]
      \underbrace{V_t^*(b)}_{\text{finite-horizon 최적 가치}}
      &=\max_{p\in\mathcal P_t}V_p(b)
    \end{aligned}`,
    formulaNote: 'Maximum of linear functions이므로 finite-horizon value는 piecewise-linear convex다. Infinite-horizon discounted value는 convex지만 exact representation에 facet이 무한히 필요할 수 있다.',
    callout: 'Witness algorithm이 모든 POMDP를 작게 만드는 것은 아니다. 논문도 modest discrete size에서 exact method가 impractical해질 수 있음을 명시한다.',
    owner: 'Exact planner + evidence reviewer',
    output: 'useful alpha vectors · claim ceiling',
    invariant: 'finite-horizon geometry is not a large-scale solver guarantee',
  },
];

const kalmanScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · State and measurement',
    title: 'Sensor가 position만 보여줘도 state에는 velocity처럼 미래를 설명할 hidden variable을 함께 둔다',
    body: '한 번의 position measurement만으로 움직임 방향을 알 수 없다. State-transition model은 previous estimate를 시간에 따라 옮기고, 여러 noisy measurement를 결합해 직접 측정하지 않은 velocity도 추정한다.',
    icon: EyeOff,
    layout: 'compare',
    items: [
      {
        label: 'Hidden state',
        value: 'x = [position, velocity]ᵀ',
        detail: 'Dynamics와 future measurement를 설명할 내부 변수',
        tone: 'cyan',
        metric: '2D state',
      },
      {
        label: 'Measurement',
        value: 'z = position + noise',
        detail: 'Sensor가 직접 내는 1차원 evidence',
        tone: 'violet',
        metric: '1D sensor',
      },
      {
        label: 'Ambiguity',
        value: '같은 위치, 다른 속도',
        detail: '현재 z 하나만으로 next position을 구분할 수 없음',
        tone: 'red',
        metric: 'history needed',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{x_k}_{\text{추정할 hidden state}}
      &=\begin{bmatrix}p_k\\v_k\end{bmatrix}\\[3pt]
      \underbrace{z_k}_{\text{sensor measurement}}
      &=\underbrace{H_kx_k}_{\text{state의 관측 가능 부분}}
      +\underbrace{v_k^{(m)}}_{\text{measurement noise}}
    \end{aligned}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{x_k}_{\text{숨은 상태}}&=[p_k\;v_k]^\top\\[3pt]
      \underbrace{z_k}_{\text{센서값}}&=H_kx_k+\underbrace{v_k^{(m)}}_{\text{측정 잡음}}
    \end{aligned}`,
    formulaNote: 'State vector는 sensor 값의 복사본이 아니라 future evolution과 measurement를 Markov하게 설명하도록 고른 변수다. State 정의가 빠뜨린 mode는 filter가 history만으로 복원할 수 없다.',
    callout: 'Kalman filter의 첫 설계 문제는 gain tuning이 아니라 state를 무엇으로 둘지다. Unobservable direction은 measurement를 오래 모아도 독립적으로 식별되지 않는다.',
    owner: 'State and measurement modeler',
    output: 'latent state contract · sensor evidence',
    invariant: 'measurement is not silently treated as full state',
  },
  {
    eyebrow: '02 · Predict mean and covariance',
    title: 'Dynamics로 평균만 옮기지 않고 uncertainty의 방향과 크기도 함께 전파한다',
    body: 'Previous posterior mean은 transition과 control input으로 next prior가 된다. Covariance는 F로 양쪽에서 변환하고 process noise Q를 더해 model이 설명하지 못한 disturbance까지 반영한다.',
    icon: RefreshCw,
    layout: 'flow',
    items: [
      {
        label: 'Posterior mean',
        value: 'x̂ₖ₋₁',
        detail: '이전 measurement까지 반영한 state estimate',
        tone: 'cyan',
      },
      {
        label: 'Dynamics',
        value: 'Fₖx̂ + Bₖu',
        detail: 'Known transition과 control input 효과',
        tone: 'violet',
      },
      {
        label: 'Covariance transport',
        value: 'FₖPₖ₋₁Fₖᵀ',
        detail: 'State axes가 섞이며 uncertainty ellipse도 회전·변형',
        tone: 'gold',
      },
      {
        label: 'Process noise',
        value: '+ Qₖ',
        detail: 'Unmodeled acceleration과 disturbance uncertainty 추가',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widehat x_k^-}_{\text{measurement 전 평균}}
      &=F_k\widehat x_{k-1}+B_ku_{k-1}\\[3pt]
      \underbrace{P_{\mathrm{dyn}}}_{\text{전파한 uncertainty}}
      &=F_kP_{k-1}F_k^\top\\[3pt]
      \underbrace{P_k^-}_{\text{measurement 전 covariance}}
      &=P_{\mathrm{dyn}}+\underbrace{Q_k}_{\text{process uncertainty}}
    \end{aligned}`,
    formulaNote: '위첨자 minus는 음수가 아니라 current measurement를 보기 전 prior라는 뜻이다. Q는 state에 임의 noise를 더하는 값이 아니라 model error의 covariance contract다.',
    callout: 'Q를 작게 두면 filter가 틀린 dynamics를 과신하고, 크게 두면 매 step model certainty를 빨리 잃는다. 같은 trajectory에서도 Q는 gain과 lag를 함께 바꾼다.',
    owner: 'Time-update model',
    output: 'prior mean x̂⁻ · prior covariance P⁻',
    invariant: 'mean and uncertainty cross the same dynamics boundary',
  },
  {
    eyebrow: '03 · Innovation in sensor space',
    title: '새 measurement 전체가 아니라 prediction이 이미 설명하지 못한 residual만 correction evidence로 쓴다',
    body: 'Predicted state를 H로 sensor space에 옮기고 actual measurement와 뺀 값이 innovation이다. 그 residual의 expected covariance S에는 state prediction uncertainty와 sensor noise가 함께 들어간다.',
    icon: Radar,
    layout: 'flow',
    items: [
      {
        label: 'Predicted sensor',
        value: 'ẑₖ = Hₖx̂ₖ⁻',
        detail: 'Prior state가 예상한 measurement',
        tone: 'cyan',
      },
      {
        label: 'Actual sensor',
        value: 'zₖ',
        detail: 'Current timestep의 raw measurement',
        tone: 'violet',
      },
      {
        label: 'Innovation',
        value: 'νₖ = zₖ − ẑₖ',
        detail: 'Prediction이 아직 설명하지 못한 새 evidence',
        tone: 'gold',
      },
      {
        label: 'Innovation covariance',
        value: 'Sₖ = HₖPₖ⁻Hₖᵀ + Rₖ',
        detail: 'Residual이 흔들릴 expected sensor-space scale',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widehat z_k}_{\text{예상 measurement}}
      &=H_k\widehat x_k^-\\[3pt]
      \underbrace{\nu_k}_{\text{innovation}}
      &=\underbrace{z_k}_{\text{실제 sensor}}
      -\widehat z_k\\[3pt]
      \underbrace{S_k}_{\text{innovation covariance}}
      &=H_kP_k^-H_k^\top+R_k
    \end{aligned}`,
    formulaNote: 'R이 크면 같은 residual도 noisy sensor에서 흔히 생길 수 있다. S가 singular하거나 condition이 나쁘면 inverse를 직접 계산하기보다 linear solve와 model observability를 점검한다.',
    callout: 'Innovation은 단순 오차 표시가 아니라 model과 sensor를 검증하는 runtime evidence다. Bias가 계속 남거나 scale이 S와 맞지 않으면 Q·R·state model 중 하나가 틀렸을 수 있다.',
    owner: 'Measurement residual builder',
    output: 'innovation ν · expected scale S',
    invariant: 'residual is evaluated in measurement coordinates',
  },
  {
    eyebrow: '04 · Gain and correction',
    title: 'State와 sensor의 covariance 관계로 residual을 어느 state direction에 얼마나 반영할지 정한다',
    body: 'Kalman gain은 scalar 평균 비율이 아니라 state-measurement cross covariance를 innovation covariance로 정규화한 matrix다. Mean correction 뒤 covariance도 함께 줄여 다음 timestep의 신뢰 계산에 반영한다.',
    icon: Gauge,
    layout: 'flow',
    items: [
      {
        label: 'Cross covariance',
        value: 'Pₖ⁻Hₖᵀ',
        detail: 'Sensor residual이 어떤 state direction과 연결되는지 표현',
        tone: 'cyan',
      },
      {
        label: 'Normalize',
        value: 'Sₖ⁻¹',
        detail: 'Innovation이 흔들릴 scale로 correction 크기 조절',
        tone: 'violet',
      },
      {
        label: 'Mean correction',
        value: 'x̂ₖ = x̂ₖ⁻ + Kₖνₖ',
        detail: '새 evidence를 state coordinates로 이동',
        tone: 'gold',
      },
      {
        label: 'Covariance correction',
        value: 'Pₖ = (I−KₖHₖ)Pₖ⁻',
        detail: 'Measurement가 설명한 uncertainty 감소',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{K_k}_{\text{matrix-valued trust}}
      &=P_k^-H_k^\top S_k^{-1}\\[3pt]
      \underbrace{\widehat x_k}_{\text{posterior mean}}
      &=\widehat x_k^-+K_k\nu_k\\[3pt]
      \underbrace{P_k}_{\text{posterior covariance}}
      &=(I-K_kH_k)P_k^-
    \end{aligned}`,
    formulaNote: '이 단순 covariance 식은 정확한 선형대수에서 동치다. Finite precision에서는 대칭성과 positive semidefinite 성질을 더 잘 보존하는 Joseph form 또는 square-root filter를 대조한다.',
    callout: 'State mean만 correction하고 P를 그대로 두면 다음 gain이 이미 얻은 정보를 모른다. Estimate와 uncertainty는 하나의 posterior state로 함께 버전이 바뀌어야 한다.',
    owner: 'Measurement-update filter',
    output: 'posterior mean x̂ · covariance P',
    invariant: 'mean correction and covariance correction commit together',
  },
  {
    eyebrow: '05 · Optimality and diagnostic boundary',
    title: '원 논문의 optimal은 알려진 선형 dynamics와 2차 통계 아래의 linear estimate 범위에서 읽는다',
    body: 'Kalman은 first-order state transition과 first·second moments로 optimal linear filter coefficient를 재귀적으로 얻었다. Gaussian이면 mean과 covariance가 posterior를 완전히 표현하지만 arbitrary nonlinear·multimodal world까지 같은 보장이 확장되지는 않는다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '원 논문이 지지',
        value: '정상·비정상 통계와 긴 memory를 한 covariance recursion으로 처리',
        detail: 'Machine computation에 맞는 state-transition formulation',
        tone: 'green',
      },
      {
        label: 'Linear optimality',
        value: '알려진 1·2차 통계 아래 optimal linear estimate',
        detail: 'Gaussian에서는 conditional distribution도 mean·covariance로 닫힘',
        tone: 'green',
      },
      {
        label: 'Runtime diagnostic',
        value: 'Innovation의 편향·크기·시간 상관',
        detail: 'Model과 Q/R consistency를 별도 검증',
        tone: 'gold',
      },
      {
        label: '입증하지 않음',
        value: '미지의 비선형 model, outlier 견고성, 다봉 posterior',
        detail: 'EKF·UKF·particle filter도 각각 새 approximation contract가 필요',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{R_k\uparrow}_{\text{sensor uncertainty 증가}}
      &\Longrightarrow
      \underbrace{K_k\downarrow}_{\text{sensor correction 감소}}\\[3pt]
      \underbrace{Q_k\uparrow}_{\text{model uncertainty 증가}}
      &\Longrightarrow
      \underbrace{P_k^-\uparrow}_{\text{prior confidence 감소}}
    \end{aligned}`,
    formulaNote: '화살표는 scalar intuition이다. Matrix에서는 direction별 eigenstructure와 H의 관측 가능 방향에 따라 gain이 달라진다. “Q가 크면 K가 항상 모든 원소에서 커진다”는 원소별 정리는 아니다.',
    callout: 'Covariance는 filter가 믿는 error scale이지 자동 진실표가 아니다. 실제 innovation 통계와 맞는지 확인하지 않으면 자신감 있게 틀린 estimate가 나올 수 있다.',
    owner: 'Assumption and consistency reviewer',
    output: 'claim ceiling · diagnostic obligations',
    invariant: 'linear-Gaussian scope is not silently generalized',
  },
];

const drqnScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Fixed window or learned memory',
    title: 'Frame stack은 길이를 미리 정하고 DRQN은 single-frame evidence를 recurrent state에 누적한다',
    body: 'DQN의 네 frame은 짧은 velocity를 드러내지만 필요한 history가 네 step보다 길면 입력이 다시 non-Markov가 된다. DRQN은 매 step 한 frame만 encode하고 LSTM이 어떤 과거를 남길지 학습한다.',
    icon: Layers3,
    layout: 'compare',
    items: [
      {
        label: 'DQN frame stack',
        value: '[oₜ₋₃,oₜ₋₂,oₜ₋₁,oₜ]',
        detail: '고정 길이 history를 input channel로 직접 보관',
        tone: 'muted',
        metric: 'fixed 4',
      },
      {
        label: 'DRQN input',
        value: 'single frame oₜ',
        detail: 'Current visual evidence만 CNN에 입력',
        tone: 'cyan',
        metric: '1 frame',
      },
      {
        label: 'Learned memory',
        value: 'hₜ = LSTM(φ(oₜ),hₜ₋₁)',
        detail: 'Task loss에 유용한 history를 hidden vector로 압축',
        tone: 'green',
        metric: 'recurrent',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{x_t^{\mathrm{stack}}}_{\text{고정 history 입력}}
      &=[o_{t-k+1},\ldots,o_t]\\[3pt]
      \underbrace{h_t}_{\text{학습한 history state}}
      &=f_\theta(\phi(o_t),h_{t-1})
    \end{aligned}`,
    formulaNote: 'Recurrence가 무한 기억을 보장하지 않는다. LSTM capacity, gate dynamics, BPTT unroll, reward credit가 실제 effective memory horizon을 결정한다.',
    callout: 'DRQN hidden state는 exact Bayesian belief가 아니다. Transition·observation model 없이 Q-learning loss에 유용하도록 학습된 compressed statistic이다.',
    owner: 'Input-history designer',
    output: 'fixed stack or recurrent state',
    invariant: 'learned memory is not renamed exact belief',
  },
  {
    eyebrow: '02 · Minimal recurrent DQN',
    title: 'DQN의 convolutional encoder 뒤 첫 fully connected layer만 512-unit LSTM으로 교체한다',
    body: '원 논문은 recurrence 효과를 분리하려고 DQN 구조를 최소 변경했다. Single 84×84 frame은 세 convolution을 지나고 LSTM output은 linear action head에서 discrete Q values가 된다.',
    icon: Network,
    layout: 'flow',
    items: [
      {
        label: 'Current frame',
        value: 'oₜ ∈ 84×84',
        detail: '한 시점의 grayscale game screen',
        tone: 'cyan',
      },
      {
        label: 'CNN encoder',
        value: 'eₜ = φ(oₜ)',
        detail: 'Current visual pattern을 feature로 변환',
        tone: 'violet',
      },
      {
        label: 'LSTM 512',
        value: 'hₜ = LSTM(eₜ,hₜ₋₁)',
        detail: 'Feature sequence에서 action-relevant memory 갱신',
        tone: 'gold',
      },
      {
        label: 'Q head',
        value: 'Q(hₜ,·) → ε-greedy action',
        detail: '모든 discrete action의 predicted return 출력',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{e_t}_{\text{current-frame feature}}
      &=\phi(o_t)\\[3pt]
      \underbrace{h_t}_{\text{recurrent memory}}
      &=\operatorname{LSTM}_\theta(e_t,h_{t-1})\\[3pt]
      \underbrace{q_t}_{\text{모든 action value}}
      &=W_Qh_t+b_Q
    \end{aligned}`,
    formulaNote: 'CNN, LSTM, Q head는 TD loss로 jointly trained된다. Q head의 output vector와 실제로 epsilon-greedy로 실행한 action index는 별도 artifact로 기록한다.',
    callout: '한 LSTM unit이 event에 반응하는 visualization은 흥미로운 evidence지만 hidden state 전체가 position·velocity를 명시적으로 분리해 저장한다는 증명은 아니다.',
    owner: 'CNN-LSTM value network',
    output: 'history-conditioned Q vector',
    invariant: 'one observation enters; temporal state persists separately',
  },
  {
    eyebrow: '03 · Sequence replay contract',
    title: 'Replay에서 어디서 시작하고 hidden state를 무엇으로 초기화하는지가 training sample의 의미를 바꾼다',
    body: '원 논문은 episode 처음부터 hidden을 이어가는 sequential update와 임의 지점에서 zero hidden으로 시작하는 random update를 비교했다. 둘이 비슷해 최종 결과는 random 10-step unroll을 사용했지만, 긴 history는 시작점에서 잘린다.',
    icon: Database,
    layout: 'compare',
    items: [
      {
        label: 'Sequential update',
        value: 'episode start → terminal',
        detail: 'Correct earlier history를 보존하지만 sample correlation이 큼',
        tone: 'cyan',
        metric: 'full episode',
      },
      {
        label: 'Random update',
        value: 'random t₀, hₜ₀=0',
        detail: 'Replay randomization을 유지하지만 t₀ 이전 history를 잃음',
        tone: 'gold',
        metric: '10 steps',
      },
      {
        label: 'Later burn-in',
        value: 'warm hidden, mask early loss',
        detail: '후속 recurrent RL의 보완책이며 원 DRQN 결과와 구분',
        tone: 'green',
        metric: 'modern',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{t_0}_{\text{random replay 시작점}}
      &\sim\operatorname{EpisodeIndex}\\[3pt]
      \underbrace{h_{t_0}}_{\text{원 random update 초기값}}
      &=0\\[3pt]
      \underbrace{\mathcal U}_{\text{BPTT 구간}}
      &=\{t_0,\ldots,t_0+9\}
    \end{aligned}`,
    formulaNote: 'Zero hidden은 environment의 진짜 memory가 0이라는 뜻이 아니라 learner가 prefix를 보지 않았다는 뜻이다. Loss target과 hidden provenance를 해석할 때 이 artificial boundary를 남겨야 한다.',
    callout: 'Stored hidden state를 아무 version 검증 없이 replay하면 stale network state가 된다. Recompute, stored state + burn-in, zero-init은 서로 다른 contract다.',
    owner: 'Episode replay + hidden initializer',
    output: 'ordered unroll · initial hidden provenance',
    invariant: 'sequence never crosses an episode boundary',
  },
  {
    eyebrow: '04 · Recurrent TD target',
    title: 'Online과 target network가 같은 ordered sequence를 처리하고 valid timestep의 TD residual만 loss에 넣는다',
    body: '각 step의 current hidden에서 chosen action Q를 읽고 target recurrent network의 next hidden에서 max action value를 bootstrap한다. Padding, terminal, artificial unroll start를 구분하지 않으면 다른 history의 value가 연결된다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      {
        label: 'Ordered frames',
        value: 'oₜ₀:ₜ₀₊L',
        detail: 'Episode boundary를 보존한 replay slice',
        tone: 'cyan',
      },
      {
        label: 'Online unroll',
        value: 'hₜ → Qθ(hₜ,aₜ)',
        detail: 'Stored chosen action의 current prediction',
        tone: 'violet',
      },
      {
        label: 'Target unroll',
        value: 'hₜ₊₁⁻ → max Qθ⁻',
        detail: 'Stale target parameters가 만드는 next value',
        tone: 'gold',
      },
      {
        label: 'Masked loss',
        value: 'Σmₜ(Qₜ−Yₜ)² / Σmₜ',
        detail: 'Padding을 빼고 actual terminal에서 bootstrap 차단',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{q_t}_{\text{실행 action의 current Q}}
      &=Q_\theta(h_t,a_t)\\[3pt]
      \underbrace{v_{t+1}^-}_{\text{target next value}}
      &=\max_{a'}Q_{\theta^-}(h_{t+1}^-,a')\\[3pt]
      \underbrace{y_t}_{\text{recurrent TD target}}
      &=r_{t+1}+\gamma(1-d_t)v_{t+1}^-\\[3pt]
      \underbrace{\mathcal L}_{\text{valid-step 평균 loss}}
      &=\frac{\sum_tm_t(q_t-y_t)^2}{\sum_tm_t}
    \end{aligned}`,
    formulaNote: 'Actual terminal d와 padding mask m은 다른 역할이다. Time-limit truncation은 environment contract에 따라 bootstrap할 수 있으며, unroll 끝은 episode terminal이 아니다.',
    callout: 'Hidden state consistency는 architecture 밖의 data problem이 아니다. 같은 observation이라도 prefix와 network version이 다르면 h와 Q target의 의미가 달라진다.',
    owner: 'Online/target recurrent unroller',
    output: 'per-step TD targets · masked loss',
    invariant: 'history, terminal, padding, and parameter version remain named',
  },
  {
    eyebrow: '05 · Evidence and transfer boundary',
    title: 'DRQN의 증거는 learned memory의 가능성을 보이지만 exact belief와 보편적 우위를 입증하지 않는다',
    body: '원 논문은 standard Atari 9개에서 DRQN이 대체로 DQN 수준이고 systematic advantage는 없다고 결론냈다. Screen을 확률 0.5로 완전히 가리는 flickering variant와 observation-quality sweep에서는 recurrence가 더 완만하게 저하됐다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: 'Standard games',
        value: 'DRQN ≈ DQN on average',
        detail: 'Recurrence 자체의 systematic control 우위는 보고하지 않음',
        tone: 'green',
      },
      {
        label: 'Flickering evidence',
        value: 'p=0.5 full-screen blackout',
        detail: 'Single frames를 시간에 걸쳐 통합해 Pong 등에서 strong performance',
        tone: 'green',
      },
      {
        label: 'Observability shift',
        value: 'DRQN degrades more gracefully',
        detail: 'Train/eval observation quality가 달라질 때 DQN보다 완만한 저하',
        tone: 'gold',
      },
      {
        label: '입증하지 않음',
        value: 'Exact posterior, calibrated uncertainty, realistic sensor robustness',
        detail: 'Synthetic blackout과 짧은 game set의 evidence ceiling',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{o_t}_{\text{flickering observation}}
      &=
      \begin{cases}
        \text{game screen}, & \text{확률 }0.5\\
        \text{blank screen}, & \text{확률 }0.5
      \end{cases}\\[3pt]
      \underbrace{h_t}_{\text{learned memory}}
      &\not\equiv
      \underbrace{b_t}_{\text{정확한 posterior belief}}
    \end{aligned}`,
    formulaNote: 'Flicker probability sweep는 observation quality 한 축의 distribution shift다. Bias, latency, aliasing, dropped action, multi-object association까지 포괄하는 robustness 보장은 아니다.',
    callout: '후속 R2D2의 stored recurrent state와 burn-in, RSSM의 stochastic latent는 DRQN이 이미 해결한 세부가 아니라 hidden consistency와 uncertainty를 다시 설계한 다음 단계다.',
    owner: 'Benchmark and transfer reviewer',
    output: 'evidence ceiling · modern handoff',
    invariant: 'empirical memory benefit is not exact state estimation',
  },
];

export function PomdpMechanismViz() {
  return (
    <div data-partial-observability-paper-viz="pomdp">
      <PaperSceneViz
        scenes={pomdpScenes}
        ariaLabel="POMDP · Ambiguous observation에서 belief update와 alpha-vector geometry까지"
      />
    </div>
  );
}

export function KalmanMechanismViz() {
  return (
    <div data-partial-observability-paper-viz="kalman">
      <PaperSceneViz
        scenes={kalmanScenes}
        ariaLabel="Kalman filter · Hidden state와 measurement에서 covariance recursion의 보장 경계까지"
      />
    </div>
  );
}

export function DrqnMechanismViz() {
  return (
    <div data-partial-observability-paper-viz="drqn">
      <PaperSceneViz
        scenes={drqnScenes}
        ariaLabel="DRQN · Fixed frame stack에서 recurrent replay와 evidence boundary까지"
      />
    </div>
  );
}
