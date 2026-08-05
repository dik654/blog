import { useState, type ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { BellmanBackupSequenceViz } from './rl-viz/RlAnimatedSequences';
import {
  MarkovSufficiencyLab,
  ValueConditioningLab,
} from './rl-mdp-bellman/viz/MdpBellmanFoundationViz';

function FormulaFrame({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className={`not-prose my-6 min-w-0 rounded-md border p-3 sm:p-4 ${
        accent ? 'border-emerald-600/30 bg-emerald-500/[0.04]' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function fixed(value: number, digits: number) {
  const normalized = Math.abs(value) < 1e-10 ? 0 : value;
  const factor = 10 ** digits;
  const rounded =
    Math.sign(normalized) *
    (Math.round((Math.abs(normalized) + Number.EPSILON) * factor) / factor);
  return rounded.toFixed(digits);
}

function ReturnExplorer() {
  const [gamma, setGamma] = useState(0.9);
  const [start, setStart] = useState(0);
  const rewards = [0, 1, 0, -1, 5];
  const terms = rewards
    .slice(start)
    .map((reward, offset) => reward * gamma ** offset);
  const total = terms.reduce((sum, value) => sum + value, 0);

  return (
    <figure
      data-return-explorer
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
          RETURN LAB
        </span>
        <strong className="min-w-0 text-sm">
          terminal에서 끝나는 유한 episode의 return을 직접 합산한다
        </strong>
        <span data-return-total className="font-mono text-sm font-bold">
          G{start} = {fixed(total, 3)}
        </span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-emerald-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Discount γ · {gamma.toFixed(2)}
          <input
            aria-label="Discount gamma"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gamma}
            onChange={(event) => setGamma(Number(event.target.value))}
            className="mt-3 block w-full accent-emerald-700"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Return 시작 시점 t · {start}
          <input
            aria-label="Return start step"
            type="range"
            min="0"
            max="4"
            step="1"
            value={start}
            onChange={(event) => setStart(Number(event.target.value))}
            className="mt-3 block w-full accent-emerald-700"
          />
        </label>
      </div>
      <div className="p-4 sm:p-6">
        <p className="mb-4 text-xs leading-6 text-muted-foreground">
          이 lab의 다섯 번째 reward 뒤에는 환경의 목표·실패 조건으로 episode가 끝난다. 따라서
          보이지 않는 여섯 번째 value를 이어 붙이지 않는다.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-1.5">
          {rewards.map((reward, index) => {
            const active = index >= start;
            const term = active ? reward * gamma ** (index - start) : 0;
            return (
              <div
                key={index}
                className={`min-w-0 border px-2 py-3 text-center ${
                  active
                    ? 'border-emerald-600/30 bg-emerald-500/[0.045]'
                    : 'border-border bg-muted/20 opacity-40'
                }`}
              >
                <p className="font-mono text-xs text-muted-foreground">r{index + 1}</p>
                <p className="mt-1 font-mono text-base font-black">{reward}</p>
                <p className="mt-2 font-mono text-xs leading-tight text-muted-foreground">
                  기여 {fixed(term, 2)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">즉시 reward</p>
            <p className="mt-1 font-mono text-lg font-black">{rewards[start]}</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">할인된 미래</p>
            <p className="mt-1 font-mono text-lg font-black">
              {fixed(total - rewards[start], 3)}
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">전체 return</p>
            <p className="mt-1 font-mono text-lg font-black text-emerald-800 dark:text-emerald-300">
              {fixed(total, 3)}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function BellmanExplorer() {
  const [risk, setRisk] = useState(0.35);
  const [gamma, setGamma] = useState(0.9);
  const safe = 1 + gamma * 2;
  const risky = risk * (5 + gamma * 1) + (1 - risk) * -2;
  const best = safe >= risky ? 'SAFE' : 'RISK';
  const policyValue = 0.5 * safe + 0.5 * risky;

  return (
    <>
      <BellmanBackupSequenceViz />
      <figure
        data-bellman-explorer
        className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
      >
        <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
            BACKUP LAB
          </span>
          <strong className="min-w-0 text-sm">
            기대 backup과 max backup은 같은 action 값을 다른 방식으로 묶는다
          </strong>
          <span className="w-fit rounded bg-emerald-500/10 px-2 py-1 font-mono text-xs font-black">
            BEST {best}
          </span>
        </figcaption>
        <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Risk 성공 확률 · {Math.round(risk * 100)}%
            <input
              aria-label="Risk success probability"
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={risk}
              onChange={(event) => setRisk(Number(event.target.value))}
              className="mt-3 block w-full accent-emerald-700"
            />
          </label>
          <label className="text-xs font-semibold text-muted-foreground">
            Discount γ · {gamma.toFixed(2)}
            <input
              aria-label="Bellman discount gamma"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={gamma}
              onChange={(event) => setGamma(Number(event.target.value))}
              className="mt-3 block w-full accent-emerald-700"
            />
          </label>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          <div className={`${best === 'SAFE' ? 'bg-emerald-500/[0.06]' : 'bg-background'} p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm">SAFE action</strong>
              <span data-safe-backup className="font-mono text-lg font-black">
                {fixed(safe, 2)}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              즉시 +1 뒤 확정된 next state의 value 2를 이어 붙인다.
            </p>
            <p className="mt-3 font-mono text-xs">1 + γ·2</p>
          </div>
          <div className={`${best === 'RISK' ? 'bg-emerald-500/[0.06]' : 'bg-background'} p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm">RISK action</strong>
              <span data-risk-backup className="font-mono text-lg font-black">
                {fixed(risky, 2)}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              성공과 실패 branch를 environment transition 확률로 먼저 평균한다.
            </p>
            <p className="mt-3 font-mono text-xs">p(5+γ·1)+(1-p)(-2)</p>
          </div>
        </div>
        <div className="grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            고정 policy가 두 행동을 50:50으로 선택하면 expectation은{' '}
            <strong data-bellman-expectation>{fixed(policyValue, 2)}</strong>다. Optimality는
            둘 중 큰 <strong data-bellman-optimal>{fixed(Math.max(safe, risky), 2)}</strong>를
            선택한다.
          </p>
          <p className="font-mono text-xl font-black text-emerald-800 dark:text-emerald-300">
            Δ {fixed(Math.max(safe, risky) - policyValue, 2)}
          </p>
        </div>
      </figure>
    </>
  );
}

function Interaction() {
  return (
    <section id="interaction" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        행동이 다음 장면을 바꾸는 학습은 무엇이 다를까?
      </h2>
      <BeginnerOpening
        title="강화학습은 한 번의 정답보다 이어지는 선택의 결과를 배운다"
        description={<>사진 분류는 사진과 정답 이름을 비교하면 한 문제가 끝난다. 강화학습에서는 행동을 고르는 주체인 <strong>agent</strong>가 바깥 세계인 <strong>environment</strong>에 행동을 보내고, 결과 점수인 reward와 달라진 다음 상황을 받는다.</>}
        familiarScene={<>미로에서 한 칸 움직일 때마다 서 있는 위치와 다음에 갈 수 있는 길이 달라진다. 눈앞의 사탕만 따라가면 막다른 길에 갇힐 수 있으므로, 지금의 작은 점수와 나중에 출구에 도착하는 긴 결과를 함께 계산해야 한다.</>}
        steps={[
          { label: '현재 상황을 본다', detail: '다음 결과를 예측하는 데 필요한 현재 정보를 state라고 부른다.' },
          { label: '행동을 고른다', detail: '어떤 행동을 얼마나 자주 고를지 정하는 규칙이 policy다.' },
          { label: '다음 장면을 받는다', detail: '환경은 reward와 next state를 돌려주고 반복이 이어진다.' },
        ]}
      />
      <QuestionLead
        question="지금 고른 행동이 다음 장면과 다음 선택지까지 바꾼다면, 입력과 정답 한 쌍만 모아 학습할 수 있을까?"
        answer="Agent가 action을 내면 environment가 next state와 reward를 돌려준다. 이 상호작용이 다음 관측 분포를 만들기 때문에 고정 dataset의 입력-정답 쌍을 맞추는 문제와 다르다. Policy는 예측기인 동시에 앞으로 수집할 데이터를 결정하는 제어기다."
      />
      <ConceptPrimer
        items={[
          {
            term: 'Agent',
            meaning: '관측을 받아 행동을 선택하는 학습 주체다.',
            why: 'Policy와 value function이 어느 쪽에 속하는지 경계를 잡는다.',
          },
          {
            term: 'Environment',
            meaning: '행동 뒤 next state와 reward를 생성하는 외부 dynamics다.',
            why: '학습할 network와 환경 전이를 구분한다.',
          },
          {
            term: 'Policy π(a|s)',
            meaning: '상태에서 행동으로 가는 조건부 분포다.',
            why: 'Exploration과 exploitation을 하나의 실행 계약으로 표현한다.',
          },
          {
            term: 'Reward',
            meaning: '한 transition 직후 받은 scalar 신호다.',
            why: '긴 목표인 return과 한 시점 feedback을 혼동하지 않는다.',
          },
        ]}
      />
      <div className="not-prose my-8 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="border border-emerald-600/25 bg-emerald-500/[0.04] p-4">
          <p className="text-xs font-bold text-muted-foreground">STATE sₜ</p>
          <p className="mt-2 text-sm font-bold">의사결정에 필요한 현재 정보</p>
        </div>
        <span className="self-center text-center text-muted-foreground">π →</span>
        <div className="border border-violet-600/25 bg-violet-500/[0.04] p-4">
          <p className="text-xs font-bold text-muted-foreground">ACTION aₜ</p>
          <p className="mt-2 text-sm font-bold">Agent가 환경에 가한 선택</p>
        </div>
        <span className="self-center text-center text-muted-foreground">P, R →</span>
        <div className="border border-blue-600/25 bg-blue-500/[0.04] p-4">
          <p className="text-xs font-bold text-muted-foreground">rₜ₊₁, sₜ₊₁</p>
          <p className="mt-2 text-sm font-bold">환경이 돌려준 결과</p>
        </div>
      </div>
      <Misconception>
        Reward는 모델의 loss가 아니다. Reward는 환경이 낸 관측 신호이고, loss는 그 신호로
        policy나 value parameter를 갱신하기 위해 알고리즘이 구성한 최적화 목적이다.
      </Misconception>
    </section>
  );
}

function Mdp() {
  return (
    <section id="mdp" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Markov state는 과거를 버린 상태가 아니라 미래 예측에 충분한 상태다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          MDP의 실행 계약은 state 집합 S, action 집합 A, transition P, reward R,
          시작 분포 ρ₀와 horizon·discount로 구성된다. Markov property는 “과거가 중요하지
          않다”가 아니다. 현재 state와 action을 알면 다음 결과를 예측할 때 history가 추가
          정보를 주지 않는다는 조건이다.
        </p>
        <p>
          카메라 한 장만으로 속도 방향을 알 수 없는 로봇처럼 observation이 충분하지 않으면
          문제는 partially observed다. Frame stack, recurrent memory, filter나 belief state는
          빠진 과거 정보를 state representation에 복원하는 서로 다른 방법이다.
        </p>
      </div>

      <MarkovSufficiencyLab />

      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
H_{\text{이력}}&=(s_{0:t},a_{0:t})\\
Y_{\text{결과}}&=(s_{t+1},r_{t+1})\\
p_{\text{이력}}&=p(Y_{\text{결과}}\mid H_{\text{이력}})\\
p_{\text{현재}}&=p(Y_{\text{결과}}\mid s_t,a_t)\\
\text{Markov}\quad&\Longleftrightarrow\quad p_{\text{이력}}=p_{\text{현재}}
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="왼쪽은 전체 history를 알고 한 예측이고 오른쪽은 현재 state와 action만 알고 한 예측이다. 두 조건부 분포가 같을 때 현재 state가 다음 transition에 필요한 history를 이미 요약한다."
        symbols={[
          [String.raw`s_{0:t},a_{0:t}`, '현재까지의 state-action history'],
          [String.raw`s_t,a_t`, '현재 전이를 예측할 압축된 조건'],
          [String.raw`s_{t+1},r_{t+1}`, '환경이 다음에 생성할 결과'],
        ]}
      />
      <Misconception>
        유한 horizon에서 같은 물리 상태라도 남은 시간이 다르면 가능한 미래 return이 다르다.
        이때 남은 step이나 clock을 state에 포함하거나 Vₜ(s)처럼 시간 index를 둬야 한다.
      </Misconception>
    </section>
  );
}

function Return() {
  return (
    <section id="return" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 번의 reward를 넘어 긴 목표를 어떻게 하나의 숫자로 만들까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Agent가 최대화하려는 것은 보통 현재 reward가 아니라 현재 이후 reward의 discounted
          sum인 return이다. Discount는 단지 미래를 덜 중요하게 보는 심리 계수가 아니다.
          Infinite-horizon 합을 유한하게 만들고, 먼 미래의 model error와 불확실성을 줄이며,
          얼마나 먼 결과까지 책임 신호(credit)를 전달할지 정한다.
        </p>
      </div>
      <ReturnExplorer />
      <FormulaFrame>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}\underbrace{G_t^{\mathrm{episode}}=\sum_{k=0}^{T-t-1}\gamma^k r_{t+k+1}}_{\text{terminal 시점 T에서 실제로 끝나는 유한 합}}\\[6pt]\underbrace{G_t^{\mathrm{continuing}}=\sum_{k=0}^{\infty}\gamma^k r_{t+k+1}}_{\text{종료 없이 계속되는 문제의 무한 합}}\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Return의 끝은 환경 계약에 달려 있다. 목표 달성이나 실패로 episode가 실제 끝나면 T까지만 더하고, continuing task는 무한 합을 쓴다. 위 lab은 첫 번째 경우다."
        symbols={[
          [String.raw`T`, '환경의 terminal 조건이 처음 성립한 종료 시점'],
          [String.raw`T-t-1`, '현재 시점 뒤 실제로 남아 있는 reward 항의 마지막 index'],
          [String.raw`\infty`, '환경이 종료되지 않는 continuing 문제의 합 범위'],
          [String.raw`\gamma^k`, 'k step 뒤 reward의 기하 가중치'],
        ]}
      />
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}\underbrace{y_t^{\mathrm{terminal}}=r_{t+1}}_{\text{실제 종료: 다음 value를 0으로 둠}}\\[6pt]\underbrace{y_t^{\mathrm{time\ limit}}=r_{t+1}+\gamma V(s_{t+1})}_{\text{시간 제한: 과정이 계속될 수 있어 bootstrap 유지}}\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="두 종료 신호를 모두 done 하나로 합치면 TD target이 달라진다. 목표 달성·실패처럼 환경의 terminal state에 도착했으면 미래 value가 없지만, 수집 시간이 끝난 truncation이면 마지막 관측에서 계속될 미래를 추정해야 한다."
        symbols={[
          [String.raw`y_t`, '다음 TD·DQN 글에서 network가 맞출 one-step target'],
          ['terminal', '환경 자체의 목표·실패 조건으로 trajectory가 끝난 경우'],
          ['time limit', '환경은 계속될 수 있지만 수집기나 wrapper의 제한으로 잘린 truncation'],
          [String.raw`V(s_{t+1})`, '시간 제한 뒤에도 남아 있다고 보는 미래 return의 추정값'],
        ]}
      />
      <Misconception>
        γ가 작다고 반드시 단기적인 “나쁜 agent”인 것은 아니다. Episode 구조, transition 시간
        단위와 reward scale이 다르면 같은 실제 시간 범위도 서로 다른 γ로 표현된다.
      </Misconception>
    </section>
  );
}

function Value() {
  return (
    <section id="value" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        V와 Q는 미래를 예측하지만 무엇을 조건으로 고정하는가?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Vπ(s)는 state s에서 policy π를 계속 따를 기대 return이다. Qπ(s,a)는 첫 action a까지
          고정한 뒤 π를 따르는 기대 return이다. 따라서 V는 policy가 고를 action까지 평균하지만
          Q는 “이 action을 먼저 했다면”이라는 질문에 답한다.
        </p>
        <p>
          Advantage Aπ(s,a)=Qπ(s,a)-Vπ(s)는 같은 state의 평균적 선택보다 action a가 얼마나
          나은지 중심화한다. State 자체의 난이도를 빼기 때문에 다음 Policy Gradient 글에서
          action의 상대적 credit으로 사용할 수 있다.
        </p>
      </div>

      <ValueConditioningLab />

      <div className="not-prose my-6 grid min-w-0 gap-2">
        <FormulaFrame>
          <MathFormula display className="my-0 text-lg">
            {String.raw`\begin{aligned}
\underbrace{V^\pi(s)}_{\text{state의 가치}}
&=\underbrace{\mathbb E_\pi[G_t\mid S_t=s]}_{\text{state만 고정한 기대 return}}
\end{aligned}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display className="my-0 text-lg">
            {String.raw`\begin{aligned}
\underbrace{Q^\pi(s,a)}_{\text{action까지 고정한 가치}}
&=\underbrace{\mathbb E_\pi[G_t\mid S_t=s,A_t=a]}_{\text{첫 action 뒤의 기대 return}}
\end{aligned}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame accent>
          <MathFormula display className="my-0 text-lg">
            {String.raw`\underbrace{A^\pi(s,a)}_{\text{상대적 action 이득}}=\underbrace{Q^\pi(s,a)}_{\text{이 action의 가치}}-\underbrace{V^\pi(s)}_{\text{policy 평균 가치}}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="V는 state만 고정하고 policy action까지 평균한다. Q는 첫 action도 고정한다. Advantage는 Q에서 그 state의 policy 평균 V를 빼 action의 상대적 초과 가치를 남긴다."
        symbols={[
          [String.raw`V^\pi`, 'policy π 아래 state의 기대 return'],
          [String.raw`Q^\pi`, '첫 action까지 고정한 기대 return'],
          [String.raw`A^\pi`, 'state 평균 대비 action의 초과 가치'],
        ]}
      />
      <FormulaFrame accent>
        <MathFormula display className="my-0 text-lg">
          {String.raw`\begin{aligned}
\underbrace{V^\pi(s)}_{\text{state 가치}}
&=\sum_a\underbrace{\pi(a\mid s)}_{\text{action 확률}}\\
&\quad\cdot\underbrace{Q^\pi(s,a)}_{\text{action 가치}}\\
\sum_a\pi(a\mid s)\underbrace{A^\pi(s,a)}_{\text{평균에서 뺀 초과 가치}}&=0
\end{aligned}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Policy 확률로 Q를 평균하면 V가 된다. 같은 baseline V를 모든 action Q에서 뺐기 때문에 advantage를 그 policy로 다시 평균하면 0이다. 이는 다음 글에서 state baseline이 action의 상대적 방향만 남기는 이유다."
        symbols={[
          [String.raw`\pi(a\mid s)`, 'state s에서 action a를 고를 policy 확률'],
          [String.raw`\sum_a\pi Q`, '행동별 Q의 policy 가중 평균'],
          [String.raw`\sum_a\pi A=0`, '같은 policy 아래 중심화된 advantage 평균'],
        ]}
      />
    </section>
  );
}

function Bellman() {
  return (
    <section id="bellman" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Bellman equation은 긴 미래를 한 step의 local consistency로 바꾼다
      </h2>
      <QuestionLead
        question="무한히 긴 trajectory를 매번 끝까지 펼치지 않고도 value가 맞는지 검사할 수 있을까?"
        answer="Return의 재귀를 기대값 안에 넣으면 현재 value는 한 step reward와 next value의 기대값이어야 한다. 고정 policy를 평가할 때는 action을 π로 평균하고, optimal value를 찾을 때는 next action 중 max를 선택한다."
      />
      <BellmanExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2">
        <FormulaFrame>
          <MathFormula display className="my-0 text-lg">
            {String.raw`\begin{aligned}
\underbrace{V^\pi(s)}_{\text{현재 state 가치}}
&=\sum_a\underbrace{\pi(a\mid s)}_{\text{policy의 action 평균}}\\
&\quad\cdot\sum_{s',r}\underbrace{p(s',r\mid s,a)}_{\text{환경의 다음 결과 확률}}
\underbrace{[r+\gamma V^\pi(s')]}_{\text{한 step 뒤의 return}}
\end{aligned}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame accent>
          <MathFormula display className="my-0 text-lg">
            {String.raw`\begin{aligned}
\underbrace{Q^*(s,a)}_{\text{현재 action의 최적 가치}}
&=\sum_{s',r}\underbrace{p(s',r\mid s,a)}_{\text{환경의 다음 결과 확률}}\\
&\quad\cdot\underbrace{[r+\gamma\max_{a'}Q^*(s',a')]}_{\text{다음에는 최적 action을 선택}}
\end{aligned}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="Policy evaluation은 environment의 다음 결과를 평균한 action backup을 현재 policy 확률로 다시 평균한다. Optimality는 next state에서 policy 평균 대신 가장 큰 action value를 선택한다. 평균과 max는 같은 계산의 근사 정도가 아니라 서로 다른 질문이다."
        symbols={[
          [String.raw`\pi(a\mid s)`, '현재 policy가 만드는 action 확률'],
          [String.raw`p(s',r\mid s,a)`, 'environment의 다음 결과 분포'],
          [String.raw`r+\gamma V^\pi(s')`, '한 step reward와 next value'],
          [String.raw`\max_{a'}Q^*(s',a')`, 'next state에서 optimal action 선택'],
        ]}
      />
      <CapabilityCheck
        items={[
          'Agent, environment, policy, transition과 reward의 소유 경계를 구분한다.',
          '같은 observation이 서로 다른 미래를 만드는 두 history로 Markov 여부를 반증한다.',
          'Finite horizon에서 clock이 state나 value index에 필요한 이유를 설명한다.',
          'Reward sequence와 γ가 주어지면 어느 시점의 return도 계산한다.',
          '같은 Q와 policy 확률에서 V, action별 advantage와 Eπ[A]=0을 계산한다.',
          'Bellman expectation에서 environment 평균과 policy 평균을 순서대로 계산한다.',
          'Expectation과 optimality의 평균·max가 답하는 질문을 구분한다.',
          'Reward, return, value, Bellman target과 optimization loss를 다른 객체로 설명한다.',
        ]}
      />
      <LearningHandoff
        description="이 글의 산출물은 환경 분포를 안다고 가정한 exact Bellman backup이다. 실제 sample로 배울지, state 가정을 고칠지에 따라 다음 질문이 갈린다."
        items={[
          { label: '막히면', slug: 'rl-decision-system-contracts', title: '강화학습 적용 계약', reason: 'Observation·action·feedback·termination과 data access를 먼저 고정해 이 문제가 정말 RL인지 판정한다.' },
          { label: '이어 읽기', slug: 'rl-temporal-difference-dqn', title: 'Value Target 실행 계약', reason: '알 수 없는 transition 평균을 실제 transition sample과 bootstrap target으로 학습한다.' },
          { label: '적용하기', slug: 'rl-pomdp-state-estimation', title: 'POMDP·Belief·State Estimation', reason: '같은 observation이 다른 미래를 만들면 Markov state를 belief 또는 learned memory로 다시 구성한다.' },
        ]}
      />
      <SourceNotes
        sources={[
          {
            label: 'Sutton & Barto · Reinforcement Learning: An Introduction',
            href: 'http://incompleteideas.net/book/the-book-2nd.html',
            note: 'MDP, return, value function과 Bellman equation의 표준 공개 교재다.',
          },
          {
            label: 'OpenAI Spinning Up · Key Concepts in RL',
            href: 'https://spinningup.openai.com/en/latest/spinningup/rl_intro.html',
            note: 'State와 observation, return, V·Q·advantage와 Bellman의 구현 지향 정의를 대조했다.',
          },
          {
            label: '혁펜하임 · 트이는 강화 학습',
            href: 'https://www.youtube.com/playlist?list=PL_iJu012NOxehE8fdF9me4TLfbdv3ZW8g',
            note: '기술 근거가 아니라 국내 학습 경로에서 MDP·Bellman의 최소 범위를 점검하는 데 사용했다.',
          },
        ]}
      />
    </section>
  );
}

export default function RlMdpBellmanArticle() {
  return (
    <>
      <Interaction />
      <Mdp />
      <Return />
      <Value />
      <Bellman />
    </>
  );
}
