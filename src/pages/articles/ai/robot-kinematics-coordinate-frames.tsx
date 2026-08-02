import { useId, useMemo, useState } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl, Takeaway } from './nlp-shared';

const RAD = Math.PI / 180;
const L1 = 0.7;
const L2 = 0.5;

function endpoint(q1: number, q2: number) {
  return {
    x: L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2),
    y: L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2),
  };
}

function jacobian(q1: number, q2: number) {
  return [
    [-L1 * Math.sin(q1) - L2 * Math.sin(q1 + q2), -L2 * Math.sin(q1 + q2)],
    [L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2), L2 * Math.cos(q1 + q2)],
  ];
}

function singularValues(j: number[][]) {
  const a = j[0][0] ** 2 + j[0][1] ** 2;
  const b = j[0][0] * j[1][0] + j[0][1] * j[1][1];
  const d = j[1][0] ** 2 + j[1][1] ** 2;
  const trace = a + d;
  const root = Math.sqrt(Math.max(0, (a - d) ** 2 + 4 * b * b));
  return [
    Math.sqrt(Math.max(0, (trace + root) / 2)),
    Math.sqrt(Math.max(0, (trace - root) / 2)),
  ];
}

function dampedSolve(j: number[][], v: number[], lambda: number) {
  const a = j[0][0] ** 2 + j[0][1] ** 2 + lambda * lambda;
  const b = j[0][0] * j[1][0] + j[0][1] * j[1][1];
  const d = j[1][0] ** 2 + j[1][1] ** 2 + lambda * lambda;
  const det = a * d - b * b;
  const z0 = (d * v[0] - b * v[1]) / Math.max(1e-9, det);
  const z1 = (-b * v[0] + a * v[1]) / Math.max(1e-9, det);
  return [j[0][0] * z0 + j[1][0] * z1, j[0][1] * z0 + j[1][1] * z1];
}

function exactSolve(j: number[][], v: number[]) {
  const det = j[0][0] * j[1][1] - j[0][1] * j[1][0];
  if (Math.abs(det) < 1e-5) return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  return [
    (j[1][1] * v[0] - j[0][1] * v[1]) / det,
    (-j[1][0] * v[0] + j[0][0] * v[1]) / det,
  ];
}

function transformPoint(angle: number, tx: number, ty: number, x: number, y: number) {
  return {
    x: Math.cos(angle) * x - Math.sin(angle) * y + tx,
    y: Math.sin(angle) * x + Math.cos(angle) * y + ty,
  };
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 Z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function FrameTransformLab() {
  const arrowId = useId().replaceAll(':', '');
  const [angleDeg, setAngleDeg] = useState(28);
  const [tx, setTx] = useState(0.78);
  const [pointX, setPointX] = useState(0.46);
  const angle = angleDeg * RAD;
  const ty = 0.34;
  const point = transformPoint(angle, tx, ty, pointX, 0.18);
  const origin = { x: 110, y: 225 };
  const scale = 180;
  const px = (x: number) => origin.x + x * scale;
  const py = (y: number) => origin.y - y * scale;
  const camera = { x: px(tx), y: py(ty) };
  const xAxis = transformPoint(angle, tx, ty, 0.36, 0);
  const yAxis = transformPoint(angle, tx, ty, 0, 0.36);

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">FRAME TRANSFORM LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">같은 fruit point를 camera와 base의 두 숫자로 비교한다</strong>
        <span className="basis-full font-mono text-xs font-bold sm:basis-auto">p_base [{point.x.toFixed(2)}, {point.y.toFixed(2)}] m</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-blue-500/[0.025] p-4 sm:grid-cols-3">
        <label className="text-xs font-semibold text-muted-foreground">Camera yaw · {angleDeg} deg<input className="mt-3 block w-full accent-blue-700" type="range" min="-50" max="70" step="1" value={angleDeg} onChange={(event) => setAngleDeg(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Base translation x · {tx.toFixed(2)} m<input className="mt-3 block w-full accent-blue-700" type="range" min="0.25" max="1.1" step="0.01" value={tx} onChange={(event) => setTx(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Point in camera x · {pointX.toFixed(2)} m<input className="mt-3 block w-full accent-blue-700" type="range" min="0.1" max="0.75" step="0.01" value={pointX} onChange={(event) => setPointX(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <svg viewBox="0 0 480 280" className="block h-auto w-full" role="img" aria-label="Base와 camera coordinate frame에서 같은 point의 좌표 변환">
          <ArrowDefs id={arrowId} />
          {[0, 1, 2].map((value) => <line key={'vx' + value} x1={px(value * 0.5)} x2={px(value * 0.5)} y1="30" y2="245" stroke="currentColor" opacity="0.07" />)}
          {[0, 1, 2].map((value) => <line key={'hy' + value} x1="48" x2="456" y1={py(value * 0.35)} y2={py(value * 0.35)} stroke="currentColor" opacity="0.07" />)}
          <line x1={origin.x} y1={origin.y} x2={px(0.55)} y2={origin.y} stroke="#2563eb" strokeWidth="2" markerEnd={'url(#' + arrowId + ')'} />
          <line x1={origin.x} y1={origin.y} x2={origin.x} y2={py(0.48)} stroke="#2563eb" strokeWidth="2" markerEnd={'url(#' + arrowId + ')'} />
          <text x={origin.x - 10} y={origin.y + 22} fontSize="13" fontWeight="700" fill="#1d4ed8">base</text>
          <line x1={camera.x} y1={camera.y} x2={px(xAxis.x)} y2={py(xAxis.y)} stroke="#7c3aed" strokeWidth="2.5" markerEnd={'url(#' + arrowId + ')'} />
          <line x1={camera.x} y1={camera.y} x2={px(yAxis.x)} y2={py(yAxis.y)} stroke="#7c3aed" strokeWidth="2.5" markerEnd={'url(#' + arrowId + ')'} />
          <circle cx={camera.x} cy={camera.y} r="5" fill="#7c3aed" />
          <text x={camera.x + 8} y={camera.y + 20} fontSize="13" fontWeight="700" fill="#6d28d9">camera</text>
          <line x1={camera.x} y1={camera.y} x2={px(point.x)} y2={py(point.y)} stroke="#7c3aed" strokeDasharray="5 5" opacity="0.65" />
          <circle cx={px(point.x)} cy={py(point.y)} r="7" fill="#059669" stroke="white" strokeWidth="2" />
          <text x={Math.min(410, px(point.x) + 10)} y={py(point.y) - 10} fontSize="13" fontWeight="700" fill="#047857">fruit</text>
        </svg>
        <dl className="grid content-start gap-px self-start overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Camera coordinates</dt><dd className="mt-1 font-mono text-base font-black">[{pointX.toFixed(2)}, 0.18]</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Rotation first</dt><dd className="mt-1 font-mono text-base font-black">R({angleDeg} deg) p</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Then translate</dt><dd className="mt-1 font-mono text-base font-black text-blue-700 dark:text-blue-300">+ [{tx.toFixed(2)}, {ty.toFixed(2)}]</dd></div>
        </dl>
      </div>
    </figure>
  );
}

type TransformStep = 'camera' | 'wrist' | 'base' | 'time';

function TransformChainViz() {
  const [step, setStep] = useState<TransformStep>('camera');
  const details: Record<TransformStep, { title: string; input: string; operation: string; result: string; check: string }> = {
    camera: { title: 'Sensor가 camera frame의 point를 낸다', input: 'p_camera @ 12:00:00.120', operation: 'depth + calibration units', result: '[0.46, 0.18, 0.72] m', check: 'Optical axis convention과 meter 단위를 확인한다.' },
    wrist: { title: '고정 extrinsic으로 wrist frame에 옮긴다', input: 'T_wrist,camera · p_camera', operation: 'rotate then translate', result: 'p_wrist', check: 'Calibration version과 transform direction을 기록한다.' },
    base: { title: 'Joint state에 맞는 moving transform을 합성한다', input: 'T_base,wrist(q_t) · p_wrist', operation: 'FK at matching time', result: 'p_base', check: 'Joint state timestamp가 camera measurement와 맞아야 한다.' },
    time: { title: '80 ms 늦으면 올바른 행렬도 현재 point가 아니다', input: 'q(t) with image(t-80 ms)', operation: 'interpolate or reject stale data', result: 'age-aware target', check: 'Transform age와 extrapolation failure를 solver 앞에서 차단한다.' },
  };
  const item = details[step];
  return (
    <div className="foundation-viz-explorer not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="Transform chain step" options={[
        { value: 'camera', label: '1. Camera' },
        { value: 'wrist', label: '2. Wrist' },
        { value: 'base', label: '3. Base' },
        { value: 'time', label: '4. Time gate' },
      ]} value={step} onChange={setStep} />
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4 sm:col-span-2"><p className="text-xs font-bold text-muted-foreground">현재 단계</p><p className="mt-2 text-base font-bold">{item.title}</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">입력</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.input}</p></div>
        <div className="bg-blue-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">연산</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.operation}</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">출력</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.result}</p></div>
        <div className="bg-amber-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">통과 조건</p><p className="mt-2 text-sm leading-relaxed">{item.check}</p></div>
      </div>
    </div>
  );
}

function ArmSvg({ q1, q2, target, desired, achieved }: { q1: number; q2: number; target?: { x: number; y: number }; desired?: number[]; achieved?: number[] }) {
  const arrowId = useId().replaceAll(':', '');
  const base = { x: 105, y: 235 };
  const scale = 185;
  const elbow = { x: L1 * Math.cos(q1), y: L1 * Math.sin(q1) };
  const tip = endpoint(q1, q2);
  const sx = (x: number) => base.x + x * scale;
  const sy = (y: number) => base.y - y * scale;
  return (
    <svg viewBox="0 0 480 290" className="block h-auto w-full" role="img" aria-label="두 관절 robot arm의 자세와 end effector 위치">
      <ArrowDefs id={arrowId} />
      <path d={'M' + sx(-0.2) + ',' + sy(0) + ' A' + (L1 + L2) * scale + ',' + (L1 + L2) * scale + ' 0 0 0 ' + sx(L1 + L2) + ',' + sy(0)} fill="none" stroke="currentColor" opacity="0.08" strokeDasharray="5 6" />
      <line x1={base.x} y1={base.y} x2={sx(elbow.x)} y2={sy(elbow.y)} stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
      <line x1={sx(elbow.x)} y1={sy(elbow.y)} x2={sx(tip.x)} y2={sy(tip.y)} stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" />
      <circle cx={base.x} cy={base.y} r="10" fill="#1d4ed8" stroke="white" strokeWidth="3" />
      <circle cx={sx(elbow.x)} cy={sy(elbow.y)} r="9" fill="#6d28d9" stroke="white" strokeWidth="3" />
      <circle cx={sx(tip.x)} cy={sy(tip.y)} r="7" fill="#059669" stroke="white" strokeWidth="2" />
      {target && <g><circle cx={sx(target.x)} cy={sy(target.y)} r="9" fill="none" stroke="#dc2626" strokeWidth="2" /><line x1={sx(target.x) - 12} x2={sx(target.x) + 12} y1={sy(target.y)} y2={sy(target.y)} stroke="#dc2626" opacity="0.55" /><line x1={sx(target.x)} x2={sx(target.x)} y1={sy(target.y) - 12} y2={sy(target.y) + 12} stroke="#dc2626" opacity="0.55" /></g>}
      {desired && <line x1={sx(tip.x)} y1={sy(tip.y)} x2={sx(tip.x) + desired[0] * 650} y2={sy(tip.y) - desired[1] * 650} stroke="#dc2626" strokeWidth="3" markerEnd={'url(#' + arrowId + ')'} />}
      {achieved && <line x1={sx(tip.x)} y1={sy(tip.y)} x2={sx(tip.x) + achieved[0] * 650} y2={sy(tip.y) - achieved[1] * 650} stroke="#059669" strokeWidth="3" strokeDasharray="5 4" markerEnd={'url(#' + arrowId + ')'} />}
      <text x="26" y="268" fontSize="13" fill="currentColor" opacity="0.55">base frame · meters</text>
      <text x={Math.min(420, sx(tip.x) + 10)} y={Math.max(22, sy(tip.y) - 10)} fontSize="13" fontWeight="700" fill="#047857">tool</text>
    </svg>
  );
}

function ForwardKinematicsLab() {
  const [q1Deg, setQ1Deg] = useState(28);
  const [q2Deg, setQ2Deg] = useState(-62);
  const q1 = q1Deg * RAD;
  const q2 = q2Deg * RAD;
  const tip = endpoint(q1, q2);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">2R FORWARD KINEMATICS LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">Joint configuration 하나는 tool position 하나를 결정한다</strong>
        <span className="basis-full font-mono text-xs font-bold sm:basis-auto">[{tip.x.toFixed(3)}, {tip.y.toFixed(3)}] m</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-violet-500/[0.025] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Shoulder q1 · {q1Deg} deg<input className="mt-3 block w-full accent-violet-700" type="range" min="-150" max="150" step="1" value={q1Deg} onChange={(event) => setQ1Deg(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Elbow q2 · {q2Deg} deg<input className="mt-3 block w-full accent-violet-700" type="range" min="-145" max="145" step="1" value={q2Deg} onChange={(event) => setQ2Deg(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <ArmSvg q1={q1} q2={q2} />
        <dl className="grid content-start gap-px self-start overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Link lengths</dt><dd className="mt-1 font-mono text-base font-black">0.70 + 0.50 m</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Endpoint radius</dt><dd className="mt-1 font-mono text-base font-black">{Math.hypot(tip.x, tip.y).toFixed(3)} m</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Mapping</dt><dd className="mt-1 font-mono text-base font-black text-violet-700 dark:text-violet-300">q to T(q)</dd></div>
        </dl>
      </div>
    </figure>
  );
}

type Seed = 'elbow-up' | 'elbow-down';

function InverseKinematicsLab() {
  const [target, setTarget] = useState({ x: 0.76, y: 0.52 });
  const [seed, setSeed] = useState<Seed>('elbow-down');
  const initial = (nextSeed: Seed) => nextSeed === 'elbow-down' ? [25 * RAD, -95 * RAD] : [25 * RAD, 95 * RAD];
  const [q, setQ] = useState<number[]>(initial(seed));
  const [iterations, setIterations] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const tip = endpoint(q[0], q[1]);
  const residual = Math.hypot(target.x - tip.x, target.y - tip.y);
  const radius = Math.hypot(target.x, target.y);
  const reachable = radius <= L1 + L2 && radius >= Math.abs(L1 - L2);
  const reset = (nextSeed = seed) => { setQ(initial(nextSeed)); setIterations(0); setLimitHit(false); };
  const updateTarget = (axis: 'x' | 'y', value: number) => {
    setTarget((current) => ({ ...current, [axis]: value }));
    setIterations(0);
    setLimitHit(false);
    setQ(initial(seed));
  };
  const step = () => {
    if (!reachable || residual < 0.002 || iterations >= 40) return;
    const j = jacobian(q[0], q[1]);
    const delta = dampedSolve(j, [target.x - tip.x, target.y - tip.y], 0.08);
    const proposed = [q[0] + 0.72 * delta[0], q[1] + 0.72 * delta[1]];
    const limits = [[-170 * RAD, 170 * RAD], [-145 * RAD, 145 * RAD]];
    const clipped = proposed.map((value, index) => Math.max(limits[index][0], Math.min(limits[index][1], value)));
    setLimitHit(proposed.some((value, index) => value !== clipped[index]));
    setQ(clipped);
    setIterations((value) => value + 1);
  };
  const chooseSeed = (nextSeed: Seed) => { setSeed(nextSeed); reset(nextSeed); };
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">NUMERICAL IK LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">같은 target도 seed와 constraints에 따라 다른 joint solution에 도달한다</strong>
        <span className="basis-full font-mono text-xs font-bold sm:basis-auto">residual {residual.toFixed(4)} m</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-emerald-500/[0.025] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl label="IK seed branch" options={[{ value: 'elbow-down', label: 'Elbow down' }, { value: 'elbow-up', label: 'Elbow up' }]} value={seed} onChange={chooseSeed} />
          <div className="flex gap-2">
            <button type="button" onClick={() => reset()} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Reset</button>
            <button type="button" onClick={step} disabled={!reachable || residual < 0.002 || iterations >= 40} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><StepForward className="h-3.5 w-3.5" aria-hidden="true" />한 step</button>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-semibold text-muted-foreground">Target x · {target.x.toFixed(2)} m<input className="mt-3 block w-full accent-emerald-700" type="range" min="0.22" max="1.15" step="0.01" value={target.x} onChange={(event) => updateTarget('x', Number(event.target.value))} /></label>
          <label className="text-xs font-semibold text-muted-foreground">Target y · {target.y.toFixed(2)} m<input className="mt-3 block w-full accent-emerald-700" type="range" min="-0.35" max="0.95" step="0.01" value={target.y} onChange={(event) => updateTarget('y', Number(event.target.value))} /></label>
        </div>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <ArmSvg q1={q[0]} q2={q[1]} target={target} />
        <dl className="grid content-start gap-px self-start overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Workspace test</dt><dd className={'mt-1 text-base font-black ' + (reachable ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>{reachable ? 'reachable' : 'unreachable'}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Iterations</dt><dd className="mt-1 font-mono text-base font-black">{iterations} / 40</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Joint angles</dt><dd className="mt-1 font-mono text-sm font-black">[{(q[0] / RAD).toFixed(1)}, {(q[1] / RAD).toFixed(1)}] deg</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Limit status</dt><dd className="mt-1 text-sm font-black">{limitHit ? 'clipped' : 'inside limits'}</dd></div>
        </dl>
      </div>
    </figure>
  );
}

type VelocityDirection = 'horizontal' | 'vertical';

function JacobianDlsLab() {
  const [q1Deg, setQ1Deg] = useState(24);
  const [q2Deg, setQ2Deg] = useState(16);
  const [lambda, setLambda] = useState(0.1);
  const [direction, setDirection] = useState<VelocityDirection>('horizontal');
  const q1 = q1Deg * RAD;
  const q2 = q2Deg * RAD;
  const j = useMemo(() => jacobian(q1, q2), [q1, q2]);
  const desired = direction === 'horizontal' ? [0.12, 0] : [0, 0.12];
  const exact = exactSolve(j, desired);
  const dls = dampedSolve(j, desired, lambda);
  const achieved = [
    j[0][0] * dls[0] + j[0][1] * dls[1],
    j[1][0] * dls[0] + j[1][1] * dls[1],
  ];
  const sigma = singularValues(j);
  const condition = sigma[1] > 1e-6 ? sigma[0] / sigma[1] : Number.POSITIVE_INFINITY;
  const exactNorm = Math.hypot(...exact);
  const dlsNorm = Math.hypot(...dls);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">JACOBIAN & DLS LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">Elbow가 펴질수록 작은 singular direction의 joint rate가 폭증한다</strong>
        <span className="basis-full font-mono text-xs font-bold sm:basis-auto">condition {Number.isFinite(condition) ? condition.toFixed(1) : 'infinite'}</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-amber-500/[0.025] p-4">
        <SegmentedControl label="Desired task velocity" options={[{ value: 'horizontal', label: 'Horizontal vx' }, { value: 'vertical', label: 'Vertical vy' }]} value={direction} onChange={setDirection} />
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="text-xs font-semibold text-muted-foreground">Shoulder q1 · {q1Deg} deg<input className="mt-3 block w-full accent-amber-700" type="range" min="-20" max="80" step="1" value={q1Deg} onChange={(event) => setQ1Deg(Number(event.target.value))} /></label>
          <label className="text-xs font-semibold text-muted-foreground">Elbow q2 · {q2Deg.toFixed(1)} deg<input className="mt-3 block w-full accent-amber-700" type="range" min="0.5" max="110" step="0.5" value={q2Deg} onChange={(event) => setQ2Deg(Number(event.target.value))} /></label>
          <label className="text-xs font-semibold text-muted-foreground">Damping lambda · {lambda.toFixed(2)}<input className="mt-3 block w-full accent-amber-700" type="range" min="0.01" max="0.35" step="0.01" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} /></label>
        </div>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <ArmSvg q1={q1} q2={q2} desired={desired} achieved={achieved} />
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span><i className="mr-1 inline-block h-0.5 w-5 bg-red-600 align-middle" />desired task velocity</span>
            <span><i className="mr-1 inline-block h-0.5 w-5 border-t-2 border-dashed border-emerald-600 align-middle" />DLS achieved velocity</span>
          </div>
        </div>
        <dl className="grid content-start gap-px self-start overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Singular values</dt><dd className="mt-1 font-mono text-base font-black">{sigma[0].toFixed(3)} / {sigma[1].toFixed(3)}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Exact inverse |qdot|</dt><dd className="mt-1 font-mono text-base font-black">{Number.isFinite(exactNorm) ? exactNorm.toFixed(2) : 'infinite'} rad/s</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">DLS |qdot|</dt><dd className="mt-1 font-mono text-base font-black text-amber-700 dark:text-amber-300">{dlsNorm.toFixed(2)} rad/s</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">Task residual</dt><dd className="mt-1 font-mono text-base font-black">{Math.hypot(desired[0] - achieved[0], desired[1] - achieved[1]).toFixed(4)} m/s</dd></div>
        </dl>
      </div>
    </figure>
  );
}

export default function RobotKinematicsCoordinateFramesArticle() {
  return (
    <>
      <BeginnerOpening
        title="같은 점도 기준이 바뀌면 숫자가 달라진다"
        description="카메라가 말한 물체 위치와 로봇 몸체가 사용하는 위치는 원점과 축 방향이 다릅니다. 먼저 같은 물리점을 로봇 기준 좌표로 옮기고, 그 점에 손이 닿도록 여러 관절의 각도를 풀어야 합니다."
        familiarScene={<>“문에서 오른쪽으로 2m”와 “내 책상에서 오른쪽으로 2m”는 숫자는 같아도 다른 장소를 가리킵니다. 더구나 두 사람이 서로 다른 방향을 보고 있다면 ‘오른쪽’의 방향도 달라집니다. 좌표는 항상 <strong>어디를 원점으로 어느 방향을 보았는지</strong>와 함께 읽어야 합니다.</>}
        steps={[
          { label: '기준을 이름 붙인다', detail: '카메라, 로봇 몸체, 각 관절과 손끝의 원점·축·시각·단위를 고정합니다.' },
          { label: '같은 점을 옮겨 적는다', detail: '회전과 이동을 올바른 순서로 합쳐 카메라의 점을 로봇 기준 숫자로 바꿉니다.' },
          { label: '관절 움직임으로 푼다', detail: '손끝 목표를 만들 수 있는 관절 각도와 속도를 찾고, 닿지 않거나 위험한 자세를 걸러냅니다.' },
        ]}
      />
      <NlpSection id="frame-contract" marker="01" tone="teal" question="Camera가 준 (x,y,z)와 robot base의 (x,y,z)는 왜 같은 숫자 공간이 아닐까?" title="좌표는 물리점이 아니라 frame과 time을 붙인 표현이다">
        <QuestionLead question="카메라가 fruit를 (0.46, 0.18, 0.72)로 찾았다면 robot arm은 그 위치로 바로 움직여도 될까?" answer="안 된다. 그 숫자는 camera optical frame에서 측정한 meter 좌표다. Base와 camera의 원점·축 방향이 다르고 robot이 움직였다면 transform도 시간에 따라 달라진다. 먼저 source frame, target frame, timestamp와 unit을 고정해야 같은 물리점을 말할 수 있다." />
        <ConceptPrimer items={[
          { term: 'Physical point', meaning: '공간에 실제로 존재하는 fruit center다.', why: '표현 숫자가 바뀌어도 같은 대상이라는 기준점이다.' },
          { term: 'Coordinate frame', meaning: '원점과 서로 직교하는 축 방향을 정한 측정 기준이다.', why: '숫자의 각 성분이 어느 방향의 길이인지 결정한다.' },
          { term: 'Pose', meaning: '한 frame의 위치 translation과 방향 rotation을 함께 나타낸다.', why: 'Point뿐 아니라 gripper가 어느 방향을 보는지도 필요하다.' },
          { term: 'Timestamp', meaning: '그 pose와 observation이 유효한 물리 시간이다.', why: '움직이는 robot에서 오래된 transform은 다른 공간 상태를 가리킨다.' },
        ]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'R^\\top R=I,\\qquad \\det(R)=+1'}</MathFormula></div>
        <FormulaNote meaning="Rotation matrix의 column은 target frame에서 본 source frame의 단위 축이다. R transpose R가 identity라는 조건은 축의 길이가 1이고 서로 직교함을, determinant +1은 reflection이 아닌 right-handed rotation임을 검사한다." symbols={[['R', 'Source frame의 축을 target frame 좌표로 모은 3x3 rotation matrix'], ['R^\\top R', 'Column 축끼리 모든 dot product를 계산한 Gram matrix'], ['\\det(R)', 'Orientation과 volume 방향을 보존하는지 나타내는 scalar']]} />
        <FrameTransformLab />
        <Misconception>좌표에 frame 이름만 붙이면 충분하지 않다. Millimeter를 meter로 오해하거나 optical z-forward convention을 base x-forward convention으로 복사해도 수학은 실행되지만 robot은 잘못 움직인다.</Misconception>
      </NlpSection>

      <NlpSection id="rigid-transform" marker="02" tone="blue" question="Rotation과 translation을 어떤 순서로 합성해야 point와 pose를 같은 방식으로 옮길까?" title="Homogeneous transform은 frame 관계와 합성 순서를 한 행렬에 담는다">
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'p_a=R_{ab}p_b+t_{ab}'}</MathFormula></div>
          <div className="rounded-md border border-blue-500/30 bg-blue-500/[0.03] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'T_{ab}=\\begin{bmatrix}R_{ab}&t_{ab}\\\\0&1\\end{bmatrix},\\qquad \\bar p_a=T_{ab}\\bar p_b'}</MathFormula></div>
        </div>
        <FormulaNote meaning="p_b를 먼저 R_ab로 회전해 a frame의 축 성분으로 바꾼 뒤, b frame 원점이 a에서 떨어진 translation t_ab를 더한다. Homogeneous coordinate의 마지막 1은 translation을 matrix multiplication 안에 포함시킨다." symbols={[['p_b', 'Frame b에서 표현한 3x1 point'], ['R_{ab}', 'b축 좌표를 a축 좌표로 바꾸는 rotation'], ['t_{ab}', 'a에서 표현한 b origin의 위치'], ['\\bar p', '마지막 성분 1을 붙인 4x1 homogeneous point']]} />
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'T_{ac}=T_{ab}T_{bc}'}</MathFormula></div>
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'T_{ab}^{-1}=\\begin{bmatrix}R_{ab}^{\\top}&-R_{ab}^{\\top}t_{ab}\\\\0&1\\end{bmatrix}'}</MathFormula></div>
        </div>
        <FormulaNote meaning="오른쪽의 T_bc가 point를 c에서 b로 먼저 옮기고, 왼쪽 T_ab가 b에서 a로 옮긴다. Inverse에서는 rotation만 transpose하는 것으로 끝나지 않고, translation도 새 축으로 회전시킨 뒤 부호를 바꿔야 한다." symbols={[['T_{ac}', 'c frame에서 a frame으로 바로 가는 composed transform'], ['T_{ab}T_{bc}', '중간 frame b가 맞물리는 ordered product'], ['T_{ab}^{-1}', 'a 좌표를 b 좌표로 되돌리는 transform']]} />
        <TransformChainViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>ROS 2 tf2는 frame 관계를 tree로 유지하고 시간별 transform을 buffer한다. 요청한 sensor timestamp에 맞는 transform이 없으면 최신 transform을 억지로 쓰는 대신 extrapolation failure나 stale age를 드러내야 한다. tf2는 올바른 관계를 조회하는 도구이지 extrinsic calibration과 clock synchronization의 정확성을 보장하는 장치가 아니다.</p></div>
      </NlpSection>

      <NlpSection id="forward-kinematics" marker="03" tone="violet" question="Joint angle들을 알 때 gripper pose를 어떻게 한 방향으로 확정할까?" title="Forward kinematics는 joint configuration을 end-effector pose로 합성한다">
        <ForwardKinematicsLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'\\begin{aligned}x&=l_1\\cos q_1+l_2\\cos(q_1+q_2)\\\\y&=l_1\\sin q_1+l_2\\sin(q_1+q_2)\\end{aligned}'}</MathFormula></div>
        <FormulaNote meaning="첫 link vector를 q1만큼 회전하고, 둘째 link vector를 누적 각도 q1+q2만큼 회전해 더한다. q2를 world angle로 오해하면 둘째 관절의 relative rotation을 잃는다." symbols={[['l_1,l_2', '각 link의 meter 길이'], ['q_1', 'Base 기준 첫 link의 joint angle'], ['q_2', '첫 link 기준 둘째 link의 relative joint angle'], ['(x,y)', 'Base frame에서 본 tool point']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.03] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'T(q)=e^{[S_1]q_1}e^{[S_2]q_2}\\cdots e^{[S_n]q_n}M'}</MathFormula></div>
        <FormulaNote meaning="Product of exponentials는 zero pose M에서 각 joint screw motion을 차례로 적용한다. 각 exponential은 한 joint axis 주위의 rigid motion이며, 곱의 순서를 바꾸면 일반적으로 다른 pose가 된다." symbols={[['S_i', 'Base frame에서 표현한 joint i의 screw axis'], ['q_i', 'Joint i의 rotation 또는 translation amount'], ['M', '모든 joint가 zero일 때의 tool pose'], ['T(q)', '현재 joint configuration의 SE(3) tool pose']]} />
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-4"><p className="text-sm font-bold">D-H convention</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">각 link에 특별한 규칙으로 frame을 붙여 alpha, a, d, theta 네 값으로 adjacent transform을 쓴다. 표가 작지만 frame assignment와 convention 차이에 민감하다.</p></div>
          <div className="bg-background p-4"><p className="text-sm font-bold">Product of exponentials</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Base와 tool frame, zero pose, physical screw axes로 쓴다. Parameter 수는 더 많지만 arbitrary base/tool frame과 calibration에 더 직접적이다.</p></div>
        </div>
      </NlpSection>

      <NlpSection id="inverse-kinematics" marker="04" tone="green" question="원하는 tool pose가 있을 때 왜 joint solution이 하나가 아니거나 아예 없을 수 있을까?" title="Inverse kinematics는 역함수가 아니라 reachable set 안의 해 집합을 찾는 문제다">
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'|l_1-l_2|\\le\\sqrt{x_d^2+y_d^2}\\le l_1+l_2'}</MathFormula></div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.03] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'\\cos q_2=\\frac{x_d^2+y_d^2-l_1^2-l_2^2}{2l_1l_2}'}</MathFormula></div>
        </div>
        <FormulaNote meaning="첫 식은 2R arm이 도달 가능한 annulus를 먼저 검사한다. 둘째 식에서 같은 cosine은 보통 +q2와 -q2 두 angle을 만들므로 elbow-up과 elbow-down 해가 생긴다. Reachability는 joint limit과 collision feasibility를 포함하지 않는다." symbols={[[ '(x_d,y_d)', 'Base frame의 desired tool point'], ['l_1+l_2', '완전히 폈을 때 최대 reach'], ['|l_1-l_2|', '한 link가 다른 link를 접었을 때 최소 radius'], ['q_2', '두 analytic branch를 만드는 elbow angle']]} />
        <InverseKinematicsLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'q_{k+1}=q_k+\\alpha J(q_k)^{\\dagger}e_k'}</MathFormula></div>
        <FormulaNote meaning="Numerical IK는 current seed q_k에서 forward kinematics error e_k를 계산하고 Jacobian pseudoinverse가 제안한 local joint correction만큼 이동한다. Alpha, damping, tolerance와 seed가 convergence branch와 안정성을 바꾼다." symbols={[[ 'q_k', 'Iteration k의 joint seed'], ['e_k', 'Desired pose와 current FK pose의 local error'], ['J^\\dagger', 'Task error를 least-squares joint correction으로 바꾸는 pseudoinverse'], ['\\alpha', '한 iteration에서 적용하는 step size']]} />
        <Misconception>IK solver가 residual 0에 수렴했다고 safe motion이 생긴 것은 아니다. Start와 goal 사이가 obstacle을 통과할 수 있고 joint velocity·acceleration limit을 위반할 수 있다. IK는 pose feasibility의 한 층이며 path와 timing은 다음 motion-planning 층의 책임이다.</Misconception>
      </NlpSection>

      <NlpSection id="jacobian" marker="05" tone="blue" question="Joint가 조금 움직일 때 tool의 순간 속도는 어떤 방향으로 얼마나 움직일까?" title="Jacobian의 각 column은 joint 하나가 만드는 task-space velocity다">
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'\\dot x=J(q)\\dot q,\\qquad J_{ij}=\\frac{\\partial x_i}{\\partial q_j}'}</MathFormula></div>
        <FormulaNote meaning="Forward kinematics를 joint coordinate로 미분하면 local linear map J가 된다. Column j는 다른 joint를 멈춘 채 joint j만 unit speed로 움직였을 때 tool이 만드는 velocity다. Position row는 m/rad, orientation row는 rad/rad처럼 unit도 다를 수 있다." symbols={[[ '\\dot q', 'n개 joint의 angular 또는 linear velocity vector'], ['\\dot x', '선택한 task coordinates 또는 twist의 velocity'], ['J(q)', 'Current configuration에 따라 바뀌는 m by n local map'], ['J_{ij}', 'Joint j가 task coordinate i에 미치는 local derivative']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/30 bg-blue-500/[0.03] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'J=U\\Sigma V^\\top'}</MathFormula></div>
        <FormulaNote meaning="SVD는 joint-velocity direction V를 task-velocity direction U로 회전시키고 각 direction을 singular value만큼 늘린다고 해석한다. 작은 sigma는 그 task direction으로 움직일 authority가 약하다는 뜻이다." symbols={[[ 'V', 'Joint velocity space의 orthonormal directions'], ['\\Sigma', '각 direction의 velocity gain인 singular values'], ['U', 'Task space에서 대응하는 output directions'], ['\\sigma_{\\min}', '0에 가까우면 rank loss에 접근하는 가장 약한 direction']]} />
        <JacobianDlsLab />
      </NlpSection>

      <NlpSection id="singularity-dls" marker="06" tone="amber" question="Pseudoinverse가 least squares 해라면 왜 near-singularity에서 그대로 쓰면 위험할까?" title="Damped least squares는 task 정확도 일부를 관절 속도 bound와 교환한다">
        <div className="not-prose my-6 grid min-w-0 gap-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'\\dot q^{\\dagger}=J^{\\dagger}v_d'}</MathFormula></div>
          <div className="rounded-md border border-amber-500/30 bg-amber-500/[0.03] p-3"><MathFormula display className="my-0 text-xs sm:text-base">{'\\dot q_{DLS}=J^\\top(JJ^\\top+\\lambda^2I)^{-1}v_d'}</MathFormula></div>
        </div>
        <FormulaNote meaning="Pseudoinverse는 attainable velocity면 exact solution을, redundant system이면 minimum-norm least-squares solution을 고른다. 하지만 작은 singular value를 inverse하면 joint rate가 크게 증폭된다. DLS는 lambda squared를 더해 작은 direction의 inverse gain을 제한하며 task residual을 허용한다." symbols={[[ 'v_d', 'Desired task-space velocity'], ['J^\\dagger', 'Moore-Penrose pseudoinverse'], ['\\lambda', 'Task accuracy와 joint-rate magnitude의 trade-off를 정하는 damping'], ['JJ^\\top+\\lambda^2I', 'Task directions의 작은 eigenvalue를 바닥에서 들어 올린 regularized matrix']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Straight 2R arm에서는 두 Jacobian column이 같은 방향으로 정렬된다. Tool을 arm 축 방향으로 즉시 움직이는 independent joint combination이 사라진다. 이는 floating-point inverse만의 문제가 아니라 mechanism이 그 configuration에서 실제 motion direction을 잃은 것이다.</p><p>DLS도 joint limit, collision, acceleration, self-collision을 직접 처리하지 않는다. Production에서는 weighted DLS, null-space posture objective, velocity bounds 또는 constrained quadratic program을 사용하고, solver 결과를 low-level controller가 추적할 수 있는 trajectory로 시간화한다.</p></div>
      </NlpSection>

      <NlpSection id="production-handoff" marker="07" tone="teal" question="수학적으로 맞는 target joint angle을 실제 robot에 보내기 전에 무엇을 더 검증해야 할까?" title="Pose solve, collision-free path, timed trajectory와 feedback tracking을 분리한다">
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Pose contract', 'target frame·timestamp·unit·orientation convention, transform age'],
            ['IK evidence', 'seed, branch, residual, iteration, joint-limit margin, sigma_min, damping'],
            ['Planning evidence', 'collision model version, clearance, path validity, velocity·acceleration limit'],
            ['Execution evidence', 'commanded/applied joint target, tracking error, saturation, controller deadline'],
          ].map(([label, value]) => <div key={label} className="bg-background p-4"><p className="text-sm font-bold">{label}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p></div>)}
        </div>
        <Takeaway>Perception은 target을 frame과 time에 묶고, kinematics는 pose와 local velocity를 joint coordinates에 연결한다. 다음 motion-planning 단계는 이 pose들 사이에 collision-free path가 존재하는지 찾고, trajectory generation은 그 path에 실행 가능한 시간을 붙인다. 마지막 feedback controller가 model error와 disturbance를 줄인다.</Takeaway>
        <LearningHandoff
          description="여기서 얻은 산출물은 target pose, IK branch, joint configuration과 Jacobian condition이다. 경로·시간·추적은 서로 다른 다음 계약이다."
          items={[
            { label: '막히면', slug: 'linear-algebra-decompositions', title: '부분공간과 행렬 분해', reason: 'Jacobian rank, singular value, null space와 damped pseudoinverse를 바닥부터 복습한다.' },
            { label: '이어 읽기', slug: 'robot-motion-planning', title: 'Robot Motion Planning', reason: '가능한 pose 하나를 두 pose 사이의 collision-free configuration-space path로 확장한다.' },
            { label: '적용하기', slug: 'robot-dynamics-feedback-control', title: 'Robot Dynamics & Feedback Control', reason: 'Jacobian과 joint state를 torque·stability·tracking error가 있는 실제 폐루프에 연결한다.' },
          ]}
        />
        <CapabilityCheck items={[
          '같은 physical point가 두 frame에서 다른 coordinate를 갖는 이유를 수치로 계산한다.',
          'Homogeneous transform의 방향, composition order와 inverse translation을 검산한다.',
          '2R forward kinematics와 workspace test, 두 IK branch를 구분한다.',
          'Jacobian column을 unit joint rate가 만든 endpoint velocity로 해석한다.',
          'Singular value가 작을 때 inverse joint rate가 커지는 이유를 설명한다.',
          'DLS가 해결하는 문제와 joint limit·collision이 여전히 남는 이유를 구분한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Lynch & Park · Modern Robotics', href: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics', note: 'Rigid-body motion, PoE, Jacobian, singularity와 numerical IK의 1차 교재·영상 자료' },
          { label: 'Modern Robotics · Velocity Kinematics and Statics', href: 'https://modernrobotics.northwestern.edu/nu-gm-book-resource/velocity-kinematics-and-statics/', note: 'Jacobian column, rank loss와 manipulability를 2R arm으로 유도한 공식 transcript' },
          { label: 'ROS 2 · tf2', href: 'https://docs.ros.org/en/lyrical/Concepts/Intermediate/About-Tf2.html', note: 'Frame tree를 시간 buffer로 관리하고 원하는 시점의 transform을 조회하는 production contract' },
          { label: 'Whitney · The Mathematics of Coordinated Control', href: 'https://citeseerx.ist.psu.edu/document?doi=9e083bd1eaa5b4759218534759a30d76c9cb31f5&repid=rep1&type=pdf', note: 'Task-coordinate velocity를 joint rate로 변환하고 singularity와 redundancy를 논의한 원문' },
        ]} />
      </NlpSection>
    </>
  );
}
