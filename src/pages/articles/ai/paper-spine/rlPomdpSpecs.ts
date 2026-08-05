import type { PaperStudySpec } from './FoundationalPaperStudy';

export const pomdp1998Spec: PaperStudySpec = {
  shortTitle: 'Planning and Acting in POMDPs',
  citation: 'Leslie Pack Kaelbling, Michael L. Littman, Anthony R. Cassandra - Planning and Acting in Partially Observable Stochastic Domains',
  yearVenue: '1998 · Artificial Intelligence 101',
  sourceUrl: 'https://people.csail.mit.edu/lpk/papers/aij98-pomdp.pdf',
  appendixUrl: 'https://doi.org/10.1016/S0004-3702(98)00023-X',
  before: '완전 관측 MDP의 policy는 실제 world state를 입력으로 받는다. 그러나 위치가 다른 복도가 똑같이 보이거나 sensor가 잘못된 junction을 보고하면 observation-action mapping은 같은 모양에서 같은 행동을 반복하며 deterministic loop에 빠질 수 있다. History를 전부 보관하는 policy는 원리는 맞지만 planning state가 계속 커진다.',
  authorIntent: '운영 연구의 POMDP 이론을 AI planning 관점으로 정리하고, 부분 관측 agent를 state estimator와 belief-state policy로 분해한 뒤 exact offline solution의 기하와 계산 복잡도, finite-memory controller 추출까지 하나의 흐름으로 제시하려 했다.',
  thesis: 'Known transition·observation model에서 action-observation history를 world state에 대한 posterior belief로 압축하면 belief 위의 continuous-state MDP로 다시 쓸 수 있고, finite-horizon optimal value는 policy tree가 만드는 linear function의 upper surface가 된다.',
  readerBridge: [
    { term: 'Latent state', latex: String.raw`s_t`, plain: 'World를 다음 순간까지 예측하는 데 필요한 실제 변수지만 agent가 직접 보지는 못하는 상태다.', role: '현재 sensor 화면과 실제 world state를 같은 것으로 취급하지 않게 한다.' },
    { term: 'Observation', latex: String.raw`o_t`, plain: 'Latent state와 직전 action이 만든 noisy evidence다. 서로 다른 state가 같은 observation을 낼 수 있다.', role: '왜 observation-action mapping만으로는 deterministic loop가 생길 수 있는지 설명한다.' },
    { term: 'History', latex: String.raw`H_t=(o_0,a_0,\ldots,o_t)`, plain: '현재 observation에 오기까지 실행한 action과 본 observation의 순서 기록이다.', role: '한 화면에 없는 위치·속도 정보를 time sequence에서 복원할 근거가 된다.' },
    { term: 'Belief', latex: String.raw`b_t(s)=\Pr(s_t=s\mid H_t)`, plain: 'History를 본 뒤 각 latent state 후보에 남긴 posterior probability distribution이다.', role: '가장 가능성 높은 state 하나가 아니라 uncertainty의 모양까지 policy에 전달한다.' },
    { term: 'Upper envelope', latex: String.raw`V(b)=\max_p b^\top\alpha_p`, plain: '각 policy tree가 만드는 직선 또는 평면 가운데 현재 belief에서 가장 높은 조각만 고른 표면이다.', role: 'POMDP value가 왜 여러 선형 조각이 이어진 볼록한 모양이 되는지 그림으로 읽게 한다.' },
  ],
  reconstruction: [
    { label: 'Latent world', value: 's -> T(s,a,s\')', note: '직접 보이지 않는 state' },
    { label: 'Observation', value: 'o ~ O(s\',a)', note: 'state가 낸 noisy evidence' },
    { label: 'State estimator', value: 'b\' = SE(b,a,o)', note: 'Bayesian belief update' },
    { label: 'Belief policy', value: 'a ~ pi(b)', note: '불확실성까지 보고 행동' },
  ],
  mechanism: [
    'POMDP를 finite state S, action A, transition T, reward R, observation set Omega, observation model O로 정의한다.',
    '이전 belief를 action-conditioned transition으로 다음 state prior에 전파한다.',
    '실제 observation의 likelihood를 state별 prior에 곱하고 전체 mass로 정규화해 posterior belief를 만든다.',
    'Belief가 history의 sufficient statistic이므로 policy는 실제 state가 아니라 continuous belief simplex에서 action을 고른다.',
    'Finite horizon의 모든 conditional policy tree는 belief에 대한 linear value vector를 만들고, optimal value는 이들의 pointwise maximum이다.',
    'Dominated vector를 prune하고 witness region을 찾아 필요한 policy tree만 남기지만 exact backup의 worst-case exponential growth는 사라지지 않는다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{\bar b_{t+1}(s')}_{\text{action 뒤 next-state prior}}
      &=\sum_sT(s,a_t,s')b_t(s)\\
      \underbrace{w_{t+1}(s')}_{\text{observation을 반영한 mass}}
      &=O(s',a_t,o_{t+1})\bar b_{t+1}(s')\\
      \underbrace{b_{t+1}(s')}_{\text{정규화한 posterior}}
      &=\frac{w_{t+1}(s')}{\sum_jw_{t+1}(j)}
    \end{aligned}`,
    meaning: '논문 식을 prediction과 correction 두 행으로 재구성한 Bayesian state estimator다. 먼저 action의 transition uncertainty로 prior belief를 옮기고, observation likelihood를 곱한 뒤 모든 state의 mass 합으로 나누어 합이 1이 되게 정규화한다.',
    symbols: [[String.raw`b_t(s)`, 'History를 본 뒤 state s일 posterior probability'], [String.raw`T(s,a_t,s')`, 'Action 뒤 s에서 s prime으로 갈 확률'], [String.raw`O(s',a_t,o_{t+1})`, 'State s prime이 observation을 낼 likelihood'], [String.raw`\sum_j w_{t+1}(j)`, 'Observation을 반영한 모든 state mass의 합인 정규화 분모']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{V_p(b)}_{\text{policy tree }p\text{의 value}}
      &=\sum_s b(s)\alpha_p(s)\\
      \underbrace{V_t^*(b)}_{\text{finite-horizon optimal value}}
      &=\max_{p\in\mathcal P_t}V_p(b)
    \end{aligned}`,
    meaning: 'Depth t policy tree p의 state별 return alpha_p를 current belief로 평균하면 linear value가 된다. 모든 conditional policy tree 중 가장 큰 값을 취하므로 finite-horizon optimal value는 belief simplex 위에서 piecewise-linear and convex하다.',
    symbols: [[String.raw`\mathcal P_t`, 'Depth t의 conditional policy tree 집합'], [String.raw`\alpha_p(s)`, 'True state가 s일 때 policy tree p의 return'], [String.raw`b(s)`, '현재 world state에 둔 belief mass'], [String.raw`V_t(b)`, 'Belief b에서 남은 t step의 optimal value']],
  }],
  evidence: [
    { label: 'Tiger geometry', question: 'Belief에 따른 sensing·acting policy와 value geometry가 실제로 어떻게 생기는가?', intervention: '두 문 중 하나 뒤에 tiger가 있는 고전 문제에서 listen과 open action을 조건부 policy tree로 열거하고 finite-horizon value iteration을 수행한다.', observation: '불확실한 belief 중앙에서는 listen이 선택되고 한쪽 belief가 충분히 커지면 반대 문을 연다. 각 tree의 직선 value 중 upper surface가 optimal value를 구성한다.', supports: '불확실성 자체가 action 선택에 들어가며 information-gathering action의 비용과 미래 가치가 같은 objective에서 비교됨을 시각적으로 지지한다.', limit: '작은 discrete problem의 exact geometry이며 raw pixels나 continuous robot state의 계산 가능성을 입증하지 않는다.' },
    { label: 'Witness algorithm', question: 'Dominated policy tree를 전부 생성하지 않고 exact value backup을 줄일 수 있는가?', intervention: 'Exhaustive enumeration 대신 각 action의 witness belief를 찾고 그 belief에서 유용한 vector만 반복 추가한다.', observation: '불필요한 vector 생성을 크게 줄일 수 있지만 저자들은 related parameters에 polynomial인 exact algorithm이 장기간의 complexity question을 해결할 만큼 어렵다고 설명한다.', supports: 'Value geometry를 이용한 pruning이 exact solver의 실제 계산을 줄일 수 있음을 보여준다.', limit: 'POMDP exact planning의 worst-case exponential dependence나 belief dimension 문제를 제거하지 않는다.' },
    { label: 'Finite controller', question: 'Offline belief policy를 실행 시 bounded memory controller로 바꿀 수 있는가?', intervention: 'Converged value-function vector와 observation-conditioned successor relation에서 controller node와 transition을 추출한다.', observation: 'Tiger 예처럼 value structure가 안정되는 경우 finite controller를 얻을 수 있지만 infinite-horizon value가 무한 segment를 가지면 finite exact representation이 없을 수 있다.', supports: '일부 POMDP에서 belief를 매번 명시적으로 저장하지 않는 finite controller 추출 가능성을 지지한다.', limit: '모든 POMDP가 finite transient optimal policy를 가진다는 주장은 아니다.' },
  ],
  implementation: ['Two-state Tiger POMDP의 T, O, reward table과 initial belief를 명시한다.', 'Action 뒤 prior prediction, observation likelihood multiplication, normalization을 별도 함수로 구현하고 posterior 합이 1인지 검사한다.', 'Depth 1~4 policy tree의 alpha vector를 만들고 belief p in [0,1] grid에서 upper envelope를 그린다.', 'Listen cost와 observation accuracy를 sweep해 sensing action이 optimal인 belief interval이 어떻게 바뀌는지 확인한다.', 'Exact state count를 늘리며 vector 수와 backup 시간을 기록해 theory의 scalability boundary를 재현한다.'],
  assumptions: ['Finite enumerated state, action, observation set과 known transition·observation model을 둔다.', 'Belief update의 conditional probabilities가 model과 실제 environment에서 일치한다.', 'Finite-horizon piecewise-linear convex 결과와 discounted infinite-horizon approximation의 범위를 구분한다.', 'Reward objective가 information action의 cost와 future decision benefit을 올바르게 표현한다.'],
  failures: ['Observation model이 틀리면 normalized belief도 자신감 있게 틀릴 수 있다.', 'State alias가 model state 자체에서 빠졌다면 history를 아무리 update해도 필요한 변수를 복원하지 못한다.', 'Exact belief planning은 state·observation 수와 horizon이 커지며 빠르게 폭발한다.', 'Expected reward optimal policy가 risk-sensitive 또는 hard safety requirement와 일치하지 않을 수 있다.'],
  legacy: '이 논문은 부분 관측 제어를 state estimator와 belief policy로 분리하는 표준 언어를 정착시켰다. 현대 recurrent policy와 latent world model도 history를 decision-sufficient representation으로 압축하려 하지만, 그 hidden state가 정확한 posterior라는 보장은 별도로 검증해야 한다.',
  nextReading: 'Kalman의 1960년 논문은 belief 전체를 열거하는 대신 linear dynamics와 Gaussian uncertainty 아래에서 mean과 covariance만 재귀적으로 추적하는 계산 가능한 특수해를 제공한다.',
  nextLinks: [{ slug: 'paper-kalman-filter-1960', label: 'Kalman Filter 1960으로 이어가기', reason: '전체 belief를 열거하는 대신 선형 동역학과 평균·공분산만으로 상태를 추적하는 특수해를 비교한다.' }],
  capabilities: ['State, observation, history와 belief를 서로 바꾸어 부르지 않는다.', 'Bayesian belief update를 prediction·correction·normalization으로 구현한다.', 'Policy tree의 alpha vector가 piecewise-linear convex value를 만드는 이유를 설명한다.', 'Information gathering action과 task action을 하나의 long-term value에서 비교한다.'],
};

export const kalman1960Spec: PaperStudySpec = {
  shortTitle: 'Kalman Filtering',
  citation: 'R. E. Kalman - A New Approach to Linear Filtering and Prediction Problems',
  yearVenue: '1960 · Journal of Basic Engineering 82',
  sourceUrl: 'https://doi.org/10.1115/1.3662552',
  appendixUrl: 'https://people.math.harvard.edu/archive/116_fall_03/handouts/Kalman1960.pdf',
  before: 'Wiener filtering은 optimal impulse response를 중심으로 기술되어 복잡한 nonstationary·growing-memory 문제에서 새 derivation과 큰 계산을 요구했다. 관측하지 못하는 내부 변수를 시간에 따라 갱신하는 구현 가능한 state representation이 필요했다.',
  authorIntent: 'Random process를 state-transition 방식의 first-order system으로 표현하고, 관측이 들어올 때마다 optimal prediction error covariance와 linear filter coefficient를 재귀적으로 계산하는 통일된 방법을 제시하려 했다.',
  thesis: 'Linear stochastic dynamics를 state로 쓰면 과거 관측 전체를 다시 처리하지 않고 state estimate와 error covariance만 갱신할 수 있고, covariance recursion에서 매 시점의 optimal linear correction coefficient를 얻을 수 있다.',
  readerBridge: [
    { term: 'State estimate', latex: String.raw`\widehat x_k`, plain: '직접 볼 수 없는 position·velocity 같은 state의 현재 최선 추정 평균이다.', role: 'Sensor measurement와 추정하려는 hidden state를 분리한다.' },
    { term: 'Covariance', latex: String.raw`P_k`, plain: '각 state direction의 error가 얼마나 흔들리고 서로 어떻게 함께 흔들리는지 나타내는 matrix다.', role: 'Filter가 model과 sensor를 얼마나 믿을지 방향별로 계산하게 한다.' },
    { term: 'Innovation', latex: String.raw`\nu_k=z_k-H_k\widehat x_k^-`, plain: '새 sensor 값 중 dynamics prediction이 아직 설명하지 못한 residual이다.', role: 'Measurement 전체가 아니라 실제로 새로 들어온 evidence만 correction에 사용한다.' },
    { term: 'Noise contracts', latex: String.raw`Q_k,\ R_k`, plain: 'Q는 dynamics가 놓친 process uncertainty, R은 sensor measurement uncertainty의 covariance다.', role: '고정 smoothing knob가 아니라 Kalman gain과 consistency를 결정하는 model assumption이 된다.' },
  ],
  reconstruction: [
    { label: 'Dynamic prior', value: 'x^- = F x + B u', note: 'model로 state 예측' },
    { label: 'Uncertainty prior', value: 'P^- = FPF^T + Q', note: 'process noise 누적' },
    { label: 'Innovation', value: 'y = z - Hx^-', note: 'sensor와 prediction 차이' },
    { label: 'Correction', value: 'x = x^- + Ky', note: 'covariance로 신뢰 배분' },
  ],
  mechanism: [
    '관측하고 싶은 quantity를 first-order state vector로 정하고 linear transition과 measurement relation을 쓴다.',
    '이전 posterior mean을 dynamics로 전파하고 process-noise covariance Q를 더해 prior covariance를 만든다.',
    '새 measurement와 predicted measurement의 차이인 innovation을 계산한다.',
    'Prior covariance와 measurement-noise covariance R의 상대 크기로 Kalman gain을 계산한다.',
    'Innovation을 gain만큼 state mean에 반영하고 관측으로 줄어든 posterior covariance를 갱신한다.',
    '다음 measurement에서는 과거 raw data가 아니라 이 posterior mean·covariance가 history의 요약으로 재사용된다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{\widehat x_k^-}_{\text{measurement 전 state 평균}}
      &=
      \underbrace{F_k\widehat x_{k-1}}_{\text{dynamics로 전파}}
      +\underbrace{B_ku_{k-1}}_{\text{known control 효과}}
    \end{aligned}`,
    meaning: '현대 discrete notation의 state-mean time update다. Previous posterior mean을 dynamics로 옮기고 known control input의 영향을 더한다.',
    symbols: [[String.raw`\widehat x_k^-`, 'Measurement 전 predicted state mean'], [String.raw`F_k,B_k`, 'State transition과 control input matrix'], [String.raw`u_{k-1}`, '이전 timestep에 적용한 control input']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{P_{\mathrm{dyn}}}_{\text{dynamics가 옮긴 uncertainty}}
      &=F_kP_{k-1}F_k^\top\\
      \underbrace{P_k^-}_{\text{measurement 전 covariance}}
      &=P_{\mathrm{dyn}}+\underbrace{Q_k}_{\text{process uncertainty}}
    \end{aligned}`,
    meaning: 'Prediction uncertainty update다. Previous covariance를 state transition으로 변환하고 unmodeled dynamics와 disturbance를 나타내는 process-noise covariance를 더한다.',
    symbols: [[String.raw`P_k^-`, 'Measurement 전 prediction error covariance'], [String.raw`F_kP_{k-1}F_k^\top`, 'Dynamics로 전파된 previous uncertainty'], [String.raw`Q_k`, 'Process model에 추가되는 noise covariance']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{S_{\mathrm{model}}}_{\text{sensor space의 prior uncertainty}}
      &=H_kP_k^-H_k^\top\\
      \underbrace{S_k}_{\text{innovation covariance}}
      &=S_{\mathrm{model}}+\underbrace{R_k}_{\text{sensor noise}}
    \end{aligned}`,
    meaning: 'Predicted state covariance를 measurement space로 옮기고 sensor-noise covariance를 더해 innovation이 흔들릴 수 있는 범위를 계산한다.',
    symbols: [[String.raw`S_k`, 'Innovation covariance'], [String.raw`R_k`, 'Measurement noise covariance'], [String.raw`H_k`, 'State를 measurement space로 옮기는 matrix']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{C_{xz}}_{\text{state-sensor cross covariance}}
      &=P_k^-H_k^\top\\
      \underbrace{K_k}_{\text{state 방향별 correction gain}}
      &=C_{xz}\underbrace{S_k^{-1}}_{\text{innovation scale 보정}}
    \end{aligned}`,
    meaning: 'State-measurement cross covariance를 innovation uncertainty로 나눠 direction별 correction gain을 얻는다.',
    symbols: [[String.raw`K_k`, 'Prediction과 sensor 사이의 correction gain'], [String.raw`P_k^-H_k^\top`, 'State와 measurement의 cross covariance'], [String.raw`S_k^{-1}`, 'Innovation covariance의 inverse scale']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{\nu_k}_{\text{새 sensor evidence}}
      &=z_k-H_k\widehat x_k^-\\
      \underbrace{\widehat x_k}_{\text{posterior state 평균}}
      &=\widehat x_k^-+K_k\nu_k
    \end{aligned}`,
    meaning: 'Actual sensor와 predicted measurement의 residual을 gain만큼 posterior state mean에 반영한다.',
    symbols: [[String.raw`z_k-H_k\widehat x_k^-`, 'Measurement innovation 또는 residual'], [String.raw`\widehat x_k`, 'Correction 뒤 posterior state mean'], [String.raw`K_k`, 'Innovation을 state direction으로 옮기는 gain']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{P_k}_{\text{posterior covariance}}
      &=
      \underbrace{(I-K_kH_k)}_{\text{measurement가 설명한 부분 제거}}
      P_k^-
    \end{aligned}`,
    meaning: 'Measurement에서 얻은 정보만큼 predicted uncertainty를 줄여 posterior covariance를 만든다. State mean만 보정하고 covariance를 그대로 두면 다음 gain의 신뢰 계산이 틀어진다.',
    symbols: [[String.raw`P_k`, 'Correction 뒤 posterior error covariance'], [String.raw`I-K_kH_k`, 'Measurement가 설명한 uncertainty를 제거하는 factor'], [String.raw`P_k^-`, 'Correction 전 predicted covariance']],
  }],
  evidence: [
    { label: 'Unified recursion', question: 'Stationary impulse-response 해법 없이 다양한 filtering problem을 같은 계산으로 풀 수 있는가?', intervention: 'State transition으로 random process를 표현하고 optimal prediction-error covariance의 nonlinear difference equation을 유도한다.', observation: 'Growing·infinite memory와 stationary·nonstationary statistics를 같은 covariance recursion으로 다루며 각 시점의 linear filter coefficient를 covariance에서 얻는다.', supports: 'State와 covariance가 machine computation에 적합한 recursive sufficient summary가 된다는 핵심 기여를 지지한다.', limit: 'Arbitrary nonlinear dynamics나 unknown noise statistics에서 exact optimality를 입증하지 않는다.' },
    { label: 'Noisy measurement', question: 'Sensor noise와 model uncertainty의 상대 크기가 correction을 올바른 방향으로 바꾸는가?', intervention: 'Signal과 additive noise 예제에서 noise-to-signal variance 비를 바꾸어 optimal predictor coefficient를 분석한다.', observation: 'Measurement noise가 매우 크면 sensor에 작은 weight를 주고 prediction에 의존하며, measurement가 정확하면 correction weight가 커지는 예상 가능한 동작을 보인다.', supports: 'Gain이 heuristic smoothing coefficient가 아니라 uncertainty ratio에서 나옴을 설명한다.', limit: '실제 Q·R을 잘못 설정했을 때의 inconsistency나 outlier robustness를 해결하지 않는다.' },
    { label: 'Position & velocity', question: '직접 측정하지 않은 velocity를 noisy position history에서 state로 추정할 수 있는가?', intervention: 'Unknown constant velocity로 움직이는 particle의 noisy position measurement를 state-transition model로 구성한다.', observation: 'Position과 velocity를 함께 state에 넣으면 current observation과 dynamic prior를 결합해 둘의 estimate를 갱신할 수 있다.', supports: '한 camera frame에 없는 velocity 같은 hidden variable을 temporal model과 sensor history로 복원하는 state-estimation 관점을 지지한다.', limit: 'Constant-velocity linear model이 wheel slip·occlusion·multi-modal association을 표현한다는 뜻은 아니다.' },
  ],
  implementation: ['1D constant-velocity state [position, velocity]와 position-only sensor H를 만든다.', 'F, Q, R, initial mean·covariance를 명시하고 prediction과 correction을 서로 다른 함수로 구현한다.', 'Innovation, innovation covariance, Kalman gain, posterior covariance를 매 timestep log한다.', 'R을 sweep해 sensor trust가, Q를 sweep해 model trust가 estimate와 lag를 어떻게 바꾸는지 그린다.', 'Outlier, biased sensor, nonlinear motion을 주입해 covariance consistency와 residual whiteness가 깨지는 지점을 기록한다.'],
  assumptions: ['State transition과 observation이 linear matrix relation으로 충분히 표현된다.', 'Process와 measurement noise의 mean·covariance를 알고 독립 또는 정해진 correlation 구조로 모델링한다.', 'Squared-error 기준의 optimal mean estimate와 Gaussian posterior의 완전한 mean·covariance 표현을 구분한다.', 'Initial covariance가 실제 initial uncertainty와 일치할수록 calibration이 의미 있다.'],
  failures: ['Q가 너무 작으면 틀린 dynamics를 과신해 sensor evidence를 늦게 반영한다.', 'R이 너무 작으면 outlier와 high-frequency noise를 실제 motion으로 따라간다.', 'Nonlinear·multimodal uncertainty를 mean과 covariance 하나로 압축하면 존재하는 mode를 잃을 수 있다.', 'Unobservable state direction은 sensor history가 길어도 독립적으로 복원할 수 없다.'],
  legacy: 'Kalman filter는 signal processing, tracking, navigation과 control에서 model-based state estimation의 기준선이 되었다. EKF·UKF·particle filter는 nonlinear 또는 non-Gaussian 문제로 범위를 넓히며, learned recurrent state는 model equation을 data로 대체하지만 uncertainty와 observability 검증 책임은 남는다.',
  nextReading: 'DRQN은 known linear state model 대신 LSTM이 raw observation sequence에서 action value에 필요한 memory를 학습하도록 만들어, belief approximation을 deep RL architecture 안으로 가져온다.',
  nextLinks: [{ slug: 'paper-drqn-2015', label: 'DRQN 2015로 이어가기', reason: '명시적 선형 상태 모델 대신 관측 이력에서 제어에 필요한 기억을 학습하는 경로를 비교한다.' }],
  capabilities: ['Prediction과 correction의 mean·covariance 계산을 구현한다.', 'Kalman gain을 model-versus-sensor uncertainty의 matrix-valued trust ratio로 설명한다.', 'Linear-Gaussian optimality와 practical approximation을 구분한다.', 'Innovation과 covariance consistency로 estimator failure를 진단한다.'],
};

export const drqn2015Spec: PaperStudySpec = {
  shortTitle: 'Deep Recurrent Q-Network',
  citation: 'Matthew Hausknecht, Peter Stone - Deep Recurrent Q-Learning for Partially Observable MDPs',
  yearVenue: '2015 · AAAI Fall Symposium / arXiv',
  sourceUrl: 'https://arxiv.org/abs/1507.06527',
  appendixUrl: 'https://www.cs.utexas.edu/~pstone/Papers/bib2html/b2hd-SDMIA15-Hausknecht.html',
  before: 'DQN은 네 frame을 고정 stack해 velocity 같은 짧은 history를 입력으로 만들었지만 필요한 memory length를 task 전에 정해야 했다. Sensor dropout이나 long occlusion처럼 observation quality가 바뀌는 경우 fixed window는 history의 어떤 부분을 보존할지 학습하지 못한다.',
  authorIntent: 'DQN의 first post-convolutional fully connected layer를 LSTM으로 바꾸면 single frame만 보면서도 temporal information을 통합하고, full·partial observability 변화에 frame stack보다 잘 적응하는지 실험하려 했다.',
  thesis: 'DRQN은 recurrent hidden state로 observation history를 압축해 standard와 flickering Atari에서 DQN 수준의 control을 학습할 수 있고, partial observation으로 학습했을 때 evaluation observability 변화에 더 매끄럽게 반응한다.',
  readerBridge: [
    { term: 'Fixed frame stack', latex: String.raw`[o_{t-k+1},\ldots,o_t]`, plain: '최근 k개 observation을 input channel로 그대로 붙인 유한 history window다.', role: '짧은 velocity는 드러내지만 필요한 memory length를 task 전에 고정한다.' },
    { term: 'Recurrent hidden state', latex: String.raw`h_t`, plain: 'LSTM이 current feature와 previous hidden을 합쳐 만든 learned history summary다.', role: 'Q-learning에 유용한 과거 정보를 고정 window 대신 network 내부에 누적한다.' },
    { term: 'Sequence replay', latex: String.raw`(o,a,r,d)_{t:t+L}`, plain: '시간 순서와 episode boundary를 보존한 replay slice다.', role: 'Recurrent hidden을 올바른 prefix로 재구성하고 timestep별 TD target을 만든다.' },
    { term: 'BPTT boundary', latex: String.raw`L`, plain: 'Gradient를 몇 timestep 뒤까지 펼쳐 보낼지 정한 unroll 길이다.', role: 'LSTM capacity와 별개로 training에서 직접 credit을 전달할 effective horizon을 제한한다.' },
  ],
  reconstruction: [
    { label: 'Single frame', value: 'o_t -> CNN', note: '현재 visual evidence' },
    { label: 'Recurrent memory', value: 'h_t = LSTM(phi(o_t),h_t-1)', note: 'history를 learned state로 압축' },
    { label: 'Action values', value: 'Q(h_t,a)', note: 'belief proxy에서 control' },
    { label: 'Sequence replay', value: 'unroll + TD targets', note: '시간 순서로 gradient' },
  ],
  mechanism: [
    'DQN convolutional encoder는 매 시점의 single image를 feature vector로 바꾼다.',
    '기존 fully connected layer 대신 LSTM이 feature와 이전 hidden state를 받아 memory를 갱신한다.',
    'LSTM output에서 discrete action Q values를 예측하고 epsilon-greedy action을 선택한다.',
    'Replay에서 episode sequence를 뽑고 target Q-network로 timestep별 one-step TD target을 계산한다.',
    'Sequential update는 episode 처음부터 hidden state를 이어 가지만 sample correlation이 커지고, random update는 임의 위치에서 zero state로 시작해 앞 history를 잃는다.',
    'Flickering Atari에서는 frame을 확률 0.5로 가려 position·velocity를 한 frame에서 얻지 못하게 하고 recurrence의 시간 통합을 비교한다.',
  ],
  equations: [{
    latex: String.raw`\begin{aligned}
      \underbrace{e_t}_{\text{current-frame feature}}
      &=\phi(o_t)\\
      \underbrace{h_t}_{\text{learned history state}}
      &=\operatorname{LSTM}_\theta(e_t,h_{t-1})
    \end{aligned}`,
    meaning: 'Current single-frame feature와 previous memory를 LSTM이 결합해 learned history state를 갱신한다. h_t는 true Bayesian belief가 아니라 Q-learning objective에 유용하도록 학습된 statistic이다.',
    symbols: [[String.raw`\phi(o_t)`, 'Current frame의 convolutional feature'], [String.raw`h_{t-1},h_t`, '이전과 현재 recurrent hidden state']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{q_t}_{\text{모든 discrete action value}}
      &=W_Qh_t+b_Q\\
      \underbrace{Q_\theta(h_t,a_t)}_{\text{실행 action의 prediction}}
      &=(q_t)_{a_t}
    \end{aligned}`,
    meaning: 'Recurrent hidden state에서 chosen action의 predicted return을 linear action head로 읽는다. 동일한 h_t에서 모든 action head를 계산해 epsilon-greedy control에 사용한다.',
    symbols: [[String.raw`Q_\theta(h_t,a_t)`, 'Learned memory에서 action a_t의 predicted return'], [String.raw`W_Q,b_Q`, 'Hidden state에서 모든 discrete action value를 한 번에 읽는 linear head의 weight와 bias']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{v_{t+1}^-}_{\text{target network의 next value}}
      &=\max_{a'}Q_{\theta^-}(h_{t+1}^-,a')\\
      \underbrace{Y_t}_{\text{timestep }t\text{의 TD target}}
      &=\underbrace{r_{t+1}}_{\text{실제 reward}}
      +\gamma(1-d_t)v_{t+1}^-
    \end{aligned}`,
    meaning: 'Sequence의 각 timestep에서 target DRQN으로 DQN bootstrap target을 만든다. Terminal flag는 episode 끝에서 다른 history로 미래 value가 이어지는 것을 차단한다.',
    symbols: [[String.raw`\theta^-`, '천천히 갱신되는 target DRQN parameter'], [String.raw`d_t`, 'Terminal transition에서 미래 bootstrap을 차단하는 flag'], [String.raw`Y_t`, '각 timestep의 recurrent TD target']],
  }, {
    latex: String.raw`\begin{aligned}
      \underbrace{\delta_t}_{\text{recurrent TD residual}}
      &=Q_\theta(h_t,a_t)-Y_t\\
      \underbrace{\mathcal L}_{\text{unroll 평균 loss}}
      &=\frac1L\sum_{t=1}^{L}\delta_t^2
    \end{aligned}`,
    meaning: 'Unroll의 valid timestep TD residual을 평균한다. Hidden state가 correct history를 encode하려면 sequence start, burn-in, padding mask와 terminal boundary가 loss semantics에 맞아야 한다.',
    symbols: [[String.raw`L`, 'Backpropagation through time의 loss unroll length'], [String.raw`Q_\theta(h_t,a_t)-Y_t`, 'Timestep t의 recurrent TD residual']],
  }],
  evidence: [
    { label: 'Standard Atari', question: 'Recurrence가 fixed four-frame stack을 대체해도 fully observed benchmark 성능을 유지하는가?', intervention: 'DQN은 four-frame input, DRQN은 single frame과 LSTM을 사용하고 9개 standard Atari game에서 같은 action-value objective로 비교한다.', observation: 'DRQN은 standard games에서 DQN과 비슷한 성능을 재현했지만 저자 결론은 recurrence가 systematic advantage를 주지는 않았다는 것이다.', supports: 'Fixed frame stack 없이 learned memory로 short temporal information을 통합할 수 있음을 지지한다.', limit: 'LSTM이 exact belief를 학습했거나 모든 long-memory task에서 우월함을 입증하지 않는다.' },
    { label: 'Flickering games', question: '현재 frame 절반이 가려질 때 history integration이 control에 도움이 되는가?', intervention: '각 timestep screen을 probability 0.5로 완전히 가리고 DQN과 DRQN을 Flickering Pong 등 partial-observation variants에서 비교한다.', observation: 'DRQN은 single frames를 시간에 걸쳐 통합해 partial variants에서도 strong performance를 보였고 position·velocity 추정이 필요한 Pong을 수행했다.', supports: 'Recurrent memory가 stochastic observation dropout을 보완할 수 있다는 empirical evidence다.', limit: 'Occlusion이 independent full-frame blackout인 synthetic corruption이며 realistic sensor bias·latency·multi-object association과 다르다.' },
    { label: 'Observability transfer', question: 'Training과 evaluation의 observation quality가 달라질 때 어느 representation이 더 잘 적응하는가?', intervention: 'Full 또는 partial observation에서 학습한 agent를 evaluation에서 incrementally changing flicker probability로 테스트한다.', observation: 'Partial observation으로 학습한 DRQN은 observability가 좋아질수록 성능이 증가했고, full observation에서 학습해 partial로 평가할 때도 DQN보다 degradation이 작았다.', supports: 'Recurrence가 observation quality shift에 대한 robustness를 제공할 수 있음을 지지한다.', limit: '작은 game set과 single corruption axis의 결과이며 distribution shift 전반의 robustness guarantee가 아니다.' },
  ],
  implementation: ['Single-frame CNN-DQN baseline과 CNN-LSTM-DRQN을 같은 parameter·optimizer budget으로 만든다.', 'Episode replay가 sequence boundary와 terminal mask를 보존하도록 storage schema를 고정한다.', 'Zero-init random unroll, full sequential unroll, burn-in 후 loss unroll 세 방식을 비교한다.', 'Frame dropout rate를 train·evaluation에서 독립 sweep하고 return뿐 아니라 hidden-state probe의 position·velocity error를 기록한다.', 'Hidden reset 누락, stale stored hidden, short unroll을 각각 주입해 recurrent failure signature를 문서화한다.'],
  assumptions: ['Task-relevant history가 chosen LSTM capacity와 effective unroll 안에 들어온다.', 'Replay sequence가 temporal order, episode boundary와 previous-action semantics를 보존한다.', 'One-step Q-learning target이 recurrent representation을 학습하기에 충분한 credit signal을 준다.', 'Flickering Atari가 연구하려는 partial-observation failure를 의미 있게 대리한다.'],
  failures: ['Random sequence를 zero hidden state에서 시작하면 earlier history가 사라져 target과 hidden state가 불일치한다.', 'Full episode sequential updates는 highly correlated samples로 DQN replay의 안정화 목적을 약화한다.', 'LSTM hidden state는 uncertainty calibration이 없고 perceptual alias를 confident vector 하나로 합칠 수 있다.', 'Long occlusion, delayed reward와 rare event는 unroll horizon 밖으로 credit이 사라질 수 있다.'],
  legacy: 'DRQN은 recurrent memory를 deep value learning에 직접 넣은 초기 기준선이 되었고, 이후 recurrent actor-critic, R2D2의 stored state·burn-in, RSSM world model로 이어졌다. 현대 구현에서는 recurrence 자체보다 sequence replay와 hidden-state consistency가 성능을 좌우하는 경우가 많다.',
  nextReading: 'World Models와 Dreamer의 RSSM은 recurrent deterministic memory에 stochastic latent posterior와 prior를 결합해 observation을 본 state와 상상 state를 분리한다.',
  nextLinks: [{ slug: 'rl-model-based-world-models', label: 'Model-based RL과 World Model', reason: 'Recurrent memory에 stochastic latent dynamics와 imagination을 더하는 상위 학습 경로로 올라간다.' }],
  capabilities: ['Frame stack과 recurrent memory의 가정 차이를 설명한다.', 'DRQN data flow와 target-network TD loss를 sequence tensor로 구현한다.', 'Sequential·random update의 trade-off와 burn-in의 필요성을 진단한다.', 'Hidden state를 belief 또는 calibrated uncertainty로 과장하지 않는다.'],
};
