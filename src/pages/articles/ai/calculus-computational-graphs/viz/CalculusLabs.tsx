import { useId, useMemo, useState } from 'react';
import {
  ArrowRight,
  CornerDownLeft,
  GitBranch,
  Link2,
  Link2Off,
  Merge,
  RotateCw,
  Sigma,
} from 'lucide-react';
import MathFormula from '@/components/ui/math';

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

function formatNumber(value: number, digits = 3) {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid min-w-0 gap-1 rounded-md border border-border bg-background p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded px-2 py-2 text-xs font-semibold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 ${
            value === option.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function RangeControl({
  id,
  label,
  value,
  valueLabel,
  min,
  max,
  step,
  accentClass,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  accentClass: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block min-w-0 text-xs font-semibold text-muted-foreground">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong className="font-mono text-foreground">{valueLabel}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`mt-2 block min-h-11 w-full ${accentClass}`}
      />
    </label>
  );
}

function MetricStrip({
  items,
}: {
  items: Array<{ label: string; value: string; note?: string; accent?: string }>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-background p-3">
          <dt className="text-xs font-semibold leading-relaxed text-muted-foreground">{item.label}</dt>
          <dd className={`mt-1 break-words font-mono text-base font-bold ${item.accent ?? ''}`}>
            {item.value}
          </dd>
          {item.note && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function LocalLinearizationLab() {
  const [x, setX] = useState(0.8);
  const [delta, setDelta] = useState(0.35);
  const f = (value: number) => 0.6 * value * value + 0.4 * value + 1;
  const derivative = 1.2 * x + 0.4;
  const exactDelta = f(x + delta) - f(x);
  const linearDelta = derivative * delta;
  const residual = exactDelta - linearDelta;
  const plot = { left: 38, right: 392, top: 24, bottom: 244 };
  const xPx = (value: number) => plot.left + ((value + 2.4) / 4.8) * (plot.right - plot.left);
  const yPx = (value: number) => plot.bottom - (value / 6) * (plot.bottom - plot.top);
  const curve = Array.from({ length: 145 }, (_, index) => {
    const value = -2.4 + index / 30;
    return `${xPx(value)},${yPx(f(value))}`;
  }).join(' ');
  const tangent = (value: number) => f(x) + derivative * (value - x);
  const tangentLeft = Math.max(-2.4, x - 1);
  const tangentRight = Math.min(2.4, x + 1);
  const exactPoint = { x: xPx(x + delta), y: yPx(f(x + delta)) };
  const predictedPoint = { x: xPx(x + delta), y: yPx(f(x) + linearDelta) };
  const exactLabel = {
    x: Math.max(plot.left + 42, Math.min(plot.right - 92, exactPoint.x - 14)),
    y: Math.max(plot.top + 13, Math.min(plot.bottom - 28, exactPoint.y - 18)),
  };
  const predictedLabel = {
    x: Math.max(plot.left + 4, Math.min(plot.right - 72, predictedPoint.x + 14)),
    y: Math.max(plot.top + 31, Math.min(plot.bottom - 8, predictedPoint.y + 24)),
  };

  return (
    <figure
      data-local-linearization-lab
      data-slope={formatNumber(derivative, 5)}
      data-exact-delta={formatNumber(exactDelta, 5)}
      data-linear-delta={formatNumber(linearDelta, 5)}
      data-residual={formatNumber(residual, 5)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Local linearization lab</p>
          <p className="mt-1 text-base font-bold">접선은 다음 점이 아니라 작은 변화량을 예측한다</p>
        </div>
        <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
          residual {formatNumber(Math.abs(residual), 4)}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-cyan-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <RangeControl
          id="calculus-linearization-x"
          label="기준점 x"
          value={x}
          valueLabel={formatNumber(x, 2)}
          min={-1.5}
          max={1.5}
          step={0.05}
          accentClass="accent-cyan-700"
          onChange={setX}
        />
        <RangeControl
          id="calculus-linearization-delta"
          label="작은 이동 Δx"
          value={delta}
          valueLabel={formatNumber(delta, 2)}
          min={-0.8}
          max={0.8}
          step={0.05}
          accentClass="accent-amber-600"
          onChange={setDelta}
        />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)] lg:items-center">
        <svg viewBox="0 0 430 270" className="h-auto w-full" role="img" aria-label={`x ${formatNumber(x)}, delta x ${formatNumber(delta)}에서 실제 변화와 접선 예측`}>
          {[0, 1.5, 3, 4.5, 6].map((value) => (
            <line key={value} x1={plot.left} x2={plot.right} y1={yPx(value)} y2={yPx(value)} stroke="var(--border)" strokeOpacity="0.6" />
          ))}
          <line x1={plot.left} x2={plot.right} y1={yPx(0)} y2={yPx(0)} stroke="var(--muted-foreground)" strokeOpacity="0.5" />
          <line x1={xPx(0)} x2={xPx(0)} y1={plot.top} y2={plot.bottom} stroke="var(--muted-foreground)" strokeOpacity="0.5" />
          <polyline points={curve} fill="none" stroke="#0891b2" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          <line
            x1={xPx(tangentLeft)}
            y1={yPx(tangent(tangentLeft))}
            x2={xPx(tangentRight)}
            y2={yPx(tangent(tangentRight))}
            stroke="#d97706"
            strokeWidth="1.75"
            strokeDasharray="7 5"
          />
          <line x1={exactPoint.x} x2={predictedPoint.x} y1={exactPoint.y} y2={predictedPoint.y} stroke="#e11d48" strokeWidth="2" />
          <circle cx={xPx(x)} cy={yPx(f(x))} r="5" fill="var(--background)" stroke="#0891b2" strokeWidth="3" />
          <circle cx={exactPoint.x} cy={exactPoint.y} r="5" fill="#0891b2" />
          <rect x={predictedPoint.x - 4.5} y={predictedPoint.y - 4.5} width="9" height="9" fill="#d97706" />
          <line x1={exactPoint.x - 3} y1={exactPoint.y - 3} x2={exactLabel.x} y2={exactLabel.y + 2} stroke="#0891b2" strokeWidth="1" strokeOpacity="0.55" />
          <rect x={exactLabel.x - 40} y={exactLabel.y - 12} width="42" height="19" rx="3" fill="var(--background)" stroke="#0891b2" strokeOpacity="0.35" />
          <text x={exactLabel.x - 4} y={exactLabel.y + 2} textAnchor="end" fontSize="11" fontWeight="700" fill="#0e7490">실제</text>
          <line x1={predictedPoint.x + 3} y1={predictedPoint.y + 3} x2={predictedLabel.x} y2={predictedLabel.y - 5} stroke="#d97706" strokeWidth="1" strokeOpacity="0.55" />
          <rect x={predictedLabel.x - 2} y={predictedLabel.y - 14} width="70" height="19" rx="3" fill="var(--background)" stroke="#d97706" strokeOpacity="0.35" />
          <text x={predictedLabel.x + 4} y={predictedLabel.y} textAnchor="start" fontSize="11" fontWeight="700" fill="#b45309">선형 예측</text>
        </svg>
        <MetricStrip items={[
          { label: '현재 함수값 f(x)', value: formatNumber(f(x)) },
          { label: '현재 민감도 f′(x)', value: formatNumber(derivative), accent: 'text-cyan-700 dark:text-cyan-300' },
          { label: '실제 출력 변화', value: formatNumber(exactDelta) },
          { label: 'f′(x)Δx 예측', value: formatNumber(linearDelta), accent: 'text-amber-700 dark:text-amber-300' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        청록색 점과 주황색 사각형 사이의 세로 간격이 버린 고차항이다. 기준점은 그대로 두고 Δx만 0에 가깝게 줄여 오차가 어떻게 사라지는지 확인한다.
      </p>
    </figure>
  );
}

export function DirectionalDerivativeLab() {
  const [angle, setAngle] = useState(145);
  const [step, setStep] = useState(0.2);
  const point = { w: 0, b: -0.2 };
  const loss = (w: number, b: number) => (w - 1.2) ** 2 + 0.4 * (b + 0.8) ** 2;
  const gradient = { w: 2 * (point.w - 1.2), b: 0.8 * (point.b + 0.8) };
  const radians = angle * Math.PI / 180;
  const direction = { w: Math.cos(radians), b: Math.sin(radians) };
  const directional = gradient.w * direction.w + gradient.b * direction.b;
  const next = { w: point.w + step * direction.w, b: point.b + step * direction.b };
  const actualDelta = loss(next.w, next.b) - loss(point.w, point.b);
  const decision = directional < -0.06 ? '감소 방향' : directional > 0.06 ? '증가 방향' : '등고선 방향';
  const decisionColor = directional < -0.06
    ? 'text-emerald-700 dark:text-emerald-300'
    : directional > 0.06
      ? 'text-rose-700 dark:text-rose-300'
      : 'text-amber-700 dark:text-amber-300';
  const center = { x: 210, y: 158 };
  const scale = 68;
  const map = (w: number, b: number) => ({
    x: center.x + (w - point.w) * scale,
    y: center.y - (b - point.b) * scale,
  });
  const gradientEnd = map(point.w + gradient.w * 0.45, point.b + gradient.b * 0.45);
  const directionEnd = map(point.w + direction.w * 1.35, point.b + direction.b * 1.35);
  const arrowId = useId().replace(/:/g, '');

  return (
    <figure
      data-directional-derivative-lab
      data-directional={formatNumber(directional, 5)}
      data-actual-delta={formatNumber(actualDelta, 5)}
      data-decision={decision}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Directional derivative lab</p>
          <p className="mt-1 text-base font-bold">Gradient는 고정하고 움직일 direction만 돌린다</p>
        </div>
        <span className={`text-xs font-semibold ${decisionColor}`}>{decision}</span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-emerald-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <RangeControl
          id="calculus-direction-angle"
          label="unit direction 각도"
          value={angle}
          valueLabel={`${angle}°`}
          min={0}
          max={355}
          step={5}
          accentClass="accent-violet-600"
          onChange={setAngle}
        />
        <RangeControl
          id="calculus-direction-step"
          label="실제 확인 step"
          value={step}
          valueLabel={formatNumber(step, 2)}
          min={0.05}
          max={0.6}
          step={0.05}
          accentClass="accent-emerald-700"
          onChange={setStep}
        />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.9fr)] lg:items-center">
        <svg viewBox="0 0 420 315" className="h-auto w-full" role="img" aria-label={`gradient와 ${angle}도 unit direction의 내적`}>
          <defs>
            <marker id={`${arrowId}-gradient`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
              <path d="M0 0 L7 3.5 L0 7Z" fill="#059669" />
            </marker>
            <marker id={`${arrowId}-direction`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
              <path d="M0 0 L7 3.5 L0 7Z" fill="#7c3aed" />
            </marker>
          </defs>
          {[44, 76, 108, 140].map((rx, index) => (
            <ellipse
              key={rx}
              cx={map(1.2, -0.8).x}
              cy={map(1.2, -0.8).y}
              rx={rx}
              ry={rx * 1.45}
              fill="none"
              stroke="var(--border)"
              strokeWidth={index === 2 ? 1.5 : 1}
            />
          ))}
          <line x1="25" x2="395" y1={center.y} y2={center.y} stroke="var(--muted-foreground)" strokeOpacity="0.45" />
          <line x1={center.x} x2={center.x} y1="22" y2="288" stroke="var(--muted-foreground)" strokeOpacity="0.45" />
          <line x1={center.x} y1={center.y} x2={gradientEnd.x} y2={gradientEnd.y} stroke="#059669" strokeWidth="2.5" markerEnd={`url(#${arrowId}-gradient)`} />
          <line x1={center.x} y1={center.y} x2={directionEnd.x} y2={directionEnd.y} stroke="#7c3aed" strokeWidth="2.5" markerEnd={`url(#${arrowId}-direction)`} />
          <circle cx={center.x} cy={center.y} r="5.5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="2" />
          <circle cx={map(next.w, next.b).x} cy={map(next.w, next.b).y} r="4.5" fill="#7c3aed" />
          <text x={gradientEnd.x + 7} y={gradientEnd.y - 8} fontSize="13" fontWeight="700" fill="#047857">∇L</text>
          <text x={directionEnd.x + 7} y={directionEnd.y - 8} fontSize="13" fontWeight="700" fill="#7c3aed">v</text>
          <text x="394" y={center.y - 8} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.6">w</text>
          <text x={center.x + 8} y="31" fontSize="11" fill="currentColor" opacity="0.6">b</text>
        </svg>
        <MetricStrip items={[
          { label: '고정된 gradient', value: `[${formatNumber(gradient.w)}, ${formatNumber(gradient.b)}]`, accent: 'text-emerald-700 dark:text-emerald-300' },
          { label: 'unit direction v', value: `[${formatNumber(direction.w)}, ${formatNumber(direction.b)}]`, accent: 'text-violet-700 dark:text-violet-300' },
          { label: '∇Lᵀv · 예측 slope', value: formatNumber(directional) },
          { label: '실제 ΔL', value: formatNumber(actualDelta), note: `step ${formatNumber(step, 2)} 적용` },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        Partial derivative는 보라색 direction을 coordinate axis에 맞춘 특수 경우다. 임의 방향의 한 걸음은 gradient와 그 direction의 내적으로 먼저 판단한다.
      </p>
    </figure>
  );
}

type FlowMode = 'branch' | 'broadcast' | 'detach';

export function GradientFlowLab() {
  const [mode, setMode] = useState<FlowMode>('branch');
  const [u, setU] = useState(1.5);
  const [batch, setBatch] = useState(3);
  const coefficients = [
    [1.5, -0.5],
    [-1, 2],
    [0.25, 3],
    [2, -1.5],
  ];
  const branchA = 2 * u;
  const branchC = mode === 'detach' ? 0 : 3;
  const sharedTotal = branchA + branchC;
  const broadcastTotal = [0, 1].map((dimension) => (
    coefficients.slice(0, batch).reduce((sum, row) => sum + row[dimension], 0)
  ));
  const totalLabel = mode === 'broadcast'
    ? `[${formatNumber(broadcastTotal[0], 2)}, ${formatNumber(broadcastTotal[1], 2)}]`
    : formatNumber(sharedTotal, 2);

  return (
    <figure
      data-gradient-flow-lab
      data-flow-mode={mode}
      data-flow-total={totalLabel}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Gradient flow lab</p>
          <p className="mt-1 text-base font-bold">경로 안에서는 곱하고 같은 원인으로 돌아오면 더한다</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          {mode === 'broadcast' ? <Sigma className="h-4 w-4" aria-hidden="true" /> : mode === 'detach' ? <Link2Off className="h-4 w-4" aria-hidden="true" /> : <Merge className="h-4 w-4" aria-hidden="true" />}
          {mode === 'broadcast' ? '복제 축을 합산' : mode === 'detach' ? '한 경로 절단' : '두 경로 합류'}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-amber-500/[0.035] p-4 sm:p-5">
        <Segmented
          label="gradient 흐름 사례"
          options={[
            { value: 'branch', label: '공유 node' },
            { value: 'broadcast', label: 'Broadcast bias' },
            { value: 'detach', label: 'Detach branch' },
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === 'broadcast' ? (
          <RangeControl
            id="calculus-flow-batch"
            label="복제된 batch 수"
            value={batch}
            valueLabel={String(batch)}
            min={2}
            max={4}
            step={1}
            accentClass="accent-amber-600"
            onChange={setBatch}
          />
        ) : (
          <RangeControl
            id="calculus-flow-u"
            label="공유 node 값 u"
            value={u}
            valueLabel={formatNumber(u, 1)}
            min={-2}
            max={4}
            step={0.5}
            accentClass="accent-amber-600"
            onChange={setU}
          />
        )}
      </div>

      {mode === 'broadcast' ? (
        <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 rounded-md border border-amber-500/35 bg-amber-500/[0.04] p-3">
                <p className="font-mono text-sm font-bold">bias b[D=2]</p>
                <p className="mt-1 text-xs text-muted-foreground">forward에서 B개 row로 보임</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="rounded-md border border-border p-3 text-center">
                <p className="font-mono text-sm font-bold">y[B,2]</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {coefficients.slice(0, batch).map((row, index) => (
                <div key={index} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded-md border border-border px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">sample {index}</span>
                  <span className="font-mono text-sm font-bold">[{row[0]}, {row[1]}]</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <p className="text-xs font-semibold text-muted-foreground">원래 bias shape로 되돌리는 합</p>
            <p className="mt-2 font-mono text-xl font-bold text-amber-700 dark:text-amber-300">
              db = {totalLabel}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              forward에서 같은 bias가 여러 sample에 보였으므로 backward에서는 각 sample의 기여를 batch 축으로 더한다.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.15fr)_auto_minmax(0,0.8fr)] sm:items-center">
            <div className="rounded-md border border-amber-500/35 bg-amber-500/[0.04] p-4 text-center">
              <p className="font-mono text-base font-bold">u = {formatNumber(u, 1)}</p>
              <p className="mt-1 text-xs text-muted-foreground">공유 node</p>
            </div>
            <GitBranch className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <div className="grid gap-2">
              <div className="rounded-md border border-border p-3">
                <p className="font-mono text-sm font-bold">a = u²</p>
                <p className="mt-1 text-xs text-muted-foreground">돌아오는 기여 2u = {formatNumber(branchA, 2)}</p>
              </div>
              <div className={`rounded-md border p-3 ${mode === 'detach' ? 'border-rose-500/35 bg-rose-500/[0.04]' : 'border-border'}`}>
                <p className="flex items-center gap-2 font-mono text-sm font-bold">
                  {mode === 'detach' ? <Link2Off className="h-4 w-4 text-rose-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                  c = 3u
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  돌아오는 기여 {mode === 'detach' ? '0 · graph에서 절단' : '3'}
                </p>
              </div>
            </div>
            <Merge className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <div className="rounded-md border border-foreground/25 p-4 text-center">
              <p className="font-mono text-base font-bold">L = a + c</p>
              <p className="mt-2 font-mono text-lg font-bold text-amber-700 dark:text-amber-300">
                dL/du = {formatNumber(sharedTotal, 2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        {mode === 'broadcast'
          ? 'Broadcast backward는 새 규칙이 아니다. 같은 원본 값으로 연결된 여러 경로가 원래 axis로 돌아오며 합쳐지는 chain rule이다.'
          : mode === 'detach'
            ? 'Detach는 forward 숫자를 지우지 않는다. backward edge만 끊기 때문에 loss 값은 같아도 gradient 책임은 달라진다.'
            : '공유 node의 gradient를 마지막 경로 값으로 덮어쓰면 앞 경로의 책임이 사라진다. 각 경로의 contribution을 먼저 만든 뒤 합한다.'}
      </p>
    </figure>
  );
}

type ProductMode = 'jvp' | 'vjp';
type DimensionCase = 'few-inputs' | 'balanced' | 'scalar-output';

const dimensionCases: Record<DimensionCase, { n: number; m: number; label: string }> = {
  'few-inputs': { n: 2, m: 4, label: '입력 2 → 출력 4' },
  balanced: { n: 3, m: 3, label: '입력 3 → 출력 3' },
  'scalar-output': { n: 5, m: 1, label: '입력 5 → loss 1' },
};

function matrixValue(row: number, column: number) {
  return (((row + 1) * 2 + (column + 1) * 3) % 7 - 3) / 2;
}

export function JacobianProductLab() {
  const [mode, setMode] = useState<ProductMode>('vjp');
  const [dimensionCase, setDimensionCase] = useState<DimensionCase>('scalar-output');
  const { n, m } = dimensionCases[dimensionCase];
  const matrix = Array.from({ length: m }, (_, row) => (
    Array.from({ length: n }, (_, column) => matrixValue(row, column))
  ));
  const tangent = Array.from({ length: n }, (_, index) => (index % 2 === 0 ? 1 : -0.5));
  const cotangent = Array.from({ length: m }, (_, index) => (index % 2 === 0 ? 1 : -1));
  const result = mode === 'jvp'
    ? matrix.map((row) => row.reduce((sum, value, index) => sum + value * tangent[index], 0))
    : Array.from({ length: n }, (_, column) => (
        matrix.reduce((sum, row, index) => sum + row[column] * cotangent[index], 0)
      ));
  const recommendation = n < m ? 'JVP가 full Jacobian basis sweep에 유리' : m < n ? 'VJP가 full Jacobian basis sweep에 유리' : 'basis sweep 수는 동률';

  return (
    <figure
      data-jacobian-product-lab
      data-product-mode={mode}
      data-input-dimension={n}
      data-output-dimension={m}
      data-product-result={result.map((value) => formatNumber(value, 2)).join(',')}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Jacobian product lab</p>
          <p className="mt-1 text-base font-bold">같은 Jacobian에서 tangent와 cotangent가 반대편을 출발한다</p>
        </div>
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{recommendation}</span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-indigo-500/[0.035] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Segmented
          label="Jacobian product 방향"
          options={[
            { value: 'jvp', label: 'JVP · Jv' },
            { value: 'vjp', label: 'VJP · Jᵀc' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <Segmented
          label="입출력 차원 사례"
          options={[
            { value: 'few-inputs', label: '2 → 4' },
            { value: 'balanced', label: '3 → 3' },
            { value: 'scalar-output', label: '5 → 1' },
          ]}
          value={dimensionCase}
          onChange={setDimensionCase}
        />
      </div>

      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm font-bold">J · shape [{m}, {n}]</p>
            <span className="text-xs text-muted-foreground">{dimensionCases[dimensionCase].label}</span>
          </div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(2.5rem, 1fr))` }}
          >
            {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className="flex min-h-11 items-center justify-center rounded border border-border bg-background font-mono text-xs font-bold"
              >
                {formatNumber(value, 1)}
              </div>
            )))}
          </div>
          <div className="mt-4 flex min-w-0 items-center gap-3 rounded-md border border-border p-3">
            <span className="shrink-0 rounded bg-muted px-2 py-1 font-mono text-xs font-bold">
              {mode === 'jvp' ? `v [${n}]` : `c [${m}]`}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="min-w-0 break-words font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
              [{result.map((value) => formatNumber(value, 2)).join(', ')}]
            </span>
          </div>
        </div>
        <MetricStrip items={[
          { label: 'seed가 시작하는 곳', value: mode === 'jvp' ? `input [${n}]` : `output [${m}]` },
          { label: '결과가 도착하는 곳', value: mode === 'jvp' ? `output [${m}]` : `input [${n}]`, accent: 'text-indigo-700 dark:text-indigo-300' },
          { label: 'JVP basis sweep', value: `${n}회`, note: 'full J가 필요할 때' },
          { label: 'VJP basis sweep', value: `${m}회`, note: 'full J가 필요할 때' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        한 번의 product는 full Jacobian을 만들지 않는다. 입력 perturbation을 출력으로 밀면 JVP, 출력의 책임을 입력으로 당기면 VJP다.
      </p>
    </figure>
  );
}

type TapeStage = 'forward' | 'backward-one' | 'backward-two' | 'zero';

export function AutogradTapeLab() {
  const [stage, setStage] = useState<TapeStage>('forward');
  const [detached, setDetached] = useState(false);
  const theta = 1.6;
  const u = theta * theta;
  const branch = 3 * u;
  const loss = u + branch;
  const onePass = 2 * theta * (detached ? 1 : 4);
  const grad = stage === 'forward' ? null : stage === 'backward-one' ? onePass : stage === 'backward-two' ? onePass * 2 : 0;
  const generation = stage === 'backward-two' || stage === 'zero' ? 2 : 1;

  return (
    <figure
      data-autograd-tape-lab
      data-tape-stage={stage}
      data-detached={detached ? 'true' : 'false'}
      data-leaf-grad={grad === null ? 'none' : formatNumber(grad, 2)}
      data-graph-generation={generation}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Autograd tape lab</p>
          <p className="mt-1 text-base font-bold">Forward 숫자, backward edge, leaf .grad는 서로 다른 상태다</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          graph generation {generation}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-orange-500/[0.035] p-4 sm:p-5">
        <div role="group" aria-label="autograd 실행 단계" className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1 sm:grid-cols-4">
          {([
            ['forward', 'Forward 기록'],
            ['backward-one', 'Backward 1회'],
            ['backward-two', '다음 iteration'],
            ['zero', 'zero_grad'],
          ] as Array<[TapeStage, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={stage === value}
              onClick={() => setStage(value)}
              className={`min-h-11 rounded px-2 py-2 text-xs font-semibold leading-snug transition-colors ${
                stage === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={detached}
          onClick={() => setDetached((value) => !value)}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
            detached
              ? 'border-rose-500/40 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300'
              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {detached ? <Link2Off className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          3u branch {detached ? 'detach됨' : 'gradient 연결됨'}
        </button>
      </div>

      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
        <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="rounded-md border border-orange-500/35 bg-orange-500/[0.04] p-3 text-center">
            <p className="font-mono text-sm font-bold">θ = {theta}</p>
            <p className="mt-1 text-xs text-muted-foreground">leaf · requires_grad</p>
          </div>
          <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
          <div className="rounded-md border border-border p-3 text-center">
            <p className="font-mono text-sm font-bold">u = θ² = {formatNumber(u, 2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">saved θ · non-leaf</p>
          </div>
          <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
          <div className="rounded-md border border-border p-3 text-center">
            <p className="font-mono text-sm font-bold">L = {formatNumber(loss, 2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">u + 3u · forward는 동일</p>
          </div>
        </div>
        <MetricStrip items={[
          { label: '현재 leaf .grad', value: grad === null ? 'None' : formatNumber(grad, 2), accent: 'text-orange-700 dark:text-orange-300' },
          { label: '이번 pass 기여', value: formatNumber(onePass, 2) },
          { label: '3u backward edge', value: detached ? '끊김' : '연결' },
          { label: 'saved value', value: 'θ = 1.6', note: 'd(θ²)/dθ 계산용' },
        ]} />
      </div>
      <div className="border-t border-border bg-rose-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        <strong className="text-rose-700 dark:text-rose-300">In-place 경계:</strong> backward가 쓰려고 저장한 θ를 forward 뒤 바꾸면 version check가 오류를 낸다. 메모리를 아끼는 것과 derivative에 필요한 값을 지우는 것은 다르다.
      </div>
    </figure>
  );
}

type CheckMode = 'smooth' | 'kink';
type CheckTab = 'gradcheck' | 'path';

function float32Smooth(value: number) {
  const x = Math.fround(value);
  return Math.fround(Math.exp(Math.fround(0.2 * x)) + Math.fround(0.05 * Math.fround(x * x * x * x)));
}

function centralDifference(epsilon: number, mode: CheckMode) {
  if (mode === 'kink') {
    return (Math.abs(epsilon) - Math.abs(-epsilon)) / (2 * epsilon);
  }
  const x = Math.fround(0.8);
  return Math.fround(
    (float32Smooth(Math.fround(x + epsilon)) - float32Smooth(Math.fround(x - epsilon)))
    / (2 * epsilon),
  );
}

export function GradcheckPathLab() {
  const [tab, setTab] = useState<CheckTab>('gradcheck');
  const [mode, setMode] = useState<CheckMode>('smooth');
  const [exponent, setExponent] = useState(-2);
  const [sDot, setSDot] = useState(1.4);
  const [sDDot, setSDDot] = useState(-0.5);
  const epsilon = 10 ** exponent;
  const analytic = mode === 'smooth' ? 0.2 * Math.exp(0.2 * 0.8) + 0.2 * (0.8 ** 3) : null;
  const numeric = centralDifference(epsilon, mode);
  const error = analytic === null ? null : Math.abs(numeric - analytic);
  const errorSeries = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const currentExponent = -1 - index;
    const currentEpsilon = 10 ** currentExponent;
    const currentNumeric = centralDifference(currentEpsilon, 'smooth');
    const currentError = Math.max(1e-8, Math.abs(currentNumeric - (0.2 * Math.exp(0.2 * 0.8) + 0.2 * (0.8 ** 3))));
    return { exponent: currentExponent, error: currentError };
  }), []);
  const s = 0.6;
  const qS = [3 * s * s, -Math.sin(s)];
  const qSS = [6 * s, -Math.cos(s)];
  const velocity = qS.map((value) => value * sDot);
  const curvatureTerm = qSS.map((value) => value * sDot * sDot);
  const clockTerm = qS.map((value) => value * sDDot);
  const acceleration = curvatureTerm.map((value, index) => value + clockTerm[index]);
  const chart = { left: 42, right: 388, top: 24, bottom: 210 };
  const errorX = (value: number) => chart.left + ((-1 - value) / 7) * (chart.right - chart.left);
  const errorY = (value: number) => {
    const log = Math.max(-8, Math.min(0, Math.log10(value)));
    return chart.bottom - ((log + 8) / 8) * (chart.bottom - chart.top);
  };
  const points = errorSeries.map((item) => `${errorX(item.exponent)},${errorY(item.error)}`).join(' ');

  return (
    <figure
      data-gradcheck-path-lab
      data-check-tab={tab}
      data-epsilon={epsilon}
      data-numeric-gradient={formatNumber(numeric, 8)}
      data-check-error={error === null ? 'undefined' : formatNumber(error, 8)}
      data-path-acceleration={acceleration.map((value) => formatNumber(value, 4)).join(',')}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Verification & path lab</p>
          <p className="mt-1 text-base font-bold">작은 수를 고르는 검산과 두 번 미분하는 경로를 분리한다</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
          {tab === 'gradcheck' ? 'analytic ↔ numeric' : 'path ↔ clock'}
        </span>
      </figcaption>

      <div className="border-b border-border bg-rose-500/[0.03] p-4 sm:p-5">
        <Segmented
          label="검산과 path chain rule"
          options={[
            { value: 'gradcheck', label: 'Float32 gradcheck' },
            { value: 'path', label: 'q(s(t)) 2차 미분' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'gradcheck' ? (
        <>
          <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-2 sm:p-5">
            <Segmented
              label="gradient check 함수"
              options={[
                { value: 'smooth', label: 'Smooth function' },
                { value: 'kink', label: '|x| at 0' },
              ]}
              value={mode}
              onChange={setMode}
            />
            <RangeControl
              id="calculus-gradcheck-epsilon"
              label="epsilon 지수"
              value={exponent}
              valueLabel={`10^${exponent}`}
              min={-8}
              max={-1}
              step={1}
              accentClass="accent-rose-600"
              onChange={setExponent}
            />
          </div>
          <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
            <svg viewBox="0 0 430 235" className="h-auto w-full" role="img" aria-label="float32 central difference epsilon별 오차">
              {[-8, -6, -4, -2, 0].map((power) => (
                <g key={power}>
                  <line x1={chart.left} x2={chart.right} y1={errorY(10 ** power)} y2={errorY(10 ** power)} stroke="var(--border)" />
                  <text x={chart.left - 7} y={errorY(10 ** power) + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">1e{power}</text>
                </g>
              ))}
              <polyline points={points} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {errorSeries.map((item) => (
                <circle
                  key={item.exponent}
                  cx={errorX(item.exponent)}
                  cy={errorY(item.error)}
                  r={item.exponent === exponent ? 6 : 3.5}
                  fill={item.exponent === exponent ? '#e11d48' : 'var(--background)'}
                  stroke="#e11d48"
                  strokeWidth="2"
                />
              ))}
              <text x={chart.right} y="229" textAnchor="end" fontSize="11" fill="currentColor" opacity="0.6">epsilon: 1e-1 → 1e-8</text>
            </svg>
            <MetricStrip items={[
              { label: 'analytic/autograd', value: analytic === null ? 'undefined' : formatNumber(analytic, 7) },
              { label: 'central difference', value: formatNumber(numeric, 7), accent: 'text-rose-700 dark:text-rose-300' },
              { label: 'absolute error', value: error === null ? '판정 불가' : formatNumber(error, 8) },
              { label: '현재 진단', value: analytic === null ? 'kink 경계' : exponent <= -6 ? 'roundoff 우세' : exponent >= -1 ? 'truncation 우세' : '비교 가능 구간' },
            ]} />
          </div>
          <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
            {mode === 'kink'
              ? 'Central difference가 0을 반환해도 |x|의 x=0 derivative가 존재하는 것은 아니다. 수치값 일치 전에 미분 가능성과 구현 convention을 확인한다.'
              : 'epsilon이 크면 곡률을 무시한 truncation error, 너무 작으면 float32 뺄셈에서 cancellation이 커진다. 0에 가까울수록 항상 좋은 검산이 아니다.'}
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-2 sm:p-5">
            <RangeControl
              id="calculus-path-sdot"
              label="경로 속도 s_dot"
              value={sDot}
              valueLabel={formatNumber(sDot, 2)}
              min={0}
              max={3}
              step={0.1}
              accentClass="accent-blue-700"
              onChange={setSDot}
            />
            <RangeControl
              id="calculus-path-sddot"
              label="경로 가속도 s_ddot"
              value={sDDot}
              valueLabel={formatNumber(sDDot, 2)}
              min={-2}
              max={2}
              step={0.1}
              accentClass="accent-orange-600"
              onChange={setSDDot}
            />
          </div>
          <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="grid content-start gap-3">
              <div className="rounded-md border border-border bg-muted/20 p-4 text-sm">
                <MathFormula display className="my-0">{String.raw`q(s)=\begin{bmatrix}s^3\\ \cos s\end{bmatrix},\qquad s=0.6`}</MathFormula>
              </div>
              <div className="rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-4">
                <p className="text-xs font-semibold text-muted-foreground">Path tangent가 clock speed를 받음</p>
                <p className="mt-2 font-mono text-base font-bold">q_dot = [{velocity.map((value) => formatNumber(value, 3)).join(', ')}]</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">path curvature term</p>
                  <p className="mt-2 font-mono text-sm font-bold">[{curvatureTerm.map((value) => formatNumber(value, 3)).join(', ')}]</p>
                  <p className="mt-1 text-xs text-muted-foreground">q_ss · s_dot²</p>
                </div>
                <div className="rounded-md border border-orange-500/30 bg-orange-500/[0.04] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">clock acceleration term</p>
                  <p className="mt-2 font-mono text-sm font-bold">[{clockTerm.map((value) => formatNumber(value, 3)).join(', ')}]</p>
                  <p className="mt-1 text-xs text-muted-foreground">q_s · s_ddot</p>
                </div>
              </div>
            </div>
            <MetricStrip items={[
              { label: 'path position s', value: String(s) },
              { label: 'q_s', value: `[${qS.map((value) => formatNumber(value, 3)).join(', ')}]` },
              { label: 'q_ss', value: `[${qSS.map((value) => formatNumber(value, 3)).join(', ')}]` },
              { label: 'q_ddot', value: `[${acceleration.map((value) => formatNumber(value, 3)).join(', ')}]`, accent: 'text-blue-700 dark:text-blue-300' },
            ]} />
          </div>
          <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
            s_dot이 0이어도 s_ddot이 있으면 tangent 방향 가속도는 남을 수 있다. 반대로 일정한 clock이라도 curved path에서는 q_ss · s_dot²가 남는다.
          </p>
        </>
      )}
    </figure>
  );
}
