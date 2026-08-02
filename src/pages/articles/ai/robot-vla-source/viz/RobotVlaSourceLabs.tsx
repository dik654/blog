import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Bot,
  Camera,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Database,
  Gauge,
  Image,
  Languages,
  MemoryStick,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react';

type Tone = 'neutral' | 'good' | 'warn';

function SourceFigure({
  eyebrow,
  title,
  children,
  footer,
  data,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  data: Record<string, string>;
}) {
  return (
    <figure
      {...data}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      {children}
      <div className="border-t border-border px-4 py-4 text-xs font-semibold leading-relaxed text-muted-foreground sm:px-5">
        {footer}
      </div>
    </figure>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <div
        className="grid gap-px overflow-hidden rounded-md border border-border bg-border"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`min-h-11 min-w-0 bg-background px-2 py-2 text-xs font-bold leading-tight transition-colors ${
              value === option.value
                ? 'shadow-[inset_0_-2px_0_0_currentColor]'
                : 'text-muted-foreground hover:bg-muted/35'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="grid min-h-16 w-full min-w-0 grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 sm:px-5"
    >
      <span className="min-w-0">
        <strong className="block text-xs">{label}</strong>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-10 rounded-full border transition-colors ${
          value
            ? 'border-emerald-600/45 bg-emerald-500/15'
            : 'border-border bg-muted/40'
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-border bg-background transition-transform ${
            value ? 'translate-x-[1.18rem]' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

function Metric({
  label,
  value,
  note,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  note: string;
  tone?: Tone;
}) {
  const color =
    tone === 'good'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'warn'
        ? 'text-rose-700 dark:text-rose-300'
        : 'text-foreground';
  return (
    <div className="min-w-0 bg-background p-3.5">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words font-mono text-base font-black leading-snug ${color}`}>{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Verdict({
  pass,
  title,
  detail,
}: {
  pass: boolean;
  title: string;
  detail: string;
}) {
  const Icon = pass ? CheckCircle2 : TriangleAlert;
  return (
    <div className="flex min-w-0 gap-3 border-t border-border bg-muted/15 px-4 py-4 sm:px-5">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${pass ? 'text-emerald-700' : 'text-rose-700'}`} />
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

export function Pi07PromptContractLab() {
  const [metadata, setMetadata] = useState(true);
  const [evaluationData, setEvaluationData] = useState(true);
  const [subgoal, setSubgoal] = useState(true);
  const distinguishable = [metadata, evaluationData, subgoal].filter(Boolean).length;
  const safeMixedQuality = metadata;

  return (
    <SourceFigure
      data={{ 'data-pi07-prompt-lab': '' }}
      eyebrow="π0.7 PROMPT CONTRACT LAB"
      title="서로 다른 품질의 행동을 섞으려면 데이터와 문맥을 함께 늘려야 한다"
      footer="논문의 Fig. 7은 metadata 또는 autonomous evaluation data를 뺀 두 ablation이 모두 전체 모델보다 낮음을 보인다. Subgoal은 dropout 덕분에 선택적으로 뺄 수 있지만 공간적 목표를 덜 명확하게 만든다."
    >
      <div className="grid min-w-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <Toggle
            label="Episode metadata"
            detail="속도 · 품질 1–5 · 실수 여부를 행동과 함께 조건화"
            value={metadata}
            onChange={setMetadata}
          />
          <Toggle
            label="Autonomous evaluation data"
            detail="실패와 π*0.6 specialist rollout을 training mixture에 포함"
            value={evaluationData}
            onChange={setEvaluationData}
          />
          <Toggle
            label="Visual subgoal"
            detail="현재 장면 뒤에 와야 할 가까운 미래 상태를 multi-view image로 지정"
            value={subgoal}
            onChange={setSubgoal}
          />
        </div>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric
              label="행동 mode 구분"
              value={`${distinguishable}/3`}
              note="Task label 외에 전략을 분리하는 신호"
              tone={distinguishable === 3 ? 'good' : 'warn'}
            />
            <Metric
              label="실패 장면 coverage"
              value={evaluationData ? '유지' : '제거'}
              note="배포 policy가 만든 상태를 다시 보는가"
              tone={evaluationData ? 'good' : 'warn'}
            />
            <Metric
              label="원하는 runtime mode"
              value={metadata ? '빠름 · 품질 5 · 실수 없음' : '지정 불가'}
              note="Training label을 test-time steering에 재사용"
              tone={metadata ? 'good' : 'warn'}
            />
          </div>
          <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {[
              ['Expert demo', '속도 2,000 · 품질 5 · 실수 없음', metadata],
              ['느린 성공', '속도 8,000 · 품질 4 · 실수 없음', metadata],
              ['실패 rollout', '속도 6,000 · 품질 1 · 실수 있음', metadata && evaluationData],
              ['RL specialist', '속도 1,500 · 품질 5 · 실수 없음', metadata && evaluationData],
            ].map(([name, detail, usable]) => (
              <div key={name as string} className="min-w-0 bg-background p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold">{name as string}</p>
                  <span className={`font-mono text-xs font-black ${usable ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {usable ? '구분됨' : '모호함'}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Verdict
        pass={safeMixedQuality && evaluationData}
        title={safeMixedQuality && evaluationData ? '혼합 품질 data를 조건부로 사용할 수 있다' : '더 많은 data가 오히려 평균 행동을 흐릴 수 있다'}
        detail={
          safeMixedQuality && evaluationData
            ? '낮은 품질 장면은 상태 coverage로 남기되, runtime에는 높은 품질 mode를 요청한다.'
            : 'Metadata 없이 실패와 느린 성공을 넣으면 model은 같은 task label 아래 상충하는 행동을 구분할 근거가 없다.'
        }
      />
    </SourceFigure>
  );
}

const delayOptions = [
  { value: '38', label: '38 ms' },
  { value: '80', label: '80 ms' },
  { value: '240', label: '240 ms' },
  { value: '320', label: '320 ms 가정' },
] as const;

export function Pi07RuntimeCadenceLab() {
  const [delay, setDelay] = useState<(typeof delayOptions)[number]['value']>('80');
  const [executed, setExecuted] = useState<'15' | '25'>('15');
  const delayMs = Number(delay);
  const executedSteps = Number(executed);
  const tickMs = 20;
  const coverageMs = executedSteps * tickMs;
  const slackMs = coverageMs - delayMs;
  const trainingCovered = delayMs <= 240;
  const cadenceCovered = slackMs >= 0;

  return (
    <SourceFigure
      data={{ 'data-pi07-runtime-lab': '' }}
      eyebrow="π0.7 CLOSED-LOOP CADENCE LAB"
      title="50 Hz robot에서 38 ms inference도 한 control tick보다 길다"
      footer="논문은 0–12 timestep, 즉 최대 240 ms delay를 training에서 모사한다. 실제 release에서는 network, queue, controller jitter까지 포함한 end-to-end latency를 다시 측정해야 한다."
    >
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <Segmented label="VLA inference delay" options={delayOptions} value={delay} onChange={setDelay} />
        <Segmented
          label="새 chunk 전 실제 실행 step"
          options={[
            { value: '15', label: '15 steps' },
            { value: '25', label: '25 steps' },
          ]}
          value={executed}
          onChange={setExecuted}
        />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            <Metric label="control tick" value="20 ms" note="50 Hz = 1초에 50회" />
            <Metric label="inference" value={`${delayMs} ms`} note={`${(delayMs / tickMs).toFixed(1)} control ticks`} tone={trainingCovered ? 'neutral' : 'warn'} />
            <Metric label="chunk coverage" value={`${coverageMs} ms`} note={`${executedSteps} steps를 먼저 실행`} />
            <Metric label="cadence slack" value={`${slackMs} ms`} note="새 chunk가 오기 전 남는 시간" tone={cadenceCovered ? 'good' : 'warn'} />
          </div>
          <div className="mt-5 min-w-0">
            <div className="flex h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="bg-sky-500/55 transition-[width]"
                style={{ width: `${Math.min(100, (delayMs / Math.max(delayMs, coverageMs)) * 100)}%` }}
                title="inference delay"
              />
              {slackMs > 0 && <div className="flex-1 bg-emerald-500/45" title="remaining chunk coverage" />}
            </div>
            <div className="mt-2 flex justify-between gap-4 text-xs font-semibold text-muted-foreground">
              <span>VLA가 다음 chunk 계산</span>
              <span>현재 chunk {executedSteps} step 실행</span>
            </div>
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Clock3 className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">Async + RTC</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            High-level subtask와 visual subgoal은 별도 thread에서 갱신하고, VLA는 가장 최근 결과를 사용한다. Action expert는 50 step을 예측하지만 15 또는 25 step만 실행한 뒤 다시 본다.
          </p>
        </aside>
      </div>
      <Verdict
        pass={trainingCovered && cadenceCovered}
        title={
          trainingCovered && cadenceCovered
            ? '논문의 delay envelope와 chunk coverage 안이다'
            : !trainingCovered
              ? '논문이 학습한 최대 delay를 벗어났다'
              : '다음 chunk보다 현재 chunk가 먼저 소진된다'
        }
        detail={
          trainingCovered && cadenceCovered
            ? '그래도 실제 system의 camera age와 network jitter를 포함한 replay가 배포 전 필요하다.'
            : 'Model 성능표가 좋아도 stale action을 실행하면 실제 closed-loop 동역학은 training data와 달라진다.'
        }
      />
    </SourceFigure>
  );
}

const piEvidence = {
  dexterity: {
    label: '본 task의 dexterity',
    icon: Gauge,
    unit: '성공률 + 시간당 성공 횟수',
    setup: 'Laundry · espresso · box와 specialist',
    support: '한 π0.7이 task별 π*0.6·π0.6 specialist와 비슷하거나 일부 throughput에서 앞선다.',
    boundary: 'Training mixture에 해당 task와 specialist rollout이 포함되어 zero-shot 증거가 아니다.',
  },
  instruction: {
    label: '지시 따르기',
    icon: Languages,
    unit: '3–6개 지시 sequence의 instruction success',
    setup: '학습에 없던 4 kitchens · 2 bedrooms',
    support: 'π0.5·π0.6보다 복잡하고 referential한 language instruction을 더 잘 따른다.',
    boundary: '모든 가능한 자연어 지시나 완전 자율 계획 능력을 증명하지 않는다.',
  },
  embodiment: {
    label: 'Robot body transfer',
    icon: Bot,
    unit: 'Task progress · human zero-shot baseline',
    setup: 'Laundry data가 없는 bimanual UR5e',
    support: '다른 크기와 morphology에 맞는 전략을 만들어 source-robot skill을 옮긴다.',
    boundary: '평균 375시간의 숙련 teleoperator 10명과 특정 task·robot 조합에서의 비교다.',
  },
  composition: {
    label: '새 조합 task',
    icon: Image,
    unit: 'Coaching episode와 autonomous high-level policy',
    setup: 'Air fryer · toaster 등 action-level demo 없는 task',
    support: 'Step-by-step coaching과 visual subgoal로 새 task 조합을 실행하고 그 instruction trace로 high-level policy를 학습한다.',
    boundary: '거대한 dataset에 관련 부분 skill이 전혀 없었다는 사실은 저자도 확정하지 못한다.',
  },
} as const;

export function Pi07EvidenceBoundaryLab() {
  const [mode, setMode] = useState<keyof typeof piEvidence>('composition');
  const active = piEvidence[mode];
  const Icon = active.icon;
  return (
    <SourceFigure
      data={{ 'data-pi07-evidence-lab': '' }}
      eyebrow="π0.7 EVIDENCE BOUNDARY LAB"
      title="같은 영상도 어떤 비교를 했는지에 따라 지지하는 주장이 다르다"
      footer="논문 Discussion은 seen task가 흔히 90%를 넘지만 unseen task 또는 unseen task-robot 조합은 60–80%라고 적는다. 'Emergent'는 관찰된 조합 능력의 이름이지 보편 성공 보장이 아니다."
    >
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4">
        {(Object.keys(piEvidence) as Array<keyof typeof piEvidence>).map((key) => {
          const ItemIcon = piEvidence[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-20 min-w-0 bg-background p-3 text-left ${
                mode === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground'
              }`}
            >
              <ItemIcon className="h-4 w-4" />
              <strong className="mt-2 block text-xs leading-tight">{piEvidence[key].label}</strong>
            </button>
          );
        })}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <Icon className="h-6 w-6" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">평가 단위</p>
          <p className="mt-1 text-sm font-black leading-relaxed">{active.unit}</p>
          <p className="mt-4 text-xs font-bold uppercase text-muted-foreground">비교 setup</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{active.setup}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">지지하는 주장</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{active.support}</p>
          <p className="mt-5 text-xs font-bold uppercase text-rose-700 dark:text-rose-300">여기서 멈출 주장</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.boundary}</p>
        </div>
      </div>
    </SourceFigure>
  );
}

type RangeMode = 'quantile' | 'minmax';

export function OpenVlaActionTokenLab() {
  const [rangeMode, setRangeMode] = useState<RangeMode>('quantile');
  const [action, setAction] = useState(0.25);
  const [low, high] = rangeMode === 'quantile' ? [-1, 1] : [-8, 8];
  const clipped = Math.min(high, Math.max(low, action));
  const edgeStep = (high - low) / 255;
  const digitized = clipped >= high
    ? 256
    : Math.max(1, Math.floor((clipped - low) / edgeStep) + 1);
  const centerIndex = Math.min(254, Math.max(0, digitized - 1));
  const restored = low + (centerIndex + 0.5) * edgeStep;
  const error = Math.abs(clipped - restored);

  return (
    <SourceFigure
      data={{ 'data-openvla-action-lab': '' }}
      eyebrow="OPENVLA ACTION TOKEN LAB"
      title="연속 action 한 축을 256칸으로 바꾸면 Llama가 다음 token처럼 예측할 수 있다"
      footer="논문은 256-bin discretization으로 설명하지만 공개 ActionTokenizer는 256 edge와 255 center를 만든다. Token id는 vocab size V에서 digitize index를 빼며 checkpoint tokenizer와 decoder를 한 쌍으로 검증해야 한다."
    >
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:p-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-end">
        <Segmented
          label="discretization bounds"
          options={[
            { value: 'quantile', label: '1–99% · [-1, 1]' },
            { value: 'minmax', label: 'Min–max · [-8, 8]' },
          ]}
          value={rangeMode}
          onChange={setRangeMode}
        />
        <label className="min-w-0">
          <span className="flex justify-between gap-3 text-xs font-bold uppercase text-muted-foreground">
            <span>continuous action</span>
            <span className="font-mono text-foreground">{action.toFixed(2)}</span>
          </span>
          <input
            className="mt-3 w-full accent-foreground"
            type="range"
            min="-1.5"
            max="1.5"
            step="0.01"
            value={action}
            onChange={(event) => setAction(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
          <Metric label="01 · clamp" value={clipped.toFixed(3)} note={`${low} ≤ a ≤ ${high}`} />
          <Metric label="02 · digitize" value={String(digitized)} note="1–256 index" />
          <Metric label="03 · token id" value={`V - ${digitized}`} note="V = tokenizer vocab size" />
          <Metric label="04 · restore" value={restored.toFixed(3)} note={`center index ${centerIndex}`} />
          <Metric label="abs error" value={error.toFixed(4)} note="현재 축의 양자화 오차" tone={error < 0.01 ? 'good' : 'warn'} />
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <SlidersHorizontal className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">{rangeMode === 'quantile' ? 'Outlier를 버리고 해상도 확보' : 'Outlier까지 담아 칸이 거칠어짐'}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Edge 간격은 {edgeStep.toFixed(4)}다. 공개 code는 256개 edge와 255개 center를 만들고 마지막 digitize index를 마지막 center로 clamp한다.
          </p>
        </aside>
      </div>
    </SourceFigure>
  );
}

const precisionModes = {
  bf16: {
    label: 'bfloat16',
    vram: '16.8 GB',
    nonBlocking: '71.3 ± 4.8%',
    blocking: '70.0 ± 5.1%',
    rate: '5 Hz controller 기준',
    interval: '200 ms 기준',
    cadence: 'reference',
  },
  int8: {
    label: 'int8',
    vram: '10.2 GB',
    nonBlocking: '58.1 ± 5.1%',
    blocking: '74.4 ± 4.9%',
    rate: '1.2 Hz · A5000',
    interval: '833 ms',
    cadence: 'slow',
  },
  int4: {
    label: 'int4',
    vram: '7.0 GB',
    nonBlocking: '71.9 ± 4.7%',
    blocking: '68.8 ± 5.2%',
    rate: '3 Hz · A5000',
    interval: '333 ms',
    cadence: 'nearer',
  },
} as const;

export function OpenVlaControlCadenceLab() {
  const [precision, setPrecision] = useState<keyof typeof precisionModes>('int8');
  const [execution, setExecution] = useState<'nonblocking' | 'blocking'>('nonblocking');
  const active = precisionModes[precision];
  const cadenceConfound = execution === 'nonblocking' && precision === 'int8';
  const success = execution === 'nonblocking' ? active.nonBlocking : active.blocking;

  return (
    <SourceFigure
      data={{ 'data-openvla-cadence-lab': '' }}
      eyebrow="OPENVLA CLOSED-LOOP EVIDENCE LAB"
      title="작은 VRAM 숫자보다 action이 실제 robot에 도착하는 간격을 먼저 본다"
      footer="Appendix D.4의 blocking control에서는 세 precision의 error bar가 겹친다. 그래서 int8의 초기 rollout 저하는 offline token 품질보다 느린 non-blocking cadence가 만든 동역학 변화로 해석된다."
    >
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="weight precision"
          options={(Object.keys(precisionModes) as Array<keyof typeof precisionModes>).map((value) => ({
            value,
            label: precisionModes[value].label,
          }))}
          value={precision}
          onChange={setPrecision}
        />
        <Segmented
          label="controller evaluation"
          options={[
            { value: 'nonblocking', label: 'Non-blocking · 본문' },
            { value: 'blocking', label: 'Blocking · 부록 D.4' },
          ]}
          value={execution}
          onChange={setExecution}
        />
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        <Metric label="VRAM" value={active.vram} note="Table 2 model footprint" />
        <Metric label="inference cadence" value={active.rate} note={active.interval} tone={active.cadence === 'slow' ? 'warn' : 'neutral'} />
        <Metric label="Bridge success" value={success} note={execution === 'nonblocking' ? '80 rollouts per precision' : '8 tasks · blocking control'} tone={cadenceConfound ? 'warn' : 'good'} />
        <Metric
          label="판정"
          value={cadenceConfound ? 'Cadence confounded' : execution === 'blocking' ? 'Policy quality isolated' : 'Controller에 더 가까움'}
          note="Offline token accuracy만으로 알 수 없는 항"
          tone={cadenceConfound ? 'warn' : 'good'}
        />
      </div>
      <Verdict
        pass={!cadenceConfound}
        title={cadenceConfound ? 'int8 action update가 training의 5 Hz 동역학과 크게 달라졌다' : '현재 비교에서는 cadence 원인을 분리해서 읽을 수 있다'}
        detail={
          cadenceConfound
            ? 'A5000의 1.2 Hz는 action 사이가 약 833 ms다. Model이 비슷한 token을 골라도 robot은 더 오래 같은 명령을 실행한다.'
            : execution === 'blocking'
              ? '모든 action을 끝까지 실행한 뒤 다음 예측을 기다려 precision별 latency가 system dynamics를 다르게 만들지 않게 했다.'
              : 'int4의 3 Hz는 1.2 Hz보다 5 Hz data cadence에 가깝고 본문 rollout 성능도 bfloat16과 비슷했다.'
        }
      />
    </SourceFigure>
  );
}

const openVlaEvidence = {
  bridge: {
    label: 'Bridge',
    icon: Camera,
    trials: '17 tasks × 10 = 170 rollouts',
    claim: 'OpenVLA가 visual·motion·physical·language 항목에서 강하고 aggregate에서 RT-2-X보다 높았다.',
    caveat: '970k vs 350k trajectories, fused encoder, no-op filtering과 RT-2-X query workaround가 함께 다르다.',
  },
  google: {
    label: 'Google robot',
    icon: Bot,
    trials: '12 tasks × 5 = 60 rollouts',
    claim: 'OpenVLA와 RT-2-X가 이 embodiment의 in-distribution·OOD task에서 비슷한 aggregate 성능을 냈다.',
    caveat: 'RT-2-X는 55B closed model이고 semantic generalization에서는 더 높았다.',
  },
  adaptation: {
    label: '새 robot 적응',
    icon: Database,
    trials: 'Franka tasks · 129 rollouts',
    claim: 'OpenVLA가 narrow·diverse task 전체 평균에서 가장 강했고 LoRA r=32가 full FT에 가까웠다.',
    caveat: 'Narrow single-instruction dexterity에서는 Diffusion Policy가 더 매끄럽고 강한 경우가 있었다.',
  },
  quantization: {
    label: 'Quantization',
    icon: MemoryStick,
    trials: '8 Bridge tasks · 80 rollouts/precision',
    claim: 'int4는 VRAM을 절반 이하로 줄이면서 bfloat16과 비슷한 non-blocking rollout 성능을 보였다.',
    caveat: '이 실험 variant는 final full OpenVLA보다 작은 mixture와 SigLIP-only backbone을 사용했다.',
  },
} as const;

export function OpenVlaEvidenceReceiptLab() {
  const [mode, setMode] = useState<keyof typeof openVlaEvidence>('bridge');
  const active = openVlaEvidence[mode];
  const Icon = active.icon;
  const labels = useMemo(
    () => (Object.keys(openVlaEvidence) as Array<keyof typeof openVlaEvidence>).map((value) => ({
      value,
      label: openVlaEvidence[value].label,
    })),
    [],
  );

  return (
    <SourceFigure
      data={{ 'data-openvla-evidence-lab': '' }}
      eyebrow="OPENVLA REPRODUCTION RECEIPT"
      title="Architecture 표보다 rollout 단위와 비교 조건을 먼저 고정한다"
      footer="논문은 모든 실제 robot 비교를 같은 초기 상태의 paired A/B evaluation으로 수행했다고 보고한다. 그래도 data curation과 control workaround 차이는 model-size 비교와 분리해 읽어야 한다."
    >
      <div className="border-b border-border bg-muted/15 p-4 sm:p-5">
        <Segmented label="evidence slice" options={labels} value={mode} onChange={setMode} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <Icon className="h-6 w-6" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">실험 영수증</p>
          <p className="mt-1 font-mono text-sm font-black leading-relaxed">{active.trials}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CircleGauge className="h-4 w-4" />
            Paired initial states
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">이 비교가 지지함</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{active.claim}</p>
          <p className="mt-5 text-xs font-bold uppercase text-rose-700 dark:text-rose-300">비교 밖의 변수</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.caveat}</p>
        </div>
      </div>
    </SourceFigure>
  );
}

export function VLaSourceSpineMilestone() {
  return (
    <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
      {[
        [Camera, '01 · 관측', 'Image·history·proprioception이 무엇인지 shape와 timestamp로 고정한다.'],
        [Activity, '02 · 정책', '언어·문맥이 action representation으로 바뀌는 계산과 data mixture를 검산한다.'],
        [Gauge, '03 · 폐루프', 'Token accuracy가 아니라 cadence·success·throughput·failure로 실제 행동을 평가한다.'],
      ].map(([Icon, title, detail]) => {
        const ItemIcon = Icon as typeof Camera;
        return (
          <div key={title as string} className="min-w-0 bg-background p-4">
            <ItemIcon className="h-4 w-4" />
            <p className="mt-3 text-xs font-black">{title as string}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail as string}</p>
          </div>
        );
      })}
    </div>
  );
}
