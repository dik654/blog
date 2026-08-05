import type { PaperStudySpec } from './FoundationalPaperStudy';

export const cpo2017Spec: PaperStudySpec = {
  shortTitle: 'Constrained Policy Optimization',
  citation: 'Joshua Achiam, David Held, Aviv Tamar, Pieter Abbeel — Constrained Policy Optimization',
  yearVenue: '2017 · ICML / PMLR 70',
  sourceUrl: 'https://proceedings.mlr.press/v70/achiam17a.html',
  appendixUrl: 'https://proceedings.mlr.press/v70/achiam17a/achiam17a-supp.pdf',
  before: 'Deep policy search는 locomotion과 manipulation을 학습했지만 reward에 penalty를 섞는 방식은 penalty coefficient에 민감했다. Primal-dual 방식은 수렴점의 constraint를 목표로 할 뿐 학습 중 policy가 예산을 크게 넘는 것을 막지 못했고, exact CMDP policy evaluation은 high-dimensional sampling setting에서 어렵다.',
  authorIntent: '두 policy의 expected return 차이를 average divergence로 묶는 새 bound를 만들고, 현재 policy의 on-policy sample만으로 reward improvement와 auxiliary cost constraint를 함께 근사하는 general-purpose trust-region policy search를 유도하려 했다.',
  thesis: 'Reward·cost surrogate와 average KL trust region을 동시에 제한하면 neural policy도 local constrained step으로 개선할 수 있고, practical approximation에서도 primal-dual·fixed penalty보다 constraint limit을 안정적으로 추적할 수 있다.',
  readerBridge: [
    { term: 'Auxiliary cost', latex: String.raw`C_i`, plain: 'Task reward와 별도로 기록하는 위반 신호다. 충돌 횟수, 위험 구역 체류 시간처럼 “하지 말아야 할 일”을 수치화한다.', role: 'Reward를 희생해 penalty 하나로 섞기 전에 독립 constraint return을 만든다.' },
    { term: 'Budget residual', latex: String.raw`c_i=J_{C_i}(\pi_k)-d_i`, plain: '현재 policy의 expected cost가 허용 예산보다 얼마나 위나 아래인지 나타낸다. 양수면 이미 초과한 상태다.', role: '이번 local step이 확보해야 할 safety half-space의 위치를 정한다.' },
    { term: 'Surrogate', plain: '새 policy를 실제로 오래 실행하지 않고 current rollout의 advantage와 probability ratio로 예상 reward·cost 변화를 근사한 값이다.', role: 'On-policy batch 하나로 후보 policy update를 비교하되 true return과 같다고 가정하지 않는다.' },
    { term: 'Trust region', latex: String.raw`\bar D_{\mathrm{KL}}\le\delta`, plain: '새 policy가 current policy에서 한 번에 너무 멀리 가지 못하게 하는 평균 KL 허용 영역이다.', role: 'Surrogate와 actual return의 차이가 폭주하지 않도록 local update 크기를 제한한다.' },
  ],
  reconstruction: [
    { label: 'On-policy rollout', value: 'tau ~ pi_k', note: 'reward·cost sample' },
    { label: 'Local models', value: 'g, b, c, H', note: 'linear·quadratic approximation' },
    { label: 'Constrained solve', value: 'dual -> Delta theta', note: 'cost·KL 안의 reward step' },
    { label: 'Line search', value: 'accept / recover', note: 'sample surrogate 재검사' },
  ],
  mechanism: [
    'Current policy trajectory에서 reward advantage와 각 auxiliary cost advantage를 추정한다.',
    '새 policy의 state distribution을 직접 평가하지 않고 current distribution의 importance-weighted surrogate로 objective와 constraint를 만든다.',
    'Average KL을 trust region으로 제한해 surrogate와 실제 return의 차이를 divergence-dependent bound로 묶는다.',
    'Reward와 cost를 parameter 주변에서 linearize하고 KL은 Fisher Hessian의 quadratic form으로 근사해 convex QCQP와 작은 dual problem을 푼다.',
    'Conjugate gradient로 inverse-Fisher vector product를 구하고 backtracking line search로 empirical surrogate constraint와 KL을 다시 검사한다.',
    'Approximate problem이 infeasible하면 reward를 잠시 포기하고 constraint value를 낮추는 recovery direction으로 이동한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{u}_{\text{이번 parameter step}}&=\Delta\theta\\
      \underbrace{r_C(u)}_{\text{cost residual}}&=c+b^\top u\\
      \underbrace{q_{\mathrm{KL}}(u)}_{\text{policy 이동량}}&=\frac12u^\top H u\\
      \underbrace{u^\star}_{\text{reward 최적 step}}&=\arg\max_u g^\top u\\
      \underbrace{r_C(u^\star)\le0}_{\text{cost 영역 안}}
      &,\qquad
      \underbrace{q_{\mathrm{KL}}(u^\star)\le\delta}_{\text{trust 영역 안}}
    \end{aligned}`,
    meaning: '원 CPO update를 parameter theta_k 주변에서 근사한 practical single-constraint QCQP(quadratically constrained quadratic program, 이차 제약이 있는 이차 최적화 문제)다. Reward surrogate는 g로 선형화하고, 현재 cost-budget gap c와 cost gradient b가 feasible half-space를 만들며, Fisher curvature H가 KL trust-region ellipsoid를 만든다.',
    symbols: [[String.raw`\Delta\theta`, '이번 policy parameter update'], [String.raw`g`, 'Reward surrogate gradient'], [String.raw`c=J_C(\pi_k)-d`, '현재 constraint 초과량'], [String.raw`b`, 'Constraint surrogate gradient'], [String.raw`H`, 'Average KL의 Hessian 또는 Fisher matrix']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{k_\gamma}_{\text{discount 증폭}}
      &=\frac{\gamma}{(1-\gamma)^2}\\
      \underbrace{e_C}_{\text{worst-state cost scale}}
      &=\epsilon_C^{\pi_{k+1}}\\
      \underbrace{r_\delta}_{\text{true-cost 잔여 간격}}
      &=\sqrt{2\delta}\,k_\gamma e_C\\
      \underbrace{j_C^{\mathrm{new}}}_{\text{새 actual expected cost}}
      &=J_C(\pi_{k+1})\\
      \underbrace{j_C^{\mathrm{new}}-d}_{\text{budget 위의 worst case}}
      &\le r_\delta
    \end{aligned}`,
    meaning: 'CPO surrogate를 만족한 next policy의 true constraint return에 대한 worst-case upper bound다. Budget d를 정확히 넘지 않는다는 식이 아니라 trust-region delta, discount gamma와 cost-advantage scale에 비례하는 residual violation 항이 남는다.',
    symbols: [[String.raw`J_C(\pi_{k+1})`, '새 policy의 actual expected constraint return'], [String.raw`d`, 'CMDP cost limit'], [String.raw`\delta`, 'Average KL trust-region 크기'], [String.raw`\epsilon_C^{\pi_{k+1}}`, 'State별 expected cost advantage의 최대 절댓값']],
  }],
  evidence: [
    { label: 'CPO vs PDO', question: '학습 중 constraint limit을 primal-dual보다 안정적으로 추적하는가?', intervention: 'Point·Ant·Humanoid Circle과 Point·Ant Gather, 총 5개 simulated task에서 CPO, primal-dual optimization(PDO), unconstrained TRPO를 비교한다. Humanoid-Gather는 포함되지 않았다.', observation: 'CPO는 대부분의 환경에서 constraint return을 limit 근처로 빠르게 가져가고 유지한 반면 PDO는 over·under-correction과 중간 violation spike를 보였다.', supports: 'Dual variable을 매 update의 constrained solve에서 새로 계산하는 local policy step이 실험 설정에서 constraint tracking을 개선한다는 주장을 지지한다.', limit: '실제 robot, sensor error, catastrophic single event나 multi-constraint neural policy에서 hard safety를 입증하지 않는다.' },
    { label: 'Penalty & shaping', question: 'Constraint가 fixed penalty보다 해석 가능하고 cost shaping이 approximation error를 줄이는가?', intervention: 'Ant-Circle에서 fixed penalty 1·5·50과 CPO를 비교하고 CPO의 original cost와 upper-bound shaped cost를 ablate한다.', observation: 'Penalty 1은 큰 constraint cost를, 5는 reward를 거의 못 배우는 behavior를 만들었고 cost shaping은 CPO의 true constraint adherence를 개선했다.', supports: '원하는 budget을 penalty coefficient로 간접 맞추는 것보다 explicit constraint가 안정적이라는 근거를 제공한다.', limit: '제안한 shaping model이 모든 sparse safety signal에서 보수적 upper bound임을 보장하지 않는다.' },
  ],
  implementation: ['Circle 형태의 작은 continuous-control CMDP에서 reward와 binary cost를 별도 trajectory field로 저장한다.', 'Current policy batch에서 reward critic·cost critic과 각 GAE-lambda를 별도 ledger로 추정하고, trajectory length에 따른 cost-gradient rescaling까지 명시한다.', 'Autograd로 g·b를, Hessian-vector product로 H 연산을 구현하고 QCQP의 feasibility case를 unit test한다.', 'Conjugate-gradient residual, proposed KL, line-search acceptance, actual cost와 recovery-step 횟수를 iteration마다 기록한다.', 'PDO와 fixed penalty를 같은 rollout·network·trust-region budget으로 비교하고 seed별 violation spike를 숨기지 않는다.'],
  assumptions: ['Formal iterative argument의 initial policy는 constraint-feasible하다. Practical recovery direction은 이 가정을 대신하거나 theorem을 자동 복구하지 않는다.', 'On-policy sample이 reward·cost advantage와 average KL을 충분히 정확히 추정한다.', '작은 trust region에서 objective·constraint의 1차 근사와 KL의 2차 근사가 유효하다.', 'Expected discounted cost constraint가 application의 safety requirement와 맞는다.'],
  failures: ['Finite sample과 function approximation error 때문에 practical CPO가 true budget을 넘을 수 있다.', 'Average KL은 일부 state에서의 큰 policy shift를 숨길 수 있다.', 'Rare catastrophic event가 batch에 거의 없으면 cost gradient가 위험 방향을 보지 못한다.', 'Safe initial policy가 지나치게 보수적이면 feasible boundary 안에서 useful exploration을 찾지 못할 수 있다.'],
  legacy: 'CPO는 CMDP를 deep policy optimization의 explicit constraint problem으로 가져오고, reward penalty와 학습 중 constraint tracking을 분리하는 기준선이 되었다. 후속 Lagrangian PPO, FOCOPS, PID multiplier 계열은 solve 비용과 scalability를 바꾸지만 보장 시점과 surrogate gap을 다시 확인해야 한다.',
  nextReading: 'Lyapunov-based Safe RL은 episode 전체 cost constraint를 state별 local feasible action set으로 바꾸어, 매 policy improvement step의 consistent feasibility를 다른 방식으로 구성한다.',
  nextLinks: [
    { slug: 'paper-lyapunov-safe-rl-2018', label: 'Lyapunov Safe RL 2018', reason: 'Global expected-cost budget을 state별 local feasible action set으로 바꾸는 다음 안전 제약 설계를 비교한다.' },
  ],
  capabilities: ['CPO의 theoretical return bound와 practical QCQP를 같은 보장으로 부르지 않는다.', 'g, b, c, H를 rollout tensor와 autograd operation으로 매핑한다.', 'Constraint violation bound의 residual 항이 delta와 gamma에 어떻게 의존하는지 해석한다.', 'CPO, primal-dual, fixed penalty의 dual-variable 처리 차이를 설명한다.'],
};

export const lyapunovSafe2018Spec: PaperStudySpec = {
  shortTitle: 'Lyapunov Safe RL',
  citation: 'Yinlam Chow, Ofir Nachum, Edgar Duenez-Guzman, Mohammad Ghavamzadeh — A Lyapunov-based Approach to Safe Reinforcement Learning',
  yearVenue: '2018 · NeurIPS 31',
  sourceUrl: 'https://papers.nips.cc/paper_files/paper/2018/hash/4fe5149039b52765bde64beb9f674940-Abstract.html',
  appendixUrl: 'https://papers.nips.cc/paper_files/paper/2018/file/4fe5149039b52765bde64beb9f674940-Supplemental.zip',
  before: 'CMDP의 global expected-cost constraint는 trajectory 전체에서만 평가되어 current state의 어떤 action을 허용할지 직접 말해주지 않았다. Step-wise surrogate는 쉽게 enforce되지만 지나치게 보수적이고, Lagrangian methods는 학습 중 feasible iterate를 보장하지 못했으며, 기존 Lyapunov 설계는 domain-specific hand crafting이 필요했다.',
  authorIntent: 'Feasible baseline policy에서 generic CMDP constraint를 위한 Lyapunov function을 체계적으로 만들고, global cost budget을 각 state의 local linear policy constraint로 바꾸어 standard DP와 RL algorithm을 safe counterpart로 변환하려 했다.',
  thesis: 'Baseline policy의 constraint value에 auxiliary cost를 더한 Lyapunov upper bound를 만들고 Bellman backup이 이를 넘지 않는 local policy만 허용하면, exact tabular SPI·SVI에서는 expected cumulative cost feasibility를 일관되게 유지하며 policy를 개선할 수 있다. Deep SDPI·SDQN은 value·distillation error가 작은 별도 근사 경로다.',
  readerBridge: [
    { term: 'Feasible baseline', latex: String.raw`\pi_B`, plain: '이미 initial-state cumulative safety cost가 budget 아래인 출발 policy다.', role: 'Lyapunov budget을 만들고 다음 update의 안전성을 비교할 기준점이다.' },
    { term: 'Global budget', latex: String.raw`D_\pi(x_0)\le d_0`, plain: 'Episode가 끝날 때까지 누적될 expected safety cost 전체에 대한 제한이다.', role: '각 state action을 직접 판정하지 못하는 원래 CMDP 요구사항이다.' },
    { term: 'Lyapunov function', latex: String.raw`L(s)`, plain: '이 논문에서는 물리 에너지 그 자체가 아니라 state별로 앞으로 쓸 수 있는 cumulative safety-cost 상한이다.', role: 'Global budget을 여러 local Bellman inequality가 이어받게 한다.' },
    { term: 'Local feasible set', latex: String.raw`\mathcal F_L(s)`, plain: 'Immediate cost와 다음 state의 L을 합쳐도 현재 L을 넘지 않는 action distribution의 집합이다.', role: 'Policy improvement가 state마다 선택할 수 있는 action mixture를 제한한다.' },
  ],
  reconstruction: [
    { label: 'Feasible baseline', value: 'pi_B, D_piB <= d', note: '안전한 시작점' },
    { label: 'Lyapunov certificate', value: 'L_epsilon(s)', note: '실시간 counter가 아닌 state별 cost-value 상한' },
    { label: 'Local feasible set', value: 'T_pi,C[L] <= L', note: 'action distribution 제한' },
    { label: 'Safe improvement', value: 'SPI / SDPI / SDQN', note: 'baseline을 bootstrap' },
  ],
  mechanism: [
    'Transient CMDP와 initial state의 cumulative constraint budget d를 정의하고 feasible baseline policy pi_B를 준비한다.',
    'Existence lemma의 signed auxiliary cost epsilon과, 실제로 계산하는 LP가 찾는 nonnegative auxiliary cost tilde-epsilon을 구분해 state별 Lyapunov function L을 구성한다.',
    'Initial state에서 L이 d 아래이고 baseline Bellman operator가 L을 증가시키지 않는 조건을 만족시킨다.',
    '각 state에서 candidate policy의 cost Bellman backup이 L(s)를 넘지 않는 local linear feasible set F_L(s)를 만든다.',
    '그 feasible set 안에서 task cost를 개선하고, 새 feasible policy를 다음 iteration의 baseline으로 삼아 L을 다시 계산한다.',
    'Large state space에서는 objective·constraint·stopping-time Q를 function approximation하고 policy distillation으로 local safe action distribution을 parameterized policy에 옮긴다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \mathcal L_{\pi_B}(s_0,d)=
      \bigl\{L\ge0:\;&
      \underbrace{\mathcal T_{\pi_B,C}[L](s)\le L(s)}_{\text{baseline backup이 budget을 늘리지 않음}},\\[-1pt]
      &\underbrace{L(s_0)\le d}_{\text{initial global budget 안}}\bigr\}
    \end{aligned}`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{\mathcal T_{\pi_B,C}[L](s)\le L(s)}_{\text{한 step 뒤에도 예산 안}}\\[2pt]
      \underbrace{L(s_0)\le d}_{\text{출발점도 총예산 안}}\\[2pt]
      \underbrace{L\in\mathcal L_{\pi_B}}_{\text{두 조건을 만족한 상한}}
    \end{aligned}`,
    meaning: 'Feasible baseline policy pi_B에 대한 Lyapunov function 집합이다. 모든 state에서 baseline의 immediate constraint cost와 next potential을 합친 backup이 current potential을 넘지 않고, initial potential도 total budget 안에 있어야 한다.',
    symbols: [[String.raw`\pi_B`, '이미 constraint를 만족하는 baseline policy'], [String.raw`\mathcal T_{\pi_B,C}`, 'Baseline과 safety cost C의 Bellman operator'], [String.raw`L(s)`, 'State별 cumulative cost upper bound'], [String.raw`s_0,d`, 'Initial state와 global constraint budget']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{B_\pi(s)}_{\text{candidate one-step backup}}
      &=\mathcal T_{\pi,C}[L](s)\\
      \underbrace{\mathcal F_L(s)}_{\text{state별 허용 policy}}
      &=\{\pi(\cdot\mid s):B_\pi(s)\le L(s)\}\\
      \underbrace{D_\pi(s_0)\le L(s_0)}_{\text{local 반복의 결과}}
      &\le
      \underbrace{d}_{\text{global cost budget}}
    \end{aligned}`,
    meaning: 'Candidate policy가 한 step의 immediate safety cost와 next-state Lyapunov budget을 합쳐도 current budget을 늘리지 않는 action distribution만 local feasible set에 남긴다. 이 local inequality를 반복하면 initial cumulative cost가 L(s_0) 아래로 묶인다.',
    symbols: [[String.raw`\mathcal F_L(s)`, 'State s에서 허용되는 policy distribution'], [String.raw`\pi(\cdot\mid s)`, '현재 state의 candidate action distribution'], [String.raw`\mathcal T_{\pi,C}[L]`, 'Candidate policy의 one-step cost backup']],
  }],
  evidence: [
    { label: 'CMDP planning', question: 'Local Lyapunov surrogate가 global feasible policy를 지나치게 보수적이지 않게 찾는가?', intervention: '25x25 stochastic gridworld에서 obstacle density를 바꾸며 SPI·SVI를 step-wise surrogate, super-martingale, Lagrangian, dual LP와 비교한다.', observation: 'SPI는 density 범위에서 feasible하고 좋은 return을 유지했으며, SVI도 낮은 density에서 near-optimal이지만 density가 커지면 numerical instability가 나타났다.', supports: 'Constructed Lyapunov local set이 단순 step-wise surrogate보다 넓은 useful feasible policy를 포함할 수 있음을 지지한다.', limit: 'Continuous high-dimensional robot dynamics나 inaccurate neural critic에서 같은 guarantee를 직접 입증하지 않는다.' },
    { label: 'Safe RL', question: 'Unknown model과 deep function approximation에서도 safe update 경향을 유지하는가?', intervention: 'Discrete·image observation과 budget d=1·5에서 SDPI·SDQN을 unconstrained와 extensively tuned Lagrangian baselines에 비교한다.', observation: 'SDPI·SDQN은 좋은 reward를 얻으면서 일단 safe policy를 찾은 뒤 updated policies가 safe하게 유지됐고 Lagrangian은 일부 setting에서 training constraint를 위반했다.', supports: 'Lyapunov constraint를 DQN·policy improvement에 넣는 practical 가능성을 보여준다.', limit: '논문도 function·policy approximation error가 낮다고 가정하며 실험은 하나의 stochastic gridworld family다.' },
  ],
  implementation: ['작은 absorbing gridworld에서 task cost, obstacle cost와 stopping time을 정확히 계산한다.', 'Constraint-minimizing baseline을 만들고 D_piB(s_0) <= d를 먼저 확인한다.', 'Auxiliary cost epsilon과 L을 tabular linear program으로 계산하고 state별 F_L(s)의 action probability polytope를 그린다.', 'SPI update 뒤 모든 state의 local inequality와 initial cumulative constraint를 exact evaluation으로 검증한다.', 'SDQN variant에서는 Q_D, Q_T approximation error와 distillation divergence를 따로 기록해 theorem 조건과 neural error를 분리한다.'],
  assumptions: ['모든 stationary policy의 terminal first-hitting time이 uniform bound를 갖는 transient CMDP이거나 discount contraction이 성립한다.', 'Initial feasible baseline policy를 알고 있다.', 'Optimal policy가 baseline에서 충분히 가까워 constructed feasible set 안에 들어오는 조건이 성립해야 optimality 주장까지 갈 수 있다.', 'Deep variant의 value와 policy approximation error가 local feasibility를 깨지 않을 만큼 작다.'],
  failures: ['Feasible baseline이 없으면 Lyapunov set construction의 출발점이 사라진다.', 'Auxiliary cost를 너무 보수적으로 잡으면 안전하지만 task improvement가 거의 없다.', 'Function approximation이 constraint value를 낮게 예측하면 local inequality가 true global cost를 묶지 못한다.', 'Expected obstacle count와 any-collision probability는 동일하지 않다. Nonnegative count에는 Markov bound가 생기지만 d0가 1 이상이면 chance-safety 요구에는 거의 쓸모없을 수 있다.'],
  legacy: '이 논문은 control theory의 Lyapunov 언어를 generic CMDP constraint와 연결하고 global-to-local safety transformation을 제시했다. 이후 Lyapunov actor-critic과 continuous-control safe policy optimization이 이 local constraint idea를 확장했다.',
  nextReading: 'Recovery RL은 optimization-time constraint만 보지 않고, offline violation data로 배포 순간 task action을 검사해 recovery policy로 전환하는 runtime shielding 구조를 만든다.',
  nextLinks: [{ slug: 'paper-recovery-rl-2021', label: 'Recovery RL 2021로 이어가기', reason: '학습 단계의 local feasible set에서 배포 시점의 risk gate와 recovery policy로 안전 책임이 어떻게 이동하는지 비교한다.' }],
  capabilities: ['Lyapunov function의 control-stability 의미와 이 논문의 CMDP cost-upper-bound 의미를 구분한다.', 'Local Bellman inequality가 global expected cost feasibility로 이어지는 반복 논리를 설명한다.', 'Feasible baseline, transient stopping time, approximation error의 역할을 빠뜨리지 않는다.', 'SPI·SVI와 SDPI·SDQN의 exact·approximate 보장 범위를 분리한다.'],
};

export const recoveryRl2021Spec: PaperStudySpec = {
  shortTitle: 'Recovery RL',
  citation: 'Thananjeyan et al. — Recovery RL: Safe Reinforcement Learning with Learned Recovery Zones',
  yearVenue: '2021 · IEEE Robotics and Automation Letters',
  sourceUrl: 'https://arxiv.org/abs/2010.15920',
  appendixUrl: 'https://sites.google.com/berkeley.edu/recovery-rl/home',
  before: 'Joint reward-safety optimization은 task policy를 보수적으로 만들거나 multiplier tuning에 민감했다. Robust control shield는 정확한 dynamics와 constraint knowledge를 요구하는 경우가 많았고, online RL이 danger zone을 배우려면 실제 robot이 먼저 violation을 경험해야 하는 모순이 있었다.',
  authorIntent: 'Task performance와 constraint satisfaction을 두 policy로 분리하고, 과거 violation transition으로 future risk와 recovery behavior를 interaction 전에 학습해 physical robot exploration의 violation을 줄이려 했다.',
  thesis: 'Offline data에서 safety critic과 recovery policy를 pretrain한 뒤 task action의 predicted future risk가 threshold를 넘을 때 recovery가 대신 실행하면, off-the-shelf task learner를 유지하면서 simulation과 physical visuomotor task의 success-to-violation tradeoff를 개선할 수 있다.',
  readerBridge: [
    { term: 'Offline violation data', latex: String.raw`\mathcal D_{\mathrm{offline}}`, plain: 'Task 성공 demo가 아니라 어떤 transition이 constraint violation로 이어지는지 보여 주는 사전 경험이다.', role: 'Online robot가 위험 구역을 처음부터 몸으로 배워야 하는 횟수를 줄인다.' },
    { term: 'Safety critic', latex: String.raw`Q_{\mathrm{risk}}(s,a)`, plain: 'Action 뒤 composite policy를 계속 따를 때 미래 violation signal이 얼마나 가까운지 추정한다.', role: 'Task action을 actuator에 보내기 전에 recovery set 여부를 판정한다.' },
    { term: 'Recovery set', latex: String.raw`\mathcal T_{\mathrm{rec}}`, plain: 'Predicted risk가 threshold보다 큰 state-action tuple의 집합이다.', role: 'Task policy와 recovery policy 사이의 runtime switch를 정의한다.' },
    { term: 'Action relabeling', plain: 'Environment에는 recovery action이 실행됐어도 task replay에는 task가 제안했던 action을 기록하는 학습 계약이다.', role: 'Task policy가 recovery로 바뀐 modified dynamics의 결과를 자기 제안과 연결해 같은 위험 action을 반복하지 않게 한다.' },
  ],
  reconstruction: [
    { label: 'Offline violations', value: 'D_offline', note: 'task success가 없어도 됨' },
    { label: 'Safety model', value: 'Q_risk + pi_rec', note: 'risk와 복구 pretrain' },
    { label: 'Action gate', value: 'Q_risk <= epsilon?', note: 'task 또는 recovery 실행' },
    { label: 'Dual replay', value: 'relabel task + true rec', note: '세 model online update' },
  ],
  mechanism: [
    'Binary violation indicator와 risk discount가 붙은 MDP를 만들고 future discounted violation risk Q_risk를 Bellman regression한다.',
    'Offline transition에 constraint-violating example을 포함시켜 task learning 전에 safety critic과 recovery policy를 pretrain한다.',
    '매 timestep task policy가 action을 제안하면 Q_risk(s,a_task)를 threshold epsilon_risk와 비교한다.',
    'Safe set이면 task action을, recovery set이면 model-free 또는 MPC recovery action을 실제 environment에 실행한다.',
    'Recovery buffer에는 실제 executed action과 cost를 저장하지만 task buffer에는 proposed task action으로 relabel한 transition을 저장한다.',
    'Task policy, recovery policy, safety critic을 composite policy experience로 계속 online update한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{v'_{\mathrm{risk}}}_{\text{다음 위험}}
      &=\mathbb E_{a_{t+1}\sim\pi}
      [Q_{\mathrm{risk}}^\pi(s_{t+1},a_{t+1})]\\
      \underbrace{y_t^{\mathrm{risk}}}_{\text{terminal-gated target}}
      &=
      \underbrace{c_t}_{\text{현재 violation}}
      +(1-c_t)\gamma_{\mathrm{risk}}
      \underbrace{v'_{\mathrm{risk}}}_{\text{안전할 때만 연결}}\\
      Q_{\mathrm{risk}}^\pi(s_t,a_t)
      &=y_t^{\mathrm{risk}}
    \end{aligned}`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{v'}_{\text{다음 위험}}&=\mathbb E_{a'\sim\pi}Q_{\rm risk}(s',a')\\[2pt]
      \underbrace{y}_{\text{위험 표적}}&=c+(1-c)\gamma_{\rm risk}v'\\[2pt]
      \underbrace{Q_{\rm risk}(s,a)}_{\text{현재 위험}}&=y
    \end{aligned}`,
    meaning: 'Violation state에서 episode가 끝난다는 가정 아래 future discounted violation probability를 추정하는 safety Bellman equation이다. c_t=1이면 미래 bootstrap을 차단하고, 안전 state면 next action의 risk estimate를 이어 붙인다.',
    symbols: [[String.raw`c_t`, '현재 state의 binary constraint violation'], [String.raw`\gamma_{\mathrm{risk}}`, 'Future violation information의 discount'], [String.raw`Q_{\mathrm{risk}}^\pi`, 'Composite policy를 따를 때의 discounted future risk']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{q_t^{\mathrm{task}}}_{\text{task proposal의 gate score}}
      &=Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})\\
      \underbrace{a_t}_{\text{environment에 실제 실행}}
      &=
      \begin{cases}
        a_t^{\mathrm{task}},&q_t^{\mathrm{task}}\le\epsilon_{\mathrm{risk}}\\
        a_t^{\mathrm{rec}},&q_t^{\mathrm{task}}>\epsilon_{\mathrm{risk}}
      \end{cases}
    \end{aligned}`,
    meaning: 'Task action의 predicted risk가 threshold 아래면 그대로 실행하고 recovery set이면 별도 recovery action을 실행하는 composite policy다. Action filter가 성공하려면 critic 분류뿐 아니라 recovery controller가 실제 dynamics에서 risk를 낮출 수 있어야 한다.',
    symbols: [[String.raw`a_t^{\mathrm{task}}`, 'Task reward policy의 proposed action'], [String.raw`a_t^{\mathrm{rec}}`, 'Recovery policy가 고른 executed action'], [String.raw`\epsilon_{\mathrm{risk}}`, 'Safe와 recovery set을 나누는 threshold']],
  }],
  evidence: [
    { label: 'Simulation & robot', question: 'Task와 recovery를 분리하면 joint optimization보다 success-violation tradeoff가 좋아지는가?', intervention: 'Navigation·visual navigation·contact-rich extraction 6개 simulation domain과 physical image-based obstacle avoidance에서 5개 safe RL baseline과 비교한다.', observation: '논문은 simulation에서 next-best method 대비 2~20배, physical experiment에서 3배 더 나은 success-to-violation tradeoff를 보고한다.', supports: 'Offline risk knowledge와 dual-policy gate가 해당 domain에서 task performance를 크게 잃지 않고 violation을 줄였다는 empirical 근거를 제공한다.', limit: 'Physical run은 3회이며 arbitrary robot, unseen hazard, formal safety probability에 대한 보장은 아니다.' },
    { label: 'Ablation & failures', question: 'Offline pretraining과 action relabeling이 실제로 필요한가, violation은 어느 component에서 생기는가?', intervention: 'Offline pretraining, online update, action relabeling, dataset size를 ablate하고 violation 시 recovery activation 여부를 task별로 분해한다.', observation: 'Offline pretraining과 action relabeling 제거가 성능을 크게 떨어뜨렸다. 대부분 task의 failure에서는 recovery가 이미 활성화됐지만 image obstacle avoidance는 주로 inactive 상태에서 실패해 detector와 controller failure가 task마다 달랐다.', supports: '사전 danger-zone data와 modified-dynamics relabeling이 핵심이며 safety critic 정확도만으로 전체 safety를 설명할 수 없음을 보여준다.', limit: 'Supplement의 “recovery error”에는 늦은 activation도 포함되므로 calibration, detection latency, dynamics error와 actuator limit을 완전히 식별한 분해는 아니다.' },
  ],
  implementation: ['Binary violation terminal과 gamma_risk를 명시한 small navigation MDP를 만든다.', 'Offline dataset에서 safe near-miss와 actual violation의 coverage를 state-action heatmap으로 확인한다.', 'Safety critic target에 (1-c_t) terminal gate가 적용되는지 unit test하고 calibration curve와 false-negative rate를 측정한다.', 'Paper의 composite-policy next-action target과 공개 code HEAD의 task-policy target divergence를 명시적으로 선택하고 각각 어떤 risk quantity를 학습하는지 test한다.', 'Task proposal, executed recovery action, handoff reason을 한 transition에 모두 기록하고 두 replay buffer의 action semantics를 검산한다.', 'Threshold, recovery latency, time-to-collision을 sweep해 critic-detection failure와 controller-recovery failure를 분리한다.'],
  assumptions: ['Offline data가 constraint boundary와 violation에 대한 충분한 coverage를 가진다.', 'Safety critic이 deployment state-action에서 future violation risk를 calibrated하게 추정한다.', 'Recovery policy가 threshold를 넘은 시점에서 아직 recoverable한 dynamics region에 있다.', 'Binary terminal violation과 chosen gamma_risk가 application risk를 충분히 표현한다.'],
  failures: ['Critic false negative는 unsafe task action을 그대로 actuator에 보낸다.', 'Critic이 맞아도 braking distance나 actuator saturation 때문에 recovery가 늦을 수 있다.', 'False positive가 많으면 recovery가 과도하게 개입해 task policy가 progress하지 못한다.', 'Offline violation data를 만드는 과정 자체에 human supervision 또는 이전 위험 경험이 필요하다.', 'Paper의 composite-policy Bellman target과 공개 repository HEAD의 task-policy target은 서로 다른 quantity를 추정하므로 구현에서 조용히 혼합하면 안 된다.'],
  legacy: 'Recovery RL은 safe RL을 optimizer 하나의 tradeoff가 아니라 task policy, safety critic, recovery controller와 data contract의 system problem으로 재구성했다. Modern robot policy deployment의 action filter, intervention learning, backup policy 설계와 직접 연결된다.',
  nextReading: '다음에는 control barrier function, reachability와 model-predictive safety filter를 읽어 learned risk estimate를 dynamics-aware hard constraint와 어떻게 결합하는지 비교해야 한다.',
  capabilities: ['Safety critic target의 terminal gate와 risk discount를 구현한다.', 'Task proposal과 executed action을 왜 서로 다른 replay semantics로 저장하는지 설명한다.', 'High AUROC인데도 physical violation이 발생하는 failure를 recovery horizon으로 진단한다.', 'Empirical violation reduction과 formal safety guarantee를 구분한다.'],
};
