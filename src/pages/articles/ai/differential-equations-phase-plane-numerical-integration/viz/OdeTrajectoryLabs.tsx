import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Point = { x: number; y: number };

const palette = {
  blue: '#2563eb',
  teal: '#0f766e',
  amber: '#d97706',
  rose: '#e11d48',
  violet: '#7c3aed',
  ink: '#475569',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function linePath(points: Point[], px: (value: number) => number, py: (value: number) => number) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${px(point.x).toFixed(2)} ${py(point.y).toFixed(2)}`).join(' ');
}

function LabShell({
  id,
  index,
  eyebrow,
  title,
  description,
  controls,
  children,
  footer,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  controls: ReactNode;
  children: ReactNode;
  footer: string;
}) {
  return (
    <figure
      data-ode-lab={id}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="flex min-w-0 flex-col items-start gap-3 border-b border-border px-4 py-4 sm:flex-row sm:gap-4 sm:px-6 sm:pr-28">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 font-mono text-sm font-black text-white dark:bg-slate-100 dark:text-slate-950">
          {index}
        </span>
        <div data-ode-caption-copy className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-300">{eyebrow}</p>
          <strong className="mt-1 block text-sm leading-snug text-foreground">{title}</strong>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </figcaption>
      <div className="border-b border-border bg-slate-500/[0.035] px-4 py-4 sm:px-6">{controls}</div>
      {children}
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6 sm:pr-28">
        {footer}
      </p>
    </figure>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const digits = step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="flex min-h-6 items-start justify-between gap-3 text-xs font-semibold text-muted-foreground">
        <span>{label}</span>
        <strong className="shrink-0 font-mono text-foreground">
          {value.toFixed(digits)}
          {unit}
        </strong>
      </span>
      <input
        id={id}
        className="mt-2 block h-11 w-full cursor-pointer accent-blue-700"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`min-h-11 rounded px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              value === option.value
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricStrip({ items }: { items: Array<{ label: string; value: string; accent?: 'blue' | 'teal' | 'amber' | 'rose' }> }) {
  const accentClass = {
    blue: 'text-blue-700 dark:text-blue-300',
    teal: 'text-teal-700 dark:text-teal-300',
    amber: 'text-amber-700 dark:text-amber-300',
    rose: 'text-rose-700 dark:text-rose-300',
  };
  return (
    <dl className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 border-b border-border px-4 py-3 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
          <dt className="text-[11px] font-semibold text-muted-foreground">{item.label}</dt>
          <dd className={`mt-1 break-words font-mono text-sm font-black ${item.accent ? accentClass[item.accent] : 'text-foreground'}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Plot({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 px-3 py-4 sm:px-6 sm:py-6 ${className}`}>
      <svg
        viewBox="0 0 440 238"
        className="block h-auto w-full"
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </div>
  );
}

function AxisGrid({
  x1 = 42,
  x2 = 420,
  y1 = 18,
  y2 = 208,
  rows = 4,
}: {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  rows?: number;
}) {
  return (
    <g stroke="currentColor" opacity="0.1" strokeWidth="1">
      {Array.from({ length: rows + 1 }, (_, index) => {
        const y = y1 + ((y2 - y1) * index) / rows;
        return <line key={y} x1={x1} x2={x2} y1={y} y2={y} />;
      })}
      <line x1={x1} x2={x1} y1={y1} y2={y2} opacity="0.8" />
      <line x1={x1} x2={x2} y1={y2} y2={y2} opacity="0.8" />
    </g>
  );
}

export function RateLedgerLab() {
  const [initial, setInitial] = useState(9);
  const [earlyIn, setEarlyIn] = useState(3.4);
  const [lateOut, setLateOut] = useState(2.2);
  const earlyOut = 1;
  const lateIn = 1.2;
  const switchTime = 2;
  const endTime = 5;
  const earlyRate = earlyIn - earlyOut;
  const lateRate = lateIn - lateOut;
  const atSwitch = initial + earlyRate * switchTime;
  const final = atSwitch + lateRate * (endTime - switchTime);
  const points: Point[] = [
    { x: 0, y: initial },
    { x: switchTime, y: atSwitch },
    { x: endTime, y: final },
  ];
  const yMax = Math.max(18, initial, atSwitch, final) + 1;
  const px = (value: number) => 42 + (value / endTime) * 378;
  const py = (value: number) => 208 - (value / yMax) * 178;

  return (
    <LabShell
      id="rate-ledger"
      index="01"
      eyebrow="Rate ledger"
      title="유량에 시간을 곱한 뒤에야 저장량과 더할 수 있다"
      description="초기량과 두 구간의 유입·유출을 바꾸며 rate와 amount의 단위를 한 원장으로 맞춘다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-3">
          <RangeControl label="초기 저장량" value={initial} min={3} max={14} step={1} unit=" kg" onChange={setInitial} />
          <RangeControl label="0–2초 유입" value={earlyIn} min={1} max={5} step={0.2} unit=" kg/s" onChange={setEarlyIn} />
          <RangeControl label="2–5초 유출" value={lateOut} min={0.6} max={4} step={0.2} unit=" kg/s" onChange={setLateOut} />
        </div>
      )}
      footer="꺾이는 시점은 저장량이 끊어진 곳이 아니라 rate 규칙이 바뀐 곳이다. 상태는 연속이고 기울기만 달라진다."
    >
      <Plot label="두 시간 구간의 순유량을 누적해 저장량이 바뀌는 그래프">
        <AxisGrid />
        <path d={linePath(points, px, py)} fill="none" stroke={palette.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={px(switchTime)} x2={px(switchTime)} y1="18" y2="208" stroke={palette.violet} strokeWidth="1.5" strokeDasharray="5 5" />
        <circle cx={px(0)} cy={py(initial)} r="5" fill="var(--background)" stroke={palette.blue} strokeWidth="3" />
        <circle cx={px(switchTime)} cy={py(atSwitch)} r="5" fill="var(--background)" stroke={palette.violet} strokeWidth="3" />
        <circle cx={px(endTime)} cy={py(final)} r="5" fill={palette.teal} />
        <g fontSize="12" fontWeight="700">
          <text x={px(0) + 7} y={py(initial) - 8} fill={palette.blue}>시작 {initial}kg</text>
          <text x={px(switchTime) + 7} y="31" fill={palette.violet}>규칙 전환 2초</text>
          <text x={px(endTime) - 4} y={py(final) - 9} textAnchor="end" fill={palette.teal}>끝 {final.toFixed(1)}kg</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">시간 (s)</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: '첫 구간 순 rate', value: `${earlyRate >= 0 ? '+' : ''}${earlyRate.toFixed(1)} kg/s`, accent: 'blue' },
        { label: '첫 구간 변화량', value: `${(earlyRate * switchTime).toFixed(1)} kg` },
        { label: '둘째 구간 순 rate', value: `${lateRate >= 0 ? '+' : ''}${lateRate.toFixed(1)} kg/s`, accent: lateRate < 0 ? 'amber' : 'teal' },
        { label: '5초 뒤 state', value: `${final.toFixed(1)} kg`, accent: 'teal' },
      ]} />
      <output hidden data-ode-rate-final={final.toFixed(4)} data-ode-rate-early={earlyRate.toFixed(4)} data-ode-rate-late={lateRate.toFixed(4)} />
    </LabShell>
  );
}

function integrateDriven(before: number, after: number, switchTime: number) {
  const dt = 0.02;
  const threshold = 1.15;
  let t = 0;
  let x = 0.15;
  let crossing: number | null = null;
  const points: Point[] = [{ x: t, y: x }];
  while (t < 4 - 1e-9) {
    const input = t < switchTime ? before : after;
    const previous = x;
    x += dt * (-0.8 * x + input);
    t += dt;
    if (crossing === null && previous < threshold && x >= threshold) crossing = t;
    points.push({ x: t, y: x });
  }
  return { points, crossing, threshold };
}

export function DrivenStateLab() {
  const [before, setBefore] = useState(1.8);
  const [after, setAfter] = useState(-0.4);
  const [switchTime, setSwitchTime] = useState(1.8);
  const result = useMemo(() => integrateDriven(before, after, switchTime), [before, after, switchTime]);
  const values = result.points.map((point) => point.y);
  const yMin = Math.min(-0.8, ...values) - 0.15;
  const yMax = Math.max(1.8, ...values) + 0.15;
  const px = (value: number) => 42 + (value / 4) * 378;
  const py = (value: number) => 208 - ((value - yMin) / (yMax - yMin)) * 178;
  const atSwitch = result.points.reduce((best, point) => Math.abs(point.x - switchTime) < Math.abs(best.x - switchTime) ? point : best);
  const rateBefore = -0.8 * atSwitch.y + before;
  const rateAfter = -0.8 * atSwitch.y + after;

  return (
    <LabShell
      id="driven-state"
      index="02"
      eyebrow="Driven state"
      title="같은 상태라도 입력 schedule이 바뀌면 다음 방향이 바뀐다"
      description="보라색 선은 미리 아는 시간 사건, 청록색 점은 trajectory를 따라가며 찾는 상태 사건이다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-3">
          <RangeControl label="전환 전 입력" value={before} min={0.4} max={2.8} step={0.2} onChange={setBefore} />
          <RangeControl label="전환 후 입력" value={after} min={-1.2} max={1.2} step={0.2} onChange={setAfter} />
          <RangeControl label="입력 전환 시각" value={switchTime} min={0.8} max={3} step={0.2} unit=" s" onChange={setSwitchTime} />
        </div>
      )}
      footer="Scheduled event는 입력표에서 바로 안다. State event는 계산된 trajectory가 threshold를 통과하는 순간을 solver가 찾아야 한다."
    >
      <Plot label="시간에 따라 입력이 바뀌는 1차 상태와 threshold crossing">
        <AxisGrid />
        <line x1="42" x2="420" y1={py(result.threshold)} y2={py(result.threshold)} stroke={palette.teal} strokeWidth="1.5" strokeDasharray="5 5" />
        <line x1={px(switchTime)} x2={px(switchTime)} y1="18" y2="208" stroke={palette.violet} strokeWidth="2" strokeDasharray="6 5" />
        <path d={linePath(result.points, px, py)} fill="none" stroke={palette.blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx={px(switchTime)} cy={py(atSwitch.y)} r="5" fill="var(--background)" stroke={palette.violet} strokeWidth="3" />
        {result.crossing !== null && <circle cx={px(result.crossing)} cy={py(result.threshold)} r="5" fill={palette.teal} />}
        <g fontSize="12" fontWeight="700">
          <text x={px(switchTime) + 6} y="31" fill={palette.violet}>입력 전환</text>
          <text x="416" y={py(result.threshold) - 7} textAnchor="end" fill={palette.teal}>상태 문턱 1.15</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">시간 (s)</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: '전환 직전 rate', value: rateBefore.toFixed(2), accent: rateBefore >= 0 ? 'blue' : 'amber' },
        { label: '전환 직후 rate', value: rateAfter.toFixed(2), accent: rateAfter >= 0 ? 'teal' : 'rose' },
        { label: 'Scheduled event', value: `${switchTime.toFixed(1)} s` },
        { label: 'State event', value: result.crossing === null ? '통과하지 않음' : `${result.crossing.toFixed(2)} s`, accent: result.crossing === null ? 'rose' : 'teal' },
      ]} />
      <output hidden data-ode-driven-crossing={result.crossing?.toFixed(4) ?? 'none'} data-ode-driven-rate-after={rateAfter.toFixed(4)} />
    </LabShell>
  );
}

export function EulerStepLab() {
  const [start, setStart] = useState(1.35);
  const [decay, setDecay] = useState(1.1);
  const [step, setStep] = useState(0.55);
  const slope = -decay * start;
  const eulerNext = start + step * slope;
  const exactNext = start * Math.exp(-decay * step);
  const tMax = 1.8;
  const exact = Array.from({ length: 81 }, (_, index) => {
    const t = (index / 80) * tMax;
    return { x: t, y: start * Math.exp(-decay * t) };
  });
  const px = (value: number) => 42 + (value / tMax) * 378;
  const py = (value: number) => 208 - ((value + 0.15) / 1.9) * 178;

  return (
    <LabShell
      id="euler-step"
      index="03"
      eyebrow="One numerical step"
      title="Euler 한 걸음은 현재 rate를 짧은 구간 동안 그대로 쓴 근사다"
      description="파란 접선의 가로 길이가 h, 세로 변화량이 h·f다. 정확한 곡선은 그 사이에도 slope가 계속 변한다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-3">
          <RangeControl label="현재 state" value={start} min={0.7} max={1.7} step={0.1} onChange={setStart} />
          <RangeControl label="감쇠 rate λ의 크기" value={decay} min={0.4} max={2.2} step={0.1} onChange={setDecay} />
          <RangeControl label="step h" value={step} min={0.1} max={1.1} step={0.05} unit=" s" onChange={setStep} />
        </div>
      )}
      footer="Euler update는 등식이 아니라 한 step 동안 slope가 변하지 않는다고 보는 근사다. h가 커질수록 이 가정이 더 오래 유지된다."
    >
      <Plot label="정확한 감소 곡선과 현재 접선으로 만든 Euler 한 걸음">
        <AxisGrid />
        <path d={linePath(exact, px, py)} fill="none" stroke={palette.teal} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${px(0)} ${py(start)} L ${px(step)} ${py(eulerNext)}`} fill="none" stroke={palette.blue} strokeWidth="3" strokeLinecap="round" />
        <line x1={px(step)} x2={px(step)} y1={py(start)} y2={py(eulerNext)} stroke={palette.amber} strokeWidth="2" strokeDasharray="4 4" />
        <line x1={px(0)} x2={px(step)} y1={py(start)} y2={py(start)} stroke={palette.ink} strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx={px(0)} cy={py(start)} r="5" fill="var(--background)" stroke={palette.blue} strokeWidth="3" />
        <circle cx={px(step)} cy={py(eulerNext)} r="5" fill={palette.blue} />
        <circle cx={px(step)} cy={py(exactNext)} r="5" fill={palette.teal} />
        <g fontSize="12" fontWeight="700">
          <text x={px(step) + 7} y={py(eulerNext) + 5} fill={palette.blue}>Euler</text>
          <text x={px(step) + 7} y={py(exactNext) - 8} fill={palette.teal}>정확한 값</text>
          <text x={(px(0) + px(step)) / 2} y={py(start) - 8} textAnchor="middle" fill={palette.ink}>시간 h</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">시간 (s)</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: '현재 rate f', value: slope.toFixed(3), accent: 'amber' },
        { label: '누적 변화 h·f', value: (step * slope).toFixed(3) },
        { label: 'Euler next', value: eulerNext.toFixed(3), accent: 'blue' },
        { label: '한 step 오차', value: Math.abs(eulerNext - exactNext).toExponential(2), accent: 'rose' },
      ]} />
      <output hidden data-ode-euler-next={eulerNext.toFixed(6)} data-ode-euler-error={Math.abs(eulerNext - exactNext).toExponential(6)} />
    </LabShell>
  );
}

function integrateDecay(step: number, method: 'euler' | 'rk4', rate = 1.3, end = 3) {
  let t = 0;
  let y = 1;
  const points: Point[] = [{ x: t, y }];
  const f = (value: number) => -rate * value;
  while (t < end - 1e-10) {
    const h = Math.min(step, end - t);
    if (method === 'euler') {
      y += h * f(y);
    } else {
      const k1 = f(y);
      const k2 = f(y + (h * k1) / 2);
      const k3 = f(y + (h * k2) / 2);
      const k4 = f(y + h * k3);
      y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
    }
    t += h;
    points.push({ x: t, y });
  }
  return points;
}

export function ErrorConvergenceLab() {
  const [step, setStep] = useState(0.6);
  const rate = 1.3;
  const exactEnd = Math.exp(-rate * 3);
  const euler = useMemo(() => integrateDecay(step, 'euler'), [step]);
  const rk4 = useMemo(() => integrateDecay(step, 'rk4'), [step]);
  const eulerHalf = useMemo(() => integrateDecay(step / 2, 'euler'), [step]);
  const rk4Half = useMemo(() => integrateDecay(step / 2, 'rk4'), [step]);
  const exact = Array.from({ length: 101 }, (_, index) => {
    const t = (index / 100) * 3;
    return { x: t, y: Math.exp(-rate * t) };
  });
  const eError = Math.abs(euler.at(-1)!.y - exactEnd);
  const eHalfError = Math.abs(eulerHalf.at(-1)!.y - exactEnd);
  const rError = Math.abs(rk4.at(-1)!.y - exactEnd);
  const rHalfError = Math.abs(rk4Half.at(-1)!.y - exactEnd);
  const px = (value: number) => 42 + (value / 3) * 378;
  const py = (value: number) => 208 - clamp(value, -0.1, 1.05) * 174;

  return (
    <LabShell
      id="error-convergence"
      index="04"
      eyebrow="Error propagation"
      title="step을 절반으로 줄였을 때 오차가 얼마나 줄어드는지 본다"
      description="끝점 하나의 우연한 일치가 아니라 h와 h/2의 error ratio로 method의 global order를 확인한다."
      controls={<RangeControl label="비교할 기준 step h" value={step} min={0.15} max={0.75} step={0.05} unit=" s" onChange={setStep} />}
      footer="Euler의 ratio는 2, RK4는 16 쪽으로 접근한다. 이는 충분히 작은 h의 smooth nonstiff 구간에서 기대하는 차수이지 모든 모델의 보증서가 아니다."
    >
      <Plot label="정확한 감소와 Euler RK4 수치 경로 및 step-halving 오차">
        <AxisGrid />
        <path d={linePath(exact, px, py)} fill="none" stroke={palette.teal} strokeWidth="3" strokeLinecap="round" />
        <path d={linePath(euler, px, py)} fill="none" stroke={palette.amber} strokeWidth="2.5" strokeDasharray="7 5" />
        <path d={linePath(rk4, px, py)} fill="none" stroke={palette.violet} strokeWidth="2.5" />
        {euler.map((point) => <circle key={`e-${point.x}`} cx={px(point.x)} cy={py(point.y)} r="3" fill={palette.amber} />)}
        <g fontSize="12" fontWeight="700">
          <text x="303" y="35" fill={palette.teal}>정확한 곡선</text>
          <text x="303" y="52" fill={palette.amber}>Euler h</text>
          <text x="303" y="69" fill={palette.violet}>RK4 h</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">시간 (s)</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: 'Euler 끝점 오차', value: eError.toExponential(2), accent: 'amber' },
        { label: 'Euler h/h÷2 ratio', value: (eError / Math.max(eHalfError, 1e-15)).toFixed(2) },
        { label: 'RK4 끝점 오차', value: rError.toExponential(2), accent: 'blue' },
        { label: 'RK4 h/h÷2 ratio', value: (rError / Math.max(rHalfError, 1e-15)).toFixed(2), accent: 'teal' },
      ]} />
      <output hidden data-ode-euler-ratio={(eError / Math.max(eHalfError, 1e-15)).toFixed(6)} data-ode-rk4-ratio={(rError / Math.max(rHalfError, 1e-15)).toFixed(6)} />
    </LabShell>
  );
}

export function StabilityStiffnessLab() {
  const [lambda, setLambda] = useState(-12);
  const [step, setStep] = useState(0.12);
  const multiplier = 1 + step * lambda;
  const slowMultiplier = 1 - step;
  const fastSequence = Array.from({ length: 9 }, (_, index) => ({ x: index, y: multiplier ** index }));
  const slowSequence = Array.from({ length: 9 }, (_, index) => ({ x: index, y: slowMultiplier ** index }));
  const stable = Math.abs(multiplier) < 1;
  const oscillatory = multiplier < 0;
  const px = (value: number) => 42 + (value / 8) * 378;
  const py = (value: number) => 113 - (clamp(value, -3.2, 3.2) / 3.2) * 88;
  const fastTau = 1 / Math.abs(lambda);
  const slowTau = 1;

  return (
    <LabShell
      id="stability-stiffness"
      index="05"
      eyebrow="Stability before accuracy"
      title="정확한 해가 줄어들어도 Euler multiplier는 오차를 키울 수 있다"
      description="λ와 h가 만든 g=1+hλ를 직접 바꾸며 안정·교대 감쇠·발산의 경계를 확인한다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeControl label="감쇠 mode λ" value={lambda} min={-40} max={-2} step={1} onChange={setLambda} />
          <RangeControl label="Euler step h" value={step} min={0.02} max={0.2} step={0.01} unit=" s" onChange={setStep} />
        </div>
      )}
      footer="여러 mode가 함께 있으면 가장 빠른 decay가 explicit step을 제한한다. 느린 현상만 보고 h를 고르면 fast mode의 numerical error가 먼저 폭발할 수 있다."
    >
      <Plot label="같은 Euler step으로 계산한 느린 mode와 빠른 mode의 감쇠 또는 발산 수열">
        <rect x="42" y={py(1)} width="378" height={py(-1) - py(1)} fill={palette.teal} opacity="0.06" />
        <line x1="42" x2="420" y1={py(0)} y2={py(0)} stroke="currentColor" opacity="0.18" />
        <line x1="42" x2="420" y1={py(1)} y2={py(1)} stroke={palette.teal} opacity="0.45" strokeDasharray="5 5" />
        <line x1="42" x2="420" y1={py(-1)} y2={py(-1)} stroke={palette.teal} opacity="0.45" strokeDasharray="5 5" />
        <path d={linePath(slowSequence, px, py)} fill="none" stroke={palette.teal} strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
        <path d={linePath(fastSequence, px, py)} fill="none" stroke={stable ? palette.blue : palette.rose} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {fastSequence.map((point) => (
          <circle key={point.x} cx={px(point.x)} cy={py(point.y)} r="4" fill={Math.abs(point.y) > 3.2 ? palette.rose : stable ? palette.blue : palette.rose} />
        ))}
        <g fontSize="12" fontWeight="700">
          <text x="48" y="33" fill={palette.teal}>slow λ=-1, g={slowMultiplier.toFixed(2)}</text>
          <text x="48" y="50" fill={stable ? palette.blue : palette.rose}>fast λ={lambda}, g={multiplier.toFixed(2)}</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">Euler step 번호</text>
          {!stable && <text x="416" y="33" textAnchor="end" fill={palette.rose}>fast mode 발산</text>}
        </g>
      </Plot>
      <MetricStrip items={[
        { label: 'slow multiplier', value: slowMultiplier.toFixed(2), accent: 'teal' },
        { label: 'fast multiplier', value: multiplier.toFixed(2), accent: stable ? 'blue' : 'rose' },
        { label: 'fast 수치 상태', value: stable ? (oscillatory ? '교대하며 감쇠' : '단조 감쇠') : '오차 증폭', accent: stable ? 'blue' : 'rose' },
        { label: '빠른 time scale', value: `${fastTau.toFixed(3)} s` },
      ]} />
      <output
        hidden
        data-ode-stability={stable ? 'stable' : 'unstable'}
        data-ode-multiplier={multiplier.toFixed(6)}
        data-ode-slow-multiplier={slowMultiplier.toFixed(6)}
        data-ode-time-scale-ratio={(slowTau / fastTau).toFixed(6)}
      />
    </LabShell>
  );
}

function oscillator(damping: number, initialVelocity: number) {
  const dt = 0.025;
  let q = 1.45;
  let v = initialVelocity;
  const points: Array<Point & { energy: number }> = [];
  const spring = 2.2;
  for (let index = 0; index <= 420; index += 1) {
    points.push({ x: q, y: v, energy: 0.5 * v * v + 0.5 * spring * q * q });
    const a = -spring * q - damping * v;
    v += a * dt;
    q += v * dt;
  }
  return points;
}

export function PhasePortraitLab() {
  const [damping, setDamping] = useState(0.65);
  const [initialVelocity, setInitialVelocity] = useState(0.4);
  const points = useMemo(() => oscillator(damping, initialVelocity), [damping, initialVelocity]);
  const px = (value: number) => 231 + value * 112;
  const py = (value: number) => 113 - value * 42;
  const start = points[0];
  const end = points.at(-1)!;
  const energyDrop = 1 - end.energy / start.energy;
  const markerId = useId().replace(/:/g, '');

  return (
    <LabShell
      id="phase-portrait"
      index="06"
      eyebrow="State-space portrait"
      title="위치와 속도를 한 점으로 묶으면 시간의 방향이 지도 위 궤적이 된다"
      description="옅은 화살표는 각 상태에서의 rate, 굵은 선은 한 초기 상태가 실제로 따라간 trajectory다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeControl label="감쇠 세기 c" value={damping} min={0} max={2.6} step={0.1} onChange={setDamping} />
          <RangeControl label="초기 속도" value={initialVelocity} min={-1.4} max={1.4} step={0.1} onChange={setInitialVelocity} />
        </div>
      )}
      footer="위치가 같아도 속도가 다르면 state point가 다르고 다음 방향도 다르다. 감쇠가 있으면 energy가 줄며 원점 안쪽으로 들어간다."
    >
      <Plot label="감쇠 진동자의 vector field와 위치 속도 phase portrait">
        <defs>
          <marker id={markerId} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" opacity="0.45" />
          </marker>
        </defs>
        <line x1="42" x2="420" y1={py(0)} y2={py(0)} stroke="currentColor" opacity="0.16" />
        <line x1={px(0)} x2={px(0)} y1="18" y2="208" stroke="currentColor" opacity="0.16" />
        <g color={palette.ink}>
          {[-1.4, -0.7, 0, 0.7, 1.4].flatMap((q) => [-1.6, -0.8, 0, 0.8, 1.6].map((v) => {
            const dq = v;
            const dv = -2.2 * q - damping * v;
            const length = Math.hypot(dq, dv) || 1;
            const scale = 12 / length;
            return (
              <line
                key={`${q}-${v}`}
                x1={px(q)}
                y1={py(v)}
                x2={px(q) + dq * scale}
                y2={py(v) - dv * scale}
                stroke="currentColor"
                opacity="0.34"
                strokeWidth="1.2"
                markerEnd={`url(#${markerId})`}
              />
            );
          }))}
        </g>
        <path d={linePath(points, px, py)} fill="none" stroke={palette.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={px(start.x)} cy={py(start.y)} r="5" fill="var(--background)" stroke={palette.blue} strokeWidth="3" />
        <circle cx={px(end.x)} cy={py(end.y)} r="4" fill={palette.teal} />
        <g fontSize="12" fontWeight="700">
          <text x="416" y={py(0) - 7} textAnchor="end" fill="currentColor" opacity="0.65">위치 q</text>
          <text x={px(0) + 7} y="31" fill="currentColor" opacity="0.65">속도 v</text>
          <text x={px(start.x) - 6} y={py(start.y) - 8} textAnchor="end" fill={palette.blue}>시작</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: 'state 차원', value: '[q, v] = 2' },
        { label: '마지막 위치', value: end.x.toFixed(3) },
        { label: '마지막 속도', value: end.y.toFixed(3) },
        { label: 'energy 감소', value: `${clamp(energyDrop * 100, 0, 100).toFixed(1)}%`, accent: damping > 0 ? 'teal' : 'amber' },
      ]} />
      <output hidden data-ode-phase-final-q={end.x.toFixed(6)} data-ode-phase-energy-drop={energyDrop.toFixed(6)} />
    </LabShell>
  );
}

export function BoundaryEnvelopeLab() {
  const [acceleration, setAcceleration] = useState(1.8);
  const [braking, setBraking] = useState(1);
  const [speedCap, setSpeedCap] = useState(2.8);
  const length = 10;
  const uncappedSwitch = (braking * length) / (acceleration + braking);
  const uncappedSpeed = Math.sqrt(2 * acceleration * uncappedSwitch);
  const capped = speedCap < uncappedSpeed;
  const accelEnd = capped ? speedCap ** 2 / (2 * acceleration) : uncappedSwitch;
  const brakeStart = capped ? length - speedCap ** 2 / (2 * braking) : uncappedSwitch;
  const switches = capped ? [accelEnd, brakeStart] : [uncappedSwitch];
  const px = (value: number) => 42 + (value / length) * 378;
  const py = (value: number) => 208 - (value / 4.4) * 178;
  const forward = Array.from({ length: 101 }, (_, index) => {
    const s = (index / 100) * length;
    return { x: s, y: Math.sqrt(2 * acceleration * s) };
  });
  const backward = Array.from({ length: 101 }, (_, index) => {
    const s = (index / 100) * length;
    return { x: s, y: Math.sqrt(2 * braking * (length - s)) };
  });
  const selected: Point[] = [
    ...forward.filter((point) => point.x < accelEnd),
    { x: accelEnd, y: capped ? speedCap : uncappedSpeed },
    ...(capped ? [{ x: brakeStart, y: speedCap }] : []),
    ...backward.filter((point) => point.x > brakeStart),
  ];

  return (
    <LabShell
      id="boundary-envelope"
      index="07"
      eyebrow="Two-boundary envelope"
      title="출발의 가속 경계와 도착의 제동 경계 사이에 속도 상한을 끼운다"
      description="cap이 교점보다 낮으면 단일 전환이 아니라 가속·순항·제동의 두 전환점이 생긴다."
      controls={(
        <div className="grid gap-4 sm:grid-cols-3">
          <RangeControl label="최대 가속 U" value={acceleration} min={0.6} max={2.8} step={0.1} onChange={setAcceleration} />
          <RangeControl label="최대 제동 크기" value={braking} min={0.5} max={2.4} step={0.1} onChange={setBraking} />
          <RangeControl label="속도 상한" value={speedCap} min={1.4} max={4.2} step={0.1} onChange={setSpeedCap} />
        </div>
      )}
      footer="이 상수-bound 예시는 원리를 보여 주는 최소형이다. 실제 torque-derived bound는 s와 속도에 따라 휘며 tangent point와 여러 switch가 생길 수 있다."
    >
      <Plot label="가속 forward curve 제동 backward curve 속도 상한과 실행 가능한 선택 경로">
        <AxisGrid />
        <path d={linePath(forward, px, py)} fill="none" stroke={palette.blue} strokeWidth="1.8" opacity="0.42" />
        <path d={linePath(backward, px, py)} fill="none" stroke={palette.amber} strokeWidth="1.8" opacity="0.45" />
        <line x1="42" x2="420" y1={py(speedCap)} y2={py(speedCap)} stroke={palette.violet} strokeWidth="2" strokeDasharray="6 5" />
        <path d={linePath(selected, px, py)} fill="none" stroke={palette.teal} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {switches.map((position, index) => (
          <g key={position}>
            <line x1={px(position)} x2={px(position)} y1={py(capped ? speedCap : uncappedSpeed)} y2="208" stroke={palette.rose} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={px(position)} cy={py(capped ? speedCap : uncappedSpeed)} r="5" fill="var(--background)" stroke={palette.rose} strokeWidth="3" />
            <text x={px(position)} y={py(capped ? speedCap : uncappedSpeed) - 9} textAnchor="middle" fontSize="12" fontWeight="700" fill={palette.rose}>전환 {index + 1}</text>
          </g>
        ))}
        <g fontSize="12" fontWeight="700">
          <text x="48" y="230" fill="currentColor" opacity="0.62">출발</text>
          <text x="420" y="230" textAnchor="end" fill="currentColor" opacity="0.62">도착 s=10</text>
          <text x="416" y={py(speedCap) - 8} textAnchor="end" fill={palette.violet}>속도 cap</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: 'uncapped 교점 속도', value: uncappedSpeed.toFixed(2) },
        { label: '경로 형태', value: capped ? '가속 → 순항 → 제동' : '가속 → 제동', accent: capped ? 'teal' : 'blue' },
        { label: '첫 전환 위치', value: accelEnd.toFixed(2), accent: 'rose' },
        { label: '둘째 전환 위치', value: capped ? brakeStart.toFixed(2) : '없음', accent: capped ? 'rose' : undefined },
      ]} />
      <output
        hidden
        data-ode-boundary-mode={capped ? 'accelerate-cruise-brake' : 'accelerate-brake'}
        data-ode-boundary-switch-count={switches.length}
        data-ode-boundary-switches={switches.map((value) => value.toFixed(4)).join(',')}
      />
    </LabShell>
  );
}

function eventValue(t: number) {
  return (t - 0.65) * (t - 1.35);
}

export function EventDetectionLab() {
  const [sampling, setSampling] = useState<'coarse' | 'fine'>('coarse');
  const step = sampling === 'coarse' ? 1.6 : 0.2;
  const start = 0.2;
  const end = 1.8;
  const roots = [0.65, 1.35];
  const samples: Point[] = [];
  for (let t = start; t < end - 1e-9; t += step) samples.push({ x: t, y: eventValue(t) });
  samples.push({ x: end, y: eventValue(end) });
  const detectedIntervals = samples.slice(0, -1).filter((point, index) => {
    const next = samples[index + 1];
    return point.y === 0 || next.y === 0 || point.y * next.y < 0;
  });
  const detectedRoots = sampling === 'coarse' ? 0 : 2;
  const curve = Array.from({ length: 101 }, (_, index) => {
    const t = start + (index / 100) * (end - start);
    return { x: t, y: eventValue(t) };
  });
  const px = (value: number) => 42 + ((value - start) / (end - start)) * 378;
  const py = (value: number) => 112 - (value / 0.62) * 82;

  return (
    <LabShell
      id="event-detection"
      index="08"
      eyebrow="Events between steps"
      title="두 endpoint의 부호가 같아도 그 사이에서 경계를 두 번 넘을 수 있다"
      description="같은 event function을 성긴 step과 촘촘한 step으로 표본화해 sign-change detector가 보는 정보 자체를 비교한다."
      controls={(
        <Segmented
          label="solver가 확인하는 step 간격"
          value={sampling}
          onChange={setSampling}
          options={[
            { value: 'coarse', label: '성긴 h = 1.60' },
            { value: 'fine', label: '촘촘한 h = 0.20' },
          ]}
        />
      )}
      footer="Event function 설계와 step 제한은 tolerance와 다른 책임이다. 한 step 안에서 여러 crossing이 가능한 문제라면 endpoint sign만으로 충분하지 않다."
    >
      <Plot label="한 step 안에 두 root가 있는 event function과 coarse fine sample">
        <line x1="42" x2="420" y1={py(0)} y2={py(0)} stroke="currentColor" opacity="0.22" />
        <path d={linePath(curve, px, py)} fill="none" stroke={palette.ink} strokeWidth="2.5" strokeLinecap="round" />
        {roots.map((root) => (
          <g key={root}>
            <line x1={px(root)} x2={px(root)} y1="27" y2="200" stroke={detectedRoots ? palette.teal : palette.rose} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={px(root)} cy={py(0)} r="5" fill={detectedRoots ? palette.teal : palette.rose} />
            <text x={px(root)} y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill={detectedRoots ? palette.teal : palette.rose}>
              {detectedRoots ? '검출' : '놓침'}
            </text>
          </g>
        ))}
        <path d={linePath(samples, px, py)} fill="none" stroke={palette.blue} strokeWidth="2" strokeDasharray="6 5" />
        {samples.map((point) => <circle key={point.x} cx={px(point.x)} cy={py(point.y)} r="5" fill="var(--background)" stroke={palette.blue} strokeWidth="3" />)}
        <g fontSize="12" fontWeight="700">
          <text x="46" y="228" fill="currentColor" opacity="0.62">0.2</text>
          <text x="420" y="228" textAnchor="end" fill="currentColor" opacity="0.62">1.8초</text>
        </g>
      </Plot>
      <MetricStrip items={[
        { label: 'step h', value: step.toFixed(2) },
        { label: '실제 root 수', value: '2' },
        { label: '검출 root 수', value: String(detectedRoots), accent: detectedRoots === 2 ? 'teal' : 'rose' },
        { label: 'sign-change interval', value: String(detectedIntervals.length), accent: detectedIntervals.length ? 'blue' : 'amber' },
      ]} />
      <output
        hidden
        data-ode-event-detected={detectedRoots}
        data-ode-event-sampling={sampling}
        data-ode-event-roots={roots.join(',')}
        data-ode-event-window={`${start},${end}`}
      />
    </LabShell>
  );
}
