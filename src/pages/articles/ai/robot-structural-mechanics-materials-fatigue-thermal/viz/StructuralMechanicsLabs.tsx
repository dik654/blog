import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Bolt,
  Boxes,
  ChartNoAxesCombined,
  Flame,
  Gauge,
  Layers3,
  Ruler,
  ScanSearch,
  TestTubeDiagonal,
  Waves,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function LabFrame({ title, status, danger = false, icon, children }: { title: string; status: string; danger?: boolean; icon: ReactNode; children: ReactNode }) {
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-20">
      <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300">{icon} STRUCTURE LAB</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
    </figcaption>
    {children}
  </figure>;
}

function Range({ label, value, min, max, step = 1, unit, tone = 'blue', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; tone?: 'blue' | 'teal' | 'amber' | 'violet'; onChange: (value: number) => void }) {
  const accent = { blue: 'accent-blue-600', teal: 'accent-teal-600', amber: 'accent-amber-600', violet: 'accent-violet-600' }[tone];
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span><input className={`h-2 w-full cursor-pointer ${accent}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Status({ tone = 'neutral', children }: { tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue'; children: ReactNode }) {
  const css = { neutral: 'border-border bg-muted/[0.12]', green: 'border-emerald-500/30 bg-emerald-500/[0.04]', amber: 'border-amber-500/30 bg-amber-500/[0.045]', red: 'border-red-500/30 bg-red-500/[0.045]', blue: 'border-blue-500/30 bg-blue-500/[0.04]' }[tone];
  return <div className={`rounded-md border p-3 text-xs leading-relaxed ${css}`}>{children}</div>;
}

function Bar({ label, value, max, color = '#2563eb', suffix = '' }: { label: string; value: number; max: number; color?: string; suffix?: string }) {
  return <div className="grid min-w-0 grid-cols-[minmax(5.25rem,auto)_minmax(0,1fr)_4.75rem] items-center gap-2 text-xs"><span className="truncate font-semibold" title={label}>{label}</span><span className="h-2 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/40"><span className="block h-full rounded-sm" style={{ width: `${clamp(value / Math.max(max, 1e-9) * 100, 2, 100)}%`, backgroundColor: color }} /></span><span className="text-right font-mono text-muted-foreground">{fmt(value, 1)}{suffix}</span></div>;
}

type LoadCase = 'reach' | 'accel' | 'contact' | 'estop';

export function LoadPathLab() {
  const [loadCase, setLoadCase] = useState<LoadCase>('reach');
  const [payload, setPayload] = useState(32);
  const [reach, setReach] = useState(1.1);
  const [offset, setOffset] = useState(0.18);
  const data: Record<LoadCase, { factor: number; force: number; label: string }> = {
    reach: { factor: 1, force: 0, label: '수평 정지' },
    accel: { factor: 1.55, force: 0, label: '가속' },
    contact: { factor: 1.15, force: 520, label: '접촉' },
    estop: { factor: 2.1, force: 0, label: '비상 정지' },
  };
  const active = data[loadCase];
  const gravity = payload * 9.81 * active.factor;
  const rootMoment = gravity * reach + active.force * reach;
  const bearingMoment = gravity * offset + active.force * offset;
  const critical = rootMoment > 900;
  return <LabFrame icon={<Boxes className="h-4 w-4" />} title="Payload에서 bearing·housing·base까지 하중 경로 추적" status={critical ? 'ROOT MOMENT CRITICAL' : 'LOAD CASE DECLARED'} danger={critical}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Structural load case" value={loadCase} onChange={setLoadCase} options={[{ value: 'reach', label: '수평 정지' }, { value: 'accel', label: '가속' }, { value: 'contact', label: '접촉' }, { value: 'estop', label: '비상 정지' }]} /><Range label="Payload" value={payload} min={5} max={55} unit=" kg" onChange={setPayload} /><Range label="Link reach" value={reach} min={0.3} max={1.5} step={0.05} unit=" m" tone="teal" onChange={setReach} /><Range label="Bearing offset" value={offset} min={0.04} max={0.35} step={0.01} unit=" m" tone="amber" onChange={setOffset} /></div><div><div className="relative h-64 overflow-hidden rounded-md border border-border bg-muted/[0.035]"><svg role="img" aria-label={`${active.label} 하중이 링크를 따라 관절과 베이스로 전달되는 자유물체도`} viewBox="0 0 680 260" className="h-full w-full"><line x1="85" y1="142" x2="580" y2="142" stroke="#111827" strokeWidth="13" strokeLinecap="round" /><circle cx="88" cy="142" r="31" fill="#ffffff" stroke="#2563eb" strokeWidth="3" /><circle cx="580" cy="142" r="27" fill="#ffffff" stroke="#0d9488" strokeWidth="3" /><line x1="580" y1="56" x2="580" y2="113" stroke="#dc2626" strokeWidth="3" /><path d="M570 99 L580 114 L590 99" fill="none" stroke="#dc2626" strokeWidth="3" /><line x1="88" y1="142" x2="88" y2="214" stroke="#d97706" strokeWidth="3" /><path d="M78 199 L88 215 L98 199" fill="none" stroke="#d97706" strokeWidth="3" /><path d="M118 106 A48 48 0 0 1 130 164" fill="none" stroke="#7c3aed" strokeWidth="3" /><path d="M123 154 L130 164 L134 151" fill="none" stroke="#7c3aed" strokeWidth="3" /></svg><span className="absolute left-4 top-4 rounded border border-border bg-background px-2 py-1 text-[10px] font-black">BASE REACTION</span><span className="absolute right-4 top-4 rounded border border-border bg-background px-2 py-1 text-[10px] font-black">{active.label}</span><span className="absolute bottom-4 left-4 rounded border border-violet-500/30 bg-background px-2 py-1 font-mono text-[10px]">M = r × F</span><span className="absolute bottom-4 right-4 rounded border border-teal-500/30 bg-background px-2 py-1 font-mono text-[10px]">reference plane</span></div><div className="mt-4"><Status tone={critical ? 'red' : 'green'}>{active.force > 0 ? 'Contact force와 gravity가 같은 link를 따라오지만 방향과 moment arm은 따로 보존한다.' : 'Gravity와 inertial multiplier를 load-case ledger에 묶었다.'} 한 FBD에서 얻은 reaction을 다른 cut에 다시 외력으로 더하지 않는다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Vertical/resultant force', value: `${fmt(gravity + active.force, 0)} N` }, { label: 'Root bending moment', value: `${fmt(rootMoment, 0)} N·m` }, { label: 'Bearing offset moment', value: `${fmt(bearingMoment, 0)} N·m` }, { label: 'Critical event', value: active.label, accent: !critical }]} /></div>
  </LabFrame>;
}

export function StressStrainLab() {
  const [force, setForce] = useState(42);
  const [area, setArea] = useState(280);
  const [length, setLength] = useState(420);
  const [material, setMaterial] = useState<'al' | 'steel' | 'polymer'>('al');
  const E = material === 'al' ? 69 : material === 'steel' ? 200 : 3.2;
  const stress = force * 1000 / area;
  const strain = stress / (E * 1000);
  const elongation = strain * length;
  const danger = strain > 0.002;
  return <LabFrame icon={<Ruler className="h-4 w-4" />} title="Force를 stress·strain·displacement로 한 단계씩 변환" status={danger ? 'LINEAR RANGE QUESTIONABLE' : 'UNITS AND MODEL VISIBLE'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Elastic material" value={material} onChange={setMaterial} options={[{ value: 'al', label: 'Aluminum' }, { value: 'steel', label: 'Steel' }, { value: 'polymer', label: 'Polymer' }]} /><Range label="Axial force" value={force} min={2} max={120} unit=" kN" onChange={setForce} /><Range label="Net section area" value={area} min={80} max={1200} step={20} unit=" mm²" tone="teal" onChange={setArea} /><Range label="Gauge length" value={length} min={80} max={900} step={20} unit=" mm" tone="violet" onChange={setLength} /></div><div><div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"><div className="rounded border border-blue-500/30 bg-blue-500/[0.035] p-3"><p className="text-[10px] font-black">FORCE / AREA</p><p className="mt-1 font-mono text-base font-black">{fmt(stress, 1)} MPa</p><p className="mt-1 text-xs text-muted-foreground">단면 평균 응력</p></div><span className="text-center text-muted-foreground">→</span><div className="rounded border border-violet-500/30 bg-violet-500/[0.035] p-3"><p className="text-[10px] font-black">STRESS / E</p><p className="mt-1 font-mono text-base font-black">{fmt(strain * 1e6, 0)} µε</p><p className="mt-1 text-xs text-muted-foreground">선형 탄성 변형률</p></div><span className="text-center text-muted-foreground">→</span><div className="rounded border border-teal-500/30 bg-teal-500/[0.035] p-3"><p className="text-[10px] font-black">STRAIN × LENGTH</p><p className="mt-1 font-mono text-base font-black">{fmt(elongation, 3)} mm</p><p className="mt-1 text-xs text-muted-foreground">측정 가능한 변위</p></div></div><div className="mt-5 space-y-3"><Bar label="Stress" value={stress} max={450} suffix=" MPa" /><Bar label="Strain" value={strain * 1e6} max={3000} color="#7c3aed" suffix=" µε" /><Bar label="Displacement" value={elongation} max={2} color="#0d9488" suffix=" mm" /></div><div className="mt-4"><Status tone={danger ? 'red' : 'blue'}>같은 force라도 area가 stress를, material E가 strain을, length가 displacement를 바꾼다. 평균 `F/A`는 hole edge나 shear distribution의 local peak를 말하지 않는다.</Status></div></div></div>
  </LabFrame>;
}

type SectionShape = 'solid' | 'tube';

export function SectionGeometryLab() {
  const [shape, setShape] = useState<SectionShape>('tube');
  const [height, setHeight] = useState(80);
  const [width, setWidth] = useState(50);
  const [wall, setWall] = useState(5);
  const [length, setLength] = useState(900);
  const [force, setForce] = useState(420);
  const h = height / 1000;
  const b = width / 1000;
  const t = Math.min(wall / 1000, Math.min(h, b) * 0.45);
  const area = shape === 'solid' ? b * h : b * h - Math.max(b - 2 * t, 0) * Math.max(h - 2 * t, 0);
  const I = shape === 'solid' ? b * h ** 3 / 12 : (b * h ** 3 - Math.max(b - 2 * t, 0) * Math.max(h - 2 * t, 0) ** 3) / 12;
  const M = force * length / 1000;
  const stress = M * (h / 2) / I / 1e6;
  const deflection = force * (length / 1000) ** 3 / (3 * 69e9 * I) * 1000;
  const mass = area * length / 1000 * 2700;
  const danger = stress > 180 || deflection > 2.5;
  return <LabFrame icon={<Layers3 className="h-4 w-4" />} title="단면의 재료 배치가 mass·strength·stiffness에 만드는 차이" status={danger ? 'STRESS OR DEFLECTION FAIL' : 'SECTION GATE PASSED'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Link section" value={shape} onChange={setShape} options={[{ value: 'solid', label: 'Solid' }, { value: 'tube', label: 'Tube' }]} /><Range label="Section height" value={height} min={35} max={150} step={5} unit=" mm" onChange={setHeight} /><Range label="Section width" value={width} min={25} max={100} step={5} unit=" mm" tone="teal" onChange={setWidth} /><Range label="Wall thickness" value={wall} min={2} max={18} unit=" mm" tone="amber" onChange={setWall} /><Range label="Cantilever length" value={length} min={300} max={1200} step={50} unit=" mm" tone="violet" onChange={setLength} /><Range label="Tip load" value={force} min={80} max={900} step={20} unit=" N" onChange={setForce} /></div><div><div className="grid gap-5 sm:grid-cols-[minmax(9rem,0.75fr)_minmax(0,1.25fr)]"><div className="grid min-h-52 place-items-center rounded-md border border-border bg-muted/[0.035]"><div className="relative border-2 border-blue-600 bg-blue-500/[0.06]" style={{ width: `${clamp(width * 1.25, 60, 125)}px`, height: `${clamp(height * 1.25, 60, 175)}px` }}>{shape === 'tube' && <div className="absolute bg-background" style={{ inset: `${clamp(wall * 1.25, 4, 22)}px` }} />}</div></div><div className="space-y-3"><Bar label="Cross-section area" value={area * 1e6} max={15000} suffix=" mm²" /><Bar label="Second moment I" value={I * 1e8} max={20} color="#7c3aed" suffix="e-8" /><Bar label="Root stress" value={stress} max={300} color={stress > 180 ? '#dc2626' : '#0d9488'} suffix=" MPa" /><Bar label="Tip deflection" value={deflection} max={8} color={deflection > 2.5 ? '#dc2626' : '#d97706'} suffix=" mm" /><Bar label="Link mass" value={mass} max={25} color="#64748b" suffix=" kg" /></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'green'}>Bending stress는 `I`에, deflection은 `EI`에 민감하다. 재료를 neutral axis에서 멀리 배치하면 적은 mass로 `I`를 크게 만들 수 있지만 local buckling, joint and manufacturing limits가 새로 생긴다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Area', value: `${fmt(area * 1e6, 0)} mm²` }, { label: 'I', value: `${fmt(I * 1e8, 2)} ×10⁻⁸ m⁴` }, { label: 'Root stress', value: `${fmt(stress, 1)} MPa` }, { label: 'Tip deflection', value: `${fmt(deflection, 2)} mm`, accent: !danger }]} /></div>
  </LabFrame>;
}

export function CombinedStressLab() {
  const [bending, setBending] = useState(135);
  const [torsion, setTorsion] = useState(62);
  const [yieldStrength, setYieldStrength] = useState(275);
  const vm = Math.sqrt(bending ** 2 + 3 * torsion ** 2);
  const principal1 = bending / 2 + Math.sqrt((bending / 2) ** 2 + torsion ** 2);
  const principal2 = bending / 2 - Math.sqrt((bending / 2) ** 2 + torsion ** 2);
  const margin = yieldStrength / vm - 1;
  const danger = margin < 0.25;
  return <LabFrame icon={<Gauge className="h-4 w-4" />} title="Bending normal stress와 torsional shear를 failure criterion으로 결합" status={danger ? 'YIELD MARGIN LOW' : 'COMBINED STATE VISIBLE'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]"><div className="space-y-5"><Range label="Bending normal stress" value={bending} min={0} max={320} unit=" MPa" onChange={setBending} /><Range label="Torsional shear stress" value={torsion} min={0} max={180} unit=" MPa" tone="teal" onChange={setTorsion} /><Range label="Temperature-adjusted yield" value={yieldStrength} min={120} max={520} step={5} unit=" MPa" tone="amber" onChange={setYieldStrength} /></div><div><div className="grid gap-5 sm:grid-cols-[12rem_minmax(0,1fr)]"><div className="relative mx-auto aspect-square w-full max-w-48 rounded-md border border-border bg-muted/[0.04]"><div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-border" /><div className="absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] -translate-y-1/2 bg-border" /><div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-12 border-2 border-blue-600 bg-blue-500/[0.05]" /><span className="absolute left-3 top-3 font-mono text-[10px]">σ</span><span className="absolute bottom-3 right-3 font-mono text-[10px]">τ</span></div><div className="space-y-3"><Bar label="Principal σ₁" value={Math.abs(principal1)} max={450} suffix=" MPa" /><Bar label="Principal σ₂" value={Math.abs(principal2)} max={450} color="#7c3aed" suffix=" MPa" /><Bar label="Von Mises" value={vm} max={450} color={danger ? '#dc2626' : '#0d9488'} suffix=" MPa" /><Bar label="Yield strength" value={yieldStrength} max={450} color="#d97706" suffix=" MPa" /></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'blue'}>Von Mises는 ductile isotropic yielding을 distortion energy로 screen한다. Brittle fracture, laminate failure, contact pressure and fatigue에는 같은 scalar를 자동 적용하지 않는다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Von Mises', value: `${fmt(vm, 1)} MPa` }, { label: 'Principal maximum', value: `${fmt(principal1, 1)} MPa` }, { label: 'Yield ratio', value: `${fmt(vm / yieldStrength, 2)}` }, { label: 'Margin', value: `${fmt(margin, 2)}`, accent: !danger }]} /></div>
  </LabFrame>;
}

export function StabilityLab() {
  const [notchRadius, setNotchRadius] = useState(3);
  const [nominalStress, setNominalStress] = useState(115);
  const [length, setLength] = useState(620);
  const [diameter, setDiameter] = useState(24);
  const [endCase, setEndCase] = useState<'pinned' | 'fixed-free' | 'fixed'>('pinned');
  const K = endCase === 'fixed-free' ? 2 : endCase === 'fixed' ? 0.5 : 1;
  const Kt = 1 + 2.2 / Math.sqrt(notchRadius);
  const localStress = nominalStress * Kt;
  const I = Math.PI * (diameter / 1000) ** 4 / 64;
  const pcr = Math.PI ** 2 * 200e9 * I / ((K * length / 1000) ** 2) / 1000;
  const danger = localStress > 300 || pcr < 28;
  return <LabFrame icon={<Activity className="h-4 w-4" />} title="Notch local failure와 slender-member buckling을 별도 gate로 검사" status={danger ? 'LOCAL OR STABILITY FAILURE' : 'TWO GATES SEPARATED'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Compression boundary" value={endCase} onChange={setEndCase} options={[{ value: 'fixed-free', label: '고정-자유' }, { value: 'pinned', label: '힌지-힌지' }, { value: 'fixed', label: '고정-고정' }]} /><Range label="Notch radius" value={notchRadius} min={1} max={16} unit=" mm" onChange={setNotchRadius} /><Range label="Nominal stress" value={nominalStress} min={30} max={220} step={5} unit=" MPa" tone="amber" onChange={setNominalStress} /><Range label="Compression length" value={length} min={200} max={1200} step={20} unit=" mm" tone="violet" onChange={setLength} /><Range label="Column diameter" value={diameter} min={12} max={50} unit=" mm" tone="teal" onChange={setDiameter} /></div><div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-md border border-border p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">LOCAL STRESS</p><div className="mt-5 flex h-28 items-center"><div className="h-12 flex-1 bg-blue-500/15 ring-1 ring-blue-500/40" /><div className="h-12 w-10 rounded-r-full border-r-4 border-red-500" style={{ borderRadius: `${notchRadius * 2}px` }} /><div className="h-12 flex-1 bg-blue-500/15 ring-1 ring-blue-500/40" /></div><p className="mt-3 font-mono text-sm font-black">Kₜ {fmt(Kt, 2)} · {fmt(localStress, 0)} MPa</p></div><div className="rounded-md border border-border p-4"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">GLOBAL STABILITY</p><div className="relative mt-5 h-28"><div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-violet-500/50" style={{ transform: `translateX(-50%) skewX(${clamp(28 / Math.max(pcr, 1) * 16, 1, 18)}deg)` }} /><div className="absolute inset-x-6 top-0 h-px bg-foreground" /><div className="absolute inset-x-6 bottom-0 h-px bg-foreground" /></div><p className="mt-3 font-mono text-sm font-black">Pcr {fmt(pcr, 1)} kN</p></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'green'}>Kt는 declared geometry와 elastic nominal field의 local amplification이다. Euler load는 ideal straight member의 eigenvalue screen이다. 둘 다 surface condition, plasticity, imperfection and joint flexibility evidence가 필요하다.</Status></div></div></div>
  </LabFrame>;
}

export function BoltedJointLab() {
  const [preload, setPreload] = useState(26);
  const [external, setExternal] = useState(18);
  const [jointStiffness, setJointStiffness] = useState(5);
  const [loadIntro, setLoadIntro] = useState(55);
  const [friction, setFriction] = useState(0.18);
  const boltStiffness = 1;
  const phi = boltStiffness / (boltStiffness + jointStiffness);
  const n = loadIntro / 100;
  const boltIncrement = n * phi * external;
  const clampRemaining = preload - (1 - n * phi) * external;
  const slipCapacity = friction * Math.max(clampRemaining, 0);
  const separation = clampRemaining <= 0;
  const slip = external * 0.22 > slipCapacity;
  const danger = separation || slip;
  return <LabFrame icon={<Bolt className="h-4 w-4" />} title="Preload·stiffness·load introduction이 bolt와 interface load를 나누는 방식" status={separation ? 'JOINT SEPARATED' : slip ? 'INTERFACE SLIP' : 'PRELOAD MAINTAINED'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><Range label="Installed preload" value={preload} min={6} max={48} unit=" kN" onChange={setPreload} /><Range label="External tension" value={external} min={0} max={55} unit=" kN" tone="amber" onChange={setExternal} /><Range label="Joint / bolt stiffness" value={jointStiffness} min={1} max={12} step={0.5} unit=" ×" tone="teal" onChange={setJointStiffness} /><Range label="Stiffness-based load introduction" value={loadIntro} min={10} max={100} unit="%" tone="violet" onChange={setLoadIntro} /><Range label="Interface friction" value={friction} min={0.05} max={0.35} step={0.01} unit="" tone="amber" onChange={setFriction} /></div><div><div className="grid gap-5 sm:grid-cols-[minmax(9rem,0.7fr)_minmax(0,1.3fr)]"><div className="relative mx-auto h-60 w-36"><div className={`absolute inset-x-3 top-12 h-16 border ${separation ? 'translate-y-[-3px] border-red-500 bg-red-500/[0.04]' : 'border-border bg-muted/20'}`} /><div className={`absolute inset-x-3 bottom-12 h-16 border ${separation ? 'translate-y-[3px] border-red-500 bg-red-500/[0.04]' : 'border-border bg-muted/20'}`} /><div className="absolute bottom-5 left-1/2 top-5 w-6 -translate-x-1/2 rounded-sm bg-blue-600/75" /><div className="absolute left-1/2 top-4 h-4 w-16 -translate-x-1/2 rounded-sm bg-blue-600" /><div className="absolute bottom-4 left-1/2 h-4 w-16 -translate-x-1/2 rounded-sm bg-blue-600" /><div className={`absolute inset-x-3 top-1/2 h-px ${separation ? 'bg-red-500' : slip ? 'bg-amber-500' : 'bg-emerald-500'}`} /></div><div className="space-y-3"><Bar label="Bolt load increase" value={boltIncrement} max={25} suffix=" kN" /><Bar label="Clamp remaining" value={Math.max(clampRemaining, 0)} max={45} color={separation ? '#dc2626' : '#0d9488'} suffix=" kN" /><Bar label="Slip capacity" value={slipCapacity} max={12} color={slip ? '#dc2626' : '#d97706'} suffix=" kN" /><Bar label="External shear screen" value={external * 0.22} max={12} color="#7c3aed" suffix=" kN" /></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'blue'}>Simple `C=Kb/(Kb+Kj)`는 baseline이다. NASA 2025의 load-introduction factor는 external load가 어느 stiffness path로 들어오는지 추가한다. Torque wrench setting은 friction scatter 때문에 installed preload measurement가 아니다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Stiffness factor φ', value: fmt(phi, 3) }, { label: 'Load introduction n', value: fmt(n, 2) }, { label: 'Bolt increment', value: `${fmt(boltIncrement, 2)} kN` }, { label: 'Interface state', value: separation ? 'GAP' : slip ? 'SLIP' : 'CLAMPED', accent: !danger }]} /></div>
  </LabFrame>;
}

type SpectrumOrder = 'high-low' | 'low-high';

export function FatigueSpectrumLab() {
  const [order, setOrder] = useState<SpectrumOrder>('high-low');
  const [highCycles, setHighCycles] = useState(1200);
  const [lowCycles, setLowCycles] = useState(18000);
  const [notch, setNotch] = useState(1.35);
  const highLife = 15000 / notch ** 3;
  const lowLife = 460000 / notch ** 3;
  const highDamage = highCycles / highLife;
  const lowDamage = lowCycles / lowLife;
  const miner = highDamage + lowDamage;
  const sequenceFactor = order === 'high-low' ? 1.22 : 0.88;
  const boundedDamage = miner * sequenceFactor;
  const danger = boundedDamage >= 1;
  const history = order === 'high-low' ? [0.92, 0.85, 0.78, 0.38, 0.32, 0.28, 0.25] : [0.25, 0.28, 0.32, 0.38, 0.78, 0.85, 0.92];
  return <LabFrame icon={<ChartNoAxesCombined className="h-4 w-4" />} title="Mission time history를 cycle ledger로 바꾸고 Miner의 순서 맹점 노출" status={danger ? 'DAMAGE SCREEN EXCEEDED' : 'MODEL BOUNDARY VISIBLE'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><div className="space-y-5"><SegmentedControl label="Load block order" value={order} onChange={setOrder} options={[{ value: 'high-low', label: 'High → low' }, { value: 'low-high', label: 'Low → high' }]} /><Range label="High-stress cycles" value={highCycles} min={100} max={8000} step={100} unit="" onChange={setHighCycles} /><Range label="Low-stress cycles" value={lowCycles} min={1000} max={90000} step={1000} unit="" tone="teal" onChange={setLowCycles} /><Range label="Fatigue notch/surface factor" value={notch} min={1} max={2.2} step={0.05} unit=" ×" tone="amber" onChange={setNotch} /></div><div><div className="relative h-48 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] bg-[size:12.5%_25%]"><svg role="img" aria-label={`${order} 순서의 반복 하중 블록`} viewBox="0 0 640 190" className="h-full w-full" preserveAspectRatio="none"><polyline points={history.flatMap((amp, index) => { const x = 28 + index * 86; return [`${x},${95 - amp * 72}`, `${x + 40},${95 + amp * 72}`, `${x + 80},${95 - amp * 72}`]; }).join(' ')} fill="none" stroke="#2563eb" strokeWidth="3" /></svg><span className="absolute left-3 top-3 text-[10px] font-black text-muted-foreground">STRESS HISTORY / REVERSALS</span></div><div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-3"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">HIGH BLOCK</p><p className="mt-1 font-mono text-lg font-black">{fmt(highDamage, 3)}</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">LOW BLOCK</p><p className="mt-1 font-mono text-lg font-black">{fmt(lowDamage, 3)}</p></div><div className="bg-background p-3"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">MINER SUM</p><p className="mt-1 font-mono text-lg font-black">{fmt(miner, 3)}</p></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'amber'}>순서를 바꿔도 Miner 합은 {fmt(miner, 3)}으로 같다. Manson et al.은 high→low와 low→high가 다른 잔여 수명을 보일 수 있음을 출발점으로 삼았다. `D&lt;1`은 model output이지 safe-life proof가 아니다.</Status></div></div></div>
  </LabFrame>;
}

export function ModalLab() {
  const [stiffness, setStiffness] = useState(13);
  const [mass, setMass] = useState(22);
  const [jointLoss, setJointLoss] = useState(18);
  const [excitation, setExcitation] = useState(31);
  const effectiveK = stiffness * 1e6 * (1 - jointLoss / 100);
  const frequency = Math.sqrt(effectiveK / mass) / (2 * Math.PI);
  const ratio = excitation / frequency;
  const amplification = 1 / Math.max(Math.abs(1 - ratio ** 2), 0.08);
  const danger = Math.abs(1 - ratio) < 0.25;
  const points = useMemo(() => Array.from({ length: 90 }, (_, index) => {
    const x = index / 89 * 560 + 20;
    const r = index / 89 * 2.4;
    const amp = 1 / Math.sqrt((1 - r * r) ** 2 + (0.08 * r) ** 2);
    return `${x},${190 - clamp(amp, 0, 10) / 10 * 155}`;
  }), []);
  return <LabFrame icon={<Waves className="h-4 w-4" />} title="Static stiffness를 modal frequency와 excitation separation으로 확장" status={danger ? 'EXCITATION NEAR MODE' : 'MODE SEPARATION VISIBLE'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]"><div className="space-y-5"><Range label="Analytical stiffness" value={stiffness} min={3} max={35} step={0.5} unit=" MN/m" onChange={setStiffness} /><Range label="Modal effective mass" value={mass} min={5} max={60} unit=" kg" tone="teal" onChange={setMass} /><Range label="Joint/boundary stiffness loss" value={jointLoss} min={0} max={45} unit="%" tone="amber" onChange={setJointLoss} /><Range label="Excitation / control feature" value={excitation} min={5} max={100} unit=" Hz" tone="violet" onChange={setExcitation} /></div><div><div className="relative h-56 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] bg-[size:12.5%_25%]"><svg role="img" aria-label="구조 모드와 가진 주파수의 상대 위치" viewBox="0 0 600 220" className="h-full w-full" preserveAspectRatio="none"><polyline points={points.join(' ')} fill="none" stroke={danger ? '#dc2626' : '#0d9488'} strokeWidth="3" /><line x1={clamp(ratio / 2.4 * 560 + 20, 20, 580)} x2={clamp(ratio / 2.4 * 560 + 20, 20, 580)} y1="24" y2="195" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 5" /></svg><span className="absolute bottom-3 left-3 rounded border border-border bg-background px-2 py-1 font-mono text-[10px]">mode {fmt(frequency, 1)} Hz</span><span className="absolute bottom-3 right-3 rounded border border-blue-500/30 bg-background px-2 py-1 font-mono text-[10px]">excite {excitation} Hz</span></div><div className="mt-4"><Status tone={danger ? 'red' : 'green'}>Analytical beam estimate보다 measured mode가 낮다면 boundary/joint/contact/effective mass가 우선 suspect다. Material E 하나를 임의 tuning해 맞추면 다른 mode와 static deflection을 동시에 망칠 수 있다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Effective stiffness', value: `${fmt(effectiveK / 1e6, 1)} MN/m` }, { label: 'First-mode screen', value: `${fmt(frequency, 1)} Hz` }, { label: 'Frequency ratio', value: fmt(ratio, 2) }, { label: 'Undamped amplification', value: `${fmt(amplification, 1)} ×`, accent: !danger }]} /></div>
  </LabFrame>;
}

type FeaView = 'peak' | 'structural' | 'reaction' | 'correlation';

export function FeaEvidenceLab() {
  const [mesh, setMesh] = useState(3);
  const [view, setView] = useState<FeaView>('peak');
  const [contact, setContact] = useState(true);
  const peak = 180 + mesh ** 1.55 * 18;
  const structural = 154 + 10 / mesh;
  const reactionError = contact ? 0.8 + 3 / mesh : 13 + 4 / mesh;
  const measured = 161;
  const correlationError = Math.abs(structural - measured) / measured * 100;
  const accepted = view === 'peak' ? false : view === 'reaction' ? reactionError < 5 : view === 'correlation' ? correlationError < 8 : mesh >= 3;
  const selected = { peak: `${fmt(peak, 0)} MPa`, structural: `${fmt(structural, 0)} MPa`, reaction: `${fmt(reactionError, 1)}%`, correlation: `${fmt(correlationError, 1)}%` }[view];
  return <LabFrame icon={<ScanSearch className="h-4 w-4" />} title="Mesh refinement, singular peak and physical evidence를 분리" status={accepted ? 'CLAIM HAS SUPPORT' : 'CONTOUR IS NOT PROOF'} danger={!accepted}>
    <div className="p-4 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><SegmentedControl label="FEA evidence view" value={view} onChange={setView} options={[{ value: 'peak', label: 'Peak contour' }, { value: 'structural', label: 'Away from edge' }, { value: 'reaction', label: 'Force balance' }, { value: 'correlation', label: 'Strain test' }]} /><button type="button" aria-pressed={contact} onClick={() => setContact((value) => !value)} className="min-h-9 rounded border border-border bg-muted/20 px-3 text-xs font-semibold">{contact ? 'Contact + preload ON' : 'Bonded shortcut'}</button></div><div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"><div><Range label="Local mesh refinement" value={mesh} min={1} max={8} unit=" ×" onChange={setMesh} /><div className="relative mt-5 h-60 overflow-hidden rounded-md border border-border bg-muted/[0.035]"><div className="absolute inset-5 grid" style={{ gridTemplateColumns: `repeat(${mesh * 3 + 4}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${mesh * 2 + 3}, minmax(0, 1fr))` }}>{Array.from({ length: (mesh * 3 + 4) * (mesh * 2 + 3) }, (_, index) => <span key={index} className="border-b border-r border-border/55" />)}</div><div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[12px] border-background ring-2 ring-red-500/70" /><div className="absolute right-4 top-4 rounded border border-border bg-background px-2 py-1 font-mono text-[10px]">{selected}</div><div className="absolute bottom-4 left-4 right-4 h-3 overflow-hidden rounded-sm bg-gradient-to-r from-blue-600 via-amber-400 to-red-600" /></div></div><div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border"><div className="bg-background p-4"><p className="text-[10px] font-black text-red-700 dark:text-red-300">PEAK</p><p className="mt-2 text-xs leading-relaxed">Sharp edge peak는 refinement와 함께 {fmt(peak, 0)} MPa로 계속 상승한다. Non-convergence 자체가 singular model clue다.</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">INVARIANT</p><p className="mt-2 text-xs leading-relaxed">Reaction balance {fmt(reactionError, 1)}%, structural field {fmt(structural, 0)} MPa, deformation shape and energy를 함께 본다.</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">PHYSICAL CORRELATION</p><p className="mt-2 text-xs leading-relaxed">Away-from-edge strain prediction과 gauge-derived 161 MPa의 차이는 {fmt(correlationError, 1)}%다.</p></div><div className="bg-background p-4"><Status tone={accepted ? 'green' : 'red'}>{accepted ? '선택한 claim에 대응하는 convergence 또는 measurement가 있다.' : 'Color scale과 maximum 하나만으로 yield, fatigue or life claim을 닫을 수 없다.'}</Status></div></div></div></div>
  </LabFrame>;
}

type ThermalPair = 'al-steel' | 'steel-steel' | 'polymer-steel';

export function ThermalLab() {
  const [heat, setHeat] = useState(85);
  const [resistance, setResistance] = useState(0.55);
  const [length, setLength] = useState(420);
  const [restraint, setRestraint] = useState(35);
  const [pair, setPair] = useState<ThermalPair>('al-steel');
  const deltaT = heat * resistance;
  const alphaMember = pair === 'al-steel' ? 23 : pair === 'steel-steel' ? 12 : 70;
  const alphaBolt = 12;
  const expansion = alphaMember * 1e-6 * (length / 1000) * deltaT * 1000;
  const thermalStress = 69e3 * alphaMember * 1e-6 * deltaT * restraint / 100;
  const preloadDirection = alphaMember - alphaBolt;
  const danger = deltaT > 55 || thermalStress > 140;
  return <LabFrame icon={<Flame className="h-4 w-4" />} title="Heat path를 expansion·thermal stress·bolt preload drift로 변환" status={danger ? 'THERMAL-MECHANICAL LIMIT' : 'TEMPERATURE FIELD CONNECTED'} danger={danger}>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><div className="space-y-5"><SegmentedControl label="Member and bolt material pair" value={pair} onChange={setPair} options={[{ value: 'al-steel', label: 'Al / steel' }, { value: 'steel-steel', label: 'Steel / steel' }, { value: 'polymer-steel', label: 'Polymer / steel' }]} /><Range label="Dissipated heat" value={heat} min={10} max={180} step={5} unit=" W" onChange={setHeat} /><Range label="Junction-to-ambient Rth" value={resistance} min={0.1} max={1.2} step={0.05} unit=" K/W" tone="amber" onChange={setResistance} /><Range label="Reference length" value={length} min={100} max={900} step={20} unit=" mm" tone="teal" onChange={setLength} /><Range label="Axial restraint screen" value={restraint} min={0} max={100} unit="%" tone="violet" onChange={setRestraint} /></div><div><div className="relative overflow-hidden rounded-md border border-border p-5"><div className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded border border-red-500/35 bg-red-500/[0.06] text-xs font-black">HEAT</span><span className="h-2 rounded-sm bg-gradient-to-r from-red-500 to-amber-400" /><span className="grid h-12 w-12 place-items-center rounded border border-amber-500/35 bg-amber-500/[0.05] text-xs font-black">SEAT</span><span className="h-2 rounded-sm bg-gradient-to-r from-amber-400 to-blue-500" /><span className="grid h-12 w-12 place-items-center rounded border border-blue-500/35 bg-blue-500/[0.05] text-xs font-black">AIR</span></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><div><p className="text-[10px] font-black text-red-700 dark:text-red-300">TEMPERATURE RISE</p><p className="mt-1 font-mono text-lg font-black">{fmt(deltaT, 1)} K</p></div><div><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">FREE EXPANSION</p><p className="mt-1 font-mono text-lg font-black">{fmt(expansion, 3)} mm</p></div><div><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">RESTRAINT STRESS</p><p className="mt-1 font-mono text-lg font-black">{fmt(thermalStress, 1)} MPa</p></div></div></div><div className="mt-4"><Status tone={danger ? 'red' : 'blue'}>{preloadDirection > 0 ? 'Member가 steel bolt보다 더 팽창하려는 pairing이다. Geometry와 load path에 따라 bolt preload가 증가할 수 있다.' : preloadDirection < 0 ? 'Bolt가 member보다 더 팽창하려는 pairing이다. Clamp loss 방향을 우선 검사한다.' : 'CTE가 유사해도 temperature gradient와 stiffness distribution은 preload를 바꿀 수 있다.'} Full restraint 식은 상한 screen이지 실제 joint stress가 아니다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Temperature rise', value: `${fmt(deltaT, 1)} K` }, { label: 'Free expansion', value: `${fmt(expansion, 3)} mm` }, { label: 'Restraint stress screen', value: `${fmt(thermalStress, 1)} MPa` }, { label: 'CTE difference', value: `${fmt(alphaMember - alphaBolt, 0)} µm/mK`, accent: !danger }]} /></div>
  </LabFrame>;
}

type EvidenceKind = 'strain' | 'deflection' | 'modal' | 'thermal' | 'preload';

export function CorrelationLab() {
  const [kind, setKind] = useState<EvidenceKind>('modal');
  const [model, setModel] = useState(100);
  const [measured, setMeasured] = useState(78);
  const data: Record<EvidenceKind, { unit: string; first: string; next: string; reject: string }> = {
    strain: { unit: 'µε', first: 'Load direction, gauge orientation and local geometry', next: 'Rosette + load-cell synchronized repeat', reject: 'Yield strength만 tuning' },
    deflection: { unit: 'mm', first: 'Fixture/joint compliance and reference point', next: 'Rigid reference laser/dial measurement', reject: 'Link E만 tuning' },
    modal: { unit: 'Hz', first: 'Boundary/joint stiffness, effective mass and contact', next: 'Impact hammer + multiple accelerometers', reject: '첫 mode 하나에 E를 맞춤' },
    thermal: { unit: '°C', first: 'Heat input, contact resistance and convection', next: 'Thermocouple map + power balance', reject: 'IR maximum pixel만 사용' },
    preload: { unit: 'kN', first: 'Friction scatter, embedment and temperature', next: 'Bolt tension/ultrasonic measurement', reject: 'Torque setting을 preload로 간주' },
  };
  const active = data[kind];
  const error = (model - measured) / Math.max(Math.abs(measured), 1) * 100;
  const good = Math.abs(error) < 8;
  return <LabFrame icon={<TestTubeDiagonal className="h-4 w-4" />} title="Model discrepancy를 원인 순서와 다음 측정으로 닫기" status={good ? 'CORRELATED WITHIN SCREEN' : 'REVISION REQUIRED'} danger={!good}>
    <div className="p-4 sm:p-6"><SegmentedControl label="Physical evidence kind" value={kind} onChange={setKind} options={[{ value: 'strain', label: 'Strain' }, { value: 'deflection', label: 'Deflection' }, { value: 'modal', label: 'Modal' }, { value: 'thermal', label: 'Thermal' }, { value: 'preload', label: 'Preload' }]} /><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"><div className="space-y-5"><Range label="Model prediction" value={model} min={10} max={180} unit={` ${active.unit}`} onChange={setModel} /><Range label="Physical measurement" value={measured} min={10} max={180} unit={` ${active.unit}`} tone="teal" onChange={setMeasured} /><div className="rounded-md border border-border p-4"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold text-muted-foreground">Normalized residual</p><p className={`mt-1 font-mono text-3xl font-black ${good ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{fmt(error, 1)}%</p></div><Activity className="h-8 w-8 text-muted-foreground" /></div></div></div><div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border"><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">FIRST SUSPECT</p><p className="mt-2 text-xs leading-relaxed">{active.first}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">NEXT EVIDENCE</p><p className="mt-2 text-xs leading-relaxed">{active.next}</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-red-700 dark:text-red-300">DO NOT DO</p><p className="mt-2 text-xs leading-relaxed">{active.reject}</p></div><div className="bg-background p-4"><Status tone={good ? 'green' : 'amber'}>{good ? '이 screen 안에서는 해당 claim의 model and measurement가 일치한다. Calibration uncertainty와 다른 load cases는 별도다.' : 'Residual을 숨기지 말고 boundary → contact/preload → geometry/mass → material/damping → sensor 순으로 가설을 분리한다.'}</Status></div></div></div></div>
  </LabFrame>;
}
