import { useState, type ReactNode } from 'react';

function ExplorerShell({ eyebrow, title, description, controls, children }: {
  eyebrow: string;
  title: string;
  description: string;
  controls: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] md:items-end">
        <div className="min-w-0">
          <p className="text-xs font-black text-muted-foreground">{eyebrow}</p>
          <p className="mt-2 text-base font-bold leading-snug">{title}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="min-w-0">{controls}</div>
      </div>
      {children}
    </div>
  );
}

function Switch<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-muted-foreground">{label}</p>
      <div
        className="grid overflow-hidden rounded-md border border-border bg-background p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`min-h-11 rounded-sm px-2 text-xs font-bold transition-colors ${value === option.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type Difficulty = 'simple' | 'deep';

export function ReasoningComputeExplorer() {
  const [difficulty, setDifficulty] = useState<Difficulty>('deep');
  const [thinkingSteps, setThinkingSteps] = useState(6);
  const [candidates, setCandidates] = useState(2);
  const required = difficulty === 'simple' ? 2 : 7;
  const missing = Math.max(0, required - thinkingSteps);
  const wastePerTrace = Math.max(0, thinkingSteps - required);
  const totalSteps = thinkingSteps * candidates;

  return (
    <ExplorerShell
      eyebrow="학습 계산 ≠ 추론 시 계산"
      title="더 오래 생각하기와 더 잘 학습하기는 같은 축이 아니다"
      description="아래 값은 benchmark 예측이 아니라 계산 구조를 분리하는 개념 모형이다. 후보 수와 thinking 길이를 늘리면 coverage 기회와 비용이 함께 커진다."
      controls={<Switch label="문제에 필요한 최소 reasoning depth" value={difficulty} onChange={setDifficulty} options={[{ value: 'simple', label: '간단 · 2 step' }, { value: 'deep', label: '깊음 · 7 step' }]} />}
    >
      <div className="grid gap-7 p-4 sm:p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)]">
        <div className="min-w-0 space-y-6">
          <label htmlFor="reasoning-step-budget" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span>후보 하나의 thinking budget</span>
            <span className="font-mono text-foreground">{thinkingSteps} step</span>
            <input id="reasoning-step-budget" type="range" min="1" max="10" value={thinkingSteps} onChange={(event) => setThinkingSteps(Number(event.target.value))} className="col-span-2 block w-full accent-violet-600" />
          </label>
          <label htmlFor="reasoning-candidate-count" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span>병렬 search 후보</span>
            <span className="font-mono text-foreground">k = {candidates}</span>
            <input id="reasoning-candidate-count" type="range" min="1" max="4" value={candidates} onChange={(event) => setCandidates(Number(event.target.value))} className="col-span-2 block w-full accent-blue-600" />
          </label>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground" aria-label="계산 단계 범례">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-5 rounded-sm bg-blue-600/35" aria-hidden="true" />필요 계산</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-5 rounded-sm bg-amber-500/30" aria-hidden="true" />최소 깊이 뒤 추가 계산</span>
          </div>
          <div className="space-y-2">
            {Array.from({ length: candidates }, (_, candidate) => (
              <div key={candidate} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
                <span className="font-mono text-xs font-bold text-muted-foreground">후보 {candidate + 1}</span>
                <div className="grid min-w-0 gap-1" style={{ gridTemplateColumns: `repeat(${thinkingSteps}, minmax(0, 1fr))` }}>
                  {Array.from({ length: thinkingSteps }, (_, step) => (
                    <span
                      key={step}
                      className={`h-5 rounded-sm ${step < required ? 'bg-blue-600/30' : 'bg-amber-500/25'}`}
                      aria-label={step < required ? `${step + 1}단계, 필요한 reasoning 범위` : `${step + 1}단계, 최소 깊이 뒤 추가 계산`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['총 계산', `${totalSteps}`], ['부족', `${missing}`], ['추가', `${wastePerTrace * candidates}`]].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border px-2 py-3">
                <p className="font-mono text-lg font-black">{value}</p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">{label} step</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 rounded-md border p-4 ${missing > 0 ? 'border-rose-500/35 bg-rose-500/[0.04]' : wastePerTrace > 0 ? 'border-amber-500/35 bg-amber-500/[0.04]' : 'border-emerald-500/35 bg-emerald-500/[0.04]'}`}>
            <p className="text-xs font-bold">{missing > 0 ? '필요한 깊이에 아직 도달하지 못했다' : wastePerTrace > 0 ? '정답 이후의 overthinking 가능성이 생겼다' : '필요 깊이와 budget이 맞았다'}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">병렬 후보는 서로 다른 경로를 탐색할 기회를 주지만, verifier나 선택기가 없다면 계산만 늘고 어느 답을 채택할지 결정할 수 없다.</p>
          </div>
        </div>
      </div>
    </ExplorerShell>
  );
}

type CreditScenario = 'late' | 'early';
type RewardSignal = 'outcome' | 'process';

export function CreditAssignmentExplorer() {
  const [scenario, setScenario] = useState<CreditScenario>('late');
  const [signal, setSignal] = useState<RewardSignal>('outcome');
  const steps = ['문제 분해', '가정 선택', '계산 전개', '최종 검산'];
  const valid = scenario === 'late' ? [true, true, true, false] : [true, false, false, false];
  const continuation = scenario === 'late' ? [0.82, 0.76, 0.68, 0.08] : [0.78, 0.18, 0.11, 0.07];
  const firstFailure = valid.findIndex((value) => !value);

  return (
    <ExplorerShell
      eyebrow="희소 보상 · 책임 배분"
      title="최종 오답 0점만으로 어느 step을 고쳐야 할까?"
      description="Outcome reward는 결과를 싸게 검증하지만 중간 step의 책임을 직접 알려 주지 않는다. Process signal은 더 조밀하지만 continuation sampling이나 별도 checker 비용이 든다."
      controls={<Switch label="표시할 reward signal" value={signal} onChange={setSignal} options={[{ value: 'outcome', label: '최종 결과만' }, { value: 'process', label: '중간 과정까지' }]} />}
    >
      <div className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setScenario('late')} aria-pressed={scenario === 'late'} className={`min-h-11 rounded-md border px-3 text-xs font-bold ${scenario === 'late' ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>마지막 검산 실수</button>
          <button type="button" onClick={() => setScenario('early')} aria-pressed={scenario === 'early'} className={`min-h-11 rounded-md border px-3 text-xs font-bold ${scenario === 'early' ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>초기 가정 오류</button>
        </div>

        <ol className="grid gap-0 sm:gap-2 sm:grid-cols-4" aria-label="추론 단계별 성공 가능성">
          {steps.map((step, index) => (
            <li key={step} className={`relative min-w-0 border-b border-l-2 py-4 pl-5 pr-2 last:border-b-0 sm:rounded-md sm:border sm:p-4 ${signal === 'process' && index === firstFailure ? 'border-l-rose-500 bg-rose-500/[0.05] sm:border-rose-500/45' : 'border-border'}`}>
              <span className={`absolute -left-[7px] top-5 h-3 w-3 rounded-full border-2 bg-background sm:hidden ${signal === 'process' && index === firstFailure ? 'border-rose-500' : 'border-muted-foreground'}`} aria-hidden="true" />
              <p className="font-mono text-xs font-black text-muted-foreground">단계 {index + 1}</p>
              <p className="mt-2 text-sm font-bold">{step}</p>
              <p className="mt-3 font-mono text-xs font-bold">
                {signal === 'outcome' ? 'credit: ?' : `계속 성공 ${Math.round(continuation[index] * 100)}%`}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{signal === 'outcome' ? '최종 reward 0만 공유' : valid[index] ? '아직 복구 가능한 경로' : '여기서 성공률이 급락'}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-md border border-border bg-muted/15 p-4 text-sm leading-relaxed">
          {signal === 'outcome'
            ? 'Outcome verifier는 이 trajectory 전체가 실패했다는 사실만 준다. 모든 token을 같은 원인으로 취급하면 올바른 앞부분까지 함께 약화할 수 있다.'
            : `이 예시에서는 ${steps[firstFailure]}에서 continuation 성공률이 급락한다. 다만 이 값은 개념 예시이며 실제 process reward는 추가 rollout, reward model 또는 proof trace 검증이 필요하다.`}
        </div>
      </div>
    </ExplorerShell>
  );
}

type EntropyPhase = 'broad' | 'narrow';

export function ExplorationEntropyExplorer() {
  const [phase, setPhase] = useState<EntropyPhase>('broad');
  const probabilities = phase === 'broad' ? [0.34, 0.28, 0.22, 0.16] : [0.92, 0.05, 0.02, 0.01];
  const entropy = -probabilities.reduce((sum, probability) => sum + probability * Math.log(probability), 0);
  const effectiveStrategies = Math.exp(entropy);
  const strategies = ['직접 계산', '역산', 'case 분해', '도구 검산'];

  return (
    <ExplorerShell
      eyebrow="탐색 · 엔트로피 붕괴"
      title="Reward가 오르면서 가능한 풀이가 줄어들 수 있다"
      description="막대는 실제 vocabulary token 분포가 아니라, token-level entropy가 풀이 경로 다양성에 미치는 영향을 압축한 교육용 전략 분포다. 한 경로에 확률이 몰리면 pass@1은 오를 수 있어도 다른 정답 경로를 탐색할 여지는 줄어든다."
      controls={<Switch label="개념적 policy 분포" value={phase} onChange={setPhase} options={[{ value: 'broad', label: '탐색 유지' }, { value: 'narrow', label: '분포 붕괴' }]} />}
    >
      <div className="grid gap-7 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-4">
          {strategies.map((strategy, index) => (
            <div key={strategy}>
              <div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold">{strategy}</span><span className="font-mono">{Math.round(probabilities[index] * 100)}%</span></div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-sm bg-muted"><span className={`block h-full transition-[width] duration-500 ${phase === 'narrow' && index === 0 ? 'bg-rose-600' : 'bg-violet-600'}`} style={{ width: `${probabilities[index] * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-xs font-bold text-muted-foreground">관찰값</p>
          <p className="mt-2 font-mono text-2xl font-black">H = {entropy.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">유효 전략 수 ≈ {effectiveStrategies.toFixed(1)}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">같은 reward를 얻는 여러 경로가 있어도 고확률 token만 계속 강화하면 낮은 확률의 정답 경로가 sampling에서 사라진다. 더 많은 RL step이 자동으로 더 넓은 reasoning을 뜻하지 않는 이유다.</p>
        </div>
      </div>
    </ExplorerShell>
  );
}

type TraceKind = 'faithful' | 'disconnected' | 'hack';
type Evaluator = 'outcome' | 'hidden' | 'monitor';

export function MonitorabilityExplorer() {
  const [trace, setTrace] = useState<TraceKind>('disconnected');
  const [evaluator, setEvaluator] = useState<Evaluator>('outcome');
  const states = {
    faithful: { title: 'Reasoning이 답 계산에 실제 사용됨', publicPass: true, hiddenPass: true, monitorAlert: false },
    disconnected: { title: '설명은 그럴듯하지만 답과 인과적으로 분리됨', publicPass: true, hiddenPass: true, monitorAlert: true },
    hack: { title: '공개 checker의 빈틈만 만족', publicPass: true, hiddenPass: false, monitorAlert: true },
  } as const;
  const current = states[trace];
  const reward = evaluator === 'outcome' ? current.publicPass : evaluator === 'hidden' ? current.hiddenPass : current.publicPass;
  const alert = evaluator === 'monitor' && current.monitorAlert;

  return (
    <ExplorerShell
      eyebrow="보상 편법 ≠ 추론 감시 실패"
      title="정답을 맞혔다는 사실과 reasoning을 믿을 수 있다는 사실은 다르다"
      description="아래 alert는 monitor가 완벽하다는 뜻이 아닌 교육용 가상 출력이다. Hidden test는 checker 편법을 잡을 수 있지만, 맞는 답을 만든 visible CoT가 실제 계산 원인인지까지 증명하지는 못한다."
      controls={<Switch label="평가 장치" value={evaluator} onChange={setEvaluator} options={[{ value: 'outcome', label: '공개 outcome' }, { value: 'hidden', label: 'Hidden test' }, { value: 'monitor', label: 'CoT monitor' }]} />}
    >
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-3">
          {([
            ['faithful', '충실한 trace'],
            ['disconnected', '답과 분리된 trace'],
            ['hack', 'Checker 편법'],
          ] as Array<[TraceKind, string]>).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setTrace(value)} aria-pressed={trace === value} className={`min-h-11 rounded-md border px-3 text-xs font-bold ${trace === value ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{label}</button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="rounded-md border border-border p-4">
            <p className="text-xs font-black text-muted-foreground">관찰된 trajectory</p>
            <p className="mt-2 text-sm font-bold">{current.title}</p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs">
              <span className="rounded-md border border-border p-3">Visible CoT</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-md border border-border p-3">Final answer</span>
            </div>
          </div>
          <div className={`rounded-md border p-4 ${!reward || alert ? 'border-rose-500/40 bg-rose-500/[0.04]' : 'border-emerald-500/40 bg-emerald-500/[0.04]'}`}>
            <p className="text-xs font-black text-muted-foreground">평가 결과</p>
            <p className="mt-2 font-mono text-xl font-black">reward = {reward ? 1 : 0}</p>
            <p className="mt-1 text-xs font-bold">monitor alert = {alert ? 'ON' : 'OFF'}</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{evaluator === 'outcome' ? '결과만 맞으면 세 trace를 구분하지 못한다.' : evaluator === 'hidden' ? '편법은 잡지만 faithful와 disconnected reasoning은 모두 통과한다.' : '의심 trace를 표시할 수 있지만 monitor 자체도 오판하거나 학습에 의해 회피될 수 있다.'}</p>
          </div>
        </div>
      </div>
    </ExplorerShell>
  );
}
