import {
  Activity,
  BrainCircuit,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  RefreshCw,
  Route,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const cpoScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Reward and cost stay separate',
    title: '잘하는 정도와 위험 예산을 한 reward 숫자에 섞지 않고 두 return으로 기록한다',
    body: 'Penalty 방식은 coefficient가 작으면 위험을 무시하고 크면 task를 포기할 수 있다. CPO는 task reward return을 최대화하되 auxiliary cost return은 명시한 budget 아래에 두는 CMDP에서 시작한다.',
    icon: Scale,
    layout: 'compare',
    items: [
      {
        label: 'Task objective',
        value: 'Jᴿ(π)를 크게',
        detail: '속도, 이동 거리, 수집 성공처럼 원하는 behavior의 expected discounted return',
        tone: 'green',
        metric: 'optimize',
      },
      {
        label: 'Safety constraint',
        value: 'Jᶜ(π) ≤ d',
        detail: '위험 구역 체류, 충돌 indicator처럼 별도 집계한 expected cost budget',
        tone: 'red',
        metric: 'constrain',
      },
      {
        label: 'Penalty baseline',
        value: 'Jᴿ − λJᶜ',
        detail: 'λ를 고정하면 원하는 budget을 직접 지정하지 못하고 reward scale에도 민감',
        tone: 'muted',
        metric: 'trade-off only',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{J_R(\pi)}_{\text{task 성능}}
      &=\mathbb E_\pi\!\left[\sum_{t\ge0}\gamma^t
      \underbrace{R_t}_{\text{원하는 행동 신호}}\right]\\[3pt]
      \underbrace{J_C(\pi)}_{\text{누적 safety cost}}
      &=\mathbb E_\pi\!\left[\sum_{t\ge0}\gamma^t
      \underbrace{C_t}_{\text{위반 신호}}\right]
      \le
      \underbrace{d}_{\text{명시한 예산}}
    \end{aligned}`,
    formulaNote: 'J_C는 expected discounted sum이다. “Episode에서 사고가 한 번이라도 날 확률”이나 매 timestep hard bound와 자동으로 같지 않다.',
    callout: 'CPO가 다루는 첫 계약은 reward-cost 분리다. Cost를 reward shaping 항으로 숨기면 budget의 단위와 실제 위반량을 다시 해석하기 어렵다.',
    owner: 'CMDP task designer',
    output: 'reward trajectory · cost trajectory · budget d',
    invariant: 'reward and safety cost remain independently auditable',
  },
  {
    eyebrow: '02 · Current-policy surrogate',
    title: '새 policy를 먼저 오래 실행하지 않고 current rollout의 advantage로 변화량을 근사한다',
    body: 'Current policy가 만든 state-action sample에는 reward advantage와 cost advantage를 각각 붙인다. Candidate policy의 probability ratio를 곱해 같은 batch에서 task improvement와 cost change를 예상한다.',
    icon: Activity,
    layout: 'flow',
    items: [
      {
        label: 'On-policy data',
        value: 'τ ~ πₖ',
        detail: 'Current state distribution에서 reward·cost를 함께 수집',
        tone: 'cyan',
      },
      {
        label: 'Two advantages',
        value: 'Âᴿ · Âᶜ',
        detail: 'Task와 constraint의 relative return signal을 따로 추정',
        tone: 'violet',
      },
      {
        label: 'Policy ratio',
        value: 'ρ = πθ(a|s)/πₖ(a|s)',
        detail: '같은 action을 candidate policy가 얼마나 더 선택할지 반영',
        tone: 'gold',
      },
      {
        label: 'Local surrogates',
        value: 'Lᴿ(θ) · Lᶜ(θ)',
        detail: '실제 next-policy rollout 전에 비교할 근사 objective와 constraint',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\rho_\theta(s,a)}_{\text{candidate/current 확률비}}
      &=\frac{\pi_\theta(a\mid s)}{\pi_k(a\mid s)}\\[3pt]
      \underbrace{L_R(\theta)}_{\text{근사 reward 변화}}
      &=\mathbb E_{\mathcal D_k}[\rho_\theta\widehat A_R]\\[3pt]
      \underbrace{L_C(\theta)}_{\text{근사 cost 변화}}
      &=\mathbb E_{\mathcal D_k}[\rho_\theta\widehat A_C]
    \end{aligned}`,
    formulaNote: '세 기대값은 current rollout distribution을 공유하지만 label owner가 다르다. Â_R과 Â_C를 함께 normalize해 상대 크기를 지우지 않는다.',
    callout: 'Surrogate는 true return의 측정값이 아니다. Candidate policy가 current policy 근처에 있을 때 state-distribution shift를 작게 유지한다는 전제 위의 local prediction이다.',
    owner: 'On-policy sampler + two advantage estimators',
    output: 'reward surrogate · cost surrogate',
    invariant: 'candidate evaluation retains current-data provenance',
  },
  {
    eyebrow: '03 · Local feasible geometry',
    title: 'Reward가 가리키는 방향 중 cost half-space와 KL ellipsoid가 겹치는 step만 고른다',
    body: 'Parameter 주변에서 reward와 cost를 1차로, average KL을 2차로 근사하면 constraint 하나의 practical CPO는 QCQP가 된다. 현재 cost gap c가 양수면 feasible half-space가 origin을 지나지 않을 수 있다.',
    icon: Layers3,
    layout: 'compare',
    items: [
      {
        label: 'Reward direction',
        value: 'gᵀu를 최대화',
        detail: 'Current surrogate의 가장 빠른 task improvement 방향',
        tone: 'green',
        metric: 'objective',
      },
      {
        label: 'Safety half-space',
        value: 'c + bᵀu ≤ 0',
        detail: '현재 budget residual과 cost gradient가 허용할 한쪽 영역',
        tone: 'red',
        metric: 'local feasibility',
      },
      {
        label: 'Trust ellipsoid',
        value: '½uᵀHu ≤ δ',
        detail: 'Fisher curvature로 재는 average KL update 크기',
        tone: 'cyan',
        metric: 'locality',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{r_C(u)}_{\text{cost residual}}
      &=c+b^\top u\\[3pt]
      \underbrace{q_{\mathrm{KL}}(u)}_{\text{근사 average KL}}
      &=\frac12u^\top H u\\[3pt]
      \underbrace{u^\star}_{\text{reward 최적 step}}
      &=\arg\max_u g^\top u\\[3pt]
      \underbrace{r_C(u^\star)\le0}_{\text{cost 영역}}
      &,\quad
      \underbrace{q_{\mathrm{KL}}(u^\star)\le\delta}_{\text{trust 영역}}
    \end{aligned}`,
    formulaNote: 'g, b, H, c는 rollout에서 추정한 local artifact다. QCQP를 정확히 풀어도 이 추정량과 Taylor approximation의 오차는 남는다.',
    callout: '“Constraint를 넣었다”는 말만으로 부족하다. 구현 검사는 trust ellipsoid와 safety half-space의 교집합이 실제로 있는지부터 시작한다.',
    owner: 'Local constrained optimizer',
    output: 'feasible candidate parameter step u*',
    invariant: 'reward is optimized only inside both local sets',
  },
  {
    eyebrow: '04 · Proposal, line search, recovery',
    title: 'Dual 해가 낸 큰 step을 그대로 실행하지 않고 sample constraint를 재검사한다',
    body: 'Conjugate gradient는 H inverse-vector product를 만들고 작은 dual problem이 candidate step을 낸다. Backtracking은 actual neural policy에서 surrogate cost와 KL을 다시 계산하며, local problem이 infeasible하면 reward를 버리고 cost 감소 방향으로 복구한다.',
    icon: GitBranch,
    layout: 'timeline',
    items: [
      {
        label: 'Curvature solve',
        value: 'H⁻¹g · H⁻¹b',
        detail: 'Matrix inverse를 만들지 않고 conjugate gradient로 근사',
        tone: 'cyan',
      },
      {
        label: 'Dual proposal',
        value: 'u*',
        detail: 'Reward와 cost dual variable로 QCQP candidate 생성',
        tone: 'violet',
      },
      {
        label: 'Backtracking',
        value: 'accept / shrink',
        detail: 'Sample surrogate constraint와 measured average KL 재검사',
        tone: 'gold',
      },
      {
        label: 'Recovery case',
        value: 'reward 포기 · cost 감소',
        detail: '이미 infeasible하고 교집합이 없으면 H metric의 safety direction 사용',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{v}_{\text{Fisher metric의 cost 방향}}
      &=H^{-1}b\\[3pt]
      \underbrace{u_{\mathrm{rec}}}_{\text{trust boundary의 recovery step}}
      &=-\sqrt{\frac{2\delta}{b^\top v}}\;v
    \end{aligned}`,
    formulaNote: 'Recovery proposal도 line search를 거친다. 이것은 2021 Recovery RL의 별도 runtime recovery policy가 아니라 CPO optimizer 안의 infeasible-step 처리다.',
    callout: 'Line search는 true environment cost를 새 rollout으로 검증하는 단계가 아니라 current sample surrogate를 재검사한다. 같은 “검사”라는 말로 deployment validation과 합치지 않는다.',
    owner: 'Dual solver + line-search controller',
    output: 'accepted update or constraint-reducing step',
    invariant: 'infeasibility is surfaced instead of hidden by reward',
  },
  {
    eyebrow: '05 · Near-constraint evidence ceiling',
    title: 'Theorem은 0이 아닌 residual을 남기고 practical neural update는 추가 근사층을 가진다',
    body: 'CPO update의 true cost bound에는 trust-region 크기, discount와 cost advantage scale이 만든 residual이 남는다. 원 논문 simulation은 constraint tracking을 지지하지만 rare catastrophic event의 hard safety certificate는 아니다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: '이론이 지지',
        value: 'Average-divergence 기반 worst-case return bound',
        detail: 'Surrogate constraint와 KL radius에서 near-constraint satisfaction residual 유도',
        tone: 'green',
      },
      {
        label: '실험이 지지',
        value: 'Circle·Gather에서 budget tracking 개선',
        detail: 'CPO가 PDO·fixed penalty보다 limit 근처를 안정적으로 추적',
        tone: 'green',
      },
      {
        label: 'Practical gap',
        value: 'Sampling · GAE · Taylor · CG · line search',
        detail: '신경망 구현은 theoretical update 위에 여러 estimation layer를 추가',
        tone: 'red',
      },
      {
        label: '입증하지 않음',
        value: 'Per-state hard safety · chance constraint · real robot',
        detail: 'Average expected cost와 단일 catastrophic event probability는 별도 요구',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{r_\delta}_{\text{남는 worst-case 간격}}
      &=\frac{\sqrt{2\delta}\gamma\epsilon_C}{(1-\gamma)^2}\\[3pt]
      \underbrace{J_C(\pi_{k+1})}_{\text{actual expected cost}}
      &\le
      \underbrace{d}_{\text{budget}}+
      \underbrace{r_\delta}_{\text{0이 아닌 residual}}
    \end{aligned}`,
    formulaNote: 'δ를 줄이면 residual bound는 작아지지만 update와 value propagation도 느려진다. ε_C는 rollout 전체의 평균이 아니라 state별 expected cost advantage의 worst-case scale이다.',
    callout: '“CPO는 안전을 보장한다”보다 정확한 문장은 “명시한 expected-cost CMDP와 trust-region assumptions 아래 near-constraint update bound를 제공한다”다.',
    owner: 'Theorem and benchmark reviewer',
    output: 'residual bound · empirical constraint trace',
    invariant: 'near-constraint claim never becomes hard physical safety',
  },
];

const lyapunovScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Global budget has no local answer',
    title: 'Episode 전체 budget만 보면 지금 이 state에서 어떤 action mixture가 허용되는지 바로 알 수 없다',
    body: 'Transient CMDP는 terminal에 도달할 때까지 task cost와 safety cost를 누적한다. Initial-state expected safety cost 제한은 global 요구라서 policy improvement가 각 state에서 사용할 local decision rule로 변환되어야 한다.',
    icon: Route,
    layout: 'compare',
    items: [
      {
        label: 'Task objective',
        value: 'Cπ(x₀)를 작게',
        detail: 'Goal까지 도달하는 시간이나 경로 비용을 개선',
        tone: 'green',
        metric: 'performance',
      },
      {
        label: 'Safety requirement',
        value: 'Dπ(x₀) ≤ d₀',
        detail: 'Terminal stopping time까지 expected cumulative obstacle cost 제한',
        tone: 'red',
        metric: 'global',
      },
      {
        label: 'Missing bridge',
        value: '현재 state의 허용 action',
        detail: 'Global inequality 하나는 local policy distribution을 직접 주지 않음',
        tone: 'gold',
        metric: 'need local set',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{T^\star}_{\text{종료 시점}}
      &=\inf\{t:x_t\notin\mathcal X'\}\\[3pt]
      \underbrace{N_d}_{\text{한 trajectory의 누적 cost}}
      &=\sum_{t=0}^{T^\star-1}d(x_t)\\[3pt]
      \underbrace{D_\pi(x_0)}_{\text{global expected cost}}
      &=\mathbb E_\pi[N_d\mid x_0]
      \le\underbrace{d_0}_{\text{initial budget}}
    \end{aligned}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{T^\star}_{\text{종료}}&=\inf\{t:x_t\notin\mathcal X'\}\\[3pt]
      \underbrace{N_d}_{\text{누적 cost}}&=\sum_{t<T^\star}d(x_t)\\[3pt]
      \underbrace{D_\pi(x_0)}_{\text{기대 cost}}&=\mathbb E_\pi[N_d\mid x_0]\le d_0
    \end{aligned}`,
    formulaNote: '원 논문의 주 분석은 finite expected stopping time을 갖는 transient CMDP다. Discounted formulation으로 옮기려면 contraction과 indexing contract를 다시 정해야 한다.',
    callout: 'Obstacle를 한 번 밟을 때 cost 1이라는 expected count 제약은 “충돌 확률 0”과 다르다. Safety requirement의 확률적 의미를 먼저 고정해야 한다.',
    owner: 'Transient CMDP specification',
    output: 'global task objective · safety budget',
    invariant: 'global expected cost is not silently changed into event probability',
  },
  {
    eyebrow: '02 · Feasible baseline creates slack',
    title: '이미 안전한 baseline의 남은 budget을 미래 state에 쓸 auxiliary cost로 배분한다',
    body: 'Baseline πB의 cumulative constraint value가 d₀보다 작아야 positive slack이 생긴다. 논문은 LP로 auxiliary cost ε를 구성하고 baseline cost에 더한 value를 state별 Lyapunov budget Lε로 사용한다.',
    icon: Gauge,
    layout: 'flow',
    items: [
      {
        label: 'Safe baseline',
        value: 'Dπᴮ(x₀) ≤ d₀',
        detail: 'Constraint-minimizing policy처럼 알고 있는 feasible 시작점',
        tone: 'green',
      },
      {
        label: 'Initial slack',
        value: 'B = d₀ − Dπᴮ(x₀)',
        detail: 'Baseline이 아직 쓰지 않은 global safety budget',
        tone: 'cyan',
      },
      {
        label: 'Auxiliary cost',
        value: 'ε(x) ≥ 0',
        detail: 'LP가 state별 개선 여유로 배분하는 shaping quantity',
        tone: 'violet',
      },
      {
        label: 'Lyapunov budget',
        value: 'Lε = value of d+ε',
        detail: 'Immediate cost와 future budget을 비교할 state potential',
        tone: 'gold',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{B}_{\text{initial slack}}
      &=d_0-D_{\pi_B}(x_0)\\[3pt]
      \underbrace{\widetilde d(x)}_{\text{certificate용 shaped cost}}
      &=d(x)+\widetilde\epsilon(x)\\[3pt]
      \underbrace{L_{\widetilde\epsilon}(x)}_{\text{state cost-value 상한}}
      &=\mathbb E_{\pi_B}\!\left[
      \sum_{t=0}^{T^\star-1}\widetilde d(x_t)
      \,\middle|\,x_0=x\right]
    \end{aligned}`,
    formulaNote: 'tilde-epsilon=0이면 baseline constraint value 자체가 valid Lyapunov function이지만 feasible set이 좁을 수 있다. 더 큰 nonnegative tilde-epsilon은 useful improvement 공간을 넓히되 L(x₀)≤d₀를 지켜야 한다.',
    callout: 'Feasible baseline이 없으면 “안전하게 개선”할 기준과 slack이 없다. 이 논문은 unsafe random initialization에서 자동으로 safe policy를 발견하는 해법이 아니다.',
    owner: 'Baseline evaluator + auxiliary-cost LP',
    output: 'constructed state budget Lε',
    invariant: 'initial Lyapunov budget remains below d₀',
  },
  {
    eyebrow: '03 · Bellman inequality becomes a gate',
    title: 'Action의 즉시 cost와 다음 Lyapunov budget을 합쳐 current budget 안에 드는 mixture만 남긴다',
    body: '각 action은 one-step Lyapunov backup QL을 가진다. Candidate policy가 action probability로 만든 평균 backup이 L(s)를 넘지 않으면 그 state의 local feasible set에 속한다.',
    icon: ShieldCheck,
    layout: 'flow',
    items: [
      {
        label: 'Immediate cost',
        value: 'd(s)',
        detail: '현재 state에서 바로 발생하는 constraint cost',
        tone: 'red',
      },
      {
        label: 'Future budget',
        value: 'E[L(s′)|s,a]',
        detail: 'Action 뒤 transition에서 참조할 future cost-value certificate',
        tone: 'cyan',
      },
      {
        label: 'Action backup',
        value: 'Qᴸ(s,a)',
        detail: 'Immediate cost와 next budget을 합친 action별 요구량',
        tone: 'violet',
      },
      {
        label: 'Policy gate',
        value: 'Σₐπ(a|s)Qᴸ ≤ L(s)',
        detail: 'Action mixture의 평균 요구량이 current budget 이내',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{m_L(s,a)}_{\text{다음 certificate 평균}}
      &=\mathbb E[L(s')\mid s,a]\\[3pt]
      \underbrace{Q_L(s,a)}_{\text{one-step budget 요구}}
      &=d(s)+m_L(s,a)\\[3pt]
      \underbrace{B_L(s,\pi)}_{\text{candidate backup}}
      &=\sum_a\pi(a\mid s)Q_L(s,a)\\[3pt]
      \underbrace{\sigma_L(s,\pi)}_{\text{local safety slack}}
      &=L(s)-B_L(s,\pi)\\[3pt]
      \pi(\cdot\mid s)\in\mathcal F_L(s)
      &\Longleftrightarrow \sigma_L(s,\pi)\ge0
    \end{aligned}`,
    formulaNote: 'Deterministic action 하나만 검사하는 것이 아니라 stochastic action distribution 전체의 expected backup을 제한한다. Model이나 QL estimate가 틀리면 계산한 slack도 틀린다.',
    callout: 'Local inequality는 단순한 per-step cost cap이 아니다. 다음 state에서 쓸 cumulative budget을 함께 당겨와 지금의 action mixture를 판정한다.',
    owner: 'Lyapunov action-value evaluator',
    output: 'state-wise feasible policy polytope',
    invariant: 'every accepted mixture has nonnegative local slack',
  },
  {
    eyebrow: '04 · Bootstrap safe improvement',
    title: '현재 feasible policy를 새 baseline으로 삼아 budget과 허용 set을 다시 계산한다',
    body: 'SPI는 baseline을 평가하고 Lyapunov function을 만든 뒤 local feasible set 안에서 task objective를 개선한다. Tabular proof의 consistent feasibility와 neural SDPI·SDQN의 approximate behavior는 같은 보증 수준이 아니다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [
      {
        label: 'Evaluate',
        value: 'πₖ의 Cπ · Dπ',
        detail: 'Task value와 constraint value를 current baseline 아래 계산',
        tone: 'cyan',
      },
      {
        label: 'Construct',
        value: 'Lεₖ · Fᴸₖ',
        detail: '남은 budget으로 state별 local feasible set 생성',
        tone: 'violet',
      },
      {
        label: 'Improve',
        value: 'πₖ₊₁ ∈ Fᴸₖ',
        detail: '허용 set 안에서 task cost를 낮출 policy 선택',
        tone: 'green',
      },
      {
        label: 'Bootstrap',
        value: 'πB ← πₖ₊₁',
        detail: '새 feasible policy를 다음 iteration의 baseline으로 사용',
        tone: 'gold',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{\pi_{k+1}(\cdot\mid s)}_{\text{새 local policy}}
      &\in
      \arg\min_{\pi\in\mathcal F_{L_k}(s)}
      \underbrace{\mathcal T_{\pi,c}[V_{\pi_k}](s)}_{\text{task improvement backup}}\\[3pt]
      \underbrace{D_{\pi_k}(x_0)\le d_0}_{\text{현재 feasible}}
      &\Longrightarrow
      \underbrace{D_{\pi_{k+1}}(x_0)\le d_0}_{\text{tabular SPI의 consistent feasibility}}
    \end{aligned}`,
    formulaNote: '오른쪽 implication은 exact tabular construction과 논문 assumptions의 결과다. Function approximation, distillation, finite replay에서는 value/policy error를 별도로 측정해야 한다.',
    callout: 'SDQN·SDPI에서 network가 constraint value를 낮게 예측하면 수식상 feasible한 action도 실제로 budget을 넘는다. Approximation error를 theorem 뒤에 숨기지 않는다.',
    owner: 'Safe policy/value iteration',
    output: 'improved feasible baseline candidate',
    invariant: 'proof scope and approximation scope remain separate',
  },
  {
    eyebrow: '05 · Guarantee and evidence boundary',
    title: 'Local-to-global 논리는 expected cumulative cost를 묶지만 catastrophic event의 확률을 자동으로 제한하지 않는다',
    body: '모든 state에서 Bellman inequality를 지키면 repeated backup으로 initial constraint value가 L(x₀) 아래에 묶인다. 원 논문의 deep experiment는 25×25 stochastic gridworld family이며 continuous robot deployment의 formal certificate가 아니다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      {
        label: 'Tabular theory',
        value: 'Consistent feasibility under transient assumptions',
        detail: 'Feasible baseline과 exact local set으로 SPI·SVI policy sequence 분석',
        tone: 'green',
      },
      {
        label: 'Deep evidence',
        value: 'SDPI·SDQN on stochastic gridworld',
        detail: 'Value approximation과 distillation을 넣어 safe-learning 경향 평가',
        tone: 'green',
      },
      {
        label: 'Required conditions',
        value: 'Baseline · stopping-time bound · accurate value',
        detail: '하나라도 깨지면 local inequality가 true cumulative cost를 묶지 못함',
        tone: 'red',
      },
      {
        label: '입증하지 않음',
        value: 'Chance constraint · nonlinear robot hard safety',
        detail: 'Expected count와 event probability는 같지 않으며 유용한 chance bound에는 작은 budget이 필요',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{g_L(s)}_{\text{local certificate gap}}
      &=L(s)-\mathcal T_{\pi,d}[L](s)\\[3pt]
      \underbrace{g_L(s)\ge0\quad\forall s}_{\text{모든 local backup 허용}}
      &\Longrightarrow D_\pi(x_0)\le L(x_0)\\[3pt]
      \underbrace{L(x_0)\le d_0}_{\text{initial 상한}}
      &\Longrightarrow
      \underbrace{D_\pi(x_0)\le d_0}_{\text{global feasibility}}
    \end{aligned}`,
    formulaNote: '이 implication은 model, cost, baseline과 Lyapunov construction이 논문 조건을 만족할 때 성립한다. Learned critic의 confidence interval이나 runtime latency는 식에 들어 있지 않다.',
    callout: '여기서 Lyapunov는 “에너지가 매 step 줄어 robot가 안정하다”라는 전통 제어 claim과 동일하지 않다. CMDP constraint value의 upper-bound 역할을 한다.',
    owner: 'Proof-condition and experiment reviewer',
    output: 'local-to-global certificate scope',
    invariant: 'expected-cost feasibility is not renamed physical invariance',
  },
];

const recoveryScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Learn danger before task exploration',
    title: 'Task 성공 demo가 없어도 violation으로 끝나는 transition은 위험 경계를 먼저 가르칠 수 있다',
    body: 'Recovery RL은 online task policy가 위험을 직접 경험하기 전에 offline transition으로 safety critic과 recovery policy를 pretrain한다. 데이터는 constraint를 어기는 예를 포함해야 하지만 task를 잘 수행한 trajectory일 필요는 없다.',
    icon: Database,
    layout: 'compare',
    items: [
      {
        label: 'Offline input',
        value: '(s,a,s′,c) with violations',
        detail: 'Human-defined policy나 supervision으로 수집한 constraint boundary evidence',
        tone: 'cyan',
        metric: 'risk coverage',
      },
      {
        label: 'Safety critic',
        value: 'Qrisk(s,a)',
        detail: 'Composite policy 아래 future violation signal을 Bellman regression',
        tone: 'violet',
        metric: 'detector',
      },
      {
        label: 'Recovery policy',
        value: 'πrec(a|s)',
        detail: 'Safety critic 값을 낮추는 action을 offline에서 먼저 학습',
        tone: 'green',
        metric: 'intervention',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{c_t}_{\text{constraint violation indicator}}
      &\in\{0,1\}\\[3pt]
      \underbrace{T_v}_{\text{첫 violation 시점}}
      &=\inf\{t:c_t=1\}\\[3pt]
      \underbrace{p_v(s,a)}_{\text{event probability}}
      &=\Pr_\pi(T_v<\infty\mid s,a)\\[3pt]
      \underbrace{\gamma_{\mathrm{risk}}=1}_{\text{시간 할인 없음}}
      &\Longrightarrow
      Q_{\mathrm{risk}}^\pi(s,a)=p_v(s,a)
    \end{aligned}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{c_t}_{\text{위반 표시}}&\in\{0,1\}\\[3pt]
      \underbrace{T_v}_{\text{첫 위반}}&=\inf\{t:c_t=1\}\\[3pt]
      \underbrace{p_v(s,a)}_{\text{위반 확률}}&=\Pr_\pi(T_v<\infty\mid s,a)\\[3pt]
      \gamma_{risk}=1&\Rightarrow Q_{risk}^\pi=p_v
    \end{aligned}`,
    formulaNote: 'γrisk<1이면 먼 violation을 더 작게 세는 discounted risk signal이다. 이때 Qrisk를 시간과 무관한 raw probability로 읽지 않는다.',
    callout: 'Offline pretraining은 위험 경험을 없애지 않는다. 누군가는 violation coverage를 수집해야 하며 deployment distribution의 새로운 hazard가 data 밖이면 critic은 알지 못할 수 있다.',
    owner: 'Offline safety dataset curator',
    output: 'pretrained risk critic · recovery controller',
    invariant: 'offline risk coverage is measured, not presumed',
  },
  {
    eyebrow: '02 · Terminal-gated safety Bellman target',
    title: '현재 violation이면 target을 1로 닫고 안전한 transition에서만 다음 위험을 이어 붙인다',
    body: 'Safety critic은 task reward critic과 target 의미가 다르다. 실제 environment에 실행되는 task-or-recovery composite policy의 next action을 따라 future risk를 bootstrap한다.',
    icon: BrainCircuit,
    layout: 'flow',
    items: [
      {
        label: 'Executed tuple',
        value: '(s,aexec,s′,c)',
        detail: 'Task 또는 recovery 중 실제 actuator에 보낸 action의 transition',
        tone: 'cyan',
      },
      {
        label: 'Next composite action',
        value: 'a′ ~ π',
        detail: '다음 state에서도 gate를 거치는 task/recovery composite behavior',
        tone: 'violet',
      },
      {
        label: 'Risk target',
        value: 'y = c+(1−c)γrv′',
        detail: 'Violation이면 bootstrap을 끊고 safe transition이면 future risk 연결',
        tone: 'gold',
      },
      {
        label: 'Critic regression',
        value: '(Qrisk−y)²',
        detail: 'Task return이 아니라 discounted violation signal을 맞춤',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{v'_{\mathrm{risk}}}_{\text{다음 위험}}
      &=\mathbb E_{a'\sim\pi}
      [Q_{\phi^-}^{\mathrm{risk}}(s',a')]\\[3pt]
      \underbrace{y_{\mathrm{risk}}}_{\text{safety critic target}}
      &=\underbrace{c}_{\text{현재 violation}}+
      (1-c)\gamma_{\mathrm{risk}}v'_{\mathrm{risk}}\\[3pt]
      \underbrace{q_{\mathrm{risk}}}_{\text{현재 critic prediction}}
      &=Q_\phi^{\mathrm{risk}}(s,a_{\mathrm{exec}})\\[3pt]
      \underbrace{\mathcal L_{\mathrm{risk}}}_{\text{critic regression}}
      &=\mathbb E[(q_{\mathrm{risk}}-y_{\mathrm{risk}})^2]
    \end{aligned}`,
    formulaNote: 'Target action distribution π는 filtered composite policy다. Task policy만 넣으면 recovery intervention이 만든 실제 future behavior와 Bellman target이 어긋난다.',
    callout: 'c=1에서 (1-c)가 빠지면 이미 끝난 violation transition 뒤의 risk를 다시 더한다. Terminal semantics는 작은 구현 detail이 아니라 critic target의 정의다.',
    owner: 'Executed-action replay + safety critic optimizer',
    output: 'updated Qrisk for composite behavior',
    invariant: 'violation target terminates; task reward never enters risk label',
  },
  {
    eyebrow: '03 · Runtime task-action gate',
    title: 'Task policy가 action을 제안한 뒤 그 action의 risk가 threshold를 넘을 때만 recovery가 실행된다',
    body: 'Gate는 현재 state만 보고 recovery를 켜는 것이 아니라 state-task-action tuple을 평가한다. 같은 state에서도 왼쪽 회피와 직진은 서로 다른 risk를 가질 수 있다.',
    icon: ShieldCheck,
    layout: 'flow',
    items: [
      {
        label: 'Task proposal',
        value: 'atask ~ πtask(s)',
        detail: 'Task reward만 최적화하는 policy의 아직 실행 전 action',
        tone: 'cyan',
      },
      {
        label: 'Risk query',
        value: 'qtask = Qrisk(s,atask)',
        detail: '그 proposal 뒤 future violation signal을 평가',
        tone: 'gold',
      },
      {
        label: 'Safe branch',
        value: 'qtask ≤ ε → atask',
        detail: 'Threshold 안이면 task action을 environment에 전달',
        tone: 'green',
      },
      {
        label: 'Recovery branch',
        value: 'qtask > ε → arec',
        detail: '위험하면 별도 recovery policy가 actuator action을 대체',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{q_t^{\mathrm{task}}}_{\text{proposal의 predicted risk}}
      &=Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})\\[3pt]
      \underbrace{a_t^{\mathrm{exec}}}_{\text{실제 actuator action}}
      &=
      \begin{cases}
        a_t^{\mathrm{task}},&q_t^{\mathrm{task}}\le\epsilon_{\mathrm{risk}}\\
        a_t^{\mathrm{rec}},&q_t^{\mathrm{task}}>\epsilon_{\mathrm{risk}}
      \end{cases}
    \end{aligned}`,
    formulaNote: '낮은 ε는 더 자주 개입해 task progress를 막을 수 있고 높은 ε는 recoverable region을 지나서야 개입할 수 있다. Threshold는 accuracy 숫자 하나가 아니라 task-safety operating point다.',
    callout: 'Risk detector가 맞아도 recovery action이 실제 dynamics에서 위험을 낮춘다는 보장은 별도다. Gate와 controller를 하나의 “shield accuracy”로 합치지 않는다.',
    owner: 'Runtime risk gate + recovery policy',
    output: 'executed task or recovery action',
    invariant: 'proposal, score, and executed action remain separately logged',
  },
  {
    eyebrow: '04 · Modified dynamics and dual replay',
    title: 'Environment 사실에는 executed action을, task learner에는 proposed action을 기록한다',
    body: 'Recovery가 개입하면 task proposal과 실제 action이 달라진다. Safety critic과 recovery policy는 실제 transition을 배우고, task policy는 자기 proposal이 filtered environment에서 어떤 결과를 만들었는지 action relabeling으로 배운다.',
    icon: Network,
    layout: 'timeline',
    items: [
      {
        label: 'Proposal',
        value: 'atask',
        detail: 'Task policy가 원래 내려고 한 action',
        tone: 'cyan',
      },
      {
        label: 'Intervention',
        value: 'aexec = arec',
        detail: 'Gate가 바꿔 실제 environment에 실행된 recovery action',
        tone: 'red',
      },
      {
        label: 'Observed outcome',
        value: 's′ · r · c',
        detail: 'Recovery가 포함된 modified dynamics의 실제 결과',
        tone: 'gold',
      },
      {
        label: 'Two replay views',
        value: 'Dtask · Drec',
        detail: 'Task에는 proposal, recovery/risk에는 executed action 저장',
        tone: 'green',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{z_{\mathrm{task}}}_{\text{proposal-labeled tuple}}
      &=(s,a_{\mathrm{task}},r,s')\\[3pt]
      \underbrace{z_{\mathrm{rec}}}_{\text{executed-action tuple}}
      &=(s,a_{\mathrm{exec}},c,s')\\[3pt]
      \mathcal D_{\mathrm{task}}&\leftarrow\mathcal D_{\mathrm{task}}\cup\{z_{\mathrm{task}}\}\\
      \mathcal D_{\mathrm{rec}}&\leftarrow\mathcal D_{\mathrm{rec}}\cup\{z_{\mathrm{rec}}\}
    \end{aligned}`,
    formulaNote: '두 tuple은 같은 s′를 보지만 action과 label 의미가 다르다. 하나의 replay schema로 덮어쓰면 task dynamics 또는 safety critic 중 하나의 provenance가 틀어진다.',
    callout: 'Action relabeling은 “실제로 task action이 실행됐다”는 역사 수정이 아니다. Recovery가 포함된 modified transition kernel에서 task proposal의 consequence를 학습시키는 의도적 contract다.',
    owner: 'Composite transition logger',
    output: 'proposal-labeled task replay · executed-action safety replay',
    invariant: 'physical fact and learner-specific relabel are both retained',
  },
  {
    eyebrow: '05 · Empirical shield, physical deadline',
    title: '원 논문은 violation을 줄였지만 많은 실패에서 recovery는 이미 켜져 있었다',
    body: 'Ablation은 offline pretraining과 action relabeling의 중요성을 보였고, failure analysis는 detector보다 recovery execution이 실패한 사례를 드러냈다. 실제 배포에서는 detection 뒤 남은 제동·회피 시간이 양수인지 별도 계산해야 한다.',
    icon: Timer,
    layout: 'boundary',
    items: [
      {
        label: '실험이 지지',
        value: '6 simulation domains · physical visual task',
        detail: '5개 prior method보다 success-to-violation tradeoff 개선 보고',
        tone: 'green',
      },
      {
        label: '핵심 ablation',
        value: 'Offline pretrain + action relabel',
        detail: '둘을 제거하면 task success와 violation tradeoff가 악화',
        tone: 'green',
      },
      {
        label: 'Failure evidence',
        value: 'Recovery active, violation still occurs',
        detail: '대부분 task는 active failure, image obstacle avoidance는 inactive failure가 주류',
        tone: 'red',
      },
      {
        label: '입증하지 않음',
        value: 'Formal safety · unseen hazard · hard real-time',
        detail: 'Physical experiment 3 runs와 empirical ratio는 universal certificate가 아님',
        tone: 'red',
      },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{t_{\mathrm{logic}}}_{\text{판정·handoff 시간}}
      &=t_{\mathrm{detect}}+t_{\mathrm{gate}}\\[3pt]
      \underbrace{t_{\mathrm{physical}}}_{\text{actuation·회복 시간}}
      &=t_{\mathrm{act}}+t_{\mathrm{stop}}\\[3pt]
      \underbrace{t_{\mathrm{used}}}_{\text{총 개입 시간}}
      &=t_{\mathrm{logic}}+t_{\mathrm{physical}}\\[3pt]
      \underbrace{m_{\mathrm{time}}}_{\text{물리 intervention margin}}
      &=\mathrm{TTC}-t_{\mathrm{used}}
    \end{aligned}`,
    formulaNote: '이 timing 식은 논문의 theorem이 아니라 paper architecture를 실제 system에 옮길 때 필요한 deployment diagnostic이다. m_time≤0이면 classifier가 맞아도 개입이 늦다.',
    callout: 'Recovery RL의 정확한 claim은 formal shield가 아니라 offline risk knowledge와 dual-policy runtime gate가 해당 실험에서 violation-performance tradeoff를 개선했다는 것이다.',
    owner: 'Deployment evaluator',
    output: 'detector/controller failure split · timing margin',
    invariant: 'empirical intervention is not promoted to formal safety',
  },
];

export function CpoMechanismViz() {
  return (
    <div data-safe-policy-paper-viz="cpo">
      <PaperSceneViz
        scenes={cpoScenes}
        ariaLabel="CPO · reward-cost 분리에서 local QCQP, line search와 near-constraint evidence boundary까지"
      />
    </div>
  );
}

export function LyapunovSafeMechanismViz() {
  return (
    <div data-safe-policy-paper-viz="lyapunov">
      <PaperSceneViz
        scenes={lyapunovScenes}
        ariaLabel="Lyapunov Safe RL · global expected-cost budget에서 state별 local feasible policy와 보장 경계까지"
      />
    </div>
  );
}

export function RecoveryRlMechanismViz() {
  return (
    <div data-safe-policy-paper-viz="recovery">
      <PaperSceneViz
        scenes={recoveryScenes}
        ariaLabel="Recovery RL · offline violation data에서 safety critic, runtime action gate, dual replay와 physical deadline까지"
      />
    </div>
  );
}
