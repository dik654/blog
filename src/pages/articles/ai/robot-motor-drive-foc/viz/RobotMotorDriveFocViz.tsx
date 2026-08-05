import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircuitBoard,
  Gauge,
  Magnet,
  Power,
  Radar,
  RotateCw,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Waves,
  Zap,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const deg = (radians: number) => (radians * 180) / Math.PI;
const wrapDeg = (degrees: number) => ((degrees + 180) % 360 + 360) % 360 - 180;
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function LabFrame({ eyebrow, title, status, danger = false, children }: { eyebrow: string; title: string; status: string; danger?: boolean; children: ReactNode }) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-300">{eyebrow}</span>
        <strong className="min-w-0 text-sm leading-snug">{title}</strong>
        <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function RangeControl({ label, value, min, max, step = 1, unit, onChange, accent = 'teal' }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void; accent?: 'teal' | 'violet' | 'amber' }) {
  const accentClass = accent === 'violet' ? 'accent-violet-600' : accent === 'amber' ? 'accent-amber-600' : 'accent-teal-600';
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono text-foreground">{value}{unit}</span></span>
      <input className={`h-2 w-full cursor-pointer ${accentClass}`} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function ToggleRow({ label, note, checked, onChange }: { label: string; note: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/20">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="min-w-0"><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{note}</span></span>
    </label>
  );
}

function VectorStage({ vectors, dAxis, qAxis, label }: { vectors: Array<{ angle: number; length: number; color: string; label: string; dashed?: boolean }>; dAxis?: number; qAxis?: number; label: string }) {
  const cx = 150;
  const cy = 122;
  const radius = 84;
  const point = (angle: number, length: number) => ({ x: cx + Math.cos(rad(angle)) * radius * length, y: cy - Math.sin(rad(angle)) * radius * length });
  return (
    <div className="mx-auto w-full max-w-[30rem]">
    <svg viewBox="0 0 300 248" role="img" aria-label={label} className="block aspect-[300/248] w-full">
      <circle cx={cx} cy={cy} r={radius} fill="none" className="stroke-border" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={radius * 0.5} fill="none" className="stroke-border/60" strokeWidth="1" strokeDasharray="3 5" />
      <line x1={cx - 105} y1={cy} x2={cx + 105} y2={cy} className="stroke-border" strokeWidth="1" />
      <line x1={cx} y1={cy - 105} x2={cx} y2={cy + 105} className="stroke-border" strokeWidth="1" />
      <text x={cx + 108} y={cy + 4} className="fill-muted-foreground text-[10px]">alpha</text>
      <text x={cx + 5} y={cy - 107} className="fill-muted-foreground text-[10px]">beta</text>
      {dAxis !== undefined && <>
        {(() => { const end = point(dAxis, 1.12); return <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="5 4" />; })()}
        {(() => { const end = point(qAxis ?? dAxis + 90, 1.12); return <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 5" />; })()}
        {(() => { const end = point(dAxis, 1.18); return <text x={end.x} y={end.y} textAnchor="middle" className="fill-violet-700 text-[10px] font-bold">d</text>; })()}
        {(() => { const end = point(qAxis ?? dAxis + 90, 1.18); return <text x={end.x} y={end.y} textAnchor="middle" className="fill-violet-700 text-[10px] font-bold">q</text>; })()}
      </>}
      {vectors.map((vector) => {
        const end = point(vector.angle, clamp(vector.length, 0, 1.1));
        return <g key={vector.label}>
          <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={vector.color} strokeWidth="2" strokeLinecap="round" strokeDasharray={vector.dashed ? '5 4' : undefined} />
          <circle cx={end.x} cy={end.y} r="3.5" fill={vector.color} />
        </g>;
      })}
      <circle cx={cx} cy={cy} r="3" className="fill-foreground" />
    </svg>
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-2 pb-2 text-[10px] font-semibold text-muted-foreground">
      {vectors.map((vector) => <span key={vector.label} className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2" style={{ borderColor: vector.color, borderStyle: vector.dashed ? 'dashed' : 'solid' }} />{vector.label}</span>)}
      {dAxis !== undefined && <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t border-dashed border-violet-500" />d-q 기준축</span>}
    </div>
    </div>
  );
}

type ContractBreak = 'none' | 'unit' | 'angle' | 'voltage' | 'trip';

export function TorqueActuationContractLab() {
  const [fault, setFault] = useState<ContractBreak>('angle');
  const [torque, setTorque] = useState(18);
  const [currentLimit, setCurrentLimit] = useState(42);
  const torqueConstant = 0.62;
  const requestedCurrent = torque / torqueConstant;
  const unitScale = fault === 'unit' ? Math.sqrt(2) : 1;
  const limitedCurrent = Math.min(requestedCurrent * unitScale, currentLimit);
  const angleEfficiency = fault === 'angle' ? Math.cos(rad(35)) : 1;
  const voltageScale = fault === 'voltage' ? 0.72 : 1;
  const gatesOn = fault !== 'trip';
  const observedTorque = gatesOn ? torqueConstant * limitedCurrent * angleEfficiency * voltageScale : 0;
  const safe = fault === 'none' && requestedCurrent <= currentLimit;
  const firstFailure: Record<ContractBreak, string> = { none: requestedCurrent <= currentLimit ? '없음' : '전류 제한', unit: 'peak/RMS 단위', angle: '전기각 identity', voltage: 'DC-bus 전압 여유', trip: 'gate-driver hardware trip' };
  const stages = [
    ['torque request', `${torque} N·m`, true],
    ['q-current', `${fmt(limitedCurrent)} A`, fault !== 'unit'],
    ['dq voltage', fault === 'voltage' ? 'vector limited' : 'within bus', fault !== 'voltage'],
    ['PWM / gate', gatesOn ? 'switching' : 'tripped', gatesOn],
    ['observed torque', `${fmt(observedTorque)} N·m`, Math.abs(observedTorque - torque) < 1],
  ] as const;
  return (
    <LabFrame eyebrow="DRIVE LAB 01" title="Torque request에서 physical torque evidence까지" status={safe ? 'CHAIN VERIFIED' : `FIRST BREAK · ${firstFailure[fault]}`} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Injected contract break" value={fault} onChange={setFault} options={[{ value: 'none', label: '정상' }, { value: 'unit', label: 'Peak/RMS' }, { value: 'angle', label: '전기각' }, { value: 'voltage', label: 'DC bus' }, { value: 'trip', label: 'Driver trip' }]} />
          <RangeControl label="Requested joint torque" value={torque} min={2} max={30} unit=" N·m" onChange={setTorque} />
          <RangeControl label="Drive current limit" value={currentLimit} min={15} max={55} unit=" A peak" onChange={setCurrentLimit} accent="violet" />
        </div>
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-3">
            {stages.slice(0, 3).map(([label, value, valid], index) => <div key={label} className={`min-w-0 rounded-md border p-3 ${valid ? 'border-border bg-muted/[0.12]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><p className="mt-2 text-xs font-black">{label}</p><p className={`mt-1 font-mono text-xs ${valid ? 'text-muted-foreground' : 'text-red-700 dark:text-red-300'}`}>{value}</p></div>)}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {stages.slice(3).map(([label, value, valid], index) => <div key={label} className={`min-w-0 rounded-md border p-3 ${valid ? 'border-border bg-muted/[0.12]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 4).padStart(2, '0')}</span><p className="mt-2 text-xs font-black">{label}</p><p className={`mt-1 font-mono text-xs ${valid ? 'text-muted-foreground' : 'text-red-700 dark:text-red-300'}`}>{value}</p></div>)}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Requested duty나 command echo가 아니라 gate 상태, phase current와 실제 torque response까지 같은 cycle identity로 연결해야 합니다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Requested current', value: `${fmt(requestedCurrent)} A peak` }, { label: 'Limited current', value: `${fmt(limitedCurrent)} A peak` }, { label: 'Observed torque', value: `${fmt(observedTorque)} N·m` }, { label: 'Evidence gate', value: safe ? 'OPEN' : 'CLOSED', accent: safe }]} /></div>
    </LabFrame>
  );
}

export function RotatingFieldLab() {
  const [angle, setAngle] = useState(35);
  const [amplitude, setAmplitude] = useState(18);
  const [torqueAngle, setTorqueAngle] = useState(75);
  const ia = amplitude * Math.cos(rad(angle));
  const ib = amplitude * Math.cos(rad(angle - 120));
  const ic = amplitude * Math.cos(rad(angle + 120));
  const torqueRatio = Math.sin(rad(torqueAngle));
  const phases = [{ label: 'iA', value: ia, tone: 'bg-blue-500' }, { label: 'iB', value: ib, tone: 'bg-teal-500' }, { label: 'iC', value: ic, tone: 'bg-violet-500' }];
  return (
    <LabFrame eyebrow="DRIVE LAB 02" title="세 phase current가 만드는 하나의 rotating vector" status={`${fmt(torqueRatio * 100, 0)}% TORQUE GEOMETRY`}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Electrical phase" value={angle} min={0} max={360} unit="°" onChange={setAngle} accent="violet" />
          <RangeControl label="Phase peak current" value={amplitude} min={2} max={30} unit=" A" onChange={setAmplitude} />
          <RangeControl label="Current-to-flux angle" value={torqueAngle} min={0} max={180} unit="°" onChange={setTorqueAngle} accent="amber" />
          <div className="space-y-2">
            {phases.map((phase) => <div key={phase.label} className="grid grid-cols-[2rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs"><span className="font-black">{phase.label}</span><span className="relative h-2 overflow-hidden rounded-sm bg-muted"><span className={`absolute h-full ${phase.tone}`} style={{ left: phase.value >= 0 ? '50%' : `${50 + (phase.value / amplitude) * 50}%`, width: `${Math.abs(phase.value / amplitude) * 50}%` }} /></span><span className="text-right font-mono text-muted-foreground">{fmt(phase.value)} A</span></div>)}
          </div>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.08] p-3">
          <VectorStage label="Rotating stator current vector and rotor flux" dAxis={angle - torqueAngle} vectors={[{ angle: angle - torqueAngle, length: 0.82, color: '#7c3aed', label: 'rotor flux' }, { angle, length: 1, color: '#0f766e', label: 'stator current' }]} />
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Phase sum', value: `${fmt(ia + ib + ic, 2)} A` }, { label: 'Vector magnitude', value: `${amplitude} A peak` }, { label: 'Torque angle', value: `${torqueAngle}°` }, { label: 'Perpendicular share', value: `${fmt(torqueRatio * 100, 0)}%`, accent: torqueAngle >= 70 && torqueAngle <= 110 }]} /></div>
    </LabFrame>
  );
}

type ClarkeScale = 'amplitude' | 'power';

export function ClarkeProjectionLab() {
  const [angle, setAngle] = useState(25);
  const [amplitude, setAmplitude] = useState(20);
  const [zero, setZero] = useState(0);
  const [scale, setScale] = useState<ClarkeScale>('amplitude');
  const ia = amplitude * Math.cos(rad(angle)) + zero;
  const ib = amplitude * Math.cos(rad(angle - 120)) + zero;
  const ic = amplitude * Math.cos(rad(angle + 120)) + zero;
  const k = scale === 'amplitude' ? 2 / 3 : Math.sqrt(2 / 3);
  const alpha = k * (ia - 0.5 * ib - 0.5 * ic);
  const beta = k * ((Math.sqrt(3) / 2) * ib - (Math.sqrt(3) / 2) * ic);
  const displayMagnitude = Math.hypot(alpha, beta);
  const z0 = (ia + ib + ic) / 3;
  const reconstructionResidual = Math.abs(z0);
  return (
    <LabFrame eyebrow="DRIVE LAB 03" title="abc를 alpha-beta로 투영할 때 보존하는 양" status={Math.abs(z0) < 0.1 ? 'BALANCED SUBSPACE' : 'ZERO-SEQUENCE REMAINS'} danger={Math.abs(z0) >= 0.1}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Clarke scaling" value={scale} onChange={setScale} options={[{ value: 'amplitude', label: 'Amplitude invariant' }, { value: 'power', label: 'Power invariant' }]} />
          <RangeControl label="Electrical phase" value={angle} min={0} max={360} unit="°" onChange={setAngle} accent="violet" />
          <RangeControl label="Balanced phase peak" value={amplitude} min={2} max={30} unit=" A" onChange={setAmplitude} />
          <RangeControl label="Common zero sequence" value={zero} min={-6} max={6} unit=" A" onChange={setZero} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.08] p-3">
          <VectorStage label="Clarke alpha beta projection" vectors={[{ angle: deg(Math.atan2(beta, alpha)), length: clamp(displayMagnitude / 32, 0, 1), color: '#2563eb', label: 'i alpha-beta' }]} />
          <div className="grid gap-2 sm:grid-cols-3">
            {[['i alpha', `${fmt(alpha)} A`], ['i beta', `${fmt(beta)} A`], ['i zero', `${fmt(z0)} A`]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>)}
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Scaling coefficient', value: scale === 'amplitude' ? '2/3' : 'sqrt(2/3)' }, { label: 'Coordinate magnitude', value: `${fmt(displayMagnitude)} A` }, { label: 'Ignored zero sequence', value: `${fmt(reconstructionResidual)} A` }, { label: 'Convention gate', value: Math.abs(z0) < 0.1 ? '2D VALID' : 'ADD i0 AXIS', accent: Math.abs(z0) < 0.1 }]} /></div>
    </LabFrame>
  );
}

type PhaseOrder = 'abc' | 'acb';

export function ParkAngleContractLab() {
  const [mechanical, setMechanical] = useState(18);
  const [configuredPairs, setConfiguredPairs] = useState(7);
  const [offset, setOffset] = useState(12);
  const [positive, setPositive] = useState(true);
  const [order, setOrder] = useState<PhaseOrder>('abc');
  const truePairs = 7;
  const trueElectrical = wrapDeg(truePairs * mechanical);
  const trueId = -3;
  const trueIq = 18;
  const currentAngle = trueElectrical + deg(Math.atan2(trueIq, trueId));
  const configuredElectrical = wrapDeg((positive ? 1 : -1) * configuredPairs * mechanical + offset);
  const reflectedCurrentAngle = order === 'abc' ? currentAngle : -currentAngle;
  const relative = rad(reflectedCurrentAngle - configuredElectrical);
  const magnitude = Math.hypot(trueId, trueIq);
  const measuredId = magnitude * Math.cos(relative);
  const measuredIq = magnitude * Math.sin(relative);
  const angleError = wrapDeg(configuredElectrical - trueElectrical);
  const efficient = Math.abs(angleError) < 5 && order === 'abc';
  return (
    <LabFrame eyebrow="DRIVE LAB 04" title="Mechanical encoder를 electrical d-q frame으로 바꾸는 계약" status={efficient ? 'AXES ALIGNED' : `${fmt(angleError, 0)}° FRAME ERROR`} danger={!efficient}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Mechanical angle" value={mechanical} min={0} max={52} unit="°" onChange={setMechanical} accent="violet" />
          <RangeControl label="Configured pole pairs" value={configuredPairs} min={5} max={14} unit="" onChange={setConfiguredPairs} />
          <RangeControl label="Electrical zero offset" value={offset} min={-45} max={45} unit="°" onChange={setOffset} accent="amber" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><ToggleRow label="Positive encoder direction" note="끄면 electrical angle sign 반전" checked={positive} onChange={setPositive} /><SegmentedControl label="Phase order" value={order} onChange={setOrder} options={[{ value: 'abc', label: 'A-B-C' }, { value: 'acb', label: 'A-C-B' }]} /></div>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.08] p-3">
          <VectorStage label="True rotor frame and configured Park frame" dAxis={configuredElectrical} vectors={[{ angle: trueElectrical, length: 0.82, color: '#7c3aed', label: 'true flux' }, { angle: reflectedCurrentAngle, length: 1, color: '#0f766e', label: 'measured current' }]} />
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'True electrical angle', value: `${fmt(trueElectrical, 0)}°` }, { label: 'Configured angle', value: `${fmt(configuredElectrical, 0)}°` }, { label: 'Observed id', value: `${fmt(measuredId)} A` }, { label: 'Observed iq', value: `${fmt(measuredIq)} A`, accent: efficient }]} /></div>
    </LabFrame>
  );
}

type MotorType = 'spm' | 'ipm';

export function PmsmTorqueModelLab() {
  const [motor, setMotor] = useState<MotorType>('ipm');
  const [id, setId] = useState(-12);
  const [iq, setIq] = useState(24);
  const [speed, setSpeed] = useState(1800);
  const p = 7;
  const psi = 0.052;
  const rs = 0.085;
  const ld = motor === 'spm' ? 0.00024 : 0.00018;
  const lq = motor === 'spm' ? 0.00025 : 0.00042;
  const omegaM = (speed * 2 * Math.PI) / 60;
  const omegaE = p * omegaM;
  const magnetTorque = 1.5 * p * psi * iq;
  const reluctanceTorque = 1.5 * p * (ld - lq) * id * iq;
  const vdResistive = rs * id;
  const vdCross = -omegaE * lq * iq;
  const vqResistive = rs * iq;
  const vqCross = omegaE * ld * id;
  const vqEmf = omegaE * psi;
  const vd = vdResistive + vdCross;
  const vq = vqResistive + vqCross + vqEmf;
  const voltage = Math.hypot(vd, vq);
  const voltageLimit = 48 / Math.sqrt(3);
  const feasible = voltage <= voltageLimit;
  const terms = [
    { label: 'd · Rs drop', value: Math.abs(vdResistive), color: 'bg-blue-500' },
    { label: 'd · cross coupling', value: Math.abs(vdCross), color: 'bg-violet-500' },
    { label: 'q · Rs drop', value: Math.abs(vqResistive), color: 'bg-blue-500' },
    { label: 'q · speed + back EMF', value: Math.abs(vqCross + vqEmf), color: 'bg-amber-500' },
  ];
  const maxTerm = Math.max(...terms.map((term) => term.value), 1);
  return (
    <LabFrame eyebrow="DRIVE LAB 05" title="PMSM torque와 d-q voltage term budget" status={feasible ? 'VOLTAGE FEASIBLE' : 'DC BUS LIMIT EXCEEDED'} danger={!feasible}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Motor saliency" value={motor} onChange={setMotor} options={[{ value: 'spm', label: 'SPM · Ld≈Lq' }, { value: 'ipm', label: 'IPM · Ld<Lq' }]} />
          <RangeControl label="d-axis current" value={id} min={-32} max={10} unit=" A peak" onChange={setId} accent="violet" />
          <RangeControl label="q-axis current" value={iq} min={-32} max={32} unit=" A peak" onChange={setIq} />
          <RangeControl label="Mechanical speed" value={speed} min={0} max={4200} step={100} unit=" rpm" onChange={setSpeed} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/[0.12] p-3"><p className="text-xs font-black">Torque decomposition</p><p className="mt-3 font-mono text-sm">magnet {fmt(magnetTorque)} N·m</p><p className="mt-1 font-mono text-sm">reluctance {fmt(reluctanceTorque)} N·m</p><p className="mt-3 text-lg font-black">{fmt(magnetTorque + reluctanceTorque)} N·m</p></div>
            <div className="rounded-md border border-border bg-muted/[0.12] p-3"><p className="text-xs font-black">Declared parameters</p><p className="mt-3 font-mono text-xs text-muted-foreground">Rs {rs} Ω · psi {psi} Wb</p><p className="mt-1 font-mono text-xs text-muted-foreground">Ld {fmt(ld * 1000, 2)} mH</p><p className="mt-1 font-mono text-xs text-muted-foreground">Lq {fmt(lq * 1000, 2)} mH</p></div>
          </div>
          <div className="mt-4 space-y-2">{terms.map((term) => <div key={term.label} className="grid grid-cols-[8rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-[11px]"><span>{term.label}</span><span className="h-2 overflow-hidden rounded-sm bg-muted"><span className={`block h-full ${term.color}`} style={{ width: `${(term.value / maxTerm) * 100}%` }} /></span><span className="text-right font-mono">{fmt(term.value)} V</span></div>)}</div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Magnet torque', value: `${fmt(magnetTorque)} N·m` }, { label: 'Reluctance torque', value: `${fmt(reluctanceTorque)} N·m` }, { label: 'Voltage request', value: `${fmt(voltage)} V peak` }, { label: 'SVPWM limit', value: `${fmt(voltageLimit)} V peak`, accent: feasible }]} /></div>
    </LabFrame>
  );
}

type LoopPoint = { t: number; iq: number; ref: number; voltage: number; integrator: number };

export function DqCurrentLoopLab() {
  const [bandwidth, setBandwidth] = useState(900);
  const [delaySamples, setDelaySamples] = useState(1);
  const [speed, setSpeed] = useState(500);
  const [antiWindup, setAntiWindup] = useState(true);
  const [decoupling, setDecoupling] = useState(true);
  const result = useMemo(() => {
    const ts = 50e-6;
    const rs = 0.085;
    const ld = 0.00018;
    const lq = 0.00042;
    const psi = 0.052;
    const p = 7;
    const omega = p * speed * 2 * Math.PI / 60;
    const wc = 2 * Math.PI * bandwidth;
    const kpD = ld * wc;
    const kpQ = lq * wc;
    const ki = rs * wc;
    const limit = 48 / Math.sqrt(3);
    let id = 0;
    let iq = 0;
    let xiD = 0;
    let xiQ = 0;
    let saturation = 0;
    const queue = Array.from({ length: delaySamples + 1 }, () => ({ vd: 0, vq: 0 }));
    const points: LoopPoint[] = [];
    for (let k = 0; k < 260; k += 1) {
      const ref = k < 15 ? 0 : 24;
      const ed = -id;
      const eq = ref - iq;
      const ffD = decoupling ? -omega * lq * iq : 0;
      const ffQ = decoupling ? omega * ld * id + omega * psi : 0;
      const vuD = kpD * ed + xiD + ffD;
      const vuQ = kpQ * eq + xiQ + ffQ;
      const norm = Math.hypot(vuD, vuQ);
      const scale = norm > limit ? limit / norm : 1;
      const vsD = vuD * scale;
      const vsQ = vuQ * scale;
      if (scale < 1) saturation += 1;
      const kaw = antiWindup ? wc * 0.35 : 0;
      xiD += ts * (ki * ed + kaw * (vsD - vuD));
      xiQ += ts * (ki * eq + kaw * (vsQ - vuQ));
      xiD = clamp(xiD, -80, 80);
      xiQ = clamp(xiQ, -80, 80);
      queue.push({ vd: vsD, vq: vsQ });
      const applied = queue.shift() ?? { vd: 0, vq: 0 };
      const did = (applied.vd - rs * id + omega * lq * iq) / ld;
      const diq = (applied.vq - rs * iq - omega * ld * id - omega * psi) / lq;
      id = clamp(id + ts * did, -80, 80);
      iq = clamp(iq + ts * diq, -80, 80);
      points.push({ t: k * ts * 1000, iq, ref, voltage: Math.hypot(vsD, vsQ), integrator: xiQ });
    }
    const after = points.slice(15);
    const peak = Math.max(...after.map((point) => point.iq));
    const final = points.at(-1)?.iq ?? 0;
    const settledIndex = after.findIndex((_, index) => after.slice(index).every((point) => Math.abs(point.iq - 24) <= 1.2));
    return { points, peak, final, settling: settledIndex < 0 ? null : after[settledIndex].t - after[0].t, saturationMs: saturation * ts * 1000, integrator: points.at(-1)?.integrator ?? 0 };
  }, [antiWindup, bandwidth, decoupling, delaySamples, speed]);
  const observedValues = result.points.flatMap((point) => [point.iq, point.ref]);
  const observedMin = Math.min(...observedValues);
  const observedMax = Math.max(...observedValues);
  const yPadding = Math.max(4, (observedMax - observedMin) * 0.1);
  const yMin = Math.floor((observedMin - yPadding) / 5) * 5;
  const yMax = Math.ceil((observedMax + yPadding) / 5) * 5;
  const y = (value: number) => 116 - clamp((value - yMin) / Math.max(yMax - yMin, 1), 0, 1) * 92;
  const line = (key: 'iq' | 'ref') => result.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${(index / (result.points.length - 1)) * 300} ${y(point[key])}`).join(' ');
  const stable = Math.abs(result.final - 24) <= 2 && result.peak < 36;
  return (
    <LabFrame eyebrow="DRIVE LAB 06" title="Discrete d-q current loop, vector saturation과 anti-windup" status={stable ? 'TRACKING BOUNDED' : 'TRACKING NOT SETTLED'} danger={!stable}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Current-loop bandwidth" value={bandwidth} min={250} max={2200} step={50} unit=" Hz" onChange={setBandwidth} />
          <RangeControl label="Compute/PWM delay" value={delaySamples} min={0} max={3} unit=" samples" onChange={setDelaySamples} accent="amber" />
          <RangeControl label="Mechanical speed" value={speed} min={0} max={3000} step={100} unit=" rpm" onChange={setSpeed} accent="violet" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><ToggleRow label="Vector anti-windup" note="limited-unlimited voltage를 integral에 되먹임" checked={antiWindup} onChange={setAntiWindup} /><ToggleRow label="Model decoupling" note="cross coupling과 back EMF feedforward" checked={decoupling} onChange={setDecoupling} /></div>
        </div>
        <div className="min-w-0 rounded-md border border-border p-3">
          <div className="flex items-center justify-between gap-3 text-xs"><span className="font-black">q-current step response</span><span className="font-mono text-muted-foreground">Ts 50 µs · Vdc 48 V</span></div>
          <svg viewBox="0 0 300 130" role="img" aria-label="Simulated q-axis current response" className="mt-3 block aspect-[300/130] w-full">
            {[24, 70, 116].map((yy) => <line key={yy} x1="0" y1={yy} x2="300" y2={yy} className="stroke-border" strokeWidth="1" />)}
            <path d={line('ref')} fill="none" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="5 4" />
            <path d={line('iq')} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
            <text x="5" y="18" className="fill-muted-foreground text-[9px]">{yMax} A</text><text x="5" y="126" className="fill-muted-foreground text-[9px]">{yMin} A</text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><span className="h-0.5 w-4 bg-teal-700" />measured iq</span><span className="flex items-center gap-1"><span className="w-4 border-t border-dashed border-violet-700" />reference</span></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Final iq', value: `${fmt(result.final)} A` }, { label: 'Peak iq', value: `${fmt(result.peak)} A` }, { label: 'Saturation time', value: `${fmt(result.saturationMs, 2)} ms` }, { label: 'Settling', value: result.settling === null ? 'not settled' : `${fmt(result.settling, 2)} ms`, accent: stable }]} /></div>
    </LabFrame>
  );
}

export function SvpwmInverterLab() {
  const [angle, setAngle] = useState(22);
  const [modulation, setModulation] = useState(82);
  const [vdc, setVdc] = useState(48);
  const [deadtime, setDeadtime] = useState(0.8);
  const [minPulse, setMinPulse] = useState(1.2);
  const tpwm = 50;
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const sector = Math.floor(normalizedAngle / 60) + 1;
  const local = rad(normalizedAngle % 60);
  const m = modulation / 100;
  const t1 = Math.max(0, m * tpwm * Math.sin(Math.PI / 3 - local));
  const t2 = Math.max(0, m * tpwm * Math.sin(local));
  const t0 = tpwm - t1 - t2;
  const linearLimit = vdc / Math.sqrt(3);
  const requested = linearLimit * m;
  const pulseValid = t1 >= minPulse && t2 >= minPulse && t0 >= 0;
  const deadLoss = vdc * (deadtime / tpwm) * 0.65;
  const applied = Math.max(0, Math.min(requested, linearLimit) - deadLoss - (pulseValid ? 0 : 1.4));
  const vectorScale = 86 / Math.max(linearLimit * 1.18, 1);
  const vertices = Array.from({ length: 6 }, (_, index) => { const a = rad(index * 60); return `${150 + Math.cos(a) * 92},${112 - Math.sin(a) * 92}`; }).join(' ');
  const reqEnd = { x: 150 + Math.cos(rad(angle)) * requested * vectorScale, y: 112 - Math.sin(rad(angle)) * requested * vectorScale };
  const appEnd = { x: 150 + Math.cos(rad(angle)) * applied * vectorScale, y: 112 - Math.sin(rad(angle)) * applied * vectorScale };
  return (
    <LabFrame eyebrow="DRIVE LAB 07" title="SVPWM dwell과 requested/applied voltage vector" status={pulseValid ? `SECTOR ${sector} · LINEAR` : 'DWELL OR PULSE INVALID'} danger={!pulseValid}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Voltage vector angle" value={angle} min={0} max={359} unit="°" onChange={setAngle} accent="violet" />
          <RangeControl label="Linear-limit request" value={modulation} min={10} max={120} unit="%" onChange={setModulation} />
          <RangeControl label="Measured DC bus" value={vdc} min={28} max={60} unit=" V" onChange={setVdc} />
          <RangeControl label="Dead time" value={deadtime} min={0.2} max={2.5} step={0.1} unit=" µs" onChange={setDeadtime} accent="amber" />
          <RangeControl label="Minimum usable pulse" value={minPulse} min={0.4} max={4} step={0.2} unit=" µs" onChange={setMinPulse} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.08] p-3">
          <svg viewBox="0 0 300 225" role="img" aria-label="Space-vector PWM hexagon" className="block aspect-[300/225] w-full">
            <polygon points={vertices} fill="none" stroke="currentColor" className="text-border" strokeWidth="1.2" />
            <circle cx="150" cy="112" r={linearLimit * vectorScale} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 5" />
            {Array.from({ length: 6 }, (_, index) => { const a = rad(index * 60); return <line key={index} x1="150" y1="112" x2={150 + Math.cos(a) * 92} y2={112 - Math.sin(a) * 92} className="stroke-border/70" strokeWidth="1" />; })}
            <line x1="150" y1="112" x2={reqEnd.x} y2={reqEnd.y} stroke="#7c3aed" strokeWidth="1.4" strokeDasharray="5 4" />
            <circle cx={reqEnd.x} cy={reqEnd.y} r="3" fill="#7c3aed" />
            <line x1="150" y1="112" x2={appEnd.x} y2={appEnd.y} stroke="#0f766e" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx={appEnd.x} cy={appEnd.y} r="3.5" fill="#0f766e" />
            <text x="10" y="18" className="fill-muted-foreground text-[10px]">dashed requested · solid applied</text>
          </svg>
          <div className="grid gap-2 sm:grid-cols-3">{[['T1', `${fmt(t1)} µs`], ['T2', `${fmt(t2)} µs`], ['T0', `${fmt(t0)} µs`]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>)}</div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Requested vector', value: `${fmt(requested)} V peak` }, { label: 'Applied estimate', value: `${fmt(applied)} V peak` }, { label: 'Vector error', value: `${fmt(requested - applied)} V` }, { label: 'Pulse gate', value: pulseValid ? 'VALID' : 'CLOSED', accent: pulseValid }]} /></div>
    </LabFrame>
  );
}

type SenseTopology = 'inline' | 'two' | 'single';

export function SensorAlignmentWindowLab() {
  const [topology, setTopology] = useState<SenseTopology>('two');
  const [offset, setOffset] = useState(1.2);
  const [angleError, setAngleError] = useState(8);
  const [samplePhase, setSamplePhase] = useState(25);
  const [duty, setDuty] = useState(82);
  const [polarity, setPolarity] = useState(true);
  const period = 50;
  const edgeDistance = Math.min(samplePhase, period - samplePhase);
  const lowSideWindow = ((100 - duty) / 100) * period;
  const required = topology === 'inline' ? 1.5 : topology === 'two' ? 3.5 : 5.5;
  const available = topology === 'inline' ? edgeDistance : topology === 'two' ? Math.min(edgeDistance, lowSideWindow) : Math.min(edgeDistance, lowSideWindow * 0.55);
  const sampleValid = available >= required;
  const kclResidual = Math.abs(offset) * (topology === 'inline' ? 0.4 : topology === 'two' ? 1.5 : 2.2) + (polarity ? 0 : 18);
  const leakage = Math.abs(Math.sin(rad(angleError))) * 20 + (polarity ? 0 : 20);
  const gate = sampleValid && Math.abs(offset) < 0.5 && Math.abs(angleError) < 3 && polarity;
  const sampleX = (samplePhase / period) * 100;
  return (
    <LabFrame eyebrow="DRIVE LAB 08" title="Current calibration, rotor alignment과 measurable PWM window" status={gate ? 'CLOSE-LOOP READY' : 'ALIGNMENT/SAMPLE GATE CLOSED'} danger={!gate}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Current sensing topology" value={topology} onChange={setTopology} options={[{ value: 'inline', label: 'Inline' }, { value: 'two', label: '2-shunt' }, { value: 'single', label: '1-shunt' }]} />
          <RangeControl label="Residual current offset" value={offset} min={-3} max={3} step={0.1} unit=" A" onChange={setOffset} accent="amber" />
          <RangeControl label="Electrical alignment error" value={angleError} min={-30} max={30} unit="°" onChange={setAngleError} accent="violet" />
          <RangeControl label="ADC sample phase" value={samplePhase} min={1} max={49} unit=" µs" onChange={setSamplePhase} />
          <RangeControl label="PWM duty" value={duty} min={15} max={98} unit="%" onChange={setDuty} accent="amber" />
          <ToggleRow label="Current polarity correct" note="PWM phase와 ADC current sign mapping" checked={polarity} onChange={setPolarity} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between text-xs font-semibold"><span>PWM period · 50 µs</span><span className="font-mono text-muted-foreground">need {required} µs clean</span></div>
          <div className="relative mt-4 h-24 overflow-hidden rounded-md bg-muted/30 ring-1 ring-inset ring-border">
            <span className="absolute inset-y-0 left-0 bg-red-500/[0.09]" style={{ width: `${(required / period) * 100}%` }} />
            <span className="absolute inset-y-0 right-0 bg-red-500/[0.09]" style={{ width: `${(required / period) * 100}%` }} />
            <span className="absolute bottom-4 left-0 h-5 bg-blue-500/35" style={{ width: `${duty}%` }}><span className="sr-only">high-side duty</span></span>
            <span className={`absolute inset-y-0 border-l-2 ${sampleValid ? 'border-emerald-600' : 'border-red-600'}`} style={{ left: `${sampleX}%` }}><span className="absolute left-1 top-2 whitespace-nowrap font-mono text-[10px] font-black">ADC {samplePhase} µs</span></span>
            <span className="absolute bottom-1 left-2 text-[10px] text-muted-foreground">switching edge</span><span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">switching edge</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">{[['available', `${fmt(available)} µs`], ['KCL residual', `${fmt(kclResidual)} A`], ['dq leakage', `${fmt(leakage)} A`]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-muted/[0.1] p-3"><p className="text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>)}</div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Sample window', value: sampleValid ? 'MEASURABLE' : 'UNOBSERVABLE' }, { label: 'Offset gate', value: Math.abs(offset) < 0.5 ? 'PASS' : 'FAIL' }, { label: 'Angle/sign gate', value: Math.abs(angleError) < 3 && polarity ? 'PASS' : 'FAIL' }, { label: 'Current-loop enable', value: gate ? 'ALLOWED' : 'BLOCKED', accent: gate }]} /></div>
    </LabFrame>
  );
}

type EnvelopePolicy = 'id0' | 'mtpa' | 'auto';

export function OperatingEnvelopeLab() {
  const [motor, setMotor] = useState<MotorType>('ipm');
  const [policy, setPolicy] = useState<EnvelopePolicy>('auto');
  const [speed, setSpeed] = useState(2200);
  const [torque, setTorque] = useState(16);
  const [vdc, setVdc] = useState(48);
  const [temperature, setTemperature] = useState(70);
  const p = 7;
  const psi = 0.052;
  const ld = motor === 'spm' ? 0.00024 : 0.00018;
  const lq = motor === 'spm' ? 0.00025 : 0.00042;
  const rs = 0.075 * (1 + 0.0039 * (temperature - 25));
  const iMax = 42 * clamp(1 - Math.max(0, temperature - 75) / 90, 0.55, 1);
  const vMax = vdc / Math.sqrt(3);
  const omegaM = speed * 2 * Math.PI / 60;
  const omegaE = p * omegaM;
  const candidates = useMemo(() => {
    const values: Array<{ id: number; iq: number; t: number; v: number; current: number; score: number }> = [];
    for (let id = -iMax; id <= 0; id += 0.5) for (let iq = -iMax; iq <= iMax; iq += 0.5) {
      const current = Math.hypot(id, iq);
      if (current > iMax) continue;
      const t = 1.5 * p * (psi * iq + (ld - lq) * id * iq);
      const vd = rs * id - omegaE * lq * iq;
      const vq = rs * iq + omegaE * ld * id + omegaE * psi;
      const v = Math.hypot(vd, vq);
      const torqueError = Math.abs(t - torque);
      const voltagePenalty = Math.max(0, v - vMax) * 8;
      const policyPenalty = policy === 'id0' ? Math.abs(id) * 0.45 : policy === 'mtpa' ? current * 0.035 : current * 0.012 + Math.abs(id) * (v <= vMax ? 0.006 : 0);
      values.push({ id, iq, t, v, current, score: torqueError * 12 + voltagePenalty + policyPenalty });
    }
    return values.sort((a, b) => a.score - b.score)[0];
  }, [iMax, ld, lq, omegaE, p, policy, psi, rs, torque, vMax]);
  const chosen = candidates ?? { id: 0, iq: 0, t: 0, v: 0, current: 0, score: 999 };
  const feasible = Math.abs(chosen.t - torque) < 0.8 && chosen.v <= vMax + 0.2;
  const power = chosen.t * omegaM;
  const regen = power < -20;
  const region = speed < 1700 ? 'constant torque' : chosen.v < vMax * 0.96 ? 'MTPA / transition' : 'field weakening';
  const plot = (value: number) => 110 + (value / (iMax * 1.18)) * 88;
  const pointX = plot(chosen.id);
  const pointY = 110 - (chosen.iq / (iMax * 1.18)) * 88;
  return (
    <LabFrame eyebrow="DRIVE LAB 09" title="Current circle, voltage limit와 operating policy" status={feasible && !regen ? 'OPERATING POINT FEASIBLE' : regen ? 'REGEN · BUS POLICY REQUIRED' : 'REQUEST OUTSIDE ENVELOPE'} danger={!feasible || regen}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Motor type" value={motor} onChange={setMotor} options={[{ value: 'spm', label: 'SPM' }, { value: 'ipm', label: 'IPM' }]} />
          <SegmentedControl label="Current reference policy" value={policy} onChange={setPolicy} options={[{ value: 'id0', label: 'id = 0' }, { value: 'mtpa', label: 'MTPA' }, { value: 'auto', label: 'MTPA + FW' }]} />
          <RangeControl label="Mechanical speed" value={speed} min={0} max={4200} step={100} unit=" rpm" onChange={setSpeed} accent="violet" />
          <RangeControl label="Torque request" value={torque} min={-24} max={28} unit=" N·m" onChange={setTorque} />
          <RangeControl label="DC bus" value={vdc} min={30} max={58} unit=" V" onChange={setVdc} />
          <RangeControl label="Winding/inverter temperature" value={temperature} min={25} max={130} unit="°C" onChange={setTemperature} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border p-3">
          <div className="flex items-center justify-between text-xs"><span className="font-black">d-q current plane</span><span className="font-mono text-muted-foreground">{region}</span></div>
          <svg viewBox="0 0 300 220" role="img" aria-label="Current circle and chosen dq operating point" className="mt-2 block aspect-[300/220] w-full">
            <line x1="20" y1="110" x2="286" y2="110" className="stroke-border" strokeWidth="1" /><line x1="110" y1="14" x2="110" y2="206" className="stroke-border" strokeWidth="1" />
            <circle cx="110" cy="110" r={88 / 1.18} fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5 4" />
            <path d={`M 110 24 Q ${72 - clamp(speed / 100, 0, 30)} 110 110 196`} fill="none" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="3 4" opacity={speed < 200 ? 0.25 : 0.9} />
            <line x1="110" y1="110" x2={pointX} y2={pointY} stroke="#0f766e" strokeWidth="2" strokeLinecap="round" /><circle cx={pointX} cy={pointY} r="4.5" fill={feasible ? '#059669' : '#dc2626'} />
            <text x="270" y="104" className="fill-muted-foreground text-[10px]">id</text><text x="115" y="18" className="fill-muted-foreground text-[10px]">iq</text>
            <text x="16" y="214" className="fill-muted-foreground text-[9px]">circle · current limit</text><text x="284" y="214" textAnchor="end" className="fill-amber-700 text-[9px]">curve · voltage boundary</text>
          </svg>
          <div className="grid gap-2 sm:grid-cols-3">{[['id*', `${fmt(chosen.id)} A`], ['iq*', `${fmt(chosen.iq)} A`], ['voltage', `${fmt(chosen.v)}/${fmt(vMax)} V`]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-muted/[0.1] p-3"><p className="text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>)}</div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Produced torque', value: `${fmt(chosen.t)} N·m` }, { label: 'Current / limit', value: `${fmt(chosen.current)} / ${fmt(iMax)} A` }, { label: 'Mechanical power', value: `${fmt(power / 1000, 2)} kW` }, { label: 'Drive decision', value: regen ? 'BRAKE/BUS GATE' : feasible ? 'ALLOW' : 'DERATE', accent: feasible && !regen }]} /></div>
    </LabFrame>
  );
}

type CommissionStage = 'mapping' | 'sensing' | 'align' | 'openloop' | 'current' | 'envelope';
type CommissionFault = 'none' | 'phase' | 'offset' | 'angle' | 'trip' | 'thermal';

export function CommissioningEvidenceLab() {
  const [stage, setStage] = useState<CommissionStage>('mapping');
  const [fault, setFault] = useState<CommissionFault>('phase');
  const [hardwareTrip, setHardwareTrip] = useState(true);
  const stages: Array<{ id: CommissionStage; label: string; evidence: string }> = [
    { id: 'mapping', label: 'PWM mapping', evidence: 'motor disconnected · scope gate sequence' },
    { id: 'sensing', label: 'Current sense', evidence: 'limited bus · probe/ADC scale and polarity' },
    { id: 'align', label: 'Rotor align', evidence: 'bounded id · encoder zero and direction' },
    { id: 'openloop', label: 'Open loop', evidence: 'low voltage · phase order and rotation' },
    { id: 'current', label: 'Current loop', evidence: 'limited iq step · current response and saturation' },
    { id: 'envelope', label: 'Envelope', evidence: 'speed/load sweep · bus/thermal/fault trip' },
  ];
  const index = stages.findIndex((item) => item.id === stage);
  const faultAt: Record<CommissionFault, number> = { none: 99, phase: 0, offset: 1, angle: 2, trip: 4, thermal: 5 };
  const currentFaultIndex = faultAt[fault];
  const detected = fault === 'none' || index < currentFaultIndex || (index === currentFaultIndex && (fault !== 'trip' || hardwareTrip));
  const advance = fault === 'none' || index < currentFaultIndex;
  const evidence = stages[index];
  return (
    <LabFrame eyebrow="DRIVE LAB 10" title="De-energized mapping에서 full envelope까지 evidence ladder" status={advance ? 'STAGE EVIDENCE PASSES' : detected ? 'FAULT CAUGHT · POWER CLOSED' : 'FAULT ESCAPES TO POWER'} danger={!advance}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Commissioning stage" value={stage} onChange={setStage} options={stages.map((item) => ({ value: item.id, label: item.label }))} />
          <SegmentedControl label="Injected failure" value={fault} onChange={setFault} options={[{ value: 'none', label: '없음' }, { value: 'phase', label: 'Phase map' }, { value: 'offset', label: 'Offset' }, { value: 'angle', label: 'Angle' }, { value: 'trip', label: 'Overcurrent' }, { value: 'thermal', label: 'Thermal' }]} />
          <ToggleRow label="Independent hardware trip armed" note="MCU와 무관하게 gate output 차단" checked={hardwareTrip} onChange={setHardwareTrip} />
          <div className={`rounded-md border p-4 ${advance ? 'border-emerald-500/30 bg-emerald-500/[0.035]' : detected ? 'border-amber-500/30 bg-amber-500/[0.04]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><p className="text-xs font-black">Required physical evidence</p><p className="mt-2 text-sm leading-relaxed">{evidence.evidence}</p></div>
        </div>
        <div className="min-w-0">
          <ol className="grid gap-2 sm:grid-cols-2">
            {stages.map((item, itemIndex) => {
              const active = itemIndex === index;
              const passed = itemIndex < currentFaultIndex || fault === 'none';
              const blocked = itemIndex >= currentFaultIndex && fault !== 'none';
              return <li key={item.id} className={`min-w-0 rounded-md border p-3 ${active ? 'border-violet-500/35 bg-violet-500/[0.04]' : 'border-border'} ${blocked && active ? 'border-red-500/35 bg-red-500/[0.04]' : ''}`}><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] font-black text-muted-foreground">{String(itemIndex + 1).padStart(2, '0')}</span>{passed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : blocked ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <span className="h-4 w-4 rounded-full border border-border" />}</div><p className="mt-2 text-xs font-black">{item.label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.evidence}</p></li>;
            })}
          </ol>
          <div className={`mt-3 flex items-center gap-3 rounded-md border p-4 ${advance ? 'border-emerald-500/30' : 'border-red-500/30'}`}>{advance ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <Power className="h-5 w-5 text-red-600" />}<div><p className="text-sm font-black">Power envelope {advance ? 'may advance one stage' : 'must remain closed'}</p><p className="mt-1 text-xs text-muted-foreground">Command echo는 이 판정을 대신하지 않습니다.</p></div></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Selected stage', value: `${index + 1} / ${stages.length}` }, { label: 'Fault location', value: fault === 'none' ? 'none' : stages[Math.min(currentFaultIndex, stages.length - 1)].label }, { label: 'Independent trip', value: hardwareTrip ? 'ARMED' : 'OFF' }, { label: 'Advance gate', value: advance ? 'OPEN' : 'CLOSED', accent: advance }]} /></div>
    </LabFrame>
  );
}

export function MotorDriveRuntimeStrip() {
  const stages = [
    { icon: Gauge, label: 'torque', note: 'N·m · limit · identity' },
    { icon: Magnet, label: 'd-q current', note: 'flux · torque · angle' },
    { icon: SlidersHorizontal, label: 'd-q voltage', note: 'PI · decouple · limit' },
    { icon: Waves, label: 'SVPWM', note: 'sector · dwell · duty' },
    { icon: Zap, label: 'inverter', note: 'gate · phase voltage' },
    { icon: Activity, label: 'evidence', note: 'current · torque · heat' },
  ];
  return (
    <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 xl:grid-cols-6">
      {stages.map((stage, index) => <div key={stage.label} className="min-w-0 bg-background p-4"><div className="flex items-center justify-between"><stage.icon className="h-4 w-4 text-teal-600" /><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span></div><p className="mt-3 text-xs font-black">{stage.label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p></div>)}
    </div>
  );
}

export function MotorDriveFailureLegend() {
  return (
    <div className="not-prose my-7 grid gap-2 sm:grid-cols-3">
      {[
        { icon: RotateCw, label: 'Frame contract', note: 'pole pair · zero · sign · phase order', tone: 'text-violet-600' },
        { icon: Radar, label: 'Observable sample', note: 'offset · gain · settling · PWM window', tone: 'text-blue-600' },
        { icon: CircuitBoard, label: 'Physical evidence', note: 'gate · current · bus · thermal · trip', tone: 'text-emerald-600' },
      ].map((item) => <div key={item.label} className="rounded-md border border-border p-4"><item.icon className={`h-5 w-5 ${item.tone}`} /><p className="mt-3 text-sm font-black">{item.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p></div>)}
    </div>
  );
}

export function MotorDriveEvidenceStrip() {
  return (
    <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {[
        { icon: Gauge, label: 'command', value: 'torque/current reference', tone: 'text-violet-600' },
        { icon: Zap, label: 'power stage', value: 'PWM/gate/phase voltage', tone: 'text-amber-600' },
        { icon: Activity, label: 'electrical', value: 'phase and d-q current', tone: 'text-teal-600' },
        { icon: Thermometer, label: 'physical', value: 'torque/speed/bus/heat', tone: 'text-emerald-600' },
      ].map((item) => <div key={item.label} className="min-w-0 bg-background p-4"><item.icon className={`h-4 w-4 ${item.tone}`} /><p className="mt-3 text-xs font-black">{item.label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.value}</p></div>)}
    </div>
  );
}
