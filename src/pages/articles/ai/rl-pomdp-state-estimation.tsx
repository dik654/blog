import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { PomdpBeliefSequenceViz } from './rl-viz/RlAnimatedSequences';
import { ActiveSensingLab } from './rl-pomdp-state-estimation/viz/PomdpDecisionLabs';

function BeliefUpdateLab() {
  const [priorBlocked, setPriorBlocked] = useState(0.5);
  const [accuracy, setAccuracy] = useState(0.85);
  const [observation, setObservation] = useState<'blocked' | 'clear'>('blocked');
  const [action, setAction] = useState<'hold' | 'move'>('hold');
  const transitionBlockedFromBlocked = action === 'hold' ? 0.9 : 0.65;
  const transitionBlockedFromClear = action === 'hold' ? 0.1 : 0.35;
  const predictedBlocked =
    priorBlocked * transitionBlockedFromBlocked +
    (1 - priorBlocked) * transitionBlockedFromClear;
  const likelihoodBlocked = observation === 'blocked' ? accuracy : 1 - accuracy;
  const likelihoodClear = observation === 'clear' ? accuracy : 1 - accuracy;
  const massBlocked = predictedBlocked * likelihoodBlocked;
  const massClear = (1 - predictedBlocked) * likelihoodClear;
  const evidence = massBlocked + massClear;
  const posteriorBlocked = massBlocked / evidence;

  const bars = [
    { label: 'Prior · 막힘', value: priorBlocked, tone: 'bg-sky-600' },
    { label: 'Action 뒤 predicted prior', value: predictedBlocked, tone: 'bg-cyan-600' },
    { label: 'Likelihood 반영 mass', value: massBlocked, tone: 'bg-violet-600' },
    { label: 'Posterior · 막힘', value: posteriorBlocked, tone: 'bg-emerald-600' },
  ];

  return (
    <figure data-belief-filter className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">BELIEF UPDATE LAB</span>
        <strong className="text-sm leading-snug">같은 sensor 신호도 prior와 신뢰도에 따라 다른 posterior가 된다</strong>
        <span data-belief-posterior className="font-mono text-xs font-black">P(blocked) {(posteriorBlocked * 100).toFixed(1)}%</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-emerald-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Prior P(blocked) · {(priorBlocked * 100).toFixed(0)}%<input aria-label="Belief prior blocked" className="mt-3 block w-full accent-emerald-700" type="range" min="0.05" max="0.95" step="0.05" value={priorBlocked} onChange={(event) => setPriorBlocked(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Sensor accuracy · {(accuracy * 100).toFixed(0)}%<input aria-label="Belief sensor accuracy" className="mt-3 block w-full accent-emerald-700" type="range" min="0.5" max="0.99" step="0.01" value={accuracy} onChange={(event) => setAccuracy(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-3 border-b border-border px-4 py-3 sm:grid-cols-2">
        <div className="inline-grid grid-cols-2 rounded-md border border-border p-1" role="group" aria-label="transition action">
          {(['hold', 'move'] as const).map((value) => <button key={value} type="button" aria-pressed={action === value} onClick={() => setAction(value)} className={`min-h-9 px-4 text-xs font-bold transition-colors ${action === value ? 'rounded-sm bg-foreground text-background' : 'text-muted-foreground hover:bg-muted/40'}`}>{value === 'hold' ? '정지 · 안정 전이' : '이동 · slip 전이'}</button>)}
        </div>
        <div className="inline-grid grid-cols-2 rounded-md border border-border p-1" role="group" aria-label="관측 선택">
          {(['blocked', 'clear'] as const).map((value) => <button key={value} type="button" aria-pressed={observation === value} onClick={() => setObservation(value)} className={`min-h-9 px-4 text-xs font-bold transition-colors ${observation === value ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted/40'}`}>{value === 'blocked' ? '막힘 신호 관측' : '비어 있음 관측'}</button>)}
        </div>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="space-y-4">
          {bars.map((bar) => <div key={bar.label}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{bar.label}</span><span className="font-mono font-black">{(bar.value * 100).toFixed(1)}%</span></div><div className="h-2.5 overflow-hidden bg-muted"><div className={`h-full ${bar.tone} transition-[width] duration-200`} style={{ width: `${bar.value * 100}%` }} /></div></div>)}
        </div>
        <div className="grid content-start gap-px overflow-hidden border border-border bg-border">
          <div className="bg-background p-4"><p className="text-[11px] font-semibold text-muted-foreground">Predicted P(blocked)</p><p data-belief-predicted className="mt-1 font-mono text-xl font-black">{predictedBlocked.toFixed(3)}</p></div>
          <div className="bg-background p-4"><p className="text-[11px] font-semibold text-muted-foreground">정규화 상수 Zₜ₊₁ = P(oₜ₊₁ | bₜ,aₜ)</p><p data-belief-evidence className="mt-1 font-mono text-xl font-black">{evidence.toFixed(3)}</p></div>
          <div className="bg-background p-4"><p className="text-[11px] font-semibold text-muted-foreground">Posterior · clear</p><p className="mt-1 font-mono text-xl font-black">{((1 - posteriorBlocked) * 100).toFixed(1)}%</p></div>
        </div>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">첫 단계는 action-conditioned transition으로 prior mass를 이동하고, 둘째 단계는 observation likelihood를 곱한 뒤 정규화 상수 Zₜ₊₁로 나눈다. 이 Zₜ₊₁가 바로 현재 belief와 action 아래에서 실제 observation이 나올 확률 P(oₜ₊₁ | bₜ,aₜ)다. Sensor accuracy가 50%에 가까우면 correction은 predicted prior를 거의 바꾸지 않는다.</p>
    </figure>
  );
}

function KalmanTrustLab() {
  const [processVariance, setProcessVariance] = useState(1);
  const [measurementVariance, setMeasurementVariance] = useState(1);
  const predicted = 4;
  const measurement = 6;
  const previousVariance = 1;
  const predictedVariance = previousVariance + processVariance;
  const gain = predictedVariance / (predictedVariance + measurementVariance);
  const posterior = predicted + gain * (measurement - predicted);
  const posteriorVariance = (1 - gain) * predictedVariance;
  return (
    <figure data-kalman-trust className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">KALMAN TRUST LAB</span>
        <strong className="text-sm leading-snug">Model prediction 4.0과 sensor measurement 6.0 사이의 신뢰를 배분한다</strong>
        <span data-kalman-gain className="font-mono text-xs font-black">K {gain.toFixed(3)}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-sky-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Process variance Q · {processVariance.toFixed(1)}<input aria-label="Kalman process variance Q" className="mt-3 block w-full accent-sky-700" type="range" min="0.1" max="4" step="0.1" value={processVariance} onChange={(event) => setProcessVariance(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Sensor variance R · {measurementVariance.toFixed(1)}<input aria-label="Kalman sensor variance R" className="mt-3 block w-full accent-sky-700" type="range" min="0.1" max="10" step="0.1" value={measurementVariance} onChange={(event) => setMeasurementVariance(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Prediction</p><p className="mt-1 font-mono text-2xl font-black">4.00</p></div>
        <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Measurement</p><p className="mt-1 font-mono text-2xl font-black">6.00</p></div>
        <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Predicted variance P-</p><p data-kalman-predicted-variance className="mt-1 font-mono text-2xl font-black">{predictedVariance.toFixed(2)}</p></div>
        <div className="bg-sky-500/[0.04] p-4"><p className="text-xs text-muted-foreground">Corrected state</p><p data-kalman-posterior className="mt-1 font-mono text-2xl font-black text-sky-700 dark:text-sky-300">{posterior.toFixed(2)}</p></div>
        <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Posterior variance</p><p data-kalman-posterior-variance className="mt-1 font-mono text-2xl font-black">{posteriorVariance.toFixed(2)}</p></div>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">이 scalar slice는 이전 covariance 1.0에 process noise Q를 더해 P-를 만든다. P-가 R보다 크면 sensor 쪽으로 크게 이동하고, R이 크면 sensor를 덜 믿는다. Q와 R은 smoothing knob가 아니라 process residual과 measurement residual로 검증해야 한다.</p>
    </figure>
  );
}

export default function RlPomdpStateEstimationArticle() {
  return (
    <>
      <NlpSection id="observation-state" marker="01" tone="teal" question="지금 보이는 화면만으로 다음 행동을 항상 고를 수 있을까?" title="센서가 보여 준 장면과 실제 세계는 다를 수 있다">
        <BeginnerOpening
          title="같은 사진도 지나온 길이 다르면 뜻이 달라질 수 있다"
          description={<>로봇이 실제로 놓인 위치·속도·주변 물체를 <strong>state</strong>라고 하고, 카메라나 센서가 그중 일부를 보여 준 값을 <strong>observation</strong>이라고 한다. observation을 보고 행동을 고르는 규칙이 policy다. 센서는 실제 세계 전체가 아니라 흔적만 보여 줄 수 있다.</>}
          familiarScene={<>모양이 똑같은 두 복도에 서 있지만 한 곳에서는 왼쪽, 다른 곳에서는 오른쪽으로 돌아야 한다고 하자. 현재 사진만 보면 둘을 구분할 수 없다. 조금 전에 어느 문을 지나왔는지와 어느 방향으로 움직였는지를 함께 기억해야 지금 위치를 추정할 수 있다.</>}
          steps={[
            { label: '센서 장면을 받는다', detail: '카메라 한 장은 observation이며 실제 위치 전체는 아닐 수 있다.' },
            { label: '지나온 단서를 모은다', detail: '이전 관측과 행동을 합쳐 가능한 현재 state들을 좁힌다.' },
            { label: '불확실성까지 행동에 넘긴다', detail: '한 위치로 단정하지 않고 각 가능성의 믿음을 비교한다.' },
          ]}
        />
        <QuestionLead question="똑같이 보이는 두 복도에서 반대 방향으로 돌아야 한다면 현재 frame만 보는 policy가 해결할 수 있을까?" answer="일반적으로 불가능하다. 같은 observation o_t가 서로 다른 latent state s_t에서 나오는 perceptual aliasing이기 때문이다. 올바른 행동을 정하려면 이전 관측, 이전 행동, dynamics와 sensor reliability를 함께 써서 지금 어디에 있을 가능성이 큰지 추론해야 한다." />
        <ConceptPrimer items={[{ term: 'Latent state s_t', meaning: '미래 transition과 reward를 예측하기 충분하지만 agent가 직접 보지 못할 수 있는 world 변수다.', why: 'Position·velocity·object identity·friction처럼 decision에 필요한 숨은 원인을 포함한다.' }, { term: 'Observation o_t', meaning: 'Camera, LiDAR, encoder가 state에서 생성한 noisy measurement다.', why: 'Sensor output을 true state로 오인하는 modeling error를 막는다.' }, { term: 'History h_t', meaning: '지금까지의 observation과 action을 시간 순서로 모은 정보다.', why: '현재 observation에서 사라진 velocity와 location을 복원할 evidence다.' }, { term: 'Belief b_t', meaning: 'History를 본 뒤 각 latent state일 posterior probability다.', why: '가장 가능성 높은 state 하나가 아니라 불확실성까지 action에 전달한다.' }]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
\underbrace{s_t}_{\text{숨은 실제 상태}}&\not\equiv\underbrace{o_t}_{\text{센서 관측}}\\
\underbrace{h_t}_{\text{누적 이력}}&=(o_1,a_1,o_2,a_2,\ldots,o_t)
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Latent state와 observation은 같은 객체가 아니다. Agent가 실제로 가진 것은 action-observation history이며, state estimator는 이 history에서 의사결정에 충분한 표현을 만들어야 한다." symbols={[[String.raw`s_t`, '미래를 결정하지만 직접 보이지 않을 수 있는 world state'], [String.raw`o_t`, '시점 t의 sensor observation'], [String.raw`h_t`, '현재까지의 action-observation history']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Markov property가 깨졌다는 말은 environment가 기억을 가진다는 뜻만이 아니다. Agent input이 미래를 예측하기에 불충분해도 같은 증상이 난다. 한 image에는 방향이 없고, encoder tick 하나에는 wheel slip이 없으며, object detector box에는 가려진 사람의 진행 속도가 없다. 이때 PPO를 SAC로 바꾸거나 learning rate를 줄여도 state alias는 남는다.</p><p>이 진단은 <InternalLink slug="rl-mdp-bellman">MDP 글의 Markov 충분성 반례</InternalLink>, 즉 현재 observation은 같지만 history가 다른 두 sample에서 다음 결과가 달라지는 검사를 그대로 이어받는다. 검사가 실패하면 현재 observation은 state가 아니다. Frame stack, filter, recurrent memory 중 무엇을 쓸지는 필요한 memory horizon과 uncertainty shape를 본 다음 결정한다.</p></div>
      </NlpSection>

      <NlpSection id="pomdp-contract" marker="02" tone="blue" question="부분 관측 문제를 학습 알고리즘 전에 어떤 변수로 고정해야 할까?" title="POMDP는 latent dynamics와 observation emission을 분리한다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-base">{String.raw`\begin{aligned}
\mathcal P=\big\langle&
\underbrace{\mathcal S,\mathcal A,T,R}_{\text{상태·행동·전이·보상}},\\
&\underbrace{\Omega,O}_{\text{관측 공간·관측 모형}},\\
&\underbrace{\gamma,b_0}_{\text{할인율·초기 믿음}}
\big\rangle
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="MDP의 state·action·transition·reward에 observation space와 observation likelihood를 추가한다. Initial belief까지 명시해야 첫 sensor evidence를 어떤 prior에서 해석할지 결정할 수 있다." symbols={[[String.raw`T(s,a,s')`, 'Latent state transition probability'], [String.raw`O(s',a,o)`, 'Next state가 observation o를 낼 likelihood'], [String.raw`\Omega`, '가능한 observation의 공간'], [String.raw`b_0`, 'Episode 시작 latent state의 prior belief']]} />
        <PomdpBeliefSequenceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>POMDP의 핵심은 history를 network에 넣는다는 문장이 아니라 생성 순서다. True state에서 action을 실행하면 transition T가 next state를 만들고, 그 state가 observation model O를 통해 sensor reading을 낸다. Reward는 true state와 action의 결과에 붙지만 agent는 observation과 reward만 받는다.</p><p>이 분리는 failure attribution을 가능하게 한다. 같은 action에서 실제 motion이 달라지면 T 또는 process noise 문제다. 실제 state는 같은데 camera reading이 달라지면 O 또는 sensor calibration 문제다. Posterior는 타당한데 action이 틀리면 policy 문제다. 이 세 층을 end-to-end loss 하나로만 기록하면 estimator drift를 policy update 문제로 오진한다.</p></div>
        <Misconception>Observation space가 크다고 state가 풍부한 것은 아니다. 4K image도 가려진 물체의 위치나 한 frame의 velocity를 직접 담지 못한다. 반대로 작은 mean·covariance vector가 올바른 model 아래에서는 긴 raw history보다 decision에 충분할 수 있다.</Misconception>
      </NlpSection>

      <NlpSection id="belief-update" marker="03" tone="violet" question="긴 history를 매 step 전부 다시 읽지 않고도 같은 정보를 보존할 수 있을까?" title="Belief update는 예측, 관측 보정, 정규화의 세 연산이다">
        <BeliefUpdateLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\begin{aligned}
\underbrace{\bar b_{t+1}(s')}_{\text{관측 전 믿음}}
&=\sum_s T(s,a_t,s')b_t(s)\\
\underbrace{m_{t+1}(s')}_{\text{관측을 반영한 질량}}
&=O(s',a_t,o_{t+1})\bar b_{t+1}(s')\\
\underbrace{Z_{t+1}}_{\text{관측 전체 확률}}
&=\sum_{s'}m_{t+1}(s')\\
\underbrace{b_{t+1}(s')}_{\text{정규화된 믿음}}
&=\frac{m_{t+1}(s')}{Z_{t+1}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="첫 식은 action과 dynamics로 이전 posterior를 next-state prior에 전파한다. 둘째 식은 observation likelihood로 state별 mass를 다시 가중한다. 마지막 식은 전체 evidence Z로 나눠 posterior 합을 1로 만든다." symbols={[[String.raw`\bar b_{t+1}`, 'Observation을 보기 전 predicted belief'], [String.raw`m_{t+1}`, 'Likelihood를 곱했지만 아직 정규화하지 않은 state mass'], [String.raw`Z_{t+1}`, '가능한 모든 state mass를 합한 observation evidence이며, Viz의 P(o)와 같은 P(o_{t+1}|b_t,a_t)'], [String.raw`b_{t+1}`, 'Observation까지 반영한 normalized posterior']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Belief는 maximum-probability state 하나가 아니다. 막힘 0.51, 비어 있음 0.49와 막힘 0.99, 비어 있음 0.01은 MAP state가 같지만 행동은 달라야 한다. 첫 경우에는 센서를 한 번 더 보거나 속도를 줄이는 것이 가치 있고, 둘째 경우에는 우회 비용을 감수할 근거가 충분하다.</p><p>Model이 known일 때 normalized belief는 history의 sufficient statistic이다. 하지만 충분하다는 말은 작다는 뜻이 아니다. Discrete state가 N개면 belief는 N개 probability를 가지며, continuous nonlinear world에서는 posterior가 multi-modal function이 될 수 있다. Exact filter가 불가능하면 Gaussian approximation, particle set, learned recurrent state를 쓰되 무엇을 버렸는지 기록해야 한다.</p></div>
      </NlpSection>

      <NlpSection id="belief-control" marker="04" tone="amber" question="즉시 목표에 가까워지지 않는 sensing action도 optimal할 수 있는 이유는 무엇일까?" title="Belief policy는 world를 바꾸는 행동과 정보를 얻는 행동을 같은 미래 가치로 비교한다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\begin{aligned}
\underbrace{r(b,a)}_{\text{지금 기대 보상}}
&=\sum_s b(s)R(s,a)\\
\underbrace{F^*(b,a)}_{\text{관측 뒤 기대 미래가치}}
&=\sum_oP(o\mid b,a)V^*(\tau(b,a,o))\\
\underbrace{Q^*(b,a)}_{\text{지금과 미래의 총가치}}
&=r(b,a)+\gamma F^*(b,a)\\
\underbrace{\pi^*(b)}_{\text{믿음별 최선 행동}}
&=\arg\max_a Q^*(b,a)
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Current belief에서 immediate expected reward를 얻은 뒤, action마다 나올 observation과 updated belief의 future value를 F로 먼저 평균한다. Listen, camera pan, slow approach처럼 정보만 얻는 action도 이후 더 정확한 선택을 가능하게 하면 비용을 상쇄할 수 있다." symbols={[[String.raw`r(b,a)`, 'Belief로 평균한 immediate reward'], [String.raw`F^*(b,a)`, '가능한 observation 뒤의 optimal future value를 확률로 평균한 값'], [String.raw`P(o\mid b,a)`, 'Action 뒤 observation o가 나올 probability'], [String.raw`\tau(b,a,o)`, 'Bayesian update로 얻는 next belief'], [String.raw`V^*`, 'Next belief에서의 optimal future value']]} />
        <ActiveSensingLab />
        <Takeaway>Exploration은 처음 보는 state를 방문하는 것만이 아니다. 같은 physical state에서도 어떤 action은 더 informative한 observation을 만든다. POMDP planning은 이 value of information을 task reward와 같은 horizon에서 비교한다.</Takeaway>
      </NlpSection>

      <NlpSection id="kalman-filter" marker="05" tone="green" question="Belief distribution 전체 대신 mean과 covariance만으로 충분한 경우는 언제일까?" title="Kalman filter는 linear dynamics와 Gaussian uncertainty의 tractable belief update다">
        <KalmanTrustLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\begin{aligned}
\underbrace{\widehat x_k^-}_{\text{관측 전 상태 예측}}
&=F_k\widehat x_{k-1}+B_ku_{k-1}\\
\underbrace{P_k^-}_{\text{관측 전 불확실성}}
&=F_kP_{k-1}F_k^\top+\underbrace{Q_k}_{\text{과정 잡음}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Time update는 posterior state mean을 dynamics로 다음 시점에 옮기고, covariance를 같은 transition으로 전파한 뒤 process noise를 더한다. Sensor를 보기 전에도 model uncertainty는 누적된다." symbols={[[String.raw`\widehat x_k^-`, 'Measurement 전 predicted state'], [String.raw`F_k,B_k`, 'Linear dynamics와 control matrix'], [String.raw`P_k^-`, 'Predicted error covariance'], [String.raw`Q_k`, 'Unmodeled process noise covariance']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-base">{String.raw`\begin{aligned}
\underbrace{S_k}_{\text{관측 오차의 예상 분산}}
&=\underbrace{H_kP_k^-H_k^\top}_{\text{센서로 옮긴 상태 불확실성}}\\
&\quad+\underbrace{R_k}_{\text{센서 잡음}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Innovation covariance는 predicted state uncertainty를 sensor space로 옮긴 값과 measurement noise를 합친다. Sensor residual이 어느 direction에서 얼마나 흔들릴 수 있는지 나타낸다." symbols={[[String.raw`S_k`, 'Predicted measurement residual의 covariance'], [String.raw`R_k`, 'Measurement noise covariance'], [String.raw`H_k`, 'State를 measurement space로 투영하는 matrix']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{K_k}_{\text{센서를 믿을 정도}}
=\underbrace{P_k^-H_k^\top}_{\text{상태·관측의 함께 변하는 정도}}
\underbrace{S_k^{-1}}_{\text{관측 불확실성의 역수}}`}</MathFormula></div>
        <FormulaNote meaning="Kalman gain은 state-measurement cross covariance를 innovation uncertainty로 나눈 matrix다. Model prediction이 불확실하고 sensor가 정확한 direction에서 correction이 커진다." symbols={[[String.raw`K_k`, 'Model과 sensor 사이의 correction gain'], [String.raw`P_k^-H_k^\top`, 'State와 predicted measurement의 cross covariance'], [String.raw`S_k^{-1}`, 'Residual uncertainty의 direction별 inverse scale']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-base">{String.raw`\begin{aligned}
\underbrace{\widehat x_k}_{\text{보정된 상태}}
&=\widehat x_k^-+K_k\underbrace{(z_k-H_k\widehat x_k^-)}_{\text{실제 관측과 예측의 차이}}\\
\underbrace{P_k}_{\text{보정 뒤 불확실성}}
&=(I-K_kH_k)P_k^-
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Actual sensor와 predicted measurement의 innovation을 gain만큼 state에 더하고, posterior covariance는 observation에서 얻은 정보만큼 줄인다. Mean correction과 uncertainty correction을 항상 함께 갱신해야 한다." symbols={[[String.raw`z_k-H_k\widehat x_k^-`, 'Actual sensor와 predicted measurement의 innovation'], [String.raw`\widehat x_k`, 'Measurement를 반영한 posterior state estimate'], [String.raw`P_k`, 'Observation을 반영한 posterior covariance']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Normalized Innovation Squared(NIS, 정규화 혁신 제곱)는 sensor residual을 raw 크기로만 보지 않고 filter가 예측한 uncertainty로 나눠 일관성을 검사한다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\begin{aligned}
\underbrace{\nu_k}_{\text{관측 잔차}}
&=z_k-H_k\widehat x_k^-\\
\underbrace{\operatorname{NIS}_k}_{\text{불확실성으로 나눈 잔차 크기}}
&=\nu_k^\top S_k^{-1}\nu_k
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Innovation이 covariance S가 예측한 규모에 비해 얼마나 큰지 dimensionless score로 만든다. NIS가 반복해서 너무 크면 sensor outlier뿐 아니라 dynamics, timestamp, Q·R calibration 중 어느 하나가 틀렸을 수 있다. 한 번의 큰 값만으로 sensor 고장이라고 단정하지 않는다." symbols={[[String.raw`\nu_k`, 'Actual measurement와 predicted measurement의 residual'], [String.raw`S_k`, 'Model이 예상한 innovation covariance'], [String.raw`\operatorname{NIS}_k`, 'Residual 크기를 uncertainty로 정규화한 consistency statistic']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Kalman filter가 noise를 없앤다는 표현은 부족하다. 핵심은 position-only measurement history와 motion model에서 직접 보이지 않는 velocity를 추정하고, 그 estimate가 얼마나 불확실한지도 covariance로 함께 전달하는 것이다. Robot policy는 estimate만 받고 safety shield는 covariance를 무시하면 같은 state estimate에서도 과도하게 빠른 action을 낼 수 있다.</p><p>Linear·Gaussian assumption이 깨지면 선택지가 갈린다. 약한 nonlinear이면 Extended Kalman Filter(EKF, 확장 칼만 필터)가 Jacobian으로 local linearization하고, sigma point로 nonlinear transform을 근사하려면 Unscented Kalman Filter(UKF, 무향 칼만 필터)를 쓴다. Multi-modal posterior와 data association이 핵심이면 particle filter가 낫다. Model을 쓰기 어렵고 representation을 data에서 배워야 하면 recurrent encoder나 stochastic world model을 쓰되 calibration을 별도 평가한다.</p></div>
      </NlpSection>

      <NlpSection id="learned-memory" marker="06" tone="blue" question="LSTM hidden state를 belief라고 불러도 될까?" title="Recurrent policy는 history statistic을 학습하지만 posterior correctness는 보장하지 않는다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{h_t}_{\text{현재까지 압축한 기억}}
=\underbrace{f_\theta}_{\text{순환 인코더}}
(\underbrace{h_{t-1}}_{\text{이전 기억}},\underbrace{o_t}_{\text{현재 관측}},\underbrace{a_{t-1}}_{\text{직전 행동}})`}</MathFormula></div>
        <FormulaNote meaning="Recurrent encoder는 이전 memory, current observation과 previous action을 결합해 policy input h_t를 만든다. 이 hidden state는 objective에 유용한 statistic이지 자동으로 calibrated posterior가 되는 것은 아니다." symbols={[[String.raw`h_t`, 'History를 압축한 learned hidden state'], [String.raw`f_\theta`, 'RNN·LSTM·GRU 또는 recurrent state-space encoder'], [String.raw`a_{t-1}`, '현재 observation을 만든 직전 intervention']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{a_t}_{\text{실행할 행동}}
\sim\underbrace{\pi_\theta(\cdot\mid h_t)}_{\text{누적 기억을 조건으로 한 정책}}`}</MathFormula></div>
        <FormulaNote meaning="Policy는 raw observation 하나가 아니라 learned history state에 조건화해 action을 낸다. Hidden state가 probability normalization, uncertainty calibration과 true-state identifiability를 갖는지는 별도 probe와 rollout으로 확인한다." symbols={[[String.raw`a_t`, '현재 실행할 sampled action'], [String.raw`\pi_\theta(\cdot\mid h_t)`, 'Learned history state에 조건화한 action distribution']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-base">{String.raw`\begin{aligned}
\underbrace{\widetilde h_B}_{\text{준비 구간의 출력}}
&=\operatorname{Unroll}_{0:B}(h_0,o,a)\\
\underbrace{h_B}_{\text{기울기를 끊은 시작 기억}}
&=\operatorname{stopgrad}(\widetilde h_B)\\
\underbrace{e_t}_{\text{유효 시점의 오차}}
&=m_t\left(Q_\theta(h_t,a_t)-Y_t\right)^2\\
\underbrace{\mathcal L_{\mathrm{seq}}}_{\text{유효 구간의 순차 손실}}
&=\frac{\sum_{t=B}^{B+U-1}e_t}
{\underbrace{\sum_{t=B}^{B+U-1}m_t}_{\text{유효 시점 수}}}
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Sequence 앞 B step은 hidden state를 실제 history와 맞추기 위한 burn-in이다. 그 출력 h-tilde에서 gradient를 끊어 h_B를 만든 뒤, 뒤 U step에서는 mask를 곱한 timestep별 오차 e_t만 loss와 BPTT에 사용한다. Yₜ는 TD·Q-learning 글과 같은 sampled backup이고, 여기서는 true Markov state sₜ 대신 model 없이 학습한 history statistic hₜ가 belief의 근사 역할을 한다. Padding·episode 밖 step은 m=0으로 제외하며, h0를 0으로 두는 것은 진짜 episode 시작에서만 정합적이다." symbols={[[String.raw`\widetilde h_B`, 'Burn-in sequence를 실행해 복원했지만 아직 gradient가 연결된 hidden state'], [String.raw`h_B`, 'Burn-in 경로의 gradient를 끊고 training unroll을 시작할 hidden state'], [String.raw`B`, 'Hidden state 복원을 위한 burn-in 길이'], [String.raw`U`, 'Gradient를 계산할 training unroll 길이'], [String.raw`e_t`, 'Mask를 적용한 timestep t의 squared prediction error'], [String.raw`m_t`, 'Valid in-episode timestep만 1인 loss mask'], [String.raw`Y_t`, 'Recurrent TD 또는 policy training target']]} />
        <div className="not-prose my-7 overflow-hidden rounded-md border border-border">
          <div className="grid gap-px bg-border lg:grid-cols-4">
            {[['Frame stack', '고정 길이 raw history', '짧고 알려진 delay', 'Window 밖 정보 소실'], ['Kalman / EKF', 'Mean + covariance', 'Known near-linear model', 'Model·noise mismatch'], ['Particle filter', 'Weighted state samples', 'Multi-modal posterior', 'Particle degeneracy·compute'], ['RNN / Recurrent State-Space Model(RSSM)', 'Learned deterministic·stochastic state', 'High-dimensional observation', 'Uncalibrated memory·replay mismatch']].map(([name, representation, fit, failure]) => <div key={name} className="min-w-0 bg-background p-4"><p className="text-sm font-bold">{name}</p><p className="mt-3 text-xs text-muted-foreground">표현</p><p className="mt-1 text-xs font-semibold leading-relaxed">{representation}</p><p className="mt-3 text-xs text-muted-foreground">잘 맞는 조건</p><p className="mt-1 text-xs leading-relaxed">{fit}</p><p className="mt-3 text-xs text-muted-foreground">주요 실패</p><p className="mt-1 text-xs leading-relaxed">{failure}</p></div>)}
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Recurrent RL에서 network보다 data loader가 먼저 깨진다. 임의 timestep에서 hidden state를 0으로 놓고 loss를 계산하면 실제 episode history와 다른 state에서 Q target을 맞춘다. Episode 전체를 처음부터 순서대로 쓰면 hidden state는 맞지만 sample correlation이 커진다. 실용적인 절충은 episode sequence를 sample하고 앞부분을 burn-in으로 forward만 한 뒤 뒤 unroll에서 loss와 BPTT를 계산하는 것이다.</p><p>반드시 previous action, reward, reset flag의 semantics를 고정해야 한다. 다른 episode의 hidden state가 이어지거나 padding step에 loss가 걸리면 model은 존재하지 않는 memory를 학습한다. Stored hidden state를 쓸 경우 network가 업데이트되며 stale해지는 문제도 남는다.</p></div>
      </NlpSection>

      <NlpSection id="deployment-diagnostics" marker="07" tone="teal" question="부분 관측 robot이 실패했을 때 policy 탓인지 estimator 탓인지 어떻게 가를까?" title="관측, 추정, 의사결정, 물리 실행의 증거를 분리해 기록한다">
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">OBSERVATION</p><p className="mt-2 text-sm font-semibold">Sensor health</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Dropout, latency, blur, timestamp skew와 detector confidence를 raw input에 붙인다.</p></div>
          <div className="bg-sky-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">ESTIMATION</p><p className="mt-2 text-sm font-semibold">Innovation & uncertainty</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Residual, covariance, particle entropy, hidden probe error와 reset을 기록한다.</p></div>
          <div className="bg-violet-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">POLICY</p><p className="mt-2 text-sm font-semibold">Action under belief</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Action probability, value, sensing choice와 uncertainty-conditioned speed를 본다.</p></div>
          <div className="bg-rose-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">PHYSICS</p><p className="mt-2 text-sm font-semibold">Recoverability margin</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Time-to-contact, braking distance, actuator saturation과 shield handoff latency를 잰다.</p></div>
        </div>
        <CapabilityCheck items={['현재 observation이 Markov state인지 counterexample trajectory pair로 검사한다.', 'Known discrete model에서 belief prediction·correction·normalization을 직접 계산한다.', 'Kalman gain과 posterior covariance가 Q·R 변화에 어떻게 반응하는지 설명한다.', 'Frame stack, Kalman, particle, RNN·RSSM을 uncertainty shape와 memory horizon으로 선택한다.', 'Recurrent replay에서 episode boundary, burn-in, mask와 hidden-state staleness를 점검한다.', 'Estimator uncertainty와 Safe RL cost·runtime shield·hardware limit을 서로 대체하지 않는다.']} />
        <LearningHandoff
          description="이 글의 산출물은 history에서 갱신한 belief 또는 learned state와 그 불확실성이다. 실제 sensor system이나 learned dynamics로 옮길 때만 다음 경계를 연다."
          items={[
            { label: '막히면', slug: 'rl-mdp-bellman', title: 'MDP·Return·Bellman', reason: '어떤 정보가 state를 Markov하게 만드는지와 belief-space backup이 재사용하는 value 구조를 복습한다.' },
            { label: '이어 읽기', slug: 'rl-model-based-world-models', title: 'Model-based RL과 World Models', reason: 'Learned latent state에 action-conditioned dynamics를 붙여 imagination과 planning에 사용하는 경계를 읽는다.' },
            { label: '적용하기', slug: 'robot-localization-slam', title: 'Robot Localization & SLAM', reason: 'Camera·IMU·LiDAR의 timestamp, covariance와 global correction을 실제 estimator pipeline으로 옮긴다.' },
          ]}
        />
        <SourceNotes sources={[{ label: 'Kaelbling, Littman, Cassandra (1998) · POMDP', href: 'https://people.csail.mit.edu/lpk/papers/aij98-pomdp.pdf', note: 'Belief-state estimator, policy tree, value geometry와 exact planning의 1차 출처다.' }, { label: 'Kalman (1960) · Linear filtering and prediction', href: 'https://doi.org/10.1115/1.3662552', note: 'State-transition과 covariance recursion의 원 논문이다.' }, { label: 'Welch & Bishop · An Introduction to the Kalman Filter', href: 'https://www.cs.unc.edu/~welch/media/pdf/kalman_intro.pdf', note: '현대 discrete predict-correct notation과 EKF 경계를 교차 확인했다.' }, { label: 'Hausknecht & Stone (2015) · DRQN', href: 'https://arxiv.org/abs/1507.06527', note: 'Single-frame recurrence와 flickering Atari에서 recurrent Q-network를 쓰는 근거다.' }, { label: 'Kapturowski et al. (2019) · R2D2', href: 'https://openreview.net/forum?id=r1lyTjAqYX', note: 'Stored recurrent state의 staleness, burn-in과 sequence replay 경계를 확인한다.' }]} />
      </NlpSection>
    </>
  );
}
