import { useMemo, useState } from 'react';
import { Check, TriangleAlert, X } from 'lucide-react';

const probeInput = [0, 1, 2, -1, 1, 0];

type Property = '선형' | '시불변' | '기억 있음' | '인과적' | 'BIBO 안정';

type SystemCase = {
  id: string;
  name: string;
  equation: string;
  description: string;
  witness: string;
  properties: Record<Property, boolean>;
  transform: (input: number[]) => number[];
};

const systemCases: SystemCase[] = [
  {
    id: 'delay',
    name: '한 칸 지연',
    equation: 'y[n] = x[n-1]',
    description: '과거 한 점을 현재로 옮긴다.',
    witness: '입력을 한 칸 미루면 출력도 정확히 한 칸 더 밀린다.',
    properties: { 선형: true, 시불변: true, '기억 있음': true, 인과적: true, 'BIBO 안정': true },
    transform: (input) => input.map((_, index) => input[index - 1] ?? 0),
  },
  {
    id: 'alternating',
    name: '시간별 부호 변경',
    equation: 'y[n] = (-1)ⁿx[n]',
    description: '짝수 시각과 홀수 시각에 다른 규칙을 쓴다.',
    witness: '같은 impulse를 한 칸 옮기면 계수의 부호가 바뀐다. 입력 이동과 출력 이동이 같지 않다.',
    properties: { 선형: true, 시불변: false, '기억 있음': false, 인과적: true, 'BIBO 안정': true },
    transform: (input) => input.map((value, index) => (index % 2 === 0 ? value : -value)),
  },
  {
    id: 'square',
    name: '제곱',
    equation: 'y[n] = x[n]²',
    description: '현재 값만 보지만 크기를 비선형으로 바꾼다.',
    witness: '입력을 두 배로 하면 출력은 두 배가 아니라 네 배가 된다.',
    properties: { 선형: false, 시불변: true, '기억 있음': false, 인과적: true, 'BIBO 안정': true },
    transform: (input) => input.map((value) => value ** 2),
  },
  {
    id: 'accumulator',
    name: '누적합',
    equation: 'y[n] = Σₖ≤ₙ x[k]',
    description: '지금까지 들어온 모든 값을 state에 쌓는다.',
    witness: '항상 1인 bounded input을 넣으면 출력은 1, 2, 3, …으로 끝없이 커진다.',
    properties: { 선형: true, 시불변: true, '기억 있음': true, 인과적: true, 'BIBO 안정': false },
    transform: (input) => {
      let state = 0;
      return input.map((value) => {
        state += value;
        return state;
      });
    },
  },
  {
    id: 'centered',
    name: '중앙 평균',
    equation: 'y[n] = (x[n-1]+x[n]+x[n+1])/3',
    description: '현재를 중심으로 앞뒤 sample을 함께 평균낸다.',
    witness: 'x[n+1]이 도착하기 전에는 현재 y[n]을 확정할 수 없다.',
    properties: { 선형: true, 시불변: true, '기억 있음': true, 인과적: false, 'BIBO 안정': true },
    transform: (input) => input.map((value, index) => ((input[index - 1] ?? 0) + value + (input[index + 1] ?? 0)) / 3),
  },
];

function MiniSequence({ label, values, tone }: { label: string; values: number[]; tone: 'input' | 'output' }) {
  const max = Math.max(1, ...values.map((value) => Math.abs(value)));
  const barColor = tone === 'input' ? 'bg-sky-600 dark:bg-sky-400' : 'bg-emerald-600 dark:bg-emerald-400';

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="min-w-0">
            <div className="relative h-20 border-y border-border/80">
              <span className="absolute inset-x-0 top-1/2 border-t border-border" />
              <span
                className={`absolute left-1/2 w-2 -translate-x-1/2 ${barColor}`}
                style={{
                  height: `${Math.max(2, Math.abs(value) / max * 34)}px`,
                  top: value >= 0 ? `calc(50% - ${Math.max(2, Math.abs(value) / max * 34)}px)` : '50%',
                }}
              />
            </div>
            <p className="mt-1 truncate text-center font-mono text-[11px] font-semibold">{Number(value.toFixed(2))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemPropertyLab() {
  const [selectedId, setSelectedId] = useState('delay');
  const selected = systemCases.find((item) => item.id === selectedId) ?? systemCases[0];
  const output = selected.transform(probeInput);

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground">System property lab</p>
        <p className="mt-1 text-base font-bold">이름을 외우지 말고 깨지는 입력을 직접 찾는다</p>
      </figcaption>
      <div className="border-b border-border bg-muted/20 p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" role="group" aria-label="검사할 시스템 선택">
          {systemCases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              aria-pressed={selectedId === item.id}
              className={`min-h-11 rounded-md border px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedId === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background hover:border-muted-foreground/60'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <div>
            <p className="font-mono text-base font-bold">{selected.equation}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
          </div>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <MiniSequence label="입력 x[n]" values={probeInput} tone="input" />
            <MiniSequence label="출력 y[n]" values={output} tone="output" />
          </div>
          <div className="flex gap-3 border-l-2 border-amber-500 bg-amber-500/[0.05] px-4 py-3 text-sm leading-relaxed">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <p><strong>판정 witness.</strong> {selected.witness}</p>
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">계약 판정</p>
          <ul className="space-y-2">
            {Object.entries(selected.properties).map(([property, valid]) => (
              <li key={property} className="flex min-h-10 items-center justify-between gap-3 border-b border-border/70 text-sm last:border-0">
                <span>{property}</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${valid ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                  {valid ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
                  {valid ? '통과' : '실패'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}

const convolutionInput = [2, -1, 3, 0, 1];
const convolutionKernel = [0.25, 0.5, 0.25];

function linearConvolution(input: number[], kernel: number[]) {
  return Array.from({ length: input.length + kernel.length - 1 }, (_, n) => (
    input.reduce((sum, value, k) => sum + value * (kernel[n - k] ?? 0), 0)
  ));
}

export function ConvolutionWorkbench() {
  const output = useMemo(() => linearConvolution(convolutionInput, convolutionKernel), []);
  const [index, setIndex] = useState(2);
  const terms = convolutionInput
    .map((value, k) => ({
      k,
      input: value,
      kernelIndex: index - k,
      kernel: convolutionKernel[index - k] ?? 0,
      product: value * (convolutionKernel[index - k] ?? 0),
    }))
    .filter((term) => term.kernelIndex >= 0 && term.kernelIndex < convolutionKernel.length);
  const maxOutput = Math.max(1, ...output.map((value) => Math.abs(value)));

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Convolution workbench</p>
          <p className="mt-1 text-base font-bold">출력 한 점에 실제로 기여한 항만 펼쳐 본다</p>
        </div>
        <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">뒤집기 · 이동 · 곱 · 합</span>
      </figcaption>
      <div className="border-b border-border bg-muted/20 px-4 py-4 sm:px-6">
        <label htmlFor="convolution-position" className="block text-sm font-semibold">
          계산할 출력 위치 <span className="ml-1 font-mono text-violet-700 dark:text-violet-300">n={index}</span>
          <input
            id="convolution-position"
            type="range"
            min="0"
            max={output.length - 1}
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            className="mt-3 block min-h-11 w-full accent-violet-700"
          />
        </label>
      </div>
      <div className="grid min-w-0 gap-7 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">현재 겹치는 항</p>
          <div className="space-y-2">
            {terms.map((term) => (
              <div key={term.k} className="grid min-h-14 grid-cols-[3.2rem_1fr_auto_1fr_auto_1fr] items-center gap-2 border-b border-border/70 px-1 text-center text-sm last:border-0">
                <span className="text-left font-mono text-xs text-muted-foreground">k={term.k}</span>
                <span className="rounded-sm bg-sky-500/10 py-2 font-mono font-bold text-sky-800 dark:text-sky-200">{term.input}</span>
                <span aria-hidden="true">×</span>
                <span className="rounded-sm bg-violet-500/10 py-2 font-mono font-bold text-violet-800 dark:text-violet-200">{term.kernel}</span>
                <span aria-hidden="true">=</span>
                <span className="rounded-sm bg-emerald-500/10 py-2 font-mono font-bold text-emerald-800 dark:text-emerald-200">{term.product}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-l-2 border-emerald-500 bg-emerald-500/[0.05] px-4 py-3">
            <p className="text-xs text-muted-foreground">겹친 곱을 모두 더한 현재 출력</p>
            <p className="mt-1 break-words font-mono text-lg font-bold">
              y[{index}] = {terms.map((term) => Number(term.product.toFixed(2))).join(' + ')} = {Number(output[index].toFixed(2))}
            </p>
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">전체 linear convolution · 길이 {output.length}</p>
          <div className="flex h-48 items-stretch gap-1.5">
            {output.map((value, outputIndex) => {
              const height = Math.max(3, Math.abs(value) / maxOutput * 72);
              return (
                <div key={outputIndex} className="flex min-w-0 flex-1 flex-col items-center">
                  <span className="h-5 truncate font-mono text-[11px] font-semibold">{Number(value.toFixed(2))}</span>
                  <div className="relative h-36 w-full border-y border-border/80">
                    <span className="absolute inset-x-0 top-1/2 border-t border-border" />
                    <span
                      className={`absolute left-1/2 w-[70%] max-w-5 -translate-x-1/2 ${outputIndex === index ? 'bg-violet-700 dark:bg-violet-300' : 'bg-muted-foreground/35'}`}
                      style={{ height: `${height}px`, top: value >= 0 ? `calc(50% - ${height}px)` : '50%' }}
                    />
                  </div>
                  <span className="mt-1 font-mono text-[11px] text-muted-foreground">{outputIndex}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}

function buildRecurrence(coefficient: number, inputMode: 'impulse' | 'step') {
  const input = Array.from({ length: 14 }, (_, index) => (inputMode === 'impulse' ? (index === 0 ? 1 : 0) : 1));
  let state = 0;
  const output = input.map((value) => {
    state = coefficient * state + value;
    return state;
  });
  const kernel = Array.from({ length: 14 }, (_, index) => coefficient ** index);
  return { input, output, kernel };
}

type LineLayout = { left: number; right: number; center: number; amplitude: number };

function linePoints(values: number[], maxAbs: number, layout: LineLayout) {
  return values.map((value, index) => {
    const x = layout.left + index * ((layout.right - layout.left) / Math.max(1, values.length - 1));
    const y = layout.center - value / maxAbs * layout.amplitude;
    return `${x},${y}`;
  }).join(' ');
}

function RecurrenceChart({ output, kernel, maxAbs, mobile }: { output: number[]; kernel: number[]; maxAbs: number; mobile: boolean }) {
  const layout = mobile
    ? { left: 22, right: 338, center: 105, amplitude: 74 }
    : { left: 34, right: 686, center: 116, amplitude: 86 };
  const viewBox = mobile ? '0 0 360 220' : '0 0 720 220';

  return (
    <svg
      viewBox={viewBox}
      className={mobile ? 'block h-auto w-full sm:hidden' : 'hidden h-auto w-full sm:block'}
      role="img"
      aria-label="재귀 시스템의 state 출력과 impulse kernel"
    >
      <line x1={layout.left} y1={layout.center} x2={layout.right} y2={layout.center} stroke="var(--border)" strokeWidth="1.5" />
      {Array.from({ length: 7 }, (_, tick) => (
        <line
          key={tick}
          x1={layout.left + tick * ((layout.right - layout.left) / 6)}
          y1="22"
          x2={layout.left + tick * ((layout.right - layout.left) / 6)}
          y2="192"
          stroke="var(--border)"
          strokeWidth="0.7"
          opacity="0.55"
        />
      ))}
      <polyline points={linePoints(output, maxAbs, layout)} fill="none" stroke="#7c3aed" strokeWidth={mobile ? 3 : 4} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={linePoints(kernel, maxAbs, layout)} fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round" strokeLinejoin="round" />
      {output.map((value, index) => {
        const x = layout.left + index * ((layout.right - layout.left) / Math.max(1, output.length - 1));
        const y = layout.center - value / maxAbs * layout.amplitude;
        return <circle key={index} cx={x} cy={y} r={mobile ? 3.5 : 4.5} fill="var(--background)" stroke="#7c3aed" strokeWidth="2.5" />;
      })}
    </svg>
  );
}

export function RecurrenceKernelLab() {
  const [coefficient, setCoefficient] = useState(0.7);
  const [inputMode, setInputMode] = useState<'impulse' | 'step'>('impulse');
  const { output, kernel } = buildRecurrence(coefficient, inputMode);
  const maxAbs = Math.max(1, ...output.map((value) => Math.abs(value)), ...kernel.map((value) => Math.abs(value)));
  const stable = Math.abs(coefficient) < 1;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Recurrence ↔ kernel</p>
          <p className="mt-1 text-base font-bold">State를 한 칸씩 갱신한 결과와 펼친 kernel을 겹쳐 본다</p>
        </div>
        <span className={`inline-flex min-h-8 items-center rounded-sm px-2 text-xs font-bold ${stable ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/10 text-red-800 dark:text-red-200'}`}>
          {stable ? '기억이 감쇠함' : '기억이 감쇠하지 않음'}
        </span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-6">
        <label htmlFor="recurrence-coefficient" className="block text-sm font-semibold">
          이전 state를 남기는 비율 · <span className="font-mono">{coefficient.toFixed(1)}</span>
          <input
            id="recurrence-coefficient"
            type="range"
            min="-1.1"
            max="1.1"
            step="0.1"
            value={coefficient}
            onChange={(event) => setCoefficient(Number(event.target.value))}
            className="mt-3 block min-h-11 w-full accent-violet-700"
          />
        </label>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="입력 종류 선택">
          {(['impulse', 'step'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInputMode(mode)}
              aria-pressed={inputMode === mode}
              className={`min-h-11 rounded-md border px-4 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                inputMode === mode ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'
              }`}
            >
              {mode === 'impulse' ? 'Impulse 입력' : 'Step 입력'}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-violet-600" /> state scan 출력</span>
          <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-emerald-600" /> impulse kernel</span>
        </div>
        <RecurrenceChart output={output} kernel={kernel} maxAbs={maxAbs} mobile />
        <RecurrenceChart output={output} kernel={kernel} maxAbs={maxAbs} mobile={false} />
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground"><span>n=0</span><span>n=13</span></div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {inputMode === 'impulse'
            ? 'Impulse를 넣으면 scan 출력 자체가 kernel이 된다. 두 선이 포개지는 것이 recurrence와 convolution의 연결이다.'
            : 'Step 입력에서는 과거 impulse response가 매 시각 하나씩 더해진다. 계수의 크기가 1 이상이면 합이 가라앉지 않는다.'}
        </p>
      </div>
    </figure>
  );
}

function aliasFrequency(frequency: number, sampleRate: number) {
  return Math.abs(((frequency + sampleRate / 2) % sampleRate) - sampleRate / 2);
}

function SamplingChart({
  frequency,
  alias,
  safe,
  samples,
  mobile,
}: {
  frequency: number;
  alias: number;
  safe: boolean;
  samples: Array<{ t: number; value: number }>;
  mobile: boolean;
}) {
  const layout = mobile
    ? { width: 360, height: 235, left: 20, right: 340, center: 112, amplitude: 78 }
    : { width: 720, height: 235, left: 38, right: 682, center: 112, amplitude: 78 };
  const curve = (curveFrequency: number) => Array.from({ length: 361 }, (_, index) => {
    const t = index / 360;
    const x = layout.left + t * (layout.right - layout.left);
    const y = layout.center - Math.sin(2 * Math.PI * curveFrequency * t) * layout.amplitude;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={mobile ? 'block h-auto w-full sm:hidden' : 'hidden h-auto w-full sm:block'}
      role="img"
      aria-label={`${frequency} 헤르츠 신호의 원 파동, alias 후보와 관측 sample`}
    >
      <line x1={layout.left} y1={layout.center} x2={layout.right} y2={layout.center} stroke="var(--border)" strokeWidth="1.5" />
      {!safe && <polyline points={curve(alias)} fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="9 7" opacity="0.82" />}
      <polyline points={curve(frequency)} fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
      {samples.map((sample, index) => {
        const x = layout.left + sample.t * (layout.right - layout.left);
        const y = layout.center - sample.value * layout.amplitude;
        return (
          <g key={index}>
            <line x1={x} y1={layout.center} x2={x} y2={y} stroke="var(--muted-foreground)" strokeWidth="0.8" opacity="0.7" />
            <circle cx={x} cy={y} r={mobile ? 3.6 : 4.5} fill="var(--background)" stroke="#059669" strokeWidth="2.5" />
          </g>
        );
      })}
    </svg>
  );
}

export function SamplingExplorer() {
  const [frequency, setFrequency] = useState(13);
  const [sampleRate, setSampleRate] = useState(24);
  const alias = aliasFrequency(frequency, sampleRate);
  const safe = frequency < sampleRate / 2;
  const samples = Array.from({ length: sampleRate + 1 }, (_, index) => {
    const t = index / sampleRate;
    return { t, value: Math.sin(2 * Math.PI * frequency * t) };
  });

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Sampling and aliasing</p>
          <p className="mt-1 text-base font-bold">점만 남았을 때 원래 파동을 되찾을 수 있는가?</p>
        </div>
        <span className={`inline-flex min-h-8 items-center rounded-sm px-2 text-xs font-bold ${safe ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/10 text-red-800 dark:text-red-200'}`}>
          {safe ? '대역 안쪽' : `${alias.toFixed(1)} Hz로 겹침`}
        </span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:px-6">
        <label htmlFor="signal-frequency" className="block text-sm font-semibold">
          원 신호 주파수 · {frequency} Hz
          <input id="signal-frequency" type="range" min="1" max="30" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} className="mt-3 block min-h-11 w-full accent-sky-700" />
        </label>
        <label htmlFor="sampling-rate" className="block text-sm font-semibold">
          초당 sample 수 · {sampleRate} Hz
          <input id="sampling-rate" type="range" min="8" max="40" step="2" value={sampleRate} onChange={(event) => setSampleRate(Number(event.target.value))} className="mt-3 block min-h-11 w-full accent-emerald-700" />
        </label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-sky-600" /> 원 신호</span>
          {!safe && <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-red-600" /> 같은 점을 통과하는 alias</span>}
          <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full border-2 border-emerald-600 bg-background" /> 관측 sample</span>
        </div>
        <SamplingChart frequency={frequency} alias={alias} safe={safe} samples={samples} mobile />
        <SamplingChart frequency={frequency} alias={alias} safe={safe} samples={samples} mobile={false} />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>0초</span><span>1초</span></div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">Nyquist 주파수</p>
            <p className="mt-1 font-mono text-lg font-bold">{(sampleRate / 2).toFixed(1)} Hz</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">sample이 보여 주는 주파수</p>
            <p className="mt-1 font-mono text-lg font-bold">{alias.toFixed(1)} Hz</p>
          </div>
          <div className="bg-background p-4 text-sm leading-relaxed text-muted-foreground">
            {safe ? '최고 주파수보다 sample rate가 두 배보다 크다.' : '두 연속 파동이 같은 점들을 통과하므로 sample 뒤에서는 구분할 수 없다.'}
          </div>
        </div>
      </div>
    </figure>
  );
}
