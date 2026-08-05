import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { DqnLearningSequenceViz } from './rl-viz/RlAnimatedSequences';
import {
  ControlTargetLab,
  DqnBackupLab,
  LambdaReturnLab,
} from './rl-temporal-difference-dqn/viz/TdDqnFoundationViz';

function FormulaFrame({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className={`not-prose my-6 min-w-0 rounded-md border p-3 sm:p-4 ${
        accent ? 'border-sky-600/30 bg-sky-500/[0.04]' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function PredictionTargets() {
  return (
    <section id="prediction-targets" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Value를 학습할 정답은 어디에서 오는가?</h2>
      <QuestionLead
        question="환경이 V(s)의 정답표를 주지 않는데 무엇을 regression target으로 삼을까?"
        answer="Monte Carlo는 episode가 끝날 때까지 실제 reward를 모은다. TD는 reward 일부를 관측한 뒤 아직 보지 못한 미래를 현재 value estimate로 이어 붙인다. 둘은 정답과 근사의 대립이 아니라 관측 길이와 bootstrap 의존도를 다르게 고른 추정량이다."
      />
      <ConceptPrimer
        items={[
          {
            term: 'Monte Carlo return',
            meaning: 'Episode 끝까지 실제로 관측한 discounted reward 합이다.',
            why: 'Bootstrap prediction을 쓰지 않는 기준점을 만든다.',
          },
          {
            term: 'n-step return',
            meaning: 'n개 reward를 관측한 뒤 V(sₜ₊ₙ)으로 미래를 이어 붙인다.',
            why: '관측 길이와 bootstrap 길이를 명시적으로 나눈다.',
          },
          {
            term: 'Bootstrap',
            meaning: '학습 중인 추정치를 새 target의 일부로 다시 사용한다.',
            why: '빠른 전파와 prediction bias·moving target이 함께 생긴다.',
          },
          {
            term: 'TD residual',
            meaning: '한 step target에서 현재 prediction을 뺀 값이다.',
            why: 'Value update와 actor-critic의 local credit이 된다.',
          },
        ]}
      />

      <LambdaReturnLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          MC는 마지막 reward까지 기다리므로 중간 value prediction을 빌리지 않는다. n-step
          return은 n개 reward만 관측하고 그 뒤부터 V로 이어 붙인다. Episode가 n번째
          transition에서 진짜 끝났다면 미래 value는 존재하지 않으므로 mask가 0이 된다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{Y_t^{\mathrm{MC}}}_{\text{MC target}}=\underbrace{G_t}_{\text{끝까지 관측한 return}}=\sum_{k=0}^{T-t-1}\underbrace{\gamma^k}_{\text{k step 뒤 가중치}}r_{t+k+1}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{G_t^{(n)}}_{\text{n-step target}}
&=\underbrace{\sum_{k=0}^{n-1}\gamma^k r_{t+k+1}}_{\text{n개 실제 reward}}\\
&\quad+\underbrace{\gamma^n m_{t+n-1}V(s_{t+n})}_{\text{끝나지 않았으면 value로 연결}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="MC는 끝까지 관측한 reward만 더한다. n-step return은 n개 reward까지 관측한 뒤, terminal이 아닐 때만 현재 value prediction으로 나머지 미래를 근사한다."
        symbols={[
          [String.raw`G_t`, '시점 t부터 episode 끝까지의 관측 return'],
          [String.raw`G_t^{(n)}`, 'n개 reward 뒤 bootstrap하는 target'],
          [String.raw`m_{t+n-1}`, '진짜 terminal이면 0, 그 외에는 1인 미래 gate'],
          [String.raw`V(s_{t+n})`, '아직 관측하지 않은 미래를 대신할 prediction'],
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          λ-return은 one-step TD와 MC 두 숫자를 단순히 직선 보간하지 않는다. 1-step,
          2-step, …, 마지막 return을 먼저 만든 뒤 짧은 return에는 큰 가중치, 긴 return에는
          λ의 거듭제곱 가중치를 준다. 따라서 중간 state의 value prediction도 계산에 실제로
          참여한다.
        </p>
      </div>
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{G_t^\lambda}_{\text{여러 horizon을 섞은 target}}
&=\underbrace{(1-\lambda)\sum_{n=1}^{N-1}\lambda^{n-1}G_t^{(n)}}_{\text{짧은 n-step return의 가중합}}\\
&\quad+\underbrace{\lambda^{N-1}G_t^{(N)}}_{\text{마지막 실제 return}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{Y_t^{\mathrm{TD}}}_{\text{one-step target}}
&=\underbrace{r_{t+1}}_{\text{관측 reward}}+\underbrace{\gamma m_tV(s_{t+1})}_{\text{남은 미래 추정}}\\
\underbrace{\delta_t}_{\text{TD residual}}
&=Y_t^{\mathrm{TD}}-\underbrace{V(s_t)}_{\text{현재 prediction}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="One-step TD target은 이전 글의 Bellman expectation backup에서 transition·reward 분포의 평균을 실제로 관측한 (rₜ₊₁, sₜ₊₁) 한 sample로 바꾼 stochastic target이다. λ=0은 1-step return만 남기고 λ=1은 마지막 MC return을 남긴다. TD residual의 부호는 target과 현재 prediction의 차이이며, 양수면 이 sample에서 현재 value를 낮게 예측했다는 뜻이다."
        symbols={[
          [String.raw`\lambda`, '여러 n-step return 사이의 trace 계수'],
          [String.raw`N`, '현재 시점부터 terminal T까지 실제로 남은 최대 return horizon'],
          [String.raw`Y_t^{\mathrm{TD}}`, 'reward와 next value로 만든 one-step target'],
          [String.raw`\delta_t`, 'one-step target에서 현재 V를 뺀 residual'],
        ]}
      />

      <Misconception>
        MC가 bootstrap bias를 쓰지 않는다는 사실만으로 유한 데이터에서 언제나 더 정확한 것은
        아니다. 긴 episode return은 variance가 클 수 있다. 반대로 TD target은 낮은 variance와
        빠른 전파를 얻지만 현재 V의 오차를 target에 다시 넣는다.
      </Misconception>
    </section>
  );
}

function Control() {
  return (
    <section id="control" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SARSA와 Q-learning은 다음 행동을 누구에게 물어보는가?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SARSA는 behavior policy가 실제로 선택한 다음 action의 Q를 bootstrap한다. 탐색 중
          위험한 행동까지 포함한 현재 policy를 평가하므로 on-policy control이다. Q-learning은
          다음 state에서 가장 큰 Q의 action을 target으로 삼아, 데이터를 만든 behavior와 별개인
          greedy target policy를 학습한다.
        </p>
      </div>

      <ControlTargetLab />

      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}\underbrace{a'}_{\text{실제로 고른 행동}}&=a_{t+1}\\[2pt]\underbrace{Y_t^{\mathrm{SARSA}}}_{\text{현재 policy의 표적}}&=r_{t+1}+\gamma m_tQ(s_{t+1},a')\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}\underbrace{M_t}_{\text{가장 큰 다음 가치}}&=\max_{a'}Q(s_{t+1},a')\\[2pt]\underbrace{Y_t^Q}_{\text{greedy policy의 표적}}&=r_{t+1}+\gamma m_tM_t\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="SARSA는 behavior가 실제로 뽑은 다음 action을 평가하고, Q-learning은 greedy target policy가 고를 action을 평가한다. 두 식 모두 진짜 terminal에서만 m=0으로 미래를 끊는다."
        symbols={[
          [String.raw`a_{t+1}`, 'behavior policy가 실제 선택한 다음 action'],
          [String.raw`\max_{a'}`, 'target policy가 가정한 greedy action'],
          [String.raw`m_t`, 'terminated면 0, continuing 또는 truncation이면 1'],
        ]}
      />

      <Misconception>
        시간 제한으로 rollout이 잘린 truncation과 목표 달성·실패로 MDP가 끝난 termination은
        같지 않다. 유효한 next observation이 있는 time-limit truncation을 terminal로 처리하면
        남아 있던 미래 가치를 0으로 잘못 학습한다.
      </Misconception>
    </section>
  );
}

function Exploration() {
  return (
    <section id="exploration" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Off-policy는 과거 데이터를 아무 제한 없이 재사용한다는 뜻일까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Value estimate는 방문한 state-action 데이터에만 근거한다. Greedy action만 반복하면
          초기 noise로 낮게 평가된 행동을 다시 확인할 기회가 사라진다. ε-greedy는 대부분
          argmax를 택하되 일정 확률로 다른 action을 방문해 이 고리를 끊는다.
        </p>
        <p>
          Q-learning이 off-policy라는 말은 behavior와 greedy target을 분리할 수 있다는 뜻이다.
          Replay buffer(재생 버퍼)는 과거 transition을 저장했다가 다시 뽑는 데이터 저장소다.
          이 buffer에 필요한 state-action 주변의 transition이 없다면 Bellman target을 계산해도
          function approximator(함수 근사기, 여기서는 Q network)의 외삽을 신뢰할 근거는
          생기지 않는다. 과거 데이터의 재사용과 coverage는 별도의 계약이다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-sky-800 dark:text-sky-300">BEHAVIOR POLICY</p>
          <p className="mt-2 text-sm font-bold">Replay의 state-action 분포를 만든다</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            ε-greedy, older actor 또는 logged human policy가 여기에 해당한다.
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-violet-800 dark:text-violet-300">TARGET POLICY</p>
          <p className="mt-2 text-sm font-bold">어느 action value를 개선할지 정한다</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            SARSA는 behavior와 같고 Q-learning은 greedy target을 둔다.
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">COVERAGE</p>
          <p className="mt-2 text-sm font-bold">필요한 state-action을 실제로 보았는가</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            지원 밖 action의 Q는 replay와 Bellman 식만으로 보장할 수 없다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Dqn() {
  return (
    <section id="dqn" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Q-table을 network로 바꾸면 target이 왜 함께 움직일까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          DQN은 image state를 받아 유한한 discrete action 각각의 Q를 한 번에 출력한다. 같은
          network가 현재 Q와 next Q target을 모두 만들면 parameter update가 맞춰야 할 답도
          즉시 바꾼다. 연속 trajectory를 순서대로 학습하면 mini-batch의 sample correlation도
          커진다.
        </p>
        <p>
          Replay는 transition의 시간 상관을 낮추고 데이터를 재사용한다. Target network는
          online parameter의 복사본을 일정 기간 고정해 target 변화의 시간 척도를 늦춘다. 둘은
          서로 다른 feedback을 완화하며 coverage나 max bias를 자동으로 해결하지 않는다.
        </p>
      </div>

      <DqnLearningSequenceViz />
      <DqnBackupLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Original DQN은 target network 안에서 max action을 고르고 그 값을 평가한다. Double
          DQN은 online network가 argmax action을 고른 뒤 frozen target network가 그 action의
          값을 평가한다. 선택 noise와 평가 noise의 경로를 분리해 max overestimation을 줄이지만
          모든 sample의 target이 작아진다는 보장은 아니다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{a^*}_{\text{online이 고른 action}}
&=\arg\max_{a'}\underbrace{Q_\theta(s',a')}_{\text{선택 network}}\\
\underbrace{Y^{\mathrm{Double}}}_{\text{분리된 평가 target}}
&=r+\gamma m\underbrace{Q_{\theta^-}(s',a^*)}_{\text{frozen network의 평가}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{Y}_{\text{frozen TD target}}
&=r+\gamma m\underbrace{\max_{a'}Q_{\theta^-}(s',a')}_{\text{target network backup}}\\
\underbrace{\mathcal L(\theta)}_{\text{online Q의 회귀 loss}}
&=\mathbb E_{\mathcal D}\!\left[(\underbrace{Q_\theta(s,a)}_{\text{현재 prediction}}-Y)^2\right]
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Replay에서 뽑은 transition으로 frozen target Y를 먼저 만든다. Gradient는 target 계산을 통과하지 않고 online prediction Qθ(s,a)에만 흐른다. Double DQN은 action 선택과 target 평가 network를 분리한다."
        symbols={[
          [String.raw`\mathcal D`, '과거 transition을 저장한 replay buffer'],
          [String.raw`Q_\theta`, 'gradient로 갱신할 online network'],
          [String.raw`Q_{\theta^-}`, '일정 기간 고정한 target network'],
          [String.raw`a^*`, 'Double DQN에서 online network가 선택한 next action'],
        ]}
      />
    </section>
  );
}

function Diagnostics() {
  const rows = [
    ['Evaluation return', '별도 evaluation policy가 environment에서 얻은 score', '학습 loss와 분리하고 여러 seed의 분포를 본다.'],
    ['TD residual tail', 'Target과 Q prediction 차이의 quantile·maximum', '평균 loss가 숨기는 특정 state 폭주를 찾는다.'],
    ['Q scale', '예측 Q의 평균·최댓값·분산', '가능한 return 범위를 계속 넘으면 overestimation을 의심한다.'],
    ['Replay age', 'Sample behavior와 현재 policy 사이의 시간 거리', '오래된 data가 coverage인지 harmful shift인지 분리한다.'],
    ['Target lag', 'Online과 target parameter의 sync 간격', '짧으면 moving target, 길면 stale target이 된다.'],
  ];

  return (
    <section id="diagnostics" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Batch loss가 내려가는데 policy가 나빠지면 무엇부터 볼까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Function approximation, bootstrapping, off-policy data가 동시에 결합된 구성을 deadly
          triad라 부른다. Batch loss 감소는 현재 replay와 현재 target copy가 만든 회귀 문제를
          더 잘 맞췄다는 뜻이지 environment return 개선의 증거가 아니다.
        </p>
      </div>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {rows.map(([metric, meaning, action]) => (
          <div
            key={metric}
            className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <strong className="text-sm text-sky-800 dark:text-sky-300">{metric}</strong>
            <p className="text-xs leading-relaxed">{meaning}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">진단 · {action}</p>
          </div>
        ))}
      </div>
      <CapabilityCheck
        items={[
          'Reward [1,2,4]에서 1·2·3-step return 5.50, 5.23, 6.04를 계산한다.',
          'λ-return이 two-number interpolation이 아니라 n-step return의 기하 가중합임을 보인다.',
          'SARSA 2.80과 Q-learning 6.40의 차이를 behavior action과 greedy action으로 설명한다.',
          'Termination은 bootstrap을 끊고 time-limit truncation은 유지하는 이유를 말한다.',
          'Replay, target network, Double DQN과 coverage가 줄이는 실패를 서로 구분한다.',
          'DQN 2.89와 Double DQN 2.44 target에서 action selection과 evaluation network를 추적한다.',
          'Online Q만 gradient를 받고 frozen target은 regression label로 남는 것을 표시한다.',
          'Training loss와 evaluation return이 어긋날 때 Q scale, tail, replay age와 target lag를 진단한다.',
        ]}
      />
      <LearningHandoff
        description="여기서 만든 것은 sampled Bellman target과 discrete action value-control loop다. State 가정, 직접 policy 최적화, 수렴 근거 중 현재 막힌 질문만 연다."
        items={[
          { label: '막히면', slug: 'rl-mdp-bellman', title: 'MDP·Return·Bellman', reason: 'TD target이 어떤 exact expectation을 표본화하는지와 termination의 수학적 경계를 복습한다.' },
          { label: '이어 읽기', slug: 'rl-policy-gradient-actor-critic', title: 'Policy Gradient·Actor-Critic', reason: 'Action을 모두 열거하기 어렵거나 stochastic·continuous policy를 직접 최적화해야 할 때 이동한다.' },
          { label: '원문으로', slug: 'paper-q-learning-1992', title: 'Q-learning 수렴 계약', reason: 'Tabular convergence에 필요한 반복 방문, step size와 update 조건의 정확한 보장 범위를 확인한다.' },
        ]}
      />
      <SourceNotes
        sources={[
          {
            label: 'Sutton & Barto · Reinforcement Learning, 2nd ed.',
            href: 'http://incompleteideas.net/book/the-book-2nd.html',
            note: 'MC, n-step return, TD(λ), SARSA와 Q-learning의 표준 정의를 제공한다.',
          },
          {
            label: 'Watkins & Dayan · Q-learning (1992)',
            href: 'https://doi.org/10.1007/BF00992698',
            note: 'Tabular Q-learning의 update와 반복 방문·step-size를 포함한 수렴 조건을 증명한다.',
          },
          {
            label: 'Mnih et al. · Human-level control through deep RL (2015)',
            href: 'https://www.nature.com/articles/nature14236',
            note: 'Replay와 target network를 사용한 Atari DQN의 원 설계와 평가 범위를 제공한다.',
          },
          {
            label: 'van Hasselt et al. · Deep RL with Double Q-learning (2016)',
            href: 'https://ojs.aaai.org/index.php/AAAI/article/view/10295',
            note: 'Action selection과 evaluation을 분리해 DQN overestimation을 줄인 근거다.',
          },
          {
            label: 'Farama · Handling Time Limits',
            href: 'https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/',
            note: 'Modern environment API에서 termination과 truncation의 bootstrap 차이를 설명한다.',
          },
        ]}
      />
    </section>
  );
}

export default function RlTemporalDifferenceDqnArticle() {
  return (
    <>
      <PredictionTargets />
      <Control />
      <Exploration />
      <Dqn />
      <Diagnostics />
    </>
  );
}
