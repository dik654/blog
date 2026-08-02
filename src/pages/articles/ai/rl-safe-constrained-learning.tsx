import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { SafeRlSequenceViz } from './rl-viz/RlAnimatedSequences';
import { CpoLocalStepLab, LyapunovSlackLab, RecoveryTimingLab } from './rl-safe-constrained-learning/viz/SafeDecisionLabs';

function SafetyBudgetLab() {
  const [horizon, setHorizon] = useState(100);
  const [risk, setRisk] = useState(0.01);
  const [budget, setBudget] = useState(1);
  const expectedCount = horizon * risk;
  const anyViolation = 1 - (1 - risk) ** horizon;
  const feasible = expectedCount <= budget;

  return (
    <figure data-safety-budget className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-rose-700 dark:text-rose-300">SAFETY BUDGET LAB</span>
        <strong className="text-sm leading-snug">기대 비용 제약과 한 번이라도 사고 날 확률을 분리한다</strong>
        <span data-safety-budget-status className={`font-mono text-xs font-black ${feasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{feasible ? 'BUDGET OK' : 'OVER BUDGET'}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-rose-500/[0.035] p-4 sm:grid-cols-3">
        <label className="text-xs font-semibold text-muted-foreground">Horizon T · {horizon}<input aria-label="Safety horizon" className="mt-3 block w-full accent-rose-700" type="range" min="10" max="300" step="10" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Step violation p · {(risk * 100).toFixed(1)}%<input aria-label="Safety step violation probability" className="mt-3 block w-full accent-rose-700" type="range" min="0.001" max="0.05" step="0.001" value={risk} onChange={(event) => setRisk(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Expected-cost budget d · {budget.toFixed(1)}<input aria-label="Safety expected cost budget" className="mt-3 block w-full accent-rose-700" type="range" min="0.1" max="5" step="0.1" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">기대 violation 수</p><p data-safety-expected className="mt-1 font-mono text-2xl font-black">{expectedCount.toFixed(2)}</p></div>
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">한 번 이상 violation</p><p data-safety-any className="mt-1 font-mono text-2xl font-black text-rose-700 dark:text-rose-300">{(anyViolation * 100).toFixed(1)}%</p></div>
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">예산 여유 d - E[C]</p><p data-safety-margin className="mt-1 font-mono text-2xl font-black">{(budget - expectedCount).toFixed(2)}</p></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">독립적인 binary event라는 단순 계산이다. 같은 policy가 expected cost budget을 만족해도 개별 trajectory의 무사고를 보장하지 않는다. 충돌 확률, 최대 힘, joint limit처럼 요구사항의 단위가 다르면 expectation, chance constraint, worst-case bound를 구분해 써야 한다.</p>
      </div>
    </figure>
  );
}

function PenaltyTradeoffLab() {
  const [lambda, setLambda] = useState(4);
  const actions = [
    { name: '고속 통과', reward: 10, cost: 0.35 },
    { name: '감속 통과', reward: 6, cost: 0.04 },
    { name: '정지·재계획', reward: 1, cost: 0.005 },
  ].map((action) => ({ ...action, score: action.reward - lambda * action.cost }));
  const selected = [...actions].sort((left, right) => right.score - left.score)[0];

  return (
    <figure data-dual-pressure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">DUAL PRESSURE LAB</span>
        <strong className="text-sm leading-snug">위험의 가격 lambda가 행동 선택을 어떻게 바꾸는가</strong>
        <span className="font-mono text-xs font-black">lambda {lambda.toFixed(1)}</span>
      </figcaption>
      <div className="border-b border-border bg-amber-500/[0.035] p-4"><label className="text-xs font-semibold text-muted-foreground">Constraint multiplier lambda<input aria-label="Constraint multiplier lambda" className="mt-3 block w-full accent-amber-700" type="range" min="0" max="180" step="2" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} /></label></div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((action) => <div key={action.name} className={`min-w-0 rounded-md border p-4 ${selected.name === action.name ? 'border-amber-600/45 bg-amber-500/[0.055]' : 'border-border'}`}><p className="text-sm font-bold">{action.name}</p><p className="mt-2 text-xs text-muted-foreground">Reward {action.reward.toFixed(1)} · Cost {action.cost.toFixed(3)}</p><p className="mt-5 text-xs text-muted-foreground">R - lambda C</p><p className="mt-1 font-mono text-2xl font-black">{action.score.toFixed(2)}</p></div>)}
        </div>
        <p className="mt-4 text-sm leading-relaxed"><strong>현재 선택:</strong> <span data-dual-selected>{selected.name}</span>. lambda는 위험을 무시하는 0부터 task progress를 포기하는 값까지 행동 순위를 바꾼다. 고정 penalty는 원하는 budget을 자동으로 맞추지 않으며, primal-dual 방식은 실제 cost가 예산을 넘을 때 lambda를 올리는 별도 update가 필요하다.</p>
      </div>
    </figure>
  );
}

export default function RlSafeConstrainedLearningArticle() {
  return (
    <>
      <NlpSection id="safety-contract" marker="01" tone="teal" question="잘한 일에 점수를 주고 사고에 벌점을 주면 안전 규칙까지 지켜질까?" title="목표를 잘 이루는 것과 넘지 말아야 할 선을 지키는 것은 다른 문제다">
        <BeginnerOpening
          title="빨리 도착할수록 큰 점수를 주면 배달 로봇은 안전하게 달릴까?"
          description={<>학습하는 로봇이 더 크게 만들려는 성과 점수를 <strong>보상(reward)</strong>이라고 한다. 충돌 횟수, 사람에게 가한 힘, 모터 온도처럼 따로 제한할 위험 측정값은 <strong>안전 비용(safety cost)</strong>이다. 둘을 한 점수로 섞으면 로봇이 큰 성공 점수를 위해 사고 벌점을 감수할 수 있다.</>}
          familiarScene={<>배달을 1분 빨리 끝내면 1,000점을 받고 충돌하면 100점을 잃는 규칙을 생각해 보자. 로봇에게는 충돌하고도 900점이 남는다. 사람에게 “사고는 절대 내지 마”라는 규칙과 “사고가 나면 점수를 조금 깎아”라는 규칙은 같지 않다.</>}
          steps={[
            { label: '성과와 위험을 따로 잰다', detail: '도착 속도와 충돌·힘·온도를 서로 다른 단위로 기록한다.' },
            { label: '허용할 선을 먼저 정한다', detail: '평균 횟수인지, 한 번의 사고 확률인지, 절대 상한인지 구분한다.' },
            { label: '학습 밖의 차단 장치도 둔다', detail: '위험한 명령은 실행 직전에 막고 물리적인 정지 장치를 별도로 검증한다.' },
          ]}
        />
        <QuestionLead label="이제 확인할 질문" question="충돌할 때 큰 벌점을 주기만 하면 로봇이 충돌하지 않는다고 보장할 수 있을까?" answer="아니다. 벌점은 빠른 성공과 충돌을 서로 바꿀 수 있게 만든 하나의 가격이다. 성공 점수가 더 크면 학습된 행동 규칙은 충돌을 감수할 수 있다. 무엇을 위험으로 셀지, 어느 범위까지 허용할지, 평균을 제한할지 한 번의 사고도 막을지를 먼저 따로 정해야 한다." />
        <ConceptPrimer items={[{ term: 'Task reward r', meaning: '목표 도달, 속도, 품질처럼 더 크게 만들 성능 신호다.', why: '무엇을 잘하는가와 무엇을 하면 안 되는가를 분리한다.' }, { term: 'Constraint cost c_i', meaning: '충돌, 힘, 온도, joint limit 위반처럼 별도로 누적할 신호다.', why: '서로 단위가 다른 위험을 reward 하나에 숨기지 않는다.' }, { term: 'Budget d_i', meaning: 'Policy의 expected cumulative cost에 허용할 상한이다.', why: '안전 요구사항을 검증 가능한 수치로 만든다.' }, { term: 'Feasible policy', meaning: '모든 cost budget을 만족하는 policy다.', why: '높은 reward보다 먼저 후보 집합에 들어오는지 판정한다.' }]} />
        <SafetyBudgetLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\mathbb E[N]}_{\text{기대 위반 횟수}}&=\underbrace{Tp}_{\text{step 수 × step당 확률}}\\\underbrace{\Pr(N\ge1)}_{\text{한 번 이상 위반}}&=1-\underbrace{(1-p)^T}_{\text{끝까지 무사할 확률}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 T번의 독립적인 step에서 생길 violation 수의 평균이고, 둘째 줄은 모든 step이 무사할 확률을 1에서 빼 한 번 이상 위반할 확률을 구한다. 기대 횟수가 budget 안에 있어도 한 trajectory의 사고 확률은 클 수 있으며, 실제 robot에서는 시간 상관과 state 의존성을 별도로 모델링해야 한다." symbols={[[String.raw`N`, '한 trajectory에서 발생한 violation 횟수'], [String.raw`T`, '평가 horizon'], [String.raw`p`, '이 단순 예시의 step당 violation 확률'], [String.raw`\Pr(N\ge1)`, '한 번 이상 violation이 생길 확률']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\max_{\pi\in\Pi}J_R(\pi)}_{\text{허용 policy 중 return 최대화}}\\\text{s.t.}\quad\underbrace{J_{C_i}(\pi)\le d_i}_{\text{i번째 기대 cost가 budget 이하}},\quad i=1,\ldots,m\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 후보 policy 가운데 task return이 가장 큰 것을 찾고, 둘째 줄은 모든 safety cost의 기대 누적값이 각 budget 아래인 후보만 남긴다. 이 expected discounted cost 제약은 모든 trajectory의 무사고나 hardware-level 보호를 자동으로 뜻하지 않는다." symbols={[[String.raw`J_R(\pi)`, 'Policy의 expected task return'], [String.raw`J_{C_i}(\pi)`, 'i번째 safety cost의 expected cumulative return'], [String.raw`d_i`, 'i번째 cost budget'], [String.raw`\Pi`, '비교할 policy 집합']]} />
      </NlpSection>

      <NlpSection id="penalty-duality" marker="02" tone="amber" question="Reward와 cost를 결국 한 optimizer로 풀려면 둘을 어떻게 연결할까?" title="Lagrangian은 constraint 위반에 움직이는 가격을 붙인다">
        <PenaltyTradeoffLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{v_i(\pi)}_{\text{i번째 budget 초과량}}
&=J_{C_i}(\pi)-d_i\\
\underbrace{\mathcal L(\pi,\lambda)}_{\text{제약을 포함한 목적}}
&=\underbrace{J_R(\pi)}_{\text{task return}}
-\sum_{i=1}^{m}\underbrace{\lambda_i}_{\text{위험 가격}}v_i(\pi)\\
&\hspace{2.5em}\lambda_i\ge0
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 i번째 expected cost에서 budget을 빼 위반량 v_i를 만든다. 다음 줄은 policy가 키우려는 task return에서 각 위반량에 위험 가격 lambda를 곱한 값을 뺀다. Saddle point(안장점)는 policy는 이 식을 키우고 lambda는 줄이는 각자의 방향에서 더 움직여도 이득이 없는 균형점이다. 그 최종 균형의 feasibility와 학습 중 매 iterate의 safety는 다른 주장이다." symbols={[[String.raw`v_i(\pi)`, 'i번째 expected cost가 budget을 얼마나 넘었는지 나타내는 값'], [String.raw`\lambda_i`, 'i번째 위험 budget의 shadow price'], [String.raw`J_{C_i}-d_i`, '현재 expected constraint 위반량'], [String.raw`\mathcal L`, 'Reward와 제약을 결합한 Lagrangian objective']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>고정 penalty는 lambda를 사람이 한 번 정하고 끝낸다. 작으면 위험을 사고, 크면 robot이 멈추는 정책이 최적이 된다. Primal-dual은 cost measurement에 따라 lambda도 학습하지만 policy와 multiplier가 서로 늦게 따라가며 oscillation할 수 있다. 여기서 saddle point는 “학습 내내 안전했다”는 뜻이 아니라, 수렴한 policy와 위험 가격이 서로의 최적 반응과 만나는 지점이다. 평균 cost curve만 보면 중간 iteration의 큰 violation spike를 놓치므로 iteration별 reward, constraint return, lambda, violation count를 함께 그려야 한다.</p></div>
        <Misconception>“Constrained”라는 이름이 붙어도 제약의 종류와 보장 시점을 확인해야 한다. Expected cumulative cost, chance constraint, state-wise hard constraint, deployment-time action filter는 서로 대체할 수 없다.</Misconception>
      </NlpSection>

      <NlpSection id="cpo" marker="03" tone="blue" question="Policy가 한 번에 크게 바뀌며 안전 예산을 넘어가는 것을 update 단계에서 줄일 수 있을까?" title="CPO는 reward 개선, cost surrogate, trust region을 한 local problem으로 푼다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>CPO는 현재 policy에서 모은 trajectory로 reward advantage와 cost advantage를 각각 추정한다. Objective와 constraint는 parameter 주변에서 1차 근사하고, average KL은 <strong>Fisher matrix</strong>, 즉 policy 확률분포가 parameter 방향마다 얼마나 민감하게 변하는지를 담은 local curvature matrix로 2차 근사한다. 이렇게 얻은 문제는 선형 reward를 키우면서 선형 cost 경계와 이차 KL 경계를 지키는 <strong>QCQP(Quadratically Constrained Quadratic Program, 이차 제약이 있는 최적화 문제)</strong>다.</p><p>큰 Fisher matrix를 직접 만들고 역행렬로 풀지 않는다. <strong>Conjugate gradient</strong>는 matrix-vector product만 반복해 필요한 이동 방향을 근사하고, <strong>line search</strong>는 그 방향의 step 크기를 큰 값부터 줄여 가며 실제 sampled KL과 cost가 허용 범위인지 확인한 뒤 받아들인다. 이 근사와 finite sample 때문에 practical CPO가 뜻하는 것은 “매 순간 충돌 0”이 아니라 near-constraint satisfaction이다. 초기 policy가 feasible하지 않으면 reward 개선 대신 cost를 낮추는 recovery direction이 필요하다.</p></div>
        <CpoLocalStepLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\max_{\Delta\theta}g^\top\Delta\theta}_{\text{local reward 개선}}\\\text{s.t.}\quad\underbrace{c+b^\top\Delta\theta\le0}_{\text{cost 경계 안}}\\\underbrace{\tfrac12\Delta\theta^\top H\Delta\theta\le\delta}_{\text{trust region 안}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 현재 parameter 주변에서 reward가 가장 많이 늘어나는 이동을 찾는다. 둘째 줄은 linearized cost boundary를, 셋째 줄은 average KL로 근사한 trust-region ellipsoid를 넘지 않게 한다." symbols={[[String.raw`\Delta\theta`, '이번 iteration의 policy parameter 이동'], [String.raw`g`, 'Reward surrogate gradient'], [String.raw`c,b`, '현재 cost-budget 차이와 cost gradient'], [String.raw`H`, 'Average KL의 local curvature'], [String.raw`\delta`, '허용할 trust-region 크기']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{J_C(\pi_{k+1})}_{\text{새 policy의 실제 기대 cost}}&\le\underbrace{d}_{\text{목표 budget}}+\underbrace{\Delta_C}_{\text{남는 오차 상한}}\\\underbrace{\Delta_C}_{\text{cost 오차 크기}}&=\underbrace{\frac{\sqrt{2\delta}\,\gamma\,\epsilon_C^{\pi_{k+1}}}{(1-\gamma)^2}}_{\text{trust region·discount가 정한 크기}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 새 policy의 실제 expected cost가 목표 budget에 residual upper bound를 더한 값까지 갈 수 있음을 보인다. 둘째 줄은 그 잔여 오차가 trust-region 크기, discount와 cost-advantage scale에 의해 커지는 방식을 펼친다. Practical neural solve에는 sampling과 approximation error도 추가된다." symbols={[[String.raw`J_C(\pi_{k+1})`, '새 policy의 실제 expected constraint return'], [String.raw`d`, '목표 cost budget'], [String.raw`\Delta_C`, '이론적 분석에 남는 cost residual upper bound'], [String.raw`\delta`, 'Average KL trust-region 크기'], [String.raw`\epsilon_C^{\pi_{k+1}}`, 'State별 expected cost advantage의 최대 규모']]} />
        <Takeaway>CPO가 답하는 것은 “현재 policy 근처에서 expected cost budget을 덜 깨는 update”다. Sensor가 놓친 사람을 피하거나 motor torque를 물리적으로 제한하는 runtime safety layer까지 대신하지 않는다.</Takeaway>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>다음 원문:</strong> <a href="https://proceedings.mlr.press/v70/achiam17a.html" target="_blank" rel="noreferrer">Achiam et al. · Constrained Policy Optimization</a>에서 theorem의 return bound와 함께, conjugate gradient가 Fisher inverse 방향을 어떻게 근사하고 line search가 실제 KL·cost를 어떻게 재검사하는지 이어서 확인한다.</p></div>
      </NlpSection>

      <NlpSection id="lyapunov" marker="04" tone="violet" question="Episode 전체에서만 보이는 cost budget을 매 state의 action 선택으로 바꿀 수 있을까?" title="Lyapunov 함수는 전역 안전 예산을 지역 feasible set으로 내린다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Lyapunov-based safe RL은 constraint cost의 남은 상한을 state마다 들고 다니는 potential function L을 만든다. 현재 action 뒤의 immediate cost와 next-state L을 합친 값이 지금 L보다 커지지 않는 policy만 허용하면, Bellman operator의 반복을 통해 initial state의 cumulative cost도 budget 아래로 묶을 수 있다.</p><p>이 구조의 힘은 global property를 local linear constraint로 바꾸는 데 있다. 동시에 강한 전제가 있다. 시작점으로 쓸 feasible baseline policy가 필요하고, 원 논문의 이론은 transient CMDP와 bounded stopping time을 둔다. Function approximation의 value error가 작다는 실용 가정도 별도로 필요하다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
g_{\text{기준}}(s;L)&=\mathcal T_{\pi_B,C}[L](s)-L(s)\\
\mathcal L_{\pi_B}(s_0,d)&=\{L\ge0:\ g_{\text{기준}}(s;L)\le0,\\
&\hspace{5.7em}L(s_0)\le d\}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="집합의 첫 조건은 baseline policy로 한 step 진행해 immediate cost와 다음 L을 합쳐도 현재 L보다 커지지 않게 한다. 둘째 조건은 initial L을 total budget 아래에 두어 이 local inequality의 반복을 global expected cost bound로 연결한다." symbols={[[String.raw`\pi_B`, '이미 constraint를 만족하는 baseline policy'], [String.raw`\mathcal T_{\pi_B,C}`, 'Baseline의 immediate cost와 next L을 합치는 operator'], [String.raw`L(s)`, 'State별 cumulative cost upper bound'], [String.raw`s_0,d`, 'Initial state와 global cost budget']]} />
        <LyapunovSlackLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
g_{\pi}(s;L)&=\mathcal T_{\pi,C}[L](s)-L(s)\\
\mathcal F_L(s)&=\{\pi(\cdot\mid s):g_\pi(s;L)\le0\}\\
\text{전체 예산 조건}\quad L(s_0)&\le d
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 state s에서 immediate cost와 next L을 합친 Bellman backup이 현재 Lyapunov 상한을 넘지 않는 action distribution만 남긴다. 둘째 줄의 initial condition까지 만족하면 local inequality의 반복을 global expected cost bound로 연결할 수 있다." symbols={[[String.raw`L(s)`, 'State s에서 남아 있는 cumulative safety budget의 상한'], [String.raw`\mathcal T_{\pi,C}`, 'Immediate constraint cost와 next L을 합치는 Bellman operator'], [String.raw`\mathcal F_L(s)`, 'Local safety condition을 만족하는 policy 집합'], [String.raw`s_0,d`, 'Initial state와 전체 cost budget']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>다음 원문:</strong> <a href="https://papers.nips.cc/paper_files/paper/2018/hash/4fe5149039b52765bde64beb9f674940-Abstract.html" target="_blank" rel="noreferrer">Chow et al. · A Lyapunov-based Approach to Safe Reinforcement Learning</a>에서 feasible baseline과 local linear constraint가 global budget으로 이어지는 전제를 확인한다.</p></div>
      </NlpSection>

      <NlpSection id="recovery-shield" marker="05" tone="green" question="학습된 task policy가 배포 중 위험 행동을 제안하면 누가 실제 actuator command를 결정할까?" title="Recovery RL은 위험 예측과 실행 policy를 분리한다">
        <QuestionLead question="Task policy를 안전 objective로 함께 학습하는 것만으로 부족한 경우는?" answer="배포 순간에는 optimizer가 아니라 action 하나를 허용할지 가로챌지 결정해야 한다. Recovery RL은 offline violation data로 safety critic과 recovery policy를 먼저 학습하고, task action의 future risk가 threshold를 넘으면 recovery action을 실행한다." />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{Q_{\mathrm{risk}}^\pi(s_t,a_t)}_{\text{지금 행동 뒤의 누적 위험}}&=\underbrace{c_t}_{\text{현재 위반}}\\&\quad+\underbrace{(1-c_t)\gamma_{\mathrm{risk}}}_{\text{안전할 때 미래 위험 할인}}\\&\qquad\cdot\underbrace{\mathbb E_\pi\!\left[Q_{\mathrm{risk}}^\pi(s_{t+1},a_{t+1})\right]}_{\text{다음 step 이후 위험}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 항은 현재 state가 이미 violation인지 표시한다. 아직 안전할 때만 둘째·셋째 줄이 다음 state부터의 discounted violation risk를 bootstrap한다. 이 값은 true probability가 아니라 transition에서 학습한 critic estimate이므로 calibration과 coverage를 별도 검증해야 한다." symbols={[[String.raw`c_t\in\{0,1\}`, '현재 state의 constraint violation indicator'], [String.raw`\gamma_{\mathrm{risk}}`, '얼마나 먼 future violation까지 볼지 정하는 discount'], [String.raw`Q_{\mathrm{risk}}^\pi`, '현재 action 뒤의 discounted future violation risk']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{q_t}_{\text{task action의 예측 위험}}&=Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})\\\underbrace{a_t}_{\text{실제 실행 action}}&=\begin{cases}\underbrace{a_t^{\mathrm{task}}}_{\text{task 제안 실행}},&\underbrace{q_t\le\epsilon_{\mathrm{risk}}}_{\text{위험 한도 안}}\\\underbrace{a_t^{\mathrm{rec}}}_{\text{recovery로 교체}},&\underbrace{q_t>\epsilon_{\mathrm{risk}}}_{\text{위험 한도 초과}}\end{cases}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 줄은 task policy가 제안한 action의 future risk를 safety critic으로 계산한다. 둘째 줄은 그 값이 threshold 아래면 task action을 실행하고, 넘으면 recovery policy의 actuator command로 교체한다. Critic이 맞고 recovery action이 실제 risk를 줄일 때만 shield가 유효하다." symbols={[[String.raw`q_t`, 'Task action에 대해 safety critic이 예측한 risk'], [String.raw`a_t^{\mathrm{task}}`, 'Task reward를 위해 제안된 action'], [String.raw`a_t^{\mathrm{rec}}`, 'Safe region으로 돌아가려는 recovery action'], [String.raw`\epsilon_{\mathrm{risk}}`, 'Recovery를 활성화할 risk threshold']]} />
        <RecoveryTimingLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{m_{\mathrm{time}}}_{\text{충돌 전 남는 시간}}&=\underbrace{t_{\mathrm{TTC}}}_{\text{충돌까지 남은 시간}}\\&\quad-\underbrace{\left(t_{\mathrm{detect}}+t_{\mathrm{handoff}}+t_{\mathrm{brake}}\right)}_{\text{감지·전환·제동에 쓸 시간}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 항은 현재 상태에서 충돌까지 남았다고 추정한 시간이고, 괄호는 위험 감지부터 command 전환과 실제 제동까지 소비할 시간이다. 둘을 뺀 margin이 양수여야 충돌 전에 멈추며, risk score가 높아도 이 값이 음수이면 intervention은 늦다." symbols={[[String.raw`t_{\mathrm{TTC}}`, '현재 상태에서 추정한 time to collision'], [String.raw`t_{\mathrm{detect}}`, '센서·critic이 위험을 판정하는 시간'], [String.raw`t_{\mathrm{handoff}}`, 'Task에서 recovery command로 전환하는 시간'], [String.raw`t_{\mathrm{brake}}`, 'Actuator와 plant가 실제로 감속하는 시간'], [String.raw`m_{\mathrm{time}}`, '충돌 전 남는 timing margin']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Task policy는 실제로 실행된 recovery action이 아니라 자신이 제안한 action으로 transition을 relabel해, shield가 있는 modified dynamics에서 그 제안이 어떤 결과를 만들었는지 배운다. 이 relabeling을 빼면 같은 unsafe proposal을 반복할 수 있다. 원 논문의 ablation에서도 offline pretraining과 action relabeling이 핵심이었다.</p><p>Safety critic도 offline violation data의 support 밖에서는 위험을 낙관할 수 있다. 따라서 <InternalLink slug="rl-imitation-offline-learning">Offline RL의 dataset support·OPE·ESS 진단</InternalLink>을 그대로 적용해 risk threshold를 정해야 한다. Task action이 learned dynamics나 MPC에서 왔다면 <InternalLink slug="rl-model-based-world-models">World model의 multi-step bias와 policy exploitation 진단</InternalLink>도 필요하다. Planner와 safety critic이 같은 잘못된 model 또는 같은 누락 data를 공유하면 shield가 독립 방어층이 아니기 때문이다. 하지만 Recovery RL은 formal safety guarantee를 제시하지 않는다. 논문 부록의 failure breakdown에서는 많은 violation 때 recovery가 이미 활성화되어 있었다. 즉 risk detector가 경고했어도 recovery controller가 물리적으로 멈추지 못할 수 있다. Detection latency, braking distance, actuator saturation까지 포함한 control envelope가 필요하다.</p></div>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>다음 원문:</strong> <a href="https://arxiv.org/abs/2010.15920" target="_blank" rel="noreferrer">Thananjeyan et al. · Recovery RL</a>의 offline data 구성, action relabeling ablation과 failure breakdown을 함께 읽어 detector와 controller 실패를 분리한다.</p></div>
      </NlpSection>

      <NlpSection id="deployment-case" marker="06" tone="teal" question="논문 알고리즘을 실제 robot의 safety case로 옮길 때 무엇을 추가해야 할까?" title="학습 안전, 실행 안전, hardware 안전을 서로 다른 증거로 검증한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>앞의 방법은 서로 경쟁하는 단일 답이 아니다. CMDP는 측정 단위, CPO와 Lyapunov는 optimization-time update, Recovery RL은 proposed action의 runtime gate를 맡는다. 마지막 actuator command에는 learned policy와 독립적인 speed·force limit, watchdog와 emergency stop이 다시 붙어야 한다.</p></div>
        <SafeRlSequenceViz />
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
          <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">TRAINING</p><p className="mt-2 text-sm font-semibold">Reward와 cost curve를 분리한다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Seed별 budget 위반, lambda, intervention, recovery success를 iteration 축으로 남긴다.</p></div>
          <div className="bg-blue-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">RUNTIME</p><p className="mt-2 text-sm font-semibold">Action gate와 uncertainty를 기록한다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">False negative, false positive, time-to-collision, braking margin과 policy handoff latency를 본다.</p></div>
          <div className="bg-rose-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">HARDWARE</p><p className="mt-2 text-sm font-semibold">Learned policy 밖의 독립 제한을 둔다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Joint·speed·force limit, collision monitor, watchdog와 emergency stop은 별도 경로로 작동한다.</p></div>
        </div>
        <CapabilityCheck items={['Reward와 constraint cost를 단위·집계 방식·허용 budget까지 분리해 정의한다.', 'Expected cost budget을 만족해도 한 trajectory의 사고 확률이 클 수 있는 반례를 계산한다.', 'Fixed penalty와 learned Lagrange multiplier가 다른 이유를 설명한다.', 'CPO의 QCQP에서 reward gradient, 선형 cost boundary와 이차 KL ellipsoid를 구분하고 conjugate gradient·line search의 역할을 설명한다.', 'Feasible baseline이 CPO와 Lyapunov 접근에서 왜 중요한지 진단한다.', 'Safety critic의 calibration error와 recovery controller failure를 별도 failure로 분리한다.', 'Robot deployment에서 training constraint, runtime shield와 hardware interlock을 중복 방어층으로 설계한다.']} />
        <LearningHandoff
          description="Expected constraint, policy update와 runtime shield는 full safety case의 일부다. 수학적 update, data coverage와 물리 release 중 현재 남은 증거만 연다."
          items={[
            { label: '막히면', slug: 'rl-ppo-continuous-control', title: 'PPO와 Continuous Control', reason: 'Policy ratio, KL trust region, GAE와 continuous actuator policy의 update 계약을 먼저 복습한다.' },
            { label: '막히면', slug: 'rl-imitation-offline-learning', title: 'Imitation & Offline RL', reason: 'Offline safety critic의 support, OOD optimism과 off-policy evaluation 한계를 검산한다.' },
            { label: '원문으로', slug: 'paper-cpo-2017', title: 'Constrained Policy Optimization 재구성', reason: 'Local surrogate와 실제 expected-cost bound 사이에 남는 가정과 근사 오차를 확인한다.' },
            { label: '적용하기', slug: 'robot-system-verification-validation-qualification', title: 'Robot System Verification & Qualification', reason: 'Training·runtime·hardware 증거를 hazard, fault fixture와 release case로 통합한다.' },
          ]}
        />
        <SourceNotes sources={[{ label: 'Altman · Constrained Markov Decision Processes', href: 'https://www.routledge.com/Constrained-Markov-Decision-Processes/Altman/p/book/9781315140223', note: 'MDP에 expected cumulative cost constraint를 추가하는 수학적 기반.' }, { label: 'Achiam et al. · Constrained Policy Optimization', href: 'https://proceedings.mlr.press/v70/achiam17a.html', note: 'Trust region policy update, cost surrogate와 근사 constraint 보장의 1차 출처.' }, { label: 'Chow et al. · Lyapunov Safe RL', href: 'https://papers.nips.cc/paper_files/paper/2018/hash/4fe5149039b52765bde64beb9f674940-Abstract.html', note: 'Global cost budget을 local linear constraint로 바꾸는 방법과 전제의 1차 출처.' }, { label: 'Thananjeyan et al. · Recovery RL', href: 'https://arxiv.org/abs/2010.15920', note: 'Offline safety critic, dual policy, action relabeling과 physical robot evidence의 1차 출처.' }, { label: 'Ray et al. · Safety Gym', href: 'https://openai.com/index/benchmarking-safe-exploration-in-deep-reinforcement-learning/', note: 'Constrained RL을 training-time safe exploration benchmark로 비교하고 reward와 cost를 함께 보고한 1차 출처.' }]} />
      </NlpSection>
    </>
  );
}
