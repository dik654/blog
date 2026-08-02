import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl, Takeaway } from './nlp-shared';
import { WorldModelSequenceViz } from './rl-viz/RlAnimatedSequences';
import { DynaStalenessLab, DreamerReturnLab, MuZeroTargetTrace } from './rl-model-based-world-models/viz/WorldModelDecisionLabs';

function ModelBiasLab() {
  const [horizon, setHorizon] = useState(12);
  const [accelerationBias, setAccelerationBias] = useState(0.04);
  const positionError = 0.5 * accelerationBias * horizon * horizon;
  const oneStepError = 0.5 * accelerationBias;

  return (
    <figure data-model-bias className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"><span className="font-mono text-xs font-black text-rose-700 dark:text-rose-300">MODEL BIAS LAB</span><strong className="text-sm leading-snug">작은 dynamics bias를 여러 step 펼쳤을 때 위치 오차를 본다</strong><span className="font-mono text-xs font-black">Δx {positionError.toFixed(2)}m</span></figcaption>
      <div className="grid gap-5 border-b border-border bg-rose-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Planning horizon H · {horizon} step · Δt=1초<input aria-label="world model planning horizon" className="mt-3 block w-full accent-rose-700" type="range" min="1" max="40" step="1" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Step당 acceleration bias · {accelerationBias.toFixed(2)}m/s²<input aria-label="world model acceleration bias" className="mt-3 block w-full accent-rose-700" type="range" min="0" max="0.15" step="0.01" value={accelerationBias} onChange={(event) => setAccelerationBias(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="relative h-24 overflow-hidden rounded-md border border-border bg-muted/20">
          <div className="absolute left-4 right-4 top-1/2 h-px bg-border" />
          <div className="absolute left-4 top-[calc(50%-0.55rem)] h-4 w-4 rounded-full border-2 border-emerald-600 bg-background" title="실제 위치" />
          <div className="absolute top-[calc(50%-0.55rem)] h-4 w-4 rounded-full border-2 border-rose-600 bg-background transition-[left] duration-300" style={{ left: `min(calc(1rem + ${Math.min(90, positionError * 10)}%), calc(100% - 2rem))` }} title="Model 예측 위치" />
          <span className="absolute bottom-2 left-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">실제</span><span className="absolute bottom-2 right-4 text-xs font-semibold text-rose-700 dark:text-rose-300">예측 drift</span>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-4"><p className="text-xs text-muted-foreground">한 step 위치 오차</p><p data-model-one-step className="mt-1 font-mono text-xl font-black">{oneStepError.toFixed(3)}m</p></div><div className="bg-background p-4"><p className="text-xs text-muted-foreground">H-step 위치 오차</p><p data-model-horizon-error className="mt-1 font-mono text-xl font-black text-rose-700 dark:text-rose-300">{positionError.toFixed(2)}m</p></div><div className="bg-background p-4"><p className="text-xs text-muted-foreground">증폭 배율</p><p data-model-amplification className="mt-1 font-mono text-xl font-black">{oneStepError ? (positionError / oneStepError).toFixed(0) : '0'}x</p></div></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 교육용 계산은 한 model step을 1초로 둔다(Δt=1s). 이때 일정한 acceleration bias의 position error가 H²에 비례한다. 일반 neural world model의 보편적 error bound는 아니지만, one-step validation loss가 planning horizon의 closed-loop fidelity를 대체하지 못한다는 점을 보여준다.</p>
      </div>
    </figure>
  );
}

function ModelTargetMatrix() {
  const [selected, setSelected] = useState('world-models');
  const entries = {
    dyna: { title: 'Dyna', predicts: '관측 state의 next state와 reward', uses: '가상 transition에 동일 Q update', omits: '고차원 latent representation', risk: '틀린 model entry의 반복 backup' },
    'world-models': { title: 'World Models', predicts: 'Compressed next latent distribution', uses: 'z와 h로 작은 controller 학습', omits: 'Task reward를 world model이 직접 보지 않음', risk: 'Dream artifact를 controller가 exploit' },
    muzero: { title: 'MuZero', predicts: 'Search용 reward, policy와 value', uses: 'Learned latent 안에서 MCTS', omits: 'Observation reconstruction', risk: 'Planning target이 놓친 정보의 소실' },
    dreamer: { title: 'DreamerV3', predicts: 'Latent, reward, continue와 reconstruction', uses: 'Prior imagination으로 actor-critic 학습', omits: 'Action-time tree search', risk: 'Posterior와 prior rollout의 gap' },
  } as const;
  const current = entries[selected as keyof typeof entries];
  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border p-4"><SegmentedControl label="World-model 계보" options={[{ value: 'dyna', label: 'Dyna' }, { value: 'world-models', label: 'World Models' }, { value: 'muzero', label: 'MuZero' }, { value: 'dreamer', label: 'DreamerV3' }]} value={selected} onChange={setSelected} /></div>
      <div className="grid gap-px bg-border lg:grid-cols-[12rem_minmax(0,1fr)]"><div className="bg-violet-500/[0.045] p-5"><p className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">MODEL TARGET</p><p className="mt-3 text-2xl font-black">{current.title}</p></div><div className="grid gap-px bg-border sm:grid-cols-2"><div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">무엇을 예측하나</p><p className="mt-2 text-sm font-semibold leading-relaxed">{current.predicts}</p></div><div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">어떻게 policy에 쓰나</p><p className="mt-2 text-sm font-semibold leading-relaxed">{current.uses}</p></div><div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">의도적으로 생략한 것</p><p className="mt-2 text-sm leading-relaxed">{current.omits}</p></div><div className="bg-rose-500/[0.025] p-4"><p className="text-xs font-bold text-muted-foreground">대표 실패 경로</p><p className="mt-2 text-sm leading-relaxed">{current.risk}</p></div></div></div>
    </div>
  );
}

export default function RlModelBasedWorldModelsArticle() {
  return (
    <>
      <NlpSection id="model-contract" marker="01" tone="teal" question="실제로 움직이기 전에 머릿속에서 여러 선택의 결과를 비교할 수 있을까?" title="미래를 그리는 모형은 행동을 고르는 데 쓸 때 비로소 의미가 생긴다">
        <BeginnerOpening
          title="다음 한 걸음을 잘 맞히는 예측이 긴 길도 정확히 알려 줄까?"
          description={<>현재 상황과 행동을 넣었을 때 다음 상황과 점수를 예상하는 규칙을 <strong>환경 모형(environment model)</strong>이라고 한다. 이 모형 안에서 여러 행동을 미리 시험해 고르는 일을 <strong>계획(planning)</strong>이라고 한다. 실제 세계를 덜 움직이고도 후보를 비교할 수 있지만, 예측이 틀리면 계획은 그 오류까지 이용한다.</>}
          familiarScene={<>지도가 교차로 하나 뒤의 길은 거의 정확히 맞히지만, 매 교차로에서 오른쪽으로 1m씩 위치를 잘못 표시한다고 하자. 한 구간만 비교하면 작은 오차다. 그러나 그 지도를 열 번 이어 보고 지름길을 고르면 실제로는 막힌 길에 도착할 수 있다.</>}
          steps={[
            { label: '다음 결과를 예측한다', detail: '현재 상황에서 한 행동 뒤에 무엇이 달라질지 맞힌다.' },
            { label: '예측을 여러 번 이어 본다', detail: '아직 실행하지 않은 행동 순서들을 모형 안에서 비교한다.' },
            { label: '현실의 결과와 다시 맞춘다', detail: '긴 예측과 실제 성공의 차이를 재고 모형이 악용된 곳을 찾는다.' },
          ]}
        />
        <QuestionLead label="이제 확인할 질문" question="다음 한 장면을 평균적으로 잘 맞히는 예측기라면, 그 예측을 여러 번 이어 만든 긴 계획도 믿어도 될까?" answer="그렇지 않다. 작은 한 단계 오차도 여러 번 이어지면 커질 수 있고, 행동을 고르는 규칙은 평균적인 장면보다 예측기가 가장 크게 틀린 지름길을 찾아낼 수 있다. 한 단계 점수뿐 아니라 긴 예측, 실제로 방문할 상황, 종료 사건과 현실에서 얻은 최종 결과를 따로 검증해야 한다." />
        <ConceptPrimer items={[{ term: 'Environment model', meaning: 'State와 action에서 next state·reward 또는 planning target을 예측한다.', why: 'Value model과 실제 dynamics model을 구분한다.' }, { term: 'MPC · Model Predictive Control', meaning: '매 step마다 model 안에서 여러 action sequence를 다시 비교하고 첫 action 하나만 실제로 실행한다.', why: 'MuZero류 action-time search와, rollout을 학습 data로 쓰는 Dyna·Dreamer의 training-time imagination을 구분한다.' }, { term: 'Planning', meaning: 'Model 안에서 candidate action의 결과를 비교해 현재 선택을 개선한다.', why: 'Model을 학습만 하고 사용하지 않는 representation learning과 구분한다.' }, { term: 'Imagination', meaning: 'Learned model이 만든 latent transition으로 value나 policy를 학습한다.', why: 'Real experience와 generated experience의 출처를 추적한다.' }, { term: 'Model bias', meaning: '예측 오차가 rollout과 policy optimization을 통해 체계적으로 누적되는 현상이다.', why: 'Sample efficiency를 공짜 data 증가로 오해하지 않는다.' }]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Model-free method도 미래를 전혀 모델링하지 않는 것은 아니다. Q와 V는 future return을 예측한다. Model-based라는 구분은 action-conditioned transition structure를 명시적으로 만들고, 아직 실제로 실행하지 않은 action sequence를 그 structure 안에서 평가하는가에 있다.</p><p>Model target은 하나가 아니다. Classical model은 next state와 reward를 예측하고, World Models는 compressed observation dynamics를, MuZero는 planning에 필요한 reward·policy·value를, Dreamer는 stochastic latent와 reward·continue를 예측한다. 무엇을 생략했는지가 model의 inductive bias와 failure boundary를 결정한다.</p></div>
        <ModelTargetMatrix />
      </NlpSection>

      <NlpSection id="dyna" marker="02" tone="blue" question="실제 transition 한 번을 model 안에서 몇 번 더 학습에 사용할 수 있을까?" title="Dyna는 learning과 planning을 transition 출처의 차이로 통합한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Dyna-Q는 actual environment에서 transition 하나를 얻으면 세 일을 한다. 그 transition으로 Q를 직접 update하고, world model을 update하고, 이전에 본 state-action을 model에서 sample해 simulated transition을 만든 뒤 같은 Q update를 반복한다. Planning은 거대한 별도 solver가 아니라 <strong>model-generated experience에서 실행한 learning</strong>이다.</p><p>Planning update 수 n을 늘리면 정확한 model target도, 오래된 model target도 더 빨리 value에 새긴다. 아래 Lab은 벽이 이동한 직후 실제 transition 한 번이 Q를 5에서 4로 낮췄는데 model은 아직 옛 target 5를 반환하는 상황을 격리한다. “Model accuracy 90%” 같은 하나의 평균 숫자로는 이 방향성 있는 실패를 설명할 수 없다.</p></div>
        <DynaStalenessLab />
        <WorldModelSequenceViz />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{(\widehat r,\widehat s')}_{\text{계획용 가상 전이}}
&=\underbrace{M_\psi(s,a)}_{\text{모델 예측}}\\
\underbrace{M_\psi}_{\text{환경 모델}}
&\leftarrow\underbrace{\operatorname{fit}(s,a,r,s')}_{\text{실제 전이로 학습}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="실제 transition은 model의 training target이 되고, planning 때 model은 reward와 next state를 생성한다. Deterministic table에서는 마지막 결과를 저장할 수 있지만 stochastic world에서는 conditional distribution을 학습해야 한다." symbols={[[String.raw`M_\psi`, '학습한 environment model'], [String.raw`(r,s')`, '실제 환경에서 얻은 target'], [String.raw`(\widehat r,\widehat s')`, 'Planning에 사용할 generated transition']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{\widehat y}_{\text{모델 TD 목표}}
&=\underbrace{\widehat r}_{\text{예측 보상}}
+\underbrace{\gamma\max_{a'}Q(\widehat s',a')}_{\text{다음 상태 가치}}\\
\underbrace{Q(s,a)}_{\text{현재 행동 가치}}
&\leftarrow Q(s,a)+\underbrace{\alpha[\widehat y-Q(s,a)]}_{\text{가상 TD 갱신}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Direct Q-learning과 같은 backup이지만 model이 만든 reward와 next state를 먼저 TD 목표 ŷ로 묶었다. Planning compute는 이 model assumption을 반복 사용하는 횟수다." symbols={[[String.raw`\widehat y`, 'Model transition으로 만든 bootstrap target'], [String.raw`\alpha`, 'Simulated TD error를 반영할 비율'], [String.raw`Q(s,a)`, '실행 policy가 바로 참조할 action value']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{e_0}_{\text{초기 목표 오차}}&=Q^{(0)}-\widehat y\\
\underbrace{Q^{(n)}}_{\text{n회 뒤 가치}}
&=\underbrace{\widehat y}_{\text{모델 목표}}
+\underbrace{e_0(1-\alpha)^n}_{\text{남은 오차}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="같은 scalar target으로 n번 backup한 결과다. 초기 차이를 e₀로 묶으면 매 update 뒤 남은 오차가 (1-α)배씩 줄어드는 구조가 보인다. n이 커질수록 Q는 target에 빠르게 가까워지므로 planning budget은 정확성의 보증이 아니라 현재 model target에 대한 확신 증폭기다." symbols={[[String.raw`Q^{(0)}`, 'Planning 시작 전 value'], [String.raw`\widehat y`, 'Model이 계속 반환하는 target'], [String.raw`e_0`, 'Planning 시작 시 value와 model target의 차이'], [String.raw`n`, '같은 model assumption을 재사용한 횟수']]} />
        <Takeaway>환경이 바뀐 뒤에는 priority보다 먼저 model freshness를 묻는다. Prioritized sweeping은 중요한 predecessor를 빨리 고르지만, stale transition을 참으로 바꾸지는 않는다.</Takeaway>
      </NlpSection>

      <NlpSection id="model-bias" marker="03" tone="amber" question="One-step prediction이 좋아도 긴 plan이 틀릴 수 있는 이유는 무엇일까?" title="Policy는 model의 평균 오차가 아니라 가장 유리한 오차를 찾는다">
        <ModelBiasLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{\Delta x_H}_{\text{H-step 위치 오차}}
&=\frac12\underbrace{b}_{\text{가속도 편향}}\underbrace{H^2}_{\text{horizon 누적}}\\
\underbrace{\frac{\Delta x_H}{\Delta x_1}}_{\text{한 step 대비 증폭}}
&=\underbrace{H^2}_{\text{제곱 증가}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="한 model step의 시간 간격을 Δt=1초로 둔 교육용 동역학에서 일정한 acceleration bias b 때문에 position error가 horizon의 제곱으로 커지는 계산이다. 모든 neural world model의 보편적 bound가 아니라 one-step error와 rollout error가 다른 지표임을 보이는 반례다." symbols={[[String.raw`b`, '매 1초 step에 반복되는 acceleration bias, 단위 m/s²'], [String.raw`H`, 'Observation 없이 model을 펼친 step 수이며 여기서는 H초와 같음'], [String.raw`\Delta x_H`, 'H-step 뒤 누적 position error, 단위 m']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Supervised model은 replay distribution의 평균 prediction loss를 줄인다. Planner와 actor는 그 model 위에서 reward가 큰 action sequence를 최적화한다. 이 optimization은 model이 실제보다 acceleration을 크게 보거나 collision을 누락하는 작은 systematic error를 적극적으로 찾아낸다. 그래서 random validation sequence에서는 좋아 보이지만 optimized rollout에서만 무너질 수 있다.</p><p>세 가지 축을 분리해 측정해야 한다. 첫째, one-step likelihood나 reconstruction. 둘째, open-loop multi-step error를 horizon별로 측정한다. 셋째, model에서 최적화한 policy의 predicted return과 real return gap을 잰다. Ensemble disagreement, short horizon, real-data mixing, uncertainty penalty는 이 gap을 줄이는 도구이지 정확성 보장은 아니다.</p></div>
        <Misconception>Video가 그럴듯하게 복원된다고 control model이 정확한 것은 아니다. 작은 obstacle·contact·termination처럼 pixel 비중은 작지만 action 결과를 바꾸는 변수가 latent에서 빠질 수 있다.</Misconception>
      </NlpSection>

      <NlpSection id="world-models" marker="04" tone="violet" question="Pixel을 모두 복원하지 않고도 action에 필요한 공간·시간 정보를 만들 수 있을까?" title="World Models는 Vision·Memory·Controller의 target을 분리한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>V</strong>는 현재 frame x를 latent z로 압축한다. <strong>M</strong>은 action, z와 recurrent history h에서 다음 z의 조건부 분포를 예측한다. Stochastic future를 평균 frame 하나로 뭉개지 않도록 Mixture Density Network RNN(MDN-RNN, 혼합 밀도 순환 신경망)이 mixture distribution을 낸다. <strong>C</strong>는 decoded future image를 입력받지 않고 현재 z와 h만으로 action을 만든다.</p><p>CarRacing에서 z만 받은 controller와 z+h를 받은 controller를 비교한 이유도 여기 있다. z는 지금 보이는 장면이고 h는 곡선의 진행과 과거 action이 만든 시간 문맥이다. VizDoom에서는 M이 next latent뿐 아니라 done을 예측해야 비로소 dream이 RL environment interface를 갖는다. Dream return이 높아도 real return이 낮다면 controller가 M의 오류를 이용했을 수 있다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{z_t}_{\text{현재 latent}}
&\sim\underbrace{q_\phi(z_t\mid x_t)}_{\text{관측을 압축}}\\
\underbrace{z_{t+1}}_{\text{다음 latent}}
&\sim\underbrace{p_\psi(z_{t+1}\mid a_t,z_t,h_t)}_{\text{행동 조건 미래}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="World Models의 vision model이 observation을 z로 압축하고 memory model이 action·현재 latent·history에서 다음 latent distribution을 예측한다. Stochastic future를 하나의 평균 frame으로 뭉개지 않기 위해 mixture density를 사용한다." symbols={[[String.raw`x_t`, '현재 observation frame'], [String.raw`z_t`, 'Compressed visual latent'], [String.raw`h_t`, 'Temporal history를 담은 RNN state'], [String.raw`p_\psi`, 'Action-conditioned future latent distribution']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`
\underbrace{a_t}_{\text{실행 action}}
=\underbrace{W_c[z_t;h_t]+b_c}_{\text{장면과 기억을 결합}}
`}</MathFormula></div>
        <FormulaNote meaning="Controller는 현재 latent와 memory state를 이어 붙인 작은 linear policy다. Future latent를 직접 decode하거나 tree search하지 않아도 M의 history feature를 통해 반응할 수 있다." symbols={[[String.raw`[z_t;h_t]`, '현재 장면과 시간 문맥의 결합'], [String.raw`W_c,b_c`, '작은 controller의 학습 파라미터'], [String.raw`a_t`, '환경에 실제로 실행할 action']]} />
        <Misconception>Temperature를 높이면 model이 정확해지는 것이 아니다. 원 논문에서는 dream을 더 불확실하게 만들어 controller가 특정 artifact에 과적합하기 어렵게 한 것이며, real closed-loop 검증을 대신하지 않는다.</Misconception>
      </NlpSection>

      <NlpSection id="muzero" marker="05" tone="blue" question="사람이 알아볼 next observation을 만들지 않고도 tree search할 수 있을까?" title="MuZero는 search가 소비하는 reward·policy·value만 학습한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Representation h는 실제 observation history를 root latent s0로 바꾼다. Dynamics g는 hypothetical action 하나를 적용해 reward와 다음 latent를 만들고, prediction f는 그 node의 policy prior와 value를 낸다. Monte Carlo Tree Search(MCTS, 몬테카를로 트리 탐색)는 이 세 양을 사용해 promising branch에 simulation을 더 배분하고 visit count로 개선된 policy target을 만든다.</p><p>중요한 것은 target의 출처다. Reward target은 replay의 실제 reward, policy target은 당시 root에서 수행한 MCTS visit distribution, value target은 실제 reward와 bootstrap을 결합한 return이다. Latent s 자체에는 pixel 정답이 없다. 따라서 “현실처럼 보이는 latent”가 아니라 이 target들을 여러 unroll depth에서 보존하는지가 학습 계약이다.</p></div>
        <MuZeroTargetTrace />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{s^0}_{\text{root latent}}
&=\underbrace{h_\theta(o_{1:t})}_{\text{관측 이력을 표현}}\\
\underbrace{(r^k,s^k)}_{\text{가상 보상과 상태}}
&=\underbrace{g_\theta(s^{k-1},a^k)}_{\text{latent 전이}}\\
\underbrace{(p^k,v^k)}_{\text{탐색 prior와 가치}}
&=\underbrace{f_\theta(s^k)}_{\text{node 예측}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="MuZero의 세 network는 observation history를 root latent로 만들고, hypothetical action을 recurrent transition으로 펼친 뒤 각 node의 search prior와 value를 예측한다. Pixel reconstruction target은 없다." symbols={[[String.raw`h_\theta`, 'Root representation'], [String.raw`g_\theta`, 'Latent dynamics와 reward predictor'], [String.raw`f_\theta`, 'Policy·value predictor'], [String.raw`k`, 'Hypothetical search depth']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{d_{r,t}^k}_{\text{보상 오차}}&=\ell_r(u_{t+k},r_t^k)\\
\underbrace{d_{v,t}^k}_{\text{가치 오차}}&=\ell_v(z_{t+k},v_t^k)\\
\underbrace{d_{p,t}^k}_{\text{정책 오차}}&=\ell_p(\pi_{t+k},p_t^k)\\
\underbrace{\ell_t(\theta)}_{\text{전체 학습 손실}}
&=\underbrace{\sum_{k=0}^{K}(d_{r,t}^k+d_{v,t}^k+d_{p,t}^k)}_{\text{모든 depth의 예측 오차}}
+\underbrace{c\|\theta\|^2}_{\text{가중치 규제}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="각 hypothetical depth의 reward·value·policy 오차를 dᵏ로 짧게 나눈 뒤 모두 합쳐 학습한다. Target은 replay와 search에서 오며, 마지막 L2 항은 파라미터가 과도하게 커지는 것을 억제한다. Search simulation 수를 늘려도 깊은 latent dynamics가 target을 보존하지 못하면 성능은 자동으로 계속 오르지 않는다." symbols={[[String.raw`d_{r,t}^k,d_{v,t}^k,d_{p,t}^k`, 'Depth k의 reward·value·policy 예측 오차'], [String.raw`u_{t+k}`, '실제 환경 reward target'], [String.raw`z_{t+k}`, 'n-step return과 bootstrap으로 만든 value target'], [String.raw`\pi_{t+k}`, 'MCTS visit count로 만든 policy target'], [String.raw`K`, '학습할 recurrent unroll depth'], [String.raw`c\|\theta\|^2`, '과도한 parameter 크기를 억제하는 L2 regularization']]} />
        <Takeaway>MuZero가 “환경 dynamics를 배우지 않는다”는 뜻은 아니다. Pixel reconstruction 없이 planning에 필요한 dynamics만 학습하므로, reward·value·search target이 놓친 안전 변수도 latent에서 사라질 수 있다.</Takeaway>
      </NlpSection>

      <NlpSection id="dreamer" marker="06" tone="green" question="Tree search 없이 latent future를 policy 학습 data로 직접 사용할 수 있을까?" title="Dreamer는 posterior에서 출발해 prior imagination으로 actor와 critic을 학습한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>DreamerV3의 Recurrent State-Space Model(RSSM, 순환 상태공간 모델) state는 deterministic recurrent h와 stochastic z의 결합이다. Replay sequence를 읽을 때 encoder posterior q는 실제 observation x를 보고 현재 z를 추론한다. 하지만 actor 학습을 위한 미래에는 x가 없으므로 dynamics prior p만으로 다음 z를 만든다. Reconstruction이 좋아도 posterior와 prior의 rollout gap이 크면 imagination data는 틀릴 수 있다.</p><p>각 imagined state에서 actor가 action을 sample하고 world model의 reward head와 continue head가 결과를 낸다. Critic은 finite imagination horizon 밖을 bootstrap한 lambda-return distribution을 학습한다. Continue가 terminal을 놓치면 존재하지 않는 미래 reward가 value에 더해지고, reward가 틀리면 actor는 그 오류를 반복해서 이용한다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{h_t}_{\text{기억 상태}}
&=\underbrace{f_\phi(h_{t-1},z_{t-1},a_{t-1})}_{\text{action 이력 갱신}}\\
\underbrace{z_t}_{\text{관측 기반 latent}}
&\sim\underbrace{q_\phi(z_t\mid h_t,x_t)}_{\text{posterior 추론}}\\
\underbrace{\widehat z_t}_{\text{상상 latent}}
&\sim\underbrace{p_\phi(\widehat z_t\mid h_t)}_{\text{prior 예측}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Posterior q는 real observation을 보고 representation을 추론하고, prior p는 observation 없이 imagination state를 생성한다. 두 distribution의 KL과 stop-gradient 방향이 representation 학습과 dynamics 학습을 나눈다." symbols={[[String.raw`h_t`, 'Action history를 누적한 deterministic state'], [String.raw`z_t`, 'Observation-conditioned stochastic state'], [String.raw`\widehat z_t`, 'Prior가 예측한 imagined stochastic state']]} />
        <DreamerReturnLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{B_t^\lambda}_{\text{혼합 bootstrap}}
&=\underbrace{(1-\lambda)v_t}_{\text{짧은 가치 예측}}
+\underbrace{\lambda R_{t+1}^\lambda}_{\text{긴 미래 return}}\\
\underbrace{R_t^\lambda}_{\text{lambda-return}}
&=\underbrace{r_t}_{\text{상상 보상}}
+\underbrace{\gamma c_t B_t^\lambda}_{\text{계속될 때 미래 가치}}\\
\underbrace{R_T^\lambda}_{\text{horizon 끝}}
&=\underbrace{v_T}_{\text{critic으로 연결}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Bᵗ는 짧은 critic bootstrap과 더 긴 lambda-return을 먼저 섞은 중간 목표다. Imagined reward에 할인된 Bᵗ를 더하되 continue c가 predicted episode 종료 뒤의 미래를 차단하고, 마지막 horizon에서는 critic value로 연결한다. r_t와 v_t의 시점 표기는 DreamerV3 Nature 출판본을 그대로 따르며, 구현이 transition reward를 다음 state index에 붙이면 같은 재귀를 한 칸 이동해 표기할 수 있다." symbols={[[String.raw`B_t^\lambda`, '짧은 critic value와 긴 return을 섞은 bootstrap target'], [String.raw`r_t`, 'World model의 imagined reward'], [String.raw`c_t`, 'Predicted continuation'], [String.raw`v_t`, 'Critic의 value'], [String.raw`\lambda`, '짧은·긴 target 혼합 비율']]} />
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"><div className="bg-background p-4"><p className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-300">01</p><p className="mt-2 text-sm font-bold">Target audit</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Model이 state, pixel, reward, value 중 무엇을 맞추는지 쓴다.</p></div><div className="bg-background p-4"><p className="font-mono text-lg font-black text-sky-700 dark:text-sky-300">02</p><p className="mt-2 text-sm font-bold">Horizon audit</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">One-step과 optimized multi-step error를 분리한다.</p></div><div className="bg-background p-4"><p className="font-mono text-lg font-black text-violet-700 dark:text-violet-300">03</p><p className="mt-2 text-sm font-bold">Policy audit</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Predicted return과 real return gap을 측정한다.</p></div><div className="bg-background p-4"><p className="font-mono text-lg font-black text-rose-700 dark:text-rose-300">04</p><p className="mt-2 text-sm font-bold">Safety audit</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Rare terminal·contact가 latent와 data에 있는지 확인한다.</p></div></div>
        <CapabilityCheck items={['Model-free value prediction과 action-conditioned world model을 구분한다.', 'Dyna의 direct update와 planning update를 같은 backup의 data-source 차이로 구현한다.', '환경 변화 뒤 stale model target을 planning 횟수가 어떻게 증폭하는지 계산한다.', 'One-step validation loss, open-loop multi-step error와 optimized-policy real return gap을 별도 측정한다.', 'World Models의 V·M·C target과 controller input을 실행 순서로 설명한다.', 'MuZero의 depth별 reward·search-policy·value target 출처와 reconstruction 생략의 경계를 말한다.', 'Dreamer의 posterior anchor와 prior imagination을 구분하고 continue가 lambda-return을 끊는 지점을 계산한다.', 'Action-time search가 필요한 MPC·MuZero와 training-time imagination을 쓰는 Dyna·Dreamer 계열을 compute와 real feedback 기준으로 선택한다.']} />
        <LearningHandoff
          description="World model의 validation loss는 끝점이 아니다. Belief 표현, 현재 Physical AI 목표와 원문 보장 범위 중 지금 필요한 한 갈래만 연다."
          items={[
            { label: '막히면', slug: 'rl-pomdp-state-estimation', title: 'POMDP·Belief·State Estimation', reason: 'Latent state가 history의 충분한 statistic인지와 posterior uncertainty를 어떻게 검증하는지 복습한다.' },
            { label: '이어 읽기', slug: 'world-model-physical-ai', title: 'World Model과 Physical AI', reason: '현재 world-action model을 observation·action·rollout·closed-loop evidence 계약으로 다시 분해한다.' },
            { label: '이어 읽기', slug: 'rl-safe-constrained-learning', title: 'Safe & Constrained RL', reason: 'Model이 놓친 contact·terminal과 exploited bias를 safety critic coverage, runtime shield와 물리 제동 margin으로 다시 검증한다.' },
            { label: '원문으로', slug: 'paper-dreamerv3-2023', title: 'DreamerV3 재구성', reason: 'RSSM prior·posterior, imagination return과 broad-task evidence가 실제로 지지하는 범위를 확인한다.' },
          ]}
        />
        <SourceNotes sources={[{ label: 'Sutton · Integrated Architectures / Dyna', href: 'https://doi.org/10.1016/B978-1-55860-141-3.50030-4', note: 'Real learning, model learning과 incremental planning을 통합한 원 논문.' }, { label: 'Ha & Schmidhuber · World Models', href: 'https://worldmodels.github.io/', note: 'VAE·MDN-RNN·controller와 dream transfer 실험을 설명하는 저자 공식 interactive article.' }, { label: 'Schrittwieser et al. · MuZero', href: 'https://www.nature.com/articles/s41586-020-03051-4', note: 'Planning-relevant latent model, MCTS와 reward·policy·value target의 1차 출처.' }, { label: 'Hafner et al. · DreamerV3', href: 'https://www.nature.com/articles/s41586-025-08744-2', note: 'RSSM, imagination actor-critic, robustness ablation과 150+ task 범위의 출판본.' }]} />
      </NlpSection>
    </>
  );
}
