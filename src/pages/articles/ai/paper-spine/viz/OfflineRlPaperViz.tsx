import {
  AlertTriangle,
  ArrowRightLeft,
  Bot,
  FileCheck2,
  Filter,
  Gauge,
  GitMerge,
  Layers3,
  ListRestart,
  LockKeyhole,
  RefreshCw,
  Route,
  ScanSearch,
  ShieldCheck,
  Split,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const daggerScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Behavioral cloning gap',
    title: 'Expert trajectory에서 작은 분류 오차가 배포 중에는 새 state를 만든다',
    body: 'Behavior cloning은 expert가 방문한 입력에서 action을 맞춘다. 그러나 learner의 한 action이 다음 입력을 바꾸므로, 작은 실수 뒤에는 training set에 없던 state가 연쇄적으로 나타난다.',
    icon: Split,
    layout: 'compare',
    items: [
      { label: '학습 분포', value: 's ~ dπ*', detail: 'Expert가 안정적으로 방문한 state', tone: 'green', metric: 'train' },
      { label: '배포 분포', value: 's ~ dπ̂', detail: 'Learner action이 만든 recovery state 포함', tone: 'red', metric: 'deploy' },
      { label: '연쇄 비용', value: 'error → 새 state → error', detail: '입력이 이전 prediction에 의존해 i.i.d. 가정이 깨진다.', tone: 'gold', metric: 'T-step' },
    ],
    formula: String.raw`\underbrace{s_t\sim d_{\widehat\pi}}_{\text{learner가 만든 입력}}\qquad \underbrace{s_t\not\sim d_{\pi^*}}_{\text{expert 학습 분포와 다름}}`,
    formulaNote: '같은 state classifier라도 실행 policy가 달라지면 입력 분포가 바뀐다. DAgger가 바꾸는 첫 artifact는 network가 아니라 수집할 state distribution이다.',
    callout: '낮은 validation imitation loss만으로 closed-loop 성공을 판정할 수 없다. Learner가 실수한 뒤 실제로 방문하는 state에서 error를 다시 측정해야 한다.',
    owner: 'Closed-loop rollout',
    output: 'learner-induced states dπ̂',
    invariant: 'train and deployment distributions stay distinct',
  },
  {
    eyebrow: '02 · Mixed-policy rollout',
    title: '초기에는 expert와 learner를 섞고 iteration마다 learner 비중을 높인다',
    body: '완전히 서투른 learner를 처음부터 단독 실행하면 위험하거나 쓸모없는 state만 모일 수 있다. βᵢ는 expert action을 사용할 확률이며 iteration이 갈수록 줄어든다.',
    icon: ArrowRightLeft,
    layout: 'flow',
    items: [
      { label: '현재 state', value: 'sₜ', detail: '이번 rollout에서 실제 방문한 입력', tone: 'cyan' },
      { label: '혼합 coin', value: 'Bernoulli(βᵢ)', detail: 'Expert와 learner 중 실행 owner 선택', tone: 'gold' },
      { label: '실행 action', value: 'πᵢ=βᵢπ*+(1−βᵢ)π̂ᵢ', detail: '다음 state를 실제로 바꾸는 action', tone: 'violet' },
      { label: '분포 이동', value: 'dπᵢ → dπ̂', detail: 'βᵢ가 줄며 최종 learner 분포에 접근', tone: 'green' },
    ],
    formula: String.raw`\underbrace{\pi_i}_{\text{실행 policy}}=\underbrace{\beta_i\pi^*}_{\text{expert 보호}}+\underbrace{(1-\beta_i)\widehat\pi_i}_{\text{learner 노출}}`,
    formulaNote: '이 식은 action vector를 평균낸다는 뜻이 아니라, 각 시점에 어느 policy를 실행할지 확률적으로 고르는 mixture를 나타낸다.',
    callout: 'β schedule은 label을 만드는 규칙이 아니라 어떤 state를 방문할지 정하는 안전·분포 계약이다.',
    owner: 'Rollout policy mixer',
    output: 'visited states under πᵢ',
    invariant: 'executed action owner is logged',
  },
  {
    eyebrow: '03 · Expert relabeling',
    title: 'Learner가 실제로 만든 recovery state에서 expert action을 다시 묻는다',
    body: 'Expert가 trajectory 전체를 다시 운전할 필요는 없다. 수집한 learner state마다 “여기라면 무엇을 할 것인가”를 질의해 counterfactual recovery label을 얻는다.',
    icon: ScanSearch,
    layout: 'flow',
    items: [
      { label: 'Learner state', value: 's ~ dπᵢ', detail: '실수 뒤 state까지 포함', tone: 'red' },
      { label: 'Expert query', value: 'π*(s)', detail: '실행 action과 별도로 정답 action 질의', tone: 'green' },
      { label: 'Recovery pair', value: '(s,a*)', detail: '이번 iteration의 supervised example', tone: 'gold' },
      { label: 'Query ledger', value: 'cost · intervention · validity', detail: '사람/로봇 expert 비용과 label 품질 기록', tone: 'cyan' },
    ],
    formula: String.raw`\underbrace{\mathcal D_i}_{\text{이번 회차 자료}}=\left\{\underbrace{(s,\pi^*(s))}_{\text{learner state·expert label}}:s\sim d_{\pi_i}\right\}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{\mathcal D_i}_{\text{회복 사례}}&=\{(s,\pi^*(s))\}\\[3pt]
      \underbrace{s}_{\text{learner state}}&\sim\underbrace{d_{\pi_i}}_{\text{실제 방문 분포}}
    \end{aligned}`,
    formulaNote: 'State의 출처는 learner가 섞인 rollout이고 action label의 출처는 expert다. 실행 action과 expert label을 같은 column에 덮어쓰지 않는다.',
    callout: 'DAgger의 핵심 비용은 단순 trajectory 저장이 아니라 learner가 망가뜨린 state에서도 유효한 expert recovery label을 얻는 일이다.',
    owner: 'Expert query interface',
    output: 'recovery-labeled batch Dᵢ',
    invariant: 'state source and label source remain explicit',
  },
  {
    eyebrow: '04 · Dataset aggregation',
    title: '새 recovery 사례를 버리지 않고 이전 dataset과 합쳐 stationary policy를 다시 학습한다',
    body: 'Iteration마다 최신 batch만 학습하면 과거 recovery를 잊고 non-stationary sequence가 된다. DAgger는 누적 dataset 위에서 하나의 deterministic policy를 반복 갱신한다.',
    icon: GitMerge,
    layout: 'timeline',
    items: [
      { label: '초기 자료', value: 'D₁ from expert', detail: '안전한 expert state 중심', tone: 'green' },
      { label: '새 batch', value: 'Dᵢ from learner states', detail: '이번 회차 recovery 사례', tone: 'red' },
      { label: '누적', value: 'D ← D ∪ Dᵢ', detail: '과거와 새 분포를 함께 보존', tone: 'gold' },
      { label: '재학습', value: 'π̂ᵢ₊₁ ← train(D)', detail: '다음 rollout의 stationary learner', tone: 'violet' },
    ],
    formula: String.raw`\underbrace{\mathcal D}_{\text{누적 자료}}\leftarrow\mathcal D\cup\mathcal D_i\qquad \underbrace{\widehat\pi_{i+1}}_{\text{다음 learner}}\leftarrow\operatorname{Train}(\mathcal D)`,
    formulaNote: 'Union 뒤의 old/new 비율이 실제 gradient를 정한다. 중요한 최신 recovery state가 쉬운 과거 sample에 묻히지 않는지 region별 error를 본다.',
    callout: 'DAgger는 여러 iteration policy를 배포하는 방법이 아니라, 여러 분포에서 얻은 label로 최종 stationary policy 하나를 찾는 reduction이다.',
    owner: 'Aggregate dataset + supervised learner',
    output: 'next stationary policy π̂ᵢ₊₁',
    invariant: 'old and recovery examples are both traceable',
  },
  {
    eyebrow: '05 · Guarantee and evidence boundary',
    title: 'Learner 분포의 작은 loss가 긴 rollout 비용으로 이어지는 조건을 확인한다',
    body: 'No-regret online learner와 reduction 가정 아래 DAgger는 behavior cloning의 worst-case quadratic horizon 의존을 더 나은 형태로 바꾼다. 실제 query 비용과 expert 한계까지 사라지는 것은 아니다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Policy-induced distribution에서 imitation loss를 줄이는 절차', detail: 'Stationary deterministic policy와 no-regret reduction을 제시했다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: 'Expert query가 없어도 static dataset만으로 같은 보장', detail: 'Learner state에서 expert를 다시 부를 수 있어야 하는 online data-collection 방법이다.', tone: 'red' },
      { label: '필수 평가', value: 'Closed-loop success · intervention · recovery time', detail: 'Classification accuracy와 rollout task cost를 함께 본다.', tone: 'green' },
      { label: '남는 위험', value: 'Expert fatigue · unsafe state · invalid recovery label', detail: '심하게 벗어난 state에서는 expert action 자체가 정의되지 않을 수 있다.', tone: 'red' },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{J(\widehat\pi_{\mathrm{BC}})-J(\pi^*)}_{\text{expert 분포에서 학습}}
      &\lesssim T^2\epsilon\\[3pt]
      \underbrace{J(\widehat\pi_{\mathrm{DAgger}})-J(\pi^*)}_{\text{learner 분포에서 학습}}
      &\lesssim uT\epsilon_N
    \end{aligned}`,
    formulaNote: '두 bound의 정확한 성립에는 논문의 loss, mixing, no-regret 가정이 필요하다. 표시된 차이는 분포 mismatch가 horizon을 통해 누적되는 방식을 비교하는 읽기 틀이다.',
    callout: 'DAgger를 “data augmentation” 하나로 줄이지 않는다. 어떤 policy가 state를 만들었고 누가 label했는지가 이론과 안전성의 핵심이다.',
    owner: 'Closed-loop evaluator',
    output: 'task cost · query cost · distribution error',
    invariant: 'guarantee assumptions accompany the bound',
  },
];

const cqlScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Static-data contract',
    title: 'Offline RL에서는 policy가 고른 새 action을 환경에 물어볼 수 없다',
    body: 'Dataset은 behavior policy가 과거에 만든 transition으로 고정된다. Learned policy가 다른 action을 선호해도 그 결과를 online rollout으로 교정할 수 없다.',
    icon: LockKeyhole,
    layout: 'compare',
    items: [
      { label: '관측 가능', value: '(s,a,r,s′) ∈ D', detail: 'Behavior가 실제 실행한 action', tone: 'green', metric: 'in data' },
      { label: '관측 불가', value: 'a~π(·|s), a∉D', detail: 'Learned policy가 새로 고른 OOD action', tone: 'red', metric: 'no query' },
      { label: '배포 위험', value: 'Q가 큰 OOD action 선택', detail: '틀려도 environment feedback으로 고칠 수 없다.', tone: 'gold', metric: 'shift' },
    ],
    callout: 'CQL의 첫 계약은 “replay buffer를 쓴다”가 아니라 학습 중 추가 interaction이 0이라는 점이다.',
    owner: 'Frozen offline dataset D',
    output: 'fixed transition support',
    invariant: 'no online correction is assumed',
  },
  {
    eyebrow: '02 · OOD optimism loop',
    title: '우연히 큰 OOD Q가 bootstrap target과 policy를 통해 스스로 증폭된다',
    body: 'Function approximator는 관측하지 않은 action에도 숫자를 낸다. Max 또는 actor가 큰 값을 선택하면 그 값이 다음 Bellman target에 들어가고 다시 더 큰 Q를 학습시킨다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [
      { label: '미관측 action', value: 'aood', detail: 'Dataset support 밖인데 Q는 계산됨', tone: 'red' },
      { label: '우연한 과대값', value: 'Q(s,aood) ↑', detail: '검증할 real target이 없음', tone: 'gold' },
      { label: 'Policy / max 선택', value: 'aood를 선호', detail: '큰 estimate가 target owner가 됨', tone: 'violet' },
      { label: 'Bootstrap 증폭', value: 'target ↑ → Q ↑', detail: 'Offline loop에서 error가 되먹임', tone: 'red' },
    ],
    formula: String.raw`\underbrace{y}_{\text{Bellman 표적}}=r+\gamma\underbrace{\mathbb E_{a'\sim\pi}Q(s',a')}_{\text{policy가 고른 다음 값}}`,
    formulaNote: '다음 action이 data 밖인데 Q가 과대평가되면 target 자체가 커진다. Static dataset에서는 그 action의 실제 reward로 반박할 기회가 없다.',
    callout: '문제는 단순 extrapolation error 하나가 아니라 Q error가 policy choice와 bootstrap을 거쳐 다시 Q target으로 돌아오는 closed loop다.',
    owner: 'Standard off-policy bootstrap',
    output: 'self-reinforcing OOD target',
    invariant: 'action support is measured at every backup',
  },
  {
    eyebrow: '03 · Conservative gap',
    title: 'Candidate action의 큰 Q는 누르고 dataset action의 Q는 되돌려 준다',
    body: 'Log-sum-exp는 state에서 큰 candidate Q에 민감하게 반응한다. Dataset behavior action의 Q를 빼서 모든 값을 무조건 낮추기보다 in/out-of-distribution gap을 만든다.',
    icon: Filter,
    layout: 'compare',
    items: [
      { label: 'Candidate side', value: 'log Σa exp Q(s,a)', detail: 'Policy·uniform sample을 포함한 큰 Q에 penalty', tone: 'red', metric: 'push down' },
      { label: 'Dataset side', value: 'Ea~πβ Q(s,a)', detail: '실제로 관측한 behavior action Q는 되돌림', tone: 'green', metric: 'preserve' },
      { label: 'Resulting gap', value: 'Qdata > Qood 상대화', detail: 'Policy가 미관측 optimism을 덜 선택하게 함', tone: 'gold', metric: 'conservative' },
    ],
    formula: String.raw`\underbrace{\mathcal R_{\mathrm{CQL}}(Q)}_{\text{보수성 벌점}}=\underbrace{\log\sum_a e^{Q(s,a)}}_{\text{큰 candidate 값 압박}}-\underbrace{\mathbb E_{a\sim\widehat\pi_\beta}Q(s,a)}_{\text{dataset action 보존}}`,
    formulaNote: '첫 항만 쓰면 모든 Q가 내려갈 수 있다. 둘째 항이 data action을 상대적으로 지지해 OOD high-Q와의 간격을 벌린다.',
    callout: '“Conservative”는 Q를 무조건 작게 만드는 뜻이 아니다. Deployment policy가 사용할 expected value를 과대평가하지 않도록 action별 상대 압력을 주는 것이다.',
    owner: 'CQL regularizer',
    output: 'candidate-vs-data Q gap',
    invariant: 'proposal and dataset actions are logged separately',
  },
  {
    eyebrow: '04 · Joint critic and policy update',
    title: 'Conservative penalty만 쓰지 않고 관측 transition의 Bellman fit과 함께 푼다',
    body: 'α는 보수성 강도를 정한다. 너무 작으면 OOD optimism이 남고 너무 크면 dataset 안의 유용한 improvement까지 눌릴 수 있다.',
    icon: Gauge,
    layout: 'flow',
    items: [
      { label: 'Static batch', value: '(s,a,r,s′)~D', detail: 'Bellman target의 유일한 real evidence', tone: 'green' },
      { label: 'Bellman loss', value: '(Q−y)²/2', detail: '관측 action의 transition consistency', tone: 'cyan' },
      { label: 'CQL pressure', value: 'α Rᶜᑫˡ', detail: 'Candidate OOD optimism 억제', tone: 'gold' },
      { label: 'Policy improvement', value: 'π ← arg max / actor(Q)', detail: '보수적으로 바뀐 critic을 따라감', tone: 'violet' },
    ],
    formula: String.raw`\underbrace{\min_Q}_{\text{critic 갱신}}\quad \underbrace{\alpha\mathcal R_{\mathrm{CQL}}(Q)}_{\text{OOD 보수성}}+\underbrace{\tfrac12\mathbb E_{\mathcal D}\!\left[(Q-\widehat{\mathcal B}^{\pi}\widehat Q)^2\right]}_{\text{관측 전이 적합}}`,
    formulaNote: '두 항은 역할이 다르다. Bellman 항은 data action의 dynamics를 맞추고, CQL 항은 data 밖에서 policy가 악용할 수 있는 큰 값을 압박한다.',
    callout: 'Continuous action에서는 모든 a를 열거할 수 없다. 어느 proposal에서 몇 개를 sample했고 density correction을 어떻게 했는지가 구현 계약이다.',
    owner: 'Offline critic + actor optimizer',
    output: 'conservative Q · improved policy',
    invariant: 'alpha and action proposals are versioned',
  },
  {
    eyebrow: '05 · Calibration boundary',
    title: '낮은 Q 자체가 아니라 estimated return이 실제 return을 덜 과대평가하는지 본다',
    body: 'Finite neural implementation의 모든 state-action에서 pointwise lower bound가 자동으로 성립하는 것은 아니다. Dataset quality와 α별 calibration, final return, support distance를 함께 확인한다.',
    icon: ShieldCheck,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Offline distribution shift에 Q conservatism이 효과적', detail: 'Discrete·continuous benchmark와 complex data에서 강한 결과를 보고했다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '모든 neural Q(s,a)가 실제 값의 pointwise lower bound', detail: '이론 조건과 finite approximation·sampling error를 구분해야 한다.', tone: 'red' },
      { label: '필수 측정', value: 'Estimated Q ↔ rollout return calibration', detail: '가능한 evaluation 환경에서 optimism gap을 직접 본다.', tone: 'green' },
      { label: '남는 위험', value: '정말 좋은 unseen action도 억제', detail: 'Coverage가 나쁘면 conservatism이 improvement ceiling을 만든다.', tone: 'red' },
    ],
    callout: 'CQL 성공은 가장 낮은 Q를 만든 method가 아니라, static data 조건에서 덜 낙관적인 estimate로 더 나은 실제 policy를 고른 method다.',
    owner: 'Offline-policy evaluator',
    output: 'calibration · support · return curves',
    invariant: 'conservatism and performance are both reported',
  },
];

const decisionTransformerScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Hindsight return token',
    title: 'Episode의 reward를 뒤에서부터 더해 각 시점의 남은 목표를 만든다',
    body: 'Return-to-go는 timestep t 이후 실제로 받은 reward의 합이다. 미래 정보를 action target 뒤에 새게 하지 않고, training example에서는 hindsight condition으로 action 앞에 둔다.',
    icon: ListRestart,
    layout: 'flow',
    items: [
      { label: 'Episode rewards', value: 'r₁, r₂, …, rT', detail: 'Offline trajectory에 기록된 보상', tone: 'cyan' },
      { label: '역순 누적', value: 'R̂ₜ=Σt′≥t rₜ′', detail: '끝에서 현재로 계산', tone: 'gold' },
      { label: '시점별 목표', value: 'R̂₁, R̂₂, …', detail: '각 action 앞에 놓일 desired return token', tone: 'violet' },
      { label: 'Scale contract', value: 'reward units fixed', detail: 'Task와 dataset의 return convention 보존', tone: 'green' },
    ],
    formula: String.raw`\underbrace{\widehat R_t}_{\text{남은 목표}}=\underbrace{\sum_{t'=t}^{T}r_{t'}}_{\text{시점 t 이후 실제 보상}}`,
    formulaNote: 'Training의 R̂ₜ는 trajectory 결과를 알고 만든 hindsight label이다. Deployment에서는 사용자가 원하는 target return으로 시작한다.',
    callout: 'Return token은 value function estimate가 아니다. Dataset trajectory에 이미 실현된 future reward를 조건 변수로 다시 배치한 것이다.',
    owner: 'Trajectory preprocessor',
    output: 'return-to-go token R̂ₜ',
    invariant: 'reward convention and episode boundary are fixed',
  },
  {
    eyebrow: '02 · Interleaved causal sequence',
    title: 'Return, state, action을 timestep마다 세 종류 token으로 엮는다',
    body: '각 modality는 별도 projection을 거치고 같은 timestep embedding을 공유한다. Causal mask는 action을 예측할 때 미래 state와 action을 볼 수 없게 한다.',
    icon: Layers3,
    layout: 'timeline',
    items: [
      { label: 'Goal token', value: 'R̂ₜ', detail: '이번 시점의 남은 desired return', tone: 'gold' },
      { label: 'State token', value: 'sₜ', detail: '현재 environment state', tone: 'cyan' },
      { label: 'Action token', value: 'aₜ', detail: 'Supervised prediction target', tone: 'violet' },
      { label: 'Next triplet', value: 'R̂ₜ₊₁, sₜ₊₁, aₜ₊₁', detail: '시간순으로 반복', tone: 'green' },
    ],
    formula: String.raw`\underbrace{\tau}_{\text{causal 입력 순서}}=(\widehat R_1,s_1,a_1,\widehat R_2,s_2,a_2,\ldots,\widehat R_T,s_T,a_T)`,
    formulaNote: 'Action aₜ를 예측하는 hidden은 R̂ₜ와 sₜ, 과거 triplet만 읽는다. Future token이 mask를 통과하면 offline control이 아니라 label leakage가 된다.',
    callout: '“RL을 language처럼”이라는 비유보다 실제 token 순서, modality projection, timestep alignment와 mask를 먼저 복원해야 한다.',
    owner: 'Sequence collator + causal mask',
    output: '3K-token context with aligned modalities',
    invariant: 'future state/action never reaches current action',
  },
  {
    eyebrow: '03 · Supervised action prediction',
    title: 'Bellman target이나 policy gradient 없이 state 위치의 hidden으로 action을 맞춘다',
    body: 'Transformer는 desired return과 history를 조건으로 dataset action을 회귀하거나 분류한다. Objective는 supervised지만 어떤 behavior mode를 꺼낼지는 return condition이 정한다.',
    icon: Bot,
    layout: 'flow',
    items: [
      { label: 'Causal context', value: '(R̂,s,a) past + (R̂ₜ,sₜ)', detail: '현재 action 전까지의 token', tone: 'cyan' },
      { label: 'Transformer', value: 'hₜ=fθ(context)', detail: 'State 위치 representation', tone: 'violet' },
      { label: 'Action head', value: 'âₜ', detail: 'Continuous MSE 또는 discrete likelihood', tone: 'gold' },
      { label: 'Supervised loss', value: '∥âₜ−aₜ∥²', detail: 'Dataset action을 target으로 parameter update', tone: 'green' },
    ],
    formula: String.raw`\underbrace{\widehat a_t}_{\text{예측 행동}}=f_\theta(\widehat R_{\le t},s_{\le t},a_{<t})\qquad \underbrace{\mathcal L}_{\text{지도 손실}}=\frac1K\sum_t\|\widehat a_t-a_t\|_2^2`,
    formulaNote: 'Input의 action history는 t 이전까지만 포함한다. Current aₜ는 loss target이며 model input으로 미리 들어가면 안 된다.',
    callout: 'Supervised loss라고 해서 distribution shift가 사라지는 것은 아니다. Desired return에 해당하는 behavior가 dataset context 안에 있어야 한다.',
    owner: 'Causal Transformer + action head',
    output: 'predicted next action âₜ',
    invariant: 'current action is target, not leaked input',
  },
  {
    eyebrow: '04 · Closed-loop deployment',
    title: '실제 reward를 받을 때마다 남은 target return을 빼고 새 history로 다음 action을 낸다',
    body: 'Deployment는 한 번 sequence를 생성하고 끝나지 않는다. Action을 환경에 실행하고 실제 reward·next state를 받은 뒤 condition을 갱신하는 receding loop다.',
    icon: Route,
    layout: 'timeline',
    items: [
      { label: '목표 설정', value: 'R̂₁=desired return', detail: 'Dataset support와 비교할 시작 조건', tone: 'gold' },
      { label: 'Action 생성', value: 'âₜ=fθ(history)', detail: '현재 context에서 한 action만 선택', tone: 'violet' },
      { label: '환경 관측', value: 'rₜ, sₜ₊₁', detail: '실제 deployment feedback', tone: 'green' },
      { label: '조건 갱신', value: 'R̂ₜ₊₁=R̂ₜ−rₜ', detail: '새 triplet로 다음 action 생성', tone: 'cyan' },
    ],
    formula: String.raw`\underbrace{\widehat R_{t+1}}_{\text{새 남은 목표}}=\underbrace{\widehat R_t}_{\text{이전 목표}}-\underbrace{r_t}_{\text{실제 받은 보상}}`,
    formulaNote: 'Reward를 빼지 않으면 매 step 같은 총 return을 새로 요구해 training token의 의미와 달라진다. 실제 reward sign과 scaling convention도 같아야 한다.',
    callout: 'Decision Transformer도 closed-loop policy다. Autoregressive action error가 state distribution을 바꾸므로 achieved return과 action likelihood를 함께 추적한다.',
    owner: 'Deployment loop',
    output: 'updated return/state/action history',
    invariant: 'target return decreases by observed reward',
  },
  {
    eyebrow: '05 · Dataset-support boundary',
    title: '높은 desired return은 새 능력을 만드는 주문이 아니라 dataset behavior를 고르는 조건이다',
    body: '논문은 여러 offline benchmark에서 강한 결과와 return conditioning을 보였다. 그러나 dataset 최대치를 크게 넘는 token이 unseen optimal trajectory를 자동으로 합성하지는 않는다.',
    icon: AlertTriangle,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Conditional sequence modeling이 offline control과 경쟁 가능', detail: 'Atari, locomotion, Key-to-Door에서 강한 baseline과 비교했다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '임의의 OOD return prompt가 최적 policy를 창조', detail: 'Dataset에 연결된 action subsequence와 state coverage가 필요하다.', tone: 'red' },
      { label: '필수 sweep', value: 'Requested return ↔ achieved return', detail: 'Dataset percentile 안팎에서 calibration과 likelihood를 함께 본다.', tone: 'green' },
      { label: '남는 위험', value: '같은 scalar return의 서로 다른 goal·risk', detail: 'Return 하나가 behavior 의미를 완전히 식별하지 못할 수 있다.', tone: 'red' },
    ],
    callout: 'Decision Transformer를 “Transformer가 planning한다”로 과장하지 않는다. 논문이 보인 것은 return-conditioned sequence policy의 실용성이다.',
    owner: 'Offline sequence-policy evaluator',
    output: 'requested/achieved return · support traces',
    invariant: 'conditioning is not extrapolation guarantee',
  },
];

function OfflinePaperViz({
  paper,
  scenes,
}: {
  paper: 'dagger' | 'cql' | 'decision-transformer';
  scenes: PaperMechanismScene[];
}) {
  return (
    <div data-offline-rl-paper-viz={paper}>
      <PaperSceneViz
        scenes={scenes}
        ariaLabel={`${paper} distribution-shift 메커니즘 장면`}
      />
    </div>
  );
}

export function DaggerMechanismViz() {
  return <OfflinePaperViz paper="dagger" scenes={daggerScenes} />;
}

export function CqlMechanismViz() {
  return <OfflinePaperViz paper="cql" scenes={cqlScenes} />;
}

export function DecisionTransformerMechanismViz() {
  return <OfflinePaperViz paper="decision-transformer" scenes={decisionTransformerScenes} />;
}
