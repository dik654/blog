import { useState, type ReactNode } from 'react';
import { AlertTriangle, BatteryCharging, CheckCircle2, CircuitBoard, Gauge, Power, ShieldCheck, Thermometer, Zap } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function LabFrame({ index, title, status, danger = false, icon, children }: { index: string; title: string; status: string; danger?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-teal-700 dark:text-teal-300">{icon} POWER LAB {index}</span>
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

function StatusStrip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'amber' | 'red' | 'green' }) {
  const classes = { neutral: 'border-border bg-muted/[0.12]', amber: 'border-amber-500/30 bg-amber-500/[0.045]', red: 'border-red-500/30 bg-red-500/[0.045]', green: 'border-emerald-500/30 bg-emerald-500/[0.045]' }[tone];
  return <div className={`rounded-md border p-3 text-xs leading-relaxed ${classes}`}>{children}</div>;
}

type PowerMode = 'motoring' | 'coast' | 'regen' | 'fault';

export function PowerPathContractLab() {
  const [mode, setMode] = useState<PowerMode>('regen');
  const [torque, setTorque] = useState(18);
  const [speed, setSpeed] = useState(1800);
  const mechanicalKw = torque * speed * 2 * Math.PI / 60 / 1000;
  const direction = mode === 'regen' ? -1 : mode === 'motoring' ? 1 : 0;
  const dcKw = mode === 'fault' ? 9.6 : direction === 0 ? 0.12 : direction * (mechanicalKw + (direction > 0 ? 0.42 : -0.42));
  const protectionReady = mode !== 'fault';
  const stages = [
    { label: 'DC source / link', value: `${fmt(dcKw, 2)} kW`, active: mode !== 'coast', tone: 'border-blue-500/35' },
    { label: 'Three half bridges', value: mode === 'fault' ? 'illegal overlap' : mode === 'coast' ? 'high-Z / freewheel' : 'PWM commutation', active: mode !== 'coast', tone: mode === 'fault' ? 'border-red-500/45' : 'border-violet-500/35' },
    { label: 'Phase current', value: mode === 'regen' ? 'motor → bus' : mode === 'motoring' ? 'bus → motor' : mode === 'fault' ? 'unbounded rise' : 'decaying', active: true, tone: 'border-teal-500/35' },
    { label: 'Shaft', value: `${direction * torque} N·m`, active: mode === 'motoring' || mode === 'regen', tone: 'border-amber-500/35' },
  ];
  return (
    <LabFrame index="01" icon={<Power className="h-4 w-4" />} title="명령·에너지·전류·보호 경로를 분리해 읽기" status={protectionReady ? 'PATHS ACCOUNTED' : 'HARDWARE TRIP REQUIRED'} danger={!protectionReady}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Operating state" value={mode} onChange={setMode} options={[{ value: 'motoring', label: 'Motoring' }, { value: 'coast', label: 'Coast' }, { value: 'regen', label: 'Regen' }, { value: 'fault', label: 'Shoot-through' }]} />
          <RangeControl label="Shaft torque magnitude" value={torque} min={2} max={30} unit=" N·m" onChange={setTorque} />
          <RangeControl label="Mechanical speed" value={speed} min={200} max={3600} step={100} unit=" rpm" onChange={setSpeed} accent="violet" />
          <StatusStrip tone={mode === 'fault' ? 'red' : mode === 'regen' ? 'amber' : 'neutral'}>PWM command는 gate input일 뿐이다. 이 장면은 같은 순간의 bus power, switch legality, phase-current direction과 보호 상태를 따로 기록한다.</StatusStrip>
        </div>
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-2">
            {stages.map((stage, index) => <div key={stage.label} className={`min-w-0 rounded-md border bg-muted/[0.08] p-4 ${stage.tone} ${stage.active ? '' : 'opacity-55'}`}><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><span className={`h-2 w-2 rounded-full ${stage.active ? mode === 'fault' && index === 1 ? 'bg-red-500' : 'bg-teal-500' : 'bg-border'}`} /></div><p className="mt-3 text-xs font-black">{stage.label}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{stage.value}</p></div>)}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-md border border-border px-4 py-3 text-xs"><span className="text-right font-semibold">{mode === 'regen' ? 'shaft energy' : 'DC-link energy'}</span><span className={`font-mono text-lg font-black ${mode === 'fault' ? 'text-red-600' : 'text-teal-600'}`}>{mode === 'regen' ? '←' : '→'}</span><span className="font-semibold">{mode === 'regen' ? 'DC link / sink' : 'shaft + losses'}</span></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Mechanical power', value: `${fmt(mechanicalKw, 2)} kW` }, { label: 'Signed DC power', value: `${fmt(dcKw, 2)} kW` }, { label: 'Energy direction', value: mode === 'regen' ? 'TO DC LINK' : mode === 'motoring' ? 'TO SHAFT' : mode === 'fault' ? 'INTO FAULT' : 'DECAYING' }, { label: 'Protection gate', value: protectionReady ? 'OPEN' : 'CLOSED', accent: protectionReady }]} /></div>
    </LabFrame>
  );
}

export function DcLinkEnergyLab() {
  const [bus, setBus] = useState(48);
  const [cap, setCap] = useState(1500);
  const [resistance, setResistance] = useState(12);
  const [regenKw, setRegenKw] = useState(3.5);
  const [regenMs, setRegenMs] = useState(120);
  const maxBus = 60;
  const capacitance = cap * 1e-6;
  const tauMs = resistance * capacitance * 1000;
  const initialCurrent = bus / resistance;
  const startEnergy = 0.5 * capacitance * bus ** 2;
  const maxEnergy = 0.5 * capacitance * maxBus ** 2;
  const regenEnergy = regenKw * regenMs;
  const finalEnergy = startEnergy + regenEnergy;
  const finalBus = Math.sqrt((2 * finalEnergy) / capacitance);
  const safe = finalBus <= maxBus;
  const points = Array.from({ length: 26 }, (_, index) => {
    const t = index / 25 * tauMs * 5;
    const v = bus * (1 - Math.exp(-t / tauMs));
    return `${16 + index / 25 * 268},${126 - v / 60 * 92}`;
  }).join(' ');
  return (
    <LabFrame index="02" icon={<BatteryCharging className="h-4 w-4" />} title="Precharge와 regeneration이 공유하는 DC-link energy" status={safe ? 'BUS HEADROOM OK' : 'ABSORPTION PATH MISSING'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Initial DC bus" value={bus} min={24} max={58} unit=" V" onChange={setBus} accent="violet" />
          <RangeControl label="DC-link capacitance" value={cap} min={500} max={4000} step={100} unit=" µF" onChange={setCap} />
          <RangeControl label="Precharge resistance" value={resistance} min={2} max={30} unit=" Ω" onChange={setResistance} accent="amber" />
          <RangeControl label="Regeneration power" value={regenKw} min={0.5} max={8} step={0.5} unit=" kW" onChange={setRegenKw} />
          <RangeControl label="Regeneration interval" value={regenMs} min={20} max={300} step={10} unit=" ms" onChange={setRegenMs} accent="amber" />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">FIRST-ORDER PRECHARGE</p><p className="mt-1 text-sm font-black">Capacitor voltage rise</p></div><span className="font-mono text-xs text-muted-foreground">5τ = {fmt(tauMs * 5, 0)} ms</span></div>
          <svg viewBox="0 0 300 150" className="mt-3 block aspect-[2/1] w-full" role="img" aria-label="RC precharge voltage curve">
            <line x1="16" y1="126" x2="286" y2="126" className="stroke-border" strokeWidth="1" /><line x1="16" y1="18" x2="16" y2="126" className="stroke-border" strokeWidth="1" />
            <line x1="16" y1={126 - bus / 60 * 92} x2="286" y2={126 - bus / 60 * 92} stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" />
            <polyline points={points} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="20" y="142" className="fill-muted-foreground text-[9px]">0</text><text x="256" y="142" className="fill-muted-foreground text-[9px]">time</text><text x="20" y="15" className="fill-muted-foreground text-[9px]">Vdc</text>
          </svg>
          <div className={`mt-3 rounded-md border p-4 ${safe ? 'border-emerald-500/30 bg-emerald-500/[0.035]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><div className="flex items-center gap-2">{safe ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}<strong className="text-sm">Regen 후 예상 bus {fmt(finalBus, 1)} V</strong></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">이 값은 짧은 구간에서 regen energy가 모두 capacitor에 들어간다는 상한 근사다. Battery absorption, ESR, inverter loss와 control response가 실제 파형을 바꾸지만 energy destination은 반드시 있어야 한다.</p></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Stored energy', value: `${fmt(startEnergy, 2)} J` }, { label: 'Headroom to 60 V', value: `${fmt(maxEnergy - startEnergy, 2)} J` }, { label: 'Initial precharge current', value: `${fmt(initialCurrent, 1)} A` }, { label: 'Regen energy', value: `${fmt(regenEnergy, 0)} J`, accent: safe }]} /></div>
    </LabFrame>
  );
}

type SwitchState = 'high' | 'low' | 'dead' | 'overlap';

export function HalfBridgeCommutationLab() {
  const [state, setState] = useState<SwitchState>('dead');
  const [currentPositive, setCurrentPositive] = useState(true);
  const [mismatch, setMismatch] = useState(8);
  const forbidden = state === 'overlap';
  const route = forbidden ? 'DC+ → HS → LS → DC−' : state === 'high' ? currentPositive ? 'DC+ → HS channel → phase' : 'phase → HS channel/diode → DC+' : state === 'low' ? currentPositive ? 'phase → LS channel/diode → DC−' : 'DC− → LS channel → phase' : currentPositive ? 'phase → low-side diode → DC−' : 'DC− → low-side/high-side commutation path';
  const imbalance = clamp(mismatch * 0.9, 0, 35);
  return (
    <LabFrame index="03" icon={<Zap className="h-4 w-4" />} title="Half bridge의 legal current path와 forbidden overlap" status={forbidden ? 'SHOOT-THROUGH' : 'COMMUTATION PATH VALID'} danger={forbidden}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Gate state" value={state} onChange={setState} options={[{ value: 'high', label: 'High on' }, { value: 'low', label: 'Low on' }, { value: 'dead', label: 'Dead time' }, { value: 'overlap', label: 'Both on' }]} />
          <SegmentedControl label="Phase-current direction" value={currentPositive ? 'positive' : 'negative'} onChange={(value) => setCurrentPositive(value === 'positive')} options={[{ value: 'positive', label: '+ phase current' }, { value: 'negative', label: '− phase current' }]} />
          <RangeControl label="Parallel path mismatch" value={mismatch} min={0} max={30} unit=" %" onChange={setMismatch} accent="amber" />
          <StatusStrip tone={forbidden ? 'red' : state === 'dead' ? 'amber' : 'neutral'}><strong>{route}</strong><br /><span className="text-muted-foreground">Dead time에도 motor inductance current는 사라지지 않는다. Gate가 모두 off인 동안 diode/channel 경로가 phase node 전압을 결정한다.</span></StatusStrip>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <svg viewBox="0 0 420 260" className="block aspect-[420/260] w-full" role="img" aria-label="Half bridge current path">
            <text x="36" y="28" className="fill-muted-foreground text-[11px] font-bold">DC+</text><text x="36" y="244" className="fill-muted-foreground text-[11px] font-bold">DC−</text>
            <line x1="82" y1="24" x2="82" y2="236" className="stroke-border" strokeWidth="1.2" />
            <line x1="82" y1="24" x2="328" y2="24" className="stroke-border" strokeWidth="1.2" /><line x1="82" y1="236" x2="328" y2="236" className="stroke-border" strokeWidth="1.2" />
            <rect x="180" y="55" width="80" height="48" rx="5" className={state === 'high' || forbidden ? 'fill-violet-500/10 stroke-violet-600' : 'fill-background stroke-border'} strokeWidth="1.3" />
            <text x="220" y="76" textAnchor="middle" className="fill-foreground text-[11px] font-bold">HIGH SIDE</text><text x="220" y="92" textAnchor="middle" className="fill-muted-foreground text-[9px]">2 × MOSFET</text>
            <rect x="180" y="157" width="80" height="48" rx="5" className={state === 'low' || forbidden ? 'fill-violet-500/10 stroke-violet-600' : 'fill-background stroke-border'} strokeWidth="1.3" />
            <text x="220" y="178" textAnchor="middle" className="fill-foreground text-[11px] font-bold">LOW SIDE</text><text x="220" y="194" textAnchor="middle" className="fill-muted-foreground text-[9px]">2 × MOSFET</text>
            <line x1="220" y1="24" x2="220" y2="55" className="stroke-border" /><line x1="220" y1="103" x2="220" y2="157" className="stroke-border" /><line x1="220" y1="205" x2="220" y2="236" className="stroke-border" />
            <line x1="220" y1="130" x2="374" y2="130" stroke={forbidden ? '#dc2626' : '#0f766e'} strokeWidth="2" strokeLinecap="round" /><circle cx="374" cy="130" r="4" fill={forbidden ? '#dc2626' : '#0f766e'} /><text x="370" y="116" textAnchor="end" className="fill-muted-foreground text-[10px]">PHASE U</text>
            {forbidden && <><line x1="220" y1="25" x2="220" y2="235" stroke="#dc2626" strokeWidth="3" strokeDasharray="7 4" /><text x="288" y="223" className="fill-red-600 text-[10px] font-bold">BUS SHORT</text></>}
            {!forbidden && <><path d={currentPositive ? 'M 278 130 L 350 130' : 'M 350 130 L 278 130'} stroke="#0f766e" strokeWidth="3" strokeLinecap="round" /><text x="290" y="151" className="fill-teal-700 text-[10px] font-bold">i phase</text></>}
          </svg>
          <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">PARALLEL DEVICE A</p><p className="mt-1 font-mono text-sm font-bold">{fmt(50 + imbalance / 2, 0)}% current</p></div><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">PARALLEL DEVICE B</p><p className="mt-1 font-mono text-sm font-bold">{fmt(50 - imbalance / 2, 0)}% current</p></div></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Current direction', value: currentPositive ? '+ PHASE' : '− PHASE' }, { label: 'Dominant path', value: state === 'dead' ? 'DIODE / FREEWHEEL' : state === 'overlap' ? 'DC BUS SHORT' : 'MOSFET CHANNEL' }, { label: 'Parallel imbalance', value: `${fmt(imbalance, 0)}%` }, { label: 'Switch gate', value: forbidden ? 'BLOCK' : 'LEGAL', accent: !forbidden }]} /></div>
    </LabFrame>
  );
}

export function GateDriveSlewLab() {
  const [charge, setCharge] = useState(46);
  const [drive, setDrive] = useState(1);
  const [commonSource, setCommonSource] = useState(4);
  const [dvdt, setDvdt] = useState(18);
  const [deadTime, setDeadTime] = useState(160);
  const edgeNs = charge / drive;
  const sourceBounce = commonSource * 1e-9 * (80 / Math.max(edgeNs * 1e-9, 1e-9));
  const millerCurrent = 0.7 * dvdt;
  const falseTurnOnMargin = 2.8 - sourceBounce - millerCurrent * 1.8;
  const safe = deadTime > edgeNs + 55 && falseTurnOnMargin > 0;
  return (
    <LabFrame index="04" icon={<Gauge className="h-4 w-4" />} title="Gate charge·Miller current·dead time을 같은 시간축에 놓기" status={safe ? 'GATE MARGIN POSITIVE' : 'FALSE TURN-ON / OVERLAP RISK'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Switching charge estimate" value={charge} min={15} max={100} unit=" nC" onChange={setCharge} accent="violet" />
          <RangeControl label="Gate-drive current" value={drive} min={0.2} max={2.5} step={0.1} unit=" A" onChange={setDrive} />
          <RangeControl label="Common-source inductance" value={commonSource} min={0} max={12} unit=" nH" onChange={setCommonSource} accent="amber" />
          <RangeControl label="Switch-node dV/dt" value={dvdt} min={2} max={35} unit=" V/ns" onChange={setDvdt} accent="amber" />
          <RangeControl label="Commanded dead time" value={deadTime} min={40} max={500} step={10} unit=" ns" onChange={setDeadTime} />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">COMMUTATION WINDOW</p><p className="mt-1 text-sm font-black">Command와 actual VGS는 같지 않다</p></div><span className="font-mono text-xs text-muted-foreground">{fmt(edgeNs, 0)} ns edge</span></div>
          <svg viewBox="0 0 360 190" className="mt-3 block aspect-[360/190] w-full" role="img" aria-label="Gate drive and switch node timing">
            {[42, 96, 150].map((y) => <line key={y} x1="28" y1={y} x2="342" y2={y} className="stroke-border" strokeWidth="1" />)}
            <text x="4" y="29" className="fill-muted-foreground text-[9px]">cmd</text><text x="4" y="83" className="fill-muted-foreground text-[9px]">VGS</text><text x="4" y="137" className="fill-muted-foreground text-[9px]">VSW</text>
            <path d="M 30 42 L 92 42 L 92 20 L 245 20 L 245 42 L 340 42" fill="none" stroke="#7c3aed" strokeWidth="1.8" />
            <path d={`M 30 96 L 96 96 L ${96 + clamp(edgeNs, 10, 95)} 68 L 240 68 L ${240 + clamp(edgeNs, 10, 95)} 96 L 340 96`} fill="none" stroke={safe ? '#0f766e' : '#dc2626'} strokeWidth="2" strokeLinejoin="round" />
            <path d={`M 30 150 L ${100 + clamp(edgeNs, 10, 75)} 150 L ${115 + clamp(edgeNs, 10, 75)} 119 L 340 119`} fill="none" stroke="#2563eb" strokeWidth="1.8" />
            <line x1="92" y1="14" x2="92" y2="166" className="stroke-border" strokeDasharray="3 4" /><line x1={92 + clamp(deadTime / 3, 14, 140)} y1="14" x2={92 + clamp(deadTime / 3, 14, 140)} y2="166" stroke="#d97706" strokeDasharray="3 4" />
            <text x="98" y="180" className="fill-muted-foreground text-[9px]">turn-off</text><text x={102 + clamp(deadTime / 3, 14, 140)} y="180" className="fill-amber-700 text-[9px]">next gate</text>
          </svg>
          <StatusStrip tone={safe ? 'green' : 'red'}><strong>{safe ? 'Effective separation이 남는다.' : 'Command dead time 안에서 edge와 false-turn-on margin이 충돌한다.'}</strong><br /><span className="text-muted-foreground">`Qg/Ig`는 시작점이다. Plateau, driver impedance, parasitic source voltage와 opposite-device Miller current를 실제 VGS/VSW capture로 확인한다.</span></StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Edge estimate', value: `${fmt(edgeNs, 0)} ns` }, { label: 'Source bounce estimate', value: `${fmt(sourceBounce, 2)} V` }, { label: 'Miller current proxy', value: `${fmt(millerCurrent, 1)} mA` }, { label: 'False-turn-on margin', value: `${fmt(falseTurnOnMargin, 2)} V`, accent: safe }]} /></div>
    </LabFrame>
  );
}

export function RingingLayoutLab() {
  const [loopLength, setLoopLength] = useState(38);
  const [ceramicDistance, setCeramicDistance] = useState(12);
  const [slew, setSlew] = useState(1.4);
  const [probeLoop, setProbeLoop] = useState(2);
  const [capacitance, setCapacitance] = useState(420);
  const loopNh = 4 + loopLength * 0.12 + ceramicDistance * 0.32;
  const overshoot = loopNh * slew;
  const eqCapPf = capacitance;
  const ringMhz = 1 / (2 * Math.PI * Math.sqrt(loopNh * 1e-9 * eqCapPf * 1e-12)) / 1e6;
  const measuredOvershoot = overshoot + probeLoop * 1.8;
  const safe = overshoot < 15;
  const capX = clamp(286 - ceramicDistance * 3.5, 188, 280);
  return (
    <LabFrame index="05" icon={<CircuitBoard className="h-4 w-4" />} title="PCB current-loop geometry와 scope probe loop를 함께 보기" status={safe ? 'OVERSHOOT MARGIN' : 'LOOP REDESIGN FIRST'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Power-loop path length proxy" value={loopLength} min={10} max={90} unit=" mm" onChange={setLoopLength} />
          <RangeControl label="Local ceramic distance" value={ceramicDistance} min={1} max={28} unit=" mm" onChange={setCeramicDistance} accent="violet" />
          <RangeControl label="Current slew" value={slew} min={0.3} max={3} step={0.1} unit=" A/ns" onChange={setSlew} accent="amber" />
          <RangeControl label="Probe-loop error proxy" value={probeLoop} min={0} max={10} unit=" nH" onChange={setProbeLoop} accent="amber" />
          <RangeControl label="Equivalent switch-node C" value={capacitance} min={150} max={1000} step={25} unit=" pF" onChange={setCapacitance} />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-3 sm:p-4">
          <svg viewBox="0 0 420 260" className="block aspect-[420/260] w-full" role="img" aria-label="PCB power loop and probe loop geometry">
            <rect x="24" y="24" width="372" height="210" rx="8" className="fill-background stroke-border" />
            <text x="42" y="48" className="fill-muted-foreground text-[10px] font-bold">POWER ZONE</text>
            <rect x="50" y="78" width="74" height="74" rx="5" className="fill-blue-500/5 stroke-blue-600" /><text x="87" y="108" textAnchor="middle" className="fill-foreground text-[10px] font-bold">DC LINK</text><text x="87" y="126" textAnchor="middle" className="fill-muted-foreground text-[9px]">bulk</text>
            <rect x="268" y="68" width="88" height="118" rx="5" className="fill-violet-500/5 stroke-violet-600" /><text x="312" y="100" textAnchor="middle" className="fill-foreground text-[10px] font-bold">HALF BRIDGE</text><text x="312" y="119" textAnchor="middle" className="fill-muted-foreground text-[9px]">HS / LS</text>
            <rect x={capX} y="34" width="42" height="24" rx="4" className="fill-teal-500/10 stroke-teal-600" /><text x={capX + 21} y="50" textAnchor="middle" className="fill-teal-800 text-[8px] font-bold">CERAMIC</text>
            <path d={`M 124 92 C 170 ${60 - loopLength / 3}, 245 58, 286 80 L 286 174 C 242 ${204 + loopLength / 4}, 166 197, 124 138 Z`} fill="none" stroke={safe ? '#0f766e' : '#dc2626'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="190" y="218" textAnchor="middle" className={safe ? 'fill-teal-700 text-[10px] font-bold' : 'fill-red-600 text-[10px] font-bold'}>commutation loop · {fmt(loopNh, 1)} nH</text>
            <path d="M 340 78 C 392 68, 392 132, 342 136" fill="none" stroke="#d97706" strokeWidth="1.4" strokeDasharray="4 4" /><text x="376" y="62" textAnchor="middle" className="fill-amber-700 text-[9px]">probe loop</text>
          </svg>
          <div className="grid gap-2 sm:grid-cols-3"><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">PHYSICAL</p><p className="mt-1 font-mono text-sm font-bold">+{fmt(overshoot, 1)} V</p></div><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">DISPLAYED</p><p className="mt-1 font-mono text-sm font-bold">+{fmt(measuredOvershoot, 1)} V</p></div><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">RING</p><p className="mt-1 font-mono text-sm font-bold">{fmt(ringMhz, 1)} MHz</p></div></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Loop inductance proxy', value: `${fmt(loopNh, 1)} nH` }, { label: 'Physical overshoot', value: `${fmt(overshoot, 1)} V` }, { label: 'Probe-added display', value: `${fmt(measuredOvershoot - overshoot, 1)} V` }, { label: 'First action', value: safe ? 'VERIFY WAVEFORM' : 'REDUCE LOOP', accent: safe }]} /></div>
    </LabFrame>
  );
}

type DeviceProfile = 'lowR' | 'balanced' | 'fast';

export function LossBudgetLab() {
  const [current, setCurrent] = useState(42);
  const [frequency, setFrequency] = useState(20);
  const [temperature, setTemperature] = useState(100);
  const [edge, setEdge] = useState(55);
  const [profile, setProfile] = useState<DeviceProfile>('balanced');
  const device = {
    lowR: { r: 1.6, charge: 92, switchFactor: 1.15, label: '낮은 RDS(on) · 큰 charge' },
    balanced: { r: 2.4, charge: 54, switchFactor: 1, label: '균형 profile' },
    fast: { r: 3.5, charge: 31, switchFactor: 0.78, label: '작은 charge · 높은 RDS(on)' },
  }[profile];
  const hotFactor = 1 + Math.max(0, temperature - 25) * 0.006;
  const conduction = current ** 2 * device.r * 1e-3 * hotFactor * 0.5 * 3;
  const switching = 0.5 * 48 * current * edge * 1e-9 * frequency * 1000 * 6 * device.switchFactor;
  const recovery = 0.035 * current * frequency / 20 * 3;
  const gate = device.charge * 1e-9 * 10 * frequency * 1000 * 6;
  const shunt = current ** 2 * 0.0002 * 3;
  const auxiliary = 2.2;
  const losses = [
    { label: 'Conduction', value: conduction, color: '#0f766e' },
    { label: 'Switching', value: switching, color: '#7c3aed' },
    { label: 'Recovery', value: recovery, color: '#d97706' },
    { label: 'Gate + sense + aux', value: gate + shunt + auxiliary, color: '#2563eb' },
  ];
  const total = losses.reduce((sum, item) => sum + item.value, 0);
  const inputPower = 48 * current * 0.62;
  const efficiency = clamp((inputPower - total) / inputPower * 100, 0, 100);
  return (
    <LabFrame index="06" icon={<Gauge className="h-4 w-4" />} title="Conduction·switching·recovery·driver loss의 operating-point budget" status={efficiency > 94 ? 'LOSS BUDGET CLOSED' : 'THERMAL LOAD HIGH'} danger={efficiency <= 94}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="MOSFET profile" value={profile} onChange={setProfile} options={[{ value: 'lowR', label: 'Low R' }, { value: 'balanced', label: 'Balanced' }, { value: 'fast', label: 'Fast' }]} />
          <RangeControl label="Phase RMS current" value={current} min={5} max={85} unit=" A" onChange={setCurrent} />
          <RangeControl label="PWM frequency" value={frequency} min={8} max={40} unit=" kHz" onChange={setFrequency} accent="violet" />
          <RangeControl label="Junction estimate" value={temperature} min={25} max={150} unit=" °C" onChange={setTemperature} accent="amber" />
          <RangeControl label="Voltage/current overlap" value={edge} min={20} max={150} step={5} unit=" ns" onChange={setEdge} accent="amber" />
          <StatusStrip>{device.label}. 같은 die area에서 낮은 저항과 작은 charge/capacitance를 모두 독립적으로 최소화할 수 있다고 가정하지 않는다.</StatusStrip>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">ESTIMATED INVERTER LOSS</p><p className="mt-1 font-mono text-3xl font-black">{fmt(total, 1)} W</p></div><span className="font-mono text-xs text-muted-foreground">η {fmt(efficiency, 1)}%</span></div>
          <div className="mt-5 flex h-10 overflow-hidden rounded-sm border border-border bg-background" aria-label="Stacked inverter loss budget">
            {losses.map((item) => <span key={item.label} style={{ width: `${item.value / total * 100}%`, backgroundColor: item.color }} title={`${item.label}: ${fmt(item.value, 1)} W`} />)}
          </div>
          <div className="mt-5 space-y-3">
            {losses.map((item) => <div key={item.label} className="grid grid-cols-[0.75rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} /><span className="font-semibold">{item.label}</span><span className="text-right font-mono text-muted-foreground">{fmt(item.value, 1)} W</span></div>)}
          </div>
          <StatusStrip tone="amber"><strong>이 숫자는 qualification이 아니다.</strong> Switching term은 linear overlap approximation이고 Coss·Qrr·modulation·stray waveform을 압축한다. Target double-pulse/motor waveform에서 `v(t)i(t)`를 적분해 교정해야 한다.</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Hot RDS(on) factor', value: `${fmt(hotFactor, 2)}×` }, { label: 'Conduction', value: `${fmt(conduction, 1)} W` }, { label: 'Switching', value: `${fmt(switching, 1)} W` }, { label: 'Estimated efficiency', value: `${fmt(efficiency, 1)}%`, accent: efficiency > 94 }]} /></div>
    </LabFrame>
  );
}

type CoolingPath = 'board' | 'heatsink' | 'forced';

export function ThermalPathLab() {
  const [loss, setLoss] = useState(72);
  const [duration, setDuration] = useState(30);
  const [ambient, setAmbient] = useState(40);
  const [path, setPath] = useState<CoolingPath>('board');
  const thermal = { board: { theta: 1.35, tau: 48, surfaceBias: 16 }, heatsink: { theta: 0.72, tau: 62, surfaceBias: 10 }, forced: { theta: 0.42, tau: 28, surfaceBias: 7 } }[path];
  const rise = loss * thermal.theta * (1 - Math.exp(-duration / thermal.tau));
  const junction = ambient + rise;
  const surface = junction - thermal.surfaceBias;
  const safe = junction < 125;
  const points = Array.from({ length: 32 }, (_, index) => {
    const t = index / 31 * Math.max(90, duration);
    const temp = ambient + loss * thermal.theta * (1 - Math.exp(-t / thermal.tau));
    return `${20 + index / 31 * 300},${150 - (temp - 20) / 150 * 116}`;
  }).join(' ');
  return (
    <LabFrame index="07" icon={<Thermometer className="h-4 w-4" />} title="Junction-to-ambient thermal path와 surface evidence의 차이" status={safe ? 'JUNCTION MARGIN' : 'DERATE / COOLING REQUIRED'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Cooling path" value={path} onChange={setPath} options={[{ value: 'board', label: 'PCB only' }, { value: 'heatsink', label: 'Heatsink' }, { value: 'forced', label: 'Forced air' }]} />
          <RangeControl label="Power-stage loss" value={loss} min={10} max={180} step={5} unit=" W" onChange={setLoss} />
          <RangeControl label="Applied duration" value={duration} min={1} max={120} unit=" s" onChange={setDuration} accent="violet" />
          <RangeControl label="Local ambient" value={ambient} min={20} max={75} unit=" °C" onChange={setAmbient} accent="amber" />
          <StatusStrip tone={safe ? 'neutral' : 'red'}>Thermal camera는 package surface를 본다. Junction estimate에는 transient impedance, interface, copper spreading, airflow, emissivity와 sensor 위치의 uncertainty가 남는다.</StatusStrip>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-muted-foreground"><span>JUNCTION</span><span>CASE / BOARD</span><span>AMBIENT</span></div>
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2"><div className={`rounded-md border p-3 text-center ${safe ? 'border-teal-500/30' : 'border-red-500/35'}`}><p className="font-mono text-lg font-black">{fmt(junction, 1)}°</p></div><span className="text-muted-foreground">→</span><div className="rounded-md border border-amber-500/30 p-3 text-center"><p className="font-mono text-lg font-black">{fmt(surface, 1)}°</p></div><span className="text-muted-foreground">→</span><div className="rounded-md border border-blue-500/30 p-3 text-center"><p className="font-mono text-lg font-black">{ambient}°</p></div></div>
          <svg viewBox="0 0 340 180" className="mt-4 block aspect-[340/180] w-full" role="img" aria-label="Transient junction temperature estimate">
            <line x1="20" y1="150" x2="324" y2="150" className="stroke-border" /><line x1="20" y1="24" x2="20" y2="150" className="stroke-border" />
            <line x1="20" y1={150 - (125 - 20) / 150 * 116} x2="324" y2={150 - (125 - 20) / 150 * 116} stroke="#dc2626" strokeDasharray="4 4" /><text x="278" y={145 - (125 - 20) / 150 * 116} className="fill-red-600 text-[9px]">125°C gate</text>
            <polyline points={points} fill="none" stroke={safe ? '#0f766e' : '#dc2626'} strokeWidth="2" strokeLinecap="round" />
            <line x1={20 + clamp(duration / Math.max(90, duration), 0, 1) * 300} y1="24" x2={20 + clamp(duration / Math.max(90, duration), 0, 1) * 300} y2="150" stroke="#7c3aed" strokeDasharray="3 4" />
            <text x="22" y="170" className="fill-muted-foreground text-[9px]">time</text><text x="23" y="19" className="fill-muted-foreground text-[9px]">Tj</text>
          </svg>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Transient rise', value: `${fmt(rise, 1)} °C` }, { label: 'Surface evidence', value: `${fmt(surface, 1)} °C` }, { label: 'Junction estimate', value: `${fmt(junction, 1)} °C` }, { label: 'Margin to 125 °C', value: `${fmt(125 - junction, 1)} °C`, accent: safe }]} /></div>
    </LabFrame>
  );
}

export function CurrentSenseIntegrityLab() {
  const [current, setCurrent] = useState(55);
  const [shunt, setShunt] = useState(200);
  const [gain, setGain] = useState(10);
  const [sampleNs, setSampleNs] = useState(450);
  const [settleNs, setSettleNs] = useState(1000);
  const [kelvinError, setKelvinError] = useState(80);
  const shuntOhm = shunt * 1e-6;
  const trueSignal = current * shuntOhm;
  const copperError = current * kelvinError * 1e-6;
  const output = 1.65 + gain * (trueSignal + copperError);
  const valid = sampleNs >= settleNs && output < 3.2;
  const inferredCurrent = valid ? (output - 1.65) / gain / shuntOhm : clamp(sampleNs / settleNs, 0.15, 1) * (output - 1.65) / gain / shuntOhm;
  const sampleX = 50 + clamp(sampleNs / 2200, 0, 1) * 270;
  const validX = 50 + clamp(settleNs / 2200, 0, 1) * 270;
  return (
    <LabFrame index="08" icon={<Gauge className="h-4 w-4" />} title="Shunt Kelvin node·PWM recovery·ADC aperture의 측정 계약" status={valid ? 'SAMPLE VALID' : 'CURRENT EVIDENCE INVALID'} danger={!valid}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="True phase current" value={current} min={5} max={85} unit=" A" onChange={setCurrent} />
          <RangeControl label="Shunt resistance" value={shunt} min={100} max={1000} step={50} unit=" µΩ" onChange={setShunt} accent="violet" />
          <RangeControl label="Amplifier gain" value={gain} min={5} max={40} unit=" V/V" onChange={setGain} />
          <RangeControl label="ADC sample after edge" value={sampleNs} min={50} max={2200} step={50} unit=" ns" onChange={setSampleNs} accent="amber" />
          <RangeControl label="Amplifier settle requirement" value={settleNs} min={200} max={1800} step={100} unit=" ns" onChange={setSettleNs} accent="amber" />
          <RangeControl label="Shared-copper error" value={kelvinError} min={0} max={250} step={10} unit=" µΩ" onChange={setKelvinError} />
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-center justify-between gap-2"><div><p className="text-[10px] font-black text-muted-foreground">PWM EDGE RECOVERY WINDOW</p><p className="mt-1 text-sm font-black">Output가 범위 안인 것과 settled인 것은 다르다</p></div><span className={`font-mono text-xs font-black ${valid ? 'text-emerald-700' : 'text-red-600'}`}>{valid ? 'VALID' : 'HOLD / SETTLING'}</span></div>
          <svg viewBox="0 0 360 180" className="mt-3 block aspect-[2/1] w-full" role="img" aria-label="Current sense settling and ADC sample timing">
            <rect x="50" y="28" width={Math.max(0, validX - 50)} height="112" fill="#d9770610" /><rect x={validX} y="28" width={Math.max(0, 320 - validX)} height="112" fill="#0596690a" />
            <line x1="50" y1="140" x2="322" y2="140" className="stroke-border" /><path d={`M 50 122 C 78 30, 105 156, ${validX} 78 L 322 78`} fill="none" stroke="#2563eb" strokeWidth="2" />
            <line x1={validX} y1="22" x2={validX} y2="146" stroke="#0f766e" strokeDasharray="4 4" /><text x={validX + 5} y="18" className="fill-teal-700 text-[9px]">valid after {settleNs} ns</text>
            <line x1={sampleX} y1="22" x2={sampleX} y2="146" stroke={valid ? '#7c3aed' : '#dc2626'} strokeWidth="2" /><circle cx={sampleX} cy="78" r="4" fill={valid ? '#7c3aed' : '#dc2626'} /><text x={sampleX} y="163" textAnchor="middle" className={valid ? 'fill-violet-700 text-[9px]' : 'fill-red-600 text-[9px]'}>ADC sample</text>
          </svg>
          <div className="grid gap-2 sm:grid-cols-3"><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">TRUE</p><p className="mt-1 font-mono text-sm font-bold">{current} A</p></div><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">INFERRED</p><p className="mt-1 font-mono text-sm font-bold">{fmt(inferredCurrent, 1)} A</p></div><div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] font-black text-muted-foreground">AMP OUT</p><p className="mt-1 font-mono text-sm font-bold">{fmt(output, 2)} V</p></div></div>
          <StatusStrip tone={valid ? 'green' : 'red'}>Kelvin error {fmt(copperError * 1000, 1)} mV가 실제 shunt signal {fmt(trueSignal * 1000, 1)} mV와 함께 증폭된다. Filter가 부드럽게 보여도 raw sample identity가 invalid면 current loop를 닫지 않는다.</StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Shunt signal', value: `${fmt(trueSignal * 1000, 1)} mV` }, { label: 'Shunt dissipation', value: `${fmt(current ** 2 * shuntOhm, 2)} W` }, { label: 'Kelvin error', value: `${fmt(copperError * 1000, 1)} mV` }, { label: 'Close-loop gate', value: valid ? 'OPEN' : 'CLOSED', accent: valid }]} /></div>
    </LabFrame>
  );
}

type FaultType = 'short' | 'overcurrent' | 'bus' | 'uvlo';

export function ProtectionLatencyLab() {
  const [fault, setFault] = useState<FaultType>('short');
  const [blanking, setBlanking] = useState(600);
  const [propagation, setPropagation] = useState(180);
  const [gateDischarge, setGateDischarge] = useState(120);
  const [hardwarePath, setHardwarePath] = useState(true);
  const detect = fault === 'short' ? 80 : fault === 'overcurrent' ? 260 : fault === 'bus' ? 900 : 140;
  const blank = fault === 'short' || fault === 'overcurrent' ? blanking : 0;
  const firmwarePenalty = hardwarePath ? 0 : 5000;
  const totalNs = detect + blank + propagation + gateDischarge + firmwarePenalty;
  const faultCurrent = fault === 'short' ? 220 : fault === 'overcurrent' ? 110 : 30;
  const deviceVoltage = fault === 'bus' ? 75 : 48;
  const energy = deviceVoltage * faultCurrent * totalNs * 1e-9;
  const safe = hardwarePath && totalNs < 1800 && fault !== 'bus';
  const segments = [
    { label: 'detect', value: detect, color: '#2563eb' },
    { label: 'blank', value: blank, color: '#d97706' },
    { label: 'propagate', value: propagation, color: '#7c3aed' },
    { label: 'gate off', value: gateDischarge, color: '#0f766e' },
    ...(firmwarePenalty ? [{ label: 'firmware', value: firmwarePenalty, color: '#dc2626' }] : []),
  ];
  return (
    <LabFrame index="09" icon={<ShieldCheck className="h-4 w-4" />} title="Fault detection에서 gate energy 제거까지의 latency budget" status={safe ? 'INDEPENDENT TRIP ARMED' : 'FAULT ENERGY UNBOUNDED'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Injected fault" value={fault} onChange={setFault} options={[{ value: 'short', label: 'Short' }, { value: 'overcurrent', label: 'Overcurrent' }, { value: 'bus', label: 'Bus OV' }, { value: 'uvlo', label: 'Gate UVLO' }]} />
          <RangeControl label="Comparator blanking" value={blanking} min={0} max={1800} step={100} unit=" ns" onChange={setBlanking} accent="amber" />
          <RangeControl label="Driver propagation" value={propagation} min={50} max={800} step={10} unit=" ns" onChange={setPropagation} accent="violet" />
          <RangeControl label="Gate discharge" value={gateDischarge} min={40} max={600} step={10} unit=" ns" onChange={setGateDischarge} />
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3"><input type="checkbox" checked={hardwarePath} onChange={(event) => setHardwarePath(event.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-600" /><span><span className="block text-sm font-semibold">Independent hardware shutdown</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">MCU task가 멈춰도 driver/PWM trip path가 gate를 끈다.</span></span></label>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black text-muted-foreground">FAULT-OFF TIMELINE</p><p className="mt-1 font-mono text-3xl font-black">{totalNs >= 1000 ? `${fmt(totalNs / 1000, 2)} µs` : `${fmt(totalNs, 0)} ns`}</p></div><span className="font-mono text-xs text-muted-foreground">≈ {fmt(energy * 1000, 1)} mJ</span></div>
          <div className="mt-6 flex h-12 overflow-hidden rounded-sm border border-border bg-background">
            {segments.map((segment) => <div key={segment.label} className="flex min-w-[2px] items-center justify-center" style={{ width: `${segment.value / totalNs * 100}%`, backgroundColor: segment.color }}><span className="hidden px-1 text-[8px] font-bold text-white sm:block">{segment.value / totalNs > 0.12 ? segment.label : ''}</span></div>)}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{segments.map((segment) => <div key={segment.label} className="grid grid-cols-[0.65rem_minmax(0,1fr)_4.5rem] items-center gap-2 rounded-md border border-border bg-background p-2.5 text-xs"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: segment.color }} /><span className="font-semibold">{segment.label}</span><span className="text-right font-mono text-muted-foreground">{segment.value} ns</span></div>)}</div>
          <StatusStrip tone={safe ? 'green' : 'red'}><strong>{fault === 'bus' ? 'VDS OCP는 bus overvoltage의 주 보호가 아니다.' : hardwarePath ? 'Hardware가 first owner다.' : 'Firmware latency가 fault path에 들어왔다.'}</strong><br /><span className="text-muted-foreground">Blanking은 switching overshoot 오검출을 막지만 그 시간 동안 실제 short도 보지 못한다. SOA와 target waveform evidence가 별도로 필요하다.</span></StatusStrip>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Detection owner', value: fault === 'bus' ? 'BUS MONITOR' : fault === 'uvlo' ? 'GATE DRIVER' : 'COMPARATOR / VDS' }, { label: 'Total off latency', value: totalNs >= 1000 ? `${fmt(totalNs / 1000, 2)} µs` : `${fmt(totalNs, 0)} ns` }, { label: 'Let-through estimate', value: `${fmt(energy * 1000, 1)} mJ` }, { label: 'Advance gate', value: safe ? 'ALLOW' : 'BLOCK', accent: safe }]} /></div>
    </LabFrame>
  );
}

type BringupStage = 'unpowered' | 'bias' | 'gate' | 'limited' | 'trip' | 'thermal';
type BringupFault = 'none' | 'short' | 'uvlo' | 'polarity' | 'ringing' | 'hot';

export function BringupEvidenceLab() {
  const [stage, setStage] = useState<BringupStage>('gate');
  const [fault, setFault] = useState<BringupFault>('ringing');
  const stages: Array<{ value: BringupStage; label: string; instrument: string; expected: string; blockedBy: BringupFault[] }> = [
    { value: 'unpowered', label: '01 Unpowered', instrument: 'DMM · microscope', expected: 'No short, correct polarity, known discharge', blockedBy: ['short'] },
    { value: 'bias', label: '02 Bias / UVLO', instrument: 'Current-limited PSU · scope', expected: 'Rails sequence, UVLO, nFAULT and gate-off state', blockedBy: ['short', 'uvlo'] },
    { value: 'gate', label: '03 Gate waveform', instrument: 'Differential probe · spring ground', expected: 'VGS amplitude, dead time, Miller margin and no overlap', blockedBy: ['short', 'uvlo', 'ringing'] },
    { value: 'limited', label: '04 Limited bus', instrument: 'DC source · voltage/current probes', expected: 'VSW overshoot, commutation path and shunt polarity', blockedBy: ['short', 'uvlo', 'polarity', 'ringing'] },
    { value: 'trip', label: '05 Trip injection', instrument: 'Fault fixture · logic capture', expected: 'Independent gate removal, latched cause and supervised reset', blockedBy: ['short', 'uvlo', 'polarity', 'ringing'] },
    { value: 'thermal', label: '06 Envelope', instrument: 'Thermocouple/IR · power analyzer', expected: 'Loss, junction estimate, derating and repeatable margin', blockedBy: ['short', 'uvlo', 'polarity', 'ringing', 'hot'] },
  ];
  const selected = stages.find((item) => item.value === stage) ?? stages[0];
  const blocked = selected.blockedBy.includes(fault);
  const selectedIndex = stages.findIndex((item) => item.value === stage);
  return (
    <LabFrame index="10" icon={<CircuitBoard className="h-4 w-4" />} title="Full-power 이전에 evidence gate를 한 단계씩 닫기" status={blocked ? 'DO NOT ADVANCE' : 'STAGE EVIDENCE PASSED'} danger={blocked}>
      <div className="p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="min-w-0 space-y-5">
            <SegmentedControl label="Bring-up stage" value={stage} onChange={setStage} options={stages.map((item) => ({ value: item.value, label: item.label }))} />
            <SegmentedControl label="Injected defect" value={fault} onChange={setFault} options={[{ value: 'none', label: '정상' }, { value: 'short', label: 'DC short' }, { value: 'uvlo', label: 'UVLO' }, { value: 'polarity', label: 'Sense sign' }, { value: 'ringing', label: 'Overshoot' }, { value: 'hot', label: 'Thermal' }]} />
            <StatusStrip tone={blocked ? 'red' : 'green'}><strong>{selected.instrument}</strong><br /><span className="text-muted-foreground">{selected.expected}</span></StatusStrip>
          </div>
          <div className="min-w-0">
            <div className="grid gap-2 sm:grid-cols-2">
              {stages.map((item, index) => { const done = index < selectedIndex; const active = index === selectedIndex; const localBlock = active && blocked; return <button key={item.value} type="button" onClick={() => setStage(item.value)} className={`min-w-0 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${localBlock ? 'border-red-500/40 bg-red-500/[0.04]' : active ? 'border-teal-500/40 bg-teal-500/[0.04]' : done ? 'border-emerald-500/25 bg-emerald-500/[0.025]' : 'border-border bg-background'}`}><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>{done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : localBlock ? <AlertTriangle className="h-3.5 w-3.5 text-red-600" /> : <span className={`h-2 w-2 rounded-full ${active ? 'bg-teal-500' : 'bg-border'}`} />}</div><p className="mt-2 text-xs font-black">{item.label.replace(/^\d+\s/, '')}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.instrument}</p></button>; })}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3"><div className="rounded-md border border-border p-3"><p className="text-[10px] font-black text-muted-foreground">COMMAND</p><p className="mt-1 font-mono text-xs font-bold">{selectedIndex >= 2 ? 'PWM input' : 'power state'}</p></div><div className="rounded-md border border-border p-3"><p className="text-[10px] font-black text-muted-foreground">PHYSICAL</p><p className="mt-1 font-mono text-xs font-bold">{selectedIndex >= 3 ? 'VGS / VSW / Iphase' : 'rail / gate off'}</p></div><div className="rounded-md border border-border p-3"><p className="text-[10px] font-black text-muted-foreground">DECISION</p><p className={`mt-1 font-mono text-xs font-bold ${blocked ? 'text-red-600' : 'text-emerald-700'}`}>{blocked ? 'HOLD' : 'ADVANCE'}</p></div></div>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Selected stage', value: selected.label.toUpperCase() }, { label: 'Injected defect', value: fault.toUpperCase() }, { label: 'Evidence owner', value: selected.instrument.split(' · ')[0].toUpperCase() }, { label: 'Next-stage gate', value: blocked ? 'CLOSED' : 'OPEN', accent: !blocked }]} /></div>
    </LabFrame>
  );
}
