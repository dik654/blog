import { useState, type ReactNode } from 'react';
import {
  Activity,
  BatteryCharging,
  CheckCircle2,
  CircleGauge,
  Factory,
  Gauge,
  GitBranch,
  Power,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function EnergyLabFrame({ index, title, status, danger = false, icon, children }: { index: string; title: string; status: string; danger?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300">{icon} ENERGY LAB {index}</span>
        <strong className="min-w-0 text-sm leading-snug">{title}</strong>
        <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function RangeControl({ label, value, min, max, step = 1, unit, onChange, accent = 'blue' }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void; accent?: 'blue' | 'teal' | 'violet' | 'amber' }) {
  const accentClass = accent === 'teal' ? 'accent-teal-600' : accent === 'violet' ? 'accent-violet-600' : accent === 'amber' ? 'accent-amber-600' : 'accent-blue-600';
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono text-foreground">{value}{unit}</span></span>
      <input className={`h-2 w-full cursor-pointer ${accentClass}`} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function StatusStrip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'amber' | 'red' | 'green' | 'blue' }) {
  const classes = {
    neutral: 'border-border bg-muted/[0.12]',
    amber: 'border-amber-500/30 bg-amber-500/[0.045]',
    red: 'border-red-500/30 bg-red-500/[0.045]',
    green: 'border-emerald-500/30 bg-emerald-500/[0.045]',
    blue: 'border-blue-500/30 bg-blue-500/[0.04]',
  }[tone];
  return <div className={`rounded-md border p-3 text-xs leading-relaxed ${classes}`}>{children}</div>;
}

function EnergyBar({ label, value, max, color, suffix = 'J' }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const width = clamp(Math.abs(value) / Math.max(max, 1) * 100, value === 0 ? 0 : 2, 100);
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{label}</span><span className="shrink-0 font-mono text-muted-foreground">{fmt(value, 1)} {suffix}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} /></div>
    </div>
  );
}

type BrakeMode = 'coast' | 'dynamic' | 'regen' | 'resistor';

export function BrakingEnergyContractLab() {
  const [mode, setMode] = useState<BrakeMode>('regen');
  const [speed, setSpeed] = useState(1800);
  const [torque, setTorque] = useState(16);
  const mechanicalKw = torque * speed * 2 * Math.PI / 60 / 1000;
  const modes = {
    coast: { destination: 'bearing·air·load loss', bus: 'bus 거의 분리', heat: 'mechanics', stop: '느리고 load 의존', safe: false },
    dynamic: { destination: 'motor copper + inverter', bus: 'source로 거의 안 감', heat: 'motor / MOSFET', stop: '저속에서 약해짐', safe: mechanicalKw < 3.5 },
    regen: { destination: 'battery / source / common bus', bus: `−${fmt(mechanicalKw * 0.92, 2)} kW`, heat: 'sink contract', stop: 'torque-controlled', safe: mechanicalKw < 5.5 },
    resistor: { destination: 'brake resistor', bus: `${fmt(mechanicalKw * 0.95, 2)} kW dump`, heat: 'resistor enclosure', stop: 'sink가 있으면 유지', safe: mechanicalKw < 7 },
  }[mode];
  const nodes = [
    { label: 'ROBOT LOAD', detail: `${fmt(speed, 0)} rpm · ${fmt(torque, 0)} N·m`, active: true, tone: 'border-blue-500/35 bg-blue-500/[0.035]' },
    { label: 'MOTOR / INVERTER', detail: mode === 'coast' ? 'high-Z current decay' : mode === 'dynamic' ? 'phase short / loss' : 'negative electrical power', active: mode !== 'coast', tone: 'border-violet-500/35 bg-violet-500/[0.035]' },
    { label: 'DC LINK', detail: mode === 'dynamic' || mode === 'coast' ? 'no guaranteed export' : modes.bus, active: mode === 'regen' || mode === 'resistor', tone: 'border-amber-500/35 bg-amber-500/[0.035]' },
    { label: 'ENERGY DESTINATION', detail: modes.destination, active: mode !== 'coast', tone: modes.safe ? 'border-emerald-500/35 bg-emerald-500/[0.035]' : 'border-red-500/35 bg-red-500/[0.035]' },
  ];
  return (
    <EnergyLabFrame index="01" icon={<Power className="h-4 w-4" />} title="Stop mode마다 실제 energy destination을 분리하기" status={modes.safe ? 'DESTINATION BOUNDED' : 'STOP CONTRACT INCOMPLETE'} danger={!modes.safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Stop method" value={mode} onChange={setMode} options={[{ value: 'coast', label: 'Coast' }, { value: 'dynamic', label: 'Dynamic' }, { value: 'regen', label: 'Regen' }, { value: 'resistor', label: 'Resistor' }]} />
          <RangeControl label="Mechanical speed" value={speed} min={200} max={3600} step={100} unit=" rpm" onChange={setSpeed} />
          <RangeControl label="Braking torque" value={torque} min={2} max={30} unit=" N·m" onChange={setTorque} accent="violet" />
          <StatusStrip tone={modes.safe ? 'green' : 'amber'}><strong>{modes.stop}</strong><br /><span className="text-muted-foreground">PWM off, negative torque, motion stop, bus absorption과 holding은 서로 다른 상태다.</span></StatusStrip>
        </div>
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-4">
            {nodes.map((node, index) => <div key={node.label} className={`relative min-w-0 rounded-md border p-3 ${node.tone} ${node.active ? '' : 'opacity-45'}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><p className="mt-3 text-[11px] font-black">{node.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{node.detail}</p>{index < nodes.length - 1 && <span className="absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2 bg-background px-1 text-xs text-muted-foreground sm:-right-2.5 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0">→</span>}</div>)}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">MECHANICAL POWER</p><p className="mt-1 font-mono text-sm font-bold">{fmt(mechanicalKw, 2)} kW</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">THERMAL OWNER</p><p className="mt-1 text-xs font-bold">{modes.heat}</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">MOTION RESULT</p><p className="mt-1 text-xs font-bold">{modes.stop}</p></div></div>
        </div>
      </div>
    </EnergyLabFrame>
  );
}

type EnergyScenario = 'joint' | 'lift' | 'combined';

export function MechanicalEnergyInventoryLab() {
  const [scenario, setScenario] = useState<EnergyScenario>('combined');
  const [inertia, setInertia] = useState(0.18);
  const [speed, setSpeed] = useState(1500);
  const [payload, setPayload] = useState(12);
  const [drop, setDrop] = useState(0.35);
  const [stopTime, setStopTime] = useState(0.55);
  const omega = speed * 2 * Math.PI / 60;
  const rotational = scenario === 'lift' ? 0 : 0.5 * inertia * omega ** 2;
  const gravity = scenario === 'joint' ? 0 : payload * 9.81 * drop;
  const spring = scenario === 'combined' ? 0.5 * 1200 * 0.045 ** 2 : 0;
  const total = rotational + gravity + spring;
  const averagePower = total / stopTime / 1000;
  const peakPower = averagePower * 1.8;
  const maxTerm = Math.max(rotational, gravity, spring, 1);
  return (
    <EnergyLabFrame index="02" icon={<CircleGauge className="h-4 w-4" />} title="Motor label보다 먼저 mechanical energy ledger 만들기" status={peakPower < 8 ? 'INVENTORY BOUNDED' : 'HIGH PEAK POWER'} danger={peakPower >= 8}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Load scenario" value={scenario} onChange={setScenario} options={[{ value: 'joint', label: 'Rotary joint' }, { value: 'lift', label: 'Vertical lift' }, { value: 'combined', label: 'Combined' }]} />
          <RangeControl label="Reflected inertia" value={inertia} min={0.04} max={0.4} step={0.01} unit=" kg·m²" onChange={setInertia} />
          <RangeControl label="Initial motor speed" value={speed} min={300} max={3000} step={100} unit=" rpm" onChange={setSpeed} accent="violet" />
          <RangeControl label="Payload mass" value={payload} min={2} max={30} unit=" kg" onChange={setPayload} accent="amber" />
          <RangeControl label="Downward travel" value={drop} min={0.05} max={0.8} step={0.05} unit=" m" onChange={setDrop} accent="amber" />
          <RangeControl label="Requested stop time" value={stopTime} min={0.15} max={2} step={0.05} unit=" s" onChange={setStopTime} accent="teal" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4 sm:p-5">
          <p className="text-[10px] font-black text-muted-foreground">ENERGY INVENTORY · SAME SYSTEM BOUNDARY</p>
          <div className="mt-5 space-y-5">
            <EnergyBar label="Rotational kinetic" value={rotational} max={maxTerm} color="bg-blue-600" />
            <EnergyBar label="Payload potential" value={gravity} max={maxTerm} color="bg-amber-500" />
            <EnergyBar label="Elastic release" value={spring} max={maxTerm} color="bg-violet-500" />
          </div>
          <div className="mt-6 border-t border-border pt-4"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold text-muted-foreground">TOTAL RELEASED</p><p className="mt-1 font-mono text-3xl font-black">{fmt(total, 0)} J</p></div><div className="text-right"><p className="text-xs font-bold text-muted-foreground">PEAK PROXY</p><p className={`mt-1 font-mono text-xl font-black ${peakPower >= 8 ? 'text-red-600' : 'text-teal-700'}`}>{fmt(peakPower, 2)} kW</p></div></div></div>
          <StatusStrip tone="blue"><strong>Reflected inertia는 한 번만 센다.</strong><br /><span className="text-muted-foreground">Motor-side `J_eq`에 gearbox/load가 이미 반영됐다면 payload rotational term을 다시 더하지 않는다.</span></StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Released energy', value: `${fmt(total, 0)} J` }, { label: 'Average brake power', value: `${fmt(averagePower, 2)} kW` }, { label: 'Peak proxy', value: `${fmt(peakPower, 2)} kW` }, { label: 'Dominant term', value: rotational >= gravity && rotational >= spring ? 'ROTATION' : gravity >= spring ? 'GRAVITY' : 'SPRING', accent: peakPower < 8 }]} /></div>
    </EnergyLabFrame>
  );
}

type Quadrant = 'q1' | 'q2' | 'q3' | 'q4';

export function FourQuadrantBrakingLab() {
  const [quadrant, setQuadrant] = useState<Quadrant>('q2');
  const [speed, setSpeed] = useState(120);
  const [torque, setTorque] = useState(22);
  const [stopTime, setStopTime] = useState(0.8);
  const sign = { q1: { w: 1, t: 1 }, q2: { w: 1, t: -1 }, q3: { w: -1, t: -1 }, q4: { w: -1, t: 1 } }[quadrant];
  const powerKw = sign.w * speed * sign.t * torque / 1000;
  const braking = powerKw < 0;
  const energy = Math.abs(powerKw) * stopTime * 1000 * 0.55;
  const x = 180 + sign.w * clamp(speed, 20, 180) * 0.75;
  const y = 140 - sign.t * clamp(torque, 4, 40) * 2.4;
  const trace = Array.from({ length: 24 }, (_, index) => {
    const t = index / 23;
    const p = powerKw * (1 - t);
    return `${34 + t * 292},${204 - (p + 5) / 10 * 120}`;
  }).join(' ');
  return (
    <EnergyLabFrame index="03" icon={<Activity className="h-4 w-4" />} title="Torque·speed sign과 stop profile을 함께 읽기" status={braking ? 'GENERATOR QUADRANT' : 'MOTORING QUADRANT'} danger={!braking}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Operating quadrant" value={quadrant} onChange={setQuadrant} options={[{ value: 'q1', label: 'Q1 +ω +T' }, { value: 'q2', label: 'Q2 +ω −T' }, { value: 'q3', label: 'Q3 −ω −T' }, { value: 'q4', label: 'Q4 −ω +T' }]} />
          <RangeControl label="Speed magnitude" value={speed} min={20} max={180} step={5} unit=" rad/s" onChange={setSpeed} />
          <RangeControl label="Torque magnitude" value={torque} min={4} max={40} unit=" N·m" onChange={setTorque} accent="violet" />
          <RangeControl label="Stop interval" value={stopTime} min={0.2} max={2} step={0.1} unit=" s" onChange={setStopTime} accent="amber" />
          <StatusStrip tone={braking ? 'green' : 'amber'}><strong>{braking ? 'Torque와 speed의 부호가 반대다.' : 'Torque와 speed의 부호가 같다.'}</strong><br /><span className="text-muted-foreground">`i_q&lt;0`만으로 braking을 정의하지 않는다. Rotor direction과 torque convention을 함께 기록한다.</span></StatusStrip>
        </div>
        <div className="min-w-0 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-muted/[0.06] p-3"><p className="text-[10px] font-black text-muted-foreground">TORQUE-SPEED MAP</p><svg viewBox="0 0 360 280" className="mt-2 block aspect-[360/280] w-full" role="img" aria-label="Four quadrant torque speed operating point"><line x1="24" y1="140" x2="336" y2="140" className="stroke-border" /><line x1="180" y1="22" x2="180" y2="258" className="stroke-border" /><text x="310" y="132" className="fill-muted-foreground text-[9px]">+ω</text><text x="187" y="34" className="fill-muted-foreground text-[9px]">+T</text><text x="250" y="65" className="fill-muted-foreground text-[9px] font-bold">Q1 motor</text><text x="54" y="65" className="fill-teal-700 text-[9px] font-bold">Q2 generator</text><text x="50" y="225" className="fill-muted-foreground text-[9px] font-bold">Q3 motor</text><text x="248" y="225" className="fill-teal-700 text-[9px] font-bold">Q4 generator</text><line x1="180" y1="140" x2={x} y2={y} stroke={braking ? '#0f766e' : '#2563eb'} strokeWidth="2" /><circle cx={x} cy={y} r="7" fill={braking ? '#0f766e' : '#2563eb'} /><text x={clamp(x + 10, 30, 300)} y={clamp(y - 10, 20, 260)} className="fill-foreground text-[10px] font-bold">{quadrant.toUpperCase()}</text></svg></div>
          <div className="rounded-md border border-border bg-muted/[0.06] p-3"><p className="text-[10px] font-black text-muted-foreground">SIGNED POWER DURING RAMP</p><svg viewBox="0 0 360 250" className="mt-2 block aspect-[360/250] w-full" role="img" aria-label="Signed mechanical power over stop interval"><line x1="34" y1="144" x2="326" y2="144" className="stroke-border" /><line x1="34" y1="24" x2="34" y2="204" className="stroke-border" /><polyline points={trace} fill="none" stroke={braking ? '#0f766e' : '#2563eb'} strokeWidth="2" strokeLinejoin="round" /><text x="38" y="22" className="fill-muted-foreground text-[9px]">+ power</text><text x="38" y="221" className="fill-muted-foreground text-[9px]">− power</text><text x="276" y="238" className="fill-muted-foreground text-[9px]">time</text></svg><div className="border-t border-border pt-3"><p className="font-mono text-lg font-black">{powerKw > 0 ? '+' : ''}{fmt(powerKw, 2)} kW</p><p className="mt-1 text-xs text-muted-foreground">초기 operating point의 signed mechanical power</p></div></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Quadrant', value: quadrant.toUpperCase() }, { label: 'Signed power', value: `${powerKw > 0 ? '+' : ''}${fmt(powerKw, 2)} kW` }, { label: 'Released energy proxy', value: `${fmt(energy, 0)} J` }, { label: 'Energy direction', value: braking ? 'SHAFT → DC' : 'DC → SHAFT', accent: braking }]} /></div>
    </EnergyLabFrame>
  );
}

export function BusHeadroomLab() {
  const [capacitance, setCapacitance] = useState(2200);
  const [initialBus, setInitialBus] = useState(50);
  const [actionBus, setActionBus] = useState(56);
  const [maxBus, setMaxBus] = useState(60);
  const [regenPower, setRegenPower] = useState(5);
  const capF = capacitance * 1e-6;
  const headroomJ = Math.max(0, 0.5 * capF * (actionBus ** 2 - initialBus ** 2));
  const limitJ = Math.max(0, 0.5 * capF * (maxBus ** 2 - initialBus ** 2));
  const actionMs = regenPower > 0 ? headroomJ / (regenPower * 1000) * 1000 : Infinity;
  const maxMs = regenPower > 0 ? limitJ / (regenPower * 1000) * 1000 : Infinity;
  const safe = actionBus > initialBus && maxBus > actionBus && actionMs >= 1;
  const points = Array.from({ length: 32 }, (_, index) => {
    const tMs = index / 31 * Math.max(maxMs * 1.2, 8);
    const energy = 0.5 * capF * initialBus ** 2 + regenPower * tMs;
    const voltage = Math.sqrt(2 * energy / capF);
    return `${30 + index / 31 * 310},${202 - clamp((voltage - 45) / 20, 0, 1.2) * 150}`;
  }).join(' ');
  const yFor = (voltage: number) => 202 - clamp((voltage - 45) / 20, 0, 1.2) * 150;
  return (
    <EnergyLabFrame index="04" icon={<BatteryCharging className="h-4 w-4" />} title="DC-link capacitor가 사 주는 milliseconds 계산하기" status={safe ? 'ACTION WINDOW EXISTS' : 'NO CONTROL HEADROOM'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="DC-link capacitance" value={capacitance} min={500} max={6000} step={100} unit=" µF" onChange={setCapacitance} />
          <RangeControl label="Initial bus" value={initialBus} min={42} max={57} unit=" V" onChange={setInitialBus} accent="teal" />
          <RangeControl label="Software action threshold" value={actionBus} min={48} max={59} unit=" V" onChange={setActionBus} accent="amber" />
          <RangeControl label="Hardware maximum boundary" value={maxBus} min={52} max={64} unit=" V" onChange={setMaxBus} accent="violet" />
          <RangeControl label="Unabsorbed regen power" value={regenPower} min={0.5} max={12} step={0.5} unit=" kW" onChange={setRegenPower} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-black text-muted-foreground">BUS RISE · CONSTANT EXCESS POWER MODEL</p><p className="mt-1 text-sm font-black">Capacitor는 sink가 아니라 deadline buffer</p></div><span className={`font-mono text-sm font-black ${safe ? 'text-teal-700' : 'text-red-600'}`}>{fmt(actionMs, 2)} ms</span></div>
          <svg viewBox="0 0 380 240" className="mt-3 block aspect-[380/240] w-full" role="img" aria-label="DC bus voltage rise to action and maximum thresholds"><line x1="30" y1="202" x2="340" y2="202" className="stroke-border" /><line x1="30" y1="28" x2="30" y2="202" className="stroke-border" /><line x1="30" y1={yFor(actionBus)} x2="340" y2={yFor(actionBus)} stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" /><line x1="30" y1={yFor(maxBus)} x2="340" y2={yFor(maxBus)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4 4" /><polyline points={points} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinejoin="round" /><text x="36" y={yFor(actionBus) - 5} className="fill-amber-700 text-[9px] font-bold">action {actionBus} V</text><text x="36" y={yFor(maxBus) - 5} className="fill-red-600 text-[9px] font-bold">max {maxBus} V</text><text x="294" y="222" className="fill-muted-foreground text-[9px]">milliseconds</text><text x="5" y="28" className="fill-muted-foreground text-[9px]">Vdc</text></svg>
          <StatusStrip tone={safe ? 'amber' : 'red'}>Action threshold는 torque derating이나 chopper가 반응할 시점이다. Hardware maximum과 같게 두면 sensing, computation, switch delay와 overshoot를 위한 margin이 없다.</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Energy to action', value: `${fmt(headroomJ, 2)} J` }, { label: 'Action window', value: `${fmt(actionMs, 2)} ms` }, { label: 'Energy to max', value: `${fmt(limitJ, 2)} J` }, { label: 'Absolute window', value: `${fmt(maxMs, 2)} ms`, accent: safe }]} /></div>
    </EnergyLabFrame>
  );
}

type SourceMode = 'battery' | 'bench' | 'bidirectional';

export function EnergySinkAllocatorLab() {
  const [regenPower, setRegenPower] = useState(7);
  const [sourceMode, setSourceMode] = useState<SourceMode>('battery');
  const [batteryAcceptance, setBatteryAcceptance] = useState(3);
  const [peerDemand, setPeerDemand] = useState(1.5);
  const [chopperAvailable, setChopperAvailable] = useState(true);
  const sourceCapacity = sourceMode === 'battery' ? batteryAcceptance : sourceMode === 'bidirectional' ? 5 : 0;
  const sourceTaken = Math.min(regenPower, sourceCapacity);
  const peerTaken = Math.min(Math.max(0, regenPower - sourceTaken), peerDemand);
  const chopperCapacity = chopperAvailable ? 4 : 0;
  const chopperTaken = Math.min(Math.max(0, regenPower - sourceTaken - peerTaken), chopperCapacity);
  const excess = Math.max(0, regenPower - sourceTaken - peerTaken - chopperTaken);
  const safe = excess < 0.01;
  const allocations = [
    { label: 'Source / battery', value: sourceTaken, color: 'bg-blue-600' },
    { label: 'Peer axes', value: peerTaken, color: 'bg-teal-600' },
    { label: 'Brake resistor', value: chopperTaken, color: 'bg-violet-600' },
    { label: 'Unassigned', value: excess, color: 'bg-red-600' },
  ];
  return (
    <EnergyLabFrame index="05" icon={<GitBranch className="h-4 w-4" />} title="Runtime에 실제로 가능한 sink만 합산하기" status={safe ? 'ALL POWER ASSIGNED' : 'EXCESS ENERGY'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Connected source" value={sourceMode} onChange={setSourceMode} options={[{ value: 'battery', label: 'Battery + BMS' }, { value: 'bench', label: 'Bench supply' }, { value: 'bidirectional', label: 'Bidirectional' }]} />
          <RangeControl label="Returned mechanical/DC power" value={regenPower} min={1} max={12} step={0.5} unit=" kW" onChange={setRegenPower} />
          <RangeControl label="BMS charge allowance" value={batteryAcceptance} min={0} max={8} step={0.5} unit=" kW" onChange={setBatteryAcceptance} accent="teal" />
          <RangeControl label="Measured peer-axis demand" value={peerDemand} min={0} max={6} step={0.5} unit=" kW" onChange={setPeerDemand} accent="amber" />
          <SegmentedControl label="Brake chopper state" value={chopperAvailable ? 'ready' : 'failed'} onChange={(value) => setChopperAvailable(value === 'ready')} options={[{ value: 'ready', label: 'Ready · 4 kW' }, { value: 'failed', label: 'Unavailable' }]} />
          <StatusStrip tone={sourceMode === 'bench' ? 'amber' : safe ? 'green' : 'red'}>{sourceMode === 'bench' ? '일반 bench supply는 source일 뿐 reverse current sink가 아닐 수 있다.' : sourceMode === 'battery' ? 'Battery connection만으로 현재 charge acceptance를 보장하지 않는다.' : 'Bidirectional rating도 voltage/current/thermal state 안에서만 유효하다.'}</StatusStrip>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">MEASURED SINK ALLOCATION</p><p className="mt-1 text-sm font-black">{fmt(regenPower, 1)} kW returned at this instant</p></div><BatteryCharging className={`h-5 w-5 ${safe ? 'text-teal-600' : 'text-red-600'}`} /></div>
          <div className="mt-6 space-y-5">{allocations.map((item) => <div key={item.label}><div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{item.label}</span><span className="font-mono text-muted-foreground">{fmt(item.value, 2)} kW</span></div><div className="h-3 overflow-hidden rounded-full bg-background"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${clamp(item.value / regenPower * 100, item.value ? 2 : 0, 100)}%` }} /></div></div>)}</div>
          <div className={`mt-6 rounded-md border p-4 ${safe ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><p className="text-xs font-black">{safe ? '현재 stop power가 실제 sink 안에 있다.' : `${fmt(excess, 2)} kW를 trajectory가 줄이거나 별도 sink가 받아야 한다.`}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Forecast peer demand는 표시할 수 있지만 guaranteed sink 계산에는 measured/contracted capacity만 넣는다.</p></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Returned power', value: `${fmt(regenPower, 1)} kW` }, { label: 'Source accepted', value: `${fmt(sourceTaken, 1)} kW` }, { label: 'Local dump', value: `${fmt(chopperTaken, 1)} kW` }, { label: 'Unassigned excess', value: `${fmt(excess, 2)} kW`, accent: safe }]} /></div>
    </EnergyLabFrame>
  );
}

export function BrakeChopperFeasibilityLab() {
  const [onVoltage, setOnVoltage] = useState(56);
  const [requiredPower, setRequiredPower] = useState(5);
  const [switchCurrent, setSwitchCurrent] = useState(110);
  const [resistance, setResistance] = useState(0.75);
  const [pulseMs, setPulseMs] = useState(500);
  const [repeatSec, setRepeatSec] = useState(8);
  const rMin = onVoltage / switchCurrent;
  const rMax = onVoltage ** 2 / (requiredPower * 1000);
  const instantaneousPower = onVoltage ** 2 / resistance / 1000;
  const current = onVoltage / resistance;
  const duty = clamp(requiredPower / Math.max(instantaneousPower, 0.01), 0, 1.5);
  const pulseEnergy = instantaneousPower * 1000 * pulseMs / 1000 * Math.min(duty, 1);
  const averagePower = pulseEnergy / repeatSec;
  const estimatedRise = averagePower * 0.055 + pulseEnergy * 0.008;
  const electricalFeasible = rMin <= rMax && resistance >= rMin && resistance <= rMax && duty <= 1;
  const thermalFeasible = estimatedRise < 150;
  const safe = electricalFeasible && thermalFeasible;
  const minX = 40;
  const maxX = 340;
  const scaleR = (r: number) => minX + clamp(r / 2, 0, 1) * (maxX - minX);
  return (
    <EnergyLabFrame index="06" icon={<Thermometer className="h-4 w-4" />} title="Current·power·pulse energy가 겹치는 resistor feasibility band" status={safe ? 'R / PULSE FEASIBLE' : 'DESIGN INTERVAL VIOLATED'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Chopper turn-on voltage" value={onVoltage} min={48} max={62} unit=" V" onChange={setOnVoltage} accent="amber" />
          <RangeControl label="Required average brake power" value={requiredPower} min={1} max={10} step={0.5} unit=" kW" onChange={setRequiredPower} />
          <RangeControl label="Allowed chopper current" value={switchCurrent} min={40} max={180} step={5} unit=" A" onChange={setSwitchCurrent} accent="violet" />
          <RangeControl label="Selected resistance" value={resistance} min={0.25} max={2} step={0.05} unit=" Ω" onChange={setResistance} accent="teal" />
          <RangeControl label="Brake pulse" value={pulseMs} min={50} max={2000} step={50} unit=" ms" onChange={setPulseMs} accent="amber" />
          <RangeControl label="Repeat period" value={repeatSec} min={1} max={30} unit=" s" onChange={setRepeatSec} />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <p className="text-[10px] font-black text-muted-foreground">FIRST-ORDER RESISTANCE WINDOW</p>
          <svg viewBox="0 0 380 170" className="mt-3 block aspect-[380/170] w-full" role="img" aria-label="Brake resistor feasible interval"><line x1={minX} y1="86" x2={maxX} y2="86" className="stroke-border" strokeWidth="4" strokeLinecap="round" /><line x1={scaleR(rMin)} y1="86" x2={scaleR(rMax)} y2="86" stroke={rMin <= rMax ? '#0f766e' : '#dc2626'} strokeWidth="10" strokeLinecap="round" /><line x1={scaleR(resistance)} y1="46" x2={scaleR(resistance)} y2="122" stroke={safe ? '#2563eb' : '#dc2626'} strokeWidth="2" /><circle cx={scaleR(resistance)} cy="86" r="7" fill={safe ? '#2563eb' : '#dc2626'} /><text x={clamp(scaleR(rMin), 34, 300)} y="139" className="fill-muted-foreground text-[9px]">Rmin {fmt(rMin, 2)} Ω</text><text x={clamp(scaleR(rMax) - 50, 45, 310)} y="32" className="fill-muted-foreground text-[9px]">Rmax {fmt(rMax, 2)} Ω</text><text x="38" y="160" className="fill-muted-foreground text-[9px]">more current</text><text x="280" y="160" className="fill-muted-foreground text-[9px]">less power</text></svg>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">INSTANTANEOUS</p><p className="mt-1 font-mono text-sm font-bold">{fmt(current, 1)} A · {fmt(instantaneousPower, 2)} kW</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">PULSE / REPEAT</p><p className="mt-1 font-mono text-sm font-bold">{fmt(pulseEnergy, 0)} J · {fmt(averagePower, 0)} W avg</p></div></div>
          <StatusStrip tone={safe ? 'green' : 'red'}>{rMin > rMax ? 'Current limit와 required power가 만드는 interval 자체가 비었다.' : !electricalFeasible ? 'Selected R이 current/power interval 밖이다.' : !thermalFeasible ? 'Electrical interval은 맞지만 repeated pulse thermal state가 실패한다.' : 'Electrical window와 simplified repeated-pulse thermal gate를 모두 통과한다.'}</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Feasible R range', value: `${fmt(rMin, 2)}–${fmt(rMax, 2)} Ω` }, { label: 'Selected chopper duty', value: `${fmt(duty * 100, 0)}%` }, { label: 'Pulse energy', value: `${fmt(pulseEnergy, 0)} J` }, { label: 'Thermal rise proxy', value: `${fmt(estimatedRise, 0)} °C`, accent: safe }]} /></div>
    </EnergyLabFrame>
  );
}

export function CommonBusArbitrationLab() {
  const [axisA, setAxisA] = useState(-4);
  const [axisB, setAxisB] = useState(2);
  const [axisC, setAxisC] = useState(-1.5);
  const [axisD, setAxisD] = useState(1);
  const [batterySink, setBatterySink] = useState(1.5);
  const [useForecast, setUseForecast] = useState(false);
  const axes = [axisA, axisB, axisC, axisD];
  const measuredNet = axes.reduce((sum, value) => sum + value, 0);
  const forecastCredit = useForecast ? 1.5 : 0;
  const netWithForecast = measuredNet + forecastCredit;
  const regenTotal = axes.filter((value) => value < 0).reduce((sum, value) => sum + Math.abs(value), 0);
  const motorTotal = axes.filter((value) => value > 0).reduce((sum, value) => sum + value, 0);
  const reuse = Math.min(regenTotal, motorTotal);
  const sourceExcess = Math.max(0, -(useForecast ? netWithForecast : measuredNet) - batterySink);
  const safe = sourceExcess <= 0.01 && !useForecast;
  return (
    <EnergyLabFrame index="07" icon={<Factory className="h-4 w-4" />} title="Multi-axis common bus에서 measured power만 재사용하기" status={safe ? 'NET BUS BOUNDED' : useForecast ? 'FORECAST IS NOT A SINK' : 'LOCAL DUMP REQUIRED'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Axis A signed DC power" value={axisA} min={-6} max={6} step={0.5} unit=" kW" onChange={setAxisA} />
          <RangeControl label="Axis B signed DC power" value={axisB} min={-6} max={6} step={0.5} unit=" kW" onChange={setAxisB} accent="teal" />
          <RangeControl label="Axis C signed DC power" value={axisC} min={-6} max={6} step={0.5} unit=" kW" onChange={setAxisC} accent="violet" />
          <RangeControl label="Axis D signed DC power" value={axisD} min={-6} max={6} step={0.5} unit=" kW" onChange={setAxisD} accent="amber" />
          <RangeControl label="Battery/source sink allowance" value={batterySink} min={0} max={6} step={0.5} unit=" kW" onChange={setBatterySink} accent="teal" />
          <SegmentedControl label="Peer demand input" value={useForecast ? 'forecast' : 'measured'} onChange={(value) => setUseForecast(value === 'forecast')} options={[{ value: 'measured', label: 'Measured only' }, { value: 'forecast', label: '+ forecast credit' }]} />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">COMMON DC · + MOTORING / − REGEN</p><p className="mt-1 text-sm font-black">One bus, four independent axis states</p></div><GitBranch className="h-5 w-5 text-teal-600" /></div>
          <div className="mt-5 space-y-3">{axes.map((value, index) => <div key={index} className="grid grid-cols-[4rem_minmax(0,1fr)_4.5rem] items-center gap-3"><span className="text-xs font-black">AXIS {String.fromCharCode(65 + index)}</span><div className="relative h-4 rounded-full bg-background"><div className="absolute left-1/2 top-0 h-full w-px bg-border" />{value >= 0 ? <div className="absolute left-1/2 top-1 h-2 rounded-r-full bg-blue-600" style={{ width: `${Math.abs(value) / 6 * 48}%` }} /> : <div className="absolute right-1/2 top-1 h-2 rounded-l-full bg-amber-500" style={{ width: `${Math.abs(value) / 6 * 48}%` }} />}</div><span className={`text-right font-mono text-xs font-bold ${value < 0 ? 'text-amber-700' : 'text-blue-700'}`}>{value > 0 ? '+' : ''}{fmt(value, 1)} kW</span></div>)}</div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">DIRECT REUSE</p><p className="mt-1 font-mono text-sm font-bold">{fmt(reuse, 1)} kW</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">MEASURED NET</p><p className="mt-1 font-mono text-sm font-bold">{measuredNet > 0 ? '+' : ''}{fmt(measuredNet, 1)} kW</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">EXCESS TO DUMP</p><p className={`mt-1 font-mono text-sm font-bold ${sourceExcess > 0 ? 'text-red-600' : 'text-teal-700'}`}>{fmt(sourceExcess, 1)} kW</p></div></div>
          <StatusStrip tone={useForecast ? 'red' : safe ? 'green' : 'amber'}>{useForecast ? '예측된 motoring power는 아직 흐르지 않으므로 guaranteed sink에서 제외한다.' : safe ? 'Measured motoring demand와 source allowance가 current net regeneration을 흡수한다.' : 'All-axes braking worst case를 위한 local chopper 또는 trajectory limit이 필요하다.'}</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Total regeneration', value: `${fmt(regenTotal, 1)} kW` }, { label: 'Peer reuse', value: `${fmt(reuse, 1)} kW` }, { label: 'Measured bus sum', value: `${measuredNet > 0 ? '+' : ''}${fmt(measuredNet, 1)} kW` }, { label: 'Uncovered power', value: `${fmt(sourceExcess, 1)} kW`, accent: safe }]} /></div>
    </EnergyLabFrame>
  );
}

type PowerState = 'isolated' | 'precharge' | 'ready' | 'run' | 'isolate' | 'discharged';
type ContactorFault = 'none' | 'open' | 'load' | 'welded' | 'bleed';

export function PowerContactorStateLab() {
  const [state, setState] = useState<PowerState>('precharge');
  const [fault, setFault] = useState<ContactorFault>('none');
  const [tauMs, setTauMs] = useState(60);
  const source = 48;
  const expected = state === 'isolated' || state === 'discharged' ? 0 : state === 'precharge' ? source * 0.95 : source;
  const actual = fault === 'open' ? 3 : fault === 'load' ? source * 0.62 : fault === 'welded' ? source : fault === 'bleed' && state === 'discharged' ? source * 0.7 : expected;
  const contact = {
    isolated: [false, false, false], precharge: [true, true, false], ready: [true, false, true], run: [true, false, true], isolate: [false, false, false], discharged: [false, false, false],
  }[state];
  if (fault === 'welded') contact[2] = true;
  if (fault === 'open') contact[1] = false;
  const expectedBand = state === 'precharge' ? [source * 0.85, source] : [expected - 1, expected + 1];
  const valid = actual >= expectedBand[0] && actual <= expectedBand[1] && !(state === 'discharged' && actual > 5) && fault === 'none';
  const pointsExpected = Array.from({ length: 28 }, (_, index) => { const t = index / 27 * 5 * tauMs; const v = source * (1 - Math.exp(-t / tauMs)); return `${28 + index / 27 * 314},${190 - v / 55 * 140}`; }).join(' ');
  const pointsActual = Array.from({ length: 28 }, (_, index) => { const t = index / 27 * 5 * tauMs; const normal = source * (1 - Math.exp(-t / tauMs)); const v = fault === 'open' ? normal * 0.08 : fault === 'load' ? normal * 0.65 : fault === 'welded' ? source : normal; return `${28 + index / 27 * 314},${190 - v / 55 * 140}`; }).join(' ');
  return (
    <EnergyLabFrame index="08" icon={<Power className="h-4 w-4" />} title="Coil command와 downstream bus evidence를 분리한 state machine" status={valid ? 'PHYSICAL STATE VERIFIED' : 'TRANSITION BLOCKED'} danger={!valid}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Power lifecycle" value={state} onChange={setState} options={[{ value: 'isolated', label: 'Isolated' }, { value: 'precharge', label: 'Precharge' }, { value: 'ready', label: 'Ready' }, { value: 'run', label: 'Run' }, { value: 'isolate', label: 'Open' }, { value: 'discharged', label: 'Discharged' }]} />
          <SegmentedControl label="Injected physical fault" value={fault} onChange={setFault} options={[{ value: 'none', label: 'None' }, { value: 'open', label: 'Precharge open' }, { value: 'load', label: 'Load left on' }, { value: 'welded', label: 'Main welded' }, { value: 'bleed', label: 'Bleed failed' }]} />
          <RangeControl label="Expected RC time constant" value={tauMs} min={20} max={180} step={10} unit=" ms" onChange={setTauMs} accent="amber" />
          <div className="grid gap-2 sm:grid-cols-3">{['NEGATIVE', 'PRECHARGE', 'MAIN +'].map((label, index) => <div key={label} className={`rounded-md border p-3 ${contact[index] ? 'border-blue-500/35 bg-blue-500/[0.04]' : 'border-border bg-muted/[0.06]'}`}><p className="text-[9px] font-black text-muted-foreground">{label}</p><p className="mt-1 text-xs font-black">{contact[index] ? 'PHYSICALLY CLOSED' : 'OPEN'}</p></div>)}</div>
          <StatusStrip tone={valid ? 'green' : 'red'}>{valid ? 'Command, auxiliary/contact model and downstream voltage agree.' : fault === 'load' ? 'Voltage rise is too slow: active load or soft short is consuming precharge current.' : fault === 'open' ? 'Voltage does not rise: open resistor, switch or wiring path.' : fault === 'welded' ? 'Downstream bus is energized before legal precharge state.' : 'Downstream voltage is not below the declared service threshold.'}</StatusStrip>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-black text-muted-foreground">EXPECTED VOLTAGE ENVELOPE</p><p className="mt-1 text-sm font-black">Timer가 아니라 trajectory가 진단한다</p></div><span className={`font-mono text-lg font-black ${valid ? 'text-teal-700' : 'text-red-600'}`}>{fmt(actual, 1)} V</span></div>
          <svg viewBox="0 0 380 230" className="mt-3 block aspect-[380/230] w-full" role="img" aria-label="Expected and measured precharge voltage trajectory"><line x1="28" y1="190" x2="342" y2="190" className="stroke-border" /><line x1="28" y1="36" x2="28" y2="190" className="stroke-border" /><polyline points={pointsExpected} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" /><polyline points={pointsActual} fill="none" stroke={valid ? '#0f766e' : '#dc2626'} strokeWidth="2.2" /><text x="38" y="32" className="fill-muted-foreground text-[9px]">downstream Vdc</text><text x="282" y="212" className="fill-muted-foreground text-[9px]">5 time constants</text><text x="226" y="72" className="fill-muted-foreground text-[9px]">expected</text><text x="226" y="94" className={valid ? 'fill-teal-700 text-[9px] font-bold' : 'fill-red-600 text-[9px] font-bold'}>measured / injected</text></svg>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">EXPECTED STATE</p><p className="mt-1 text-xs font-bold">{state.toUpperCase()} · {fmt(expected, 0)} V target</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">TRANSITION GATE</p><p className={`mt-1 text-xs font-bold ${valid ? 'text-teal-700' : 'text-red-600'}`}>{valid ? 'ALLOW NEXT STATE' : 'HOLD / OPEN / DIAGNOSE'}</p></div></div>
        </div>
      </div>
    </EnergyLabFrame>
  );
}

export function BrakingSupervisorLab() {
  const [speed, setSpeed] = useState(140);
  const [requestTorque, setRequestTorque] = useState(36);
  const [batteryPower, setBatteryPower] = useState(2.5);
  const [peerPower, setPeerPower] = useState(1);
  const [resistorTemperature, setResistorTemperature] = useState(120);
  const [busMargin, setBusMargin] = useState(4);
  const resistorPower = clamp((180 - resistorTemperature) / 60 * 4, 0, 4);
  const headroomPower = clamp(busMargin / 4 * 1.5, 0, 1.5);
  const availablePower = batteryPower + peerPower + resistorPower + headroomPower;
  const powerLimitedTorque = availablePower * 1000 / Math.max(Math.abs(speed), 15);
  const allowedTorque = Math.min(requestTorque, powerLimitedTorque, 42);
  const requestedPower = requestTorque * speed / 1000;
  const allowedPower = allowedTorque * speed / 1000;
  const safe = allowedTorque >= requestTorque - 0.1;
  const stopExtension = requestTorque / Math.max(allowedTorque, 0.5);
  const pointsRequest = Array.from({ length: 26 }, (_, i) => `${30 + i / 25 * 310},${70 + i / 25 * 88}`).join(' ');
  const pointsAllowed = Array.from({ length: 26 }, (_, i) => { const f = i / 25; return `${30 + f * 310},${70 + f * 88 / stopExtension}`; }).join(' ');
  return (
    <EnergyLabFrame index="09" icon={<Gauge className="h-4 w-4" />} title="Sink power를 regenerative torque와 stop time으로 되돌리기" status={safe ? 'REQUEST FEASIBLE' : 'TRAJECTORY RESHAPED'} danger={false}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Current speed" value={speed} min={20} max={220} step={5} unit=" rad/s" onChange={setSpeed} />
          <RangeControl label="Requested regenerative torque" value={requestTorque} min={4} max={50} unit=" N·m" onChange={setRequestTorque} accent="violet" />
          <RangeControl label="Battery/source sink" value={batteryPower} min={0} max={6} step={0.5} unit=" kW" onChange={setBatteryPower} accent="teal" />
          <RangeControl label="Measured peer-axis demand" value={peerPower} min={0} max={4} step={0.5} unit=" kW" onChange={setPeerPower} accent="teal" />
          <RangeControl label="Brake resistor temperature" value={resistorTemperature} min={40} max={190} step={5} unit=" °C" onChange={setResistorTemperature} accent="amber" />
          <RangeControl label="Bus action headroom" value={busMargin} min={0} max={8} step={0.5} unit=" V" onChange={setBusMargin} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-black text-muted-foreground">SUPERVISORY LIMIT</p><p className="mt-1 text-sm font-black">Hardware trip 전에 motion command를 바꾼다</p></div><span className={`font-mono text-lg font-black ${safe ? 'text-teal-700' : 'text-amber-700'}`}>{fmt(allowedTorque, 1)} N·m</span></div>
          <svg viewBox="0 0 380 230" className="mt-3 block aspect-[380/230] w-full" role="img" aria-label="Requested and allowed stop trajectory"><line x1="30" y1="190" x2="340" y2="190" className="stroke-border" /><line x1="30" y1="40" x2="30" y2="190" className="stroke-border" /><polyline points={pointsRequest} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" /><polyline points={pointsAllowed} fill="none" stroke={safe ? '#0f766e' : '#d97706'} strokeWidth="2.2" /><text x="38" y="35" className="fill-muted-foreground text-[9px]">speed</text><text x="272" y="213" className="fill-muted-foreground text-[9px]">stop time</text><text x="216" y="84" className="fill-muted-foreground text-[9px]">requested</text><text x="216" y="111" className={safe ? 'fill-teal-700 text-[9px] font-bold' : 'fill-amber-700 text-[9px] font-bold'}>allowed · ×{fmt(stopExtension, 2)} time</text></svg>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">AVAILABLE SINK</p><p className="mt-1 font-mono text-sm font-bold">{fmt(availablePower, 2)} kW</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">RESISTOR DERATE</p><p className="mt-1 font-mono text-sm font-bold">{fmt(resistorPower, 2)} kW</p></div></div>
          <StatusStrip tone={safe ? 'green' : 'amber'}>{safe ? 'Requested stop remains inside current sink and thermal state.' : `Requested ${fmt(requestedPower, 2)} kW를 ${fmt(allowedPower, 2)} kW로 제한해 bus overvoltage 이전에 stop time을 늘린다.`}</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Requested brake power', value: `${fmt(requestedPower, 2)} kW` }, { label: 'Allowed brake power', value: `${fmt(allowedPower, 2)} kW` }, { label: 'Allowed torque', value: `${fmt(allowedTorque, 1)} N·m` }, { label: 'Stop-time factor', value: `×${fmt(stopExtension, 2)}`, accent: safe }]} /></div>
    </EnergyLabFrame>
  );
}

const commissioningStages = [
  { id: 'passive', label: 'Passive', observe: 'Resistance, polarity, capacitor discharge, contact auxiliary state', gate: 'No unknown short or stored voltage', instrument: 'DMM · insulation/continuity setup' },
  { id: 'precharge', label: 'Precharge', observe: 'Source/downstream Vdc, current and expected RC envelope', gate: 'Voltage curve and contact feedback agree', instrument: 'Differential bus probes · current clamp' },
  { id: 'limited', label: 'Limited regen', observe: 'Torque·speed, bus power and source reverse current at low energy', gate: 'Signed energy ledger closes', instrument: 'Encoder · phase/DC current · Vdc' },
  { id: 'chopper', label: 'Chopper pulse', observe: 'V_on/V_off, switch current, resistor pulse energy and temperature', gate: 'Electrical and pulse thermal margins remain', instrument: 'Vdc · chopper current · thermal sensor' },
  { id: 'disconnect', label: 'BMS-open', observe: 'Local bus response while source sink disappears', gate: 'Torque limit/local dump acts before max bus', instrument: 'Fault trigger · shared timebase capture' },
  { id: 'repeat', label: 'Repeat envelope', observe: 'Payload, SOC, ambient, repetition and simultaneous axes', gate: 'No extrapolation beyond measured matrix', instrument: 'Energy log · thermal soak · fault ledger' },
] as const;

type CommissioningStage = typeof commissioningStages[number]['id'];

export function BrakingCommissioningLab() {
  const [stage, setStage] = useState<CommissioningStage>('precharge');
  const [faultInjected, setFaultInjected] = useState(false);
  const selected = commissioningStages.find((item) => item.id === stage) ?? commissioningStages[0];
  const index = commissioningStages.findIndex((item) => item.id === stage);
  const passed = !faultInjected;
  return (
    <EnergyLabFrame index="10" icon={<ShieldCheck className="h-4 w-4" />} title="한 번의 성공이 아니라 단계별 energy evidence 쌓기" status={passed ? 'EVIDENCE GATE READY' : 'FAULT MUST BE EXPLAINED'} danger={!passed}>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{commissioningStages.map((item, itemIndex) => <button key={item.id} type="button" onClick={() => setStage(item.id)} className={`min-h-16 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${stage === item.id ? 'border-blue-500/50 bg-blue-500/[0.05]' : itemIndex < index ? 'border-emerald-500/30 bg-emerald-500/[0.025]' : 'border-border bg-muted/[0.04]'}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{String(itemIndex + 1).padStart(2, '0')}</span><span className="mt-2 block text-xs font-black">{item.label}</span></button>)}</div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">STAGE {String(index + 1).padStart(2, '0')} · {selected.label.toUpperCase()}</p><h4 className="mt-2 text-base font-black">{selected.observe}</h4></div>{passed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldCheck className="h-5 w-5 shrink-0 text-red-600" />}</div><div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">INSTRUMENTS</p><p className="mt-2 text-sm font-semibold leading-relaxed">{selected.instrument}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">NEXT-STAGE GATE</p><p className="mt-2 text-sm font-semibold leading-relaxed">{selected.gate}</p></div></div><StatusStrip tone={passed ? 'green' : 'red'}>{passed ? '관측값이 예상 energy/state model과 일치해야 다음 stage를 연다.' : 'Injected failure가 expected trace와 cause identity를 만들지 못했다. 현재 stage에서 멈춘다.'}</StatusStrip></div>
          <div className="min-w-0 space-y-3"><SegmentedControl label="Evidence result" value={faultInjected ? 'fault' : 'pass'} onChange={(value) => setFaultInjected(value === 'fault')} options={[{ value: 'pass', label: 'Expected trace' }, { value: 'fault', label: 'Injected mismatch' }]} /><div className="rounded-md border border-border p-4"><p className="text-[10px] font-black text-muted-foreground">ENERGY LEDGER FIELDS</p><ul className="mt-3 grid gap-2 text-xs leading-relaxed text-muted-foreground"><li>• torque × speed and released joules</li><li>• downstream Vdc × signed DC current</li><li>• source / peer / chopper allocation</li><li>• contact states and resistor temperature</li><li>• final speed, hold state and fault identity</li></ul></div><StatusStrip tone="blue">Low-SOC 한 번, 짧은 pulse 한 번, 낮은 payload 한 번은 전체 SOC·ambient·repeat·multi-axis envelope를 입증하지 않는다.</StatusStrip></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Current stage', value: `${index + 1} / ${commissioningStages.length}` }, { label: 'Evidence state', value: passed ? 'EXPECTED' : 'MISMATCH' }, { label: 'Next-stage gate', value: passed ? 'CONDITIONAL OPEN' : 'CLOSED' }, { label: 'Envelope claim', value: index === commissioningStages.length - 1 && passed ? 'MEASURED MATRIX ONLY' : 'NOT YET', accent: passed }]} /></div>
    </EnergyLabFrame>
  );
}
