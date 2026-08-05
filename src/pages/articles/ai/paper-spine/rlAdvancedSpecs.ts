import type { PaperStudySpec } from './FoundationalPaperStudy';

export const dagger2011Spec: PaperStudySpec = {
  shortTitle: 'DAgger',
  citation: 'Ross, Gordon, Bagnell — A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning',
  yearVenue: '2011 · AISTATS / PMLR',
  sourceUrl: 'https://proceedings.mlr.press/v15/ross11a.html',
  before: 'Behavior cloning은 expert가 방문한 state에서 action을 잘 맞추지만, 배포 때에는 learner의 작은 실수가 expert dataset에 없던 state를 만든다. 이후 입력 분포가 계속 learner의 이전 action에 의존하므로 i.i.d. 분류 정확도만으로 긴 rollout 성능을 설명할 수 없었다.',
  authorIntent: '학습한 policy가 실제로 유도하는 state distribution에서 expert label을 다시 모으고 누적하는 절차를 no-regret online learning으로 환원해, stationary deterministic policy의 긴-horizon 비용을 제어하려 했다.',
  thesis: 'Learner가 방문한 state를 expert가 다시 label하고 dataset에 계속 합치면, expert 분포가 아니라 최종 policy가 만드는 분포에서 imitation loss가 작은 policy를 찾을 수 있다.',
  reconstruction: [
    { label: 'Expert data', value: 'D1 from pi*', note: '안전한 state만 포함' },
    { label: 'Learner rollout', value: 's ~ d_pi_i', note: '실수 뒤 state까지 방문' },
    { label: 'Expert relabel', value: 'a* = pi*(s)', note: '복구 action 질의' },
    { label: 'Dataset aggregation', value: 'D <- D union Di', note: '다음 policy 재학습' },
  ],
  mechanism: [
    '초기 expert trajectory로 supervised policy를 학습하되 이것을 최종 정책으로 간주하지 않는다.',
    'Iteration i에서 expert와 current learner를 beta_i로 섞은 policy를 실행해 learner가 실제로 마주칠 state를 수집한다.',
    '수집 state마다 expert action을 질의한다. 핵심 비용은 새 trajectory 자체보다 이 counterfactual recovery label을 얻는 데 있다.',
    '새 state-action pair를 이전 dataset에 합치고 전체 aggregate에서 다음 stationary policy를 학습한다.',
    'Expert mixing을 줄이며 최종 learner distribution에서 surrogate loss와 rollout task cost를 검증한다.',
  ],
  equations: [{
    latex: String.raw`\mathcal D_i=\{(s,\pi^*(s)):s\sim d_{\pi_i}\},\qquad \mathcal D\leftarrow\mathcal D\cup\mathcal D_i`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{s_i}_{\text{방문 state}}&\sim d_{\pi_i}\\[2pt]
      \underbrace{a_i^*}_{\text{expert 답}}&=\pi^*(s_i)\\[2pt]
      \underbrace{\mathcal D}_{\text{누적 자료}}&\leftarrow\mathcal D\cup\{(s_i,a_i^*)\}
    \end{aligned}`,
    meaning: 'Iteration i의 입력은 expert가 만든 state가 아니라 현재 혼합 policy pi_i가 실제 방문한 state다. Expert는 그 state에서의 action만 label하고, 새 pair를 과거 모든 data와 합쳐 다음 classifier를 학습한다.',
    symbols: [[String.raw`d_{\pi_i}`, 'Iteration i policy가 유도한 state distribution'], [String.raw`\pi^*(s)`, '방문 state에서 질의한 expert action'], [String.raw`\mathcal D_i`, '이번 rollout에서 추가한 recovery 사례'], [String.raw`\mathcal D`, '모든 iteration을 누적한 dataset']],
  }, {
    latex: String.raw`J(\widehat\pi_{\mathrm{BC}})\le J(\pi^*)+T^2\epsilon,\qquad J(\widehat\pi_{\mathrm{DAgger}})\le J(\pi^*)+uT\epsilon_N+O(1)`,
    meaning: 'Expert 분포에서 error epsilon만 작은 supervised policy는 한 실수가 남은 horizon 전체를 망칠 수 있어 최악의 추가 비용이 T의 제곱으로 커진다. DAgger의 결론은 paper의 no-regret·loss·mixing 가정 아래 learner-induced distribution의 error epsilon_N과 한 실수 뒤 cost-to-go 증가 u로 바뀐다.',
    symbols: [[String.raw`J(\pi)`, 'T-step policy의 기대 누적 비용'], [String.raw`T`, 'Task horizon'], [String.raw`\epsilon`, 'Expert distribution에서의 imitation error'], [String.raw`u`, '한 잘못된 action이 늘릴 수 있는 expert cost-to-go 상한']],
  }],
  evidence: [
    { label: 'Autonomous driving', question: 'Learner가 만든 recovery state를 학습하면 expert-only cloning보다 실제 주행이 나아지는가?', intervention: 'Super Tux Kart에서 human expert의 steering label을 사용해 supervised baseline과 DAgger iteration을 비교한다.', observation: 'DAgger가 learner-induced state를 누적하면서 baseline보다 안정적인 driving performance를 보인다.', supports: '입력 분포를 policy 실행 분포에 맞추는 것이 sequential imitation에서 실질적 이득을 준다는 주장을 지지한다.', limit: '실제 도로 안전성, noisy expert, query 비용이 큰 physical robot까지 자동으로 보장하지 않는다.' },
    { label: 'Three domains', question: '제안이 한 control demo에만 국한되는가?', intervention: 'Driving, Super Mario Bros., OCR sequence labeling에 같은 reduction 관점을 적용한다.', observation: '서로 다른 sequential prediction task에서 기존 접근과 경쟁하거나 개선된 결과를 보고한다.', supports: '미래 입력이 이전 prediction에 의존하는 공통 구조를 겨냥했다는 설명을 지지한다.', limit: '모든 task에서 같은 beta schedule과 classifier가 최적이라는 뜻은 아니다.' },
  ],
  implementation: ['Expert-only BC와 DAgger를 같은 policy architecture로 구현한다.', '각 iteration의 rollout state를 저장하고 expert state와의 거리 또는 failure-mode cluster를 그린다.', 'Expert mixing beta를 점차 낮추고 실행 action과 label action을 별도 기록한다.', 'Aggregate dataset에서 old/new state 비율과 per-region imitation error를 추적한다.', 'Validation classification loss뿐 아니라 closed-loop success, intervention count, recovery time을 측정한다.'],
  assumptions: ['Learner가 방문한 state에서 expert action을 질의할 수 있다.', 'Surrogate loss가 expert와 다른 행동의 task 비용을 유용하게 상한한다.', 'Underlying online learner와 beta schedule이 paper의 no-regret 조건을 충분히 만족한다.'],
  failures: ['Expert가 learner의 심하게 벗어난 state에서도 유효한 recovery action을 주지 못할 수 있다.', '반복 query는 실제 로봇에서 비용·안전·인간 피로 문제를 만든다.', 'Aggregate dataset의 쉬운 과거 sample이 중요한 최신 recovery state를 희석할 수 있다.'],
  legacy: 'DAgger는 imitation learning의 핵심 실패를 network capacity가 아니라 policy-induced distribution shift로 고정했다. 이후 intervention learning, safe data aggregation, on-policy distillation과 robot demonstration pipeline을 읽는 기준이 되었다.',
  nextReading: '환경과 expert에 더 이상 질의할 수 없는 static dataset에서는 DAgger가 불가능하다. CQL은 그 조건에서 data 밖 action의 Q를 보수적으로 낮추는 다른 해법을 제시한다.',
  capabilities: ['낮은 BC validation loss와 낮은 rollout success가 동시에 가능한 반례를 만든다.', 'Expert distribution과 learner-induced distribution을 구분해 측정한다.', 'DAgger의 linear-style bound가 성립하는 가정과 query 비용을 설명한다.'],
};

export const cql2020Spec: PaperStudySpec = {
  shortTitle: 'Conservative Q-Learning',
  citation: 'Kumar, Zhou, Tucker, Levine — Conservative Q-Learning for Offline Reinforcement Learning',
  yearVenue: '2020 · NeurIPS',
  sourceUrl: 'https://proceedings.neurips.cc/paper/2020/hash/0d2b2061826a5df3221116a5085a6052-Abstract.html',
  before: 'Offline RL은 고정 dataset만 사용하므로 learned policy가 선택한 OOD action의 실제 결과를 환경에서 확인할 수 없다. Standard off-policy bootstrap은 function approximation의 우연히 큰 OOD Q를 target과 policy가 반복 증폭했다.',
  authorIntent: 'Policy가 사용할 expected Q가 실제 policy value의 lower bound가 되도록 Q-function 자체를 regularize해, 별도 online correction 없이도 과대평가에 강한 offline policy improvement를 만들려 했다.',
  thesis: 'Bellman error에 dataset action보다 넓은 action distribution의 Q는 낮추고 dataset action의 Q는 상대적으로 높이는 conservative penalty를 추가하면 OOD optimism을 억제할 수 있다.',
  reconstruction: [
    { label: 'Static replay', value: 'D from pi_beta', note: '추가 interaction 없음' },
    { label: 'Candidate actions', value: 'a ~ mu or policy', note: 'dataset 밖도 포함' },
    { label: 'Conservative gap', value: 'Q(candidate)-Q(data)', note: 'optimism에 벌점' },
    { label: 'Bellman fit', value: 'Q -> target', note: '관측 transition 학습' },
  ],
  mechanism: [
    'Behavior dataset의 state-action-reward-next-state만 고정해 online correction이 불가능한 계약을 먼저 세운다.',
    '현재 Q가 선호할 수 있는 action distribution에서 Q를 크게 만드는 방향에 penalty를 준다.',
    '동시에 dataset에서 실제 관측한 action Q를 빼 과도한 전체 underestimation보다 in/out-of-distribution gap을 벌린다.',
    '이 conservative term과 standard Bellman error를 함께 최소화하고 actor 또는 greedy policy를 Q에 맞춰 개선한다.',
    'Alpha, action sampling, dataset mixture별로 estimated Q와 실제 rollout return의 calibration을 검증한다.',
  ],
  equations: [{
    latex: String.raw`\mathcal R_{\mathrm{CQL}}(Q)=\mathbb E_{s\sim\mathcal D}\!\left[\log\sum_a e^{Q(s,a)}-\mathbb E_{a\sim\widehat\pi_\beta(\cdot\mid s)}Q(s,a)\right]`,
    meaning: 'Log-sum-exp는 모든 candidate action 중 큰 Q에 강하게 반응하고, 둘째 항은 dataset behavior가 실제 선택한 action의 Q를 되돌려 준다. 따라서 penalty는 모든 Q를 동일하게 낮추기보다 data 밖에서 높아진 action을 상대적으로 압박한다.',
    symbols: [[String.raw`\mathcal D`, '고정 offline dataset'], [String.raw`\widehat\pi_\beta`, 'Dataset에서 추정한 behavior policy'], [String.raw`\log\sum_a e^{Q(s,a)}`, '큰 candidate-action Q를 모은 soft maximum'], [String.raw`\mathcal R_{\mathrm{CQL}}`, 'Conservative Q regularizer']],
  }, {
    latex: String.raw`\min_Q\;\alpha\mathcal R_{\mathrm{CQL}}(Q)+\frac12\mathbb E_{(s,a,s')\sim\mathcal D}\!\left[\left(Q(s,a)-\widehat{\mathcal B}^{\pi_k}\widehat Q_k(s,a)\right)^2\right]`,
    meaning: 'CQL(H)의 핵심은 conservative penalty와 Bellman regression을 함께 푸는 것이다. Alpha가 너무 작으면 OOD optimism이 남고 너무 크면 유용한 action까지 비관적으로 눌린다. Continuous action 구현은 log-sum-exp를 정확히 열거하지 못해 policy·uniform sample로 근사한다.',
    symbols: [[String.raw`\alpha`, '보수성의 강도'], [String.raw`\widehat{\mathcal B}^{\pi_k}\widehat Q_k`, 'Dataset transition으로 만든 empirical Bellman target'], [String.raw`Q(s,a)`, '학습할 critic'], [String.raw`\frac12(\cdot)^2`, '관측 action의 Bellman consistency']],
  }],
  evidence: [
    { label: 'Dataset mixtures', question: '여러 behavior가 섞인 복잡한 dataset에서도 OOD overestimation을 줄이는가?', intervention: 'Discrete·continuous offline benchmark에서 prior methods, BC와 CQL을 dataset quality별로 비교한다.', observation: 'CQL은 특히 complex·multi-modal dataset에서 강한 final return을 보이고 논문은 여러 조건에서 2–5배 차이를 보고한다.', supports: 'Q pessimism이 static mixed dataset의 policy improvement에 유용하다는 주장을 지지한다.', limit: '모든 dataset·alpha에서 같은 배수 향상이나 true lower bound가 자동으로 성립한다는 뜻은 아니다.' },
    { label: 'Value calibration', question: '높은 estimated return이 실제 rollout return을 과대평가하지 않는가?', intervention: 'Offline training 중 learned Q estimate와 evaluation return의 관계를 여러 방법에서 비교한다.', observation: 'CQL의 value estimate가 baseline보다 보수적이고 policy 선택에 덜 낙관적인 경향을 보인다.', supports: '성능 향상이 단순 regularization이 아니라 overestimation 완화와 연결된다는 설명을 지지한다.', limit: 'Finite neural implementation의 모든 state-action에서 pointwise lower bound를 보장하지 않는다.' },
  ],
  implementation: ['Dataset action frequency와 policy action의 support overlap을 먼저 시각화한다.', '같은 SAC 또는 DQN critic에 CQL term만 추가한 대조군을 만든다.', 'Discrete action은 exact log-sum-exp, continuous action은 proposal별 importance correction을 검산한다.', 'Alpha sweep에서 dataset Q, policy Q, actual return, action distance를 함께 기록한다.', 'Random seed와 dataset quality를 바꾸고 BC보다 나빠지는 조건도 보존한다.'],
  assumptions: ['Dataset이 좋은 behavior를 식별할 만큼 task-relevant state-action coverage를 가진다.', 'Conservative penalty의 action sampling이 중요한 OOD high-Q action을 발견한다.', 'Paper의 lower-bound 결과에 필요한 sampling error, function class, alpha 조건이 충족된다.'],
  failures: ['Dataset에 없는 정말 좋은 action도 보수적으로 억제해 improvement ceiling을 만들 수 있다.', 'High-dimensional continuous action의 log-sum-exp 근사는 variance와 compute에 민감하다.', 'State distribution이 deployment에서 벗어나면 action-level conservatism만으로 해결되지 않는다.'],
  legacy: 'CQL은 offline RL을 “off-policy algorithm을 replay에 돌리는 일”과 분리하고, Q uncertainty를 data coverage와 연결했다. 이후 IQL, model-based offline RL, foundation policy fine-tuning의 기준 비교군이 되었다.',
  nextReading: 'Decision Transformer는 Bellman target과 explicit pessimism 대신 trajectory를 return-conditioned sequence로 바꾸어 같은 static data 문제를 supervised modeling 관점에서 다시 푼다.',
  capabilities: ['OOD action의 Q가 환경 확인 없이 왜 증폭되는지 backup 경로를 그린다.', 'CQL penalty의 두 기대값이 서로 반대 방향으로 작동함을 설명한다.', '보수적 estimate와 무조건 낮은 Q를 구분하고 alpha 실패 조건을 진단한다.'],
};

export const decisionTransformer2021Spec: PaperStudySpec = {
  shortTitle: 'Decision Transformer',
  citation: 'Chen et al. — Decision Transformer: Reinforcement Learning via Sequence Modeling',
  yearVenue: '2021 · NeurIPS',
  sourceUrl: 'https://papers.nips.cc/paper/2021/hash/7f489f642a0ddb10272b5c31057f0663-Abstract.html',
  appendixUrl: 'https://arxiv.org/abs/2106.01345',
  before: 'Offline RL은 보통 value function과 Bellman backup으로 suboptimal dataset에서 policy improvement를 만들었다. 이 과정은 OOD value error와 RL 전용 optimization 복잡성을 동반했다.',
  authorIntent: 'Trajectory를 language-like token sequence로 보고 desired return을 prompt처럼 조건화하면, value fitting이나 policy gradient 없이 standard causal Transformer와 supervised action loss만으로 offline control이 가능한지 검증하려 했다.',
  thesis: 'Return-to-go, state, action을 interleave한 sequence를 causal Transformer로 모델링하면, 배포 시 원하는 return token과 history를 조건으로 그 수준의 action sequence를 생성할 수 있다.',
  reconstruction: [
    { label: 'Offline trajectory', value: 'r, s, a history', note: '고정 dataset' },
    { label: 'Hindsight target', value: 'return-to-go R_hat_t', note: '미래 보상을 앞 token으로' },
    { label: 'Causal context', value: '(R,s,a) x K', note: '3K token sequence' },
    { label: 'Action prediction', value: 'a_hat_t', note: '환경에서 실행' },
  ],
  mechanism: [
    'Dataset trajectory마다 각 timestep 이후 reward sum인 return-to-go를 역순 계산한다.',
    '각 timestep을 return-to-go, state, action 세 modality token으로 interleave하고 같은 timestep embedding을 더한다.',
    'Causal mask 아래 state 위치의 hidden representation으로 해당 timestep action을 supervised prediction한다.',
    'Evaluation 시작 때 원하는 return과 initial state를 넣고 action을 생성한다.',
    '환경이 실제 reward를 주면 남은 target return에서 빼고 새 state·action history와 함께 다음 action을 생성한다.',
  ],
  equations: [{
    latex: String.raw`\widehat R_t=\sum_{t'=t}^{T}r_{t'},\qquad \tau=(\widehat R_1,s_1,a_1,\ldots,\widehat R_T,s_T,a_T)`,
    meaning: '미래 reward를 직접 생성 target으로 두지 않고, timestep t에서 달성하고 싶은 남은 return을 현재 action보다 앞에 배치한다. Causal model은 이 hindsight goal과 과거 trajectory만 보고 action을 예측한다.',
    symbols: [[String.raw`\widehat R_t`, '시점 t부터 episode 끝까지의 return-to-go'], [String.raw`r_{t'}`, 'Dataset에 기록된 실제 reward'], [String.raw`\tau`, '세 modality를 시간순으로 interleave한 trajectory'], [String.raw`T`, 'Episode 마지막 timestep']],
  }, {
    latex: String.raw`\widehat a_t=f_\theta(\widehat R_{t-K+1:t},s_{t-K+1:t},a_{t-K+1:t-1}),\qquad \mathcal L(\theta)=\frac1K\sum_t\|\widehat a_t-a_t\|_2^2`,
    meaning: 'Continuous-control version은 context window의 desired return·state·과거 action에서 다음 action을 회귀한다. Loss 자체는 supervised MSE지만, 어떤 behavior를 꺼낼지는 return token이 조건화한다. Dataset support 밖의 return을 주었다고 새 최적 behavior가 보장되지는 않는다.',
    symbols: [[String.raw`K`, 'Transformer가 보는 timestep context 길이'], [String.raw`f_\theta`, 'Causal Decision Transformer'], [String.raw`a_t`, 'Dataset의 action target'], [String.raw`\widehat a_t`, 'Model이 예측한 continuous action']],
  }, {
    latex: String.raw`\mathcal L_{\mathrm{discrete}}(\theta)=-\frac1K\sum_t\log p_\theta\!\left(a_t\mid \widehat R_{\le t},s_{\le t},a_{<t}\right)`,
    meaning: 'Atari처럼 action이 정해진 버튼 목록인 환경에서는 좌표를 MSE로 회귀하지 않고, 올바른 action category에 준 확률의 negative log를 줄인다. Continuous action과 discrete action은 같은 sequence 조건화를 쓰지만 output head와 loss가 다르다.',
    symbols: [[String.raw`p_\theta(a_t\mid\cdot)`, '현재 return·state·과거 action을 보고 dataset action에 준 categorical probability'], [String.raw`a_t`, 'Dataset에 기록된 discrete action label'], [String.raw`-\log`, '정답 action의 확률이 낮을수록 크게 벌점을 주는 cross-entropy 항'], [String.raw`K`, 'Loss를 평균내는 context timestep 수']],
  }],
  evidence: [
    { label: 'Offline benchmarks', question: '단순 sequence objective가 specialized offline RL과 경쟁할 수 있는가?', intervention: 'Atari, D4RL locomotion, Key-to-Door에서 CQL·BC 등과 비교한다.', observation: '논문 설정에서 Decision Transformer가 강한 model-free offline baseline과 대체로 경쟁하거나 일부를 능가한다.', supports: 'Return-conditioned sequence modeling이 offline control의 실용적 대안임을 지지한다.', limit: 'Online exploration, arbitrary OOD return extrapolation, 모든 dataset에서 우월함을 입증하지 않는다.' },
    { label: 'Return conditioning', question: 'Model이 return token을 무시하고 평균 action만 내는가?', intervention: 'Evaluation target return을 바꾸고 실제 달성 return과의 상관을 측정한다.', observation: '여러 task에서 requested return과 achieved return이 강하게 연동되는 결과를 보인다.', supports: 'Return-to-go가 behavior mode를 선택하는 조건으로 사용된다는 주장을 지지한다.', limit: 'Correlation이 causal planning이나 dataset에 없는 skill 합성을 자동으로 의미하지 않는다.' },
  ],
  implementation: ['Episode별 reward-to-go를 terminal에서 역순 누적하고 reward convention을 고정한다.', 'R, s, a modality별 projection과 timestep embedding의 shape를 unit test한다.', 'Action target에 미래 action이 attention으로 새지 않도록 causal mask 위치를 검산한다.', 'Evaluation 때 target_return <- target_return - observed_reward를 매 step 적용한다.', 'Dataset return percentile 안팎을 sweep하고 achieved return, action likelihood, coverage를 함께 그린다.'],
  assumptions: ['Dataset이 desired return과 연결된 action subsequence를 충분히 포함한다.', 'Return token이 task goal을 식별하기 충분하고 reward scale이 일관된다.', 'Context window가 필요한 long-horizon dependency를 보존한다.'],
  failures: ['Dataset 최대치를 크게 넘는 desired return은 의미 없는 OOD prompt가 될 수 있다.', '같은 return을 만드는 서로 다른 goal이나 risk profile을 scalar token 하나가 구분하지 못한다.', 'Autoregressive action error가 state distribution을 바꾸는 문제는 여전히 남는다.'],
  legacy: 'Decision Transformer는 RL dataset을 sequence pretraining 대상으로 보는 흐름을 확립했고 trajectory transformer, multi-task decision model, robot action tokenization으로 이어졌다. 다만 return conditioning은 reward-free planning이나 guaranteed policy improvement와 동일하지 않다.',
  nextReading: 'Static trajectory에서 벗어나 환경 model을 배우고 상상 rollout을 생성하는 Dyna·World Models 계보를 읽으면 data reuse와 planning의 또 다른 축이 열린다.',
  nextLinks: [
    { slug: 'paper-dyna-1990', label: 'Dyna와 model-based planning으로 이어가기', reason: '고정 trajectory를 조건부로 재생하는 접근에서 벗어나, 학습한 environment model로 새 transition을 상상하고 planning update를 만드는 축을 비교한다.' },
  ],
  capabilities: ['Return-to-go token을 미래 정보 leakage 없이 training input으로 만드는 이유를 설명한다.', 'Supervised action loss와 RL-style behavior improvement가 동시에 가능한 조건을 말한다.', 'Desired return이 dataset support 밖일 때 실패할 이유를 진단한다.'],
};

export const dyna1990Spec: PaperStudySpec = {
  shortTitle: 'Dyna',
  citation: 'Richard S. Sutton — Integrated Architectures for Learning, Planning, and Reacting Based on Approximating Dynamic Programming',
  yearVenue: '1990 · ICML Proceedings',
  sourceUrl: 'https://doi.org/10.1016/B978-1-55860-141-3.50030-4',
  appendixUrl: 'https://doi.org/10.1145/122344.122377',
  before: 'Trial-and-error learning은 실제 transition만으로 value를 갱신했고, classical planning은 이미 주어진 model을 별도 절차로 사용했다. 학습 중 틀리고 변하는 model을 이용해 planning과 acting을 동시에 계속 수행하는 공통 구조가 필요했다.',
  authorIntent: 'Real experience로 policy/value와 world model을 함께 갱신하고, 남는 계산 시간에는 learned model에서 simulated experience를 만들어 같은 learning rule을 반복하는 통합 architecture를 제시하려 했다.',
  thesis: 'Direct RL update와 model-generated planning update를 하나의 incremental loop에 넣으면 실제 interaction 한 번에서 더 많은 value improvement를 얻고, model이 바뀌는 환경에도 reactive execution을 유지할 수 있다.',
  reconstruction: [
    { label: 'Real transition', value: '(s,a,r,s_next)', note: '환경에서 한 번 관측' },
    { label: 'Direct learning', value: 'Q backup', note: '실제 경험 반영' },
    { label: 'Model learning', value: 'M(s,a)', note: '전이·보상 저장' },
    { label: 'Planning updates', value: 'sample M n times', note: '가상 경험 재사용' },
  ],
  mechanism: [
    '현재 Q로 action을 선택하고 실제 environment에서 reward와 next state를 한 번 관측한다.',
    '그 real transition으로 Q를 직접 갱신해 즉각적인 reactive behavior를 개선한다.',
    '동일 transition을 world model의 state-action entry에 학습한다.',
    '과거에 본 state-action을 model에서 sample하고 predicted reward·next state를 생성한다.',
    'Generated transition에도 같은 Q-learning backup을 n번 적용한다. Planning은 별도 symbolic solver가 아니라 simulated experience에서의 learning이다.',
  ],
  equations: [{
    latex: String.raw`(\widehat r,\widehat s')=M_\psi(s,a),\qquad M_\psi\leftarrow\operatorname{fit}(s,a,r,s')`,
    meaning: 'Model은 state-action에서 다음 reward와 state를 예측하고 실제 transition이 들어올 때 갱신된다. Tabular deterministic Dyna-Q에서는 마지막 관측을 저장할 수 있지만 stochastic·neural 환경에서는 distribution model과 uncertainty가 필요하다.',
    symbols: [[String.raw`M_\psi`, '학습한 environment model'], [String.raw`\widehat r`, 'Model이 생성한 reward'], [String.raw`\widehat s'`, 'Model이 생성한 next state'], [String.raw`(r,s')`, '실제 환경에서 관측한 target']],
  }, {
    latex: String.raw`Q(s,a)\leftarrow Q(s,a)+\alpha\!\left[\widehat r+\gamma\max_{a'}Q(\widehat s',a')-Q(s,a)\right]`,
    meaning: 'Planning step도 direct Q-learning과 같은 update를 사용하되 transition의 출처만 실제 환경이 아니라 learned model이다. 따라서 n을 늘리면 계산으로 sample efficiency를 높일 수 있지만 model bias도 같은 횟수만큼 반복된다.',
    symbols: [[String.raw`Q(s,a)`, 'Reactive action selection에 바로 쓰는 value table'], [String.raw`\widehat r,\widehat s'`, 'Learned model이 만든 simulated transition'], [String.raw`n`, '실제 step마다 수행할 planning update 수'], [String.raw`\alpha`, '한 simulated backup의 학습률']],
  }],
  evidence: [
    { label: 'Navigation planning', question: '한 real step 뒤 model planning을 추가하면 route를 더 빨리 학습하는가?', intervention: 'Navigation task에서 direct experience와 Dyna planning을 결합하고 planning 양을 비교한다.', observation: 'Learned model을 이용한 incremental planning이 실제 interaction 대비 더 빠르게 useful route를 전파한다.', supports: 'Learning과 planning을 simulated transition의 공통 update로 통합할 수 있음을 지지한다.', limit: '고차원 pixel dynamics나 neural model bias가 같은 방식으로 안정적임을 입증하지 않는다.' },
    { label: 'Changing world', question: 'Environment가 바뀌어 model이 틀리면 reactive system이 적응할 수 있는가?', intervention: 'Obstacle 또는 transition이 변하는 navigation setting에서 model과 planning을 계속 갱신한다.', observation: '새 real evidence가 model과 cached value를 수정하며 route가 다시 적응한다.', supports: '완성된 model을 기다리지 않는 incremental architecture의 장점을 지지한다.', limit: 'Plain Dyna가 stale model의 낙관을 즉시 해소하거나 모든 non-stationarity에 강하다는 뜻은 아니다.' },
  ],
  implementation: ['작은 gridworld에 tabular Q와 deterministic model dictionary를 만든다.', 'Real update 1회 뒤 planning update n회를 같은 function으로 호출한다.', 'n=0, 5, 50에서 real steps-to-goal과 total backups를 둘 다 비교한다.', 'Shortcut을 막아 model change 뒤 stale simulated transitions의 영향을 관찰한다.', 'Uniform planning과 prioritized sweeping을 별도 variant로 구분한다.'],
  assumptions: ['Model이 task-relevant transition을 충분히 정확히 배우고 변화 뒤 갱신된다.', 'Simulated state-action sampling이 value를 바꿔야 할 영역을 방문한다.', '추가 compute 비용이 real interaction 절감보다 허용 가능하다.'],
  failures: ['잘못된 model에서 많은 planning update를 하면 bias를 빠르게 증폭한다.', 'Uniform random planning은 큰 state space에서 중요한 predecessor를 거의 뽑지 못한다.', 'Representation error와 epistemic uncertainty를 tabular last-transition model이 표현하지 못한다.'],
  legacy: 'Dyna는 acting, model learning, direct RL, planning을 한 loop의 네 책임으로 정리했다. 현대 model-based RL과 world model은 model의 표현·학습·rollout 방법을 바꾸지만 real/imagined data를 결합한다는 중심 계약을 계승한다.',
  nextReading: 'World Models는 raw pixel을 압축한 latent dynamics와 작은 controller로 Dyna의 learned-model idea를 deep generative model 시대에 구체화한다.',
  nextLinks: [{ slug: 'paper-world-models-2018', label: 'World Models 2018로 이어가기', reason: 'Tabular transition model을 VAE latent와 recurrent stochastic dynamics로 바꾸는 다음 단계를 읽는다.' }],
  capabilities: ['Direct update와 planning update를 transition 출처만 바꾼 같은 코드로 구현한다.', 'Planning update 수가 sample efficiency와 model bias를 동시에 키우는 이유를 설명한다.', '환경 변화 뒤 stale model·stale value를 별도 진단한다.'],
};

export const worldModels2018Spec: PaperStudySpec = {
  shortTitle: 'World Models',
  citation: 'David Ha, Jürgen Schmidhuber — World Models',
  yearVenue: '2018 · arXiv / NeurIPS Workshop',
  sourceUrl: 'https://arxiv.org/abs/1803.10122',
  appendixUrl: 'https://worldmodels.github.io/',
  before: 'Pixel control은 고차원 perception과 long-horizon credit assignment를 하나의 RL network에 동시에 요구했다. Model-based methods도 full observation을 직접 예측할 때 compute와 stochasticity 처리에 어려움이 있었다.',
  authorIntent: 'Vision·memory의 큰 unsupervised model과 아주 작은 controller를 분리하고, compressed stochastic latent world 안에서 policy를 학습한 뒤 real environment로 옮길 수 있는지 보이려 했다.',
  thesis: 'VAE가 frame을 latent z로 압축하고 MDN-RNN이 action-conditioned future latent distribution을 학습하면, controller는 z와 recurrent hidden state만으로 행동하며 일부 task에서는 hallucinated environment 안에서만 최적화될 수 있다.',
  reconstruction: [
    { label: 'Vision V', value: 'x_t -> z_t', note: 'VAE frame compression' },
    { label: 'Memory M', value: 'p(z_next|z,a,h)', note: 'MDN-RNN dynamics' },
    { label: 'Controller C', value: 'a=W[z;h]+b', note: '작은 linear policy' },
    { label: 'Dream rollout', value: 'sample M repeatedly', note: 'real task로 transfer' },
  ],
  mechanism: [
    'Random rollout frame을 VAE로 학습해 각 observation을 low-dimensional z로 압축한다.',
    'Action, current z, recurrent hidden state에서 next z의 mixture distribution을 예측하는 MDN-RNN을 학습한다.',
    'Controller는 predicted next frame을 직접 받지 않고 current z와 M의 hidden state h를 입력으로 action을 낸다.',
    '작은 controller parameter를 CMA-ES로 실제 또는 generated environment의 cumulative reward에 맞춰 최적화한다.',
    'Dream exploitation을 줄이기 위해 sampling temperature를 조절하고 real rollout transfer로 model flaw를 검증한다.',
  ],
  equations: [{
    latex: String.raw`z_t\sim q_\phi(z_t\mid x_t),\qquad z_{t+1}\sim p_\psi(z_{t+1}\mid a_t,z_t,h_t)`,
    meaning: 'VAE가 한 frame의 spatial information을 stochastic latent z로 압축하고, MDN-RNN이 action과 history를 조건으로 다음 latent의 distribution을 낸다. Deterministic one-step pixel regression과 달리 여러 가능한 미래를 mixture로 표현하려는 구조다.',
    symbols: [[String.raw`x_t`, '환경의 고차원 observation frame'], [String.raw`z_t`, 'VAE가 만든 compressed latent'], [String.raw`h_t`, 'MDN-RNN의 temporal memory'], [String.raw`p_\psi`, '다음 latent의 mixture-density dynamics']],
  }, {
    latex: String.raw`a_t=W_c[z_t;h_t]+b_c`,
    meaning: 'Controller는 거대한 world model과 달리 latent와 memory를 concatenate한 입력에 선형 변환 하나만 적용한다. 논문의 실험은 world model 표현이 좋으면 task-specific policy search space를 매우 작게 만들 수 있다는 가설을 시험한다.',
    symbols: [[String.raw`[z_t;h_t]`, '현재 perception과 예측 history의 결합'], [String.raw`W_c,b_c`, 'CMA-ES로 최적화한 작은 controller parameter'], [String.raw`a_t`, 'Environment에 보낼 continuous 또는 discrete action']],
  }],
  evidence: [
    { label: 'Car Racing', question: 'Latent z와 predictive h가 pixel control에 실제로 도움이 되는가?', intervention: 'CarRacing에서 V-only controller와 full V+M controller를 비교한다.', observation: '논문은 full world model controller가 평균 906±21을 기록해 V-only 조건보다 높았다고 보고한다.', supports: 'Temporal predictive representation h가 compact controller의 control quality에 기여한다는 설명을 지지한다.', limit: '현대 benchmark 전체나 end-to-end gradient world model보다 우월함을 입증하지 않는다.' },
    { label: 'Dream transfer', question: 'Generated environment에서만 학습한 controller가 real task로 transfer되는가?', intervention: 'VizDoom world model 안에서 controller를 최적화하고 실제 environment에서 평가하며 temperature를 바꾼다.', observation: '적절한 uncertainty의 dream에서 학습한 controller가 real environment로 transfer되고, 너무 정확해 보이는 model flaw exploitation 사례도 관찰된다.', supports: 'Latent imagination 학습의 가능성과 model exploitation 위험을 동시에 보여준다.', limit: 'Dream policy가 실제 dynamics에서 안전하거나 model uncertainty가 temperature 하나로 충분히 calibrated됨을 보장하지 않는다.' },
  ],
  implementation: ['Observation dataset, VAE, MDN-RNN, controller를 서로 다른 checkpoint와 loss로 분리한다.', 'Latent reconstruction뿐 아니라 multi-step latent likelihood와 rollout divergence를 기록한다.', 'Controller가 z-only, h-only, z+h를 볼 때의 성능을 비교한다.', 'Dream temperature를 sweep하고 dream return과 real return gap을 측정한다.', 'Policy가 반복 방문하는 model-error state를 frame·latent 단위로 추적한다.'],
  assumptions: ['Random 또는 current policy data가 task-relevant visual dynamics를 포함한다.', 'VAE latent가 reward에는 직접 학습되지 않아도 control에 필요한 정보를 보존한다.', 'MDN-RNN의 sampled future가 controller optimization에 충분히 현실적이다.'],
  failures: ['Reconstruction에 중요하지 않은 작은 task signal이 latent에서 사라질 수 있다.', 'Controller가 world model artifact를 exploit해 dream return만 높일 수 있다.', '분리 학습한 V와 M의 error가 긴 rollout에서 누적된다.'],
  legacy: 'World Models는 compressed perception, latent dynamics, imagined policy learning을 하나의 읽기 쉬운 architecture로 제시했다. Dreamer 계열은 이를 end-to-end recurrent state-space model과 differentiable actor-critic imagination으로 바꾼다.',
  nextReading: 'MuZero는 observation reconstruction을 요구하지 않고 search에 필요한 reward, policy, value만 예측하는 value-equivalent model로 world-model 목적을 다시 정의한다.',
  nextLinks: [{ slug: 'paper-muzero-2020', label: 'MuZero 2020으로 이어가기', reason: 'Observation 재구성 대신 search에 필요한 reward·policy·value만 보존하는 model을 비교한다.' }],
  capabilities: ['V, M, C가 학습하는 target과 optimizer를 각각 구분한다.', 'One-step reconstruction quality와 closed-loop dream fidelity가 다른 이유를 설명한다.', 'Dream return은 높지만 real return이 낮은 failure를 model exploitation으로 진단한다.'],
};

export const muZero2020Spec: PaperStudySpec = {
  shortTitle: 'MuZero',
  citation: 'Schrittwieser et al. — Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model',
  yearVenue: '2020 · Nature',
  sourceUrl: 'https://www.nature.com/articles/s41586-020-03051-4',
  appendixUrl: 'https://arxiv.org/abs/1911.08265',
  before: 'AlphaZero식 search는 정확한 game rules와 simulator가 필요했고, learned dynamics는 full state나 pixel을 재구성하느라 planning에 불필요한 정보를 예측했다. Model-free RL은 visual task에 강했지만 precise lookahead를 활용하지 못했다.',
  authorIntent: '환경 규칙을 주지 않은 채 search에 직접 필요한 reward, policy, value만 예측하는 recurrent model을 학습해, board-game planning과 Atari representation learning을 한 algorithm으로 결합하려 했다.',
  thesis: 'Observation history를 hidden state로 encode하고 hypothetical action마다 hidden state·reward를 recurrently 예측하며 policy·value head를 붙이면, true environment state를 복원하지 않아도 MCTS planning이 가능하다.',
  reconstruction: [
    { label: 'Representation h', value: 'history -> s0', note: 'root latent state' },
    { label: 'Dynamics g', value: '(s,a)->(r,s_next)', note: 'hypothetical transition' },
    { label: 'Prediction f', value: 's->(policy,value)', note: 'search prior·leaf value' },
    { label: 'MCTS + replay', value: 'pi,z,u targets', note: 'search와 실제 보상으로 학습' },
  ],
  mechanism: [
    'Representation network h가 최근 observation history를 root hidden state로 바꾼다.',
    'MCTS가 candidate action을 선택하면 dynamics g가 predicted reward와 next hidden state를 만든다.',
    'Prediction f가 각 hidden state의 policy prior와 value를 내고 search visit count가 improved policy target이 된다.',
    '실제 환경에서는 root MCTS policy로 action을 고르고 reward·observation trajectory를 replay에 저장한다.',
    'Replay action을 K step unroll해 reward는 observed reward, value는 n-step/search target, policy는 future MCTS target에 맞춰 end-to-end 학습한다.',
  ],
  equations: [{
    latex: String.raw`s^0=h_\theta(o_{1:t}),\qquad (r^k,s^k)=g_\theta(s^{k-1},a^k),\qquad (p^k,v^k)=f_\theta(s^k)`,
    meaning: 'h는 real observation history를 search root로, g는 hypothetical action을 다음 latent와 reward로, f는 search가 사용할 policy와 value로 바꾼다. Hidden state가 true board나 pixel을 재구성할 필요는 없고 이 planning target들을 예측하기만 하면 된다.',
    symbols: [[String.raw`h_\theta`, 'Observation history representation network'], [String.raw`g_\theta`, 'Action-conditioned recurrent dynamics'], [String.raw`f_\theta`, 'Policy와 value prediction head'], [String.raw`k`, 'Search 또는 training unroll의 hypothetical depth']],
  }, {
    latex: String.raw`\ell_t(\theta)=\sum_{k=0}^{K}\!\left[\ell_r(u_{t+k},r_t^k)+\ell_v(z_{t+k},v_t^k)+\ell_p(\pi_{t+k},p_t^k)\right]+c\|\theta\|^2`,
    meaning: '각 unroll depth에서 predicted reward는 실제 reward u, value는 played outcome 또는 n-step target z, policy는 MCTS visit distribution pi에 맞춘다. Reconstruction loss가 없다는 점이 World Models와 가장 중요한 차이다.',
    symbols: [[String.raw`u_{t+k}`, '환경에서 실제 관측한 reward target'], [String.raw`z_{t+k}`, 'Outcome 또는 bootstrapped value target'], [String.raw`\pi_{t+k}`, 'MCTS가 개선한 search policy target'], [String.raw`K`, 'Model을 recurrently 펼쳐 학습하는 깊이']],
  }],
  evidence: [
    { label: 'Games and Atari', question: 'Rules 없이 learned model search가 planning·visual domain 양쪽에서 작동하는가?', intervention: 'Go, chess, shogi와 57 Atari games에서 AlphaZero·model-free·model-based baselines와 비교한다.', observation: 'Board games에서 AlphaZero 수준을 맞추고 Atari에서 당시 강한 결과를 보고한다.', supports: 'Planning-relevant latent model이 서로 다른 domain family를 한 architecture로 다룰 수 있음을 지지한다.', limit: '실제 로봇, stochastic hidden dynamics, 저비용 training으로 바로 일반화됨을 입증하지 않는다.' },
    { label: 'Search scaling', question: 'Learned model에서 search simulation을 늘리면 항상 좋아지는가?', intervention: 'Go와 Atari에서 evaluation MCTS simulation 수를 늘려 성능 변화를 측정한다.', observation: 'Go에서는 긴 search로 잘 확장되지만 Atari에서는 약 100 simulation 부근에서 이득이 plateau하는 경향을 보고한다.', supports: 'Planning value가 model accuracy와 domain에 의존함을 보여준다.', limit: 'Search plateau의 원인이 오직 model error라고 완전히 식별한 것은 아니다.' },
  ],
  implementation: ['h, g, f의 tensor shape와 gradient path를 별도 unit test한다.', 'MCTS node가 predicted reward, prior, value를 어떻게 backup하는지 작은 tree에서 검산한다.', 'Replay 시작점마다 K-step action unroll target alignment를 검사한다.', 'Policy target은 raw actor가 아니라 MCTS visit count에서 왔음을 데이터 구조에 표시한다.', 'Search simulation 수별 return과 model reward/value error를 depth별로 함께 기록한다.'],
  assumptions: ['Reward·policy·value prediction이 planning에 충분한 latent semantics를 형성한다.', 'Search target과 replay target이 policy improvement의 유용한 training signal이다.', 'Deterministic latent dynamics가 평가 domain의 stochasticity를 감당한다.'],
  failures: ['Planning-irrelevant reconstruction을 버리는 대신 target이 포착하지 못한 안전 정보도 latent에서 사라질 수 있다.', 'Model error가 depth와 함께 누적되면 더 긴 search가 이득 없이 compute만 늘린다.', 'MCTS와 network training의 큰 compute·system complexity가 필요하다.'],
  legacy: 'MuZero는 world model의 목표를 “세상을 닮게 복원”에서 “의사결정에 충분한 예측”으로 바꾸었다. EfficientZero, Gumbel MuZero와 latent planning 연구의 뼈대가 되었고, model semantics의 식별 가능성이라는 새 질문도 남겼다.',
  nextReading: 'DreamerV3는 explicit tree search 대신 recurrent stochastic world model에서 trajectory를 상상하고 actor-critic을 직접 학습해, fixed hyperparameter로 다양한 control domain을 다루려 한다.',
  nextLinks: [{ slug: 'paper-dreamerv3-2023', label: 'DreamerV3 2023으로 이어가기', reason: 'Tree search 대신 latent imagination 위에서 actor와 critic을 직접 학습하는 경로로 간다.' }],
  capabilities: ['Representation, dynamics, prediction network의 입력·출력을 search 순서대로 그린다.', 'Reconstruction 없는 latent model이 planning할 수 있는 이유와 위험을 함께 설명한다.', 'Search simulation을 늘려도 성능이 plateau할 수 있는 원인을 depth error와 연결한다.'],
};

export const dreamerV3Spec: PaperStudySpec = {
  shortTitle: 'DreamerV3',
  citation: 'Hafner, Pasukonis, Ba, Lillicrap — Mastering Diverse Domains through World Models',
  yearVenue: '2023 arXiv · 2025 Nature',
  sourceUrl: 'https://www.nature.com/articles/s41586-025-08744-2',
  appendixUrl: 'https://arxiv.org/abs/2301.04104',
  before: 'World-model agents는 domain마다 observation·reward·return scale과 representation regularization을 다시 조정해야 했다. Model이 있어도 robust actor-critic imagination을 다양한 discrete·continuous·visual task에서 한 설정으로 유지하기 어려웠다.',
  authorIntent: 'RSSM world model, imagined actor-critic과 scale-robust loss·normalization 기법을 결합해 하나의 hyperparameter configuration으로 광범위한 domain을 학습할 수 있는 general RL algorithm을 만들려 했다.',
  thesis: 'Replay observation을 compact stochastic state로 encode하고 action-conditioned future를 상상한 뒤 lambda-return으로 actor와 critic을 학습하며, symlog·twohot·KL balancing 등으로 signal scale을 안정화하면 다양한 task에서 같은 recipe를 사용할 수 있다.',
  reconstruction: [
    { label: 'RSSM state', value: 's_t={h_t,z_t}', note: 'deterministic + stochastic' },
    { label: 'Prediction heads', value: 'x,r,continue', note: 'world model learning' },
    { label: 'Latent imagination', value: 'a~actor, s_next~model', note: '16-step rollout' },
    { label: 'Actor + critic', value: 'lambda return', note: 'behavior improvement' },
  ],
  mechanism: [
    'Encoder가 observation과 recurrent state에서 stochastic z를 만들고 sequence model이 action-conditioned h를 갱신한다.',
    'Dynamics prior가 다음 z를 예측하고 decoder·reward·continue head가 replay signal을 복원한다. KL dynamics와 representation loss의 gradient stop 방향을 분리한다.',
    'Replay state에서 actor action을 sample하며 world model 안에서 fixed horizon latent trajectory를 상상한다.',
    'Critic은 imagined reward와 continue, bootstrap value를 lambda-return으로 접어 return distribution을 학습한다.',
    'Actor는 normalized advantage와 entropy로 update하고 symlog, symexp twohot, free bits, unimix가 domain scale과 collapse를 완화한다.',
  ],
  equations: [{
    latex: String.raw`h_t=f_\phi(h_{t-1},z_{t-1},a_{t-1}),\quad z_t\sim q_\phi(z_t\mid h_t,x_t),\quad \widehat z_t\sim p_\phi(\widehat z_t\mid h_t)`,
    meaning: 'RSSM은 action history를 누적한 deterministic h와 observation에서 추론한 stochastic z를 결합한다. Training 때 posterior q가 실제 x를 보지만 imagination에서는 dynamics prior p가 observation 없이 z를 생성하므로 두 분포의 일치가 핵심이다.',
    symbols: [[String.raw`h_t`, 'Action과 과거 latent를 누적한 recurrent state'], [String.raw`z_t`, '현재 observation에서 추론한 stochastic representation'], [String.raw`q_\phi`, 'Encoder posterior'], [String.raw`p_\phi`, 'Imagination에 사용할 dynamics prior']],
  }, {
    latex: String.raw`R_t^\lambda=r_t+\gamma c_t\!\left[(1-\lambda)v_t+\lambda R_{t+1}^\lambda\right],\qquad R_T^\lambda=v_T`,
    latexCompact: String.raw`\begin{aligned}
      \underbrace{B_t}_{\text{두 미래 혼합}}&=(1-\lambda)v_t+\lambda R_{t+1}^\lambda\\[2pt]
      \underbrace{R_t^\lambda}_{\text{현재 return}}&=r_t+\gamma c_tB_t\\[2pt]
      \underbrace{R_T^\lambda}_{\text{끝의 값}}&=v_T
    \end{aligned}`,
    meaning: '상상 rollout의 현재 reward에 one-step critic과 더 긴 lambda-return을 섞어 붙인다. Continue c가 predicted termination 뒤의 가짜 미래를 차단하고, 마지막에는 critic value로 horizon 밖을 bootstrap한다.',
    symbols: [[String.raw`r_t`, 'World model이 예측한 imagined reward'], [String.raw`c_t`, 'Episode가 이어질 predicted probability 또는 flag'], [String.raw`v_t`, 'Critic의 state value expectation'], [String.raw`\lambda`, '짧은 bootstrap과 긴 imagined return의 혼합 비율']],
  }],
  evidence: [
    { label: '150+ tasks', question: '한 configuration이 매우 다른 signal·action·observation domain에서 작동하는가?', intervention: 'Atari, visual/proprio control, BSuite, Crafter, DMLab, Minecraft 등 150개 이상 task에 fixed hyperparameters를 적용한다.', observation: '논문은 여러 specialized baseline을 능가하는 폭넓은 결과와 model size·replay ratio scaling을 보고한다.', supports: 'Robustness recipe가 domain별 retuning 의존을 줄였다는 핵심 주장을 지지한다.', limit: '모든 real-world task, safety constraint, unseen hardware에서 tuning이 불필요함을 뜻하지 않는다.' },
    { label: 'Ablations', question: '성능이 단지 큰 model이나 reward head에서 오는가?', intervention: 'KL/free bits, return normalization, twohot, observation symlog와 representation learning signal을 제거한다.', observation: '기법들이 평균 성능에 각각 기여하고, reconstruction signal을 제거할 때 큰 저하가 나타나는 분석을 보고한다.', supports: 'Task-agnostic world-model representation과 scale-robust recipe가 중요한 구성임을 지지한다.', limit: '상호작용하는 모든 기법의 독립 인과 효과를 task마다 완전히 분해하지는 않는다.' },
  ],
  implementation: ['Replay sequence의 reset·continue mask와 RSSM posterior/prior alignment를 검산한다.', 'Dynamics loss와 representation loss의 stop-gradient 방향을 별도 test한다.', 'Real observation 없이 prior만으로 imagination rollout이 진행되는지 확인한다.', 'Lambda-return을 backward recurrence와 explicit mixture 두 방식으로 비교한다.', 'Symlog·twohot·return normalization ablation과 model size·replay ratio를 seed별 기록한다.'],
  assumptions: ['RSSM latent가 reward·continue뿐 아니라 future control에 필요한 observation structure를 보존한다.', '짧은 imagination horizon과 critic bootstrap이 long-horizon return을 충분히 근사한다.', 'World model error를 actor가 exploit하기 전에 replay data와 robust losses가 교정한다.'],
  failures: ['상상 rollout은 posterior가 아니라 prior error를 누적하므로 reconstruction이 좋아도 control model은 틀릴 수 있다.', 'Sparse safety event가 replay와 latent에 거의 없으면 actor가 위험한 model blind spot을 exploit할 수 있다.', '한 hyperparameter set의 성공이 환경 interface·reward design·compute budget의 표준화를 없애지는 않는다.'],
  legacy: 'DreamerV3는 world model을 별도 planning 도구가 아니라 actor-critic training의 differentiable data generator로 정착시켰다. Robust scaling과 internet video pretraining 가능성을 열었지만 uncertainty-aware safe imagination은 여전히 남은 과제다.',
  nextReading: '이 지점에서 offline demonstration을 world model pretraining에 섞거나, real robot에서 uncertainty·constraint를 결합하는 최신 robot learning 연구로 넘어갈 수 있다.',
  capabilities: ['Posterior training과 prior imagination의 distribution gap을 설명한다.', 'RSSM, reward/continue head, critic, actor의 loss와 update data를 구분한다.', 'Lambda-return·model horizon·critic bootstrap이 실패를 분담하는 방식을 진단한다.'],
};
