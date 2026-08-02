import type { PaperStudySpec } from './FoundationalPaperStudy';

export const qLearning1992Spec: PaperStudySpec = {
  shortTitle: 'Q-learning',
  citation: 'Christopher J. C. H. Watkins, Peter Dayan — Q-learning',
  yearVenue: '1992 · Machine Learning 8',
  sourceUrl: 'https://doi.org/10.1007/BF00992698',
  before: 'Dynamic programming은 환경의 전이 확률과 보상 모형을 알아야 Bellman backup을 계산할 수 있었다. 반면 실제 agent는 선택한 행동 뒤에 관측한 한 번의 전이만 갖고 최적 정책을 배워야 했다.',
  authorIntent: '환경 모형을 주지 않아도 실제 행동으로 얻은 경험에서 최적 action value를 학습하는 증분 알고리즘을 정리하고, 어떤 조건에서 그 값이 확률 1로 수렴하는지 증명하려 했다.',
  thesis: '현재 행동을 만든 policy와 무관하게 다음 상태의 최대 Q를 target으로 삼아 방문한 state-action 값을 갱신하면, 유한한 tabular MDP에서 충분한 탐색과 적절한 step size 아래 optimal action value에 수렴한다.',
  reconstruction: [
    { label: 'Experience', value: '(s, a, r, s\')', note: '한 번의 실제 전이' },
    { label: 'Greedy look-ahead', value: 'max Q(s\', ·)', note: '다음 상태의 최선 가치' },
    { label: 'TD error', value: 'target - Q(s,a)', note: '현재 추정의 오차' },
    { label: 'Async update', value: 'Q(s,a) only', note: '방문한 항목만 수정' },
  ],
  mechanism: [
    'Behavior policy로 행동을 골라 reward와 다음 state를 관측한다. 학습 target과 행동 선택 규칙은 같을 필요가 없다.',
    '다음 state에서 가능한 action의 현재 Q 중 최댓값을 골라 one-step bootstrap target을 만든다.',
    'Target과 현재 Q(s,a)의 차이를 TD error로 계산하고 방금 방문한 table entry만 step size만큼 이동한다.',
    '모든 state-action pair가 계속 방문되고 step size가 무한히 학습하되 제곱합은 유한하도록 줄어들면 stochastic update가 Bellman optimality fixed point를 추적한다.',
    '학습 뒤에는 각 state에서 argmax Q를 선택해 greedy policy를 얻는다. 수렴 정리는 이 tabular 설정의 계약이지 임의의 신경망 근사기에 대한 보장이 아니다.',
  ],
  equations: [
    {
      latex: String.raw`Q_{t+1}(s_t,a_t)=Q_t(s_t,a_t)+\alpha_t\left[r_{t+1}+\gamma\max_a Q_t(s_{t+1},a)-Q_t(s_t,a_t)\right]`,
      meaning: '대괄호는 한 전이로 만든 TD error다. 실제로 고른 다음 행동의 값이 아니라 가능한 행동 중 최대 추정값을 쓰므로 behavior policy와 다른 greedy target policy를 학습하는 off-policy update다.',
      symbols: [[String.raw`\alpha_t`, '방문 시점 t의 step size'], [String.raw`r_{t+1}`, '행동 직후 관측한 보상'], [String.raw`\gamma`, '미래 보상의 할인율'], [String.raw`\max_a Q_t(s_{t+1},a)`, '다음 상태에서 현재 추정한 최선 가치']],
    },
    {
      latex: String.raw`\sum_t\alpha_t(s,a)=\infty,\qquad \sum_t\alpha_t(s,a)^2<\infty`,
      meaning: '첫 조건은 각 state-action 값을 끝까지 수정할 총 학습량이 남아 있어야 한다는 뜻이고, 둘째는 noise의 누적 분산이 폭발하지 않도록 step size가 충분히 줄어야 한다는 뜻이다. 여기에 모든 pair의 반복 방문과 유한 MDP 조건이 함께 필요하다.',
      symbols: [[String.raw`\alpha_t(s,a)`, '특정 state-action pair의 t번째 유효 step size'], [String.raw`\infty`, '학습 신호의 총량이 사라지지 않음'], [String.raw`\alpha_t^2`, 'stochastic noise가 누적되는 크기']],
    },
  ],
  evidence: [
    { label: '수렴 정리', question: '관측한 한 전이만으로 만든 비동기 update가 optimal Q의 fixed point에 도달하는가?', intervention: '유한 MDP, bounded reward, 반복 방문, Robbins-Monro형 step-size 조건 아래 update error를 stochastic approximation으로 분석한다.', observation: '논문은 조건이 만족될 때 Q가 optimal action value로 확률 1 수렴한다는 정리를 제시한다.', supports: 'Model-free one-step update의 tabular convergence를 지지한다.', limit: 'Replay buffer, target network, nonlinear function approximation을 쓰는 DQN의 수렴을 입증하지 않는다.' },
    { label: '흡수 상태', question: 'Episode가 끝나는 문제도 같은 update 틀로 다룰 수 있는가?', intervention: 'Goal state가 흡수 상태인 경우를 포함해 action value update와 terminal boundary를 분석한다.', observation: 'Terminal value를 경계 조건으로 둔 episodic task가 일반 update에 포함됨을 보인다.', supports: 'Continuing task뿐 아니라 episodic control에도 알고리즘을 적용할 수 있음을 지지한다.', limit: 'Timeout을 실제 terminal과 동일하게 처리해도 된다는 뜻은 아니다.' },
  ],
  implementation: ['작은 deterministic gridworld의 전이·보상 table을 명시적으로 만든다.', 'Q table을 0으로 초기화하고 epsilon-greedy behavior로 모든 state-action 방문 횟수를 기록한다.', '매 전이에서 target, TD error, 수정 전후 Q(s,a)를 로그로 남긴다.', 'Value iteration으로 얻은 Q*와 학습 Q의 최대 오차를 비교한다.', '탐색을 너무 빨리 줄이거나 constant step size를 쓸 때 정리의 조건이 깨지는 모습을 대조한다.'],
  assumptions: ['State와 action 집합이 유한하고 reward variance가 제어된다.', '모든 state-action pair가 무한히 자주 갱신될 정도로 탐색이 지속된다.', '각 pair의 step size가 수렴 정리의 합 조건을 만족한다.'],
  failures: ['Max operator는 noisy estimate에서 overestimation bias를 만들 수 있다.', '관측을 Markov state로 잘 표현하지 못하면 같은 Q entry에 서로 다른 미래가 섞인다.', 'Tabular convergence 정리를 nonlinear Q network의 안정성 보장으로 옮기면 deadly triad의 핵심을 놓친다.'],
  legacy: 'Q-learning은 model-free off-policy control의 기준점을 만들었다. DQN은 Q table을 신경망으로 바꾸되 수렴 정리를 계승한 것이 아니라, replay와 target network라는 경험적 안정화 장치를 새로 도입했다. Double Q-learning은 max가 만드는 선택 편향을 별도로 다룬다.',
  nextReading: '다음 DQN 논문에서 정확한 table entry update가 공유 parameter update로 바뀔 때 왜 데이터 상관과 움직이는 target이 문제가 되는지 확인한다.',
  nextLinks: [{ slug: 'paper-dqn-2015', label: 'DQN 2015로 이어가기', reason: 'Tabular Q update를 신경망으로 옮길 때 replay와 target network가 왜 필요한지 비교한다.' }],
  capabilities: ['Q-learning update에서 behavior policy와 target policy를 구분한다.', '수렴 정리의 조건을 실제 탐색·step-size 코드로 번역한다.', 'Tabular 보장과 DQN의 경험적 안정성을 혼동하지 않는다.'],
};

export const reinforce1992Spec: PaperStudySpec = {
  shortTitle: 'REINFORCE',
  citation: 'Ronald J. Williams — Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning',
  yearVenue: '1992 · Machine Learning 8',
  sourceUrl: 'https://doi.org/10.1007/BF00992696',
  appendixUrl: 'https://mlanthology.org/mlj/1992/williams1992mlj-simple/',
  before: '보상은 정답 action label을 주지 않고, 환경의 sampling·분기·지연 때문에 reward를 policy parameter까지 보통의 backpropagation으로 미분할 수도 없었다.',
  authorIntent: 'Stochastic unit이 선택한 행동의 확률을 조정하는 국소 규칙만으로 기대 보상의 gradient를 따를 수 있음을 보이고, supervised target이나 환경 모형 없이 connectionist network를 강화 신호로 학습하려 했다.',
  thesis: '샘플링한 행동의 log-probability gradient에 그 결과의 reinforcement를 곱하면 기대 보상 gradient의 unbiased estimator가 되며, action과 무관한 baseline은 기대값을 바꾸지 않고 variance를 줄일 수 있다.',
  readerBridge: [
    { term: 'Stochastic policy', latex: String.raw`\pi_\theta(a\mid s)`, plain: '하나의 정답 행동이 아니라 각 행동이 뽑힐 확률을 내는 규칙이다.', role: '같은 state에서 다른 행동을 시험해 결과와 선택 확률의 관계를 관측하게 한다.' },
    { term: 'Sampled action', latex: String.raw`a\sim\pi_\theta`, plain: '확률표 전체와 실제로 환경에 실행한 한 행동은 서로 다른 기록이다.', role: 'REINFORCE는 실행한 행동의 log-probability만 결과 신호와 연결한다.' },
    { term: 'Score function', latex: String.raw`\nabla_\theta\log\pi_\theta(a\mid s)`, plain: '그 행동을 더 자주 뽑으려면 parameter를 어느 방향으로 움직여야 하는지 나타낸다.', role: '환경을 미분하지 않고 policy 쪽에만 gradient 경로를 만든다.' },
    { term: 'Baseline', latex: String.raw`b(s)`, plain: '이번 결과가 같은 state의 평소 수준보다 좋았는지 비교하는 기준이다.', role: '현재 action에 의존하지 않으면 평균 gradient 방향을 보존하면서 흔들림을 줄인다.' },
  ],
  reconstruction: [
    { label: 'Stochastic policy', value: 'a ~ pi_theta', note: '행동 확률에서 sample' },
    { label: 'Reinforcement', value: 'R', note: '결과의 scalar 평가' },
    { label: 'Eligibility', value: 'grad log pi', note: '선택의 parameter 책임' },
    { label: 'Update', value: '(R-b)e', note: '좋은 선택 확률 증가' },
  ],
  mechanism: [
    'Network output을 deterministic label이 아니라 action probability로 해석하고 그 분포에서 행동을 sample한다.',
    '환경이 돌려준 reinforcement를 관측한다. 환경 transition 자체의 derivative는 계산하지 않는다.',
    '실제로 sample된 행동의 log-probability를 parameter로 미분해 eligibility를 만든다.',
    '평균적 기대보다 좋은 결과면 그 행동의 log-probability를 높이고 나쁜 결과면 낮춘다. Action과 무관한 baseline은 평균 update 방향을 바꾸지 않는다.',
    '지연 보상에서는 trajectory의 각 decision이 이후 return에 얼마나 노출되는지 credit assignment를 설계해야 한다. 논문은 일반 원리와 제한된 delayed-reinforcement 변형을 함께 다룬다.',
  ],
  equations: [
    {
      latex: String.raw`\begin{aligned}
        \underbrace{e_\theta}_{\text{선택의 parameter 책임}}
        &=\underbrace{\nabla_\theta\log\pi_\theta(a\mid s)}_{\text{실행 action의 log-prob 기울기}}\\
        \underbrace{\Delta\theta}_{\text{policy 변화}}
        &=\underbrace{\alpha}_{\text{학습률}}\,
        \underbrace{(R-b)}_{\text{기준 대비 결과}}\,
        \underbrace{e_\theta}_{\text{선택 책임}}
      \end{aligned}`,
      meaning: 'Reward를 직접 미분하는 대신 sample된 행동을 얼마나 더 또는 덜 가능하게 만들지 log-probability gradient로 정한다. Baseline b가 action에 의존하지 않으면 estimator의 기대 방향은 유지되고 scale의 흔들림만 줄일 수 있다.',
      symbols: [[String.raw`R`, '선택 이후 얻은 reinforcement 또는 return'], [String.raw`b`, '행동과 무관한 비교 기준'], [String.raw`\log\pi_\theta(a\mid s)`, '실제로 고른 행동의 log-probability'], [String.raw`\alpha`, 'policy step size']],
    },
    {
      latex: String.raw`\begin{aligned}
        \underbrace{g_t}_{\text{시점 }t\text{의 기여}}
        &=
        \underbrace{G_t}_{\text{행동 뒤 return}}\,
        \underbrace{\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{선택 책임}}\\
        \underbrace{\nabla_\theta J(\theta)}_{\text{기대 return 기울기}}
        &=
        \mathbb E_{\tau\sim\pi_\theta}\!\left[\sum_t g_t\right]
      \end{aligned}`,
      meaning: '현대 trajectory 표기로 확장한 score-function estimator다. 각 시점의 action은 그 이후 return Gt로 평가된다. 식이 unbiased라는 사실과 finite batch에서 variance가 작다는 사실은 다르다.',
      symbols: [[String.raw`\tau`, 'policy가 만든 state-action trajectory'], [String.raw`G_t`, '시점 t 이후의 sampled return'], [String.raw`J(\theta)`, 'policy의 기대 return'], [String.raw`\mathbb E`, '여러 sampled trajectory에 대한 평균']],
    },
  ],
  evidence: [
    { label: '기대 gradient', question: 'Sample 하나의 reinforcement-weighted update가 평균적으로 기대 보상 gradient를 따르는가?', intervention: 'Stochastic unit의 output distribution과 update rule을 전개해 reinforcement baseline을 포함한 기대 update를 분석한다.', observation: 'REINFORCE 계열 update의 기대값이 performance measure의 gradient 방향과 일치하는 조건을 보인다.', supports: '환경 derivative 없이 stochastic policy를 직접 최적화할 수 있다는 수학적 근거를 지지한다.', limit: 'Finite sample에서 낮은 variance나 빠른 convergence를 보장하지 않는다.' },
    { label: 'Network 결합', question: '단일 stochastic unit의 규칙을 multilayer connectionist network에 연결할 수 있는가?', intervention: 'Stochastic output unit의 probability derivative를 backpropagation으로 내부 weight까지 전달한다.', observation: 'Reinforcement-weighted eligibility를 network parameter에 적용하는 일반 구성을 제시한다.', supports: 'Policy network를 end-to-end로 학습하는 기반을 지지한다.', limit: '현대 actor-critic의 critic, GAE, trust-region update를 이미 포함했다는 뜻은 아니다.' },
  ],
  implementation: ['두 action bandit에서 softmax logit 하나로 policy를 만든다.', 'Sampled action, reward, log-probability, gradient를 episode마다 기록한다.', 'Baseline 없음, running-mean baseline, action-dependent baseline을 비교해 bias와 variance를 분리한다.', '작은 episodic MDP에서 return-to-go와 episode 전체 return의 gradient variance를 비교한다.', '수치 미분한 expected reward gradient와 Monte Carlo estimator의 batch 평균을 대조한다.'],
  assumptions: ['Policy distribution이 parameter에 대해 미분 가능하고 선택한 action의 확률이 0이 아니다.', 'Reward sample이 policy가 만든 분포에서 왔으며 충분한 trajectory를 얻을 수 있다.', 'Baseline으로 unbiasedness를 유지하려면 현재 action에 의존하지 않아야 한다.'],
  failures: ['Sparse·delayed reward에서는 gradient variance가 매우 커질 수 있다.', 'Sample된 action 밖의 대안에는 직접적인 counterfactual feedback이 없다.', '큰 step은 더 좋은 sampled return을 얻어도 policy collapse를 만들 수 있다.'],
  legacy: 'REINFORCE는 policy-gradient 계열의 score-function 뼈대를 남겼다. Actor-critic은 Monte Carlo return 일부를 learned value로 바꾸고, GAE는 여러 horizon의 TD residual을 섞으며, PPO는 같은 rollout을 여러 번 쓸 때 policy가 지나치게 이동하는 문제를 다룬다.',
  nextReading: 'GAE 논문에서 baseline을 단순 평균이 아니라 state value로 만들고, 한 step TD residual을 여러 시간척도로 합치는 이유를 확인한다.',
  capabilities: ['환경을 미분하지 않고 policy gradient를 얻는 log-derivative trick을 유도한다.', 'Unbiased estimator와 low-variance estimator를 구분한다.', 'Baseline이 action에 의존할 때 왜 bias가 생길 수 있는지 설명한다.'],
};

export const dqn2015Spec: PaperStudySpec = {
  shortTitle: 'Human-level control through deep reinforcement learning',
  citation: 'Mnih et al. — Human-level control through deep reinforcement learning',
  yearVenue: '2015 · Nature 518',
  sourceUrl: 'https://www.nature.com/articles/nature14236',
  appendixUrl: 'https://arxiv.org/abs/1312.5602',
  appendixLabel: '2013 NeurIPS 워크숍 프리프린트',
  appendixNote: '2015 Nature 논문의 단순 mirror가 아니다. 이 초기 버전에는 별도 target network가 없으므로 두 절차의 차이를 대조할 때만 참고한다.',
  before: 'Q-learning은 table의 한 entry만 수정하면 수렴 조건을 분석할 수 있었지만, raw image처럼 거대한 state에서는 table을 만들 수 없다. 신경망으로 Q를 근사하면 연속된 sample의 상관, bootstrap target의 이동, off-policy replay가 결합해 학습이 불안정해진다.',
  authorIntent: '게임별 feature engineering 없이 화면 pixel과 score만 받아 하나의 deep Q-learning 절차가 다양한 Atari 2600 game의 action value를 학습할 수 있는지 보이려 했다.',
  thesis: 'Convolutional Q-network에 experience replay와 별도 target network를 결합하면 correlated online experience와 moving target을 완화해 여러 Atari game에서 end-to-end control을 학습할 수 있다.',
  reconstruction: [
    { label: 'Frame stack', value: '84x84x4', note: '동작을 추론할 관측' },
    { label: 'Online Q', value: 'Q_theta(s,a)', note: '모든 action score' },
    { label: 'Replay sample', value: 'U(D)', note: '시간 상관 완화' },
    { label: 'Frozen target', value: 'Q_theta-', note: '일정 기간 고정된 label' },
  ],
  mechanism: [
    '최근 frame을 전처리하고 여러 장을 stack해 단일 image에 없는 속도 정보를 근사한다.',
    'Epsilon-greedy action으로 environment를 진행하며 transition을 replay memory에 저장한다.',
    '최근 순서가 아니라 replay memory에서 mini-batch를 무작위 sample해 update 사이의 temporal correlation을 낮춘다.',
    'Online network는 현재 Q를 예측하고, 일정 기간 고정한 target network가 bootstrap label을 만든다.',
    '여러 action output 중 실행한 action의 Q만 TD loss로 수정하지만 shared convolution feature는 함께 바뀐다.',
  ],
  equations: [{
    latex: String.raw`\mathcal L(\theta)=\mathbb E_{(s,a,r,s',d)\sim\mathcal D}\left[\left(Q_\theta(s,a)-\left(r+\gamma(1-d)\max_{a'}Q_{\theta^-}(s',a')\right)\right)^2\right]`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{M^-}_{\text{다음 최대값}}&=\max_{a'}Q_{\theta^-}(s',a')\\[2pt]
      \underbrace{Y}_{\text{고정 표적}}&=r+\gamma(1-d)M^-\\[2pt]
      \underbrace{\mathcal L}_{\text{예측 오차}}&=\mathbb E_{\mathcal D}[(Q_\theta(s,a)-Y)^2]
    \end{aligned}`,
    meaning: 'Replay transition으로 만든 squared TD loss다. Online parameter theta는 prediction 쪽만 미분하고 target parameter theta-는 일정 주기 동안 고정한다. Done mask가 실제 terminal일 때만 미래 가치를 제거해야 한다.',
    symbols: [[String.raw`\mathcal D`, 'experience replay memory'], [String.raw`d`, '실제 terminal indicator'], [String.raw`\theta`, '매 update 수정하는 online network'], [String.raw`\theta^-`, '일정 기간 고정하는 target network']],
  }, {
    latex: String.raw`a_t=\begin{cases}\text{uniform action},&u<\epsilon\\ \arg\max_a Q_\theta(s_t,a),&u\ge\epsilon\end{cases}`,
    meaning: 'Behavior는 확률 epsilon으로 탐색하고 나머지는 현재 Q의 greedy action을 쓴다. Replay에는 여러 시점의 서로 다른 epsilon policy가 만든 데이터가 섞이므로 학습은 본질적으로 off-policy다.',
    symbols: [[String.raw`u`, '0과 1 사이 uniform random sample'], [String.raw`\epsilon`, '무작위 행동 확률'], [String.raw`\arg\max`, '현재 가장 높은 Q 행동 선택']],
  }],
  evidence: [
    { label: 'Atari 성능', question: '동일한 architecture와 주요 hyperparameter를 여러 game에 적용해 pixel에서 control을 배울 수 있는가?', intervention: '49개 Atari game에서 화면과 reward만 사용해 DQN을 학습하고 전문 human tester와 기존 방법의 normalized score를 비교한다.', observation: '논문은 다수 game에서 강한 성능과 여러 game에서 human-level 이상의 score를 보고한다.', supports: 'End-to-end visual representation과 Q-learning의 결합이 넓은 game set에서 작동할 수 있음을 지지한다.', limit: '모든 game의 일반적 지능, sample efficiency, 새로운 규칙으로의 transfer를 입증하지 않는다.' },
    { label: '안정화 장치', question: 'Replay와 target network가 단순 부가 기능이 아니라 학습 안정성에 관여하는가?', intervention: 'Online sequence를 replay하고 target을 일정 기간 고정하는 전체 training procedure와 학습 curve를 제시한다.', observation: '이 조합으로 previously unstable한 nonlinear Q-learning을 긴 Atari run에서 학습한다.', supports: '상관된 데이터와 움직이는 target을 완화하는 실용적 recipe를 지지한다.', limit: '각 장치의 독립적 인과 효과를 모든 game에서 완전히 분리한 대규모 ablation은 아니다.' },
  ],
  implementation: ['Deterministic seed와 episode boundary가 있는 작은 pixel 또는 vector environment를 고른다.', 'Replay 없는 online Q, replay만 사용, replay+target network 세 설정을 같은 interaction budget으로 비교한다.', 'TD error 분포, Q scale, target drift, gradient norm, replay sample age를 함께 기록한다.', 'Evaluation에서는 epsilon을 별도로 고정하고 training return과 분리한다.', 'Timeout truncation과 true terminal을 구분해 bootstrap mask를 검사한다.'],
  assumptions: ['Frame stack이 control에 필요한 상태 정보를 충분히 근사한다.', 'Discrete action 수가 network output으로 열거 가능하다.', 'Replay의 오래된 transition이 현재 Q update에 여전히 유용하다.'],
  failures: ['Max target과 noisy Q가 overestimation을 누적할 수 있다.', 'Sparse reward와 긴 horizon에서 sample efficiency가 매우 낮다.', 'Replay, off-policy bootstrap, function approximation이 결합된 deadly triad에 대한 일반 수렴 보장은 없다.'],
  legacy: 'DQN은 deep RL의 재현 가능한 기준선을 만들었고 Double DQN, prioritized replay, dueling network, distributional RL이 각 실패 원인을 분리했다. 핵심 유산은 단순히 CNN을 붙인 것이 아니라 data distribution과 target timescale을 제어한 시스템 설계다.',
  nextReading: 'Value 계열을 마친 뒤 REINFORCE로 넘어가 Q를 거쳐 argmax를 고르는 대신 stochastic policy 자체를 미분하는 관점을 비교한다.',
  capabilities: ['Replay와 target network가 서로 다른 불안정성에 대응함을 설명한다.', 'DQN loss에서 gradient가 흐르는 항과 stop-gradient target을 구분한다.', 'Atari score가 입증하는 범위와 sample-efficiency·generalization의 미입증 범위를 말한다.'],
};

export const gae2015Spec: PaperStudySpec = {
  shortTitle: 'Generalized Advantage Estimation',
  citation: 'John Schulman et al. — High-Dimensional Continuous Control Using Generalized Advantage Estimation',
  yearVenue: '2015 · arXiv / ICLR 2016',
  sourceUrl: 'https://arxiv.org/abs/1506.02438',
  before: 'REINFORCE의 Monte Carlo return은 unbiased할 수 있지만 variance가 크고, one-step critic target은 variance를 줄이는 대신 부정확한 value function의 bias를 policy gradient에 넣는다.',
  authorIntent: 'Policy gradient에서 value function이 만드는 bias-variance trade-off를 명시적으로 다루는 advantage estimator를 만들고, trust-region update와 결합해 고차원 continuous control을 안정적으로 학습하려 했다.',
  thesis: '연속된 TD residual을 gamma-lambda로 지수 가중합하면 Monte Carlo와 one-step TD 사이를 조절하는 advantage estimator를 만들 수 있고, policy와 value function에 trust-region 제약을 적용해 continuous-control 성능을 높일 수 있다.',
  readerBridge: [
    { term: 'Critic', latex: String.raw`V_\phi(s)`, plain: '현재 state에서 앞으로 받을 평균 return을 추정하는 별도 함수다.', role: 'Action 전의 평소 기대를 빼서 policy가 선택한 행동의 상대적 결과를 만든다.' },
    { term: 'Advantage', latex: String.raw`A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)`, plain: '같은 state에서 평소 정책보다 이번 행동이 더 좋았는지를 나타낸다.', role: '양수면 sampled action 확률을 높이고 음수면 낮추는 policy 신호가 된다.' },
    { term: 'TD residual', latex: String.raw`\delta_t^V`, plain: '실제 한-step reward와 다음 value를 합친 target에서 현재 value를 뺀 local surprise다.', role: '긴 return을 바로 쓰는 대신 시간별 credit 조각으로 사용한다.' },
    { term: 'Bootstrap boundary', latex: String.raw`m_t`, plain: '실제 terminal 뒤에는 미래값을 0으로 만들지만 time-limit truncation은 별도로 처리한다.', role: '존재하지 않는 미래를 더하거나 아직 남은 미래를 잘라내는 구현 오류를 막는다.' },
  ],
  reconstruction: [
    { label: 'Rollout', value: 'r_t, V(s_t)', note: 'On-policy trajectory' },
    { label: 'TD residual', value: 'delta_t', note: '한 step surprise' },
    { label: 'Lambda trace', value: 'sum (gamma lambda)^l delta', note: '여러 horizon 혼합' },
    { label: 'Policy update', value: 'A_hat grad log pi', note: 'Trust region 안에서 개선' },
  ],
  mechanism: [
    '현재 policy로 trajectory를 수집하고 각 state의 learned value와 reward를 기록한다.',
    '각 시점에서 reward와 다음 value의 bootstrap으로 one-step TD residual을 계산한다.',
    '현재 residual부터 미래 residual까지 gamma-lambda weight로 더해 advantage를 만든다. Lambda가 작으면 critic bias에 더 의존하고 크면 긴 return의 variance가 커진다.',
    'Estimated advantage로 policy surrogate를 만들되 KL 기반 trust region 안에서 update한다.',
    'Value function도 같은 rollout에 fit하지만, policy와 value update가 서로 바꾸는 data target을 분리해 진단한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{\delta_t^V}_{\text{한 step TD 잔차}}
      =
      \underbrace{r_t}_{\text{실제 관측}}
      +
      \underbrace{\gamma m_tV_\phi(s_{t+1})}_{\text{허용된 미래 추정}}
      -
      \underbrace{V_\phi(s_t)}_{\text{현재 기준값}}
    \end{aligned}`,
    meaning: '한 step reward와 다음 state의 bootstrap value를 합친 target에서 현재 value를 뺀 TD residual이다. Critic이 정확하면 action이 평균보다 좋았는지를 나타내는 noisy advantage sample로 볼 수 있다.',
    symbols: [[String.raw`r_t`, '시점 t 행동 뒤 관측한 보상'], [String.raw`V_\phi`, 'learned state-value critic'], [String.raw`\gamma`, '시간 할인율'], [String.raw`m_t`, '실제 terminal에서는 0인 bootstrap mask']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{\widehat A_t^{\mathrm{GAE}(\gamma,\lambda)}}_{\text{여러 길이의 advantage 혼합}}
      &=
      \underbrace{\delta_t^V}_{\text{지금 surprise}}
      +
      \underbrace{\gamma\lambda\delta_{t+1}^V}_{\text{한 step 뒤 credit}}\\
      &\quad+
      \underbrace{(\gamma\lambda)^2\delta_{t+2}^V+\cdots}_{\text{먼 residual은 지수 감쇠}}
    \end{aligned}`,
    meaning: '현재 이후 TD residual을 지수 가중합한 advantage estimator다. Lambda=0이면 one-step TD residual이고, 적절한 terminal 처리 아래 lambda가 1에 가까우면 긴-horizon return에서 baseline을 뺀 형태에 접근한다.',
    symbols: [[String.raw`\lambda`, 'Bias와 variance를 조절하는 trace parameter'], [String.raw`l`, '현재 시점에서 떨어진 미래 거리'], [String.raw`T`, 'Rollout 또는 episode 경계'], [String.raw`(\gamma\lambda)^l`, '먼 residual의 감쇠 weight']],
  }],
  evidence: [
    { label: 'Lambda sweep', question: 'Advantage estimator의 horizon을 바꾸면 policy learning의 bias와 variance가 실제로 달라지는가?', intervention: '여러 gamma-lambda 설정과 value-function 조건을 continuous-control task에서 비교한다.', observation: '중간 lambda 영역이 너무 짧거나 긴 estimator보다 유리한 학습 결과를 보이는 설정을 보고한다.', supports: 'Advantage estimation을 하나의 고정 target이 아니라 조절 가능한 trade-off로 보는 주장을 지지한다.', limit: '모든 environment에 동일 lambda가 최적이거나 lambda만으로 안정성이 결정된다는 뜻은 아니다.' },
    { label: 'Continuous control', question: 'GAE와 trust-region update의 조합이 고차원 locomotion policy를 학습할 수 있는가?', intervention: '3D locomotion을 포함한 simulated continuous-control task에서 policy와 value를 반복 학습한다.', observation: '복잡한 locomotion behavior를 얻고 기존 조건보다 개선된 결과를 보고한다.', supports: 'Estimator와 constrained optimization 조합의 실용성을 지지한다.', limit: 'GAE 단독 기여와 trust region, architecture, simulator 조건의 효과를 완전히 동일시할 수 없다.' },
  ],
  implementation: ['고정 rollout 하나에서 reward, value, done mask를 배열로 준비한다.', 'Backward recurrence와 명시적 residual 합 두 방식으로 GAE를 계산해 일치시킨다.', 'Lambda 0, 0.5, 0.95, 1에서 advantage 평균·분산과 critic bias 민감도를 비교한다.', 'Advantage normalization 전후의 gradient scale을 기록하되 estimator 정의와 별도 처리임을 표시한다.', 'Terminal과 time-limit truncation에서 bootstrap 여부를 다르게 처리한다.'],
  assumptions: ['현재 rollout이 update 전 policy에서 수집되어 importance mismatch가 제어된다.', 'Value function이 최소한 return의 state-dependent 변동 일부를 설명한다.', 'Episode boundary와 truncation 의미를 알고 bootstrap mask를 정확히 만든다.'],
  failures: ['부정확한 critic은 낮은 lambda에서 policy gradient에 systematic bias를 키울 수 있다.', '긴 rollout과 큰 lambda는 reward noise와 trajectory correlation을 누적한다.', 'GAE가 policy update 크기를 제한하지 않으므로 별도 trust-region 또는 clipping이 필요하다.'],
  legacy: 'GAE는 현대 on-policy actor-critic의 표준 advantage estimator가 되었다. PPO가 널리 쓰이면서 함께 묶여 보이지만, GAE는 target construction 문제이고 PPO는 policy update reuse와 이동 크기를 다루는 별도 층이다.',
  nextReading: 'PPO 논문에서 같은 GAE rollout을 여러 epoch 재사용할 때 old policy와 new policy의 확률비가 왜 필요하고 clipping이 무엇을 제한하는지 확인한다.',
  capabilities: ['GAE를 TD residual의 weighted sum과 backward recurrence 두 방식으로 계산한다.', 'Gamma와 lambda의 역할을 구분한다.', 'Estimator bias-variance와 policy update 안정성을 별도 문제로 진단한다.'],
};

export const ppo2017Spec: PaperStudySpec = {
  shortTitle: 'Proximal Policy Optimization Algorithms',
  citation: 'John Schulman et al. — Proximal Policy Optimization Algorithms',
  yearVenue: '2017 · arXiv',
  sourceUrl: 'https://arxiv.org/abs/1707.06347',
  appendixUrl: 'https://openai.com/index/openai-baselines-ppo/',
  before: 'Vanilla policy gradient는 큰 update에서 성능이 붕괴할 수 있고, TRPO는 KL trust-region을 다루는 conjugate-gradient·second-order 근사가 복잡했다. 동시에 on-policy sample을 한 번만 쓰면 data efficiency가 낮았다.',
  authorIntent: 'TRPO의 보수적 policy update 성격을 유지하면서 first-order optimizer와 mini-batch로 구현할 수 있고, 같은 rollout을 여러 epoch 재사용하는 간단한 objective를 찾으려 했다.',
  thesis: 'Old policy 대비 action probability ratio가 advantage 방향으로 지나치게 변할 때 surrogate improvement를 clip하면, 복잡한 constrained optimization 없이 여러 mini-batch epoch의 비교적 안정적인 policy update가 가능하다.',
  reconstruction: [
    { label: 'Old rollout', value: 'tau ~ pi_old', note: '행동 당시 확률 저장' },
    { label: 'Advantage', value: 'A_hat', note: '행동의 상대적 가치' },
    { label: 'Ratio', value: 'pi_new / pi_old', note: '정책 변화 측정' },
    { label: 'Clipped surrogate', value: 'min(rA, clip(r)A)', note: '과도한 이득 제거' },
  ],
  mechanism: [
    '현재 policy로 일정 길이 rollout을 모으고 각 action의 old log-probability, reward, value를 저장한다.',
    'Return과 GAE advantage를 계산해 actor target과 critic target을 만든다.',
    '같은 action에 대한 new와 old log-probability 차이로 probability ratio를 안정적으로 계산한다.',
    'Advantage 부호를 고려해 ratio가 허용 구간 밖에서 더 유리해지는 방향의 objective를 clip한다.',
    '같은 rollout을 mini-batch로 여러 epoch update하면서 actual KL, clip fraction, entropy, value error를 감시하고 새 rollout으로 교체한다.',
  ],
  equations: [{
    latex: String.raw`r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)}=\exp\!\left(\log\pi_\theta-\log\pi_{\theta_{\mathrm{old}}}\right)`,
    meaning: 'Ratio는 old policy가 만든 동일 state-action sample이 new policy에서 얼마나 더 또는 덜 가능해졌는지 측정한다. 분모는 행동을 수집할 때 저장한 확률이며 update 중 함께 바꾸면 안 된다.',
    symbols: [[String.raw`\theta_{\mathrm{old}}`, 'Rollout 수집 시 고정된 policy parameter'], [String.raw`a_t`, 'Old policy가 실제로 sample한 action'], [String.raw`r_t`, 'Action probability의 변화 배율'], [String.raw`\exp`, 'Log-probability 차이를 ratio로 복원']],
  }, {
    latex: String.raw`L^{\mathrm{CLIP}}(\theta)=\mathbb E_t\left[\min\left(r_t(\theta)\widehat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\widehat A_t\right)\right]`,
    meaning: 'Unclipped surrogate와 clipped surrogate 중 더 보수적인 값을 고른다. Positive advantage와 negative advantage에서 제한되는 ratio 방향이 반대다. 이 식은 sample별 objective의 추가 이득을 자를 뿐 전체 policy의 KL 상한을 수학적으로 보장하지 않는다.',
    symbols: [[String.raw`\widehat A_t`, 'Old rollout에서 추정한 advantage'], [String.raw`\epsilon`, 'Ratio clip 폭'], [String.raw`\min`, '과도한 surrogate improvement를 제거'], [String.raw`\operatorname{clip}`, 'Ratio를 허용 구간으로 자른 값']],
  }],
  evidence: [
    { label: 'Surrogate 비교', question: 'KL penalty나 TRPO보다 단순한 clipped surrogate가 비슷하거나 더 좋은 학습 효율을 보이는가?', intervention: '여러 surrogate objective를 continuous-control task에서 같은 계열의 training procedure로 비교한다.', observation: 'Clipped objective가 보고된 비교에서 강하고 비교적 일관된 성능을 보인다.', supports: 'First-order clipped objective가 실용적인 proximal update라는 주장을 지지한다.', limit: 'Clip이 항상 monotonic improvement를 보장하거나 모든 implementation detail에 둔감하다는 뜻은 아니다.' },
    { label: 'Task 범위', question: '하나의 간단한 알고리즘이 locomotion과 Atari 양쪽에서 경쟁력 있게 작동하는가?', intervention: 'Simulated robotic locomotion과 Atari benchmark에 PPO 계열 objective를 적용한다.', observation: '두 task family에서 sample complexity와 최종 성능이 경쟁력 있다고 보고한다.', supports: 'Discrete·continuous action 양쪽에서 recipe의 범용성을 지지한다.', limit: 'Real robot 안전성, offline data, language-model alignment를 직접 입증하지 않는다.' },
  ],
  implementation: ['Rollout buffer에 observation, action, reward, value, done, old log-probability를 immutable하게 저장한다.', 'GAE와 return target을 rollout 끝에서 역순으로 계산한다.', 'Ratio를 probability 나눗셈 대신 log-probability 차이의 exp로 계산한다.', 'Positive·negative advantage 각각에서 clipping된 sample의 gradient 방향을 작은 tensor로 검산한다.', 'Epoch마다 approximate KL, clip fraction, entropy, explained variance를 기록하고 KL이 급증하면 early stop하는 대조군을 둔다.'],
  assumptions: ['Rollout은 update 직전 policy에서 왔고 여러 epoch 동안 mismatch가 과도하게 커지지 않는다.', 'Advantage sign과 scale이 policy improvement 방향을 유용하게 나타낸다.', 'Discrete action에서는 mask, continuous action에서는 squashed distribution의 log-probability를 정확히 계산한다.'],
  failures: ['Clipped objective는 hard trust region이 아니므로 actual KL이 크게 뛸 수 있다.', '너무 많은 epoch나 큰 learning rate는 sample을 clip 영역에 몰아 학습 신호를 죽인다.', 'Value loss와 entropy coefficient가 actor objective와 다른 scale인데 한 loss로 합칠 때 tuning 문제가 생긴다.'],
  legacy: 'PPO는 단순한 first-order 구현과 넓은 적용성 때문에 robot learning과 RLHF의 기준선이 되었다. 그러나 clipping은 안전 보장이 아니며, large language model에서는 sequence-level ratio, token credit, KL reference, reward hacking이 새로운 문제로 추가된다.',
  nextReading: '연속 action에서 off-policy replay로 sample efficiency를 높이는 DDPG·TD3·SAC 경로를 읽고, 이후 RLHF·RLVR에서 PPO의 rollout과 reward 계약이 어떻게 바뀌는지 연결한다.',
  capabilities: ['Advantage 부호별로 PPO clip objective의 실제 선택 항을 계산한다.', 'Old log-probability를 고정해야 하는 이유를 설명한다.', 'Clip fraction, KL, entropy, value error를 서로 다른 실패 신호로 해석한다.'],
};

export const ddpg2015Spec: PaperStudySpec = {
  shortTitle: 'Deep Deterministic Policy Gradient',
  citation: 'Timothy P. Lillicrap et al. — Continuous control with deep reinforcement learning',
  yearVenue: '2015 · arXiv / ICLR 2016',
  sourceUrl: 'https://arxiv.org/abs/1509.02971',
  before: 'DQN은 모든 discrete action의 Q를 출력하고 argmax를 열거할 수 있지만, torque처럼 연속인 action에서는 매 state마다 Q를 최대화하는 action을 탐색하기 어렵다. On-policy policy gradient는 가능하지만 interaction sample을 반복 재사용하기 어렵다.',
  authorIntent: 'Deterministic policy gradient를 deep actor-critic으로 구현하고 DQN의 replay·target-network 아이디어를 옮겨, 고차원 continuous action task를 model-free·off-policy로 학습하려 했다.',
  thesis: 'Actor가 state에서 하나의 continuous action을 직접 출력하고 critic의 action gradient로 actor를 개선하면, replay buffer와 slowly moving target network 아래 continuous control을 end-to-end로 학습할 수 있다.',
  readerBridge: [
    { term: 'Continuous action', latex: String.raw`a\in\mathbb R^m`, plain: '왼쪽·오른쪽처럼 몇 개의 선택지가 아니라 torque, steering처럼 실수 여러 개로 이루어진 행동이다.', role: '가능한 action을 전부 열거하지 못하므로 actor가 좋은 한 점을 바로 제안해야 한다.' },
    { term: 'Deterministic actor', latex: String.raw`\mu_\theta(s)`, plain: '같은 state를 넣으면 noise를 더하기 전에는 같은 action 한 점을 내는 함수다.', role: '매 state에서 critic을 반복 탐색하는 비용을 학습된 함수 한 번으로 바꾼다.' },
    { term: 'Action gradient', latex: String.raw`\nabla_aQ_\phi(s,a)`, plain: '현재 action을 어느 방향으로 조금 움직이면 critic 점수가 커지는지 나타내는 기울기다.', role: '환경을 미분하지 않고 critic의 입력 방향을 actor parameter 변화로 전달한다.' },
    { term: '세 action 기록', latex: String.raw`a^\beta,\ \mu_\theta(s),\ \mu_{\theta^-}(s')`, plain: '환경에 실제 실행한 noisy action, 지금 개선할 actor action, bootstrap에 쓰는 느린 target action은 서로 다르다.', role: 'Replay provenance와 두 optimizer의 계산 경계를 섞지 않게 한다.' },
  ],
  reconstruction: [
    { label: 'Actor', value: 'a = mu_theta(s)', note: '연속 action 직접 출력' },
    { label: 'Exploration', value: 'a + noise', note: 'Behavior에만 noise' },
    { label: 'Critic', value: 'Q_phi(s,a)', note: 'Action quality 추정' },
    { label: 'Action gradient', value: 'dQ/da dmu/dtheta', note: 'Actor 개선 방향' },
  ],
  mechanism: [
    'Deterministic actor가 state에서 bounded continuous action을 출력하고 exploration noise를 더해 behavior action을 만든다.',
    'Transition을 replay buffer에 저장하고 off-policy mini-batch를 sample한다.',
    'Target actor가 다음 action을, target critic이 bootstrap Q를 만들어 critic의 Bellman loss를 학습한다.',
    'Current critic의 Q가 actor action에 대해 커지는 방향으로 action gradient를 actor parameter까지 backpropagate한다.',
    'Actor와 critic target parameter를 Polyak averaging으로 천천히 갱신해 target timescale을 늦춘다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{g_a}_{\text{critic이 제안한 action 방향}}
      &=\left.\nabla_aQ_\phi(s,a)\right|_{a=\mu_\theta(s)}\\
      \underbrace{g_\theta}_{\text{한 state의 actor 방향}}
      &=g_a\,\nabla_\theta\mu_\theta(s)\\
      \underbrace{\nabla_\theta J}_{\text{평균 actor 방향}}
      &=\mathbb E_{s\sim\mathcal D}[g_\theta]
    \end{aligned}`,
    meaning: 'Critic이 action을 조금 바꿨을 때 Q가 증가하는 방향을 제공하고 actor Jacobian이 그 action 변화를 parameter 변화로 옮긴다. 환경 transition은 이 gradient path 안에 없다.',
    symbols: [[String.raw`\mu_\theta`, 'Deterministic actor'], [String.raw`Q_\phi`, 'Action-value critic'], [String.raw`\nabla_a Q_\phi`, 'Critic이 제안하는 action 개선 방향'], [String.raw`\mathcal D`, 'Off-policy replay state distribution']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{a'}_{\text{target actor의 다음 action}}
      &=\underbrace{\mu_{\theta^-}(s')}_{\text{느리게 변하는 actor}}\\
      \underbrace{y}_{\text{critic bootstrap 표적}}
      &=\underbrace{r}_{\text{실제로 받은 보상}}
      +\underbrace{\gamma(1-d)Q_{\phi^-}(s',a')}_{\text{느리게 변하는 미래 추정}}
    \end{aligned}`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{a'}_{\text{다음 행동}}&=\mu_{\theta^-}(s')\\[2pt]
      \underbrace{v'}_{\text{느린 가치}}&=Q_{\phi^-}(s',a')\\[2pt]
      \underbrace{y}_{\text{학습 표적}}&=r+\gamma(1-d)v'
    \end{aligned}`,
    meaning: 'Target actor가 다음 action을 고르고 target critic이 그 가치를 평가한다. 두 target network가 동시에 오차를 만들 수 있으므로 critic overestimation이 actor를 잘못된 action으로 밀 수 있다.',
    symbols: [[String.raw`\theta^-`, 'Slow target actor parameter'], [String.raw`\phi^-`, 'Slow target critic parameter'], [String.raw`d`, '실제 terminal indicator'], [String.raw`y`, 'Critic bootstrap target']],
  }],
  evidence: [
    { label: 'Task breadth', question: '같은 actor-critic recipe가 여러 simulated physics의 고차원 continuous action을 학습하는가?', intervention: '20개가 넘는 simulated task에서 low-dimensional state와 일부 raw-pixel input을 사용해 성능을 평가한다.', observation: '다양한 continuous-control task에서 안정적인 policy를 학습하고 raw pixels에서도 일부 성공을 보고한다.', supports: 'Deterministic deep actor-critic과 DQN식 안정화의 적용 가능성을 지지한다.', limit: 'Real-world dynamics, 높은 sample efficiency, seed에 둔감한 안정성을 보장하지 않는다.' },
    { label: 'Target·replay', question: 'DQN의 replay와 slow target이 continuous actor-critic에서도 유용한가?', intervention: 'Replay buffer, target networks, batch normalization, exploration noise를 결합한 training recipe를 사용한다.', observation: '이 구성으로 previously difficult한 continuous tasks를 end-to-end로 학습한다.', supports: 'Off-policy data reuse와 target timescale 분리의 실용성을 지지한다.', limit: '각 요소의 독립적 필수성과 인과 효과를 모든 task에서 완전히 분리하지는 않는다.' },
  ],
  implementation: ['Action range를 actor output의 tanh와 environment scale로 명시한다.', 'Replay transition과 actor behavior noise를 저장하되 target action에는 동일 noise를 섞지 않는다.', 'Critic target, critic loss, actor loss를 서로 다른 optimizer step으로 구현한다.', 'Actor update 때 critic parameter gradient를 사용하지 않도록 freezing 또는 optimizer 경계를 검증한다.', 'Q scale, action saturation, critic disagreement 대용 지표, seed별 return을 함께 기록한다.'],
  assumptions: ['Critic의 local action gradient가 실제 장기 return 개선 방향을 충분히 근사한다.', 'Replay distribution이 현재 actor 주변의 유용한 state-action 영역을 포함한다.', 'Continuous action이 differentiable actor output으로 parameterize 가능하다.'],
  failures: ['한 critic의 positive approximation error를 actor가 적극적으로 exploit할 수 있다.', 'Exploration noise가 부족하면 deterministic actor가 좁은 action 영역만 방문한다.', 'Reward scale, target update rate, action normalization에 민감하고 seed variance가 클 수 있다.'],
  legacy: 'DDPG는 continuous off-policy deep actor-critic의 기본 구조를 만들었다. TD3는 twin critic, delayed actor, target smoothing으로 approximation error의 세 경로를 직접 수정하고, SAC는 stochastic maximum-entropy policy로 exploration과 robustness를 다시 설계했다.',
  nextReading: 'TD3 논문에서 critic error가 actor와 target을 통해 어떻게 증폭되는지 세 가지 수정 장치의 책임을 각각 추적한다.',
  capabilities: ['Critic-to-actor gradient path와 환경에 대한 gradient가 없음을 설명한다.', 'Behavior noise, target action, policy action의 역할을 구분한다.', 'DDPG의 instability를 단순 hyperparameter 문제가 아니라 error feedback loop로 진단한다.'],
};

export const td32018Spec: PaperStudySpec = {
  shortTitle: 'Twin Delayed Deep Deterministic Policy Gradient',
  citation: 'Scott Fujimoto, Herke van Hoof, David Meger — Addressing Function Approximation Error in Actor-Critic Methods',
  yearVenue: '2018 · ICML, PMLR 80',
  sourceUrl: 'https://proceedings.mlr.press/v80/fujimoto18a.html',
  appendixUrl: 'https://arxiv.org/abs/1802.09477',
  before: 'DDPG의 actor는 critic이 높게 평가하는 action을 찾기 때문에 작은 positive Q error도 정책이 반복적으로 exploit한다. 잘못 커진 target은 다시 critic에 학습되어 actor와 critic이 서로의 오차를 증폭한다.',
  authorIntent: 'Actor-critic의 성능 저하를 function-approximation error와 overestimation 관점에서 분석하고, error가 policy update와 bootstrap target으로 전파되는 경로를 끊는 간단한 수정을 제안하려 했다.',
  thesis: '두 critic target 중 작은 값을 쓰고, actor와 target update를 critic보다 늦게 수행하며, target action 주변을 smoothing하면 overestimation과 빠른 error feedback을 줄여 continuous-control 학습을 안정화할 수 있다.',
  readerBridge: [
    { term: 'Function-approximation error', latex: String.raw`\widehat Q-Q^\pi`, plain: '신경망 critic이 실제 policy return과 다르게 추정한 차이다. TD loss가 작아도 target 자체가 틀리면 남을 수 있다.', role: 'Actor가 왜 가짜로 높은 Q peak를 선택할 수 있는지 설명한다.' },
    { term: 'Twin critics', latex: String.raw`Q_{\phi_1},Q_{\phi_2}`, plain: '같은 data를 보지만 parameter와 optimizer state를 따로 가진 두 가치 추정기다.', role: '한 critic만 우연히 높게 본 값을 bootstrap 사실로 채택하지 않게 한다.' },
    { term: 'Target smoothing', latex: String.raw`\mu_{\theta^-}(s')+\epsilon`, plain: '환경 탐색이 아니라 critic label을 만들 때 next action 주변만 조금 흔드는 장치다.', role: '아주 좁고 잘못된 Q peak에 target policy가 맞춰지는 것을 줄인다.' },
    { term: '두 시간척도', latex: String.raw`\text{critic step}\gg\text{actor step}`, plain: 'Critic은 자주 고치고 actor와 target network는 더 드물게 움직인다.', role: '아직 부정확한 critic surface를 actor가 즉시 따라가는 feedback 속도를 낮춘다.' },
  ],
  reconstruction: [
    { label: 'Twin critics', value: 'Q1, Q2', note: '독립 error 비교' },
    { label: 'Clipped target', value: 'min(Q1-, Q2-)', note: 'Positive bias 억제' },
    { label: 'Target smoothing', value: 'mu-(s\') + epsilon', note: '좁은 Q peak 평균화' },
    { label: 'Delayed actor', value: 'policy every d steps', note: 'Critic 추정 뒤 update' },
  ],
  mechanism: [
    '같은 replay batch로 구조가 같은 두 critic을 독립 parameter와 optimizer state로 학습한다.',
    'Target actor action에 범위를 제한한 noise를 더해 주변 action의 Q가 함께 높아야 좋은 target이 되도록 만든다.',
    '두 target critic 중 작은 값을 bootstrap target으로 사용해 한쪽의 우연한 positive error가 target을 지배하지 못하게 한다.',
    'Critic을 매 step 갱신하되 actor와 target network는 더 낮은 빈도로 갱신해 부정확한 critic을 즉시 exploit하지 않게 한다.',
    'Twin critic의 차이와 actor action에서의 Q를 함께 기록해 overestimation 완화와 underestimation 위험을 감시한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{a'}_{\text{smoothed target action}}
      &=\operatorname{clip}\!\left(
      \underbrace{\mu_{\theta^-}(s')}_{\text{느린 target actor}}
      +\underbrace{\epsilon}_{\text{target 전용 noise}}
      \right)\\
      \underbrace{y}_{\text{두 critic의 학습 표적}}
      &=\underbrace{r}_{\text{실제 보상}}
      +\gamma(1-d)
      \underbrace{\min_{i=1,2}Q_{\phi_i^-}(s',a')}_{\text{둘 중 작은 미래 추정}}
    \end{aligned}`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{a'}_{\text{흔든 행동}}&=\operatorname{clip}(\mu_{\theta^-}(s')+\epsilon)\\[2pt]
      \underbrace{v'}_{\text{작은 가치}}&=\min_{i=1,2}Q_{\phi_i^-}(s',a')\\[2pt]
      \underbrace{y}_{\text{학습 표적}}&=r+\gamma(1-d)v'
    \end{aligned}`,
    meaning: 'Clipped double Q와 target policy smoothing을 한 식에 결합한 critic target이다. Min은 모든 bias를 없애는 것이 아니라 두 추정의 positive error가 동시에 일어나야 target이 커지게 만든다.',
    symbols: [[String.raw`Q_{\phi_i^-}`, '두 개의 slow target critic'], [String.raw`\min`, '더 보수적인 target 선택'], [String.raw`\epsilon`, '범위를 clip한 target-action noise'], [String.raw`\mu_{\theta^-}`, 'Slow target actor']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{\widetilde\epsilon}_{\text{Gaussian noise}}
      &\sim\mathcal N(0,\sigma^2)\\
      \underbrace{\epsilon}_{\text{target에 실제 넣는 noise}}
      &=\underbrace{\operatorname{clip}(\widetilde\epsilon,-c,c)}_{\text{큰 perturbation 제거}}
    \end{aligned}`,
    meaning: 'Target action 주변에 작은 Gaussian noise를 넣되 action을 지나치게 왜곡하지 않도록 범위를 자른다. 이것은 behavior exploration noise와 목적이 다르며 critic target의 sharp peak를 smoothing한다.',
    symbols: [[String.raw`\sigma`, 'Target smoothing noise scale'], [String.raw`c`, 'Noise 절댓값 상한'], [String.raw`\mathcal N`, 'Gaussian sample'], [String.raw`\operatorname{clip}`, '허용 범위 밖 noise 절단']],
  }],
  evidence: [
    { label: 'Error 분석', question: 'Actor-critic에서 function approximation error가 overestimated value와 나쁜 policy를 만드는가?', intervention: '학습 중 critic estimate와 실제 return의 차이, policy 성능의 관계를 여러 continuous-control baseline에서 추적한다.', observation: 'Overestimation이 actor update를 통해 성능 저하로 이어지는 사례와 추세를 제시한다.', supports: 'Critic error를 policy optimization의 핵심 병목으로 보는 분석을 지지한다.', limit: '모든 실패가 positive bias 하나로만 발생하거나 min target이 정확한 uncertainty estimator라는 뜻은 아니다.' },
    { label: 'Ablation', question: 'Twin critics, delayed update, target smoothing이 각각 전체 개선에 기여하는가?', intervention: 'DDPG 기준선에 세 수정 요소를 조합·제거하며 MuJoCo continuous-control 결과를 비교한다.', observation: '전체 TD3와 주요 구성 요소가 안정성과 return 개선에 기여하는 결과를 보고한다.', supports: '세 장치가 서로 다른 error 경로를 다룬다는 설계를 지지한다.', limit: '특정 benchmark와 implementation에서의 ablation이 모든 action space와 reward scale에 일반화되지는 않는다.' },
  ],
  implementation: ['두 critic이 같은 초기 parameter를 공유하지 않는지 확인한다.', 'Target action noise를 environment action bound 안에서 다시 clip한다.', 'Critic은 매 step, actor와 target은 policy delay 주기에만 update한다.', 'Behavior exploration noise와 target smoothing noise를 별도 hyperparameter·로그로 관리한다.', '두 critic Q, min target, Monte Carlo evaluation return의 gap을 seed별로 비교한다.'],
  assumptions: ['두 critic의 approximation error가 완전히 같은 방향으로 상관되지 않는다.', '좋은 action의 Q가 작은 action perturbation에도 어느 정도 smooth하다.', 'Actor update 사이에 critic이 더 유용한 gradient field를 학습할 수 있다.'],
  failures: ['두 critic이 같은 data와 target으로 빠르게 동조하면 min의 이점이 줄어든다.', 'Min target은 systematic underestimation을 만들 수 있다.', 'Action landscape가 본질적으로 매우 sharp하면 target smoothing이 최적 action을 흐릴 수 있다.'],
  legacy: 'TD3는 알고리즘 이름보다 actor가 critic error를 exploit하는 feedback loop를 분해한 점이 중요하다. Twin critics와 delayed update는 이후 continuous-control baseline의 진단 도구가 되었고 SAC의 clipped double-Q 구현에도 영향을 주었다.',
  nextReading: 'SAC 논문에서 deterministic action과 외부 exploration noise 대신 entropy가 포함된 stochastic policy objective로 exploration과 안정성을 재구성하는 방식을 읽는다.',
  capabilities: ['TD3의 세 수정이 각각 어떤 error 경로를 막는지 설명한다.', 'Behavior noise와 target smoothing noise를 구분한다.', 'Twin-critic min이 uncertainty 보장이나 unbiased estimator가 아님을 말한다.'],
};

export const sac2018Spec: PaperStudySpec = {
  shortTitle: 'Soft Actor-Critic',
  citation: 'Tuomas Haarnoja et al. — Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor',
  yearVenue: '2018 · ICML, PMLR 80',
  sourceUrl: 'https://proceedings.mlr.press/v80/haarnoja18b.html',
  appendixUrl: 'https://arxiv.org/abs/1801.01290',
  before: 'DDPG·TD3는 deterministic actor에 별도 exploration noise를 더한다. 이는 reward landscape가 복잡할 때 한 mode에 일찍 고정되기 쉽고, off-policy actor-critic은 seed와 hyperparameter에 민감한 수렴을 보였다.',
  authorIntent: 'Expected return뿐 아니라 policy entropy도 최대화하는 maximum-entropy framework를 실용적인 off-policy stochastic actor-critic으로 만들고, continuous control에서 sample efficiency와 seed 안정성을 함께 개선하려 했다.',
  thesis: 'Stochastic policy가 높은 Q action을 선호하면서도 entropy를 유지하도록 학습하고 replay data를 재사용하면, continuous-control task에서 효율적이고 비교적 안정적인 off-policy learning이 가능하다.',
  readerBridge: [
    { term: 'Entropy', latex: String.raw`\mathcal H(\pi(\cdot\mid s))`, plain: '같은 state에서 policy가 좋은 action 후보 여러 개에 확률을 얼마나 넓게 남겨두는지 나타낸다.', role: '탐색 noise를 외부 장치가 아니라 학습 objective의 가치 항으로 바꾼다.' },
    { term: 'Temperature', latex: String.raw`\alpha`, plain: 'Reward 한 단위와 entropy 한 단위를 어떤 비율로 바꿀지 정하는 교환비다.', role: '너무 무작위인 policy와 너무 일찍 굳는 policy 사이의 scale을 결정한다.' },
    { term: 'Reparameterization', latex: String.raw`a=f_\theta(\epsilon;s)`, plain: 'Randomness를 외부 noise epsilon으로 떼어 놓고 sampled action을 actor parameter의 미분 가능한 함수로 쓰는 방법이다.', role: 'Critic의 action gradient를 stochastic actor까지 낮은 variance로 전달한다.' },
    { term: 'Version contract', latex: String.raw`\{Q_1,Q_2,V,V^-\}\ \neq\ \{Q_1,Q_2,Q_1^-,Q_2^-\}`, plain: '2018 원 논문과 오늘날 흔한 SAC는 같은 이름을 쓰지만 network와 target owner가 다르다.', role: '후속 간소화와 automatic temperature를 원 논문의 기여로 거슬러 올리지 않게 한다.' },
  ],
  reconstruction: [
    { label: 'Replay state', value: 's ~ D', note: 'Off-policy data reuse' },
    { label: 'Stochastic actor', value: 'a ~ pi_theta(.|s)', note: 'Reparameterized sample' },
    { label: 'Soft value', value: 'Q - alpha log pi', note: 'Reward와 entropy 결합' },
    { label: 'Actor objective', value: 'alpha log pi - Q', note: '높은 Q·넓은 policy' },
  ],
  mechanism: [
    'Replay buffer에서 state와 transition을 sample해 off-policy로 data를 재사용한다.',
    'Gaussian policy의 noise를 외부 random variable로 분리하는 reparameterization으로 action을 sample한다.',
    'Soft value와 soft Q target에 reward뿐 아니라 다음 policy의 entropy 가치를 포함한다.',
    'Actor는 sampled action의 Q를 높이면서 log-probability penalty로 entropy를 유지하는 objective를 최소화한다.',
    '원 2018 논문의 twin Q·별도 value network·target value formulation과, value network를 제거하고 twin target Q·automatic temperature를 쓰는 후속 recipe를 구분해 구현 계약을 선택한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{h_t}_{\text{entropy 가치}}
      &=\alpha\mathcal H(\pi(\cdot\mid s_t))\\
      \underbrace{\widetilde r_t}_{\text{soft reward}}
      &=\underbrace{r(s_t,a_t)}_{\text{환경 reward}}+h_t\\
      \underbrace{J_{\mathrm{soft}}(\pi)}_{\text{soft policy 목표}}
      &=\mathbb E_{\tau\sim\pi}\!\left[
      \sum_t\gamma^t\widetilde r_t\right]
    \end{aligned}`,
    meaning: 'Maximum-entropy objective는 reward와 함께 매 state의 action distribution entropy를 가치로 센다. Alpha는 exploration bonus라는 한 문장보다 reward 단위와 entropy 단위의 교환비로 보는 편이 정확하다.',
    symbols: [[String.raw`\mathcal H`, 'Policy action distribution의 entropy'], [String.raw`\alpha`, 'Reward와 entropy의 상대 scale'], [String.raw`\tau`, 'Stochastic policy가 만든 trajectory'], [String.raw`\gamma^t`, '먼 미래 항의 할인']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{a_\theta}_{\text{현재 policy의 action sample}}
      &=f_\theta(\epsilon;s),\quad s\sim\mathcal D\\
      \underbrace{c_{\mathcal H}}_{\text{policy 폭의 비용}}
      &=\alpha\log\pi_\theta(a_\theta\mid s)\\
      \underbrace{q_{\min}}_{\text{보수적 action value}}
      &=\min_iQ_{\phi_i}(s,a_\theta)\\
      \underbrace{J_\pi(\theta)}_{\text{actor가 줄일 soft cost}}
      &=\mathbb E[c_{\mathcal H}-q_{\min}]
    \end{aligned}`,
    meaning: 'Actor는 Q가 높은 action을 선택하도록 -Q를 줄이면서, distribution이 지나치게 좁아지지 않도록 log-probability 항을 함께 최적화한다. Squashed Gaussian에서는 tanh 변환의 Jacobian correction을 log-probability에 포함해야 한다.',
    symbols: [[String.raw`\log\pi_\theta(a\mid s)`, 'Sample action의 corrected log-probability'], [String.raw`Q_\phi`, '현재 action의 soft value estimate'], [String.raw`\mathcal D`, 'Replay state distribution'], [String.raw`\alpha`, 'Entropy temperature']],
  }],
  evidence: [
    { label: 'Sample efficiency', question: 'Stochastic maximum-entropy actor-critic이 on-policy·off-policy baseline보다 interaction을 효율적으로 쓰는가?', intervention: '여러 MuJoCo continuous-control task에서 DDPG, PPO 등 기준선과 environment step 대비 return을 비교한다.', observation: 'SAC가 보고된 task에서 높은 final return과 강한 sample efficiency를 보인다.', supports: 'Replay 기반 maximum-entropy objective의 실용성을 지지한다.', limit: '비교 구현·hyperparameter 차이를 완전히 제거하거나 모든 environment에서 우위를 보장하지 않는다.' },
    { label: 'Seed 안정성', question: '알고리즘이 random seed와 task 변화에 덜 brittle한가?', intervention: '여러 seed의 learning curve와 final performance 분산을 continuous-control task에서 비교한다.', observation: '논문은 기존 deep RL 방법보다 안정적인 학습과 높은 성능을 보고한다.', supports: 'Entropy-regularized stochastic policy의 robustness 주장을 지지한다.', limit: 'Production safety, distribution shift, real-robot repeatability까지 입증하지 않는다.' },
  ],
  implementation: ['먼저 원 논문의 twin Q + soft value/target-value formulation인지, 현대의 no-value + twin target-Q formulation인지 명시한다.', 'Gaussian mean·log standard deviation을 출력하고 reparameterized sample 뒤 tanh로 action bound를 맞춘다.', 'Tanh Jacobian correction을 포함한 log-probability를 numerical test로 검증한다.', 'Critic target과 actor objective에서 alpha·log-probability 부호가 일관적인지 작은 batch로 계산한다.', 'Fixed alpha와 automatic temperature tuning을 별도 실험으로 두고 후자를 원 논문의 동일 기여로 표기하지 않는다.'],
  assumptions: ['Entropy가 높은 policy가 관심 task의 탐색과 robustness에 유용하다.', 'Replay distribution이 현재 stochastic policy의 중요한 state-action 영역을 포함한다.', 'Action bound와 transformed distribution의 density를 정확히 계산한다.'],
  failures: ['Reward scale과 alpha의 비율이 맞지 않으면 reward를 무시하거나 policy가 일찍 collapse한다.', 'Tanh correction 누락은 잘못된 density와 actor gradient를 만든다.', 'Offline dataset에서는 out-of-distribution action의 Q overestimation을 별도 제약 없이 해결하지 못한다.'],
  legacy: 'SAC는 off-policy continuous control의 대표 기준선이 되었고 maximum-entropy RL을 실용화했다. 원 ICML 논문도 이미 twin critics와 그 minimum을 사용했다. 후속 SAC는 별도 value network를 제거하고 target Q를 두며 target entropy에 따른 automatic temperature tuning을 널리 사용하지만, 이 변경을 2018년 최초 formulation과 구분해야 한다.',
  nextReading: '세 논문 경로를 마친 뒤 RLHF·RLVR 글에서 entropy, KL reference, verifiable reward가 language-model token policy에서 어떤 다른 계약을 갖는지 비교한다.',
  capabilities: ['Maximum-entropy objective에서 alpha의 단위와 역할을 설명한다.', 'Squashed Gaussian의 reparameterization과 log-probability correction을 구현한다.', '원 SAC와 현대 SAC recipe의 차이를 출처 단위로 구분한다.'],
};
