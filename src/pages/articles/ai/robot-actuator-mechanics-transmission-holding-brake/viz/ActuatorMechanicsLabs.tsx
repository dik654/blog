import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  BadgeCheck,
  CircleGauge,
  Disc3,
  FileCheck2,
  Gauge,
  GitCompareArrows,
  Orbit,
  RotateCcw,
  ScanLine,
  ShieldAlert,
  TimerReset,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function LabFrame({ index, title, status, danger = false, icon, children }: { index: string; title: string; status: string; danger?: boolean; icon: ReactNode; children: ReactNode }) {
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-20">
      <span aria-label={`Joint lab ${index}`} className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300">{icon} JOINT LAB</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
    </figcaption>
    {children}
  </figure>;
}

function RangeControl({ label, value, min, max, step = 1, unit, onChange, tone = 'blue' }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void; tone?: 'blue' | 'teal' | 'amber' | 'violet' }) {
  const accent = { blue: 'accent-blue-600', teal: 'accent-teal-600', amber: 'accent-amber-600', violet: 'accent-violet-600' }[tone];
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span><input className={`h-2 w-full cursor-pointer ${accent}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Status({ tone = 'neutral', children }: { tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red'; children: ReactNode }) {
  const css = { neutral: 'border-border bg-muted/[0.12]', blue: 'border-blue-500/30 bg-blue-500/[0.04]', green: 'border-emerald-500/30 bg-emerald-500/[0.04]', amber: 'border-amber-500/30 bg-amber-500/[0.045]', red: 'border-red-500/30 bg-red-500/[0.045]' }[tone];
  return <div className={`rounded-md border p-3 text-xs leading-relaxed ${css}`}>{children}</div>;
}

function MiniBar({ label, value, max, tone = 'blue', suffix = '' }: { label: string; value: number; max: number; tone?: 'blue' | 'teal' | 'amber' | 'red' | 'violet'; suffix?: string }) {
  const color = { blue: 'bg-blue-600', teal: 'bg-teal-600', amber: 'bg-amber-500', red: 'bg-red-500', violet: 'bg-violet-600' }[tone];
  return <div className="grid min-w-0 grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs"><span className="truncate font-semibold" title={label}>{label}</span><span className="h-2 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/40"><span className={`block h-full ${color}`} style={{ width: `${clamp(value / Math.max(max, 0.001) * 100, 2, 100)}%` }} /></span><span className="text-right font-mono text-muted-foreground">{fmt(value, 1)}{suffix}</span></div>;
}

type BoundaryLayer = 'motor' | 'reducer' | 'bearing' | 'brake' | 'encoder' | 'link';

export function ActuatorBoundaryLab() {
  const [layer, setLayer] = useState<BoundaryLayer>('reducer');
  const data: Record<BoundaryLayer, { owns: string; hides: string; evidence: string }> = {
    motor: { owns: 'Current → electromagnetic torque, rotor speed·temperature', hides: 'Output deflection, reducer loss와 link angle', evidence: 'Torque constant, current trace, thermal limit' },
    reducer: { owns: 'Ratio, efficiency, stiffness, lost motion, rated duty', hides: 'Motor current와 external bearing moment', evidence: 'Exact size·ratio·revision catalog + measured trace' },
    bearing: { owns: 'Radial·axial force와 tilting moment', hides: 'Gear torque rating과 brake timing', evidence: 'Load spectrum, mounting, static/dynamic life check' },
    brake: { owns: 'De-energized holding torque와 engagement state', hides: 'Active deceleration, STO와 link accuracy', evidence: 'Torque, delay, wear, temperature, sequence proof' },
    encoder: { owns: '설치된 shaft의 angle sample', hides: '센서 뒤쪽의 compliance와 lost motion', evidence: 'Reference side, timestamp, scale, alignment, residual' },
    link: { owns: 'Payload inertia, gravity torque, external force와 pose', hides: 'Internal shaft stress와 motor electrical state', evidence: 'Configuration envelope and measured load' },
  };
  const stack = [
    ['motor', 'Motor', '전류·rotor'], ['encoder', 'Encoder', '관측 side'], ['reducer', 'Reducer', 'ratio·elasticity'], ['bearing', 'Bearing', 'force·moment'], ['brake', 'Brake', 'holding'], ['link', 'Robot link', 'payload·gravity'],
  ] as const;
  return <LabFrame index="01" icon={<Disc3 className="h-4 w-4" />} title="Motor current에서 link motion까지 물리 경계를 열기" status="BOUNDARY DECLARED">
    <div className="p-4 sm:p-6"><div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{stack.map(([key, label, note], index) => <button key={key} type="button" aria-pressed={layer === key} onClick={() => setLayer(key)} className={`min-h-[6.5rem] border p-3 text-left ${layer === key ? 'border-blue-500/45 bg-blue-500/[0.05]' : 'border-border bg-muted/[0.04]'} ${index === 0 ? 'rounded-t-md sm:rounded-l-md sm:rounded-tr-none' : ''} ${index === stack.length - 1 ? 'rounded-b-md sm:rounded-r-md sm:rounded-bl-none' : ''}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><p className="mt-2 text-sm font-black">{label}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></button>)}</div><div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">OWNS</p><p className="mt-2 text-xs leading-relaxed">{data[layer].owns}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">DOES NOT SHOW</p><p className="mt-2 text-xs leading-relaxed">{data[layer].hides}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">CLOSE WITH</p><p className="mt-2 text-xs leading-relaxed">{data[layer].evidence}</p></div></div><div className="mt-4"><Status tone="amber">`3 N·m × 100 = 300 N·m`은 이상적인 한 연산일 뿐입니다. 어떤 torque, 어느 side, 어떤 speed·duty·efficiency·component limit인지 닫혀야 joint claim이 됩니다.</Status></div></div>
  </LabFrame>;
}

type Direction = 'motor-driven' | 'load-driven';

export function RatioWorkbenchLab() {
  const [ratio, setRatio] = useState(100);
  const [speed, setSpeed] = useState(3000);
  const [torque, setTorque] = useState(2.4);
  const [efficiency, setEfficiency] = useState(75);
  const [direction, setDirection] = useState<Direction>('motor-driven');
  const eta = efficiency / 100;
  const outputSpeed = speed / ratio;
  const idealTorque = torque * ratio;
  const outputTorque = direction === 'motor-driven' ? idealTorque * eta : idealTorque / Math.max(eta, 0.01);
  const inputPower = torque * speed * Math.PI / 30;
  const outputPower = direction === 'motor-driven' ? inputPower * eta : inputPower / Math.max(eta, 0.01);
  const speedConflict = outputSpeed < 15;
  return <LabFrame index="02" icon={<CircleGauge className="h-4 w-4" />} title="감속비가 speed·torque·power에 동시에 만드는 변화" status={speedConflict ? 'TORQUE GAIN / SPEED COST' : 'OPERATING POINT VISIBLE'} danger={speedConflict}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Power-flow direction" value={direction} onChange={setDirection} options={[{ value: 'motor-driven', label: 'Motor → link' }, { value: 'load-driven', label: 'Load → motor' }]} /><RangeControl label="Reduction ratio" value={ratio} min={20} max={180} step={5} unit=":1" onChange={setRatio} /><RangeControl label="Motor speed" value={speed} min={500} max={6000} step={100} unit=" rpm" onChange={setSpeed} tone="violet" /><RangeControl label="Motor torque" value={torque} min={0.2} max={3} step={0.1} unit=" N·m" onChange={setTorque} tone="teal" /><RangeControl label="Declared efficiency" value={efficiency} min={35} max={95} unit="%" onChange={setEfficiency} tone="amber" /></div><div><div className="grid gap-4 rounded-md border border-border bg-muted/[0.04] p-4"><div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3"><div className="min-w-0"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">MOTOR SIDE</p><p className="mt-2 break-words font-mono text-lg font-black">{speed} rpm</p><p className="font-mono text-sm">{fmt(torque, 1)} N·m</p></div><div className="grid place-items-center rounded-full border border-border bg-background p-3"><span className="font-mono text-xs font-black">{ratio}:1</span></div><div className="min-w-0 text-right"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">OUTPUT SIDE</p><p className="mt-2 break-words font-mono text-lg font-black">{fmt(outputSpeed, 1)} rpm</p><p className="font-mono text-sm">{fmt(outputTorque, 1)} N·m</p></div></div><div className="h-2 overflow-hidden rounded-sm bg-muted"><div className="h-full bg-amber-500" style={{ width: `${100 - efficiency}%` }} /></div><p className="text-xs text-muted-foreground">Amber portion = declared operating-point loss. Reverse flow needs its own efficiency/friction model.</p></div><div className="mt-4"><Status tone={speedConflict ? 'red' : 'green'}>{speedConflict ? '더 큰 ratio가 torque 숫자는 키웠지만 output speed를 요구 범위 아래로 낮췄다. Ratio는 free gain이 아니다.' : 'Torque와 speed가 같은 ratio에 의해 반대 방향으로 움직이고 power loss가 별도로 남는다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Ideal output torque', value: `${fmt(idealTorque, 1)} N·m` }, { label: 'Efficiency-adjusted', value: `${fmt(outputTorque, 1)} N·m` }, { label: 'Input power', value: `${fmt(inputPower, 0)} W` }, { label: 'Output power screen', value: `${fmt(outputPower, 0)} W`, accent: !speedConflict }]} /></div>
  </LabFrame>;
}

export function ReflectedInertiaLab() {
  const [ratio, setRatio] = useState(80);
  const [loadMass, setLoadMass] = useState(8);
  const [radius, setRadius] = useState(0.55);
  const [motorInertia, setMotorInertia] = useState(0.0007);
  const [inputInertia, setInputInertia] = useState(0.0004);
  const loadInertia = loadMass * radius * radius;
  const reflected = loadInertia / (ratio * ratio);
  const total = motorInertia + inputInertia + reflected;
  const inertiaRatio = reflected / Math.max(motorInertia + inputInertia, 1e-8);
  const accelTorque = total * 240;
  const heuristic = inertiaRatio > 5;
  return <LabFrame index="03" icon={<Orbit className="h-4 w-4" />} title="Payload inertia를 motor side로 옮겨 control plant 만들기" status={heuristic ? 'HEURISTIC FLAG / NOT A THEOREM' : 'REFLECTION ACCOUNTED'} danger={heuristic}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><RangeControl label="Reduction ratio" value={ratio} min={20} max={160} step={5} unit=":1" onChange={setRatio} /><RangeControl label="Payload mass" value={loadMass} min={1} max={25} unit=" kg" onChange={setLoadMass} tone="teal" /><RangeControl label="Payload radius" value={radius} min={0.1} max={0.9} step={0.05} unit=" m" onChange={setRadius} tone="violet" /><RangeControl label="Motor inertia" value={motorInertia} min={0.0002} max={0.002} step={0.0001} unit=" kg·m²" onChange={setMotorInertia} tone="amber" /><RangeControl label="Input coupling + gear inertia" value={inputInertia} min={0.0001} max={0.002} step={0.0001} unit=" kg·m²" onChange={setInputInertia} tone="amber" /></div><div><div className="space-y-4 rounded-md border border-border p-4"><MiniBar label="Rotor + input" value={(motorInertia + inputInertia) * 1000} max={Math.max(total * 1000, 0.1)} suffix="e-3" tone="blue" /><MiniBar label="Load reflected" value={reflected * 1000} max={Math.max(total * 1000, 0.1)} suffix="e-3" tone="teal" /><MiniBar label="Total motor side" value={total * 1000} max={Math.max(total * 1000, 0.1)} suffix="e-3" tone="violet" /><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-t border-border pt-4"><div><p className="text-xs font-semibold text-muted-foreground">Payload configuration</p><p className="mt-1 text-sm leading-relaxed">Radius가 2배면 point-mass inertia는 4배다.</p></div><span className="font-mono text-2xl font-black">{fmt(loadInertia, 2)}</span></div></div><div className="mt-4"><Status tone={heuristic ? 'amber' : 'green'}>{heuristic ? `Reflected/motor-side base ratio가 ${fmt(inertiaRatio, 1)}:1이다. 5:1은 review trigger가 될 수 있지만 stability proof가 아니며 controller, compliance와 bandwidth를 함께 봐야 한다.` : 'Rotor, coupling/reducer input과 reflected load가 같은 motor-side reference에 모였다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Load inertia', value: `${fmt(loadInertia, 3)} kg·m²` }, { label: 'Reflected load', value: `${fmt(reflected * 1000, 3)} ×10⁻³` }, { label: 'Inertia ratio', value: `${fmt(inertiaRatio, 1)} : 1` }, { label: '240 rad/s² torque', value: `${fmt(accelTorque, 2)} N·m`, accent: true }]} /></div>
  </LabFrame>;
}

export function DutyLifeLab() {
  const [accel, setAccel] = useState(2.6);
  const [hold, setHold] = useState(1.2);
  const [repeat, setRepeat] = useState(8);
  const [shock, setShock] = useState(3.2);
  const durations = [0.25, hold, 0.35, 0.08, repeat / 10];
  const torques = [72 * accel, 92, -58 * accel, shock * 70, 0];
  const totalTime = durations.reduce((sum, value) => sum + value, 0);
  const rms = Math.sqrt(torques.reduce((sum, value, index) => sum + value * value * durations[index], 0) / totalTime);
  const peak = Math.max(...torques.map(Math.abs));
  const repeatedLimit = 230;
  const rmsLimit = 115;
  const repeatedFail = peak > repeatedLimit || shock > 3.5;
  const thermalFail = rms > rmsLimit;
  const danger = repeatedFail || thermalFail;
  const labels = ['가속', '중력 유지', '역가속', '충돌 회복', 'Idle'];
  return <LabFrame index="04" icon={<Activity className="h-4 w-4" />} title="한 번의 peak를 반복 가능한 mission profile로 바꾸기" status={danger ? 'DUTY CONSTRAINT EXCEEDED' : 'CYCLE SCREEN PASSED'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><div className="space-y-5"><RangeControl label="Acceleration severity" value={accel} min={1} max={4} step={0.1} unit=" ×" onChange={setAccel} /><RangeControl label="Gravity hold time" value={hold} min={0.2} max={4} step={0.1} unit=" s" onChange={setHold} tone="teal" /><RangeControl label="Idle / cooling" value={repeat} min={1} max={30} unit=" ×0.1 s" onChange={setRepeat} tone="violet" /><RangeControl label="Shock severity" value={shock} min={1} max={5} step={0.1} unit=" ×" onChange={setShock} tone="amber" /></div><div><div className="grid h-48 grid-cols-5 items-end gap-2 border-b border-l border-border p-3" aria-label="한 주기의 torque와 duration 막대"><div className="h-full" style={{ height: `${clamp(accel / 4 * 100, 8, 100)}%` }}><div className="h-full bg-blue-600/75" /></div>{torques.slice(1).map((torque, index) => <div key={labels[index + 1]} className={`w-full ${index === 2 ? 'bg-red-500/75' : index === 3 ? 'bg-muted' : index === 1 ? 'bg-violet-600/70' : 'bg-teal-600/70'}`} style={{ height: `${clamp(Math.abs(torque) / 300 * 100 * (durations[index + 1] / Math.max(...durations)) ** 0.35, 4, 100)}%` }} />)}</div><div className="mt-2 grid grid-cols-5 gap-2 text-center text-[10px] font-semibold text-muted-foreground">{labels.map((label) => <span key={label} className="break-words">{label}</span>)}</div><div className="mt-4"><Status tone={danger ? 'red' : 'green'}>{repeatedFail ? '짧은 충격/peak가 repeated 또는 momentary limit를 넘는다. RMS가 낮아도 통과가 아니다.' : thermalFail ? `Peak는 허용돼도 전체 cycle의 RMS ${fmt(rms, 0)} N·m가 thermal duty limit를 넘는다.` : 'Peak, repeated event와 full-cycle RMS가 각각의 time base 안에서 확인됐다. 최종 life/temperature는 exact vendor procedure로 닫는다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Cycle time', value: `${fmt(totalTime, 2)} s` }, { label: 'Peak torque', value: `${fmt(peak, 0)} N·m` }, { label: 'RMS torque', value: `${fmt(rms, 0)} N·m` }, { label: 'First failed gate', value: repeatedFail ? 'PEAK / EVENT' : thermalFail ? 'RMS / THERMAL' : 'NONE', accent: !danger }]} /></div>
  </LabFrame>;
}

type AccuracyMode = 'backlash' | 'lost-motion' | 'hysteresis' | 'repeatability' | 'transmission';

export function AccuracyVocabularyLab() {
  const [mode, setMode] = useState<AccuracyMode>('lost-motion');
  const [motorView, setMotorView] = useState(false);
  const descriptions: Record<AccuracyMode, { stimulus: string; measure: string; result: string }> = {
    backlash: { stimulus: '무부하에서 tooth flank의 mechanical play 확인', measure: '접촉 없이 움직이는 각도 구간', result: 'Tooth geometry claim이며 전체 joint reversal error와 같지 않음' },
    'lost-motion': { stimulus: '작은 ±torque로 loading direction을 반전', measure: '같은 torque 부근의 output angle 차이', result: 'Elastic deformation, bearing·interface와 hysteresis가 함께 보일 수 있음' },
    hysteresis: { stimulus: 'Torque를 +에서 -로 완전 순환', measure: 'Loading/unloading loop의 폭과 면적', result: '경로 의존 오차와 dissipated behavior' },
    repeatability: { stimulus: '같은 방향·조건으로 목표를 반복 접근', measure: '도달 위치의 분산', result: 'Accuracy와 다르며 bias가 있어도 repeatable할 수 있음' },
    transmission: { stimulus: '한 회전 동안 input/output angle relation 추적', measure: 'Ideal ratio line 대비 periodic deviation', result: 'Position-dependent gear error이며 reversal test와 다른 측정' },
  };
  const selected = descriptions[mode];
  return <LabFrame index="05" icon={<ScanLine className="h-4 w-4" />} title="Backlash·lost motion·hysteresis를 측정 동작으로 구분하기" status={motorView ? 'OUTPUT ERROR HIDDEN' : 'OUTPUT TRACE OBSERVED'} danger={motorView}>
    <div className="p-4 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><SegmentedControl label="Accuracy term" value={mode} onChange={setMode} options={[{ value: 'backlash', label: 'Backlash' }, { value: 'lost-motion', label: 'Lost motion' }, { value: 'hysteresis', label: 'Hysteresis' }, { value: 'repeatability', label: 'Repeatability' }, { value: 'transmission', label: 'Transmission error' }]} /><button type="button" aria-pressed={motorView} onClick={() => setMotorView((value) => !value)} className="min-h-9 rounded border border-border bg-muted/20 px-3 text-xs font-semibold">{motorView ? 'Motor encoder view' : 'Output measurement'}</button></div><div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]"><div><div className="relative h-56 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] bg-[size:12.5%_25%]"><div className="absolute left-3 top-3 text-[10px] font-black text-muted-foreground">OUTPUT ANGLE ↑ · APPLIED TORQUE →</div><svg role="img" aria-label="Loading과 unloading의 angle torque trace" viewBox="0 0 600 220" className="h-full w-full" preserveAspectRatio="none"><path d="M40 180 C150 170 220 150 285 112 C350 75 430 48 560 38" fill="none" stroke={motorView ? '#2563eb' : '#0d9488'} strokeWidth="3" /><path d={motorView ? 'M40 180 C150 170 220 150 285 112 C350 75 430 48 560 38' : 'M40 166 C150 157 220 137 305 104 C385 74 460 52 560 48'} fill="none" stroke={motorView ? '#60a5fa' : '#d97706'} strokeWidth="3" strokeDasharray="7 5" /></svg><span className={`absolute bottom-5 left-1/2 -translate-x-1/2 rounded border px-2 py-1 text-[10px] font-black ${motorView ? 'border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300' : 'border-amber-500/35 bg-background text-amber-700 dark:text-amber-300'}`}>{motorView ? 'LINK-SIDE LOOP NOT OBSERVED' : mode.toUpperCase()}</span></div><div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-teal-600" /> Loading</span><span className="flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-amber-600" /> Unloading</span></div></div><div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border"><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">STIMULUS</p><p className="mt-2 text-xs leading-relaxed">{selected.stimulus}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">MEASURE</p><p className="mt-2 text-xs leading-relaxed">{selected.measure}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">INTERPRETATION</p><p className="mt-2 text-xs leading-relaxed">{selected.result}</p></div></div></div><div className="mt-4"><Status tone={motorView ? 'red' : 'green'}>{motorView ? 'Motor encoder는 reducer 앞 shaft의 smooth return을 보여줄 수 있다. 그 뒤의 compliance, lost motion과 link error는 output sensor/fixture 없이는 관측되지 않는다.' : '용어를 숫자 하나가 아니라 stimulus와 measurement operation으로 분리했다.'}</Status></div></div>
  </LabFrame>;
}

export function TorsionalComplianceLab() {
  const [torque, setTorque] = useState(60);
  const [model, setModel] = useState<'single' | 'piecewise'>('piecewise');
  const [housing, setHousing] = useState(18000);
  const [link, setLink] = useState(26000);
  const gearK = model === 'single' ? 22000 : torque < 20 ? 14000 : torque < 70 ? 22000 : 32000;
  const eqK = 1 / (1 / gearK + 1 / housing + 1 / link);
  const twist = torque / eqK;
  const gearOnlyTwist = torque / gearK;
  const energy = 0.5 * eqK * twist * twist;
  const tipError = twist * 0.65 * 1000;
  return <LabFrame index="06" icon={<RotateCcw className="h-4 w-4" />} title="Torsional stiffness를 angle error와 stored energy로 읽기" status={tipError > 8 ? 'COMPLIANCE DOMINATES ERROR' : 'ELASTIC STATE VISIBLE'} danger={tipError > 8}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Stiffness model" value={model} onChange={setModel} options={[{ value: 'single', label: 'One slope' }, { value: 'piecewise', label: 'Three regions' }]} /><RangeControl label="Output torque" value={torque} min={0} max={120} step={2} unit=" N·m" onChange={setTorque} /><RangeControl label="Housing stiffness" value={housing} min={8000} max={50000} step={1000} unit=" N·m/rad" onChange={setHousing} tone="amber" /><RangeControl label="Link stiffness" value={link} min={8000} max={50000} step={1000} unit=" N·m/rad" onChange={setLink} tone="teal" /></div><div><div className="grid gap-3 rounded-md border border-border p-4"><div className="grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)_4.5rem] items-center gap-3"><span className="text-xs font-semibold">Reducer</span><div className="relative h-5"><div className="absolute inset-y-2 left-0 right-0 border-t border-blue-500" /><div className="absolute inset-y-0 rounded-sm bg-blue-600/20 ring-1 ring-blue-500/35" style={{ left: '4%', right: `${clamp(gearOnlyTwist * 4000, 4, 64)}%` }} /></div><span className="text-right font-mono text-xs">K {fmt(gearK / 1000, 0)}k</span></div><div className="grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)_4.5rem] items-center gap-3"><span className="text-xs font-semibold">Housing</span><div className="h-1 bg-amber-500/60" /><span className="text-right font-mono text-xs">{fmt(housing / 1000, 0)}k</span></div><div className="grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)_4.5rem] items-center gap-3"><span className="text-xs font-semibold">Link</span><div className="h-1 bg-teal-600/60" /><span className="text-right font-mono text-xs">{fmt(link / 1000, 0)}k</span></div><div className="border-t border-border pt-4"><p className="text-xs leading-relaxed text-muted-foreground">세 부재가 series로 비틀리므로 가장 부드러운 부재가 전체 compliance를 지배한다. Catalog gear stiffness만 쓰면 실제 link error를 과소평가한다.</p></div></div><div className="mt-4"><Status tone={tipError > 8 ? 'red' : 'green'}>{model === 'piecewise' ? `현재 torque는 ${torque < 20 ? 'K₁' : torque < 70 ? 'K₂' : 'K₃'} region을 사용한다.` : '한 slope는 local approximation이며 reversal과 load region을 지우지 않도록 범위를 선언한다.'} Stored energy는 shock를 걸러주지만 release 뒤 recoil source가 된다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Equivalent stiffness', value: `${fmt(eqK / 1000, 1)} kN·m/rad` }, { label: 'Joint twist', value: `${fmt(twist * 180 / Math.PI, 3)}°` }, { label: '0.65 m tip error', value: `${fmt(tipError, 1)} mm` }, { label: 'Stored energy', value: `${fmt(energy, 3)} J`, accent: tipError <= 8 }]} /></div>
  </LabFrame>;
}

export function TwoMassResonanceLab() {
  const [motorInertia, setMotorInertia] = useState(0.035);
  const [loadInertia, setLoadInertia] = useState(0.11);
  const [stiffness, setStiffness] = useState(12000);
  const [damping, setDamping] = useState(8);
  const [bandwidth, setBandwidth] = useState(45);
  const omega = Math.sqrt(stiffness * (1 / motorInertia + 1 / loadInertia));
  const resonance = omega / (2 * Math.PI);
  const risk = bandwidth > resonance * (0.45 + damping / 100);
  const points = useMemo(() => Array.from({ length: 80 }, (_, i) => {
    const f = 2 + i * 1.5;
    const r = f / resonance;
    const zeta = clamp(damping / 100, 0.02, 0.3);
    const amp = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * zeta * r) ** 2);
    return [i / 79 * 560 + 20, 190 - clamp(amp, 0, 6) / 6 * 155] as const;
  }), [resonance, damping]);
  return <LabFrame index="07" icon={<Activity className="h-4 w-4" />} title="Rigid-body command 아래 숨은 two-mass resonance 찾기" status={risk ? 'BANDWIDTH ENTERS FLEXIBLE MODE' : 'MODE SEPARATION VISIBLE'} danger={risk}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><RangeControl label="Motor-side/output-referred inertia" value={motorInertia} min={0.01} max={0.12} step={0.005} unit=" kg·m²" onChange={setMotorInertia} /><RangeControl label="Load inertia" value={loadInertia} min={0.02} max={0.4} step={0.01} unit=" kg·m²" onChange={setLoadInertia} tone="teal" /><RangeControl label="Equivalent stiffness" value={stiffness} min={3000} max={30000} step={500} unit=" N·m/rad" onChange={setStiffness} tone="amber" /><RangeControl label="Damping screen" value={damping} min={2} max={25} unit="%" onChange={setDamping} tone="violet" /><RangeControl label="Control bandwidth" value={bandwidth} min={5} max={100} unit=" Hz" onChange={setBandwidth} /></div><div><div className="relative h-56 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] bg-[size:12.5%_25%]"><div className="absolute left-3 top-3 z-10 text-[10px] font-black text-muted-foreground">AMPLITUDE ↑ · EXCITATION FREQUENCY →</div><svg role="img" aria-label="두 관성의 상대 공진 주파수 응답" viewBox="0 0 600 220" className="h-full w-full" preserveAspectRatio="none"><polyline points={points.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={risk ? '#dc2626' : '#0d9488'} strokeWidth="3" /><line x1={clamp((bandwidth - 2) / 118 * 560 + 20, 20, 580)} x2={clamp((bandwidth - 2) / 118 * 560 + 20, 20, 580)} y1="24" y2="196" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 5" /></svg><span className="absolute bottom-3 left-3 rounded border border-border bg-background/90 px-2 py-1 font-mono text-[10px]">mode {fmt(resonance, 1)} Hz</span><span className="absolute bottom-3 right-3 rounded border border-blue-500/30 bg-background/90 px-2 py-1 font-mono text-[10px]">BW {bandwidth} Hz</span></div><div className="mt-4"><Status tone={risk ? 'red' : 'green'}>{risk ? 'Position loop가 lightly damped relative mode를 밀어 gain/phase margin을 잃을 수 있다. Gain 증가보다 plant identification, notch/active damping 또는 bandwidth 재배치가 먼저다.' : 'Command bandwidth와 flexible mode 사이에 screen margin이 있다. 실제 controller·delay·nonlinearity로 다시 검증한다.'}</Status></div></div></div>
  </LabFrame>;
}

export function DualEncoderObservabilityLab() {
  const [load, setLoad] = useState(75);
  const [trueStiffness, setTrueStiffness] = useState(15000);
  const [calError, setCalError] = useState(0);
  const [sync, setSync] = useState(0);
  const [noise, setNoise] = useState(0.01);
  const ratio = 100;
  const command = 36;
  const trueDeflection = load / trueStiffness;
  const motorEquivalent = command + trueDeflection * 180 / Math.PI;
  const outputMeasured = command + noise;
  const motorMeasured = motorEquivalent + sync * 0.02;
  const estimatedDeflection = (motorMeasured - outputMeasured) * Math.PI / 180;
  const estimatedTorque = trueStiffness * (1 + calError / 100) * estimatedDeflection;
  const error = Math.abs(estimatedTorque - load);
  const valid = error < 8;
  return <LabFrame index="08" icon={<GitCompareArrows className="h-4 w-4" />} title="Motor angle과 link angle 사이의 hidden elastic state 관측하기" status={valid ? 'LINK + DEFLECTION OBSERVED' : 'ESTIMATE INVALID'} danger={!valid}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><RangeControl label="Applied output torque" value={load} min={0} max={140} unit=" N·m" onChange={setLoad} /><RangeControl label="True stiffness" value={trueStiffness} min={6000} max={30000} step={500} unit=" N·m/rad" onChange={setTrueStiffness} tone="teal" /><RangeControl label="Calibration error" value={calError} min={-35} max={35} unit="%" onChange={setCalError} tone="amber" /><RangeControl label="Timestamp offset" value={sync} min={-20} max={20} unit=" ms" onChange={setSync} tone="violet" /><RangeControl label="Output sensor bias/noise" value={noise} min={-0.08} max={0.08} step={0.01} unit="°" onChange={setNoise} tone="violet" /></div><div><div className="rounded-md border border-border p-4"><div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3"><div><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">MOTOR ENCODER / i</p><p className="mt-1 font-mono text-xl font-black">{fmt(motorMeasured, 3)}°</p></div><span className="text-muted-foreground">−</span><div className="text-right"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">OUTPUT ENCODER</p><p className="mt-1 font-mono text-xl font-black">{fmt(outputMeasured, 3)}°</p></div></div><div className="relative h-10 rounded-sm bg-muted"><div className="absolute inset-y-0 left-1/2 w-px bg-foreground/30" /><div className={`absolute inset-y-2 rounded-sm ${estimatedDeflection >= 0 ? 'left-1/2 bg-violet-600/65' : 'right-1/2 bg-amber-500/70'}`} style={{ width: `${clamp(Math.abs(estimatedDeflection) * 1600, 2, 48)}%` }} /></div><p className="mt-2 text-center text-xs text-muted-foreground">Estimated reducer + structure deflection</p></div><div className="mt-4"><Status tone={valid ? 'green' : 'red'}>{valid ? '두 reference side와 calibrated stiffness를 이용해 link angle과 torque-like elastic state를 분리했다.' : `Torque estimate error가 ${fmt(error, 1)} N·m다. Dual encoder가 있어도 timestamp, alignment, noise와 stiffness calibration이 틀리면 residual을 잘못 해석한다.`}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'True deflection', value: `${fmt(trueDeflection * 180 / Math.PI, 3)}°` }, { label: 'Estimated deflection', value: `${fmt(estimatedDeflection * 180 / Math.PI, 3)}°` }, { label: 'Estimated torque', value: `${fmt(estimatedTorque, 1)} N·m` }, { label: 'Residual', value: `${fmt(error, 1)} N·m`, accent: valid }]} /></div>
  </LabFrame>;
}

export function OutputBearingLoadLab() {
  const [radial, setRadial] = useState(1600);
  const [axial, setAxial] = useState(700);
  const [offset, setOffset] = useState(0.22);
  const [shock, setShock] = useState(1.4);
  const capacity = 24000;
  const staticCapacity = 38000;
  const moment = radial * offset;
  const equivalent = shock * Math.sqrt(radial * radial + (1.6 * axial) ** 2 + (moment / 0.08) ** 2);
  const life = (capacity / Math.max(equivalent, 1)) ** (10 / 3);
  const danger = equivalent > capacity || shock * radial > staticCapacity;
  return <LabFrame index="09" icon={<Disc3 className="h-4 w-4" />} title="Output torque 밖의 radial·axial·tilting load 확인하기" status={danger ? 'BEARING LOAD EXCEEDED' : 'SCREEN WITHIN RATING'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><RangeControl label="Radial force" value={radial} min={100} max={5000} step={100} unit=" N" onChange={setRadial} /><RangeControl label="Axial force" value={axial} min={0} max={3000} step={100} unit=" N" onChange={setAxial} tone="teal" /><RangeControl label="Force offset" value={offset} min={0.02} max={0.5} step={0.01} unit=" m" onChange={setOffset} tone="violet" /><RangeControl label="Shock / duty factor" value={shock} min={1} max={3} step={0.1} unit=" ×" onChange={setShock} tone="amber" /></div><div><div className="relative h-56 overflow-hidden rounded-md border border-border"><div className="absolute left-[22%] top-[16%] h-[68%] w-16 rounded-sm border-2 border-foreground/25 bg-muted"><div className="absolute inset-y-2 left-1/2 w-px bg-foreground/35" /></div><div className="absolute left-[22%] top-1/2 h-px bg-violet-500" style={{ width: `${clamp(offset / 0.5 * 62, 12, 62)}%` }} /><div className="absolute right-3 top-[42%] text-right"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">OFFSET {fmt(offset, 2)} m</p><p className="mt-1 font-mono text-sm font-black">M = {fmt(moment, 0)} N·m</p></div><div className="absolute bottom-3 left-3 text-[10px] font-semibold text-muted-foreground">Bearing reference plane</div><div className="absolute left-[17%] top-3 text-xs font-black text-blue-700 dark:text-blue-300">↓ Fᵣ {radial} N</div><div className="absolute left-[34%] bottom-3 text-xs font-black text-teal-700 dark:text-teal-300">→ Fₐ {axial} N</div></div><div className="mt-4"><Status tone={danger ? 'red' : 'amber'}>{danger ? 'Equivalent or static load screen이 rating을 넘었다. Gear output torque가 허용돼도 joint bearing은 실패할 수 있다.' : '이 단순 equivalent-load screen은 geometry를 보이기 위한 것이다. Exact bearing type, spectrum, mounting, preload, lubrication, contamination과 static shock를 vendor method로 다시 계산한다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Tilting moment', value: `${fmt(moment, 0)} N·m` }, { label: 'Equivalent load screen', value: `${fmt(equivalent / 1000, 1)} kN` }, { label: 'Relative L10 factor', value: `${fmt(life, 1)} ×10⁶ rev` }, { label: 'Static / shock', value: shock * radial > staticCapacity ? 'REVIEW' : 'SCREEN OK', accent: !danger }]} /></div>
  </LabFrame>;
}

type Quadrant = 'motoring' | 'regenerating';

export function BackdriveFrictionLab() {
  const [quadrant, setQuadrant] = useState<Quadrant>('regenerating');
  const [load, setLoad] = useState(90);
  const [speed, setSpeed] = useState(12);
  const [friction, setFriction] = useState(42);
  const [temperature, setTemperature] = useState(35);
  const frictionThreshold = friction * (1 + Math.max(0, 25 - temperature) / 100);
  const backdrives = quadrant === 'regenerating' && load > frictionThreshold;
  const eta = clamp(0.86 - friction / 180 - Math.abs(45 - temperature) / 600, 0.25, 0.9);
  const loss = load * speed * (1 - eta);
  return <LabFrame index="10" icon={<Gauge className="h-4 w-4" />} title="방향·속도·preload가 efficiency와 backdrive를 바꾸는 방식" status={backdrives ? 'LOAD DRIVES MOTOR' : quadrant === 'regenerating' ? 'SELF-LOCK / STICK REGION' : 'MOTOR DRIVEN'} danger={quadrant === 'regenerating' && !backdrives}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Torque-speed quadrant" value={quadrant} onChange={setQuadrant} options={[{ value: 'motoring', label: 'Motor-driven' }, { value: 'regenerating', label: 'Load-driven' }]} /><RangeControl label="Output load torque" value={load} min={5} max={160} step={5} unit=" N·m" onChange={setLoad} /><RangeControl label="Output speed" value={speed} min={1} max={30} unit=" rad/s" onChange={setSpeed} tone="teal" /><RangeControl label="Friction / preload index" value={friction} min={10} max={100} unit="" onChange={setFriction} tone="amber" /><RangeControl label="Lubricant temperature" value={temperature} min={-10} max={90} unit="°C" onChange={setTemperature} tone="violet" /></div><div><div className="relative mx-auto aspect-square w-full max-w-[22rem] rounded-md border border-border bg-[linear-gradient(to_right,transparent_49.8%,hsl(var(--foreground)/.22)_50%,transparent_50.2%),linear-gradient(to_bottom,transparent_49.8%,hsl(var(--foreground)/.22)_50%,transparent_50.2%)]"><span className="absolute right-2 top-1/2 -translate-y-6 text-[10px] font-black text-muted-foreground">SPEED +</span><span className="absolute left-1/2 top-2 -translate-x-1/2 text-[10px] font-black text-muted-foreground">TORQUE +</span><span className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ${backdrives || quadrant === 'motoring' ? 'bg-teal-600 ring-teal-500/15' : 'bg-red-500 ring-red-500/15'}`} style={{ left: `${quadrant === 'motoring' ? 50 + speed / 30 * 42 : 50 - speed / 30 * 42}%`, top: `${50 - load / 160 * 42}%` }} /><div className="absolute bottom-3 left-3 max-w-[70%] rounded border border-border bg-background/90 px-2 py-1 text-[10px] leading-relaxed">같은 reducer도 motor-driven efficiency와 load-driven breakaway가 다르다.</div></div><div className="mt-4"><Status tone={quadrant === 'regenerating' && !backdrives ? 'red' : 'green'}>{quadrant === 'regenerating' ? backdrives ? 'Load torque가 estimated breakaway threshold를 넘어 motor side로 energy를 되돌린다. Regenerative electrical path도 별도로 필요하다.' : 'Static friction/preload threshold 아래라 motion이 시작되지 않는다. 이를 universal self-lock safety claim으로 바꾸면 안 된다.' : 'Motor가 loss를 이기며 link를 구동한다. Efficiency는 현재 방향·load·speed·temperature state에 한정한다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Efficiency screen', value: `${fmt(eta * 100, 0)}%` }, { label: 'Breakaway threshold', value: `${fmt(frictionThreshold, 1)} N·m` }, { label: 'Mechanical loss', value: `${fmt(loss, 0)} W` }, { label: 'Backdrive state', value: backdrives ? 'MOVING' : 'NOT MOVING', accent: backdrives }]} /></div>
  </LabFrame>;
}

type BrakeOrder = 'correct' | 'sto-first' | 'release-first' | 'service-stop';

export function BrakeHandoverLab() {
  const [order, setOrder] = useState<BrakeOrder>('sto-first');
  const [gravity, setGravity] = useState(105);
  const [brakeTorque, setBrakeTorque] = useState(145);
  const [engageDelay, setEngageDelay] = useState(80);
  const [motorOverlap, setMotorOverlap] = useState(35);
  const wornTorque = order === 'service-stop' ? brakeTorque * 0.62 : brakeTorque;
  const unheldMs = order === 'correct' ? Math.max(0, engageDelay - motorOverlap - 70) : order === 'release-first' ? 55 : order === 'service-stop' ? 25 : Math.max(0, engageDelay - motorOverlap);
  const torqueEnough = wornTorque >= gravity * 1.25;
  const fallAngle = 0.5 * 4.2 * (unheldMs / 1000) ** 2 * 180 / Math.PI;
  const safe = order === 'correct' && torqueEnough && unheldMs === 0;
  return <LabFrame index="11" icon={<TimerReset className="h-4 w-4" />} title="Vertical axis에서 motor torque와 brake torque를 겹쳐 인계하기" status={safe ? 'HOLDING HANDOVER CLOSED' : 'FALL / WEAR HAZARD'} danger={!safe}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Command sequence" value={order} onChange={setOrder} options={[{ value: 'correct', label: 'Proven overlap' }, { value: 'sto-first', label: 'STO first' }, { value: 'release-first', label: 'Release first' }, { value: 'service-stop', label: 'Brake every stop' }]} /><RangeControl label="Gravity torque" value={gravity} min={30} max={180} step={5} unit=" N·m" onChange={setGravity} /><RangeControl label="Nominal brake holding torque" value={brakeTorque} min={50} max={260} step={5} unit=" N·m" onChange={setBrakeTorque} tone="teal" /><RangeControl label="Brake engagement delay" value={engageDelay} min={20} max={220} step={5} unit=" ms" onChange={setEngageDelay} tone="amber" /><RangeControl label="Motor torque overlap" value={motorOverlap} min={0} max={180} step={5} unit=" ms" onChange={setMotorOverlap} tone="violet" /></div><div><div className="space-y-4 rounded-md border border-border p-4"><div><div className="mb-2 flex justify-between text-[10px] font-black"><span>MOTOR HOLD TORQUE</span><span>{motorOverlap} ms overlap</span></div><div className="h-4 rounded-sm bg-muted"><div className="h-full rounded-sm bg-blue-600/75" style={{ width: `${clamp(motorOverlap / 180 * 100, 1, 100)}%` }} /></div></div><div><div className="mb-2 flex justify-between text-[10px] font-black"><span>BRAKE ENGAGEMENT</span><span>{engageDelay} ms</span></div><div className="relative h-4 rounded-sm bg-muted"><div className="absolute inset-y-0 rounded-sm bg-teal-600/75" style={{ left: `${clamp(engageDelay / 220 * 70, 2, 70)}%`, right: 0 }} /></div></div>{unheldMs > 0 && <div><div className="mb-2 flex justify-between text-[10px] font-black text-red-700 dark:text-red-300"><span>UNHELD WINDOW</span><span>{fmt(unheldMs, 0)} ms</span></div><div className="h-2 rounded-sm bg-red-500/75" style={{ width: `${clamp(unheldMs / 180 * 100, 2, 100)}%` }} /></div>}<div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-border pt-4"><p className="text-xs leading-relaxed text-muted-foreground">Spring-applied brake is a holding device. Repeated operational stops require explicit dynamic energy/duty evidence.</p><span className={`font-mono text-xl font-black ${fallAngle > 0 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{fmt(fallAngle, 3)}°</span></div></div><div className="mt-4"><Status tone={safe ? 'green' : 'red'}>{!torqueEnough ? 'Wear/temperature-adjusted brake torque가 declared gravity margin을 충족하지 않는다.' : order === 'sto-first' ? 'STO가 motor holding torque를 먼저 제거해 brake engagement 전 낙하 구간을 만든다.' : order === 'release-first' ? 'Startup에서 drive torque가 proven되기 전에 brake를 풀었다.' : order === 'service-stop' ? 'Standstill brake를 매 cycle의 dynamic stop에 사용해 wear와 holding torque 저하를 만들었다.' : 'Drive torque가 먼저 payload를 잡고 brake release를 허용하며, shutdown은 brake engagement를 확인한 뒤 torque를 제거한다.'}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Available brake torque', value: `${fmt(wornTorque, 0)} N·m` }, { label: 'Required with margin', value: `${fmt(gravity * 1.25, 0)} N·m` }, { label: 'Unheld interval', value: `${fmt(unheldMs, 0)} ms` }, { label: 'Predicted fall angle', value: `${fmt(fallAngle, 3)}°`, accent: safe }]} /></div>
  </LabFrame>;
}

type JointChange = 'none' | 'payload' | 'ratio' | 'mounting' | 'lubricant' | 'encoder' | 'brake' | 'trajectory';

export function JointCommissioningLab() {
  const [change, setChange] = useState<JointChange>('none');
  const rows = [
    { label: 'Reference side · units', invalid: ['ratio'] },
    { label: 'Configuration · duty trace', invalid: ['payload', 'ratio', 'trajectory'] },
    { label: 'Torque · speed · thermal', invalid: ['payload', 'ratio', 'lubricant', 'trajectory'] },
    { label: 'Stiffness · resonance sweep', invalid: ['payload', 'ratio', 'mounting', 'lubricant'] },
    { label: 'Accuracy · dual encoder residual', invalid: ['ratio', 'mounting', 'lubricant', 'encoder'] },
    { label: 'Bearing load · life', invalid: ['payload', 'mounting', 'trajectory'] },
    { label: 'Brake torque · timing', invalid: ['payload', 'ratio', 'brake', 'trajectory'] },
    { label: 'Source part · revision', invalid: ['ratio', 'lubricant', 'encoder', 'brake'] },
  ] as const;
  const invalid = rows.filter((row) => (row.invalid as readonly string[]).includes(change));
  const deployable = invalid.length === 0;
  return <LabFrame index="12" icon={<FileCheck2 className="h-4 w-4" />} title="변경 뒤에도 유효한 joint evidence만 남기기" status={deployable ? 'EVIDENCE SET CURRENT' : 'REVALIDATION REQUIRED'} danger={!deployable}>
    <div className="p-4 sm:p-6"><SegmentedControl label="Joint change" value={change} onChange={setChange} options={[{ value: 'none', label: 'Baseline' }, { value: 'payload', label: 'Payload' }, { value: 'ratio', label: 'Ratio' }, { value: 'mounting', label: 'Mounting' }, { value: 'lubricant', label: 'Lubricant' }, { value: 'encoder', label: 'Encoder' }, { value: 'brake', label: 'Brake' }, { value: 'trajectory', label: 'Trajectory' }]} /><div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{rows.map((row, index) => { const current = !(row.invalid as readonly string[]).includes(change); return <div key={row.label} className={`min-h-[7.5rem] bg-background p-4 ${current ? '' : 'bg-red-500/[0.045]'}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>{current ? <BadgeCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-red-600" />}</div><p className="mt-3 text-xs font-black leading-relaxed">{row.label}</p><p className="mt-1 text-[11px] text-muted-foreground">{current ? 'Current evidence retained' : 'Repeat analysis / test'}</p></div>; })}</div><div className="mt-4"><Status tone={deployable ? 'green' : 'red'}>{deployable ? 'Motion, duty, precision, mode, bearing와 holding evidence가 현재 hardware·trajectory revision에 연결돼 있다.' : `${change} 변경으로 ${invalid.length}개 evidence row가 stale 상태다. 이전 catalog badge나 controller pass가 교집합을 복구하지 않는다.`}</Status></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Current rows', value: `${rows.length - invalid.length}/${rows.length}` }, { label: 'Stale rows', value: String(invalid.length) }, { label: 'Selected change', value: change.toUpperCase() }, { label: 'Joint claim', value: deployable ? 'CURRENT' : 'BLOCKED', accent: deployable }]} /></div>
  </LabFrame>;
}
