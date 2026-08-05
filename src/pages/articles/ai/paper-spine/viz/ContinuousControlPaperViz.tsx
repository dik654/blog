import {
  Activity,
  BrainCircuit,
  Database,
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

const ddpgScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Replace continuous argmax',
    title: '연속 action 전체를 열거하지 않고 actor가 critic을 높일 한 점을 직접 출력한다',
    body: 'Joint torque가 7차원이고 각 축을 세 값으로만 나눠도 2,187개 조합이다. DDPG는 매 step Q를 전역 탐색하는 대신 differentiable actor를 action optimizer처럼 학습한다.',
    icon: BrainCircuit,
    layout: 'compare',
    items: [
      {
        label: 'Discrete DQN',
        value: '모든 a의 Q를 열거',
        detail: '작고 이산적인 action set에서는 argmax를 직접 계산',
        tone: 'muted',
        metric: 'enumerate',
      },
      {
        label: 'Naive continuous',
        value: '매 state에서 maxₐ Q 탐색',
        detail: '고차원 real-valued action에서는 반복 최적화가 필요',
        tone: 'red',
        metric: 'too costly',
      },
      {
        label: 'DDPG actor',
        value: 'a = μθ(s)',
        detail: 'State를 한 bounded continuous action으로 직접 매핑',
        tone: 'green',
        metric: 'amortized argmax',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\mu_\theta}_{\text{학습된 action optimizer}}
      &: \underbrace{s}_{\text{현재 state}}
      \longmapsto
      \underbrace{a\in\mathbb R^m}_{\text{연속 action 한 점}}\\[3pt]
      \underbrace{a_{\mathrm{policy}}}_{\text{noise 없는 actor 출력}}
      &=\mu_\theta(s)
    \end{aligned}`,
    formulaNote: 'Actor는 Q의 진짜 전역 argmax를 보장하지 않는다. Critic이 제공한 local action gradient를 반복 학습해 좋은 action을 빠르게 근사하는 함수다.',
    callout: 'DDPG의 deterministic은 environment가 deterministic하다는 뜻이 아니다. 같은 state에서 actor가 noise 없는 action 한 점을 낸다는 뜻이다.',
    owner: 'Deterministic actor μθ',
    output: 'bounded continuous action proposal',
    invariant: 'actor output is an approximation, not exact global argmax',
  },
  {
    eyebrow: '02 · Separate action roles',
    title: '수집 action, 학습할 policy action, bootstrap target action을 같은 변수로 합치지 않는다',
    body: 'Deterministic actor만 실행하면 탐색이 사라지므로 environment 수집 때만 외부 noise를 더한다. Actor update와 evaluation은 noise 없는 μθ를, critic target은 slow target actor μθ⁻를 사용한다.',
    icon: Activity,
    layout: 'flow',
    items: [
      {
        label: '현재 actor',
        value: 'μθ(s)',
        detail: 'Actor objective가 개선할 deterministic action',
        tone: 'cyan',
      },
      {
        label: '수집 noise',
        value: 'ηₜ ~ noise process',
        detail: 'Behavior exploration 전용 외부 신호',
        tone: 'violet',
      },
      {
        label: '실행 action',
        value: 'aᵦ = clip(μθ(s)+ηₜ)',
        detail: 'Replay에 실제로 저장되는 environment action',
        tone: 'gold',
      },
      {
        label: 'Target action',
        value: 'a′ = μθ⁻(s′)',
        detail: 'Slow target actor가 bootstrap에만 제공',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{a_t^\beta}_{\text{환경에 실행한 behavior action}}
      &=
      \operatorname{clip}\!\left(
      \underbrace{\mu_\theta(s_t)}_{\text{현재 actor}}
      +
      \underbrace{\eta_t}_{\text{탐색 noise}}
      \right)\\[3pt]
      \underbrace{a'_{\mathrm{target}}}_{\text{bootstrap action}}
      &=\underbrace{\mu_{\theta^-}(s')}_{\text{slow target actor}}
    \end{aligned}`,
    formulaNote: 'Behavior noise는 data coverage를 만들고 target actor는 critic label의 시간척도를 늦춘다. DDPG 원 알고리즘은 TD3식 target smoothing noise를 target action에 넣지 않는다.',
    callout: 'Replay tuple의 action은 μθ(s)를 다시 계산한 값이 아니라 당시 실제로 실행한 noisy behavior action이다. 이 provenance가 사라지면 critic supervised target이 틀어진다.',
    owner: 'Behavior policy + target actor',
    output: 'executed aᵦ · bootstrap a′target',
    invariant: 'exploration noise never rewrites stored action provenance',
  },
  {
    eyebrow: '03 · Off-policy critic target',
    title: '과거 behavior transition을 재사용하되 label은 slow actor와 slow critic이 함께 만든다',
    body: 'Replay는 여러 시점의 noisy behavior가 만든 실제 전이를 담는다. Critic은 저장된 action의 Q를 예측하고, target actor와 target critic은 다음 state의 bootstrap label을 천천히 움직인다.',
    icon: Database,
    layout: 'flow',
    items: [
      {
        label: 'Replay sample',
        value: '(s,aᵦ,r,s′,d) ~ D',
        detail: '과거 여러 behavior policy의 실제 transition',
        tone: 'cyan',
      },
      {
        label: 'Target actor',
        value: 'a′ = μθ⁻(s′)',
        detail: '다음 continuous action을 한 점으로 선택',
        tone: 'violet',
      },
      {
        label: 'Target critic',
        value: 'Qφ⁻(s′,a′)',
        detail: '그 target action의 미래 return을 추정',
        tone: 'gold',
      },
      {
        label: 'Current critic',
        value: 'Qφ(s,aᵦ) → y',
        detail: '저장 action prediction만 Bellman target으로 이동',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{a'}_{\text{target actor의 다음 action}}
      &=\mu_{\theta^-}(s')\\[3pt]
      \underbrace{v'}_{\text{느린 미래값}}
      &=Q_{\phi^-}(s',a')\\[3pt]
      \underbrace{y}_{\text{critic bootstrap 표적}}
      &=\underbrace{r}_{\text{실제 보상}}
      +\gamma(1-d)v'\\[3pt]
      \underbrace{\mathcal L_Q(\phi)}_{\text{critic 손실}}
      &=\mathbb E_{\mathcal D}\!\left[(Q_\phi(s,a^\beta)-y)^2\right]
    \end{aligned}`,
    formulaNote: 'Target branch의 θ⁻와 φ⁻는 optimizer gradient를 받지 않는다. 실제 terminal일 때만 미래값을 제거하며 timeout truncation은 별도 처리한다.',
    callout: 'Target actor가 action을 잘못 고르고 target critic이 그 값을 과대평가하면 두 오차가 하나의 y에 결합된다. TD3가 직접 수정하는 출발점이다.',
    owner: 'Replay sampler + target pair + critic optimizer',
    output: 'updated current critic Qφ',
    invariant: 'target pair is detached from current critic loss',
  },
  {
    eyebrow: '04 · Critic-to-actor gradient',
    title: 'Actor gradient는 critic의 action 입력까지만 지나며 environment transition을 통과하지 않는다',
    body: 'Current actor가 낸 action을 current critic에 넣고 Q가 커지는 action 방향을 계산한다. 그 방향을 actor Jacobian으로 parameter에 전달하되 critic parameter 자체는 actor optimizer가 갱신하지 않는다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      {
        label: 'Replay state',
        value: 's ~ D',
        detail: 'Actor update도 off-policy state distribution 사용',
        tone: 'cyan',
      },
      {
        label: 'Actor action',
        value: 'a = μθ(s)',
        detail: 'Stored noisy action이 아니라 현재 actor 출력',
        tone: 'violet',
      },
      {
        label: 'Action slope',
        value: '∇ₐQφ(s,a)',
        detail: 'Critic이 제안하는 local action 개선 방향',
        tone: 'gold',
      },
      {
        label: 'Actor step',
        value: '∇θμθ · ∇ₐQφ',
        detail: 'Action 방향을 actor parameter 변화로 변환',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{g_a}_{\text{critic의 action 제안}}
      &=\left.\nabla_aQ_\phi(s,a)\right|_{a=\mu_\theta(s)}\\[3pt]
      \underbrace{\nabla_\theta J}_{\text{actor parameter 방향}}
      &=\mathbb E_{s\sim\mathcal D}\!\left[
      \underbrace{g_a}_{\text{action 방향}}\,
      \underbrace{\nabla_\theta\mu_\theta(s)}_{\text{actor Jacobian}}
      \right]
    \end{aligned}`,
    formulaNote: 'Environment의 ds′/da는 식에 없다. Actor update 동안 Q의 input gradient는 사용하지만 critic optimizer는 step하지 않아 actor와 critic의 parameter ownership을 분리한다.',
    callout: 'Critic surface에 가짜로 높은 좁은 peak가 있으면 actor는 그 오류도 충실히 따라간다. Differentiable하다는 사실은 gradient가 실제 return 개선 방향이라는 보장이 아니다.',
    owner: 'Current critic gradient + actor optimizer',
    output: 'updated deterministic actor θ',
    invariant: 'environment is outside gradient path; critic weights do not step',
  },
  {
    eyebrow: '05 · Slow targets and evidence limit',
    title: 'Replay와 Polyak target은 학습을 늦춰 안정화하지만 한 critic의 오류를 검증하지는 않는다',
    body: 'Actor와 critic의 target copy는 current network를 조금씩 따라가 label drift를 늦춘다. 논문은 같은 recipe로 20개가 넘는 simulated task와 일부 pixel control을 보고했지만 일반 수렴 정리는 아니다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '원 논문이 지지',
        value: 'Continuous deep off-policy actor-critic의 실용적 가능성',
        detail: '같은 architecture와 hyperparameter로 20개 이상 simulated physics task 평가',
        tone: 'green',
      },
      {
        label: '안정화 계약',
        value: 'Replay + target actor + target critic + soft update',
        detail: 'Sequential correlation과 moving bootstrap target을 느린 시간척도로 완화',
        tone: 'green',
      },
      {
        label: '원 논문이 지지하지 않음',
        value: 'Nonlinear DDPG의 일반 수렴과 real-robot robustness',
        detail: 'Seed, reward scale, action normalization, critic error에 민감할 수 있음',
        tone: 'red',
      },
      {
        label: '다음 병목',
        value: 'Actor가 한 critic의 positive error를 반복 exploit',
        detail: 'Target과 policy update가 그 오류를 다시 feedback할 수 있음',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\theta^-}_{\text{slow actor}}
      &\leftarrow
      \underbrace{\tau\theta}_{\text{current 일부}}
      +(1-\tau)\theta^-\\[3pt]
      \underbrace{\phi^-}_{\text{slow critic}}
      &\leftarrow
      \underbrace{\tau\phi}_{\text{current 일부}}
      +(1-\tau)\phi^-
    \end{aligned}`,
    formulaNote: '작은 τ는 target drift를 줄이지만 새 value propagation도 늦춘다. Target network는 독립 검증자가 아니라 current network의 지연된 복사본이다.',
    callout: 'DDPG에서 “안정적”이라는 말은 원 논문의 비교 환경에서 recipe가 작동했다는 경험적 진술이다. 모든 continuous-control 문제의 수렴·안전 보장으로 확장하지 않는다.',
    owner: 'Polyak updater + benchmark reviewer',
    output: 'slow target pair · evidence boundary',
    invariant: 'stability device is not an error oracle',
  },
];

const td3Scenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Approximation-error feedback',
    title: '작은 critic 과대평가를 actor가 선택하면 그 오류가 다음 target의 학습 사실처럼 되돌아온다',
    body: 'Deterministic actor는 Q가 높은 action을 적극적으로 찾는다. 높은 이유가 실제 return이 아니라 function-approximation error여도 선택되고, bootstrap과 actor update를 거쳐 반복 증폭될 수 있다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [
      {
        label: 'Critic error',
        value: 'Q̂(s,a*) = Qtrue + ε+',
        detail: '좁은 action 영역을 우연히 높게 평가',
        tone: 'red',
      },
      {
        label: 'Actor exploit',
        value: 'μ(s) → a*',
        detail: 'Critic gradient를 따라 오류 peak를 선택',
        tone: 'gold',
      },
      {
        label: 'Bootstrap reuse',
        value: 'y ← r + γQ̂(s′,μ(s′))',
        detail: '높은 estimate가 다음 critic label에 들어감',
        tone: 'violet',
      },
      {
        label: 'Fast feedback',
        value: 'Q와 μ가 함께 이동',
        detail: '수정되기 전 error를 반복 강화할 수 있음',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\varepsilon_Q^+}_{\text{양의 critic 오차}}
      &\longrightarrow
      \underbrace{a^*=\mu(s)}_{\text{오류 peak 선택}}\\[3pt]
      a^*
      &\longrightarrow
      \underbrace{y\uparrow}_{\text{target 상승}}\\[3pt]
      y\uparrow
      &\longrightarrow
      \underbrace{\varepsilon_{Q,\mathrm{new}}^+}_{\text{오차 재학습}}
    \end{aligned}`,
    formulaNote: 'TD3는 단순히 DDPG에 network를 하나 더 붙인 것이 아니라 이 feedback loop의 target, spatial peak, update timescale을 각각 수정한다.',
    callout: 'Actor가 critic error를 exploit한다는 분석이 핵심이다. Critic TD loss가 작아도 target 자체가 과대평가되면 실제 return과의 오차는 남을 수 있다.',
    owner: 'Failure-path analyst',
    output: 'three intervention points',
    invariant: 'small TD loss is not assumed accurate return',
  },
  {
    eyebrow: '02 · Clipped double Q',
    title: '같은 transition을 두 critic이 따로 추정하고 target에는 더 작은 쪽만 넣는다',
    body: '두 critic은 architecture와 data는 같아도 parameter와 optimizer state를 따로 가진다. 한쪽의 우연한 positive error만으로 target이 커지지 않게 하지만 min 자체가 uncertainty estimate나 unbiased truth는 아니다.',
    icon: Layers3,
    layout: 'compare',
    items: [
      {
        label: 'Target critic 1',
        value: 'Q₁⁻(s′,a′)=8.4',
        detail: '같은 target action을 첫 network가 평가',
        tone: 'red',
        metric: 'higher estimate',
      },
      {
        label: 'Target critic 2',
        value: 'Q₂⁻(s′,a′)=6.9',
        detail: '독립 parameter의 두 번째 평가',
        tone: 'cyan',
        metric: 'lower estimate',
      },
      {
        label: 'Clipped target',
        value: 'min(Q₁⁻,Q₂⁻)=6.9',
        detail: '두 current critic 모두 이 보수적 target으로 fit',
        tone: 'green',
        metric: 'positive bias brake',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{q_1^-}_{\text{target critic 1}}&=Q_{\phi_1^-}(s',a')\\
      \underbrace{q_2^-}_{\text{target critic 2}}&=Q_{\phi_2^-}(s',a')\\
      \underbrace{y}_{\text{보수적 bootstrap 표적}}
      &=\underbrace{r}_{\text{실제 보상}}
      +\gamma(1-d)\underbrace{\min(q_1^-,q_2^-)}_{\text{둘 중 작은 추정}}
    \end{aligned}`,
    formulaNote: '두 critic은 같은 y를 학습하므로 error가 완전히 독립하지 않는다. Min은 positive error를 누르는 대신 systematic underestimation을 만들 수 있다.',
    callout: 'TD3 actor update는 원 Algorithm 1에서 Q₁만 사용한다. 두 critic의 평균이나 min gradient로 actor를 update한다고 자동 가정하지 않는다.',
    owner: 'Twin target critics',
    output: 'clipped double-Q target y',
    invariant: 'critic parameters stay separate; min is not calibrated uncertainty',
  },
  {
    eyebrow: '03 · Target policy smoothing',
    title: 'Bootstrap action 주변의 작은 perturbation에서도 높게 평가되는 Q만 target으로 인정한다',
    body: 'Deterministic policy가 critic의 매우 좁은 peak에 맞춰지는 것을 막기 위해 target actor action에 clipped Gaussian noise를 더한다. 이 noise는 environment 탐색용 behavior noise와 목적이 다르다.',
    icon: Sparkles,
    layout: 'flow',
    items: [
      {
        label: 'Target actor',
        value: 'μθ⁻(s′)',
        detail: 'Slow deterministic next action',
        tone: 'cyan',
      },
      {
        label: 'Smoothing noise',
        value: 'ε ~ clip(N(0,σ),−c,c)',
        detail: 'Target neighborhood만 흔드는 제한된 noise',
        tone: 'violet',
      },
      {
        label: 'Bounded target',
        value: 'a′ = clip(μθ⁻+ε)',
        detail: 'Noise와 최종 action 모두 허용 범위 적용',
        tone: 'gold',
      },
      {
        label: 'Robust value',
        value: 'min Qᵢ⁻(s′,a′)',
        detail: 'Mini-batch에서 주변 action value를 평균적으로 학습',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\widetilde\epsilon}_{\text{Gaussian noise}}
      &\sim\mathcal N(0,\sigma^2)\\[3pt]
      \underbrace{\epsilon}_{\text{제한한 target noise}}
      &=\operatorname{clip}(\widetilde\epsilon,-c,c)\\[3pt]
      \underbrace{\widetilde a'}_{\text{noise를 더한 action}}
      &=\mu_{\theta^-}(s')+\epsilon\\[3pt]
      \underbrace{a'}_{\text{허용 범위 target}}
      &=\operatorname{clip}(\widetilde a',a_{\min},a_{\max})
    \end{aligned}`,
    formulaNote: 'Behavior exploration noise는 새 state-action data를 모은다. Target smoothing noise는 저장된 transition의 bootstrap label에서 좁은 critic peak를 regularize한다.',
    callout: '좋은 action의 가치가 작은 perturbation에도 비슷하다는 가정을 넣는다. 본질적으로 날카로운 최적 action에서는 smoothing이 실제 optimum을 흐릴 수 있다.',
    owner: 'Target-action regularizer',
    output: 'smoothed and bounded target action a′',
    invariant: 'target noise and behavior noise are logged separately',
  },
  {
    eyebrow: '04 · Delayed policy timescale',
    title: 'Critic은 매 step 고치고 actor와 모든 target network는 d번마다 한 번만 움직인다',
    body: 'Critic error가 아직 큰 상태에서 actor가 매번 그 surface를 따라가지 않도록 policy update를 늦춘다. Target pair도 같은 느린 주기에 갱신해 feedback 속도를 함께 낮춘다.',
    icon: Gauge,
    layout: 'timeline',
    items: [
      {
        label: 'Critic step 1',
        value: 'φ₁,φ₂ update',
        detail: 'Replay target으로 두 critic fit',
        tone: 'cyan',
      },
      {
        label: 'Critic step 2',
        value: 'φ₁,φ₂ update',
        detail: 'Actor는 아직 같은 action 유지',
        tone: 'cyan',
      },
      {
        label: 'Delayed actor',
        value: 'θ update using Q₁',
        detail: 'd번째 critic step에만 policy 이동',
        tone: 'gold',
      },
      {
        label: 'Target update',
        value: 'θ⁻,φ₁⁻,φ₂⁻ Polyak',
        detail: 'Actor와 같은 느린 주기에 target 추적',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\phi_1,\phi_2}_{\text{current critics}}
      &\leftarrow\operatorname{criticStep}\quad\text{매회}\\[3pt]
      k\bmod d=0
      &\Longrightarrow
      \underbrace{\theta}_{\text{actor}}\leftarrow\operatorname{actorStep}\\[3pt]
      k\bmod d=0
      &\Longrightarrow
      \underbrace{\theta^-,\phi_1^-,\phi_2^-}_{\text{target networks}}
      \leftarrow\operatorname{PolyakStep}
    \end{aligned}`,
    formulaNote: '논문 기본 실험은 d=2를 사용했다. 숫자 2가 보편 상수라는 뜻은 아니며 목적은 critic error가 policy로 전달되는 빈도를 낮추는 것이다.',
    callout: 'Delayed actor update와 Polyak coefficient는 둘 다 느린 시간척도를 만들지만 같은 knob는 아니다. 하나는 update 빈도, 다른 하나는 update 시 이동량을 정한다.',
    owner: 'Two-timescale scheduler',
    output: 'frequent critic steps · delayed actor/target steps',
    invariant: 'policy delay gates actor and all target updates',
  },
  {
    eyebrow: '05 · Combination evidence',
    title: '세 장치는 서로 다른 오류 경로를 막고 full TD3의 성능은 그 조합에서 나온다',
    body: '논문은 clipped double Q, delayed policy update, target smoothing을 제거·조합한 ablation을 10 trial로 비교했다. 구성 요소의 중요도는 task마다 달랐고 full combination이 대부분의 task에서 가장 강했다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: 'Target value 경로',
        value: 'Twin min으로 한쪽 positive error 억제',
        detail: '두 critic이 함께 높아야 bootstrap target이 크게 올라감',
        tone: 'green',
      },
      {
        label: 'Action-space 경로',
        value: 'Target smoothing으로 좁은 peak 억제',
        detail: '주변 perturbation에도 높은 action을 선호',
        tone: 'green',
      },
      {
        label: '시간 경로',
        value: 'Delayed actor로 error exploit 속도 억제',
        detail: 'Critic이 더 fit될 시간을 준 뒤 policy와 target 이동',
        tone: 'green',
      },
      {
        label: '남는 한계',
        value: 'Underestimation, critic 동조, sharp optimum',
        detail: 'Min과 smoothing이 정확성·안전·불확실성 보장을 만들지는 않음',
        tone: 'red',
      },
    ],
    formula: String.raw`\underbrace{\mathrm{TD3}}_{\text{전체 알고리즘}}
      =
      \underbrace{\mathrm{CDQ}}_{\text{target 값}}
      +
      \underbrace{\mathrm{TPS}}_{\text{target action}}
      +
      \underbrace{\mathrm{DP}}_{\text{update 시간척도}}`,
    formulaNote: 'Ablation은 세 요소가 동일한 크기로 항상 기여한다고 말하지 않는다. 논문도 component significance가 task마다 다르고 조합 효과가 크다고 보고한다.',
    callout: 'Twin critics의 차이는 유용한 진단값이지만 calibrated epistemic uncertainty가 아니다. 실제 return rollout과 함께 비교해야 approximation error를 말할 수 있다.',
    owner: 'Ablation and failure-boundary reviewer',
    output: 'three-path attribution · residual risks',
    invariant: 'full-system result is not assigned to one component',
  },
];

const sacScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Maximum-entropy objective',
    title: 'SAC는 reward만 큰 한 행동이 아니라 높은 reward와 여러 좋은 선택지를 함께 가치로 센다',
    body: 'Policy entropy는 외부 탐색 noise가 아니라 최적화 목표 안에 들어간다. Temperature α는 reward 한 단위와 action uncertainty 한 단위의 교환비를 정한다.',
    icon: Sparkles,
    layout: 'compare',
    items: [
      {
        label: 'Reward only',
        value: 'E[Σγᵗrₜ]',
        detail: '현재 estimate에서 가장 좋아 보이는 mode로 빨리 수렴할 수 있음',
        tone: 'muted',
        metric: 'exploit',
      },
      {
        label: 'Policy entropy',
        value: 'H(π(·|s))',
        detail: '같은 state에서 여러 action 가능성을 남기는 정도',
        tone: 'violet',
        metric: 'diversity',
      },
      {
        label: 'Soft objective',
        value: 'reward + α·entropy',
        detail: '나쁜 action은 버리되 좋은 선택지 사이의 stochasticity를 유지',
        tone: 'green',
        metric: 'maximum entropy',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{h_t}_{\text{entropy 가치}}
      &=\alpha\mathcal H(\pi(\cdot\mid s_t))\\[3pt]
      \underbrace{\widetilde r_t}_{\text{soft reward}}
      &=\underbrace{r_t}_{\text{환경 reward}}+h_t\\[3pt]
      \underbrace{J_{\mathrm{soft}}(\pi)}_{\text{soft policy 목표}}
      &=\mathbb E_{\tau\sim\pi}\!\left[
      \sum_t\gamma^t\widetilde r_t\right]
    \end{aligned}`,
    formulaNote: 'α→0이면 reward-only objective에 접근한다. 원 ICML 2018 실험에서는 explicit automatic α update가 아니라 reward scale을 조절해 상대 temperature를 맞췄다.',
    callout: 'Entropy가 크기만 하면 좋은 것이 아니다. Q가 낮은 action까지 무작위로 고르는 것이 아니라 soft value 안에서 reward와 stochasticity를 함께 최적화한다.',
    owner: 'Maximum-entropy objective',
    output: 'reward–entropy exchange contract α',
    invariant: 'temperature is part of the objective, not display noise',
  },
  {
    eyebrow: '02 · Reparameterized stochastic actor',
    title: 'Gaussian noise를 입력으로 분리해 sampled action을 critic까지 미분하고 tanh density도 보정한다',
    body: 'REINFORCE의 score-function sample 대신 SAC는 differentiable critic을 활용해 ε를 외부 noise로 두고 action sample을 parameter의 함수로 만든다. Action bound를 위한 tanh는 probability density를 바꾼다.',
    icon: Network,
    layout: 'flow',
    items: [
      {
        label: 'Actor outputs',
        value: 'μθ(s), log σθ(s)',
        detail: 'State별 Gaussian location과 scale',
        tone: 'cyan',
      },
      {
        label: 'Base noise',
        value: 'ε ~ N(0,I)',
        detail: 'Parameter와 분리한 random source',
        tone: 'violet',
      },
      {
        label: 'Pre-squash',
        value: 'u = μ + σ⊙ε',
        detail: 'Reparameterized differentiable sample',
        tone: 'gold',
      },
      {
        label: 'Bounded action',
        value: 'a = tanh(u)',
        detail: 'Environment action 범위와 corrected log π 계산',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\epsilon}_{\text{외부 random source}}
      &\sim\mathcal N(0,I)\\[3pt]
      \underbrace{u_\theta}_{\text{pre-squash sample}}
      &=\mu_\theta(s)+\sigma_\theta(s)\odot\epsilon\\[3pt]
      \underbrace{a}_{\text{bounded action}}&=\tanh(u_\theta)\\[3pt]
      \underbrace{\ell_0}_{\text{Gaussian log density}}
      &=\log\mathcal N(u_\theta;\mu_\theta,\sigma_\theta)\\[3pt]
      \underbrace{\log\pi_\theta(a\mid s)}_{\text{변환 뒤 density}}
      &=\ell_0-\sum_j\log(1-\tanh^2u_j)
    \end{aligned}`,
    formulaNote: 'Tanh correction을 빼면 boundary 근처 action density와 entropy gradient가 틀어진다. 실제 구현은 numerical stability를 위해 작은 epsilon이나 stable identity를 사용한다.',
    callout: 'SAC의 stochasticity는 behavior에만 더했다 버리는 DDPG noise와 다르다. Policy distribution과 corrected log-probability가 actor objective의 직접 입력이다.',
    owner: 'Squashed Gaussian actor',
    output: 'action sample a · corrected log π',
    invariant: 'sample and density use the same transform',
  },
  {
    eyebrow: '03 · Original 2018 network contract',
    title: '원 ICML SAC는 policy, 두 Q, 별도 V, slow target V를 함께 학습한다',
    body: '후속 간소화 버전과 달리 원 논문은 state-value network를 명시적으로 둔다. 동시에 positive bias를 줄이기 위한 twin Q도 이미 사용하므로 twin-Q 전체를 후속 기여로 돌리면 안 된다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      {
        label: 'Twin soft Q',
        value: 'Qθ₁(s,a), Qθ₂(s,a)',
        detail: '같은 reward target을 독립 parameter로 fit',
        tone: 'cyan',
      },
      {
        label: 'Soft V target',
        value: 'min Q − α log π',
        detail: '현재 policy action의 quality와 entropy 결합',
        tone: 'violet',
      },
      {
        label: 'Value network',
        value: 'Vψ(s)',
        detail: 'Soft state value를 별도 regression',
        tone: 'gold',
      },
      {
        label: 'Target value',
        value: 'Vψ⁻(s′)',
        detail: 'Q bootstrap을 느리게 만드는 target owner',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{q_{\min}(s,a)}_{\text{두 Q 중 작은 값}}
      &=\min_iQ_{\phi_i}(s,a)\\[3pt]
      \underbrace{\ell_{\mathrm{soft}}}_{\text{한 action의 soft value}}
      &=q_{\min}(s,a)-\alpha\log\pi_\theta(a\mid s)\\[3pt]
      \underbrace{v_{\mathrm{soft}}(s)}_{\text{value regression 표적}}
      &=\mathbb E_{a\sim\pi_\theta}[\ell_{\mathrm{soft}}]\\[3pt]
      \underbrace{y_Q}_{\text{두 Q의 bootstrap 표적}}
      &=
      \underbrace{r}_{\text{실제 보상}}
      +\underbrace{\gamma(1-d)V_{\psi^-}(s')}_{\text{slow soft future value}}
    \end{aligned}`,
    formulaNote: '원 논문은 두 Q를 독립 학습하고 minimum을 value와 policy gradient에 사용한다. Q target은 target Q가 아니라 slow target V에서 온다는 점이 현대 no-V 구현과 다르다.',
    callout: '“원 SAC = V network 하나, 현대 SAC = twin Q”가 아니다. 원 SAC는 V와 twin Q를 함께 쓰고 현대 recipe는 대개 V를 제거한 채 twin Q를 유지한다.',
    owner: 'Twin-Q critics + value network + target V',
    output: 'soft Q estimates · Vψ · slow Vψ⁻',
    invariant: 'original and no-value SAC formulations stay named',
  },
  {
    eyebrow: '04 · Off-policy soft actor update',
    title: 'Replay state에서 높은 min-Q action을 선호하되 log-probability 비용으로 policy 폭을 유지한다',
    body: 'Replay transition은 critic을 학습하고 replay state는 actor update에도 재사용된다. Reparameterized action으로 critic action gradient와 entropy gradient가 actor에 함께 흐른다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      {
        label: 'Replay state',
        value: 's ~ D',
        detail: '과거 behavior가 방문한 state를 off-policy 재사용',
        tone: 'cyan',
      },
      {
        label: 'Current sample',
        value: 'a = fθ(ε;s)',
        detail: 'Stored action이 아니라 현재 stochastic actor sample',
        tone: 'violet',
      },
      {
        label: 'Soft cost',
        value: 'α log πθ(a|s) − min Qᵢ(s,a)',
        detail: '높은 Q와 충분한 entropy를 동시에 선호',
        tone: 'gold',
      },
      {
        label: 'Actor step',
        value: 'θ ← minimize Jπ',
        detail: 'Critic input gradient를 쓰되 critic weights는 고정',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{a_\theta}_{\text{현재 policy sample}}
      &=f_\theta(\epsilon;s),\quad s\sim\mathcal D\\[3pt]
      \underbrace{c_{\mathcal H}}_{\text{policy 폭의 비용}}
      &=\alpha\log\pi_\theta(a_\theta\mid s)\\[3pt]
      \underbrace{q_{\min}}_{\text{보수적 action value}}
      &=\min_iQ_{\phi_i}(s,a_\theta)\\[3pt]
      \underbrace{J_\pi(\theta)}_{\text{actor가 최소화할 soft cost}}
      &=\mathbb E[c_{\mathcal H}-q_{\min}]
    \end{aligned}`,
    formulaNote: 'Actor update의 Q는 target critic이 아니라 current critic이고, action은 replay에 저장된 behavior action이 아니라 current policy sample이다. State만 replay에서 온다.',
    callout: 'Replay coverage 밖 action의 Q가 잘못 높으면 stochastic actor도 그 오류를 exploit할 수 있다. Maximum entropy가 offline OOD 문제를 자동 해결하지 않는다.',
    owner: 'Current stochastic actor + frozen current critics',
    output: 'updated policy distribution πθ',
    invariant: 'replay state, current action, and critic owner stay distinct',
  },
  {
    eyebrow: '05 · Evidence and version boundary',
    title: '강한 sample efficiency와 seed 결과를 원 SAC 구성, reward scale, 후속 recipe와 함께 읽는다',
    body: 'ICML 논문은 DDPG, PPO, TD3 등과 다섯 seed를 비교하고 여러 continuous-control task에서 높은 성능을 보고했다. 동시에 reward scale이 temperature 역할을 해 task별 tuning에 민감함을 직접 보였다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '원 논문이 지지',
        value: 'Off-policy maximum-entropy actor-critic의 sample efficiency',
        detail: '여러 MuJoCo task에서 environment step 대비 return과 5개 seed 비교',
        tone: 'green',
      },
      {
        label: '원 2018 계약',
        value: 'Twin Q + explicit V + target V + fixed temperature effect',
        detail: 'Reward scale을 inverse temperature처럼 조절',
        tone: 'green',
      },
      {
        label: '후속 표준 계약',
        value: 'No V network + twin-Q target + automatic α tuning',
        detail: '널리 쓰이지만 최초 ICML formulation과 version을 구분',
        tone: 'red',
      },
      {
        label: '남는 한계',
        value: 'Real safety, arbitrary reward scale, offline OOD 보장 없음',
        detail: 'Benchmark robustness를 production 제어 보장으로 확장하지 않음',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\text{원 2018}}_{\text{value network 있음}}
      &: Q_1,Q_2,V,V^-,\pi\\[3pt]
      \underbrace{\text{후속 recipe}}_{\text{value network 없음}}
      &: Q_1,Q_2,Q_1^-,Q_2^-,\pi\\[3pt]
      \underbrace{\alpha_{\mathrm{2018}}}_{\text{reward scale로 조절}}
      &\neq
      \underbrace{\alpha_{\mathrm{auto}}}_{\text{후속 자동 학습}}
    \end{aligned}`,
    formulaNote: '후속 recipe가 틀렸다는 뜻이 아니라 citation과 implementation contract를 정확히 붙이라는 뜻이다. 같은 “SAC” 이름 아래 target owner와 optimizer 수가 달라진다.',
    callout: 'Entropy는 안전 제약이 아니다. 더 다양한 action을 유지할 수 있지만 actuator limit, collision cost, distribution shift는 별도 control·safety 계약이 필요하다.',
    owner: 'Benchmark · version 검토',
    output: '증거 범위 · 원본/후속 구분',
    invariant: '후속 recipe를 원 논문으로 소급하지 않음',
  },
];

export function DdpgMechanismViz() {
  return (
    <div data-continuous-control-paper-viz="ddpg">
      <PaperSceneViz
        scenes={ddpgScenes}
        ariaLabel="DDPG · Continuous action proposal에서 critic-to-actor gradient와 slow targets까지"
      />
    </div>
  );
}

export function Td3MechanismViz() {
  return (
    <div data-continuous-control-paper-viz="td3">
      <PaperSceneViz
        scenes={td3Scenes}
        ariaLabel="TD3 · Critic approximation-error feedback과 세 가지 완화 장치"
      />
    </div>
  );
}

export function SacMechanismViz() {
  return (
    <div data-continuous-control-paper-viz="sac">
      <PaperSceneViz
        scenes={sacScenes}
        ariaLabel="SAC · Maximum-entropy objective에서 원 논문과 현대 구현 경계까지"
      />
    </div>
  );
}
