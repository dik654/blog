import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { ActorCriticSequenceViz } from './rl-viz/RlAnimatedSequences';
import {
  PolicyGradientBanditLab,
  ReturnToGoViz,
} from './rl-policy-gradient-actor-critic/viz/PolicyGradientFoundationViz';

function FormulaFrame({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className={`not-prose my-6 min-w-0 rounded-md border p-3 sm:p-4 ${
        accent ? 'border-teal-600/30 bg-teal-500/[0.04]' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function PolicyObjective() {
  return (
    <section id="policy-objective" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Policy를 직접 학습하면 무엇이 달라질까?</h2>
      <QuestionLead
        question="Q의 argmax 대신 stochastic policy 자체를 parameterize하면 무엇을 최대화해야 할까?"
        answer="Policy πθ가 실제로 만들어 내는 trajectory의 return 평균 J(θ)를 최대화한다. θ는 지금 행동의 확률뿐 아니라 그 행동 뒤에 방문할 state와 reward의 분포까지 바꾼다."
      />
      <ConceptPrimer
        items={[
          {
            term: 'Trajectory τ',
            meaning: 's₀,a₀,r₁,…로 이어진 한 번의 상호작용 경로다.',
            why: 'Policy가 바꾸는 대상이 한 행동이 아니라 전체 경로 분포임을 본다.',
          },
          {
            term: 'Stochastic policy',
            meaning: '행동 하나가 아니라 행동별 선택 확률을 출력한다.',
            why: '탐색과 여러 가능한 행동을 하나의 분포 안에 표현한다.',
          },
          {
            term: 'On-policy sample',
            meaning: '현재 policy 또는 매우 가까운 policy가 만든 trajectory다.',
            why: '계산한 gradient가 어느 행동 분포의 기대값인지 지킨다.',
          },
          {
            term: 'Credit assignment · 책임 배분',
            meaning: '나중의 결과를 어느 과거 action의 책임으로 돌릴지 정한다.',
            why: 'Reward-to-go, advantage와 Generalized Advantage Estimation(GAE)이 필요한 이유다.',
          },
        ]}
      />

      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{J(\theta)}_{\text{현재 policy의 성능}}=\mathbb E_{\underbrace{\tau\sim\pi_\theta}_{\text{policy가 만든 경로}}}\!\left[\underbrace{R(\tau)}_{\text{경로의 누적 return}}\right]`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="현재 policy가 만드는 경로마다 return을 계산하고 그 평균을 성능으로 삼는다. θ가 바뀌면 행동 확률과 이후 방문 빈도가 함께 달라진다."
        symbols={[
          [String.raw`J(\theta)`, 'policy parameter θ의 기대 성능'],
          [String.raw`\tau\sim\pi_\theta`, '현재 policy와 환경이 함께 생성한 경로'],
          [String.raw`R(\tau)`, '그 경로에서 얻은 discounted reward의 합'],
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          경로 확률을 한 줄로 펼치면 어디가 학습 대상인지 보인다. 초기 state는 환경이
          정하고, policy가 action을 뽑고, 환경이 다음 state와 reward를 만든다. 같은 과정을
          episode 끝까지 반복한 곱이 한 trajectory가 나올 확률이다.
        </p>
      </div>
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{p_\theta(\tau)}_{\text{한 trajectory의 확률}}
&=\underbrace{\rho_0(s_0)}_{\text{환경의 시작 분포}}\\
&\quad\cdot\underbrace{\prod_{t=0}^{T-1}\pi_\theta(a_t\mid s_t)}_{\text{policy가 만든 action 경로}}\\
&\quad\cdot\underbrace{\prod_{t=0}^{T-1}p(s_{t+1},r_{t+1}\mid s_t,a_t)}_{\text{환경이 만든 결과 경로}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="환경 dynamics가 θ와 무관하다는 표준 가정 아래 policy 항만 θ에 의존한다. 따라서 simulator 내부를 미분하지 않고도 행동 확률의 변화가 경로 확률을 어떻게 바꾸는지 계산할 수 있다."
        symbols={[
          [String.raw`\rho_0(s_0)`, '환경이 정한 초기 state 분포'],
          [String.raw`\pi_\theta(a_t\mid s_t)`, '학습할 policy의 행동 확률'],
          [String.raw`p(s_{t+1},r_{t+1}\mid s_t,a_t)`, '미분하지 않을 환경 transition'],
        ]}
      />
    </section>
  );
}

function ScoreFunction() {
  return (
    <section id="score-function" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        환경을 미분하지 않고도 gradient가 생기는 이유는 무엇일까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          핵심은 확률의 미분을 <strong>확률 × log 확률의 미분</strong>으로 바꾸는
          log-derivative identity다. 이 형태로 기대값을 다시 쓰면, 직접 미분하기 어려운
          trajectory sampling을 그대로 두고 선택한 행동의 log-probability만 미분할 수 있다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{\nabla_\theta p_\theta(\tau)}_{\text{경로 확률의 미분}}=\underbrace{p_\theta(\tau)}_{\text{경로 확률}}\underbrace{\nabla_\theta\log p_\theta(\tau)}_{\text{log 확률의 score}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="확률 자체의 미분을 확률과 log 확률 score의 곱으로 바꾼다. 이 항등식 덕분에 sampled trajectory는 그대로 두고, 모델이 직접 출력한 log-probability만 자동미분할 수 있다."
        symbols={[
          [String.raw`\nabla_\theta p_\theta(\tau)`, 'parameter를 바꿀 때 경로 확률이 움직이는 정도'],
          [String.raw`p_\theta(\tau)`, '현재 policy가 경로 τ를 만들 확률'],
          [String.raw`\nabla_\theta\log p_\theta(\tau)`, '경로의 log 확률이 움직이는 방향인 score'],
        ]}
      />
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{\nabla_\theta\log p_\theta(\tau)}_{\text{trajectory score}}=\sum_{t=0}^{T-1}\underbrace{\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{선택 action의 score}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="곱으로 이어진 trajectory 확률에 log를 취하면 시점별 합이 된다. 초기 분포와 환경 transition은 θ를 포함하지 않으므로 미분하면 0이고, policy score만 남는다."
        symbols={[
          [String.raw`p_\theta(\tau)`, '현재 policy에서 그 경로가 나올 확률'],
          [String.raw`\nabla_\theta\log\pi_\theta`, '선택 행동의 확률을 움직이는 score'],
          [String.raw`\sum_t`, 'episode 안의 모든 의사결정 시점을 합산'],
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          이제 sampled return을 각 score에 곱한다. 결과가 좋으면 선택 행동의 확률을 올리는
          방향, 나쁘면 내리는 방향이 된다. 하지만 어떤 reward를 어느 시점의 score에 곱할지는
          별도의 인과 문제다.
        </p>
      </div>
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{g_t}_{\text{선택 action의 score}}
&=\nabla_\theta\log\pi_\theta(a_t\mid s_t)\\
\underbrace{\nabla_\theta J(\theta)}_{\text{성능을 높이는 방향}}
&=\mathbb E_{\tau\sim\pi_\theta}\!\left[\sum_t g_tG_t\right]
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="각 시점에서 실제로 고른 action의 score g_t에 그 이후 성과 G_t를 곱한다. 좋은 결과를 만든 action은 같은 state에서 더 자주 선택되도록, 나쁜 결과를 만든 action은 덜 선택되도록 모든 시점의 기여를 평균한다."
        symbols={[
          [String.raw`g_t`, '시점 t에서 고른 action의 log-probability score'],
          [String.raw`G_t`, '그 action 이후에 관측한 discounted return'],
          [String.raw`\mathbb E_{\tau\sim\pi_\theta}`, '현재 policy가 만든 여러 경로에 대한 평균'],
        ]}
      />
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{G_t}_{\text{action 이후의 return}}=\sum_{k=t}^{T-1}\underbrace{\gamma^{k-t}}_{\text{미래 감쇠}}\underbrace{r_{k+1}}_{\text{이후에 관측한 reward}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="시점 t의 행동에는 그 행동 이후에 관측된 reward만 묶는다. 이것이 reward-to-go다. 전체 return을 써도 평균은 맞지만 이미 지나간 reward가 불필요한 noise로 들어간다."
        symbols={[
          [String.raw`G_t`, '행동 a_t 이후의 discounted return'],
          [String.raw`g_t`, '선택 action의 log-probability score'],
          [String.raw`\gamma`, '먼 미래 reward를 줄이는 discount'],
          [String.raw`r_{k+1}`, '시점 k의 행동 뒤에 관측한 reward'],
        ]}
      />

      <ReturnToGoViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          왜 과거 reward를 지워도 되는지 식으로 확인해 보자. state가 주어졌을 때 policy
          score의 action 평균은 0이다. 미래 action을 뽑기 전에 이미 정해진 과거 reward는 그
          score와 평균하면 0이므로 gradient의 기대값에 기여하지 않는다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\mathbb E\!\left[
\underbrace{\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{현재 action의 score}}
\underbrace{\sum_{k=0}^{t-1}\gamma^k r_{k+1}}_{\text{action 전에 확정된 reward}}
\right]=0
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="과거 reward는 미래 action이 결정되기 전에 확정된다. 그러므로 그 항을 제거해도 기대 gradient는 그대로이고 표본마다 생기는 불필요한 흔들림만 줄어든다."
        symbols={[
          [String.raw`\sum_{k=0}^{t-1}\gamma^k r_{k+1}`, '행동 a_t보다 먼저 확정된 reward'],
          [String.raw`\mathbb E[\nabla\log\pi]`, 'action을 평균하면 0인 policy score'],
        ]}
      />
    </section>
  );
}

function Baseline() {
  return (
    <section id="baseline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Baseline은 답을 바꾸지 않고 흔들림을 어떻게 줄일까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          State만 보는 b(s)는 현재 action에 의존하지 않는다. 모든 action에 대한 policy
          score의 기대값은 확률 합 1의 gradient이므로 0이다. 따라서 return에서 b(s)를 빼도
          기대 gradient는 바뀌지 않는다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\mathbb E_{a\sim\pi_\theta}\!\left[\underbrace{\nabla_\theta\log\pi_\theta(a\mid s)}_{\text{action score}}\underbrace{b(s)}_{\text{action과 무관한 기준}}\right]=0`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="같은 state에서 모든 action을 policy 확률로 평균하면 score의 합은 0이다. 따라서 action을 보지 않는 baseline b(s)를 곱한 항은 기대 gradient를 바꾸지 않는다."
        symbols={[
          [String.raw`\nabla_\theta\log\pi_\theta(a\mid s)`, 'action마다 확률을 어느 방향으로 움직일지 나타내는 score'],
          [String.raw`b(s)`, '현재 action과 무관하게 state만 보고 정한 기준값'],
          [String.raw`\mathbb E_{a\sim\pi_\theta}`, '같은 state에서 가능한 action을 policy 확률로 평균'],
        ]}
      />
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\underbrace{\widehat A_t}_{\text{상대적 action 성과}}=\underbrace{G_t}_{\text{관측한 return}}-\underbrace{V_\phi(s_t)}_{\text{state의 평균 기준}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Learned critic Vφ를 baseline으로 쓰면 state 자체의 평균 난이도를 뺀 상대적 성과가 남는다. 기대값 보존은 어떤 action-independent baseline에도 성립하지만, 분산 감소는 baseline이 return 규모를 잘 예측할 때만 성립한다."
        symbols={[
          [String.raw`b(s)`, '현재 action과 무관한 state baseline'],
          [String.raw`V_\phi(s_t)`, 'parameter φ로 return을 예측한 critic'],
          [String.raw`\widehat A_t`, '평균보다 얼마나 좋거나 나빴는지 나타내는 표본 advantage'],
        ]}
      />

      <PolicyGradientBanditLab />

      <Misconception>
        Baseline을 빼면 항상 variance가 줄어드는 것은 아니다. Action과 무관하면 기대 gradient는
        보존되지만, return과 동떨어진 나쁜 baseline은 표본의 크기를 더 벌려 variance를 키울 수
        있다. 위 예제에서 b=0의 분산은 0.0625, b*=0.5는 0, b=2는 0.5625다.
      </Misconception>
    </section>
  );
}

function ActorCritic() {
  return (
    <section id="actor-critic" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Actor와 critic은 같은 rollout에서 서로 다른 답을 배운다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Actor πθ는 action distribution을 출력하고 advantage가 양수인 행동의 log-probability를
          높인다. Critic Vφ는 reward와 next value로 만든 target에 현재 value를 맞춘다. 즉 critic은
          행동을 고르지 않고, actor가 받은 결과를 비교할 기준을 학습한다.
        </p>
      </div>

      <ActorCriticSequenceViz />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-teal-800 dark:text-teal-300">ROLLOUT</p>
          <p className="mt-2 break-words font-mono text-sm font-bold">s, a, r, done, logπ</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            현재 actor가 만든 on-policy evidence다.
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-blue-800 dark:text-blue-300">CRITIC</p>
          <p className="mt-2 font-mono text-sm font-bold">Vφ(s) → δ</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            미래 return의 baseline과 다음 state value를 이어 붙이는 bootstrap(부트스트랩)을 제공한다.
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">ACTOR</p>
          <p className="mt-2 break-words font-mono text-sm font-bold">logπθ(a|s) · Â</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            상대적으로 좋은 행동의 확률을 올린다.
          </p>
        </div>
      </div>

      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{y_t}_{\text{critic 목표}}
&=r_t+\gamma(1-d_t)V_\phi(s_{t+1})\\
\underbrace{\delta_t}_{\text{한 step 오차}}
&=y_t-V_\phi(s_t)
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="종료가 아니면 reward에 다음 state의 예측 가치를 이어 붙이고, 종료면 d=1로 그 bootstrap을 끊는다. 이 target과 현재 value의 차이가 한 step TD residual(시간차 잔차)이다."
        symbols={[
          [String.raw`r_t`, '현재 transition에서 받은 reward'],
          [String.raw`1-d_t`, 'terminal에서 가짜 미래 가치를 차단하는 mask'],
          [String.raw`y_t`, 'reward와 종료 전 다음 value를 합친 critic target'],
          [String.raw`\delta_t`, 'critic의 한 step Bellman residual'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          δₜ를 곧바로 advantage 표본처럼 쓸 수는 있지만 언제나 정확한 advantage인 것은 아니다.
          On-policy이고 critic이 실제 Vπ를 맞춘 경우에만 action을 조건으로 한 기대값이 Aπ에
          맞는다. Critic이 틀리면 bootstrap bias가 actor update로 전달된다.
        </p>
        <p>
          Shared encoder 뒤 policy head와 value head를 둘 때는 두 loss가 같은 representation을
          서로 다른 방향으로 밀 수도 있다. Return뿐 아니라 value loss, explained variance,
          gradient norm을 같이 보아야 하는 이유다.
        </p>
      </div>
    </section>
  );
}

function Gae() {
  return (
    <section id="gae" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Generalized Advantage Estimation(GAE)은 짧은 critic 신호와 긴 실제 결과를 어떻게 섞을까?
      </h2>
      <QuestionLead
        question="한 step TD의 critic bias와 episode 전체 return의 큰 variance 사이를 연속적으로 조절할 수 있을까?"
        answer="GAE는 현재부터 미래의 TD residual을 (γλ)의 거듭제곱으로 합친다. λ=0이면 현재 residual만, λ가 1에 가까울수록 episode 뒤쪽 결과를 현재 행동의 책임에 더 오래 반영한다."
      />
      <GaeExplorer />
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{w_l}_{\text{l step 뒤 신호의 가중치}}&=(\gamma\lambda)^l\\
\underbrace{\widehat A_t^{\mathrm{GAE}}}_{\text{여러 step의 advantage 추정}}
&=\sum_{l=0}^{T-t-1}w_l\underbrace{\delta_{t+l}}_{\text{l step 뒤 critic 오차}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="현재 TD residual부터 episode 끝까지를 γλ로 감쇠해 더한다. λ는 reward 자체의 discount가 아니라 critic bootstrap에 얼마나 의존할지 조절하는 별도 손잡이다."
        symbols={[
          [String.raw`w_l`, 'l step 뒤 residual에 적용할 γλ의 거듭제곱 가중치'],
          [String.raw`\delta_{t+l}`, 'l step 뒤 critic의 Bellman residual'],
          [String.raw`\gamma`, 'task가 정한 미래 reward discount'],
          [String.raw`\lambda`, '먼 residual을 얼마나 오래 전달할지 정하는 trace'],
          [String.raw`\widehat A_t`, 'actor update에 들어갈 advantage estimate'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 글의 GAE Lab은 residual 가중합의 의미를 분해한다. 실제 rollout buffer에서 terminal
          mask를 넣고 뒤에서 앞으로 계산하는 구현과 λ의 수치 비교는 다음
          <Link
            to={articlePath('ai', 'rl-ppo-continuous-control')}
            className="font-semibold text-foreground underline decoration-border underline-offset-4"
          >
            PPO 실행 계약
          </Link>
          에서 이어진다.
        </p>
      </div>

      <CapabilityCheck
        items={[
          'Trajectory 확률을 policy와 environment 항으로 나누고 θ에 의존하는 항을 표시한다.',
          'Log-derivative identity가 simulator 미분을 없애는 과정을 설명한다.',
          'Reward-to-go [3,2,4]를 계산하고 전체 return [3,3,3]보다 noise가 적은 이유를 보인다.',
          'Action-independent baseline이 기대값은 보존하지만 나쁘면 variance를 키울 수 있음을 계산한다.',
          'Bandit에서 b=0, b*=0.5, b=2의 variance 0.0625, 0, 0.5625를 재현한다.',
          'Actor loss와 critic target이 같은 rollout에서 맡는 역할을 구분한다.',
          'Terminal mask가 없는 TD target이 episode 경계에서 만드는 오류를 찾는다.',
          'GAE의 γ와 λ가 조절하는 축을 구분하고 λ=0과 λ=1을 해석한다.',
        ]}
      />
      <SourceNotes
        sources={[
          {
            label: 'Williams · REINFORCE (1992)',
            href: 'https://link.springer.com/article/10.1007/BF00992696',
            note: 'Score-function estimator로 stochastic policy의 기대 reward를 직접 최적화한 원 논문.',
          },
          {
            label: 'Sutton et al. · Policy Gradient Theorem (1999)',
            href: 'https://proceedings.neurips.cc/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html',
            note: 'State visitation까지 포함한 policy gradient와 actor-critic 기반을 정식화한다.',
          },
          {
            label: 'Schulman et al. · Generalized Advantage Estimation (2015)',
            href: 'https://arxiv.org/abs/1506.02438',
            note: 'TD residual의 지수 가중합으로 advantage의 bias와 variance를 조절한다.',
          },
          {
            label: 'OpenAI Spinning Up · Intro to Policy Optimization',
            href: 'https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html',
            note: 'Reward-to-go의 인과성, action-independent baseline과 policy gradient 유도를 단계별로 설명한다.',
          },
          {
            label: 'OpenAI Spinning Up · Vanilla Policy Gradient',
            href: 'https://spinningup.openai.com/en/latest/algorithms/vpg.html',
            note: 'Rollout, reward-to-go, policy update와 value regression의 실행 순서를 제공한다.',
          },
        ]}
      />
    </section>
  );
}

function GaeExplorer() {
  const deltas = [1, -0.4, 0.8, 0.2];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
        <span className="font-mono text-xs font-black text-violet-800 dark:text-violet-300">
          RESIDUAL MAP
        </span>
        <div className="min-w-0">
          <strong className="text-sm">λ가 커질수록 오른쪽 residual의 목소리가 오래 남는다</strong>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            δ=[1.0,-0.4,0.8,0.2], γ=0.9를 고정하고 λ=0, 0.5, 0.95, 1의
            t=0 advantage를 비교한다.
          </p>
        </div>
      </div>
      <div data-gae-contribution className="mt-5 grid gap-3 sm:grid-cols-4">
        {[0, 0.5, 0.95, 1].map((lambda) => {
          const contributions = deltas.map((delta, offset) => (0.9 * lambda) ** offset * delta);
          const advantage = contributions.reduce((sum, value) => sum + value, 0);
          return (
            <div key={lambda} className="border-t-2 border-violet-600 p-3">
              <p className="font-mono text-xs font-black">λ = {lambda}</p>
              <p className="mt-2 font-mono text-xl font-black">Â₀ {advantage.toFixed(3)}</p>
              <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
                {contributions.map((value) => value.toFixed(3)).join(' + ')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RlPolicyGradientActorCriticArticle() {
  return (
    <>
      <PolicyObjective />
      <ScoreFunction />
      <Baseline />
      <ActorCritic />
      <Gae />
    </>
  );
}
