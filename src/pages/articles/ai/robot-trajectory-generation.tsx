import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl, Takeaway } from './nlp-shared';

type Point = { x: number; y: number };
type ScalingMode = 'cubic' | 'quintic';

const raw = String.raw;
const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));

function timeScaling(mode: ScalingMode, u: number) {
  const x = clamp(u);
  if (mode === 'cubic') {
    return {
      s: 3 * x ** 2 - 2 * x ** 3,
      v: 6 * x - 6 * x ** 2,
      a: 6 - 12 * x,
      j: -12,
    };
  }
  return {
    s: 10 * x ** 3 - 15 * x ** 4 + 6 * x ** 5,
    v: 30 * x ** 2 - 60 * x ** 3 + 30 * x ** 4,
    a: 60 * x - 180 * x ** 2 + 120 * x ** 3,
    j: 60 - 360 * x + 360 * x ** 2,
  };
}

function pathPoint(s: number): Point {
  const start = { x: 0.08, y: 0.78 };
  const control = { x: 0.48, y: 0.08 };
  const goal = { x: 0.92, y: 0.68 };
  const u = 1 - s;
  return {
    x: u * u * start.x + 2 * u * s * control.x + s * s * goal.x,
    y: u * u * start.y + 2 * u * s * control.y + s * s * goal.y,
  };
}

function linePath(points: Point[], sx: (x: number) => number, sy: (y: number) => number) {
  return points.map((point, index) => `${index ? 'L' : 'M'} ${sx(point.x).toFixed(1)} ${sy(point.y).toFixed(1)}`).join(' ');
}

function PathTimingLab() {
  const [duration, setDuration] = useState(3.2);
  const [progress, setProgress] = useState(42);
  const u = progress / 100;
  const scale = timeScaling('quintic', u);
  const marker = pathPoint(scale.s);
  const path = Array.from({ length: 80 }, (_, index) => pathPoint(index / 79));
  const sx = (x: number) => 38 + x * 624;
  const sy = (y: number) => 278 - y * 230;
  const msx = (x: number) => 20 + x * 300;
  const msy = (y: number) => 244 - y * 196;
  const peakV = 1.875 / duration;
  const peakA = 5.774 / duration ** 2;
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">PATH / TIME LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">곡선은 고정하고 같은 진행률에 도달하는 시간만 바꾼다</strong>
        <span className="basis-full text-xs font-black text-blue-700 dark:text-blue-300 sm:basis-auto">t = {(u * duration).toFixed(2)} s</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-blue-500/[0.025] p-4 md:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">전체 duration · {duration.toFixed(1)} s<input className="mt-3 block w-full accent-blue-700" type="range" min="1" max="8" step="0.1" value={duration} onChange={(event) => setDuration(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">정규화 시간 u = t/T · {u.toFixed(2)}<input className="mt-3 block w-full accent-violet-700" type="range" min="0" max="100" step="1" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 275" className="block h-auto w-full sm:hidden" role="img" aria-label="같은 기하학적 경로 위의 시간 스케일링">
          <path d={linePath(path, msx, msy)} fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
          <line x1={msx(0.08)} y1={msy(0.78)} x2={msx(0.92)} y2={msy(0.68)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
          <circle cx={msx(marker.x)} cy={msy(marker.y)} r="9" fill="#7c3aed" stroke="white" strokeWidth="3" />
          <circle cx={msx(0.08)} cy={msy(0.78)} r="5" fill="#2563eb" /><circle cx={msx(0.92)} cy={msy(0.68)} r="5" fill="#059669" />
          <text x="18" y="267" fontSize="11" fill="currentColor" opacity="0.58">동일한 q(s) · quintic s(t)</text>
        </svg>
        <svg viewBox="0 0 700 315" className="hidden h-auto w-full sm:block" role="img" aria-label="같은 기하학적 경로 위의 시간 스케일링">
          <path d={linePath(path, sx, sy)} fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
          <line x1={sx(0.08)} y1={sy(0.78)} x2={sx(0.92)} y2={sy(0.68)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="7 6" opacity="0.55" />
          <circle cx={sx(marker.x)} cy={sy(marker.y)} r="11" fill="#7c3aed" stroke="white" strokeWidth="4" />
          <circle cx={sx(0.08)} cy={sy(0.78)} r="6" fill="#2563eb" /><circle cx={sx(0.92)} cy={sy(0.68)} r="6" fill="#059669" />
          <text x={sx(0.08) - 12} y={sy(0.78) - 14} fontSize="13" fontWeight="800" fill="#1d4ed8">start</text>
          <text x={sx(0.92) - 28} y={sy(0.68) - 15} fontSize="13" fontWeight="800" fill="#047857">goal</text>
          <text x="38" y="305" fontSize="13" fill="currentColor" opacity="0.58">blue curve = q(s) · violet marker = q(s(t))</text>
        </svg>
        <dl className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">경로 진행률</dt><dd className="mt-1 font-mono text-lg font-black">s = {scale.s.toFixed(3)}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">peak |ds/dt|</dt><dd className="mt-1 font-mono text-lg font-black text-violet-700 dark:text-violet-300">{peakV.toFixed(3)} /s</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">peak |d2s/dt2|</dt><dd className="mt-1 font-mono text-lg font-black text-amber-700 dark:text-amber-300">{peakA.toFixed(3)} /s2</dd></div>
        </dl>
      </div>
    </figure>
  );
}

const PROFILE_META = [
  { key: 's' as const, label: 'position s', color: '#2563eb', min: -0.05, max: 1.05 },
  { key: 'v' as const, label: 'velocity ds/du', color: '#7c3aed', min: -0.1, max: 2 },
  { key: 'a' as const, label: 'acceleration d2s/du2', color: '#d97706', min: -6.6, max: 6.6 },
  { key: 'j' as const, label: 'jerk d3s/du3', color: '#64748b', min: -66, max: 66 },
];

function TimeScalingProfiles() {
  const [mode, setMode] = useState<ScalingMode>('quintic');
  const [cursor, setCursor] = useState(35);
  const u = cursor / 100;
  const current = timeScaling(mode, u);
  const values = Array.from({ length: 101 }, (_, index) => ({ u: index / 100, ...timeScaling(mode, index / 100) }));
  return (
    <figure data-time-scaling-profiles className="foundation-viz-explorer not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SegmentedControl label="Time scaling polynomial" options={[{ value: 'cubic', label: 'Cubic' }, { value: 'quintic', label: 'Quintic' }]} value={mode} onChange={setMode} />
        <label className="min-w-48 flex-1 text-xs font-semibold text-muted-foreground sm:max-w-80">u cursor · {u.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="100" step="1" value={cursor} onChange={(event) => setCursor(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {PROFILE_META.map((meta) => {
          const width = 320; const height = 145; const left = 34; const right = 10; const top = 16; const bottom = 24;
          const x = (value: number) => left + value * (width - left - right);
          const y = (value: number) => top + ((meta.max - value) / (meta.max - meta.min)) * (height - top - bottom);
          const d = values.map((value, index) => `${index ? 'L' : 'M'} ${x(value.u).toFixed(1)} ${y(value[meta.key]).toFixed(1)}`).join(' ');
          return (
            <div key={meta.key} data-profile-key={meta.key} className="min-w-0 rounded-md border border-border bg-background p-2">
              <p className="px-1 text-xs font-bold" style={{ color: meta.color }}>{meta.label}</p>
              <svg viewBox={`0 0 ${width} ${height}`} className="mt-1 block h-auto w-full" role="img" aria-label={`${mode} ${meta.label} profile`}>
                <line x1={left} x2={width - right} y1={y(0)} y2={y(0)} stroke="currentColor" strokeOpacity="0.14" />
                <line x1={left} x2={left} y1={top} y2={height - bottom} stroke="currentColor" strokeOpacity="0.14" />
                <path d={d} fill="none" stroke={meta.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={x(u)} x2={x(u)} y1={top} y2={height - bottom} stroke="currentColor" strokeOpacity="0.28" strokeDasharray="4 4" />
                <circle cx={x(u)} cy={y(current[meta.key])} r="4" fill={meta.color} stroke="white" strokeWidth="1.5" />
                <text x={left} y={height - 6} fontSize="10" fill="currentColor" opacity="0.5">0</text><text x={width - right - 6} y={height - 6} fontSize="10" fill="currentColor" opacity="0.5">1</text>
                <text x={width - right} y={top + 9} textAnchor="end" fontSize="10" fontWeight="700" fill={meta.color}>{current[meta.key].toFixed(2)}</text>
              </svg>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{mode === 'cubic' ? 'Cubic은 양 끝 속도는 0이지만 가속도가 +6과 -6으로 남는다. 정지 상태와 이어 붙일 때 acceleration jump가 생긴다.' : 'Quintic은 위치·속도·가속도 여섯 경계조건을 맞춘다. 하지만 jerk까지 0인 것은 아니며, 구간을 이어 붙일 때 더 높은 연속성이 필요할 수 있다.'}</p>
    </figure>
  );
}

function CornerBlendLab() {
  const [blend, setBlend] = useState(0);
  const radius = blend / 100;
  const a = { x: 0.1, y: 0.78 }; const b = { x: 0.52, y: 0.28 }; const c = { x: 0.9, y: 0.78 };
  const p0 = { x: b.x + (a.x - b.x) * radius * 0.55, y: b.y + (a.y - b.y) * radius * 0.55 };
  const p1 = { x: b.x + (c.x - b.x) * radius * 0.55, y: b.y + (c.y - b.y) * radius * 0.55 };
  const curve = Array.from({ length: 36 }, (_, index) => {
    const t = index / 35; const u = 1 - t;
    return { x: u * u * p0.x + 2 * u * t * b.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * b.y + t * t * p1.y };
  });
  const sampleSegment = (start: Point, end: Point) => Array.from({ length: 24 }, (_, index) => ({
    x: start.x + (end.x - start.x) * (index / 23),
    y: start.y + (end.y - start.y) * (index / 23),
  }));
  const sx = (x: number) => 40 + x * 620; const sy = (y: number) => 292 - y * 238;
  const msx = (x: number) => 20 + x * 300; const msy = (y: number) => 256 - y * 208;
  const path = radius === 0
    ? [...sampleSegment(a, b), ...sampleSegment(b, c)]
    : [...sampleSegment(a, p0), ...curve, ...sampleSegment(p1, c)];
  const obstacle = { x: 0.48, y: 0.48, r: 0.08 };
  const minClearance = Math.min(...path.map((point) => Math.hypot(point.x - obstacle.x, point.y - obstacle.y) - obstacle.r));
  const collides = minClearance < 0;
  return (
    <figure data-corner-blend-lab className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">CORNER BLEND LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">통과 waypoint의 방향 급변을 곡선으로 바꾸되 충돌을 다시 검사한다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${collides ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{collides ? 'clearance violation' : `${minClearance.toFixed(3)} clearance`}</span>
      </figcaption>
      <div className="border-b border-border bg-amber-500/[0.025] p-4">
        <label className="text-xs font-semibold text-muted-foreground">Blend fraction · {blend}%<input className="mt-3 block w-full accent-amber-700" type="range" min="0" max="100" step="1" value={blend} onChange={(event) => setBlend(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 285" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 waypoint corner blending과 clearance">
          <circle cx={msx(obstacle.x)} cy={msy(obstacle.y)} r={obstacle.r * 300} fill="#dc2626" opacity="0.1" stroke="#dc2626" strokeWidth="2" />
          <text x={msx(obstacle.x)} y={msy(obstacle.y) + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#b91c1c">obstacle</text>
          <path d={linePath(path, msx, msy)} fill="none" stroke={collides ? '#dc2626' : '#2563eb'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {[a, b, c].map((point, index) => <circle key={index} cx={msx(point.x)} cy={msy(point.y)} r={index === 1 ? 7 : 5} fill={index === 1 ? '#d97706' : '#2563eb'} stroke="white" strokeWidth="2" />)}
          <text x={msx(b.x) + 10} y={msy(b.y) + 25} fontSize="11" fontWeight="800" fill="#92400e">via point</text>
          <text x="20" y="276" fontSize="11" fill="currentColor" opacity="0.58">{radius === 0 ? 'C0 corner · tangent jump' : 'blended tangent · geometry changed'}</text>
        </svg>
        <svg viewBox="0 0 700 330" className="hidden h-auto w-full sm:block" role="img" aria-label="waypoint corner blending과 clearance">
          <circle cx={sx(obstacle.x)} cy={sy(obstacle.y)} r={obstacle.r * 620} fill="#dc2626" opacity="0.1" stroke="#dc2626" strokeWidth="2" />
          <text x={sx(obstacle.x)} y={sy(obstacle.y) + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#b91c1c">obstacle</text>
          <path d={linePath(path, sx, sy)} fill="none" stroke={collides ? '#dc2626' : '#2563eb'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {[a, b, c].map((point, index) => <circle key={index} cx={sx(point.x)} cy={sy(point.y)} r={index === 1 ? 8 : 6} fill={index === 1 ? '#d97706' : '#2563eb'} stroke="white" strokeWidth="3" />)}
          <line x1={sx(b.x)} y1={sy(b.y)} x2={sx(b.x + (b.x - a.x) * 0.24)} y2={sy(b.y + (b.y - a.y) * 0.24)} stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 4" />
          <line x1={sx(b.x)} y1={sy(b.y)} x2={sx(b.x + (c.x - b.x) * 0.24)} y2={sy(b.y + (c.y - b.y) * 0.24)} stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 4" />
          <text x={sx(b.x) + 12} y={sy(b.y) + 28} fontSize="13" fontWeight="800" fill="#92400e">via point</text>
          <text x="40" y="318" fontSize="13" fill="currentColor" opacity="0.58">{radius === 0 ? 'C0 path: incoming tangent != outgoing tangent' : 'Blend removes the tangent jump, but creates a new geometric path'}</text>
        </svg>
      </div>
    </figure>
  );
}

const JOINTS = [
  { name: 'J1 shoulder', delta: 1.2, vmax: 0.8, amax: 1.4, color: '#2563eb' },
  { name: 'J2 elbow', delta: 0.4, vmax: 0.5, amax: 0.9, color: '#7c3aed' },
  { name: 'J3 wrist', delta: 1.8, vmax: 1.2, amax: 2.0, color: '#059669' },
];

function LimitRetimingLab() {
  const bounds = useMemo(() => JOINTS.map((joint) => {
    const tv = 1.875 * Math.abs(joint.delta) / joint.vmax;
    const ta = Math.sqrt(5.774 * Math.abs(joint.delta) / joint.amax);
    return { ...joint, tv, ta, required: Math.max(tv, ta) };
  }), []);
  const minimum = Math.max(...bounds.map((joint) => joint.required));
  const bottleneck = bounds.find((joint) => joint.required === minimum)!;
  const [duration, setDuration] = useState(2.3);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">LIMIT / SYNC LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">각 관절의 최소 시간을 계산한 뒤 가장 느린 관절에 모두 맞춘다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${duration >= minimum ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{duration >= minimum ? 'limits satisfied' : 'limit violation'}</span>
      </figcaption>
      <div className="border-b border-border bg-violet-500/[0.025] p-4">
        <label className="text-xs font-semibold text-muted-foreground">공통 duration T · {duration.toFixed(2)} s<input className="mt-3 block w-full accent-violet-700" type="range" min="1" max="5" step="0.05" value={duration} onChange={(event) => setDuration(Number(event.target.value))} /></label>
      </div>
      <div className="space-y-5 p-4 sm:p-6">
        {bounds.map((joint) => {
          const demandV = 1.875 * Math.abs(joint.delta) / duration;
          const demandA = 5.774 * Math.abs(joint.delta) / duration ** 2;
          const ratio = Math.max(demandV / joint.vmax, demandA / joint.amax);
          return (
            <div key={joint.name} className="grid min-w-0 gap-3 sm:grid-cols-[8rem_minmax(0,1fr)_7rem] sm:items-center">
              <div><p className="text-sm font-black">{joint.name}</p><p className="mt-1 text-xs text-muted-foreground">delta q = {joint.delta.toFixed(1)} rad</p></div>
              <div className="relative h-3 overflow-hidden rounded-sm bg-muted"><div className={`absolute inset-y-0 left-0 ${ratio > 1 ? 'bg-red-600' : ''}`} style={{ width: `${Math.min(100, ratio * 100)}%`, backgroundColor: ratio > 1 ? undefined : joint.color }} /><span className="absolute inset-y-0 left-[99%] w-px bg-foreground/70" /></div>
              <div className="text-left sm:text-right"><p className={`font-mono text-sm font-black ${ratio > 1 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{(ratio * 100).toFixed(0)}%</p><p className="text-[11px] text-muted-foreground">need {joint.required.toFixed(2)} s</p></div>
            </div>
          );
        })}
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Conservative minimum</p><p className="mt-1 font-mono text-lg font-black">{minimum.toFixed(2)} s</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Bottleneck</p><p className="mt-1 text-sm font-black text-violet-700 dark:text-violet-300">{bottleneck.name}</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Synchronization</p><p className="mt-1 text-sm font-black">모두 같은 T에 도착</p></div>
        </div>
      </div>
    </figure>
  );
}

type DynamicJoint = {
  name: string;
  shortName: string;
  a: number;
  b: number;
  d: number;
  c: number;
  tauMin: number;
  tauMax: number;
  pathSlope: number;
  velocityLimit: number;
  color: string;
};

type JointAccelerationBound = DynamicJoint & {
  offsetTorque: number;
  lower: number | null;
  upper: number | null;
  speedOnly: boolean;
  speedFeasible: boolean;
};

const ZERO_INERTIA_EPSILON = 0.02;
const EDGE_ACCELERATION_TOLERANCE = 1e-6;

function projectedDynamics(s: number, payload: number): DynamicJoint[] {
  const z = (s - 0.62) / 0.16;
  const loadPeak = Math.exp(-(z * z));
  return [
    {
      name: 'J1 · 어깨',
      shortName: 'J1',
      a: 1.9 + 0.35 * Math.cos(Math.PI * s),
      b: 0.75 + 0.65 * Math.sin(Math.PI * s),
      d: 0.1,
      c: 0.65 + payload * (0.5 + loadPeak),
      tauMin: -4.5,
      tauMax: 4.2,
      pathSlope: 0.75 + 0.25 * Math.sin(Math.PI * s),
      velocityLimit: 1.5,
      color: '#2563eb',
    },
    {
      name: 'J2 · 팔꿈치',
      shortName: 'J2',
      a: -1.25 + 0.18 * Math.sin(2 * Math.PI * s),
      b: 1.05 + 0.35 * Math.cos(Math.PI * s),
      d: 0.08,
      c: -0.35 - payload * (0.25 + 0.45 * loadPeak),
      tauMin: -3.8,
      tauMax: 2.4,
      pathSlope: -0.48 + 0.18 * Math.cos(Math.PI * s),
      velocityLimit: 1.1,
      color: '#7c3aed',
    },
    {
      name: 'J3 · 손목',
      shortName: 'J3',
      a: 0.012 + 0.006 * Math.cos(2 * Math.PI * (s - 0.62)),
      b: 1.15 + 0.85 * loadPeak,
      d: 0.05,
      c: 0.25 + payload * (0.35 + 0.85 * loadPeak),
      tauMin: -2.8,
      tauMax: 2.6,
      pathSlope: 0.8 + 0.25 * loadPeak,
      velocityLimit: 1.45,
      color: '#0f766e',
    },
  ];
}

function accelerationBounds(s: number, speed: number, payload: number, reserve: number) {
  let lower = Number.NEGATIVE_INFINITY;
  let upper = Number.POSITIVE_INFINITY;
  let lowerOwner = '';
  let upperOwner = '';
  const rows: JointAccelerationBound[] = projectedDynamics(s, payload).map((joint) => {
    const offsetTorque = joint.b * speed ** 2 + joint.d * speed + joint.c;
    const tauMin = joint.tauMin + reserve;
    const tauMax = joint.tauMax - reserve;
    const speedOnly = Math.abs(joint.a) < ZERO_INERTIA_EPSILON;
    if (speedOnly) {
      return {
        ...joint,
        offsetTorque,
        lower: null,
        upper: null,
        speedOnly,
        speedFeasible: offsetTorque >= tauMin && offsetTorque <= tauMax,
      };
    }
    const first = (tauMin - offsetTorque) / joint.a;
    const second = (tauMax - offsetTorque) / joint.a;
    const jointLower = Math.min(first, second);
    const jointUpper = Math.max(first, second);
    if (jointLower > lower) {
      lower = jointLower;
      lowerOwner = joint.shortName;
    }
    if (jointUpper < upper) {
      upper = jointUpper;
      upperOwner = joint.shortName;
    }
    return {
      ...joint,
      offsetTorque,
      lower: jointLower,
      upper: jointUpper,
      speedOnly,
      speedFeasible: true,
    };
  });
  const speedFeasible = rows.every((row) => row.speedFeasible);
  return {
    rows,
    lower,
    upper,
    lowerOwner,
    upperOwner,
    feasible: speedFeasible && lower <= upper,
    speedFeasible,
  };
}

function feasibleSpeedCeiling(s: number, payload: number, reserve: number) {
  const joints = projectedDynamics(s, payload);
  const kinematicCeiling = Math.min(...joints.map((joint) => joint.velocityLimit / Math.abs(joint.pathSlope)));
  let ceiling = 0;
  // Educational conservative envelope: keep only the locally feasible speed
  // component connected to rest. A general island-aware ACOT must retain and
  // search higher disconnected components instead of stopping at the first gap.
  for (let index = 0; index <= 260; index += 1) {
    const candidate = kinematicCeiling * index / 260;
    if (!accelerationBounds(s, candidate, payload, reserve).feasible) break;
    ceiling = candidate;
  }
  return ceiling;
}

type SquaredSpeedInterval = {
  lower: number;
  upper: number;
};

function sampledFeasibleIntervals(
  maximum: number,
  predicate: (candidateSquared: number) => boolean,
  sampleCount = 96,
): SquaredSpeedInterval[] {
  if (!Number.isFinite(maximum) || maximum < 0) return [];
  if (maximum === 0) return predicate(0) ? [{ lower: 0, upper: 0 }] : [];

  const refineBoundary = (left: number, right: number, leftFeasible: boolean) => {
    let low = left;
    let high = right;
    for (let iteration = 0; iteration < 24; iteration += 1) {
      const middle = (low + high) / 2;
      if (predicate(middle) === leftFeasible) low = middle;
      else high = middle;
    }
    return leftFeasible ? low : high;
  };

  const intervals: SquaredSpeedInterval[] = [];
  let previous = 0;
  let previousFeasible = predicate(0);
  let openLower = previousFeasible ? 0 : null;

  for (let sample = 1; sample <= sampleCount; sample += 1) {
    const candidate = maximum * sample / sampleCount;
    const feasible = predicate(candidate);
    if (!previousFeasible && feasible) {
      openLower = refineBoundary(previous, candidate, false);
    } else if (previousFeasible && !feasible && openLower !== null) {
      intervals.push({
        lower: openLower,
        upper: refineBoundary(previous, candidate, true),
      });
      openLower = null;
    }
    previous = candidate;
    previousFeasible = feasible;
  }

  if (previousFeasible && openLower !== null) {
    intervals.push({ lower: openLower, upper: maximum });
  }
  return intervals;
}

function buildRetimingProfile(payload: number, reserve: number, count = 81) {
  const step = 1 / (count - 1);
  const ceiling = Array.from({ length: count }, (_, index) => feasibleSpeedCeiling(index * step, payload, reserve));
  const forwardCandidate = Array.from<number | null>({ length: count }).fill(null);
  const controllableSets = Array.from({ length: count }, () => [] as SquaredSpeedInterval[]);
  const optimalSquared = Array.from<number | null>({ length: count }).fill(null);
  const terminalFeasible = accelerationBounds(1, 0, payload, reserve).feasible;
  let profileFeasible = terminalFeasible;
  const failureReasons: Array<{ stage: 'terminal' | 'backward' | 'forward'; index: number; reason: string }> = [];
  if (!profileFeasible) {
    failureReasons.push({ stage: 'terminal', index: count - 1, reason: 'TERMINAL_STATE_INFEASIBLE' });
  }

  // This first curve is explanatory only: always ask for U, then apply the
  // pointwise speed ceiling. Invalid states remain null instead of becoming a
  // fabricated zero-speed state. The executable curve is rebuilt below.
  forwardCandidate[0] = 0;
  for (let index = 0; index < count - 1; index += 1) {
    const current = forwardCandidate[index];
    if (current === null) continue;
    const bound = accelerationBounds(index * step, current, payload, reserve);
    const nextSquaredSpeed = current ** 2 + 2 * bound.upper * step;
    if (!bound.feasible || !Number.isFinite(nextSquaredSpeed) || nextSquaredSpeed < 0) {
      continue;
    }
    forwardCandidate[index + 1] = Math.min(ceiling[index + 1], Math.sqrt(nextSquaredSpeed));
  }

  // Keep every sampled connected component of C_k. This avoids assuming that
  // nonlinear speed-dependent bounds make C_k downward-closed.
  controllableSets[count - 1] = terminalFeasible ? [{ lower: 0, upper: 0 }] : [];
  for (let index = count - 2; index >= 0; index -= 1) {
    const nextSet = controllableSets[index + 1];
    if (nextSet.length === 0) {
      profileFeasible = false;
      failureReasons.push({ stage: 'backward', index, reason: 'NEXT_CONTROLLABLE_SET_EMPTY' });
      continue;
    }
    const ceilingSquared = ceiling[index] ** 2;
    const canReachNextSet = (candidateSquared: number) => {
      const candidateSpeed = Math.sqrt(candidateSquared);
      const bound = accelerationBounds(index * step, candidateSpeed, payload, reserve);
      if (!bound.feasible) return false;
      const reachableLower = candidateSquared + 2 * bound.lower * step;
      const reachableUpper = candidateSquared + 2 * bound.upper * step;
      return nextSet.some((interval) => (
        Math.max(reachableLower, interval.lower) <= Math.min(reachableUpper, interval.upper) + 1e-10
      ));
    };
    const intervals = sampledFeasibleIntervals(
      ceilingSquared,
      canReachNextSet,
      Math.max(512, count * 8),
    );
    controllableSets[index] = intervals;
    if (intervals.length === 0) {
      profileFeasible = false;
      failureReasons.push({ stage: 'backward', index, reason: 'CURRENT_CONTROLLABLE_SET_EMPTY' });
    }
  }

  const activeModes: Array<'accelerate' | 'controllable' | 'infeasible'> = [];
  optimalSquared[0] = 0;
  for (let index = 0; index < count - 1; index += 1) {
    const currentSquared = optimalSquared[index];
    const nextSet = controllableSets[index + 1];
    if (currentSquared === null || nextSet.length === 0) {
      profileFeasible = false;
      failureReasons.push({
        stage: 'forward',
        index,
        reason: currentSquared === null ? 'CURRENT_STATE_MISSING' : 'NEXT_CONTROLLABLE_SET_EMPTY',
      });
      activeModes.push('infeasible');
      continue;
    }
    const bound = accelerationBounds(index * step, Math.sqrt(currentSquared), payload, reserve);
    const reachableLower = currentSquared + 2 * bound.lower * step;
    const reachableUpper = currentSquared + 2 * bound.upper * step;
    const intersections = bound.feasible
      ? nextSet.flatMap((interval) => {
          const lower = Math.max(reachableLower, interval.lower);
          const upper = Math.min(reachableUpper, interval.upper);
          return lower <= upper + 1e-10 ? [{ lower, upper }] : [];
        })
      : [];
    if (intersections.length === 0) {
      profileFeasible = false;
      failureReasons.push({ stage: 'forward', index, reason: 'REACHABLE_CONTROLLABLE_INTERSECTION_EMPTY' });
      activeModes.push('infeasible');
      continue;
    }
    const nextSquared = Math.max(...intersections.map((interval) => interval.upper));
    const requiredAcceleration = (nextSquared - currentSquared) / (2 * step);
    if (
      requiredAcceleration < bound.lower - EDGE_ACCELERATION_TOLERANCE
      || requiredAcceleration > bound.upper + EDGE_ACCELERATION_TOLERANCE
    ) {
      profileFeasible = false;
      failureReasons.push({
        stage: 'forward',
        index,
        reason: `EDGE_ACCELERATION_OUT_OF_BOUNDS:req=${requiredAcceleration.toFixed(8)},L=${bound.lower.toFixed(8)},U=${bound.upper.toFixed(8)}`,
      });
      activeModes.push('infeasible');
      continue;
    }
    optimalSquared[index + 1] = nextSquared;
    activeModes.push(nextSquared < reachableUpper - 1e-8 ? 'controllable' : 'accelerate');
  }

  const switchIndices = activeModes.flatMap((mode, index) => (
    index > 0
      && mode !== 'infeasible'
      && activeModes[index - 1] !== 'infeasible'
      && activeModes[index - 1] !== mode
      ? [index]
      : []
  ));
  const switchIndex = switchIndices[0] ?? null;
  const toPoint = (value: number | null, index: number) => ({
    s: index * step,
    v: value === null ? null : Math.sqrt(value),
  });
  return {
    status: profileFeasible ? 'feasible' as const : 'infeasible' as const,
    ceiling: ceiling.map((v, index) => ({ s: index * step, v })),
    forward: forwardCandidate.map((v, index) => ({ s: index * step, v })),
    backward: controllableSets.map((intervals, index) => ({
      s: index * step,
      v: intervals.length === 0 ? null : Math.sqrt(Math.max(...intervals.map((interval) => interval.upper))),
    })),
    optimal: optimalSquared.map(toPoint),
    controllableSets,
    failureReasons,
    switchIndex,
    switchIndices,
    profileFeasible,
  };
}

function summarizeRetimingProfile(
  profile: ReturnType<typeof buildRetimingProfile>,
  payload: number,
) {
  const step = 1 / (profile.optimal.length - 1);
  let totalTime = 0;
  let peakTorque = 0;
  for (let index = 0; index < profile.optimal.length - 1; index += 1) {
    const current = profile.optimal[index];
    const next = profile.optimal[index + 1];
    if (current.v === null || next.v === null) {
      totalTime = Number.POSITIVE_INFINITY;
      break;
    }
    const currentSpeed = current.v;
    const nextSpeed = next.v;
    const speedSum = currentSpeed + nextSpeed;
    if (speedSum <= 1e-9) {
      totalTime = Number.POSITIVE_INFINITY;
      break;
    }
    totalTime += (2 * step) / speedSum;
    const acceleration = (nextSpeed ** 2 - currentSpeed ** 2) / (2 * step);
    projectedDynamics(current.s, payload).forEach((joint) => {
      const torque = joint.a * acceleration + joint.b * currentSpeed ** 2 + joint.d * currentSpeed + joint.c;
      peakTorque = Math.max(peakTorque, Math.abs(torque));
    });
  }
  return {
    totalTime: profile.profileFeasible ? totalTime : Number.POSITIVE_INFINITY,
    peakTorque,
    switchPositions: profile.switchIndices.map((index) => profile.optimal[index].s),
    failure: profile.failureReasons[0] ?? null,
  };
}

function gridConvergenceEvidence(payload: number, reserve: number, coarseCount: number, fineCount: number) {
  const coarse = summarizeRetimingProfile(buildRetimingProfile(payload, reserve, coarseCount), payload);
  const fine = summarizeRetimingProfile(buildRetimingProfile(payload, reserve, fineCount), payload);
  const switching = coarse.switchPositions.length !== fine.switchPositions.length
    ? Number.POSITIVE_INFINITY
    : coarse.switchPositions.length === 0
      ? 0
      : Math.max(...coarse.switchPositions.map((position, index) => (
          Math.abs(position - fine.switchPositions[index])
        )));
  return {
    pair: `${coarseCount} → ${fineCount}`,
    time: Number.isFinite(coarse.totalTime) && Number.isFinite(fine.totalTime) && fine.totalTime > 1e-12
      ? Math.abs(coarse.totalTime - fine.totalTime) / fine.totalTime * 100
      : Number.POSITIVE_INFINITY,
    switching,
    torque: Math.abs(coarse.peakTorque - fine.peakTorque),
    coarseFailure: coarse.failure,
    fineFailure: fine.failure,
  };
}

function PhasePlaneLab() {
  const [payload, setPayload] = useState(45);
  const [position, setPosition] = useState(62);
  const [speed, setSpeed] = useState(80);
  const [mode, setMode] = useState<'nominal' | 'robust'>('robust');
  const payloadFactor = payload / 100;
  const s = position / 100;
  const pathSpeed = speed / 100;
  const reserve = mode === 'robust' ? 0.2 : 0;
  const profile = useMemo(() => buildRetimingProfile(payloadFactor, reserve), [payloadFactor, reserve]);
  const local = accelerationBounds(s, pathSpeed, payloadFactor, reserve);
  const localCeiling = feasibleSpeedCeiling(s, payloadFactor, reserve);
  const localFeasible = local.feasible && pathSpeed <= localCeiling + 0.005;
  const profileIndex = Math.round(s * (profile.controllableSets.length - 1));
  const stateControllable = profile.controllableSets[profileIndex].some((interval) => (
    pathSpeed ** 2 >= interval.lower - 1e-8 && pathSpeed ** 2 <= interval.upper + 1e-8
  ));
  const stateFeasible = localFeasible && stateControllable;
  const switchCandidate = profile.switchIndex === null ? null : profile.optimal[profile.switchIndex];
  const switchPoint = switchCandidate && switchCandidate.v !== null
    ? { s: switchCandidate.s, v: switchCandidate.v }
    : null;
  const sx = (value: number) => 56 + value * 594;
  const sy = (value: number) => 286 - value * 170;
  const msx = (value: number) => 34 + value * 285;
  const msy = (value: number) => 234 - value * 132;
  const makePath = (data: { s: number; v: number | null }[], x: typeof sx, y: typeof sy) => {
    let pathOpen = false;
    return data.map((point) => {
      if (point.v === null) {
        pathOpen = false;
        return '';
      }
      const command = pathOpen ? 'L' : 'M';
      pathOpen = true;
      return `${command} ${x(point.s).toFixed(1)} ${y(point.v).toFixed(1)}`;
    }).join(' ');
  };
  const intervalMin = -5;
  const intervalMax = 4;
  const intervalPosition = (value: number) => `${clamp((value - intervalMin) / (intervalMax - intervalMin)) * 100}%`;
  return (
    <figure
      data-dynamic-retiming-lab
      data-feasible={stateFeasible ? 'true' : 'false'}
      data-state-controllable={stateControllable ? 'true' : 'false'}
      data-profile-status={profile.status}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">DYNAMIC RETIMING LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">세 관절의 토크 한계를 가속도 구간으로 바꾸고 실제 전진·역방향 경계를 계산한다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${stateFeasible && profile.profileFeasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
          {profile.profileFeasible
            ? stateFeasible
              ? '전체 경로 REACHABLE · 현재 상태 TERMINAL-CONTROLLABLE'
              : localFeasible
                ? '현재 상태는 순간 FEASIBLE · 종점 정지는 불가'
                : local.speedFeasible
                  ? '현재 가속도 구간 EMPTY'
                  : '현재 속도 한계 초과'
            : '전체 경로 NO-PATH · 격자 도달 가능 집합 단절'}
        </span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-emerald-500/[0.025] p-4 md:grid-cols-2 xl:grid-cols-4">
        <SegmentedControl
          label="토크 예산"
          options={[{ value: 'nominal', label: '명목 한계' }, { value: 'robust', label: '0.20 N·m 예비' }]}
          value={mode}
          onChange={setMode}
        />
        <label className="text-xs font-semibold text-muted-foreground">경로 위치 s · {s.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="100" step="1" value={position} onChange={(event) => setPosition(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">경로 속도 ds/dt · {pathSpeed.toFixed(2)} /s<input className="mt-3 block w-full accent-violet-700" type="range" min="0" max="160" step="1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">적재물·외력 · {payload}%<input className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="100" step="1" value={payload} onChange={(event) => setPayload(Number(event.target.value))} /></label>
      </div>

      <div className="grid gap-px border-b border-border bg-border sm:grid-cols-4">
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">교집합 L</p><p className="mt-1 font-mono text-lg font-black">{Number.isFinite(local.lower) ? local.lower.toFixed(2) : '—'} /s²</p><p className="text-[11px] text-muted-foreground">{local.lowerOwner || '속도 전용 판정'}</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">교집합 U</p><p className="mt-1 font-mono text-lg font-black">{Number.isFinite(local.upper) ? local.upper.toFixed(2) : '—'} /s²</p><p className="text-[11px] text-muted-foreground">{local.upperOwner || '속도 전용 판정'}</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">현재 속도 상한</p><p className="mt-1 font-mono text-lg font-black text-amber-700 dark:text-amber-300">{localCeiling.toFixed(2)} /s</p><p className="text-[11px] text-muted-foreground">토크·관절 속도 동시 적용</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">첫 제약 전환</p><p className={`mt-1 font-mono text-lg font-black ${switchPoint ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{switchPoint ? `s = ${switchPoint.s.toFixed(2)}` : '찾지 못함'}</p><p className="text-[11px] text-muted-foreground">{switchPoint ? `활성 경계 변화 ${profile.switchIndices.length}회 중 첫 지점` : '임의의 중간값으로 대체하지 않음'}</p></div>
      </div>

      <div className="grid gap-8 p-4 sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-xs font-black">관절별 허용 가속도 구간</p>
            <p className="font-mono text-[11px] text-muted-foreground">공통 축 −5 … +4 /s²</p>
          </div>
          <div className="mt-4 space-y-5">
            {local.rows.map((row) => {
              const tauMin = row.tauMin + reserve;
              const tauMax = row.tauMax - reserve;
              if (row.speedOnly) {
                return (
                  <div key={row.shortName} className={`rounded-md border p-3 ${row.speedFeasible ? 'border-emerald-500/25 bg-emerald-500/[0.025]' : 'border-red-500/35 bg-red-500/[0.035]'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-black">{row.name}</p>
                      <span className={`text-[11px] font-black ${row.speedFeasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>|a₃| &lt; 0.02 · 나누지 않음</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">가속도 계수가 거의 0이므로 속도 항 토크 {row.offsetTorque.toFixed(2)} N·m가 [{tauMin.toFixed(1)}, {tauMax.toFixed(1)}] 안인지 직접 검사한다.</p>
                  </div>
                );
              }
              return (
                <div key={row.shortName}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black">{row.name}</p>
                    <p className="font-mono text-xs font-black" style={{ color: row.color }}>
                      a={row.a.toFixed(2)} {row.a < 0 ? '· 부등호 반전' : ''} · [{row.lower!.toFixed(2)}, {row.upper!.toFixed(2)}]
                    </p>
                  </div>
                  <div className="relative mt-2 h-8 rounded-sm border border-border bg-muted/25">
                    <span className="absolute inset-y-0 w-px bg-foreground/25" style={{ left: intervalPosition(0) }} />
                    <span
                      className="absolute top-1/2 h-2 -translate-y-1/2 rounded-sm"
                      style={{
                        left: intervalPosition(row.lower!),
                        right: `${100 - Number.parseFloat(intervalPosition(row.upper!))}%`,
                        backgroundColor: row.color,
                      }}
                    />
                    <span className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-foreground" style={{ left: intervalPosition(row.lower!) }} />
                    <span className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-foreground" style={{ left: intervalPosition(row.upper!) }} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">속도·마찰·중력이 먼저 쓰는 토크 h = {row.offsetTorque.toFixed(2)} N·m</p>
                </div>
              );
            })}
          </div>
          <div className={`mt-5 rounded-md border p-3 ${stateFeasible ? 'border-emerald-500/30 bg-emerald-500/[0.035]' : 'border-red-500/35 bg-red-500/[0.035]'}`}>
            <p className="text-xs font-black">{stateFeasible ? '교집합이 남아 다음 적분 단계로 진행' : '현재 상태를 적분하면 안 됨'}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {stateFeasible
                ? `L=${local.lower.toFixed(2)} ≤ U=${local.upper.toFixed(2)}이고 속도도 상한 이하이다.`
                : !local.speedFeasible
                  ? '가속도로 복구할 수 없는 속도 전용 토크 제약이 먼저 깨졌다.'
                  : `L=${local.lower.toFixed(2)}가 U=${local.upper.toFixed(2)}보다 커 모든 관절이 공유하는 가속도가 없다.`}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <svg viewBox="0 0 340 280" className="block h-auto w-full sm:hidden" role="img" aria-label="토크 제약에서 계산한 모바일 경로 속도 phase plane">
            <path d={`${makePath(profile.ceiling, msx, msy)} L ${msx(1)} ${msy(0)} L ${msx(0)} ${msy(0)} Z`} fill="#d97706" fillOpacity="0.08" />
            <path d={makePath(profile.ceiling, msx, msy)} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 4" />
            <path d={makePath(profile.forward, msx, msy)} fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.7" />
            <path d={makePath(profile.backward, msx, msy)} fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.7" />
            <path d={makePath(profile.optimal, msx, msy)} fill="none" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1={msx(0)} x2={msx(1)} y1={msy(0)} y2={msy(0)} stroke="currentColor" strokeOpacity="0.22" />
            <line x1={msx(0)} x2={msx(0)} y1={msy(0)} y2={msy(1.6)} stroke="currentColor" strokeOpacity="0.22" />
            <line x1={msx(s)} x2={msx(s)} y1={msy(0)} y2={msy(pathSpeed)} stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.35" />
            <circle cx={msx(s)} cy={msy(pathSpeed)} r="6" fill={stateFeasible ? '#059669' : '#dc2626'} stroke="white" strokeWidth="2" />
            {switchPoint && <circle cx={msx(switchPoint.s)} cy={msy(switchPoint.v)} r="5" fill="#059669" stroke="white" strokeWidth="2" />}
            <text x="34" y="270" fontSize="12" fill="currentColor" opacity="0.62">경로 위치 s</text>
            <text x="7" y="25" fontSize="12" fill="currentColor" opacity="0.62">속도</text>
            <text x="186" y="263" fontSize="12" fontWeight="700" fill="#059669">초록: 실행 속도선</text>
          </svg>
          <svg viewBox="0 0 700 350" className="hidden h-auto w-full sm:block" role="img" aria-label="토크 제약에서 계산한 경로 속도 phase plane">
            {[0, 0.4, 0.8, 1.2, 1.6].map((tick) => <g key={tick}><line x1={sx(0)} x2={sx(1)} y1={sy(tick)} y2={sy(tick)} stroke="currentColor" strokeOpacity="0.08" /><text x={sx(0) - 10} y={sy(tick) + 4} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.55">{tick.toFixed(1)}</text></g>)}
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => <text key={tick} x={sx(tick)} y="330" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.55">{tick.toFixed(2)}</text>)}
            <path d={`${makePath(profile.ceiling, sx, sy)} L ${sx(1)} ${sy(0)} L ${sx(0)} ${sy(0)} Z`} fill="#d97706" fillOpacity="0.08" />
            <path d={makePath(profile.ceiling, sx, sy)} fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="7 5" />
            <path d={makePath(profile.forward, sx, sy)} fill="none" stroke="#2563eb" strokeWidth="2.5" opacity="0.68" />
            <path d={makePath(profile.backward, sx, sy)} fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity="0.68" />
            <path d={makePath(profile.optimal, sx, sy)} fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1={sx(0)} x2={sx(1)} y1={sy(0)} y2={sy(0)} stroke="currentColor" strokeOpacity="0.24" />
            <line x1={sx(0)} x2={sx(0)} y1={sy(0)} y2={sy(1.6)} stroke="currentColor" strokeOpacity="0.24" />
            <line x1={sx(s)} x2={sx(s)} y1={sy(0)} y2={sy(pathSpeed)} stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.35" />
            <circle cx={sx(s)} cy={sy(pathSpeed)} r="7" fill={stateFeasible ? '#059669' : '#dc2626'} stroke="white" strokeWidth="2.5" />
            {switchPoint && <circle cx={sx(switchPoint.s)} cy={sy(switchPoint.v)} r="6" fill="#059669" stroke="white" strokeWidth="2.5" />}
            {switchPoint && <text x={sx(switchPoint.s) + 10} y={sy(switchPoint.v) - 10} fontSize="12" fontWeight="800" fill="#047857">가속→감속 전환</text>}
            <text x="56" y="346" fontSize="13" fill="currentColor" opacity="0.62">경로 위치 s</text>
          </svg>
          <div className="mt-3 grid gap-2 text-[11px] font-bold sm:grid-cols-2">
            <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-blue-600" aria-hidden="true" />파랑 · 출발점 최대가속 후보</span>
            <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-violet-600" aria-hidden="true" />보라 · 종점 도달 가능 상한</span>
            <span className="flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-amber-600" aria-hidden="true" />주황 · 속도 천장</span>
            <span className="flex items-center gap-2"><i className="h-1 w-5 bg-emerald-600" aria-hidden="true" />초록 · 매 edge를 재검사한 속도선</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">각 격자에서 <strong>x=(ds/dt)²</strong>와 <strong>dx/ds=2·d²s/dt²</strong>를 쓴 교육용 이산 도달 가능 집합 근사다. <strong>feasibleSpeedCeiling은 속도 0과 이어진 첫 local feasible 성분만 남기고 첫 gap에서 멈춘다.</strong> 따라서 그 위에 다시 나타나는 friction-induced feasible component와 island를 찾는 원문의 일반 ACOT가 아니라 보수적 교육 근사다. 이 잘린 범위 안에서는 <strong>C_k가 항상 0부터 시작한다고 가정하지 않고</strong> 샘플에서 발견한 controllable 연결 구간들을 모두 보존한다. 보라선은 그 구간들 중 가장 높은 경계만 보여 준다. 초록선은 매 edge의 reachable interval과 다음 구간들의 교집합을 고르고 필요한 가속도가 다시 [L,U] 안인지 검사한다. 현재 점도 로컬 한계뿐 아니라 가장 가까운 C_k에 속하는지 확인한다. 실제 배포용 retimer는 더 촘촘한 수렴 검사와 TOPP-RA 같은 검증된 도달 가능 집합 solver가 필요하다.</p>
        </div>
      </div>
    </figure>
  );
}

type RetargetMode = 'restart' | 'continuous';

function RetargetLab() {
  const [mode, setMode] = useState<RetargetMode>('continuous');
  const [target, setTarget] = useState(1.35);
  const currentV = 0.42; const currentA = -0.15;
  const samples = Array.from({ length: 61 }, (_, index) => {
    const t = index / 60;
    const p0 = 0.62;
    const v0 = mode === 'restart' ? 0 : currentV;
    const a0 = mode === 'restart' ? 0 : currentA;
    const delta = target - p0;
    const c0 = p0;
    const c1 = v0;
    const c2 = a0 / 2;
    const c3 = 10 * delta - 6 * v0 - 1.5 * a0;
    const c4 = -15 * delta + 8 * v0 + 1.5 * a0;
    const c5 = 6 * delta - 3 * v0 - 0.5 * a0;
    return {
      t,
      p: c0 + c1 * t + c2 * t ** 2 + c3 * t ** 3 + c4 * t ** 4 + c5 * t ** 5,
      v: c1 + 2 * c2 * t + 3 * c3 * t ** 2 + 4 * c4 * t ** 3 + 5 * c5 * t ** 4,
      a: 2 * c2 + 6 * c3 * t + 12 * c4 * t ** 2 + 20 * c5 * t ** 3,
      j: 6 * c3 + 24 * c4 * t + 60 * c5 * t ** 2,
    };
  });
  const limits = { v: 1.25, a: 3.8, j: 36 };
  const peaks = {
    v: Math.max(...samples.map((sample) => Math.abs(sample.v))),
    a: Math.max(...samples.map((sample) => Math.abs(sample.a))),
    j: Math.max(...samples.map((sample) => Math.abs(sample.j))),
  };
  const limitPass = peaks.v <= limits.v && peaks.a <= limits.a && peaks.j <= limits.j;
  const panels = [
    { key: 'p' as const, label: 'position', color: '#2563eb', min: 0.45, max: 1.65, limit: null },
    { key: 'v' as const, label: 'velocity', color: '#7c3aed', min: -0.2, max: 2.0, limit: limits.v },
    { key: 'a' as const, label: 'acceleration', color: '#d97706', min: -6.5, max: 6.5, limit: limits.a },
    { key: 'j' as const, label: 'jerk', color: '#0f766e', min: -72, max: 72, limit: limits.j },
  ];
  return (
    <figure data-retarget-lab className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-300">STATE CONTINUITY / LIMIT LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">현재 p·v·a에서 잇는 quintic이 연속인지와 v·a·j 극값을 따로 검사한다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${mode === 'restart' || !limitPass ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{mode === 'restart' ? '초기 상태 불연속' : limitPass ? '연속 · 한계 통과' : '연속 · 한계 초과'}</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-teal-500/[0.025] p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
        <SegmentedControl label="Retarget strategy" options={[{ value: 'restart', label: '0에서 재시작' }, { value: 'continuous', label: '현재 상태 연결' }]} value={mode} onChange={setMode} />
        <label className="text-xs font-semibold text-muted-foreground">새 target position · {target.toFixed(2)}<input className="mt-3 block w-full accent-teal-700" type="range" min="0.8" max="1.6" step="0.01" value={target} onChange={(event) => setTarget(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
        {panels.map((panel) => {
          const width = 250; const height = 170; const left = 34; const right = 12; const top = 18; const bottom = 28;
          const x = (value: number) => left + value * (width - left - right);
          const y = (value: number) => top + ((panel.max - value) / (panel.max - panel.min)) * (height - top - bottom);
          const d = samples.map((sample, index) => `${index ? 'L' : 'M'} ${x(sample.t).toFixed(1)} ${y(sample[panel.key]).toFixed(1)}`).join(' ');
          const previous = panel.key === 'p' ? 0.62 : panel.key === 'v' ? currentV : currentA;
          const generatedStart = samples[0][panel.key];
          const peak = samples.reduce((best, sample) => Math.abs(sample[panel.key]) > Math.abs(best[panel.key]) ? sample : best);
          return (
            <div key={panel.key} data-retarget-panel={panel.key} className="min-w-0 rounded-md border border-border p-2">
              <p className="px-1 text-xs font-bold" style={{ color: panel.color }}>{panel.label}</p>
              <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={`online retarget ${panel.label}`}>
                <line x1={left} x2={width - right} y1={y(0)} y2={y(0)} stroke="currentColor" strokeOpacity="0.14" />
                {panel.limit !== null && [-panel.limit, panel.limit]
                  .filter((limit) => limit >= panel.min && limit <= panel.max)
                  .map((limit) => (
                    <line key={limit} x1={left} x2={width - right} y1={y(limit)} y2={y(limit)}
                      stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5 4" strokeOpacity="0.55" />
                  ))}
                <path d={d} fill="none" stroke={panel.color} strokeWidth="3" strokeLinecap="round" />
                {panel.key !== 'j' && (
                  <>
                    <circle cx={x(0)} cy={y(previous)} r="5" fill="#059669" stroke="white" strokeWidth="2" />
                    <circle cx={x(0)} cy={y(generatedStart)} r="4" fill={mode === 'restart' && panel.key !== 'p' ? '#dc2626' : panel.color} />
                  </>
                )}
                {panel.key === 'j' && (
                  <>
                    <line x1={x(0)} x2={x(0)} y1={top} y2={height - bottom} stroke="#0f766e" strokeWidth="1.2" strokeDasharray="3 3" />
                    <circle data-jerk-peak cx={x(peak.t)} cy={y(peak.j)} r="5" fill={peaks.j > limits.j ? '#dc2626' : panel.color} stroke="white" strokeWidth="2" />
                    <text x={x(peak.t)} y={Math.max(top + 10, y(peak.j) - 9)}
                      textAnchor={peak.t > 0.75 ? 'end' : peak.t < 0.25 ? 'start' : 'middle'}
                      fontSize="10" fontWeight="700" fill={peaks.j > limits.j ? '#b91c1c' : panel.color}>peak</text>
                  </>
                )}
                <text x={left} y={height - 7} fontSize="10" fill="currentColor" opacity="0.5">{panel.key === 'j' ? 'retarget 경계 · 점선은 ±j limit' : 'retarget tick'}</text>
              </svg>
            </div>
          );
        })}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Current input</p><p className="mt-1 font-mono text-xs font-black">p .62 · v .42 · a -.15</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Peak |velocity|</p><p className={`mt-1 font-mono text-xs font-black ${peaks.v > limits.v ? 'text-red-700 dark:text-red-300' : ''}`}>{peaks.v.toFixed(2)} / {limits.v.toFixed(2)}</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Peak |acceleration|</p><p className={`mt-1 font-mono text-xs font-black ${peaks.a > limits.a ? 'text-red-700 dark:text-red-300' : ''}`}>{peaks.a.toFixed(2)} / {limits.a.toFixed(2)}</p></div>
        <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Peak |jerk|</p><p className={`mt-1 font-mono text-xs font-black ${peaks.j > limits.j ? 'text-red-700 dark:text-red-300' : ''}`}>{peaks.j.toFixed(2)} / {limits.j.toFixed(2)}</p></div>
      </div>
      <p className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground">이 Lab은 임의의 quintic을 이용해 <strong>현재 상태 연속성과 한계 사후 검사</strong>를 보여 준다. 시간 최적 jerk-limited profile을 계산하는 Ruckig 자체는 아니며, 실제 solver는 입력 한계를 구성 과정에서 만족시키고 매 control tick의 출력을 다음 current state로 넘긴다.</p>
    </figure>
  );
}

function ExecutionContract() {
  const [active, setActive] = useState(3);
  const stages = [
    ['Path snapshot', 'q(s), scene v41', '모든 edge와 clearance가 검증됨'],
    ['Blend', 'C1/C2 path', '새 곡선도 scene v41에서 재검사'],
    ['Parameterize', 'q(t), qdot, qddot', 'v/a/torque limits와 sync 충족'],
    ['Jerk / online', 'current p,v,a -> next state', 'j limit과 control period 충족'],
    ['Revalidate', 'scene v43, measured q', 'version과 start drift를 허용 범위 내 확인'],
    ['Execute', 'timestamped setpoints', 'tracking error와 safety stop 감시'],
  ];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-px bg-border md:grid-cols-6">
        {stages.map(([name], index) => <button key={name} type="button" onClick={() => setActive(index)} className={`min-h-16 px-3 py-3 text-left text-xs font-black transition-colors ${active === index ? 'bg-blue-700 text-white' : 'bg-background hover:bg-muted/40'}`}><span className="mb-1 block font-mono text-[10px] opacity-60">0{index + 1}</span>{name}</button>)}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4"><p className="text-xs font-semibold text-muted-foreground">이 단계가 받는 것</p><p className="mt-2 font-mono text-sm font-black leading-relaxed">{stages[active][1]}</p></div>
        <div className="bg-blue-500/[0.03] p-4"><p className="text-xs font-semibold text-muted-foreground">다음 단계로 넘기기 전 gate</p><p className="mt-2 text-sm font-black leading-relaxed">{stages[active][2]}</p></div>
      </div>
    </div>
  );
}

function DynamicReleaseGate() {
  const [evidence, setEvidence] = useState<'recorded' | 'revalidated'>('recorded');
  const convergence = useMemo(
    () => evidence === 'recorded'
      ? gridConvergenceEvidence(0.45, 0.2, 21, 41)
      : gridConvergenceEvidence(0.45, 0.2, 201, 401),
    [evidence],
  );
  const scenario = evidence === 'recorded'
    ? { start: 0.012, dwell: 4, plannedScene: 'v41', executionScene: 'v43' }
    : { start: 0.006, dwell: 1, plannedScene: 'v43', executionScene: 'v43' };
  const values = { ...convergence, ...scenario };
  const rows = [
    { kind: '모델 재계산', metric: `격자 총시간 변화 · ${values.pair}`, value: `${values.time.toFixed(2)}%`, threshold: '≤ 1.00%', pass: values.time <= 1, reason: 'GRID_TIME_NOT_CONVERGED' },
    { kind: '모델 재계산', metric: '모든 전환 위치의 최대 변화', value: values.switching.toFixed(3), threshold: '≤ 0.005', pass: values.switching <= 0.005, reason: 'SWITCH_NOT_CONVERGED' },
    { kind: '모델 재계산', metric: '최대 토크 변화', value: `${values.torque.toFixed(2)} N·m`, threshold: '≤ 0.10 N·m', pass: values.torque <= 0.1, reason: 'PEAK_TORQUE_NOT_CONVERGED' },
    { kind: '예시 증거', metric: '측정 시작 상태 오차', value: `${values.start.toFixed(3)} rad`, threshold: '≤ 0.010 rad', pass: values.start <= 0.01, reason: 'START_STATE_DRIFT' },
    { kind: '예시 증거', metric: 'Controller replay · 1 kHz 재생 중 포화 지속시간', value: `${values.dwell} ms`, threshold: '≤ 2 ms', pass: values.dwell <= 2, reason: 'REPLAY_SATURATION_DWELL' },
    { kind: '예시 증거', metric: '계획 장면 버전', value: `${values.plannedScene} → ${values.executionScene}`, threshold: '정확히 일치', pass: values.plannedScene === values.executionScene, reason: 'SCENE_VERSION_MISMATCH' },
  ];
  const failures = rows.filter((row) => !row.pass);
  return (
    <div
      data-dynamic-retiming-release-gate
      data-release={failures.length === 0 ? 'go' : 'no-go'}
      data-coarse-failure={convergence.coarseFailure ? `${convergence.coarseFailure.stage}:${convergence.coarseFailure.index}:${convergence.coarseFailure.reason}` : 'none'}
      data-fine-failure={convergence.fineFailure ? `${convergence.fineFailure.stage}:${convergence.fineFailure.index}:${convergence.fineFailure.reason}` : 'none'}
      className="not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-4">
        <div>
          <h3 className="text-lg font-bold">동역학 retiming 실행 허용 gate</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">앞의 교육용 동역학 모델을 서로 다른 격자 수로 다시 계산해 총시간·전환 위치·최대 토크를 직접 비교한다. 이때 a_i가 0에 가까우면 나눗셈 대신 남은 토크의 feasibility를 검사한다. 시작 오차·Controller replay·장면 버전은 실행 증거 묶음 형식을 보여 주는 명시적 예시 기록이며 실제 로봇 측정값으로 오해하면 안 된다.</p>
        </div>
        <SegmentedControl
          label="증거 묶음"
          options={[{ value: 'recorded', label: '수정 전 기록' }, { value: 'revalidated', label: '재검증 기록' }]}
          value={evidence}
          onChange={setEvidence}
        />
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.metric} className="grid min-w-0 gap-2 px-4 py-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(7rem,0.65fr)_minmax(7rem,0.65fr)_5rem] sm:items-center sm:gap-4">
            <div>
              <p className={`mb-1 text-[10px] font-black ${row.kind === '모델 재계산' ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>{row.kind}</p>
              <p className="text-sm font-bold">{row.metric}</p>
              {!row.pass && <code className="mt-1 block break-all text-[10px] font-bold text-red-700 dark:text-red-300">{row.reason}</code>}
            </div>
            <p className="font-mono text-sm font-black">{row.value}</p>
            <p className="text-xs text-muted-foreground">{row.threshold}</p>
            <p className={`text-xs font-black sm:text-right ${row.pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{row.pass ? 'PASS' : 'FAIL'}</p>
          </li>
        ))}
      </ul>
      <div className={`border-t border-border p-4 ${failures.length === 0 ? 'bg-emerald-500/[0.04]' : 'bg-red-500/[0.04]'}`}>
        <p className={`text-sm font-black ${failures.length === 0 ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}`}>
          {failures.length === 0 ? 'GO · 여섯 증거가 모두 선언한 기준을 통과했다.' : `NO-GO · ${failures.length}개 독립 실패가 남아 실행을 차단한다.`}
        </p>
        {failures.length > 0 && <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">{failures.map((row) => row.reason).join(' · ')}</p>}
      </div>
    </div>
  );
}

export default function RobotTrajectoryGenerationArticle() {
  return (
    <>
      <QuestionLead question="Motion planner가 collision-free waypoint를 반환했다. 왜 아직 로봇에 보내면 안 될까?" answer="Waypoint는 어디를 지나갈지만 말하고 언제 도착할지, 중간 속도·가속도·jerk가 얼마인지, motor torque로 가능한지 말하지 않는다. Trajectory generation은 geometric path를 유지하거나 안전하게 매끈하게 바꾼 뒤, 모든 관절과 actuator가 실행 가능한 시간 법칙을 붙이고 현재 상태와 scene을 다시 검증하는 단계다." />
      <ConceptPrimer title="이 글을 관통하는 네 객체" items={[
        { term: 'Path q(s)', meaning: 's in [0,1]을 따라가는 configuration의 기하학적 곡선', why: '충돌과 clearance는 주로 이 곡선의 모양이 결정한다.' },
        { term: 'Time scaling s(t)', meaning: '실제 시간 t가 경로 진행률 s를 얼마나 빨리 전진시키는가', why: '같은 path도 s(t)에 따라 velocity·acceleration·torque가 달라진다.' },
        { term: 'Trajectory q(t)', meaning: 'Controller가 timestamp마다 추적할 position과 그 미분값', why: '실행 인터페이스는 waypoint list가 아니라 시간에 묶인 상태다.' },
        { term: 'Retiming / generation', meaning: '고정 path의 시간을 최적화하거나 현재 상태에서 새 목표까지 운동을 생성하는 일', why: 'Offline path parameterization과 online target change를 같은 smoothing으로 오해하지 않게 한다.' },
      ]} />

      <NlpSection id="path-time" marker="01" tone="blue" question="같은 curve를 1초와 5초에 통과하면 무엇이 같고 무엇이 달라질까?" title="경로는 where이고 time scaling은 when이다">
        <p>Motion planning의 출력은 보통 <strong>q(s)</strong>다. s는 초가 아니라 경로 위 위치를 나타내는 무차원 parameter다. 여기에 시작에서 0, 끝에서 1이 되는 <strong>s(t)</strong>를 합성해야 실제 trajectory가 된다.</p>
        <MathFormula display>{raw`\underbrace{q(t)}_{\text{실행할 궤적}}=\underbrace{q(s)}_{\text{고정된 경로}}\big|_{s=\underbrace{s(t)}_{\text{시간 법칙}}}`}</MathFormula>
        <FormulaNote meaning="Trajectory는 새 경로가 아니라 geometric path에 clock을 붙인 합성함수다. Retiming에서는 q(s)를 고정하고 s(t)만 바꾸므로 collision geometry는 그대로지만 actuator demand는 달라진다." symbols={[["q(s)", 'Configuration-space의 기하학적 path'], ["s(t)", '실제 시간을 path progress에 연결하는 단조 함수'], ["q(t)", 'Controller가 시간 순서대로 추적할 trajectory']]} />
        <MathFormula display>{raw`\underbrace{\dot q}_{\text{관절 속도}}=\underbrace{q'(s)}_{\text{경로 기울기}}\underbrace{\dot s}_{\text{진행 속도}},\qquad \underbrace{\ddot q}_{\text{관절 가속도}}=\underbrace{q'(s)\ddot s}_{\text{접선 가속}}+\underbrace{q''(s)\dot s^2}_{\text{곡률 가속}}`}</MathFormula>
        <FormulaNote meaning="Chain rule은 time scaling이 path geometry를 actuator 요구량으로 바꾸는 연결부다. 같은 path를 T배 느리게 실행하면 velocity는 대략 1/T, acceleration은 1/T^2로 줄지만, curve의 q'' 항은 사라지지 않는다." symbols={[["q'(s)", 'Path tangent: progress 한 단위당 joint 변화'], ["q''(s)", 'Path curvature: tangent가 얼마나 변하는가'], [raw`\dot s,\ddot s`, '경로 진행 속도와 가속도'], [raw`\dot q,\ddot q`, '실제 joint velocity와 acceleration']]} />
        <PathTimingLab />
        <Takeaway>Duration slider를 늘려도 blue path는 바뀌지 않는다. Peak velocity는 1/T, peak acceleration은 1/T²로 내려간다. “천천히 하면 된다”는 말은 kinematic limit에는 유효하지만 gravity나 minimum-speed process constraint까지 자동 해결하는 것은 아니다.</Takeaway>
      </NlpSection>

      <NlpSection id="boundary-conditions" marker="02" tone="violet" question="시작과 끝에서 멈추기만 하면 cubic으로 충분한데 quintic은 왜 쓸까?" title="Polynomial 차수는 만족할 경계조건의 수가 결정한다">
        <p>정규화 시간 u=t/T를 쓰면 cubic에는 네 coefficient가 있고, 시작·끝 position과 양 끝 velocity 0이라는 네 조건으로 정확히 결정된다. Acceleration까지 0으로 연결하려면 조건이 여섯 개이므로 quintic이 필요하다.</p>
        <MathFormula display>{raw`\underbrace{s_3(u)=3u^2-2u^3}_{\text{위치·속도 4조건}},\qquad \underbrace{s_5(u)=10u^3-15u^4+6u^5}_{\text{위치·속도·가속도 6조건}}`}</MathFormula>
        <FormulaNote meaning="두 profile 모두 s(0)=0, s(1)=1과 endpoint velocity 0을 만족한다. Quintic은 endpoint acceleration도 0으로 만들어 정지 구간과의 acceleration discontinuity를 없앤다." symbols={[["u=t/T", '0에서 1까지 가는 정규화 시간'], ["s_3", 'Cubic time scaling'], ["s_5", 'Quintic time scaling']]} />
        <TimeScalingProfiles />
        <p>Polynomial이 부드러워 보인다는 사실과 limits를 만족한다는 사실은 다르다. q(s)의 slope와 curvature, duration T를 넣어 모든 joint의 peak v·a를 검사해야 한다. 또한 quintic의 endpoint jerk는 0이 아니므로 vibration-sensitive 장비에는 S-curve나 jerk-limited solver가 필요할 수 있다.</p>
        <Misconception>차수가 높을수록 항상 좋지는 않다. 조건 없이 고차 polynomial을 쓰면 overshoot와 수치 conditioning이 나빠질 수 있다. 필요한 derivative continuity와 limit을 먼저 정하고 그에 맞는 표현을 선택한다.</Misconception>
      </NlpSection>

      <NlpSection id="waypoint-continuity" marker="03" tone="amber" question="위치가 끊기지 않는 polyline인데 corner에서 왜 무한대 가속도가 필요할까?" title="Pass-through waypoint는 위치뿐 아니라 tangent와 시간 미분이 이어져야 한다">
        <p>A-B-C 두 선분은 B에서 위치가 이어지므로 C0 continuous다. 하지만 incoming tangent와 outgoing tangent가 다르면 유한한 시간 안에 velocity direction이 순간적으로 바뀐다. 멈추지 않고 B를 통과하려면 impulse-like acceleration이 필요하다.</p>
        <MathFormula display>{raw`\underbrace{q_i(t_i^-)=q_i(t_i^+)}_{\text{C0: 위치 연속}},\qquad \underbrace{\dot q_i(t_i^-)=\dot q_i(t_i^+)}_{\text{C1: 속도 연속}},\qquad \underbrace{\ddot q_i(t_i^-)=\ddot q_i(t_i^+)}_{\text{C2: 가속도 연속}}`}</MathFormula>
        <FormulaNote meaning="Waypoint를 정확히 방문하는 것과 멈추지 않고 통과하는 것은 다른 constraint다. Controller가 position·velocity·acceleration setpoint를 받는다면 적어도 해당 derivative의 좌우 극한을 확인해야 한다." symbols={[["t_i^-", 'Waypoint 직전 시간'], ["t_i^+", 'Waypoint 직후 시간'], ["C0,C1,C2", '각각 위치, 1차 미분, 2차 미분 연속성']]} />
        <CornerBlendLab />
        <p>Corner blending은 시간을 조정하는 것이 아니라 path geometry 자체를 바꾼다. 따라서 blend radius가 커질수록 더 부드러워져도 obstacle 쪽으로 curve가 부풀거나 process waypoint를 놓칠 수 있다. 새 path는 collision, clearance와 task tolerance를 모두 다시 검증해야 한다.</p>
        <Takeaway>Waypoint에는 stop point, pass-through point, tolerance region이라는 서로 다른 의미가 있다. 이 의미가 없으면 spline은 수학적으로 매끈해도 task를 위반할 수 있다.</Takeaway>
      </NlpSection>

      <NlpSection id="limit-retiming" marker="04" tone="violet" question="세 관절을 각각 가장 빠르게 움직이면 왜 end effector path가 깨질까?" title="모든 자유도(DoF)의 limit을 계산한 뒤 하나의 clock으로 동기화한다">
        <p>한 segment에서 joint i의 변화량이 delta q_i이고 quintic scaling을 쓴다고 하자. Normalized peak velocity와 acceleration을 실제 시간으로 환산하면 duration의 보수적 lower bound를 얻는다.</p>
        <div className="not-prose my-3 grid gap-1 rounded-md border border-border px-2 py-3 sm:px-4">
          <MathFormula display className="my-0">{raw`\underbrace{T_{i,v}}_{\text{속도 최소 시간}}=\frac{1.875|\Delta q_i|}{v_{i,\max}},\qquad \underbrace{T_{i,a}}_{\text{가속도 최소 시간}}=\sqrt{\frac{5.774|\Delta q_i|}{a_{i,\max}}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\underbrace{T}_{\text{동기화된 공통 시간}}=\max_i\!\left(\underbrace{T_{i,v}}_{\text{속도 기준}},\underbrace{T_{i,a}}_{\text{가속도 기준}}\right)`}</MathFormula>
        </div>
        <FormulaNote meaning="각 관절이 독립적으로 끝나는 시간을 쓰면 중간 configuration이 원래 q(s)에서 벗어난다. 가장 느린 bottleneck의 duration을 공통 clock으로 사용하면 모든 joint가 같은 phase에서 함께 도착한다." symbols={[[raw`\Delta q_i`, 'Segment에서 i번째 joint의 이동량'], [raw`v_{i,\max},a_{i,\max}`, 'Joint별 velocity·acceleration 한계'], ["T_i", '해당 joint만 보았을 때 필요한 최소 duration'], ["T", '전체 trajectory가 공유할 synchronized duration']]} />
        <LimitRetimingLab />
        <p><strong>자유도(Degree of Freedom, DoF)</strong>는 로봇 상태를 독립적으로 바꿀 수 있는 축 하나다. 이 글의 관절 공간 예에서는 관절 하나가 DoF 하나지만, 이동 베이스나 coupled mechanism에서는 관절 수와 독립 DoF 수가 다를 수 있다. <strong>Time synchronization</strong>은 모든 DoF가 같은 종료시각에 도착하게 한다. <strong>Phase synchronization</strong>은 그보다 강해서 이동 중에도 각 DoF가 같은 normalized progress를 공유해 직선 또는 지정 path의 형태를 유지한다. 어느 것이 필요한지는 task geometry가 결정한다.</p>
        <Misconception>표의 bound는 단일 quintic segment의 kinematic check다. 여러 segment, nonzero endpoint state, Cartesian limit, coupled torque limit에서는 전체 path derivative와 dynamics를 사용한 retimer가 필요하다.</Misconception>
      </NlpSection>

      <NlpSection id="dynamic-retiming" marker="05" tone="green" question="같은 joint 속도 한계인데 어떤 자세에서는 더 천천히 가야 하는 이유는 무엇일까?" title="Torque limit은 path 위치와 속도에 따라 허용 가능한 가속도를 바꾼다">
        <p>Manipulator dynamics는 joint acceleration만 보는 독립 limit가 아니다. Inertia matrix, Coriolis·centrifugal term, gravity와 payload가 자세와 속도에 따라 actuator torque를 함께 사용한다.</p>
        <MathFormula display>{raw`\underbrace{M(q)\ddot q}_{\text{관성}}+\underbrace{C(q,\dot q)\dot q}_{\text{코리올리·원심}}+\underbrace{R\dot q}_{\text{점성 마찰}}+\underbrace{g(q)}_{\text{중력}}=\underbrace{\tau}_{\text{관절 토크}}`}</MathFormula>
        <FormulaNote meaning="같은 관절 가속도라도 자세·속도·적재물과 점성 마찰이 바뀌면 필요한 토크가 달라진다. Shin–McKay 원문에는 속도에 비례하는 Rq̇ 항이 있으므로 이를 생략한 3항식은 별도의 frictionless 축약으로만 써야 한다." symbols={[["M(q)", '자세에 따라 달라지는 관성 행렬'], [raw`C(q,\dot q)\dot q`, '속도의 제곱에 비례하는 코리올리·원심 효과'], [raw`R\dot q`, '속도에 비례하는 점성 마찰'], [raw`g(q)`, '정지해 있어도 자세에 따라 필요한 중력 토크'], [raw`\tau`, '모터들이 내야 하는 관절 토크 벡터']]} />
        <p>여기서 먼저 길과 시간을 분리한다. <MathFormula>{raw`q=q(s)`}</MathFormula>는 로봇이 지나갈 <strong>길의 모양</strong>이고, <MathFormula>{raw`s=s(t)`}</MathFormula>는 그 길을 시간에 따라 얼마나 빨리 진행할지 정하는 <strong>공통 시계</strong>다. 길은 그대로 둔 채 이 시계만 빠르게 하거나 느리게 만든다.</p>
        <div className="not-prose my-5 grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:p-4">
          <MathFormula display className="my-0">{raw`\dot q=q_s\dot s`}</MathFormula>
          <MathFormula display className="my-0">{raw`\ddot q=q_s\ddot s+q_{ss}\dot s^2`}</MathFormula>
        </div>
        <FormulaNote meaning="첫 식은 path tangent가 진행 속도를 관절 속도로 바꾸는 과정이다. 둘째 식에서는 진행 가속도뿐 아니라 path가 휘어 생기는 곡률 가속도도 남는다. 이제 이 두 식을 각 관절의 동역학에 그대로 대입한다." symbols={[[raw`q_s`, 'dq/ds, path tangent'], [raw`q_{ss}`, 'd²q/ds², path curvature'], [raw`\dot s`, '길 위에서 현재 진행하는 속도'], [raw`\ddot s`, '지금 가속 페달을 얼마나 밟거나 제동하는가']]} />
        <MathFormula display>{raw`\tau_i=\sum_jJ_{ij}\ddot q_j+\sum_{j,k}C_{ijk}\dot q_j\dot q_k+\sum_jR_{ij}\dot q_j+G_i`}</MathFormula>
        <FormulaNote meaning="Shin–McKay의 관절 i 식을 성분별로 쓰면 관성, 속도제곱, 점성마찰, 중력이 분리된다. q̇와 q̈에 위 연쇄법칙을 넣으면 s̈에 비례하는 항, ṡ²에 비례하는 항, ṡ에 비례하는 항, 속도와 무관한 항이 각각 남는다." symbols={[[raw`J_{ij}`, '원문의 inertia coefficient'], [raw`C_{ijk}`, '두 관절 속도의 곱에 붙는 계수'], [raw`R_{ij}`, '점성 마찰 계수'], [raw`G_i`, '관절 i의 중력·위치 의존 부하']]} />
        <div className="not-prose my-5 grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:grid-cols-2 sm:p-4">
          <MathFormula display className="my-0">{raw`a_i(s)=\sum_jJ_{ij}q_{s,j}`}</MathFormula>
          <MathFormula display className="my-0">{raw`b_i(s)=\sum_jJ_{ij}q_{ss,j}+\sum_{j,k}C_{ijk}q_{s,j}q_{s,k}`}</MathFormula>
          <MathFormula display className="my-0">{raw`d_i(s)=\sum_jR_{ij}q_{s,j}`}</MathFormula>
          <MathFormula display className="my-0">{raw`c_i(s)=G_i(q(s))`}</MathFormula>
        </div>
        <FormulaNote meaning="길 q(s)를 고정하면 네 계수는 path 위치 s에서 계산할 수 있다. 관성은 가속 페달 s̈에, 곡률·코리올리 부담은 속도 제곱 ṡ²에, 점성 마찰은 속도 ṡ에, 중력은 정지 상태에도 남는 상수항에 붙는다." symbols={[[raw`a_i`, 'Path tangent 방향의 관성'], [raw`b_i`, 'Path curvature와 코리올리·원심 효과'], [raw`d_i`, '원문에 남아 있는 속도 비례 점성 마찰'], [raw`c_i`, 'Path 위치에서의 중력·정적 부하']]} />
        <MathFormula display>{raw`\underbrace{\tau}_{\text{관절 토크}}=\underbrace{a(s)\ddot s}_{\text{가속 페달}}+\underbrace{b(s)\dot s^2}_{\text{속도 제곱 부담}}+\underbrace{d(s)\dot s}_{\text{점성 마찰}}+\underbrace{c(s)}_{\text{중력·부하}}`}</MathFormula>
        <FormulaNote meaning="이 4항식이 원문의 동역학을 path 위 scalar 문제로 내린 형태다. d(s)=0이라고 명시했을 때만 τ=a(s)s̈+b(s)ṡ²+c(s)의 3항 교육식으로 줄일 수 있다." symbols={[[raw`a(s)\ddot s`, '진행 가속도를 바꾸면 선형으로 달라지는 토크'], [raw`b(s)\dot s^2`, '같은 path에서 속도를 두 배로 하면 대체로 네 배가 되는 부담'], [raw`d(s)\dot s`, '속도에 비례하는 점성 마찰'], [raw`c(s)`, '정지해도 필요한 중력·부하 토크']]} />
        <p>숫자 하나로 경계를 계산해 보자. 아래 예제만은 계산을 단순하게 만들기 위해 <MathFormula>{raw`d=0`}</MathFormula>으로 두고 마찰을 무시한다. 경로 변수 <MathFormula>{raw`s`}</MathFormula>가 무차원이므로 <MathFormula>{raw`\dot s`}</MathFormula>의 단위는 1/s, <MathFormula>{raw`\ddot s`}</MathFormula>의 단위는 1/s²다.</p>
        <div className="not-prose my-5 grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:p-4">
          <MathFormula display className="my-0">{raw`\tau=2\ddot s+0.5\dot s^2+1`}</MathFormula>
          <MathFormula display className="my-0">{raw`-3\le\tau\le5,\qquad\dot s=2`}</MathFormula>
          <MathFormula display className="my-0">{raw`\tau=2\ddot s+3`}</MathFormula>
          <MathFormula display className="my-0">{raw`-3\le2\ddot s+3\le5\quad\Longrightarrow\quad-3\le\ddot s\le1`}</MathFormula>
        </div>
        <FormulaNote meaning="현재 path 위치에서 속도가 2라면 속도제곱 부담 2와 중력 부담 1이 이미 토크 3을 사용한다. 남은 토크 여유를 s̈로 나누면 최대가속 U=1, 최대감속 L=-3이 된다. 각 관절에서 같은 계산을 한 뒤 구간을 교차해야 로봇 전체가 동시에 가능한 L과 U를 얻는다." symbols={[[raw`U=1`, '현재 상태에서 허용되는 가장 큰 path acceleration'], [raw`L=-3`, '현재 상태에서 허용되는 가장 강한 path deceleration'], [raw`[-3,1]`, '이 예제의 actuator torque bound가 허용하는 s̈ 구간']]} />
        <p>하지만 실제 다관절 계산에서는 <MathFormula>{raw`a_i`}</MathFormula>가 음수일 수 있다. 음수로 나누면 부등호 방향이 바뀌므로 두 결과를 순서대로 가정하지 않고 작은 값과 큰 값으로 다시 정렬한다. <MathFormula>{raw`a_i`}</MathFormula>가 거의 0이면 작은 수로 나누어 거대한 가속도 한계를 만드는 대신, 나머지 토크만으로 현재 속도가 가능한지 검사한다.</p>
        <div className="not-prose my-5 grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:p-4">
          <MathFormula display className="my-0">{raw`\underbrace{h_i(s,\dot s)}_{\text{가속도와 무관한 토크}}=\underbrace{b_i(s)\dot s^2}_{\text{속도 제곱 부담}}+\underbrace{d_i(s)\dot s}_{\text{점성 마찰}}+\underbrace{c_i(s)}_{\text{중력·부하}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\begin{aligned}\underbrace{r_i^-}_{\text{첫 경계 후보}}&=\frac{\tau_i^{\min}-h_i}{a_i}\\[2pt]\underbrace{r_i^+}_{\text{둘째 경계 후보}}&=\frac{\tau_i^{\max}-h_i}{a_i}\\[2pt]\{\underbrace{\ell_i}_{\text{작은 값·하한}},\underbrace{u_i}_{\text{큰 값·상한}}\}&=\operatorname{sort}(r_i^-,r_i^+)\\[2pt]\underbrace{|a_i|\ge\varepsilon_a}_{\text{나눗셈 허용}}&\end{aligned}`}</MathFormula>
          <MathFormula display className="my-0">{raw`|a_i|<\varepsilon_a\quad\Longrightarrow\quad \underbrace{\tau_i^{\min}\le h_i\le\tau_i^{\max}}_{\text{속도만으로 가능 여부 판정}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\begin{aligned}\underbrace{L}_{\text{공통 하한}}&=\max_i\ell_i\\[2pt]\underbrace{U}_{\text{공통 상한}}&=\min_i u_i\\[2pt]\underbrace{L\le U}_{\text{교집합 존재}}&\Longleftrightarrow\underbrace{\text{모든 관절이 함께 실행 가능}}_{\text{공유 가속도 존재}}\end{aligned}`}</MathFormula>
        </div>
        <FormulaNote meaning="두 후보 r_i^-와 r_i^+를 정렬하면 음수 a_i에서 생기는 부등호 반전도 같은 코드로 처리할 수 있다. a_i가 거의 0인 관절은 가속 페달로 토크를 회복할 수 없으므로 h_i가 토크 범위 밖이면 즉시 실패다. 마지막으로 모든 관절 구간을 교차해 L≤U일 때만 로봇 전체가 공유할 path acceleration이 존재한다." symbols={[[raw`h_i`, '관절 i에서 현재 속도와 자세가 이미 사용하는 토크'], [raw`r_i^-,r_i^+`, '토크 하한과 상한을 a_i로 나눈 두 경계 후보'], [raw`\ell_i,u_i`, '두 후보를 정렬해 얻은 관절 i의 가속도 하한과 상한'], [raw`\varepsilon_a`, '작은 수로 나누지 않기 위한 가속도 계수 판정값'], [raw`L,U`, '모든 관절 구간을 교차한 로봇 전체 하한과 상한']]} />
        <p>Production에서는 model error와 tracking error가 쓸 토크를 남겨야 한다. 예를 들어 양쪽에 0.20 N·m 예비 토크를 둘 때는 각 관절 한계를 <MathFormula>{raw`[\tau_i^{\min}+0.20,\ \tau_i^{\max}-0.20]`}</MathFormula>로 안쪽으로 줄인 뒤 같은 계산을 반복한다. 아래 Lab의 ‘명목 한계’와 ‘0.20 N·m 예비’를 바꾸면, 명목상 가능한 상태가 강건 판정에서 거부되는 경계를 직접 볼 수 있다.</p>
        <MathFormula display>{raw`\underbrace{L(s,\dot s)}_{\text{최대 감속}}\le\ddot s\le\underbrace{U(s,\dot s)}_{\text{최대 가속}}`}</MathFormula>
        <FormulaNote meaning="각 관절의 토크 하한·상한을 경로 가속도의 구간으로 바꿔 겹치면, 현재 위치와 속도에서 가능한 가속·감속 범위가 생긴다. 고정 경로의 최소시간 문제는 이 범위를 한 번도 벗어나지 않으면서 진행 속도를 높이는 문제다." symbols={[[raw`L(s,\dot s)`, '모든 관절 lower bound 중 가장 강한 최대감속 경계'], [raw`U(s,\dot s)`, '모든 관절 upper bound 중 가장 강한 최대가속 경계'], [raw`\dot s`, '경로 위에서 현재 얼마나 빠르게 진행하는가']]} />
        <p>이제 위치 <MathFormula>{raw`s`}</MathFormula>와 속도를 함께 state로 두고 forward·backward 적분을 시작한다. 이 전환이 낯설다면 먼저 <InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식·Phase Plane의 state와 양끝 경계</InternalLink>를 읽고 돌아오면 아래 controllable set의 의미가 바로 이어진다.</p>
        <p>시간으로 적분하면 grid마다 도착 시간을 다시 찾아야 한다. 대신 <MathFormula>{raw`x=\dot s^2`}</MathFormula>를 두면 chain rule로 <MathFormula>{raw`dx/ds=2\ddot s`}</MathFormula>가 되어 경로 위치 <MathFormula>{raw`s`}</MathFormula>를 독립변수로 바로 전진·역방향 계산할 수 있다.</p>
        <div className="not-prose my-5 grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:p-4">
          <MathFormula display className="my-0">{raw`\underbrace{x_k}_{\text{grid k의 속도 제곱}}=\underbrace{\dot s_k^2}_{\text{음수가 될 수 없는 상태}},\qquad \underbrace{\frac{dx}{ds}=2\ddot s}_{\text{경로 위치로 적분}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\underbrace{\mathcal C_N}_{\text{종점에서 허용할 집합}}=\underbrace{\{0\}}_{\text{도착점 정지}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\underbrace{\mathcal R_k(x)}_{\text{한 edge 뒤 도달 구간}}=\left[\underbrace{x+2L_k\Delta s}_{\text{최대감속 뒤 값}},\underbrace{x+2U_k\Delta s}_{\text{최대가속 뒤 값}}\right]`}</MathFormula>
          <MathFormula display className="my-0">{raw`\begin{gathered}
            \underbrace{\mathcal C_k}_{\text{종점 도달 가능 집합}}
            =\underbrace{\bigcup_{r=1}^{m_k}[\underline x_{k,r},\overline x_{k,r}]}_{\text{분리된 controllable 구간}}\\[5pt]
            \underbrace{0\le\overline x_{k,r}\le(v_{k,\mathrm{first}})^2}_{\text{첫 feasible 성분의 보수 상한}}
          \end{gathered}`}</MathFormula>
          <p className="my-0 text-center text-xs font-semibold text-muted-foreground">그리고 다음 조건도 함께 만족해야 한다.</p>
          <MathFormula display className="my-0">{raw`\underbrace{\mathcal R_k(x)\cap\mathcal C_{k+1}\neq\varnothing}_{\text{다음 controllable set에 닿을 수 있음}}`}</MathFormula>
          <MathFormula display className="my-0">{raw`\begin{aligned}\underbrace{x_0=0}_{\text{출발점 정지}}&\\[2pt]\underbrace{\mathcal F_{k+1}}_{\text{이번 edge의 합법 후보}}&=\mathcal R_k(x_k)\cap\mathcal C_{k+1}\\[2pt]\underbrace{x_{k+1}}_{\text{가장 빠른 합법 상태}}&=\max\mathcal F_{k+1}\\[2pt]\underbrace{\mathcal F_{k+1}=\varnothing}_{\text{교집합 없음}}&\Longrightarrow\underbrace{\text{NO-PATH}}_{\text{0으로 덮지 않고 실패}}\end{aligned}`}</MathFormula>
        </div>
        <FormulaNote meaning="먼저 종점의 정지 상태에서 시작해, 각 현재 속도 x가 한 edge 뒤의 controllable set에 닿을 수 있는지 거꾸로 검사한다. C_k는 항상 0부터 시작하는 한 interval이 아니라 여러 interval의 합집합일 수 있다. 그다음 출발점에서는 현재 reachable interval과 다음 controllable interval들의 교집합에서 가장 큰 x를 고른다. 이 Lab의 v_first는 로컬 속도 0에서 이어진 첫 feasible 성분만 보수적으로 남기므로, 첫 infeasible gap 위에 다시 나타나는 friction-induced component를 탐색하는 Shin의 island-aware ACOT 구현은 아니다. 교집합이 비면 x=0으로 덮지 않고 NO-PATH로 거부한다." symbols={[[raw`x_k`, '격자 k에서의 경로 속도 제곱'], [raw`\Delta s`, '인접 경로 격자 사이 간격'], [raw`\mathcal R_k(x)`, '현재 x에서 [L,U]로 한 칸 뒤 도달할 수 있는 구간'], [raw`\mathcal C_k`, '분리된 여러 interval을 가질 수 있는 terminal-controllable set'], [raw`m_k`, 'Grid k에서 보존한 controllable interval의 수'], [raw`\mathcal F_{k+1}`, '도달 가능성과 종점 가능성을 동시에 만족하는 교집합'], [raw`v_{k,\mathrm{first}}`, '정지 상태와 연결된 첫 local feasible speed component의 보수적 상단']]} />
        <PhasePlaneLab />
        <p>출발점에서는 매 순간 허용되는 최고 가속도 <MathFormula>{raw`U`}</MathFormula>를 선택하면 가장 빨리 속도를 올릴 수 있다. 그러나 끝까지 가속하면 도착점에서 멈출 수 없다. 그래서 도착점에서 “가장 강하게 제동한다고 가정하면 어디부터 감속해야 하는가”를 <MathFormula>{raw`L`}</MathFormula>로 시간을 거꾸로 계산한다. 두 계산이 만나는 지점에서 가속을 감속으로 바꾸는 것은 ACOTNI의 가장 단순한 한 교차 경우다. 원문의 일반 알고리즘은 admissible boundary의 tangent·osculation과 discontinuity에서 여러 switching trajectory를 만들고, friction-induced island가 있으면 trajectory intersection graph를 가장 높은 branch부터 탐색하며 dead end에서 backtracking한다. Shin과 McKay, Bobrow 등의 고전 결과가 정식화한 것은 더 짧은 길을 찾는 방법이 아니라, <strong>이미 정한 길을 모터 한계 안에서 가장 빨리 실행하는 시간표</strong>다.</p>
        <Takeaway>Geometry가 그대로여도 payload와 torque model이 바뀌면 optimal timing은 바뀐다. 그래서 trajectory에는 limit source와 dynamics version이 provenance로 남아야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="jerk-online" marker="06" tone="teal" question="목표가 움직였을 때 매번 현재 velocity를 0으로 놓고 새 trajectory를 만들면 무슨 일이 생길까?" title="Jerk-limited online generation은 측정된 현재 p·v·a에서 다시 시작한다">
        <p>Acceleration이 step으로 바뀌면 jerk는 impulse가 되고 구조물, gearbox와 load에 vibration을 건다. Jerk는 acceleration의 시간 변화율이며, 특히 빠른 pick-and-place와 민감한 payload에서 단순 v·a limit만으로는 부족하다.</p>
        <p>앞에서 본 <strong>trapezoidal velocity profile</strong>은 일정 가속, 일정 속도, 일정 감속의 세 구간을 잇는다. 구현은 단순하지만 구간 경계에서 acceleration이 계단처럼 바뀌어 이상적인 jerk가 순간 impulse가 된다. <strong>S-curve</strong>는 그 경계 앞뒤에 유한한 jerk 구간을 넣어 acceleration을 기울어진 선으로 연결한다. Online jerk-limited solver는 이 S-curve 직관을 현재 p·v·a와 임의의 목표 상태, 여러 DoF 동기화까지 일반화한 계산기로 이해하면 된다.</p>
        <MathFormula display>{raw`\underbrace{j(t)}_{\text{jerk}}=\frac{d^3q}{dt^3},\qquad \underbrace{x_{now}}_{\text{현재 상태}}=(q,\dot q,\ddot q),\qquad \underbrace{x_{target}}_{\text{목표 상태}}=(q^*,\dot q^*,\ddot q^*)`}</MathFormula>
        <FormulaNote meaning="Online trajectory generator는 매 control tick의 current position, velocity, acceleration과 target state, v/a/j limits를 받는다. 새 target이 오면 정지 상태를 가정하지 않고 current state에서 연속인 다음 setpoint를 생성한다." symbols={[["j(t)", 'Acceleration 변화율'], ["x_{now}", '이번 tick에 실제로 이어야 할 상태'], ["x_{target}", '원하는 terminal position·velocity·acceleration']]} />
        <RetargetLab />
        <p>Ruckig 같은 solver는 arbitrary current/target p·v·a와 v·a·j constraint를 이용해 multi-DoF state-to-state trajectory를 실시간 생성하고 동기화한다. 중간 waypoint를 포함한 path problem과 단일 target retargeting은 계산 구조와 보장이 다르므로 같은 API 이름만 보고 동일시하면 안 된다.</p>
        <Misconception>Jerk limit은 tracking error를 자동으로 없애지 않는다. Generator는 feasible reference를 만들고, feedback controller는 model error와 disturbance 속에서 그 reference를 추적한다. Safety monitor는 그 둘의 실패를 별도로 감시한다.</Misconception>
      </NlpSection>

      <NlpSection id="execution-contract" marker="07" tone="blue" question="수학적으로 valid한 trajectory를 production controller에 넘기기 전 마지막으로 무엇을 확인할까?" title="Trajectory는 limits·scene·start state·clock이 함께 versioned되어야 한다">
        <ExecutionContract />
        <p>실행 전에는 timestamp가 strictly increasing인지, controller cycle에 discretize한 뒤에도 peak v·a·j를 넘지 않는지, scene과 attached geometry version이 계획 때와 같은지, measured start state가 허용 오차 안인지 확인한다. 실행 중에는 commanded/actual state, tracking error, saturation, regeneration reason과 protective stop을 같은 timeline에 기록한다.</p>
        <DynamicReleaseGate />
        <p>이 숫자 gate 전에 path derivative의 해석 미분을 finite difference와 비교하고, 모든 grid cell에서 signed bound와 zero-inertia 판정을 저장해야 한다. 그 뒤 payload·inertia·friction·delay를 worst-case 조합으로 바꿔 같은 convergence와 replay gate를 다시 통과시킨다. 어느 하나라도 실패하면 속도만 낮춰 즉시 실행하지 않고, 원인이 model·grid·start state·scene 중 어디에 있는지 reason code로 분리해 재계산한다.</p>
        <CapabilityCheck items={[
          'q(s), s(t), q(t)를 분리하고 duration 변화가 velocity에는 1/T, acceleration에는 1/T²로 작용함을 설명한다.',
          'Endpoint boundary condition 수로 cubic과 quintic 선택을 유도한다.',
          'C0 corner의 tangent jump를 진단하고 blend 후 collision revalidation이 필요한 이유를 설명한다.',
          '모든 joint의 duration lower bound를 계산해 bottleneck을 찾고 time/phase synchronization을 구분한다.',
          'Manipulator dynamics의 관성·속도제곱·점성마찰·중력 항을 fixed path의 scalar acceleration bound로 바꾸고 phase-plane switching을 해석한다.',
          '목표 변경 때 현재 p·v·a에서 jerk-limited trajectory를 재생성하고 stale scene을 실행 전에 거부한다.',
        ]} />
        <Takeaway>Motion planning이 “어디로 갈 수 있는가”를 답했다면 trajectory generation은 “그 길을 언제, 얼마나 부드럽고, actuator가 감당 가능한 상태로 지나갈 것인가”를 답한다. 다음 feedback control 단계는 이 실행 가능한 reference와 실제 robot의 오차를 닫힌 고리로 줄인다.</Takeaway>
        <SourceNotes sources={[
          { label: 'Lynch & Park, Modern Robotics Chapter 9', href: 'https://modernrobotics.northwestern.edu/chapters/chapter9/', note: 'Path와 trajectory, polynomial·trapezoidal·S-curve time scaling 및 time-optimal scaling의 공식 교재다.' },
          { label: 'Shin & McKay, Minimum-Time Control with Geometric Path Constraints (1985)', href: 'https://rtcl.eecs.umich.edu/rtclweb/assets/publications/1985/shin1985minimumtimecontrol.pdf', note: 'p.532 Eq. (1), (4b)와 p.533 Eq. (9b)에서 점성마찰 Rq̇를 유지한 채 fixed path dynamics를 scalar retiming으로 줄이는 1차 출처다.' },
          { label: 'Bobrow et al., Time-Optimal Control of Robotic Manipulators Along Specified Paths (1985)', href: 'https://journals.sagepub.com/doi/10.1177/027836498500400301', note: 'Torque limit 아래 specified path의 minimum-time motion을 독립적으로 정식화한 병렬 고전 근거다. 기본 학습 경로를 더 아래로 늘리는 필수 선행 논문은 아니다.' },
          { label: 'Pham & Pham, TOPP by Reachability Analysis (2018)', href: 'https://arxiv.org/abs/1707.07239', note: 'Grid마다 작은 LP로 reachable·controllable set을 전파해 수치 적분 계열의 구현 난점과 강건성 문제를 다루는 현대 후속 분기다.' },
          { label: 'MoveIt Time Parameterization Tutorial', href: 'https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html', note: 'Kinematic planner output에 velocity·acceleration timing과 Ruckig jerk smoothing을 붙이는 현재 pipeline을 확인한다.' },
          { label: 'Berscheid & Kroger, Jerk-limited Real-time Trajectory Generation with Arbitrary Target States (2021)', href: 'https://arxiv.org/abs/2105.04830', note: 'Arbitrary current/target p·v·a와 v·a·j limit을 다루는 Ruckig algorithm의 논문이다.' },
          { label: 'Ruckig official repository and API', href: 'https://github.com/pantor/ruckig', note: 'Multi-DoF synchronization, online update loop와 input validation contract를 구현 수준에서 확인한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
