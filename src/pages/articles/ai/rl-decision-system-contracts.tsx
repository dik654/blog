import { useState, type ReactNode } from 'react';
import { Activity, Archive, BrainCircuit, ShieldCheck, Waypoints } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl } from './nlp-shared';

function FormulaFrame({ children }: { children: ReactNode }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">{children}</div>;
}

const fitCases = {
  robot: {
    label: 'Robot pick',
    icon: Waypoints,
    question: 'Gripper action이 다음 camera·joint state와 파손 위험을 바꾼다.',
    verdict: 'RL 후보',
    reason: 'Action이 future observation과 수집될 trajectory를 바꾼다. 다만 real exploration budget과 hardware shield가 먼저다.',
    flow: ['camera·joint', 'gripper action', 'contact·reward', '다음 state'],
    tone: 'emerald',
  },
  reasoning: {
    label: 'Reasoning verifier',
    icon: BrainCircuit,
    question: 'Token action이 다음 context를 만들고 최종 답을 verifier가 채점한다.',
    verdict: 'RL 후보',
    reason: 'Generation trajectory와 verifiable outcome이 있다. Robot safety가 아니라 exploration·credit·reward hacking을 검산한다.',
    flow: ['prompt', 'token action', '새 context', 'verifier'],
    tone: 'blue',
  },
  forecast: {
    label: 'Demand forecast',
    icon: Activity,
    question: '내일 수요를 맞히지만 prediction이 내일의 실제 수요를 바꾸지 않는다.',
    verdict: '우선 supervised',
    reason: 'Static label prediction이면 forecasting loss와 backtest가 직접적이다. 발주 action까지 닫혀 미래 수요·재고를 바꿀 때 decision problem이 된다.',
    flow: ['history', 'forecast', 'future label', 'error'],
    tone: 'amber',
  },
  classifier: {
    label: 'Image class',
    icon: Archive,
    question: '한 장의 image에서 class label을 예측하고 episode가 끝난다.',
    verdict: 'RL 아님',
    reason: 'Action 뒤에 state transition이 없다. Reward라는 이름으로 accuracy를 돌려 써도 supervised classification이다.',
    flow: ['image', 'class score', 'label', 'loss'],
    tone: 'rose',
  },
} as const;

type FitCase = keyof typeof fitCases;

function RlFitLab() {
  const [selected, setSelected] = useState<FitCase>('robot');
  const item = fitCases[selected];
  const Icon = item.icon;
  const tone = item.tone === 'emerald'
    ? 'border-emerald-600/30 bg-emerald-500/[0.05] text-emerald-800 dark:text-emerald-300'
    : item.tone === 'blue'
      ? 'border-blue-600/30 bg-blue-500/[0.05] text-blue-800 dark:text-blue-300'
      : item.tone === 'amber'
        ? 'border-amber-600/30 bg-amber-500/[0.05] text-amber-800 dark:text-amber-300'
        : 'border-rose-600/30 bg-rose-500/[0.05] text-rose-800 dark:text-rose-300';

  return (
    <figure data-rl-fit-lab className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="font-mono text-[11px] font-black text-blue-800 dark:text-blue-300">RL FIT LAB</span>
        <strong className="text-sm">Reward가 있는가보다 action이 다음 data를 바꾸는가를 먼저 본다</strong>
      </figcaption>
      <div className="border-b border-border bg-muted/15 p-4">
        <SegmentedControl
          label="문제 유형"
          options={Object.entries(fitCases).map(([value, entry]) => ({ value: value as FitCase, label: entry.label }))}
          value={selected}
          onChange={setSelected}
        />
      </div>
      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-relaxed">{item.question}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {item.flow.map((step, index) => (
                  <div key={step} className="min-w-0 border-t border-border pt-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <p className="mt-1 break-words text-xs font-semibold leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <span data-fit-verdict className={`inline-flex rounded border px-2 py-1 text-xs font-bold ${tone}`}>{item.verdict}</span>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
        </div>
      </div>
    </figure>
  );
}

const accessModes = {
  live: {
    label: 'Live interaction',
    route: 'Online policy optimization',
    evidence: '새 policy로 다시 수집한 rollout과 intervention log',
    danger: '사고 비용·reset 시간·policy drift를 무시한 무제한 exploration',
  },
  simulator: {
    label: 'Simulator',
    route: 'Sim RL · Model-based',
    evidence: 'Domain randomization 범위와 sim-real paired evaluation',
    danger: 'Simulator reward와 dynamics 오차를 real guarantee로 바꾸기',
  },
  log: {
    label: 'Fixed log',
    route: 'Offline RL · Behavior cloning',
    evidence: 'Behavior coverage, OOD action rate, OPE와 제한된 online check',
    danger: 'Dataset 밖 action의 큰 Q를 실제 improvement로 믿기',
  },
  expert: {
    label: 'Expert query',
    route: 'Imitation · DAgger',
    evidence: 'Learner가 방문한 recovery state의 expert label',
    danger: 'Expert trajectory의 쉬운 state accuracy만 배포 성능으로 보기',
  },
  verifier: {
    label: 'Program verifier',
    route: 'Reasoning RL · RLVR',
    evidence: 'On-policy solution, verifier result와 difficulty별 pass distribution',
    danger: '최종 answer reward만 높이고 과정 다양성·readability를 놓치기',
  },
} as const;

type AccessMode = keyof typeof accessModes;

function DataAccessForkLab() {
  const [mode, setMode] = useState<AccessMode>('log');
  const item = accessModes[mode];
  return (
    <figure data-data-access-lab className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="font-mono text-[11px] font-black text-violet-800 dark:text-violet-300">ACCESS FORK</span>
        <strong className="text-sm">어떤 data를 새로 얻을 수 있는지가 algorithm 후보를 먼저 제한한다</strong>
      </figcaption>
      <div className="border-b border-border bg-muted/15 p-4">
        <SegmentedControl
          label="Data access mode"
          options={Object.entries(accessModes).map(([value, entry]) => ({ value: value as AccessMode, label: entry.label }))}
          value={mode}
          onChange={setMode}
        />
      </div>
      <div className="grid gap-px bg-border md:grid-cols-3">
        <div className="min-w-0 bg-background p-4">
          <p className="text-[10px] font-bold text-muted-foreground">가능한 출발점</p>
          <p data-access-route className="mt-2 text-sm font-bold leading-relaxed">{item.route}</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-[10px] font-bold text-muted-foreground">필요한 증거</p>
          <p className="mt-2 text-xs leading-relaxed">{item.evidence}</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">금지할 shortcut</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.danger}</p>
        </div>
      </div>
    </figure>
  );
}

function RlReleaseGateLab() {
  const [success, setSuccess] = useState(86);
  const [violation, setViolation] = useState(2);
  const [shiftGap, setShiftGap] = useState(11);
  const [latency, setLatency] = useState(74);
  const [trialCount, setTrialCount] = useState(100);
  const [taskReceipt, setTaskReceipt] = useState(false);
  const [safetyReceipt, setSafetyReceipt] = useState(false);
  const [shiftReceipt, setShiftReceipt] = useState(false);
  const [latencyReceipt, setLatencyReceipt] = useState(false);
  const wilson = (rate: number) => {
    const z = 1.96;
    const hits = Math.round((rate / 100) * trialCount);
    const p = hits / trialCount;
    const denominator = 1 + z ** 2 / trialCount;
    const center = (p + z ** 2 / (2 * trialCount)) / denominator;
    const margin = z * Math.sqrt((p * (1 - p) + z ** 2 / (4 * trialCount)) / trialCount) / denominator;
    return { lower: Math.max(0, (center - margin) * 100), upper: Math.min(100, (center + margin) * 100) };
  };
  const successInterval = wilson(success);
  const violationInterval = wilson(violation);
  const gates = [
    { label: 'Task', measured: taskReceipt, pass: taskReceipt && trialCount >= 100 && successInterval.lower >= 85, hard: false, note: `${success}% · n=${trialCount} · 95% 하한 ${successInterval.lower.toFixed(1)}%` },
    { label: 'Safety', measured: safetyReceipt, pass: safetyReceipt && trialCount >= 100 && violationInterval.upper <= 1, hard: true, note: `${violation}% · n=${trialCount} · 95% 상한 ${violationInterval.upper.toFixed(1)}%` },
    { label: 'OOD shift', measured: shiftReceipt, pass: shiftReceipt && shiftGap <= 8, hard: false, note: `${shiftGap} pt · paired slice` },
    { label: 'Latency', measured: latencyReceipt, pass: latencyReceipt && latency <= 80, hard: true, note: `${latency} ms · measured p95` },
  ];
  const unmeasured = gates.some((gate) => !gate.measured);
  const blocked = gates.some((gate) => gate.measured && gate.hard && !gate.pass);
  const review = gates.some((gate) => gate.measured && !gate.hard && !gate.pass);
  const status = unmeasured ? 'HOLD' : blocked ? 'BLOCK' : review ? 'REVIEW' : 'RELEASE';
  const statusTone = blocked
    ? 'border-rose-600/35 bg-rose-500/[0.06] text-rose-800 dark:text-rose-300'
    : review
      ? 'border-amber-600/35 bg-amber-500/[0.06] text-amber-800 dark:text-amber-300'
      : status === 'RELEASE'
        ? 'border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-300'
        : 'border-border bg-muted/20 text-foreground';

  const controls = [
    { label: 'Task success', value: success, set: setSuccess, min: 60, max: 100, suffix: '%', pass: success >= 85 },
    { label: 'Safety violation', value: violation, set: setViolation, min: 0, max: 8, suffix: '%', pass: violation <= 1 },
    { label: 'OOD success gap', value: shiftGap, set: setShiftGap, min: 0, max: 30, suffix: 'pt', pass: shiftGap <= 8 },
    { label: 'P95 action latency', value: latency, set: setLatency, min: 20, max: 140, suffix: 'ms', pass: latency <= 80 },
    { label: 'Evaluation trials', value: trialCount, set: setTrialCount, min: 100, max: 500, step: 50, suffix: '', pass: trialCount >= 100 },
  ];

  return (
    <figure data-rl-release-lab className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-[11px] font-black text-emerald-800 dark:text-emerald-300">RELEASE GATE</span>
        <strong className="text-sm">평균 return 하나가 아니라 실패 비용별 gate를 모두 통과한다</strong>
        <span data-release-status className={`w-fit rounded border px-2 py-1 font-mono text-xs font-black ${statusTone}`}>{status}</span>
      </figcaption>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
        {controls.map((control) => (
          <label key={control.label} className="min-w-0 bg-background p-4 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center justify-between gap-3">
              {control.label}
              <span className={control.pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>{control.value}{control.suffix}</span>
            </span>
            <input
              aria-label={control.label}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(event) => control.set(Number(event.target.value))}
              className="mt-2 block h-11 w-full accent-emerald-700"
            />
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
        {[
          ['task cohort receipt', 'Task cohort', taskReceipt, setTaskReceipt],
          ['safety exposure receipt', 'Safety exposure', safetyReceipt, setSafetyReceipt],
          ['ood paired slice receipt', 'OOD paired slice', shiftReceipt, setShiftReceipt],
          ['latency trace receipt', 'Latency trace', latencyReceipt, setLatencyReceipt],
        ].map(([ariaLabel, label, checked, setter]) => (
          <label key={String(ariaLabel)} className="flex min-h-11 cursor-pointer items-center gap-2 bg-background px-3 py-2 text-[10px] font-bold leading-tight">
            <input aria-label={String(ariaLabel)} type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-emerald-700" />
            <span>{String(label)}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-border p-4 sm:grid-cols-4">
        {gates.map((gate) => {
          const state = !gate.measured ? 'unmeasured' : gate.pass ? 'pass' : 'fail';
          return (
            <div key={gate.label} data-rl-gate-state={state} className={`min-h-24 rounded-md border p-3 ${state === 'pass' ? 'border-emerald-600/30 bg-emerald-500/[0.05]' : state === 'fail' ? 'border-rose-600/30 bg-rose-500/[0.05]' : 'border-border bg-muted/15'}`}>
              <strong className="text-[10px]">{gate.label}</strong>
              <p className="mt-2 text-[9px] font-bold">{state === 'unmeasured' ? '미측정' : state === 'pass' ? '통과' : '실패'}</p>
              <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">{gate.note}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
        <ShieldCheck aria-hidden className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          측정 영수증이 하나라도 없으면 HOLD다. Safety violation과 actuator latency 실패는 BLOCK이고, success 신뢰구간과 OOD gap은 추가 rollout·slice 검토가 가능한 REVIEW로 남긴다.
        </p>
      </div>
    </figure>
  );
}

export default function RlDecisionSystemContracts() {
  return (
    <div className="article-content">
      <section id="decision-entry" className="mb-16 scroll-mt-20">
        <BeginnerOpening
          title="강화학습은 행동 뒤에 달라진 다음 장면까지 배우는 방법이다"
          description={<>강화학습에서는 <strong>agent</strong>가 현재 보이는 정보를 받고 행동을 고른다. 바깥 세계인 <strong>environment</strong>는 그 행동의 결과와 점수, 다음 장면을 돌려준다. 정답표 한 줄을 맞히는 학습과 달리 지금 행동이 다음에 보게 될 데이터까지 바꾼다.</>}
          familiarScene={<>미로에서 왼쪽 문을 열면 다른 방으로 들어가고, 그 방에서만 다음 열쇠를 찾을 수 있다고 하자. 지금 문 선택은 즉시 점수만 바꾸는 것이 아니라 이후의 관찰과 선택지 전체를 바꾼다. 그래서 알고리즘 이름보다 무엇을 보고, 무엇을 할 수 있고, 실패하면 무엇이 망가지는지 먼저 적어야 한다.</>}
          steps={[
            { label: '보이는 것을 고정한다', detail: '센서·문장·숫자 중 agent가 실제로 받는 입력을 적는다.' },
            { label: '가능한 행동을 고정한다', detail: '로봇 명령·도구 호출·token처럼 실제로 바깥에 전달되는 선택을 적는다.' },
            { label: '결과와 한계를 고정한다', detail: '점수뿐 아니라 다음 장면, 실패 비용과 새 데이터 접근 권한을 적는다.' },
          ]}
        />
        <QuestionLead
          question="새 문제를 만나면 학습 알고리즘 이름부터 골라도 될까?"
          answer={<>아직 고르지 않는다. 먼저 <strong>행동이 미래 관측과 학습 data를 바꾸는지</strong>, 새 interaction·simulator·log·expert·verifier 중 무엇에 접근할 수 있는지, 실패하면 무엇이 망가지는지를 적는다. 이 계약이 algorithm family를 먼저 줄인다.</>}
        />

        <ConceptPrimer
          title="알고리즘보다 먼저 분리할 다섯 단어"
          items={[
            { term: 'Observation', meaning: 'Agent에게 실제로 들어오는 sensor, token context 또는 feature.', why: 'World의 진짜 state와 같다고 가정하면 memory와 uncertainty가 사라진다.' },
            { term: 'Action', meaning: 'Policy가 environment에 실제로 전달하는 선택.', why: 'Robot torque, tool call, token은 단위·주기·실패 비용이 서로 다르다.' },
            { term: 'Feedback', meaning: 'Reward, verifier result, preference 또는 safety cost.', why: '무엇을 최적화하고 무엇을 별도 constraint로 둘지 결정한다.' },
            { term: 'Data access', meaning: '새 online rollout, simulator, fixed log, expert query의 가능 범위.', why: '쓸 수 없는 data를 가정한 algorithm은 구현 전에 이미 실패한다.' },
            { term: 'Release gate', meaning: 'Return, constraint, shift, latency를 배포 전 판정하는 규칙.', why: 'Training objective가 제품 승인 기준을 대신하지 못한다.' },
          ]}
        />
      </section>

      <NlpSection id="fit" marker="01" tone="blue" question="Reward라는 숫자가 있으면 모두 강화학습일까?" title="핵심은 점수가 아니라 policy가 다음 data 분포를 만든다는 점이다">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>고양이 사진을 분류하고 정답과 비교하면 한 입력의 예측 오차로 끝난다. 하지만 robot이 왼쪽으로 움직이면 다음 camera frame, 충돌 가능성, 이후 학습할 trajectory가 모두 달라진다. 강화학습은 이 <strong>행동-다음 관측-feedback의 폐루프</strong>를 다룬다.</p>
          <p>LLM reasoning도 같은 형식으로 볼 수 있다. 한 token이 다음 context를 만들고 마지막 answer를 프로그램이 검증한다. 그러나 robot과 보증은 다르다. Reasoning branch의 위험은 reward hacking, exploration collapse와 benchmark leakage이고, robot branch는 actuator latency, contact와 hardware stop까지 필요하다.</p>
        </div>
        <RlFitLab />
        <Misconception>“RL이 더 강력하니 supervised learning 대신 쓰자”가 아니다. Action이 future input을 바꾸지 않는 문제에는 label loss가 더 직접적이고 안정적이다.</Misconception>
      </NlpSection>

      <NlpSection id="environment-contract" marker="02" tone="teal" question="Agent와 environment 사이에서 매 step 무엇이 오가야 할까?" title="Environment는 simulator가 아니라 검증 가능한 입력·출력 protocol이다">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 step은 observation을 읽고 action을 보낸 뒤 reward, 다음 observation과 종료 상태를 받는다. 여기서 <strong>terminated</strong>는 목표·실패 같은 MDP terminal이고, <strong>truncated</strong>는 time limit 같은 외부 중단이다. 둘을 같은 zero bootstrap으로 처리하면 value target이 바뀐다.</p>
          <p>공개 Warehouse 예제에서는 camera와 joint sensor가 observation이고, 가려진 parcel pose가 latent state다. Gripper command의 단위와 주기, 성공 +2, 파손 cost, 6초 timeout을 별도 field로 적는다. 파손 -60을 task reward에 섞는 것만으로는 허용 violation rate와 emergency stop 책임이 생기지 않는다.</p>
        </div>
        <FormulaFrame>
          <MathFormula display>{String.raw`\begin{aligned}
G_{\text{누적}}(\tau)&=\sum_{t=0}^{T-1}\gamma^t r_t\\
J(\pi)&=\mathbb E_{\tau\sim p_\pi}[G(\tau)]\\
\alpha_t&=\underbrace{\pi(a_t\mid o_{\le t})}_{\text{행동 확률}}\\
\beta_t&=\underbrace{P(s_{t+1},o_{t+1}\mid s_t,a_t)}_{\text{환경 전이}}\\
f_t&=\underbrace{\alpha_t\beta_t}_{\text{한 단계가 일어날 확률}}\\
p_\pi(\tau)&=\rho_0(s_0)\prod_{t=0}^{T-1}f_t
\end{aligned}`}</MathFormula>
          <FormulaNote
            meaning="이 식은 한 step의 점수가 아니라 policy와 environment가 함께 만든 trajectory 전체의 기대 feedback을 최적화한다. α_t와 β_t를 곱하면 현재 action 선택과 그 결과 transition이 함께 일어날 한 단계 확률이 된다. 초기 state가 뽑힐 확률 ρ₀(s₀)에서 시작해 모든 단계 확률을 곱하면 trajectory 전체의 확률이 된다. 이 곱은 한 action이 다음 state를 바꾸고, 그 state가 뒤의 모든 선택 조건이 된다는 의존성을 보존한다."
            symbols={[[String.raw`\tau`, 'State·observation·action·reward가 시간순으로 이어진 trajectory'], [String.raw`\gamma`, '먼 feedback의 상대 가중치'], [String.raw`\rho_0`, 'Episode가 시작할 state를 뽑는 초기 state 분포'], [String.raw`\pi`, 'Observation history에서 action distribution을 만드는 policy'], [String.raw`P`, 'Action 뒤 environment transition과 sensor observation을 만드는 과정'], [String.raw`\alpha_t,\beta_t,f_t`, 'Action 확률, environment 전이 확률과 두 값을 곱한 한 단계 확률']]}
          />
        </FormulaFrame>
      </NlpSection>

      <NlpSection id="data-access" marker="03" tone="violet" question="같은 MDP라도 왜 online PPO와 offline RL을 마음대로 바꿔 쓸 수 없을까?" title="새 data를 얻는 권한이 학습 알고리즘보다 먼저 정해진다">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Online RL은 새 policy가 만든 state를 다시 관측할 수 있다. Offline RL은 고정 log 밖의 action 결과를 물어볼 수 없다. Simulator는 반복 가능하지만 현실과 dynamics가 다르다. Expert query는 learner가 실패한 state를 다시 물을 수 있을 때 behavior cloning의 drift를 줄인다. Program verifier는 정답을 자동 채점하지만 물리 안전을 알려 주지는 않는다.</p>
          <p>예를 들어 실제 robot을 하루 120 episode만 움직일 수 있고 simulator의 contact friction이 측정상 현실보다 9% 높다면, 처음부터 real online PPO로 그 예산을 태우지 않는다. Operator log로 imitation·offline warm start를 만들고 simulator에서는 friction 범위를 흔들어 학습한 뒤, 제한된 real episode를 <strong>sim-real paired evaluation과 안전 확인</strong>에 우선 배정한다. 핵심은 숫자 자체가 아니라 실제 interaction 예산과 dynamics gap을 학습·평가 장부에 따로 쓰는 것이다.</p>
        </div>
        <DataAccessForkLab />
        <FormulaFrame>
          <MathFormula display>{String.raw`\begin{aligned}
d^\pi(s)&=(1-\gamma)\underbrace{\sum_{t\ge0}\gamma^t\Pr(s_t=s\mid\pi)}_{\text{policy가 실제로 방문하는 상태 분포}}\\
w_t&=\underbrace{\frac{\pi(a_t\mid s_t)}{\mu(a_t\mid s_t)}}_{\text{target 행동과 log 행동의 차이}}\\
N_{\mathrm{eff}}&=\underbrace{\frac{(\sum_t w_t)^2}{\sum_t w_t^2}}_{\text{가중치가 남긴 유효 표본 수}}
\end{aligned}`}</MathFormula>
          <FormulaNote
            meaning="이 식은 policy를 바꾸면 방문 state 분포도 바뀐다는 사실과, fixed log에서 target policy를 평가할 때 behavior policy와의 비율로 보정해야 함을 함께 보여 준다. 나눗셈은 action 빈도 차이를 보정하지만 denominator가 작으면 weight가 폭증하므로 ESS로 실제 남은 정보량을 다시 본다."
            symbols={[[String.raw`d^\pi`, 'Policy pi가 할인된 시간 동안 만드는 state occupancy'], [String.raw`\mu`, 'Offline log를 수집한 behavior policy'], [String.raw`w_t`, 'Target action과 logged action의 확률 비율'], [String.raw`N_{\mathrm{eff}}`, '극단 weight를 반영한 유효 sample size']]}
          />
        </FormulaFrame>
      </NlpSection>

      <NlpSection id="route" marker="04" tone="amber" question="어떤 순서로 모든 RL 글을 읽어야 할까?" title="전부 읽지 말고 지금 가진 data와 실패 비용에 맞는 한 분기만 연다">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Policy·제어</strong>는 새 rollout을 만들 수 있고 continuous action의 policy shift가 문제일 때 연다. <InternalLink slug="rl-ppo-continuous-control">PPO·연속 제어</InternalLink>에서 배포 action을 먼저 본 뒤, gradient가 막힐 때 <InternalLink slug="rl-policy-gradient-actor-critic">Policy Gradient</InternalLink>로 내려간다.</p>
          <p><strong>Demonstration·Offline</strong>은 real exploration이 비싸고 log나 expert가 있을 때 연다. <InternalLink slug="rl-imitation-offline-learning">모방·Offline RL</InternalLink>에서 coverage, support와 OPE를 먼저 검산한다.</p>
          <p><strong>World Model·Planning</strong>은 simulator를 만들거나 learned dynamics로 interaction을 아끼려 할 때 연다. <InternalLink slug="rl-model-based-world-models">Model-based RL과 World Models</InternalLink>에서 one-step loss보다 rollout exploitation과 real-return gap을 본다.</p>
          <p><strong>State 추정</strong>은 sensor가 world state를 다 보여 주지 않아 action에 필요한 정보를 history에서 복원해야 할 때 연다. <InternalLink slug="rl-pomdp-state-estimation">POMDP·State Estimation</InternalLink>에서 observation, belief, filter와 learned memory를 검산한다.</p>
          <p><strong>Safety·제약</strong>은 실패가 평균 reward로 상쇄될 수 없을 때 연다. <InternalLink slug="rl-safe-constrained-learning">Safe RL</InternalLink>에서 expected cost, runtime shield와 hardware interlock을 서로 다른 보장 층으로 나눈다. 부분 관측과 안전은 함께 나타날 수 있지만 같은 문제가 아니다.</p>
          <p><strong>LLM reasoning</strong>은 이 일반 경로의 응용 사례지만 별도 제품 계약이다. Verifier, rollout compute와 GRPO 구현은 <InternalLink slug="post-training-rlvr">RLVR</InternalLink>와 LLM post-training 경로에서 읽는다.</p>
          <p>어느 분기에서든 return·bootstrap이 막힐 때만 <InternalLink slug="rl-mdp-bellman">MDP·Bellman</InternalLink>과 <InternalLink slug="rl-temporal-difference-dqn">TD·Q-learning</InternalLink>으로 내려간다. 이것이 최소 바닥이다.</p>
        </div>
        <StopRule>Q-learning 이전의 모든 역사와 21편 원문을 기본 선수 과목으로 만들지 않는다. 현재 branch의 target, data assumption 또는 보장 범위를 확인해야 할 때만 접힌 원문을 한 갈래씩 연다.</StopRule>
      </NlpSection>

      <NlpSection id="release" marker="05" tone="green" question="Average return이 좋아졌다면 배포해도 될까?" title="학습 점수와 release 증거를 분리하고 하나라도 위험하면 닫는다">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공개 Warehouse 예제에서 쉬운 parcel이 85%인 log만 보면 성공률을 높이면서 fragile parcel을 더 많이 깨뜨리는 policy도 좋아 보일 수 있다. 평균 성공률은 rare·OOD parcel 성능을 가리고, policy compute가 actuator 주기보다 느리면 simulation score가 높아도 제어 명령은 늦는다.</p>
          <p>따라서 success, violation, distribution shift와 end-to-end latency를 별도 gate로 둔다. 보완 data로 확인할 수 있는 항목은 review로 보내고, 안전과 timing budget은 hard block으로 둔다.</p>
          <p>관측 비율만 보는 것도 부족하다. 성공 <strong>86/100</strong>은 기준 85%를 넘는 것처럼 보이지만 Wilson 95% 하한은 약 77.9%다. 위반 <strong>0/100</strong>도 실제 위반율이 1% 이하임을 증명하지 못하며 95% 상한은 약 3.7%다. 같은 비율이라도 360/400 성공의 하한은 약 86.7%, 0/400 위반의 상한은 약 1.0%로 달라진다. 따라서 비율, 표본 수, slice 정의와 원 trace를 한 묶음으로 보존한다.</p>
        </div>
        <RlReleaseGateLab />
        <FormulaFrame>
          <MathFormula display>{String.raw`\begin{aligned}
\underbrace{\hat p}_{\text{관측 비율}}&=\frac{\underbrace{k}_{\text{사건 횟수}}}{\underbrace{n}_{\text{평가 횟수}}}\\[0.35em]
\underbrace{c}_{\text{보정 중심}}&=\frac{\hat p+z^2/(2n)}{1+z^2/n}\\[0.35em]
\underbrace{m}_{\text{불확실성 폭}}&=\frac{z}{1+z^2/n}\sqrt{\frac{\hat p(1-\hat p)+z^2/(4n)}{n}}\\[0.35em]
[p_L,p_U]&=[c-m,c+m],\qquad z=1.96
\end{aligned}`}</MathFormula>
          <FormulaNote
            meaning="이 식은 같은 관측 비율이라도 평가 횟수가 작으면 불확실성 구간이 넓어짐을 계산한다. Task success에는 보수적인 하한 p_L을, 드문 safety violation에는 보수적인 상한 p_U를 사용해 적은 표본의 낙관을 release 근거로 쓰지 않는다."
            symbols={[[String.raw`k`, '성공 또는 위반이 관측된 episode 수'], [String.raw`n`, '동일 protocol로 실행한 전체 episode 수'], [String.raw`c`, '작은 표본 편향을 보정한 interval 중심'], [String.raw`m`, '95% 신뢰 수준에서 중심 좌우의 불확실성 폭'], [String.raw`p_L,p_U`, 'Wilson score interval의 아래·위 경계']]} />
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display>{String.raw`\begin{aligned}
G_{\mathrm{release}}={}&\underbrace{[M_{all}=1]}_{\text{모두 실측}}\land
\underbrace{[p_{success,L}\ge p_{min}]}_{\text{성공 하한}}\\
&\land\underbrace{[p_{violation,U}\le c_{max}]}_{\text{위반 상한}}\land
\underbrace{[\Delta_{shift}\le \epsilon]}_{\text{분포 이동}}\\
&\land\underbrace{[L_{p95}\le L_{max}]}_{\text{실행 지연}}
\end{aligned}`}</MathFormula>
          <FormulaNote
            meaning="이 식은 측정 여부와 서로 평균내면 안 되는 네 증거를 논리곱으로 묶는다. 논리곱을 쓰는 이유는 높은 task success가 safety violation, 분포 이동이나 늦은 actuator command를 상쇄하지 못하게 하기 위해서다."
            symbols={[[String.raw`M_{all}`, 'Task cohort, safety exposure, OOD paired slice와 latency trace가 모두 존재하면 1'], [String.raw`p_{success,L}`, 'Task success Wilson interval의 보수적 하한'], [String.raw`p_{violation,U}`, 'Safety violation Wilson interval의 보수적 상한'], [String.raw`\Delta_{shift}`, '같은 protocol의 in-distribution과 OOD slice 성능 차이'], [String.raw`L_{p95}`, 'Sensor부터 action 적용까지의 95 percentile latency']]}
          />
        </FormulaFrame>
        <CapabilityCheck
          title="이 글만으로 내려야 하는 결정"
          items={[
            'Static prediction과 policy-induced sequential problem을 구분한다.',
            'Observation과 latent state, task reward와 safety cost를 분리한다.',
            'Live·simulator·log·expert·verifier access로 가능한 branch를 줄인다.',
            '현재 목표 한 분기와 막힐 때의 최소 기반만 선택한다.',
            'Average return 밖의 shift·constraint·latency gate로 release를 닫는다.',
            'LLM reasoning과 physical control의 보장 경계를 섞지 않는다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'Gymnasium · Env API', href: 'https://gymnasium.farama.org/api/env/', note: 'step(action)이 observation, reward, terminated, truncated와 info를 반환하는 실행 interface의 공식 문서.' },
          { label: 'DeepSeek-AI · DeepSeek-R1', href: 'https://arxiv.org/abs/2501.12948', note: 'Reasoning RL, R1-Zero와 cold-start를 포함한 R1 training 범위의 1차 출처. 일반 robot RL 보증으로 확대하지 않는다.' },
          { label: 'Google DeepMind · Gemini Robotics-ER 1.6', href: 'https://deepmind.google/blog/gemini-robotics-er-1-6/', note: 'High-level embodied reasoning이 VLA·tool을 호출하고 physical safety를 별도 평가하는 현재 system boundary 사례.' },
          { label: 'Google DeepMind · Gemini Robotics-ER 1.6 Model Card', href: 'https://deepmind.google/models/model-cards/gemini-robotics-er-1-6/', note: '입력·출력, intended usage, evaluation과 known limitation을 release 글과 분리해 확인하는 공식 model card.' },
          { label: 'Yang et al. · RISE', href: 'https://arxiv.org/abs/2602.11075', note: 'Compositional world model에서 imagined rollout과 advantage를 만들어 real interaction 비용을 줄이는 2026 robot RL 연구. ER 1.6의 high-level reasoner와 같은 역할로 합치지 않는다.' },
          { label: 'Mulkana et al. · ContactRL', href: 'https://arxiv.org/abs/2512.03707', note: 'Contact reward 학습 위에 kinetic-energy control barrier shield를 별도로 둔 사례. Reward success와 runtime safety guarantee의 층을 분리한다.' },
          { label: 'Google DeepMind · RL Unplugged', href: 'https://deepmind.google/blog/rl-unplugged-benchmarks-for-offline-reinforcement-learning/', note: 'Fixed logged data, standardized dataset·environment·evaluation protocol의 공식 연구 설명.' },
          { label: 'Google DeepMind · Active Offline Policy Selection', href: 'https://deepmind.google/blog/active-offline-policy-selection/', note: 'OPE만으로 끝내지 않고 제한된 real interaction으로 candidate policy를 선택하는 배포 경계.' },
          { label: 'Hafner et al. · DreamerV3', href: 'https://www.nature.com/articles/s41586-025-08744-2', note: 'Learned world model과 latent imagination actor-critic의 출판본. 모든 physical deployment 보증을 뜻하지 않는다.' },
        ]} />
      </NlpSection>
    </div>
  );
}
