import { useState, type ReactNode } from 'react';
import {
  Activity,
  Cable,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GitBranch,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function LabFrame({ index, title, status, danger = false, icon, children }: { index: string; title: string; status: string; danger?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300">{icon} SAFETY LAB {index}</span>
        <strong className="min-w-0 text-sm leading-snug">{title}</strong>
        <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function RangeControl({ label, value, min, max, step = 1, unit, onChange, tone = 'blue' }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void; tone?: 'blue' | 'teal' | 'amber' | 'violet' }) {
  const accent = tone === 'teal' ? 'accent-teal-600' : tone === 'amber' ? 'accent-amber-600' : tone === 'violet' ? 'accent-violet-600' : 'accent-blue-600';
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span><input className={`h-2 w-full cursor-pointer ${accent}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Status({ tone = 'neutral', children }: { tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red'; children: ReactNode }) {
  const css = { neutral: 'border-border bg-muted/[0.12]', blue: 'border-blue-500/30 bg-blue-500/[0.04]', green: 'border-emerald-500/30 bg-emerald-500/[0.04]', amber: 'border-amber-500/30 bg-amber-500/[0.045]', red: 'border-red-500/30 bg-red-500/[0.045]' }[tone];
  return <div className={`rounded-md border p-3 text-xs leading-relaxed ${css}`}>{children}</div>;
}

function PathNode({ label, detail, tone = 'neutral', index }: { label: string; detail: string; tone?: 'neutral' | 'blue' | 'teal' | 'amber' | 'red' | 'violet'; index?: number }) {
  const css = { neutral: 'border-border bg-muted/[0.06]', blue: 'border-blue-500/30 bg-blue-500/[0.035]', teal: 'border-teal-500/30 bg-teal-500/[0.035]', amber: 'border-amber-500/30 bg-amber-500/[0.04]', red: 'border-red-500/30 bg-red-500/[0.04]', violet: 'border-violet-500/30 bg-violet-500/[0.035]' }[tone];
  return <div className={`min-w-0 rounded-md border p-3 ${css}`}>{index !== undefined && <span className="font-mono text-[10px] font-black text-muted-foreground">{String(index).padStart(2, '0')}</span>}<p className="mt-1 text-xs font-black leading-snug">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>;
}

type Hazard = 'touch' | 'transient' | 'torque' | 'motion' | 'energy';

export function SafetyContractBoundaryLab() {
  const [hazard, setHazard] = useState<Hazard>('motion');
  const matrix: Record<Hazard, { question: string; owner: string[]; unresolved: string[] }> = {
    touch: { question: '사람이 접근할 수 있는 conductive part에 위험 전위가 전달되는가?', owner: ['Protective isolation', '접지·enclosure', 'Discharge verification'], unresolved: ['Functional isolator label만으로는 부족'] },
    transient: { question: 'Switching transient가 receiver, encoder 또는 gate를 오동작시키는가?', owner: ['EMC current path', 'CMTI·filter', 'Layout·shield'], unresolved: ['Galvanic isolation도 C·dv/dt를 통과시킴'] },
    torque: { question: '요구 시 torque-producing power가 제거되는가?', owner: ['Independent STO path', 'Gate-power removal', 'Diagnostics'], unresolved: ['Torque command 0은 safety path가 아님'] },
    motion: { question: '관성 또는 중력으로 움직이는 축이 위험을 끝냈는가?', owner: ['Controlled stop', 'STO', 'Mechanical hold'], unresolved: ['STO만으로 coast/fall을 멈추지 않음'] },
    energy: { question: 'DC link가 declared access voltage 아래인가?', owner: ['Contactor isolation', 'Discharge path', 'Downstream voltage proof'], unresolved: ['STO는 DC link를 방전하지 않음'] },
  };
  const selected = matrix[hazard];
  return <LabFrame index="01" icon={<ShieldCheck className="h-4 w-4" />} title="Hazard에서 필요한 기능을 역으로 배정하기" status="CONTRACTS SEPARATED">
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      <div className="min-w-0 space-y-5"><SegmentedControl label="Hazard to control" value={hazard} onChange={setHazard} options={[{ value: 'touch', label: 'Touch' }, { value: 'transient', label: 'EMC' }, { value: 'torque', label: 'Torque' }, { value: 'motion', label: 'Motion' }, { value: 'energy', label: 'Stored bus' }]} /><Status tone="blue"><strong>{selected.question}</strong><br /><span className="text-muted-foreground">부품 이름보다 먼저 위험과 종료 조건을 선언한다.</span></Status></div>
      <div className="min-w-0"><div className="grid gap-2 sm:grid-cols-3">{selected.owner.map((owner, index) => <PathNode key={owner} index={index + 1} label={owner} detail="이 기능의 입력·출력·failure response를 독립적으로 검증" tone={index === selected.owner.length - 1 ? 'teal' : 'blue'} />)}</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><PathNode label="남는 위험" detail={selected.unresolved[0]} tone="amber" /><PathNode label="완료 증거" detail="Command echo가 아니라 physical state와 independent feedback" tone="violet" /></div></div>
    </div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Selected hazard', value: hazard.toUpperCase() }, { label: 'Required functions', value: String(selected.owner.length) }, { label: 'Single universal control', value: 'NONE' }, { label: 'Evidence endpoint', value: 'PHYSICAL STATE', accent: true }]} /></div>
  </LabFrame>;
}

type CoordinationInput = 'working' | 'transient' | 'pollution' | 'material' | 'altitude' | 'boundary';

export function InsulationCoordinationLab() {
  const [inputs, setInputs] = useState<Record<CoordinationInput, boolean>>({ working: true, transient: true, pollution: false, material: false, altitude: true, boundary: false });
  const rows: Array<{ key: CoordinationInput; label: string; detail: string }> = [
    { key: 'working', label: 'Working / repetitive voltage', detail: '정상 상태에서 barrier 양단이 실제로 보는 차이' },
    { key: 'transient', label: 'Transient / impulse environment', detail: 'Installation category와 예상 surge를 포함' },
    { key: 'pollution', label: 'Pollution & contamination', detail: '표면 도전 경로가 생기는 환경 조건' },
    { key: 'material', label: 'Material / coating state', detail: 'CTI/material group과 coating process evidence' },
    { key: 'altitude', label: 'Altitude / air density', detail: 'Clearance correction이 필요한 설치 높이' },
    { key: 'boundary', label: 'Whole barrier path', detail: 'Isolator·DC/DC·connector·PCB를 모두 포함' },
  ];
  const ready = rows.every(({ key }) => inputs[key]);
  return <LabFrame index="02" icon={<GitBranch className="h-4 w-4" />} title="Spacing 표를 열기 전 입력 완전성을 검사하기" status={ready ? 'TABLE LOOKUP READY' : 'INPUTS INCOMPLETE'} danger={!ready}>
    <div className="p-4 sm:p-6"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{rows.map(({ key, label, detail }) => <button key={key} type="button" aria-pressed={inputs[key]} onClick={() => setInputs((current) => ({ ...current, [key]: !current[key] }))} className={`min-h-[7rem] rounded-md border p-4 text-left transition-colors ${inputs[key] ? 'border-emerald-500/35 bg-emerald-500/[0.04]' : 'border-amber-500/35 bg-amber-500/[0.04]'}`}><span className={`text-[10px] font-black ${inputs[key] ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>{inputs[key] ? 'DECLARED' : 'MISSING'}</span><p className="mt-2 text-sm font-black">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></button>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-3"><PathNode label="Clearance" detail="공기 중 가장 짧은 path · transient/altitude 영향" tone={ready ? 'blue' : 'neutral'} /><PathNode label="Creepage" detail="절연 표면 path · pollution/material 영향" tone={ready ? 'violet' : 'neutral'} /><PathNode label="Solid barrier" detail="재료 내부 dielectric path · 제조/aging 포함" tone={ready ? 'teal' : 'neutral'} /></div><div className="mt-4"><Status tone={ready ? 'green' : 'amber'}>{ready ? '이제 current standard의 normative table과 product evidence로 geometry를 결정할 준비가 됐다. 이 lab 자체는 mm를 발급하지 않는다.' : `${rows.filter(({ key }) => !inputs[key]).length}개 입력이 빠졌다. 다른 board의 creepage 값을 복사할 단계가 아니다.`}</Status></div></div>
  </LabFrame>;
}

export function IsolationBarrierTransientLab() {
  const [capacitance, setCapacitance] = useState(2.2);
  const [edgeRate, setEdgeRate] = useState(80);
  const [cmti, setCmti] = useState(120);
  const [delayMin, setDelayMin] = useState(32);
  const [delayMax, setDelayMax] = useState(48);
  const currentMa = capacitance * edgeRate;
  const margin = cmti / edgeRate;
  const skew = Math.max(0, delayMax - delayMin);
  const safe = margin >= 1.5 && currentMa < 300 && skew <= 20;
  return <LabFrame index="03" icon={<Activity className="h-4 w-4" />} title="Isolation barrier를 통과하는 transient current와 timing 보기" status={safe ? 'TRANSIENT MARGIN' : 'REVIEW REQUIRED'} danger={!safe}>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]"><div className="min-w-0 space-y-5"><RangeControl label="Equivalent barrier capacitance" value={capacitance} min={0.5} max={8} step={0.1} unit=" pF" onChange={setCapacitance} /><RangeControl label="Expected common-mode edge" value={edgeRate} min={10} max={180} step={5} unit=" kV/µs" onChange={setEdgeRate} tone="amber" /><RangeControl label="Datasheet minimum CMTI" value={cmti} min={25} max={250} step={5} unit=" kV/µs" onChange={setCmti} tone="teal" /><RangeControl label="Fastest propagation" value={delayMin} min={10} max={80} unit=" ns" onChange={setDelayMin} tone="violet" /><RangeControl label="Slowest propagation" value={delayMax} min={20} max={120} unit=" ns" onChange={setDelayMax} tone="violet" /></div><div className="min-w-0"><div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><PathNode label="Switch node" detail={`${edgeRate} kV/µs common-mode edge`} tone="amber" /><span className="self-center text-center text-muted-foreground">→</span><PathNode label="Barrier capacitance" detail={`${capacitance} pF · ${fmt(currentMa, 0)} mA pulse`} tone="violet" /><span className="self-center text-center text-muted-foreground">→</span><PathNode label="Receiver / gate" detail={`CMTI screen ${fmt(margin, 2)}×`} tone={safe ? 'teal' : 'red'} /></div><div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">DISPLACEMENT PULSE</p><p className="mt-2 font-mono text-xl font-black">{fmt(currentMa, 0)} mA</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">CMTI SCREEN</p><p className="mt-2 font-mono text-xl font-black">{fmt(margin, 2)}×</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">CHANNEL SKEW</p><p className="mt-2 font-mono text-xl font-black">{fmt(skew, 0)} ns</p></div></div><div className="mt-4"><Status tone={safe ? 'green' : 'red'}>{safe ? '정적 isolation rating과 별도로 transient path·receiver immunity·timing을 검토한다.' : 'Edge rate, barrier coupling 또는 channel timing 중 하나가 screening boundary를 넘었다. CMTI ratio는 표준 metric이 아니라 review trigger다.'}</Status></div></div></div>
  </LabFrame>;
}

export function CommonModeCurrentLab() {
  const [edgeRate, setEdgeRate] = useState(60);
  const [capacitance, setCapacitance] = useState(350);
  const [shield, setShield] = useState<'chassis' | 'pigtail' | 'open'>('chassis');
  const currentA = capacitance * 1e-12 * edgeRate * 1e9;
  const controlled = shield === 'chassis' ? 0.82 : shield === 'pigtail' ? 0.42 : 0.12;
  const strayA = currentA * (1 - controlled);
  const safe = strayA < 0.008;
  const nodes = [
    ['PWM bridge', `${edgeRate} V/ns edge`, 'amber'],
    ['Motor cable', `${capacitance} pF equivalent`, 'blue'],
    ['Frame / shield', shield === 'chassis' ? 'wide chassis termination' : shield === 'pigtail' ? 'inductive pigtail' : 'intended path open', shield === 'chassis' ? 'teal' : 'amber'],
    ['Parasitic return', `${fmt(strayA * 1000, 1)} mA uncontrolled`, safe ? 'violet' : 'red'],
    ['DC link', 'loop closes at source', 'blue'],
  ] as const;
  return <LabFrame index="04" icon={<Cable className="h-4 w-4" />} title="Common-mode current가 닫히는 전체 machine loop 추적하기" status={safe ? 'RETURN PATH CONTROLLED' : 'STRAY PATH DOMINANT'} danger={!safe}>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="min-w-0 space-y-5"><SegmentedControl label="Shield return" value={shield} onChange={setShield} options={[{ value: 'chassis', label: 'Wide chassis' }, { value: 'pigtail', label: 'Pigtail' }, { value: 'open', label: 'Open' }]} /><RangeControl label="Switch-node edge" value={edgeRate} min={10} max={150} step={5} unit=" V/ns" onChange={setEdgeRate} tone="amber" /><RangeControl label="Equivalent machine capacitance" value={capacitance} min={50} max={1200} step={25} unit=" pF" onChange={setCapacitance} /><Status tone="blue">의도한 shield path를 끊어도 current는 사라지지 않는다. Encoder, bearing, USB, oscilloscope earth 같은 기생 경로로 분배된다.</Status></div><div className="min-w-0"><div className="grid gap-2 sm:grid-cols-5">{nodes.map(([label, detail, tone], index) => <div key={label} className="relative"><PathNode index={index + 1} label={label} detail={detail} tone={tone} />{index < nodes.length - 1 && <span className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 bg-background px-1 text-xs text-muted-foreground sm:-right-2.5 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0">→</span>}</div>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-2"><PathNode label="CM probe convention" detail="두 conductors를 같은 방향으로 통과시켜 합을 측정" tone="violet" /><PathNode label="DM probe convention" detail="반대 방향 성분 또는 conductor difference를 계산" tone="blue" /></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Total CM pulse', value: `${fmt(currentA * 1000, 1)} mA` }, { label: 'Controlled return', value: `${fmt(controlled * 100, 0)}%` }, { label: 'Uncontrolled path', value: `${fmt(strayA * 1000, 1)} mA` }, { label: 'Loop closure', value: 'DC LINK', accent: safe }]} /></div>
  </LabFrame>;
}

type Mitigation = 'edge' | 'loop' | 'shield' | 'cmchoke' | 'dmfilter' | 'receiver';

export function EmcCouplingLab() {
  const [mechanism, setMechanism] = useState<'electric' | 'magnetic' | 'conducted'>('electric');
  const [mitigation, setMitigation] = useState<Mitigation>('edge');
  const match: Record<typeof mechanism, Mitigation[]> = { electric: ['edge', 'shield', 'receiver'], magnetic: ['loop', 'receiver'], conducted: ['cmchoke', 'dmfilter', 'receiver'] };
  const works = match[mechanism].includes(mitigation);
  const tradeoffs: Record<Mitigation, string> = { edge: 'Switching loss와 dead-time distortion 증가 가능', loop: 'PCB/cable geometry 변경 필요', shield: 'Termination inductance와 PE current 검토', cmchoke: 'Saturation·leakage inductance·heating 검토', dmfilter: 'LC resonance·damping·control loop 검토', receiver: 'Filter delay와 signal bandwidth 검토' };
  return <LabFrame index="05" icon={<Waves className="h-4 w-4" />} title="Source·path·victim 중 실제 coupling mechanism을 겨냥하기" status={works ? 'MECHANISM MATCHED' : 'PATH STILL OPEN'} danger={!works}>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]"><div className="min-w-0 space-y-5"><SegmentedControl label="Observed coupling" value={mechanism} onChange={setMechanism} options={[{ value: 'electric', label: 'Electric C·dv/dt' }, { value: 'magnetic', label: 'Magnetic I·A' }, { value: 'conducted', label: 'Conducted CM/DM' }]} /><SegmentedControl label="Proposed intervention" value={mitigation} onChange={setMitigation} options={[{ value: 'edge', label: 'Slow edge' }, { value: 'loop', label: 'Loop area' }, { value: 'shield', label: 'Shield' }, { value: 'cmchoke', label: 'CM choke' }, { value: 'dmfilter', label: 'DM LC' }, { value: 'receiver', label: 'Receiver' }]} /><Status tone={works ? 'green' : 'red'}>{works ? '선택한 개입이 현재 coupling mechanism의 source, path 또는 victim을 직접 바꾼다.' : '증상은 달라질 수 있지만 선택한 개입이 선언한 coupling path를 직접 닫지 않는다.'}</Status></div><div className="min-w-0"><div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><PathNode label="SOURCE" detail={mechanism === 'electric' ? 'Switch-node dv/dt' : mechanism === 'magnetic' ? 'High di/dt current loop' : 'PWM ripple / CM voltage'} tone="amber" /><span className="self-center text-center text-muted-foreground">→</span><PathNode label="COUPLING PATH" detail={mechanism === 'electric' ? 'Parasitic capacitance' : mechanism === 'magnetic' ? 'Mutual flux from loop area' : 'Cable·ground impedance'} tone="violet" /><span className="self-center text-center text-muted-foreground">→</span><PathNode label="VICTIM" detail="Encoder·ADC·gate receiver·communication" tone={works ? 'teal' : 'red'} /></div><div className="mt-4 rounded-md border border-amber-500/25 bg-amber-500/[0.035] p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">TRADE-OFF CREATED</p><p className="mt-2 text-sm font-semibold leading-relaxed">{tradeoffs[mitigation]}</p></div></div></div>
  </LabFrame>;
}

export function EmcEvidenceLab() {
  const [measured, setMeasured] = useState(53);
  const [limit, setLimit] = useState(60);
  const [uncertainty, setUncertainty] = useState(4);
  const [setup, setSetup] = useState<'complete' | 'missing-cable' | 'missing-detector'>('complete');
  const margin = limit - measured - uncertainty;
  const complete = setup === 'complete';
  const pass = complete && margin >= 0;
  return <LabFrame index="06" icon={<RadioTower className="h-4 w-4" />} title="EMC trace를 재현 가능한 evidence record로 바꾸기" status={pass ? 'BOUNDED PASS EVIDENCE' : 'CLAIM NOT CLOSED'} danger={!pass}>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="min-w-0 space-y-5"><SegmentedControl label="Recorded setup" value={setup} onChange={setSetup} options={[{ value: 'complete', label: 'Complete' }, { value: 'missing-cable', label: 'Cable missing' }, { value: 'missing-detector', label: 'Detector missing' }]} /><RangeControl label="Measured maximum" value={measured} min={35} max={75} unit=" dBµV" onChange={setMeasured} /><RangeControl label="Applicable limit" value={limit} min={45} max={75} unit=" dBµV" onChange={setLimit} tone="teal" /><RangeControl label="Measurement uncertainty" value={uncertainty} min={1} max={8} step={0.5} unit=" dB" onChange={setUncertainty} tone="amber" /></div><div className="min-w-0"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[['Operating mode', 'max load · PWM state', true], ['Cable/enclosure', setup === 'missing-cable' ? 'MISSING' : 'length · termination', setup !== 'missing-cable'], ['Instrument chain', setup === 'missing-detector' ? 'MISSING detector' : 'LISN/probe · RBW · detector', setup !== 'missing-detector'], ['Acceptance', 'limit · uncertainty · margin', true]].map(([label, detail, ok]) => <PathNode key={String(label)} label={String(label)} detail={String(detail)} tone={ok ? 'blue' : 'red'} />)}</div><div className="mt-4 h-6 overflow-hidden rounded-md border border-border bg-muted"><div className="h-full bg-blue-600/70" style={{ width: `${clamp(measured / 80 * 100, 0, 100)}%` }} /><div className="relative -top-6 h-6 border-r-2 border-red-600" style={{ width: `${clamp(limit / 80 * 100, 0, 100)}%` }} /></div><div className="mt-3"><Status tone={pass ? 'green' : 'red'}>{!complete ? 'Setup field가 빠져 같은 trace를 재현하거나 installation으로 transfer할 수 없다.' : margin < 0 ? `Raw limit 차이는 ${fmt(limit - measured, 1)} dB지만 uncertainty를 빼면 ${fmt(margin, 1)} dB로 실패한다.` : `Uncertainty를 보수적으로 뺀 margin ${fmt(margin, 1)} dB가 남는다. 이 구성과 mode에 한정한 evidence다.`}</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Raw delta', value: `${fmt(limit - measured, 1)} dB` }, { label: 'Conservative margin', value: `${fmt(margin, 1)} dB` }, { label: 'Setup completeness', value: complete ? 'COMPLETE' : 'INCOMPLETE' }, { label: 'Claim scope', value: pass ? 'TESTED CONFIG' : 'OBSERVATION', accent: pass }]} /></div>
  </LabFrame>;
}

type StopScenario = 'horizontal' | 'vertical' | 'service';

export function SafetyFunctionAllocationLab() {
  const [scenario, setScenario] = useState<StopScenario>('vertical');
  const [controlled, setControlled] = useState(true);
  const [sto, setSto] = useState(true);
  const [hold, setHold] = useState(false);
  const [discharged, setDischarged] = useState(false);
  const needed = scenario === 'horizontal' ? { controlled: true, sto: true, hold: false, discharged: false } : scenario === 'vertical' ? { controlled: true, sto: true, hold: true, discharged: false } : { controlled: false, sto: true, hold: true, discharged: true };
  const values = { controlled, sto, hold, discharged };
  const pass = Object.entries(needed).every(([key, value]) => !value || values[key as keyof typeof values]);
  const controls = [
    ['controlled', 'Controlled stop', controlled, setControlled, '속도·energy를 계획대로 줄임'],
    ['sto', 'STO / torque off', sto, setSto, 'Torque-producing power를 독립 제거'],
    ['hold', 'Mechanical hold', hold, setHold, '중력·외력에도 위치를 유지'],
    ['discharged', 'Bus discharge proof', discharged, setDischarged, 'Service access energy를 제거'],
  ] as const;
  return <LabFrame index="07" icon={<ShieldAlert className="h-4 w-4" />} title="Controlled stop·STO·holding·safe access를 따로 배정하기" status={pass ? 'HAZARD FUNCTIONS COVERED' : 'FUNCTION GAP'} danger={!pass}>
    <div className="p-4 sm:p-6"><SegmentedControl label="Machine scenario" value={scenario} onChange={setScenario} options={[{ value: 'horizontal', label: 'Horizontal base' }, { value: 'vertical', label: 'Vertical payload' }, { value: 'service', label: 'Service access' }]} /><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{controls.map(([key, label, value, setter, detail]) => { const required = needed[key as keyof typeof needed]; return <button key={key} type="button" aria-pressed={value} onClick={() => setter(!value)} className={`min-h-[8rem] rounded-md border p-4 text-left ${value ? required ? 'border-emerald-500/35 bg-emerald-500/[0.04]' : 'border-blue-500/30 bg-blue-500/[0.035]' : required ? 'border-red-500/35 bg-red-500/[0.04]' : 'border-border bg-muted/[0.05]'}`}><span className="text-[10px] font-black text-muted-foreground">{required ? 'REQUIRED' : 'CONTEXTUAL'} · {value ? 'ON' : 'OFF'}</span><p className="mt-2 text-sm font-black">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></button>; })}</div><div className="mt-4"><Status tone={pass ? 'green' : 'red'}>{pass ? '선택한 hazard에서 필요한 종료 조건이 모두 별도 기능으로 할당됐다.' : scenario === 'vertical' && !hold ? 'STO 뒤에도 payload는 중력으로 움직인다. Proven brake torque와 engagement timing이 필요하다.' : scenario === 'service' && !discharged ? 'STO는 gate torque를 끄지만 DC link를 touch-safe voltage로 만들지 않는다.' : 'Motion/torque hazard를 끝내는 기능이 빠졌다.'}</Status></div></div>
  </LabFrame>;
}

type Fault = 'a-stuck' | 'b-stuck' | 'cross-short' | 'shared-supply' | 'stale-diag' | 'switch-short';

export function DualChannelDiagnosticLab() {
  const [fault, setFault] = useState<Fault>('a-stuck');
  const [separateLogic, setSeparateLogic] = useState(true);
  const [freshDiagnostics, setFreshDiagnostics] = useState(true);
  const outcomes: Record<Fault, { single: boolean; diagnostic: boolean; ccf: boolean; detail: string }> = {
    'a-stuck': { single: true, diagnostic: true, ccf: false, detail: 'B channel이 trip하고 A mismatch를 진단' },
    'b-stuck': { single: true, diagnostic: true, ccf: false, detail: 'A channel이 trip하고 B mismatch를 진단' },
    'cross-short': { single: false, diagnostic: true, ccf: true, detail: '두 입력이 함께 움직여 independence를 잃을 수 있음' },
    'shared-supply': { single: false, diagnostic: false, ccf: true, detail: 'Shared rail failure mode와 safe direction을 별도 분석' },
    'stale-diag': { single: false, diagnostic: false, ccf: false, detail: '마지막 pass가 오래되면 현재 coverage가 아님' },
    'switch-short': { single: true, diagnostic: true, ccf: false, detail: '다른 removal path가 torque power를 차단해야 함' },
  };
  const o = outcomes[fault];
  const safe = (o.single || (fault === 'cross-short' && separateLogic)) && (!o.diagnostic || freshDiagnostics) && (!o.ccf || separateLogic);
  return <LabFrame index="08" icon={<GitBranch className="h-4 w-4" />} title="1oo2 구조에 fault를 넣어 redundancy가 실제인지 확인하기" status={safe ? 'FAULT CONTAINED / DETECTED' : 'DANGEROUS PATH OPEN'} danger={!safe}>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="min-w-0 space-y-5"><SegmentedControl label="Injected fault" value={fault} onChange={setFault} options={[{ value: 'a-stuck', label: 'A stuck' }, { value: 'b-stuck', label: 'B stuck' }, { value: 'cross-short', label: 'A-B short' }, { value: 'shared-supply', label: 'Shared rail' }, { value: 'stale-diag', label: 'Stale diag' }, { value: 'switch-short', label: 'Switch short' }]} /><SegmentedControl label="Logic / removal paths" value={separateLogic ? 'separate' : 'shared'} onChange={(value) => setSeparateLogic(value === 'separate')} options={[{ value: 'separate', label: 'Independent' }, { value: 'shared', label: 'Shared' }]} /><SegmentedControl label="Diagnostic age" value={freshDiagnostics ? 'fresh' : 'stale'} onChange={(value) => setFreshDiagnostics(value === 'fresh')} options={[{ value: 'fresh', label: 'Within DTI' }, { value: 'stale', label: 'Past DTI' }]} /></div><div className="min-w-0"><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-2"><PathNode label="CHANNEL A" detail={fault === 'a-stuck' ? 'STUCK HIGH' : 'Input → filter → logic → removal A'} tone={fault === 'a-stuck' ? 'red' : 'blue'} /><PathNode label="CHANNEL B" detail={fault === 'b-stuck' ? 'STUCK HIGH' : 'Input → filter → logic → removal B'} tone={fault === 'b-stuck' ? 'red' : 'teal'} /></div><div className="space-y-2"><PathNode label="SHARED / CCF AUDIT" detail={separateLogic ? 'Connector·route·supply·clock paths reviewed' : 'Unanalysed shared logic/removal path'} tone={separateLogic ? 'violet' : 'red'} /><PathNode label="RESULT" detail={o.detail} tone={safe ? 'teal' : 'red'} /></div></div><div className="mt-4"><Status tone={safe ? 'green' : 'red'}>{safe ? '현재 fault는 다른 channel 또는 current diagnostic interval 안에서 bounded된다. 이것만으로 PL/SIL이 자동 산출되지는 않는다.' : 'Channel 수는 두 개지만 independence, common cause 또는 diagnostic freshness가 닫히지 않았다.'}</Status></div></div></div>
  </LabFrame>;
}

export function StoTimingLab() {
  const [input, setInput] = useState(0.6);
  const [filter, setFilter] = useState(1.2);
  const [switching, setSwitching] = useState(0.7);
  const [rail, setRail] = useState(4.5);
  const [coast, setCoast] = useState(180);
  const [brake, setBrake] = useState(65);
  const [vertical, setVertical] = useState(true);
  const stoTime = input + filter + switching + rail;
  const motionTime = stoTime + (vertical ? brake : coast);
  const electronicsShare = stoTime / motionTime * 100;
  const chain = [
    ['Input recognition', input, 'blue'], ['Pulse filter', filter, 'violet'], ['Logic + switch', switching, 'amber'], ['Rail + gate off', rail, 'teal'], [vertical ? 'Brake engaged' : 'Coast to safe motion', vertical ? brake : coast, 'red'],
  ] as const;
  return <LabFrame index="09" icon={<Clock3 className="h-4 w-4" />} title="Electronics STO response와 실제 motion-safe 시간을 분리하기" status="TWO CLOCKS VISIBLE">
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="min-w-0 space-y-5"><SegmentedControl label="Mechanical axis" value={vertical ? 'vertical' : 'horizontal'} onChange={(value) => setVertical(value === 'vertical')} options={[{ value: 'vertical', label: 'Vertical + brake' }, { value: 'horizontal', label: 'Horizontal coast' }]} /><RangeControl label="Input recognition" value={input} min={0.1} max={3} step={0.1} unit=" ms" onChange={setInput} /><RangeControl label="Pulse filter" value={filter} min={0.2} max={8} step={0.1} unit=" ms" onChange={setFilter} tone="violet" /><RangeControl label="Logic + load switch" value={switching} min={0.1} max={5} step={0.1} unit=" ms" onChange={setSwitching} tone="amber" /><RangeControl label="Isolated rail + gate decay" value={rail} min={0.5} max={20} step={0.5} unit=" ms" onChange={setRail} tone="teal" />{vertical ? <RangeControl label="Mechanical brake engagement" value={brake} min={10} max={250} step={5} unit=" ms" onChange={setBrake} tone="amber" /> : <RangeControl label="Coast to safe motion" value={coast} min={20} max={800} step={10} unit=" ms" onChange={setCoast} tone="amber" />}</div><div className="min-w-0"><div className="space-y-3">{chain.map(([label, duration, tone], index) => <div key={label} className="grid grid-cols-[2rem_minmax(0,1fr)_4.5rem] items-center gap-3"><span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><div><div className="mb-1 flex items-center justify-between gap-2 text-xs"><strong>{label}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={{ blue: 'bg-blue-600', violet: 'bg-violet-600', amber: 'bg-amber-500', teal: 'bg-teal-600', red: 'bg-red-500' }[tone]} style={{ width: `${clamp(duration / Math.max(motionTime, 1) * 100 * 3.5, 3, 100)}%` }} /></div></div><span className="text-right font-mono text-xs">{fmt(duration, 1)} ms</span></div>)}</div><div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">STO ELECTRONICS</p><p className="mt-2 font-mono text-2xl font-black">{fmt(stoTime, 1)} ms</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">MOTION-SAFE</p><p className="mt-2 font-mono text-2xl font-black">{fmt(motionTime, 1)} ms</p></div></div><div className="mt-4"><Status tone="amber">READY/gate-off time은 torque-producing path의 response다. Risk assessment가 요구하는 endpoint가 zero/safe motion 또는 holding이라면 기계 구간까지 별도로 측정한다.</Status></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Electronics response', value: `${fmt(stoTime, 1)} ms` }, { label: 'Hazard endpoint', value: `${fmt(motionTime, 1)} ms` }, { label: 'Electronics share', value: `${fmt(electronicsShare, 0)}%` }, { label: 'DC link discharged', value: 'NOT PROVEN' }]} /></div>
  </LabFrame>;
}

type Change = 'none' | 'pcb' | 'firmware' | 'isolator' | 'cable';

export function SafetyCaseCommissioningLab() {
  const [change, setChange] = useState<Change>('none');
  const layers = [
    { key: 'requirements', label: 'Risk & requirements', invalid: [] as Change[] },
    { key: 'architecture', label: 'Architecture / FMEA', invalid: ['pcb', 'firmware', 'isolator'] as Change[] },
    { key: 'diagnostics', label: 'Diagnostics / DTI', invalid: ['firmware', 'isolator'] as Change[] },
    { key: 'insulation', label: 'Insulation / EMC', invalid: ['pcb', 'isolator', 'cable'] as Change[] },
    { key: 'integration', label: 'Fault injection / integration', invalid: ['pcb', 'firmware', 'isolator', 'cable'] as Change[] },
    { key: 'lifecycle', label: 'Production / lifecycle', invalid: ['pcb', 'firmware', 'isolator', 'cable'] as Change[] },
  ];
  const invalid = layers.filter((layer) => layer.invalid.includes(change));
  const valid = layers.length - invalid.length;
  const deployable = invalid.length === 0;
  return <LabFrame index="10" icon={<FileCheck2 className="h-4 w-4" />} title="Revision과 component change가 어떤 evidence를 무효화하는지 추적하기" status={deployable ? 'EVIDENCE SET CURRENT' : 'REVALIDATION REQUIRED'} danger={!deployable}>
    <div className="p-4 sm:p-6"><SegmentedControl label="Change under review" value={change} onChange={setChange} options={[{ value: 'none', label: 'Baseline' }, { value: 'pcb', label: 'PCB revision' }, { value: 'firmware', label: 'Firmware' }, { value: 'isolator', label: 'Alt isolator' }, { value: 'cable', label: 'Longer cable' }]} /><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{layers.map((layer, index) => { const current = !layer.invalid.includes(change); return <div key={layer.key} className={`min-h-[7rem] rounded-md border p-4 ${current ? 'border-emerald-500/30 bg-emerald-500/[0.035]' : 'border-red-500/35 bg-red-500/[0.04]'}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>{current ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-red-600" />}</div><p className="mt-3 text-sm font-black">{layer.label}</p><p className="mt-1 text-xs text-muted-foreground">{current ? 'Current evidence retained' : 'Analysis or test must be repeated'}</p></div>; })}</div><div className="mt-4"><Status tone={deployable ? 'green' : 'red'}>{deployable ? 'Requirement, architecture, diagnostic, physical test와 lifecycle evidence의 교집합이 현재 revision에 연결돼 있다.' : `${invalid.length}개 evidence layer가 ${change} 변경으로 stale 상태다. Badge나 이전 인증 문구가 이 gap을 메우지 않는다.`}</Status></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Current evidence', value: `${valid}/${layers.length}` }, { label: 'Stale evidence', value: String(invalid.length) }, { label: 'Selected change', value: change.toUpperCase() }, { label: 'Deployable claim', value: deployable ? 'CURRENT' : 'BLOCKED', accent: deployable }]} /></div>
  </LabFrame>;
}
