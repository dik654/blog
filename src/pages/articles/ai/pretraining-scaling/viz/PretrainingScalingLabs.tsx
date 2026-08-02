import { useMemo, useState } from 'react';
import { Activity, Calculator, CheckCircle2, Circle, Database, Gauge, RotateCcw, Server } from 'lucide-react';

function FigureHeader({ eyebrow, title, metric }: { eyebrow: string; title: string; metric: string }) {
  return (
    <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className="w-fit rounded-sm border border-border bg-background px-2 py-1 font-mono text-xs font-bold text-muted-foreground">{metric}</span>
    </figcaption>
  );
}

function MetricCell({ label, value, note, tone = 'normal' }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn' }) {
  const color = tone === 'good' ? 'text-emerald-700 dark:text-emerald-300' : tone === 'warn' ? 'text-amber-700 dark:text-amber-300' : 'text-foreground';
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words font-mono text-xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Segments<T extends number>({ label, values, value, onChange, suffix = '' }: { label: string; values: readonly T[]; value: T; onChange: (value: T) => void; suffix?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className={`mt-2 grid gap-1 rounded-md border border-border p-1`} style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} aria-pressed={value === option} className={`min-h-11 min-w-11 rounded px-1 text-xs font-bold ${value === option ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>
            {option}{suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PretrainingBudgetLab() {
  const [parameters, setParameters] = useState<4 | 9>(4);
  const [trainingTokens, setTrainingTokens] = useState(160);
  const [uniqueTokens, setUniqueTokens] = useState(120);
  const [promptTokens, setPromptTokens] = useState<0 | 10 | 80>(10);
  const [outputTokens, setOutputTokens] = useState<1 | 10 | 100>(10);
  const [samples, setSamples] = useState<1 | 4 | 16>(1);

  const trainingZettaFlops = 0.006 * parameters * trainingTokens;
  const inferenceZettaFlops = 0.002 * parameters * (promptTokens + outputTokens * samples);
  const totalZettaFlops = trainingZettaFlops + inferenceZettaFlops;
  const tokensPerParameter = trainingTokens / parameters;
  const dataPasses = trainingTokens / uniqueTokens;
  const trainingShare = totalZettaFlops === 0 ? 0 : trainingZettaFlops / totalZettaFlops * 100;
  const inferenceShare = 100 - trainingShare;
  const status = dataPasses > 4
    ? { label: '반복 검증 필요', tone: 'warn' as const, detail: '같은 고유 corpus를 네 번 넘게 소비한다. Validation loss와 memorization curve가 계속 좋아지는지 확인해야 한다.' }
    : inferenceShare > 50
      ? { label: '배포 비용 우세', tone: 'good' as const, detail: '이 설정에서는 생성 단계의 누적 연산이 training보다 크다. 더 작은 모델을 오래 학습하는 후보를 반드시 함께 비교한다.' }
      : { label: 'Pilot 필요', tone: 'normal' as const, detail: '비율만으로 품질은 결정되지 않는다. 같은 tokenizer·recipe로 작은 IsoFLOP pilot을 돌려 loss와 downstream curve를 맞춘다.' };

  return (
    <figure data-pretraining-budget-lab className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="TRAIN → TEST BUDGET LAB" title="학습 한 번과 앞으로 생성할 token을 같은 원장에 올린다" metric={status.label} />
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        <Segments label="Dense model" values={[4, 9] as const} value={parameters} onChange={setParameters} suffix="B" />
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          학습 token · {trainingTokens}B
          <input aria-label="학습 token" className="mt-2 block h-11 w-full cursor-pointer accent-blue-700" type="range" min="40" max="720" step="40" value={trainingTokens} onChange={(event) => setTrainingTokens(Number(event.target.value))} />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          고유 token · {uniqueTokens}B
          <input aria-label="고유 token" className="mt-2 block h-11 w-full cursor-pointer accent-emerald-700" type="range" min="20" max="360" step="20" value={uniqueTokens} onChange={(event) => setUniqueTokens(Number(event.target.value))} />
        </label>
        <Segments label="배포 prompt" values={[0, 10, 80] as const} value={promptTokens} onChange={setPromptTokens} suffix="B" />
        <Segments label="배포 output" values={[1, 10, 100] as const} value={outputTokens} onChange={setOutputTokens} suffix="B" />
        <Segments label="문제당 sample" values={[1, 4, 16] as const} value={samples} onChange={setSamples} suffix="×" />
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(15rem,.75fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><p className="text-xs font-semibold text-muted-foreground">생애 compute 구성</p><p className="mt-1 font-mono text-2xl font-black">{totalZettaFlops.toFixed(2)} ZFLOPs</p></div>
            <p className="max-w-xs text-right text-xs leading-relaxed text-muted-foreground">Dense Transformer 교육용 근사 · optimizer, attention, cache와 hardware utilization은 별도</p>
          </div>
          <div className="mt-4 overflow-hidden rounded-md border border-border bg-muted/20 p-2">
            <div className="flex h-12 min-w-0 overflow-hidden rounded-sm" aria-label="training과 inference compute 비율">
              <div className="flex min-w-0 items-center bg-blue-600 px-2 text-xs font-bold text-white" style={{ width: `${trainingShare}%` }}>{trainingShare >= 18 ? `학습 ${trainingShare.toFixed(0)}%` : ''}</div>
              <div className="flex min-w-0 items-center justify-end bg-violet-600 px-2 text-xs font-bold text-white" style={{ width: `${inferenceShare}%` }}>{inferenceShare >= 18 ? `생성 ${inferenceShare.toFixed(0)}%` : ''}</div>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <p className="flex items-center gap-2"><Calculator className="h-3.5 w-3.5 text-blue-600" /><strong>학습</strong><span className="font-mono text-muted-foreground">6ND ≈ {trainingZettaFlops.toFixed(2)} ZF</span></p>
              <p className="flex items-center gap-2 sm:justify-end"><Server className="h-3.5 w-3.5 text-violet-600" /><strong>서빙</strong><span className="font-mono text-muted-foreground">2N(Qprompt+kQout) ≈ {inferenceZettaFlops.toFixed(2)} ZF</span></p>
            </div>
          </div>
          <div className={`mt-4 border-l-2 px-4 py-3 ${status.tone === 'warn' ? 'border-amber-600 bg-amber-500/[0.04]' : status.tone === 'good' ? 'border-emerald-600 bg-emerald-500/[0.04]' : 'border-border bg-muted/15'}`}>
            <p className="text-sm font-bold">{status.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{status.detail}</p>
          </div>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-1">
          <MetricCell label="Token / parameter" value={`${tokensPerParameter.toFixed(1)}`} note="D/N. 보편적인 합격선이 아니라 pilot 위치를 설명하는 좌표" />
          <MetricCell label="고유 corpus 반복" value={`${dataPasses.toFixed(1)}×`} note="학습 token D ÷ 고유 token U" tone={dataPasses > 4 ? 'warn' : 'normal'} />
          <MetricCell label="문제당 inference" value={`${samples} samples`} note={`${promptTokens}B prompt는 공유, ${outputTokens}B output은 ${samples}개 후보`} tone={samples > 1 ? 'good' : 'normal'} />
        </div>
      </div>
    </figure>
  );
}

type PilotCandidate = { parameters: number; tokens: number; modelTerm: number; dataTerm: number; loss: number };

export function IsoFlopPilotLab() {
  const [budget, setBudget] = useState<2 | 8 | 32>(8);
  const [selected, setSelected] = useState(4);
  const candidates = useMemo<PilotCandidate[]>(() => [1, 4, 9, 18].map((parameters) => {
    const tokens = budget / (0.006 * parameters);
    const modelTerm = 0.45 * parameters ** -0.3;
    const dataTerm = 1.2 * tokens ** -0.3;
    return { parameters, tokens, modelTerm, dataTerm, loss: 1.5 + modelTerm + dataTerm };
  }), [budget]);
  const best = candidates.reduce((left, right) => left.loss < right.loss ? left : right);
  const active = candidates.find((candidate) => candidate.parameters === selected) ?? candidates[0];
  const maxLoss = Math.max(...candidates.map((candidate) => candidate.loss));
  const minLoss = Math.min(...candidates.map((candidate) => candidate.loss));

  return (
    <figure data-isoflop-pilot-lab className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="ISOFLOP PILOT" title="같은 compute에서 model을 키우면 학습 가능한 token은 줄어든다" metric={`demo optimum · ${best.parameters}B`} />
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5">
        <Segments label="고정 training compute" values={[2, 8, 32] as const} value={budget} onChange={setBudget} suffix=" ZF" />
        <button type="button" onClick={() => { setBudget(8); setSelected(4); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-bold hover:bg-muted"><RotateCcw className="h-3.5 w-3.5" />초기화</button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map((candidate) => {
            const isBest = candidate.parameters === best.parameters;
            const isActive = candidate.parameters === active.parameters;
            const normalizedHeight = 32 + ((maxLoss - candidate.loss) / Math.max(0.001, maxLoss - minLoss)) * 58;
            return (
              <button key={candidate.parameters} type="button" onClick={() => setSelected(candidate.parameters)} aria-pressed={isActive} className={`min-h-44 min-w-0 rounded-md border p-4 text-left transition-colors ${isActive ? 'border-blue-600/50 bg-blue-500/[0.05]' : 'border-border hover:bg-muted/25'}`}>
                <span className="flex items-center justify-between gap-2"><span className="font-mono text-lg font-black">{candidate.parameters}B</span>{isBest && <span className="rounded-sm bg-emerald-600 px-1.5 py-0.5 text-xs font-black text-white">LOWEST</span>}</span>
                <span className="mt-3 flex h-14 items-end overflow-hidden rounded-sm bg-muted/30"><span className="block w-full bg-blue-500/75" style={{ height: `${normalizedHeight}%` }} /></span>
                <span className="mt-3 block font-mono text-xs font-bold">{candidate.tokens.toFixed(0)}B tokens</span>
                <span className="mt-1 block text-xs text-muted-foreground">예측 loss · {candidate.loss.toFixed(3)}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <MetricCell label="선택한 model" value={`${active.parameters}B`} note={`고정 compute에서 ${active.tokens.toFixed(0)}B token 학습`} />
          <MetricCell label="Model 부족 항" value={active.modelTerm.toFixed(3)} note="N을 키우면 내려가는 가상 pilot 항" />
          <MetricCell label="Data 부족 항" value={active.dataTerm.toFixed(3)} note="D가 줄면 커지는 가상 pilot 항" tone={active.parameters > best.parameters ? 'warn' : 'normal'} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">중요:</strong> 이 loss 계수는 UI 동작을 설명하기 위한 가상 값이다. 실제 최적점은 자신의 tokenizer, architecture, optimizer, corpus와 held-out loss로 다시 fit해야 한다. 이 Viz의 결론은 “{best.parameters}B가 항상 최적”이 아니라 같은 FLOPs의 여러 N·D 조합을 먼저 측정하라는 것이다.</p>
      </div>
    </figure>
  );
}

const runStages = [
  { icon: Gauge, label: '01 · 목표 고정', detail: '품질 metric, latency, memory, 예상 생성 token과 sample 수를 먼저 적는다.' },
  { icon: Activity, label: '02 · Pilot curve', detail: '작은 N·D grid를 같은 tokenizer·recipe·FLOPs에서 학습해 loss curve를 fit한다.' },
  { icon: Database, label: '03 · Data audit', detail: '고유 token, 반복 횟수, contamination과 domain coverage를 별도 ledger로 검증한다.' },
  { icon: Server, label: '04 · End-to-end gate', detail: 'Post-training 뒤 task 품질과 실제 serving 비용까지 통과한 설정만 full run으로 올린다.' },
];

export function PretrainingRunGate() {
  const [receipts, setReceipts] = useState(() => runStages.map(() => false));
  const passed = receipts.filter(Boolean).length;
  const approved = passed === runStages.length;

  const toggleReceipt = (index: number) => {
    setReceipts((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)));
  };

  return (
    <figure
      data-pretraining-run-gate
      data-receipts-passed={passed}
      data-full-run-approved={approved}
      className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border"
    >
      <FigureHeader eyebrow="FULL-RUN GATE" title="Scaling law는 결재가 아니라 다음 실험을 줄이는 도구다" metric={`${passed}/4 RECEIPTS`} />
      <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {runStages.map((stage, index) => {
          const Icon = stage.icon;
          const checked = receipts[index];
          return (
            <button
              key={stage.label}
              type="button"
              onClick={() => toggleReceipt(index)}
              aria-pressed={checked}
              className={`min-h-36 min-w-0 rounded-md border p-4 text-left transition-colors ${checked ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-border bg-background hover:bg-muted/40'}`}
            >
              <span className="flex items-center justify-between gap-2">
                <Icon className="h-4 w-4" />
                <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  {checked ? <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" /> : <Circle className="h-4 w-4" aria-hidden="true" />}
                  {checked ? 'RECEIPT OK' : `REQUIRED ${index + 1}/4`}
                </span>
              </span>
              <strong className="mt-4 block text-sm">{stage.label}</strong>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{stage.detail}</span>
            </button>
          );
        })}
      </div>
      <div className={`border-t px-4 py-4 sm:px-5 ${approved ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-border bg-muted/20'}`} aria-live="polite">
        <p className="text-sm font-bold">{approved ? 'Full run 승인 조건 충족' : `Full run 보류 · 영수증 ${4 - passed}개 남음`}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{approved ? '네 증거가 모두 있어도 실제 대규모 실행 전 비용 상한과 중단 조건을 다시 확인한다.' : '카드를 눌러 확보한 증거를 표시한다. 하나라도 비어 있으면 모델 크기만 보고 대규모 학습을 시작하지 않는다.'}</p>
      </div>
    </figure>
  );
}
