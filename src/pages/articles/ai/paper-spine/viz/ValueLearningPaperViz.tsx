import {
  Activity,
  Archive,
  Boxes,
  Camera,
  FileCheck2,
  GitCompareArrows,
  History,
  RefreshCw,
  ScanLine,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const qLearningScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Real transition and two policies',
    title: '행동은 behavior policy가 고르지만 target은 greedy policy를 바라본다',
    body: 'Agent가 실제로 실행한 action은 탐색을 포함할 수 있다. 그러나 update의 다음 action은 실행 기록을 그대로 따르지 않고 현재 Q가 가장 크다고 보는 action을 선택한다.',
    icon: GitCompareArrows,
    layout: 'flow',
    items: [
      { label: '현재 state', value: 'sₜ', detail: '환경에서 실제로 관측한 Markov state', tone: 'cyan' },
      { label: '실행 action', value: 'aₜ ~ b(·|sₜ)', detail: '탐색을 포함한 behavior policy가 선택', tone: 'gold' },
      { label: '환경 증거', value: 'rₜ₊₁, sₜ₊₁', detail: '실행 action 뒤 한 번 관측한 reward와 next state', tone: 'green' },
      { label: 'Target action', value: 'arg maxₐ Q(sₜ₊₁,a)', detail: '실행 여부와 무관한 greedy look-ahead', tone: 'violet' },
    ],
    formula: String.raw`\underbrace{a_t\sim b(\cdot\mid s_t)}_{\text{실제로 실행한 행동}}
      \qquad
      \underbrace{a^{\mathrm{target}}_{t+1}=\arg\max_a Q_t(s_{t+1},a)}_{\text{다음 값을 고르는 행동}}`,
    formulaCompact: String.raw`\begin{aligned}
      \underbrace{a_t}_{\text{실행 행동}}&\sim b(\cdot\mid s_t)\\[3pt]
      \underbrace{a^{\mathrm{target}}_{t+1}}_{\text{목표 행동}}&=\arg\max_a Q_t(s_{t+1},a)
    \end{aligned}`,
    formulaNote: '왼쪽 action은 state distribution을 만들고 오른쪽 action은 update target만 만든다. 두 owner가 달라도 학습할 수 있기 때문에 Q-learning은 off-policy다.',
    callout: '“Off-policy”는 과거 data를 쓴다는 말만이 아니다. 현재 전이를 만든 policy와 평가하려는 greedy policy가 다르다는 뜻이다.',
    owner: 'Behavior policy + real environment',
    output: 'provenanced tuple (sₜ,aₜ,rₜ₊₁,sₜ₊₁)',
    invariant: 'executed action and target action stay distinct',
  },
  {
    eyebrow: '02 · Greedy one-step bootstrap',
    title: 'Next state의 모든 action 후보 중 가장 큰 추정값 하나를 미래 대리값으로 쓴다',
    body: '환경은 next state 이후의 전체 미래를 즉시 보여 주지 않는다. Q-learning은 현재 table의 최대값을 그 미래 대신 넣어 한 step target을 만든다.',
    icon: ScanLine,
    layout: 'tree',
    items: [
      { label: '다음 state', value: 'sₜ₊₁', detail: '실제 전이가 도착한 state', tone: 'cyan' },
      { label: '왼쪽 후보', value: 'Q=0.4', detail: '후보 1의 현재 추정', tone: 'muted' },
      { label: '정지 후보', value: 'Q=0.7', detail: '현재 max가 선택한 bootstrap 값', tone: 'green' },
      { label: '오른쪽 후보', value: 'Q=0.2', detail: '후보 3의 현재 추정', tone: 'muted' },
    ],
    formula: String.raw`\underbrace{y_t}_{\text{한 전이의 표적}}
      =
      \underbrace{r_{t+1}}_{\text{지금 받은 보상}}
      +
      \underbrace{\gamma}_{\text{먼 미래 할인}}
      \underbrace{\max_a Q_t(s_{t+1},a)}_{\text{현재 추정한 최선 미래}}`,
    formulaNote: 'max는 next state에서 가장 큰 action value만 고른다. 전체 미래 return을 기다리지 않아도 되지만, 아직 틀릴 수 있는 Q를 target에 다시 쓰는 bootstrap 오차가 생긴다.',
    callout: 'Max action은 지금 환경에 실행되지 않는다. 이번 update가 참조하는 counterfactual next action일 뿐이다.',
    owner: 'Bellman optimality backup',
    output: 'one-step target yₜ',
    invariant: 'reward is observed; future value is estimated',
  },
  {
    eyebrow: '03 · Asynchronous table update',
    title: 'TD error를 계산해 방금 방문한 state-action cell 하나만 조금 이동한다',
    body: 'Target을 새 정답으로 덮어쓰지 않는다. Step size α만큼 오차 방향으로 이동하므로 stochastic reward noise를 여러 방문에 걸쳐 평균낸다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [
      { label: '현재 값', value: 'Qₜ(sₜ,aₜ)', detail: '이번 방문 전 table entry', tone: 'cyan' },
      { label: 'TD error', value: 'δₜ=yₜ−Qₜ', detail: 'Target과 현재 추정의 차이', tone: 'red' },
      { label: '부분 이동', value: 'αₜδₜ', detail: 'Noise를 그대로 복사하지 않는 update 크기', tone: 'gold' },
      { label: 'Cell write', value: 'Qₜ₊₁=Qₜ+αₜδₜ', detail: '다른 state-action cell은 그대로 유지', tone: 'green' },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{y_t}_{\text{bootstrap 표적}}
      &=
      \underbrace{r_{t+1}}_{\text{실제 보상}}
      +\underbrace{\gamma\max_a Q_t(s_{t+1},a)}_{\text{추정한 최선 미래}}\\[3pt]
      \underbrace{\delta_t}_{\text{이번 전이의 오차}}
      &=y_t-\underbrace{Q_t(s_t,a_t)}_{\text{현재 값}}\\[3pt]
      \underbrace{Q_{t+1}(s_t,a_t)}_{\text{방문 cell 수정}}
      &=Q_t(s_t,a_t)+\underbrace{\alpha_t\delta_t}_{\text{오차 일부 반영}}
    \end{aligned}`,
    formulaNote: 'α=1이면 이번 noisy target으로 바로 덮어쓴다. 줄어드는 α는 새 evidence를 계속 반영하면서도 오래 누적된 평균이 매 sample마다 흔들리지 않게 한다.',
    callout: 'Tabular Q-learning의 “local update”는 한 cell만 바뀐다는 뜻이다. DQN에서는 shared parameter 때문에 한 sample이 다른 state의 Q까지 함께 바꾼다.',
    owner: 'Asynchronous Q-table updater',
    output: 'revised Q(sₜ,aₜ)',
    invariant: 'unvisited table entries remain unchanged',
  },
  {
    eyebrow: '04 · Almost-sure convergence contract',
    title: '수렴은 알고리즘 이름이 아니라 coverage·step size·finite table의 결합 조건이다',
    body: '1992 논문은 임의의 실행에서 항상 수렴한다고 말하지 않는다. 모든 pair를 계속 방문하고 bounded reward와 적절한 learning-rate 합 조건을 만족하는 discrete representation을 전제로 한다.',
    icon: Boxes,
    layout: 'timeline',
    items: [
      { label: 'Finite table', value: '|S|, |A| < ∞', detail: '각 state-action value를 따로 표현', tone: 'cyan' },
      { label: 'Infinite coverage', value: 'Nₜ(s,a) → ∞', detail: '모든 pair를 반복해서 표본화', tone: 'green' },
      { label: 'Step-size sums', value: 'Σα=∞, Σα²<∞', detail: '학습은 멈추지 않고 noise는 제어', tone: 'gold' },
      { label: 'Bounded process', value: '|rₜ| ≤ R, γ<1', detail: 'Discounted Bellman target이 유한', tone: 'violet' },
    ],
    formula: String.raw`\underbrace{\sum_i\alpha_i(s,a)=\infty}_{\text{끝까지 남는 총 학습량}}
      \qquad
      \underbrace{\sum_i\alpha_i(s,a)^2<\infty}_{\text{누적 noise를 제한}}`,
    formulaNote: '첫 합이 유한하면 잘못된 초기값을 고칠 총 이동량이 끝날 수 있다. 제곱합이 유한하면 stochastic update의 분산이 끝없이 누적되는 일을 막는다. 두 조건 모두 각 pair별 방문 순서에서 읽는다.',
    callout: 'Constant α와 유한 training budget은 실전에서는 쓸 수 있지만, 이 theorem의 almost-sure convergence 계약과는 다른 설정이다.',
    owner: 'Watkins–Dayan convergence theorem',
    output: 'Qₜ → Q* with probability 1',
    invariant: 'every theorem assumption travels with the claim',
  },
  {
    eyebrow: '05 · Evidence and transfer boundary',
    title: '증명된 tabular fixed point와 이후 deep Q 시스템의 경험적 안정성을 분리한다',
    body: '논문은 discounted finite Markov process의 lookup-table update를 증명하고 absorbing task와 여러 Q update의 확장을 논의한다. 신경망, replay, target network의 일반 수렴은 여기서 따라오지 않는다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: '반복 방문하는 discrete Q가 optimal action value로 수렴', detail: 'Bounded reward와 learning-rate 조건 아래 probability 1 정리', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: 'Nonlinear Q-network도 같은 조건이면 자동 수렴', detail: '논문은 lookup table 가정을 명시하고 다른 representation의 실패 가능성을 경고한다.', tone: 'red' },
      { label: '최소 재현 증거', value: 'Value iteration Q*와 max error 비교', detail: 'Coverage·step-size를 하나씩 깨며 theorem 조건의 역할 확인', tone: 'green' },
      { label: '남는 위험', value: 'Max bias · partial observation · finite coverage', detail: '정리 밖의 representation과 data 문제는 별도 진단', tone: 'red' },
    ],
    callout: 'Q-learning에서 DQN으로 갈 때 계승되는 것은 Bellman target의 형태다. Table convergence guarantee까지 함께 계승되는 것은 아니다.',
    owner: 'Theorem-to-implementation reviewer',
    output: 'supported claim · broken assumption ledger',
    invariant: 'tabular proof is not relabeled as deep-RL proof',
  },
];

const dqnScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Observation construction',
    title: '한 장의 pixel이 아니라 깜빡임을 줄인 네 frame history를 Q-network state로 만든다',
    body: 'Atari 화면 하나만 보면 물체의 속도와 방향을 알기 어렵고 sprite flicker도 있다. 원 논문은 인접 두 frame의 pixel max, luminance, 84×84 resize, 최근 네 frame stack을 사용한다.',
    icon: Camera,
    layout: 'flow',
    items: [
      { label: '두 frame max', value: 'max(xₜ₋₁,xₜ)', detail: '홀수·짝수 frame sprite flicker 완화', tone: 'gold' },
      { label: 'Luminance resize', value: 'Y → 84×84', detail: '색과 공간 해상도를 줄여 계산량 제어', tone: 'cyan' },
      { label: 'History stack', value: 'φₜ∈ℝ⁸⁴×⁸⁴×⁴', detail: '최근 네 화면으로 짧은 운동 단서 제공', tone: 'violet' },
      { label: 'One forward', value: 'Qθ(φₜ,·)', detail: '가능한 모든 discrete action value를 한 번에 출력', tone: 'green' },
    ],
    formula: String.raw`\underbrace{\phi_t}_{\text{network가 보는 state}}
      =
      \underbrace{\operatorname{Stack}_4\!\left(
        \operatorname{Resize}_{84}\!\left(
          Y\!\left(\max(x_{t-1},x_t)\right)
        \right)
      \right)}_{\text{깜빡임 제거·밝기 변환·크기 축소·짧은 history}}`,
    formulaNote: 'Pixel max는 sprite가 번갈아 사라지는 emulator artifact를 줄이고, stack은 한 화면에 없는 운동 방향을 보충한다. 네 frame이 원래 emulator state를 완전히 복원한다는 보장은 아니다.',
    callout: 'DQN의 입력은 “raw pixel 그대로”가 아니다. 사람이 만든 object feature는 없지만 명시적인 temporal·image preprocessing contract가 있다.',
    owner: 'Atari preprocessing map φ',
    output: '84×84×4 observation tensor',
    invariant: 'frame order and episode boundary are preserved',
  },
  {
    eyebrow: '02 · Acting and replay capture',
    title: '현재 online Q로 행동하되 모든 real transition을 유한 replay memory에 남긴다',
    body: 'Training behavior는 ε-greedy이고 선택한 action은 네 frame 동안 반복된다. Reward는 부호로 clipping되며 transition은 최대 최근 100만 frame 규모의 replay에 들어간다.',
    icon: Archive,
    layout: 'timeline',
    items: [
      { label: 'ε-greedy', value: 'random 또는 arg max Qθ', detail: '1.0에서 0.1까지 anneal한 behavior', tone: 'gold' },
      { label: 'Action repeat', value: 'k=4 frames', detail: 'Skipped frame에도 마지막 action 반복', tone: 'cyan' },
      { label: 'Real transition', value: '(φₜ,aₜ,rₜ,φₜ₊₁)', detail: 'Emulator가 만든 interaction evidence', tone: 'green' },
      { label: 'Replay write', value: 'D ← recent N', detail: '유한 buffer에서 오래된 경험은 덮어씀', tone: 'violet' },
    ],
    formula: String.raw`a_t=
      \begin{cases}
        \underbrace{\text{uniform action}}_{\text{확률 }\epsilon},&u<\epsilon\\
        \underbrace{\arg\max_a Q_\theta(\phi_t,a)}_{\text{현재 greedy 행동}},&u\ge\epsilon
      \end{cases}`,
    formulaNote: 'Random branch가 state-action coverage를 넓히고 greedy branch가 현재 학습 결과를 사용한다. Replay에는 서로 다른 시점의 ε와 parameter가 만든 behavior data가 함께 섞인다.',
    callout: 'Replay는 simulator가 만든 가짜 data가 아니다. 한 번 실제로 관측한 transition을 여러 gradient update에 재사용하는 memory다.',
    owner: 'ε-greedy actor + emulator',
    output: 'finite replay memory D',
    invariant: 'collection policy and reward clipping are logged',
  },
  {
    eyebrow: '03 · Random replay update',
    title: '연속 frame 대신 과거 여러 policy의 transition을 무작위로 섞어 mini-batch를 만든다',
    body: 'Online 순서대로 학습하면 이웃 frame이 강하게 상관되고 policy가 바뀔 때 data distribution도 갑자기 이동한다. Uniform replay는 경험을 재사용하며 이 변화의 시간척도를 완화한다.',
    icon: History,
    layout: 'compare',
    items: [
      { label: 'Online sequence', value: 'eₜ,eₜ₊₁,eₜ₊₂', detail: '서로 닮은 frame과 현재 policy가 update를 지배', tone: 'red', metric: 'correlated' },
      { label: 'Uniform replay', value: 'B ~ U(D)', detail: 'Buffer 위치를 무작위로 골라 mini-batch 구성', tone: 'green', metric: 'randomized' },
      { label: 'Mixed behavior age', value: 'θcollect ≠ θnow', detail: '과거 policy의 sample도 현재 Q update에 사용', tone: 'gold', metric: 'off-policy' },
    ],
    formula: String.raw`\underbrace{\mathcal B}_{\text{이번 mini-batch}}
      \sim
      \underbrace{\operatorname{Uniform}(\mathcal D)}_{\text{저장 위치를 무작위 표본화}}
      \qquad
      \underbrace{\theta_{\mathrm{collect}}\ne\theta_{\mathrm{update}}}_{\text{수집·학습 policy가 다를 수 있음}}`,
    formulaNote: '무작위 sampling은 시간상 이웃의 상관을 줄이고 이전 behavior distribution을 평균낸다. Transition을 수학적으로 완전 독립으로 만들거나 중요한 sample을 더 자주 고르는 것은 아니다.',
    callout: 'Replay의 세 역할은 data 재사용, temporal correlation 완화, policy-induced distribution oscillation 완화다. “IID로 바꾼다”로 과장하지 않는다.',
    owner: 'Uniform replay sampler',
    output: 'off-policy mini-batch B',
    invariant: 'sample age and source episode stay traceable',
  },
  {
    eyebrow: '04 · Split prediction and target timescales',
    title: 'Online network만 매 step 바꾸고 target network는 C번 update 동안 고정한다',
    body: '같은 parameter가 prediction과 label을 동시에 만들면 Q를 올린 update가 즉시 다음 target도 올릴 수 있다. DQN은 오래된 복사본으로 target을 만들어 이 feedback에 지연을 넣는다.',
    icon: RefreshCw,
    layout: 'flow',
    items: [
      { label: 'Online prediction', value: 'Qθ(φ,a)', detail: 'Gradient가 실제로 수정하는 값', tone: 'cyan' },
      { label: 'Frozen target', value: 'Qθ⁻(φ′,a′)', detail: 'C번 update 동안 label owner 고정', tone: 'violet' },
      { label: 'TD loss', value: '(Qθ−y)²', detail: 'Replay batch에서 prediction만 target 쪽으로 이동', tone: 'gold' },
      { label: 'Hard sync', value: 'θ⁻ ← θ every C', detail: '느린 target timescale을 주기적으로 갱신', tone: 'green' },
    ],
    formula: String.raw`\begin{aligned}
      \underbrace{v^-}_{\text{고정된 다음 값}}
      &=(1-d)\max_{a'}Q_{\theta^-}(\phi',a')\\[3pt]
      \underbrace{y}_{\text{bootstrap 표적}}
      &=\underbrace{r}_{\text{실제 보상}}+\underbrace{\gamma v^-}_{\text{할인한 다음 값}}\\[3pt]
      \underbrace{\mathcal L(\theta)}_{\text{online 손실}}
      &=\mathbb E_{\mathcal B}\!\left[(Q_\theta(\phi,a)-y)^2\right]\\[3pt]
      \underbrace{\theta^-\leftarrow\theta}_{\text{target 복사}}
      &\quad\text{every }C\text{ updates}
    \end{aligned}`,
    formulaNote: 'Done mask는 실제 terminal 뒤 미래값을 제거한다. θ⁻는 C번 update 동안 고정되어 label이 매 gradient step마다 같이 달아나는 일을 늦춘다. 이것은 target을 참값으로 만드는 장치가 아니다.',
    callout: 'Target network는 두 critic의 독립적 합의가 아니다. Online Q의 지연된 복사본이며 안정성을 위한 timescale separation이다.',
    owner: 'Online optimizer + frozen target copy',
    output: 'updated θ · periodically synced θ⁻',
    invariant: 'target branch stays fixed between syncs',
  },
  {
    eyebrow: '05 · Atari evidence and limit',
    title: '49개 game의 강한 결과와 일반 수렴·일반 지능 주장을 같은 문장에 넣지 않는다',
    body: '논문은 game마다 별도 network를 학습하되 같은 architecture와 hyperparameter를 사용했다. 43개 game에서 당시 최고 비교법을 넘었고 29개에서 professional human score의 75% 이상을 보고했다.',
    icon: Activity,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Pixel-to-action deep Q recipe가 다양한 Atari task에서 작동', detail: '49개 game, 같은 architecture·학습 절차·주요 hyperparameter로 평가', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '한 network가 49개 game을 동시에 일반화하거나 DQN이 항상 수렴', detail: 'Game마다 별도 network이며 nonlinear off-policy bootstrap의 일반 정리는 아니다.', tone: 'red' },
      { label: '장치별 증거', value: 'Replay · target network · CNN 제거 비교', detail: '추가 simulation에서 core component를 끈 성능 저하를 보고', tone: 'green' },
      { label: '남는 위험', value: '긴 탐색 · reward scale 상실 · partial observation', detail: 'Montezuma류 장기 계획, sign clipping, four-frame aliasing이 남는다.', tone: 'red' },
    ],
    formula: String.raw`\underbrace{\operatorname{HNS}}_{\text{human-normalized score}}
      =
      100\,
      \frac{
        \underbrace{S_{\mathrm{DQN}}-S_{\mathrm{random}}}_{\text{random보다 얻은 향상}}
      }{
        \underbrace{S_{\mathrm{human}}-S_{\mathrm{random}}}_{\text{human까지의 기준 간격}}
      }`,
    formulaNote: 'Random score를 0%, professional human score를 100% 기준으로 다시 놓는 비교다. Game별 score scale을 맞추지만 한 game의 sample efficiency나 새 task transfer를 측정하지는 않는다.',
    callout: 'DQN의 핵심 유산은 CNN 하나가 아니라 observation, replay distribution, target timescale을 함께 고정한 training system이다.',
    owner: 'Atari evaluator + ablation reviewer',
    output: '49-game scores · component evidence · limits',
    invariant: 'benchmark result does not inherit tabular convergence',
  },
];

export function QLearningMechanismViz() {
  return (
    <div data-value-learning-paper-viz="q-learning">
      <PaperSceneViz scenes={qLearningScenes} ariaLabel="Q-learning · 한 전이에서 optimal Q fixed point까지" />
    </div>
  );
}

export function DqnMechanismViz() {
  return (
    <div data-value-learning-paper-viz="dqn">
      <PaperSceneViz scenes={dqnScenes} ariaLabel="DQN · Pixel interaction에서 안정화된 Q update까지" />
    </div>
  );
}
