import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ComparisonTable,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { ControlLoopSequenceViz } from './rl-viz/RlAnimatedSequences';

const chart = { left: 42, right: 616, top: 18, bottom: 208 };

function linePath(values: number[], yMin: number, yMax: number) {
  return values.map((value, index) => {
    const x = chart.left + (index / Math.max(1, values.length - 1)) * (chart.right - chart.left);
    const y = chart.bottom - ((value - yMin) / (yMax - yMin)) * (chart.bottom - chart.top);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${Math.max(chart.top, Math.min(chart.bottom, y)).toFixed(2)}`;
  }).join(' ');
}

function ResponseChart({ values, target = 1, yMin = -0.2, yMax = 1.8 }: { values: number[]; target?: number; yMin?: number; yMax?: number }) {
  const targetY = chart.bottom - ((target - yMin) / (yMax - yMin)) * (chart.bottom - chart.top);
  return (
    <svg viewBox="0 0 640 230" className="block h-auto w-full" role="img" aria-label="시간에 따른 폐루프 응답">
      <rect x="0" y="0" width="640" height="230" fill="transparent" />
      {[0, 0.5, 1, 1.5].map((value) => {
        const y = chart.bottom - ((value - yMin) / (yMax - yMin)) * (chart.bottom - chart.top);
        return <g key={value}><line x1={chart.left} x2={chart.right} y1={y} y2={y} stroke="currentColor" opacity="0.09" /><text x="34" y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">{value.toFixed(1)}</text></g>;
      })}
      <line x1={chart.left} x2={chart.right} y1={targetY} y2={targetY} stroke="#059669" strokeDasharray="6 5" opacity="0.8" />
      <path d={linePath(values, yMin, yMax)} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x={chart.right} y="224" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">time</text>
      <text x={chart.right - 4} y={targetY - 7} textAnchor="end" fontSize="10" fill="#047857">target</text>
    </svg>
  );
}

function PoleResponseLab() {
  const [damping, setDamping] = useState(0.34);
  const [frequency, setFrequency] = useState(2.2);
  const dt = 0.04;
  const response = useMemo(() => Array.from({ length: 126 }, (_, index) => {
    const t = index * dt;
    if (damping >= 0.99) return 1 - Math.exp(-frequency * t) * (1 + frequency * t);
    const root = Math.sqrt(Math.max(0.0001, 1 - damping * damping));
    const wd = frequency * root;
    return 1 - Math.exp(-damping * frequency * t) * Math.sin(wd * t + Math.acos(damping)) / root;
  }), [damping, frequency]);
  const peak = Math.max(...response);
  const overshoot = Math.max(0, (peak - 1) * 100);
  const poleMagnitude = Math.exp(-damping * frequency * dt);
  const settle = damping * frequency > 0 ? 4 / (damping * frequency) : Number.POSITIVE_INFINITY;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">CLOSED-LOOP RESPONSE LAB</span>
        <strong className="text-sm leading-snug">Pole의 위치가 반복되는 오차의 감쇠와 진동을 바꾼다</strong>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-blue-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Damping ratio zeta · {damping.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min="0.08" max="1" step="0.02" value={damping} onChange={(event) => setDamping(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Natural frequency omega_n · {frequency.toFixed(1)} rad/s<input className="mt-3 block w-full accent-blue-700" type="range" min="0.6" max="5" step="0.1" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0"><ResponseChart values={response} /></div>
        <dl className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Overshoot</dt><dd className="mt-1 font-mono text-lg font-black">{overshoot.toFixed(1)}%</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Approx. settling time</dt><dd className="mt-1 font-mono text-lg font-black">{settle.toFixed(2)} s</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Discrete pole magnitude</dt><dd className="mt-1 font-mono text-lg font-black text-blue-700 dark:text-blue-300">{poleMagnitude.toFixed(3)}</dd></div>
        </dl>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">설명용 표준 2차 응답이다. 실제 robot의 stability는 식별한 model, sampling, delay, saturation을 포함한 폐루프에서 다시 검증해야 한다.</p>
    </figure>
  );
}

function solveScalarLqr(q: number, r: number) {
  const horizon = 14;
  const a = 1.08;
  const b = 0.52;
  const gains = Array(horizon).fill(0);
  let p = q * 5;
  for (let t = horizon - 1; t >= 0; t -= 1) {
    const gain = (b * p * a) / (r + b * b * p);
    gains[t] = gain;
    p = q + a * a * p - a * b * p * gain;
  }
  let x = 1.5;
  const states = [x];
  const actions: number[] = [];
  let stateCost = 0;
  let actionCost = 0;
  gains.forEach((gain) => {
    const u = -gain * x;
    stateCost += q * x * x;
    actionCost += r * u * u;
    actions.push(u);
    x = a * x + b * u;
    states.push(x);
  });
  return { gains, states, actions, stateCost, actionCost };
}

function LqrTradeoffLab() {
  const [q, setQ] = useState(4);
  const [r, setR] = useState(1.4);
  const result = useMemo(() => solveScalarLqr(q, r), [q, r]);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">FINITE-HORIZON LQR LAB</span>
        <strong className="text-sm leading-snug">상태 오차와 제어 effort의 가격을 바꾸면 feedback gain이 달라진다</strong>
        <span className="font-mono text-xs font-black">K0 {result.gains[0].toFixed(3)}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-violet-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">State penalty q · {q.toFixed(1)}<input className="mt-3 block w-full accent-violet-700" type="range" min="0.5" max="12" step="0.5" value={q} onChange={(event) => setQ(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Action penalty r · {r.toFixed(1)}<input className="mt-3 block w-full accent-violet-700" type="range" min="0.2" max="8" step="0.2" value={r} onChange={(event) => setR(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0"><ResponseChart values={result.states} target={0} yMin={-0.2} yMax={1.7} /><div className="mt-3 flex flex-wrap gap-2">{result.actions.slice(0, 6).map((action, index) => <span key={index} className="border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">u{index}={action.toFixed(2)}</span>)}</div></div>
        <dl className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">First action</dt><dd className="mt-1 font-mono text-lg font-black">{result.actions[0].toFixed(3)}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">State cost</dt><dd className="mt-1 font-mono text-lg font-black">{result.stateCost.toFixed(2)}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Action cost</dt><dd className="mt-1 font-mono text-lg font-black text-violet-700 dark:text-violet-300">{result.actionCost.toFixed(2)}</dd></div>
        </dl>
      </div>
    </figure>
  );
}

function enumerateMpc(x0: number, horizon: number, uMax: number) {
  const actions = [-uMax, -uMax / 2, 0, uMax / 2, uMax];
  let bestCost = Number.POSITIVE_INFINITY;
  let bestStates: number[] = [];
  let bestActions: number[] = [];
  const search = (x: number, depth: number, states: number[], controls: number[], cost: number) => {
    if (depth === horizon) {
      const total = cost + 5 * x * x;
      if (total < bestCost) { bestCost = total; bestStates = states; bestActions = controls; }
      return;
    }
    actions.forEach((u) => {
      const next = x + 0.65 * u;
      if (Math.abs(next) > 3) return;
      search(next, depth + 1, [...states, next], [...controls, u], cost + x * x + 0.25 * u * u);
    });
  };
  search(x0, 0, [x0], [], 0);
  return { bestCost, bestStates, bestActions };
}

function MpcHorizonLab() {
  const [horizon, setHorizon] = useState(3);
  const [uMax, setUMax] = useState(0.6);
  const plan = useMemo(() => enumerateMpc(2.4, horizon, uMax), [horizon, uMax]);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">CONSTRAINED MPC LAB</span>
        <strong className="text-sm leading-snug">미래 action sequence를 풀되 지금은 첫 action 하나만 실행한다</strong>
        <span className="font-mono text-xs font-black">u0 {plan.bestActions[0]?.toFixed(2)}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-emerald-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Prediction horizon N · {horizon}<input className="mt-3 block w-full accent-emerald-700" type="range" min="1" max="5" step="1" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Input bound |u| &le; {uMax.toFixed(1)}<input className="mt-3 block w-full accent-emerald-700" type="range" min="0.2" max="1" step="0.2" value={uMax} onChange={(event) => setUMax(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
            <div className="rounded-md border border-border p-3"><p className="text-[10px] font-black text-muted-foreground">PREDICTED OPEN-LOOP PLAN</p><p className="mt-2 break-words font-mono text-xs leading-relaxed">x: {plan.bestStates.map((x) => x.toFixed(2)).join(' -> ')}</p><p className="mt-2 break-words font-mono text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">u: {plan.bestActions.map((u) => u.toFixed(2)).join(', ')}</p></div>
            <span className="text-center font-mono text-xs text-muted-foreground">execute u0 only</span>
            <div className="rounded-md border border-emerald-600/30 bg-emerald-500/[0.04] p-3"><p className="text-[10px] font-black text-muted-foreground">NEXT CLOSED-LOOP STEP</p><p className="mt-2 text-sm font-bold">Measure new state</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Prediction error를 반영해 horizon 전체를 다시 최적화한다.</p></div>
          </div>
        </div>
        <dl className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Plan cost</dt><dd className="mt-1 font-mono text-lg font-black">{plan.bestCost.toFixed(2)}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Input feasibility</dt><dd className="mt-1 font-mono text-lg font-black text-emerald-700 dark:text-emerald-300">satisfied</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Next solve</dt><dd className="mt-1 font-mono text-lg font-black">t + 1</dd></div>
        </dl>
      </div>
    </figure>
  );
}

export default function RobotDynamicsFeedbackControlArticle() {
  return (
    <>
      <BeginnerOpening
        title="한 번 명령하고 끝내지 않고 결과를 다시 보는 이유"
        description="계획한 각도나 속도를 한 번 보내도 실제 로봇은 마찰, 무게, 경사와 지연 때문에 그대로 움직이지 않습니다. 목표와 실제 결과의 차이를 계속 재고, 다음 명령을 고쳐야 움직임이 안정됩니다."
        familiarScene={<>샤워 물이 차갑다고 손잡이를 한 번 크게 돌린 뒤 눈을 감고 기다리지는 않습니다. 물에 손을 대 보고, 너무 뜨거우면 반대로 조금 돌리며 원하는 온도에 가까워질 때까지 반복합니다. 이 <strong>결과를 다시 보는 반복</strong>이 피드백의 출발점입니다.</>}
        steps={[
          { label: '원하는 상태를 정한다', detail: '로봇이 있어야 할 위치, 속도와 자세를 시간에 따라 기준으로 둡니다.' },
          { label: '실제 결과와 차이를 잰다', detail: '센서로 현재 움직임을 추정하고 목표와 얼마나 다른지 계산합니다.' },
          { label: '다음 힘을 고쳐 보낸다', detail: '모터 한계와 지연을 넘지 않는 범위에서 오차가 줄어들도록 명령을 반복해 바꿉니다.' },
        ]}
      />
      <NlpSection id="plant-loop" marker="01" tone="teal" question="좋은 action을 한 번 계산하는 것과 실제 robot을 계속 안정화하는 것은 왜 다를까?" title="제어는 예측이 아니라 결과를 다시 측정하는 폐루프다">
        <QuestionLead question="정확한 model로 계산한 steering command를 그대로 보내면 왜 robot은 목표에서 벗어날까?" answer="마찰, 경사, payload, sensor noise와 actuator 오차가 model에 완전히 들어가지 않기 때문이다. Open loop는 이 오차를 다음 command에서 알지 못한다. Feedback은 실행 결과를 다시 측정해 reference와의 오차를 줄이도록 다음 input을 바꾼다." />
        <ConceptPrimer items={[
          { term: 'Plant', meaning: '제어 대상인 robot, motor, arm 또는 physical process다.', why: 'Network의 action output과 실제 motion 사이에 actuator dynamics가 있음을 고정한다.' },
          { term: 'State', meaning: '현재를 알면 future evolution을 예측하는 데 필요한 최소 내부 변수다.', why: 'Position만 보고 velocity나 heading을 빼면 같은 observation에서 다른 다음 상태가 나온다.' },
          { term: 'Reference', meaning: '따라가려는 위치, 속도, 자세 또는 trajectory다.', why: 'Regulation to zero와 moving-target tracking을 구분한다.' },
          { term: 'Disturbance', meaning: '바람, slip, payload처럼 controller가 직접 명령하지 않은 plant input이다.', why: 'Model error와 sensor noise, external input을 한 원인으로 뭉치지 않는다.' },
        ]} />
        <ControlLoopSequenceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Production log에는 최소한 reference, observation, state estimate와 uncertainty, controller command, 실제 적용 input, saturation flag, timestamp를 함께 남긴다. <code>u_cmd</code>만 저장하면 controller가 큰 값을 요구했는지, driver가 clip했는지, deadline을 놓쳐 이전 command가 유지됐는지 구분할 수 없다.</p></div>
      </NlpSection>

      <NlpSection id="state-space" marker="02" tone="blue" question="물리 과정을 controller가 계산할 수 있는 계약으로 어떻게 바꿀까?" title="상태공간은 내부 state, action, observation을 서로 다른 식으로 둔다">
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`x_{t+1}=Ax_t+Bu_t+w_t`}</MathFormula></div>
          <div className="rounded-md border border-blue-500/30 bg-blue-500/[0.035] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`y_t=Cx_t+v_t`}</MathFormula></div>
        </div>
        <FormulaNote meaning="첫 식은 current state가 action과 disturbance를 받아 next state가 되는 dynamics다. 둘째 식은 sensor가 state를 observation으로 투영하고 measurement noise를 더하는 과정이다. B와 C의 역할을 분리해야 제어 불가능과 관측 불가능을 구분할 수 있다." symbols={[[String.raw`x_t`, '위치·속도·자세처럼 future evolution을 결정하는 state vector'], [String.raw`u_t`, 'steering·torque·acceleration 같은 control input'], [String.raw`A,B`, '자체 dynamics와 actuator가 state에 미치는 영향'], [String.raw`C`, 'state 중 sensor가 측정하는 방향'], [String.raw`w_t,v_t`, 'process disturbance와 measurement noise']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Continuous model을 digital controller에서 쓰려면 sampling period를 포함해 discretize해야 한다. 같은 gain이라도 속도와 timestep이 바뀌면 discrete A와 B가 바뀐다. 따라서 저속에서 안정한 steering gain을 고속에 복사하는 것은 같은 controller를 쓴 것이 아니라 다른 폐루프 dynamics를 만든 것이다.</p><p>State selection은 feature engineering보다 강한 계약이다. 과수원 row tracking에서는 lateral error와 heading error가 함께 있어야 같은 lateral offset에서도 어느 방향으로 진행 중인지 구분한다. Steering actuator lag가 response를 지배하면 steering angle 또는 actuator state도 넣어야 한다.</p></div>
        <Misconception>State-space의 linear model은 world 전체가 linear라는 선언이 아니다. Operating point 근처의 local model일 수 있다. 속도 범위가 넓거나 tire slip이 커지면 gain scheduling, nonlinear model, online identification 또는 robust validation이 필요하다.</Misconception>
      </NlpSection>

      <NlpSection id="stability-feedback" marker="03" tone="violet" question="Gain을 키우면 오차를 더 빨리 줄이는데 왜 진동하거나 발산할 수 있을까?" title="Feedback gain은 오차만이 아니라 폐루프 dynamics 자체를 바꾼다">
        <PoleResponseLab />
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`u_t=-Kx_t`}</MathFormula></div>
          <div className="rounded-md border border-violet-500/30 bg-violet-500/[0.035] p-3"><MathFormula display className="my-0 text-xs sm:text-sm lg:text-base">{String.raw`x_{t+1}=(A-BK)x_t`}</MathFormula></div>
        </div>
        <FormulaNote meaning="State feedback는 current state에 gain K를 곱해 반대 방향 input을 만든다. 이를 plant 식에 넣으면 반복 dynamics가 A에서 A-BK로 바뀐다. Discrete-time에서는 A-BK의 모든 eigenvalue magnitude가 1보다 작아야 작은 perturbation이 반복될수록 줄어든다." symbols={[[String.raw`K`, '각 state error를 actuator input으로 바꾸는 feedback gain'], [String.raw`A-BK`, 'Controller를 포함한 closed-loop state transition'], ['eigenvalue', '반복할 때 독립 mode가 커지거나 줄고 회전하는 비율'], [String.raw`\rho(A-BK)`, '가장 큰 eigenvalue magnitude인 spectral radius']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>큰 gain은 느린 model에서는 error를 빠르게 줄일 수 있지만 sensor delay가 있으면 이미 지나간 error에 강한 반응을 보낸다. Saturation이 걸리면 설계한 선형 feedback law가 실제 input에 적용되지 않는다. 이때 linear pole 계산은 local 진단 기준이지 global 보증이 아니다.</p></div>
      </NlpSection>

      <NlpSection id="structural-tests" marker="04" tone="amber" question="Gain을 고르기 전에 actuator와 sensor가 필요한 state direction에 닿는지 어떻게 알까?" title="제어가능성과 관측가능성은 tuning 이전의 구조 검사다">
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\mathcal C=[B\;\;AB\;\;\cdots\;\;A^{n-1}B],\qquad \operatorname{rank}(\mathcal C)=n`}</MathFormula></div>
          <div className="rounded-md border border-amber-500/30 bg-amber-500/[0.035] p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\mathcal O=\begin{bmatrix}C\\CA\\\vdots\\CA^{n-1}\end{bmatrix},\qquad \operatorname{rank}(\mathcal O)=n`}</MathFormula></div>
        </div>
        <FormulaNote meaning="Controllability matrix는 지금과 이후 dynamics를 거쳐 actuator가 state space의 어느 방향까지 밀 수 있는지 모은다. Observability matrix는 현재와 이후 output history가 state 방향을 서로 구분하는지 모은다. Full rank가 아니면 gain이나 estimator를 바꾸기 전에 actuator·sensor·state model을 다시 봐야 한다." symbols={[[String.raw`\mathcal C`, 'Actuator influence가 dynamics를 거쳐 펼쳐지는 방향 집합'], [String.raw`\mathcal O`, 'State가 output history에 남기는 방향 집합'], [String.raw`n`, 'State dimension'], ['rank = n', '모든 독립 state direction이 reachable 또는 distinguishable임']]} />
        <ComparisonTable headers={['검사', '실패 의미', '튜닝으로 해결?', '설계 조치']} rows={[
          ['Uncontrollable unstable mode', 'Actuator가 발산하는 state 방향을 움직일 수 없음', '불가', 'Actuator 위치·입력 구조·plant 설계 변경'],
          ['Unobservable unstable mode', 'Sensor history가 위험한 state 방향을 식별하지 못함', '불가', 'Sensor·measurement model·trajectory excitation 변경'],
          ['Poorly conditioned direction', '이론상 가능하지만 큰 input/noise amplification 필요', '부분적', 'Scale·sensor quality·actuator authority·operating point 재검토'],
          ['Full rank local model', 'Pole placement와 observer 설계가 가능한 출발점', '가능', 'Delay·constraint·nonlinearity를 포함해 후속 검증'],
        ]} />
      </NlpSection>

      <NlpSection id="pid" marker="05" tone="green" question="State-space model이 완벽하지 않아도 현장에서 PID가 강한 이유와 한계는 무엇일까?" title="PID는 현재 오차, 누적 편향, 변화 추세를 서로 다른 시간척도로 보정한다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`u(t)=K_Pe(t)+K_I\int_0^t e(\tau)\,d\tau+K_D\frac{de(t)}{dt}`}</MathFormula></div>
        <FormulaNote meaning="Proportional 항은 지금의 오차, integral 항은 오래 남은 bias, derivative 항은 오차가 변하는 속도에 반응한다. 세 gain은 서로 독립적인 마법 손잡이가 아니라 delay, sampling, sensor noise, actuator limit과 함께 폐루프 response를 만든다." symbols={[[String.raw`e(t)=r(t)-y(t)`, 'Reference와 measured output의 tracking error'], [String.raw`K_P`, '현재 오차에 대한 즉시 반응'], [String.raw`K_I`, '지속되는 offset을 없애는 누적 반응'], [String.raw`K_D`, '오차 변화 추세를 이용한 damping 반응']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>PID가 model-free라는 표현은 절반만 맞다. 식에 explicit A, B는 없지만 gain을 정할 때 plant의 시간 상수, delay, sign, bandwidth를 경험적으로 식별한다. Derivative는 noisy measurement를 증폭하므로 filtered derivative와 sampling jitter를 확인한다.</p><p>Integral windup은 actuator가 이미 포화됐는데도 적분 상태가 계속 커지는 현상이다. Command가 다시 feasible해진 뒤에도 쌓인 integral이 반대 방향 overshoot를 만든다. Anti-windup은 saturation 때 integration을 멈추거나 실제 적용 input과 requested input의 차이로 integral state를 되돌린다.</p></div>
        <Misconception>PID와 LQR·MPC는 진화 단계의 단순 대체 관계가 아니다. 잘 정의된 SISO loop에는 PID가 가장 감사하기 쉽고 충분할 수 있다. State coupling, explicit trade-off, multi-variable constraint와 preview가 중요해질 때 LQR·MPC의 추가 구조가 값을 갖는다.</Misconception>
      </NlpSection>

      <NlpSection id="lqr" marker="06" tone="blue" question="Pole을 손으로 찍는 대신 원하는 response를 비용으로 선언할 수 있을까?" title="LQR은 state error와 control effort의 장기 합에서 feedback gain을 유도한다">
        <LqrTradeoffLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[10px] sm:text-base">{String.raw`J=x_N^\top Q_Nx_N+\sum_{t=0}^{N-1}\left(x_t^\top Qx_t+u_t^\top Ru_t\right)`}</MathFormula></div>
        <FormulaNote meaning="Finite horizon 동안 state error의 quadratic cost와 actuator effort의 quadratic cost를 합하고 마지막 state에 terminal cost를 둔다. Q와 R은 성능 선호를 수치화하지만 physical hard limit을 표현하지는 않는다." symbols={[[String.raw`Q,Q_N`, 'State direction별 deviation과 terminal error의 penalty matrix'], [String.raw`R`, 'Control input direction별 effort penalty matrix'], [String.raw`N`, '최적화하는 finite horizon'], [String.raw`J`, '선언한 model과 cost 아래 비교할 total performance']]} />
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`P_t=Q+A^\top P_{t+1}A-A^\top P_{t+1}B(R+B^\top P_{t+1}B)^{-1}B^\top P_{t+1}A`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-blue-500/30 bg-blue-500/[0.035] p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`K_t=(R+B^\top P_{t+1}B)^{-1}B^\top P_{t+1}A`}</MathFormula></div>
        </div>
        <FormulaNote meaning="Riccati recursion은 미래 state cost를 현재로 접어 cost-to-go matrix P를 만든다. 그 P에서 current state를 optimal action으로 바꾸는 K를 계산한다. Infinite-horizon time-invariant 조건에서는 P와 K가 steady value로 수렴할 수 있다." symbols={[[String.raw`P_t`, '시점 t state가 앞으로 만들 최소 cost의 quadratic matrix'], [String.raw`K_t`, '시점 t의 optimal state-feedback gain'], [String.raw`R+B^\top P_{t+1}B`, '현재 action effort와 미래 state 영향의 합'], ['backward recursion', 'Terminal cost에서 시작해 t=0 방향으로 future consequence를 접는 계산']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Q와 R을 숫자만 비교하면 단위가 문제다. 1 m 위치 오차와 1 rad 각도 오차를 같은 weight 1로 둔다고 같은 중요도가 되는 것이 아니다. State와 input을 허용 가능한 최대 크기로 normalize하거나 physical cost를 명시해야 tuning을 해석할 수 있다.</p><p>LQR action은 unconstrained다. 큰 initial error에서 steering limit을 넘는 u를 요구하면 실제 closed loop는 설계와 달라진다. Saturation 영역을 충분히 피하거나 별도 reference governor를 쓰고, hard constraints가 핵심이면 MPC로 넘어갈 근거가 생긴다.</p></div>
      </NlpSection>

      <NlpSection id="mpc" marker="07" tone="violet" question="미래 경로와 actuator limit을 계산 안에 직접 넣으려면 무엇이 바뀔까?" title="MPC는 제약된 미래를 풀고 첫 action만 실행한 뒤 다시 계획한다">
        <MpcHorizonLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[10px] sm:text-base">{String.raw`\min_{u_{0:N-1}}\;\ell_f(x_N)+\sum_{k=0}^{N-1}\ell(x_k,u_k)\quad\text{s.t.}\quad x_{k+1}=f(x_k,u_k),\;x_k\in\mathcal X,\;u_k\in\mathcal U`}</MathFormula></div>
        <FormulaNote meaning="Current measured state에서 시작해 horizon 안의 action sequence를 최적화한다. Dynamics를 만족하면서 state safe set X와 actuator set U 안에 있는 plan만 feasible하다. Terminal cost와 terminal set은 horizon 뒤의 consequence와 안정성을 연결하는 핵심 재료다." symbols={[[String.raw`u_{0:N-1}`, '이번 solve에서 찾는 future control sequence'], [String.raw`\ell,\ell_f`, 'Stage cost와 terminal cost'], [String.raw`\mathcal X,\mathcal U`, '허용하는 state와 input의 hard constraint set'], [String.raw`f`, 'Prediction에 사용하는 linear 또는 nonlinear dynamics model']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.035] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`u_t=u_{0\mid t}^{*},\qquad \text{then measure }x_{t+1}\text{ and solve again}`}</MathFormula></div>
        <FormulaNote meaning="Optimal sequence 전체를 blind하게 실행하지 않고 첫 action만 plant에 적용한다. 다음 state를 측정하면 prediction error와 disturbance가 반영된 새 initial condition에서 문제를 다시 푼다. 이 receding-horizon 반복이 open-loop optimizer를 feedback controller로 만든다." symbols={[[String.raw`u_{0\mid t}^{*}`, '시점 t에서 계산한 optimal plan의 첫 action'], [String.raw`x_{t+1}`, '실행 뒤 새로 측정하거나 추정한 state'], ['solve again', 'Horizon을 한 칸 앞으로 옮겨 constraint와 계획을 갱신']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Optimization이 매 step 성공한다고 stability가 자동으로 따라오지는 않는다. Standard proof는 terminal controller가 유지할 수 있는 terminal set, 그 안에서 future cost를 상계하는 terminal cost, 다음 step에도 feasible plan을 만들 수 있는 recursive feasibility와 cost decrease를 연결한다. 이 ingredients를 생략한 practical MPC도 잘 작동할 수 있지만 보장 범위는 달라진다.</p><p>실시간성은 controller contract다. Worst-case solve time이 sample period보다 길면 최적 plan이 늦게 도착한다. Timeout 때 last feasible action, backup controller, shortened horizon 중 무엇을 실행할지 미리 정의하고 solver status를 actuator log와 묶어야 한다.</p></div>
        <Takeaway>RL policy와 MPC도 대체 관계만은 아니다. Learned policy가 reference나 cost를 만들고 MPC가 model·constraint로 실행 action을 다듬을 수 있으며, learned dynamics를 MPC에 쓰면 prediction uncertainty와 out-of-distribution feasibility를 새로 검증해야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="estimator-controller" marker="08" tone="green" question="Sensor가 full state를 주지 않을 때 추정기와 controller의 책임을 어떻게 합칠까?" title="Estimator와 controller는 연결되지만 서로의 실패를 대신 해결하지 않는다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\widehat x_{t+1}=A\widehat x_t+Bu_t+L(y_t-C\widehat x_t),\qquad u_t=-K\widehat x_t`}</MathFormula></div>
        <FormulaNote meaning="Observer는 model prediction과 measurement innovation을 gain L로 결합해 state estimate를 갱신하고, controller는 true state 대신 estimate에 K를 적용한다. Linear model의 stated conditions에서 separation principle이 설계를 나눌 수 있게 하지만 saturation, constraint, delay와 model mismatch까지 자동으로 분리하지는 않는다." symbols={[[String.raw`\widehat x_t`, 'Controller가 사용하는 estimated state'], [String.raw`L`, 'Measurement innovation을 state correction으로 바꾸는 observer gain'], [String.raw`y_t-C\widehat x_t`, 'Actual observation과 predicted observation의 residual'], [String.raw`K`, 'Estimated state를 control input으로 바꾸는 feedback gain']]} />
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {[['MODEL', 'A, B, C와 operating range', 'speed·payload·sampling version'], ['ESTIMATOR', 'x_hat, covariance, innovation', 'latency·reset·calibration'], ['CONTROLLER', 'reference, gain, predicted plan', 'cost·constraint·solver status'], ['ACTUATOR', 'u_cmd, u_exec, saturation', 'deadline·current·thermal limit']].map(([label, evidence, audit]) => <div key={label} className="min-w-0 bg-background p-4"><p className="text-xs font-black text-muted-foreground">{label}</p><p className="mt-2 text-sm font-semibold leading-relaxed">{evidence}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">감사 · {audit}</p></div>)}
        </div>
        <CapabilityCheck items={[
          'State, observation, reference, control input, process disturbance와 sensor noise를 분리한다.',
          'State feedback가 A를 A-BK로 바꾸고 eigenvalue가 repeated error behavior를 정하는 이유를 설명한다.',
          'Controllability와 observability rank test를 gain tuning 이전의 구조 검사로 사용한다.',
          'PID의 P·I·D 시간척도와 delay, derivative noise, integral windup을 함께 진단한다.',
          'LQR의 Q·R, Riccati recursion, unconstrained action boundary를 구분한다.',
          'MPC의 predicted sequence와 executed first action, constraints, terminal ingredients, recursive feasibility를 연결한다.',
          'Estimator, controller, solver, actuator의 evidence를 같은 timestamp에서 분리 기록한다.',
        ]} />
        <LearningHandoff
          description="이 글의 controller 식은 계산 시간 0인 추상이 아니다. 실제 배포에서는 sample age, queue, solver timeout과 actuator latch가 같은 closed-loop budget에 들어간다."
          items={[
            { label: '막히면', slug: 'signals-systems-convolution', title: '신호와 시스템', reason: 'Sampling, delay, state memory와 feedback stability의 시간축 직관을 먼저 고정한다.' },
            { label: '이어 읽기', slug: 'robot-ros2-runtime-communication', title: 'ROS 2 Runtime & Communication', reason: 'Estimator·controller callback의 queue, executor wait와 end-to-end deadline을 실제 runtime에서 추적한다.' },
            { label: '적용하기', slug: 'robot-embedded-realtime-control', title: 'Embedded Real-Time Control', reason: 'Host의 control command를 MCU period·WCET·jitter·PWM latch와 physical stop path까지 내린다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'Kalman (1960) · Contributions to the Theory of Optimal Control', href: 'https://www.ee.iitb.ac.in/~belur/ee640/optimal-classic-paper.pdf', note: 'Controllability, observability, quadratic regulator와 Riccati feedback의 원 논문 reprint다.' },
          { label: 'Mayne et al. (2000) · Constrained MPC', href: 'https://doi.org/10.1016/S0005-1098(99)00214-9', note: '제약 동역학에서 MPC stability, optimality와 terminal ingredients를 정리한 1차 survey paper다.' },
          { label: 'Stanford EE363 · Linear Quadratic Regulator', href: 'https://ee363.stanford.edu/archive/lectures.html', note: 'Finite/infinite-horizon LQR, Riccati recursion과 stochastic output feedback의 강의 원자료다.' },
          { label: 'UC Berkeley EE C128 · Design via State Space', href: 'https://bayen.berkeley.edu/sites/default/files/ee_c128_chapter_12.pdf', note: 'Controller/observer design과 controllability/observability rank test를 교차 확인했다.' },
          { label: 'MIT 16.323 · Principles of Optimal Control', href: 'https://ocw.mit.edu/courses/16-323-principles-of-optimal-control-spring-2008/', note: 'MPC terminal constraint와 Lyapunov decrease, real-time feasibility 경계를 교차 확인했다.' },
        ]} />
      </NlpSection>
    </>
  );
}
