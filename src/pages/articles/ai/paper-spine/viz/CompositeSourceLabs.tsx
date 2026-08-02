import { useMemo, useState, type ReactNode } from 'react';
import { BookOpenCheck, ShieldCheck, type LucideIcon } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));
const fmt = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';
const plotGrid = 'relative h-64 min-w-0 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,rgba(148,163,184,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.16)_1px,transparent_1px)] bg-[size:16.66%_25%]';

function Range({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  return <label className="block min-w-0">
    <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono text-muted-foreground">{value}{unit}</span></span>
    <span className="flex min-h-11 items-center">
      <input className="h-11 w-full cursor-pointer accent-blue-600" type="range" value={value} min={min} max={max} step={step} onChange={event => onChange(Number(event.target.value))} />
    </span>
  </label>;
}

function SourceShell({ icon: Icon, source, title, status, children }: { icon: LucideIcon; source: string; title: string; status: string; children: ReactNode }) {
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pl-6 sm:pr-20">
      <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300"><Icon className="h-4 w-4" /> {source}</span>
      <strong className="min-w-0 break-words text-sm leading-snug sm:text-center">{title}</strong>
      <span className="whitespace-nowrap text-[10px] font-black text-teal-700 dark:text-teal-300 sm:text-right">{status}</span>
    </figcaption>
    {children}
  </figure>;
}

type TsaiView = 'off-axis' | 'laminate' | 'thermal' | 'evidence';

export function TsaiComposite1965Lab() {
  const [view, setView] = useState<TsaiView>('off-axis');
  const [angle, setAngle] = useState(28);
  const [ratio, setRatio] = useState(.5);
  const [temp, setTemp] = useState(-120);
  const sourceX = 150;
  const sourceY = 4;
  const sourceS = 6;
  const radians = angle * Math.PI / 180;
  const offAxisStrength = (theta: number) => {
    const m = Math.cos(theta);
    const n = Math.sin(theta);
    const inverseSquared = m ** 4 / sourceX ** 2
      + n ** 4 / sourceY ** 2
      + (1 / sourceS ** 2 - 1 / sourceX ** 2) * m ** 2 * n ** 2;
    return 1 / Math.sqrt(inverseSquared);
  };
  const strengthKsi = offAxisStrength(radians);
  const strength = strengthKsi / sourceX;
  const coupling = view === 'thermal' ? Math.abs(temp) / 180 * (1 - ratio) * .72 : view === 'laminate' ? Math.abs(.5 - ratio) * 1.3 : 0;
  const curve = useMemo(() => Array.from({ length: 61 }, (_, index) => {
    const sweep = index / 60 * Math.PI / 2;
    const m = Math.cos(sweep);
    const n = Math.sin(sweep);
    const inverseSquared = m ** 4 / 150 ** 2
      + n ** 4 / 4 ** 2
      + (1 / 6 ** 2 - 1 / 150 ** 2) * m ** 2 * n ** 2;
    const value = 1 / Math.sqrt(inverseSquared) / 150;
    return `${38 + index / 60 * 530},${208 - value * 148}`;
  }).join(' '), []);

  return <SourceShell icon={BookOpenCheck} source="NASA CR-224" title="Tsai 1965의 off-axis strength에서 laminate thermal interaction까지" status="GLASS/EPOXY · EARLY MODEL">
    <div className="p-4 sm:p-6">
      <SegmentedControl label="Source mechanism slice" value={view} onChange={setView} options={[{ value: 'off-axis', label: 'Off-axis strength' }, { value: 'laminate', label: 'Laminate ABD' }, { value: 'thermal', label: 'Thermal warp' }, { value: 'evidence', label: 'Evidence boundary' }]} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-5">
          {(view === 'off-axis' || view === 'evidence') && <Range label="Fibre angle" value={angle} min={0} max={90} step={2} unit="°" onChange={setAngle} />}
          {(view === 'laminate' || view === 'thermal') && <Range label="Cross-ply thickness ratio" value={ratio} min={.1} max={.9} step={.05} onChange={setRatio} />}
          {view === 'thermal' && <Range label="Service minus lamination temperature" value={temp} min={-220} max={20} step={10} unit="°F" onChange={setTemp} />}
          <div className="border-y border-border py-3 text-xs leading-relaxed text-muted-foreground">
            {view === 'off-axis' || view === 'evidence'
              ? '원문 Eq. 10 입력: X=150, Y=4, S=6 ksi. 임의 proxy가 아니라 source curve를 다시 계산합니다.'
              : view === 'laminate'
                ? '두께비는 coupling의 방향만 보여 주는 교육용 control입니다. 실제 A/B/D는 ply별 Q̄와 signed z 경계로 계산합니다.'
                : '온도 index는 현상을 보여 주는 교육용 control입니다. 실제 residual stress는 ᾱ, Q̄, ΔT와 layup으로 풉니다.'}
          </div>
        </div>
        <div>
          <div className={plotGrid}>
            <svg viewBox="0 0 620 260" className="h-full w-full">
              {view === 'off-axis' || view === 'evidence' ? <>
                <polyline points={curve} fill="none" stroke="#2563eb" strokeWidth="3" />
                <line x1={38 + angle / 90 * 530} x2={38 + angle / 90 * 530} y1="35" y2="212" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx={38 + angle / 90 * 530} cy={208 - strength * 148} r="7" fill="var(--background)" stroke="#0d9488" strokeWidth="3" />
              </> : <>
                <path d={`M62 128 Q310 ${128 - coupling * 90} 558 128`} fill="none" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                <path d="M62 84H558" stroke="#0d9488" strokeWidth="5" />
                <line x1="310" y1="45" x2="310" y2="210" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" />
              </>}
            </svg>
            <span className="absolute left-3 top-3 text-[11px] font-black text-muted-foreground sm:text-xs">{view === 'off-axis' ? 'ANGLE-DEPENDENT STRENGTH' : view === 'laminate' ? 'A/B/D LAMINATE COUPLING' : view === 'thermal' ? 'LAMINATION-TEMPERATURE RESIDUAL STATE' : 'DURABLE CLAIM / SOURCE LIMIT'}</span>
            <span className="absolute bottom-3 left-3 right-3 text-[11px] font-bold leading-snug text-muted-foreground sm:text-xs">{view === 'off-axis' || view === 'evidence' ? 'Eq. 10 재계산 · Figure 4와 비교할 source curve' : '적층 순서·두께비가 기계·열 결합을 결정'}</span>
          </div>
          <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            <div className="bg-background p-4"><p className="text-[10px] font-black text-teal-700 dark:text-teal-300">지금도 남는 원리</p><p className="mt-2 text-xs leading-relaxed">재료 방향, 변환된 단층 응답, 두께 순서에 따른 적층 결합, 성형 온도의 잔류 상태를 함께 분석해야 한다.</p></div>
            <div className="bg-background p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">원문의 적용 한계</p><p className="mt-2 text-xs leading-relaxed">평면응력·준균질 glass/epoxy 가정과 단순화된 최초 파손 이후 강성 저하는 현대의 일반 허용치나 손상 법칙이 아니다.</p></div>
          </div>
        </div>
      </div>
      <div className="mt-6"><MetricGrid mobileColumns={2} items={[{ label: 'Eq. 10 strength', value: `${fmt(strengthKsi, 2)} ksi` }, { label: 'Fₓ / X', value: fmt(strength, 3) }, { label: 'Selected angle', value: `${angle}°` }, { label: 'Source input', value: 'X150 · Y4 · S6 ksi', accent: true }]} /></div>
    </div>
  </SourceShell>;
}

type NasaView = 'bba' | 'impact' | 'delamination' | 'inspection';
type TestLevel = 'coupon' | 'element' | 'full';

const handbookStages = [
  { key: 'DTA', role: '손상 위협 식별' },
  { key: 'IDMP', role: '위협 예방·완화' },
  { key: 'RTD', role: '잔류 시험 손상' },
  { key: 'Coupon', role: '재료·공정 분산' },
  { key: 'Element', role: '상세 파손 모드' },
  { key: 'Analysis', role: '모델 상관' },
  { key: 'Full-scale', role: '전체 경계 검증' },
  { key: 'NDE', role: '운용 중 탐지' },
];

function BuildingBlockMap({ testLevel, mobile = false }: { testLevel: TestLevel; mobile?: boolean }) {
  const activeLimit = testLevel === 'coupon' ? 3 : testLevel === 'element' ? 5 : 7;
  if (mobile) return <>
    <defs>
      <marker id="handbook-flow-arrow-mobile" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#0d9488" /></marker>
      <marker id="handbook-feedback-arrow-mobile" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#d97706" /></marker>
    </defs>
    {handbookStages.map((stage, index) => {
      const x = index === 0 || index === 3 || index === 4 || index === 7 ? 18 : 178;
      const y = 46 + Math.floor(index / 2) * 51;
      const active = index <= activeLimit;
      return <g key={stage.key}>
        <rect x={x} y={y} width="144" height="40" rx="5" fill={active ? '#dbeafe' : 'var(--muted)'} fillOpacity={active ? .96 : .74} stroke={active ? '#2563eb' : 'var(--border)'} strokeWidth="1.5" />
        <text x={x + 9} y={y + 17} fontSize="12" fontWeight="800" fill={active ? '#1d4ed8' : 'var(--foreground)'}>{stage.key}</text>
        <text x={x + 9} y={y + 33} fontSize="10.5" fill="var(--muted-foreground)">{stage.role}</text>
      </g>;
    })}
    <path d="M162 66H172M250 86V91M178 117H168M90 137V142M162 168H172M250 188V193M178 219H168" fill="none" stroke="#0d9488" strokeWidth="2.2" markerEnd="url(#handbook-flow-arrow-mobile)" />
    <path d="M18 219C5 219 5 66 12 66" fill="none" stroke="#d97706" strokeWidth="2.2" strokeDasharray="5 4" markerEnd="url(#handbook-feedback-arrow-mobile)" />
    <text x="20" y="249" fontSize="10.5" fontWeight="700" fill="#b45309">시험·검사 결과가 위협과 모델 가정을 다시 갱신</text>
  </>;
  return <>
    <defs>
      <marker id="handbook-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#0d9488" /></marker>
      <marker id="handbook-feedback-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#d97706" /></marker>
    </defs>
    {handbookStages.map((stage, index) => {
      const row = index < 4 ? 0 : 1;
      const column = index < 4 ? index : 7 - index;
      const x = 30 + column * 148;
      const y = 42 + row * 106;
      const active = index <= activeLimit;
      return <g key={stage.key}>
        <rect x={x} y={y} width="126" height="74" rx="7" fill={active ? '#dbeafe' : 'var(--muted)'} fillOpacity={active ? .96 : .72} stroke={active ? '#2563eb' : 'var(--border)'} strokeWidth="2" />
        <text x={x + 12} y={y + 29} fontSize="21" fontWeight="800" fill={active ? '#1d4ed8' : 'var(--foreground)'}>{stage.key}</text>
        <text x={x + 12} y={y + 55} fontSize="17" fill="var(--muted-foreground)">{stage.role}</text>
      </g>;
    })}
    <path d="M156 79H170M304 79H318M452 79H466M559 116V140M466 185H452M318 185H304M170 185H156" fill="none" stroke="#0d9488" strokeWidth="3" markerEnd="url(#handbook-flow-arrow)" />
    <path d="M30 185C8 185 8 79 22 79" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="7 5" markerEnd="url(#handbook-feedback-arrow)" />
    <text x="34" y="247" fontSize="17" fontWeight="700" fill="#b45309">시험·검사 결과가 위협과 모델 가정을 다시 갱신</text>
  </>;
}

export function NasaCompositeHandbookLab() {
  const [view, setView] = useState<NasaView>('bba');
  const [flaw, setFlaw] = useState(.25);
  const [access, setAccess] = useState(82);
  const [testLevel, setTestLevel] = useState<TestLevel>('element');
  const damage = flaw * (1.25 + (100 - access) / 70);
  const testState = testLevel === 'coupon' ? 'MATERIAL ONLY' : testLevel === 'element' ? 'PARTIAL CORRELATION' : 'CONFIGURATION EVIDENCE';
  const ndeState = access < 100 ? 'BLIND REGION OPEN' : 'QUALIFICATION REQUIRED';

  const explanation = view === 'bba'
    ? 'Handbook는 복합재 손상허용 해석만으로 비행 하드웨어를 인증하기 어렵다고 본다. 각 규모의 시험이 모델과 다음 시험 조건을 되먹임하는 building-block 접근이 필요하다.'
    : view === 'impact'
      ? '운송·취급·도구 낙하·운용 충격을 DTA에서 찾고 IDMP로 줄인다. 그래도 남는 위협은 RTD로 대표해 시험해야 한다.'
      : view === 'delamination'
        ? '수치 예시의 결함 크기와 강도 저하는 그대로 일반화할 수 없다. VCCT/CZM도 계면 데이터, mesh audit, 대표 시험과 함께 읽어야 한다.'
        : '모든 복합재·결함·깊이를 포괄하는 단일 NDE는 없다. 검사 방법, 접근성, 보고 기준과 대표 결함을 하나의 검증 계약으로 남긴다.';

  return <SourceShell icon={ShieldCheck} source="NASA HDBK 5010" title="Composite damage-tolerance claim을 analysis·test·NDE loop로 읽기" status="REV A · 2023/2024">
    <div className="p-4 sm:p-6">
      <SegmentedControl label="Handbook evidence slice" value={view} onChange={setView} options={[{ value: 'bba', label: 'Building blocks' }, { value: 'impact', label: 'Impact threat' }, { value: 'delamination', label: 'Delamination' }, { value: 'inspection', label: 'NDE boundary' }]} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-5">
          {(view === 'bba' || view === 'impact' || view === 'delamination') && <SegmentedControl label="Highest test level" value={testLevel} onChange={setTestLevel} options={[{ value: 'coupon', label: 'Coupon' }, { value: 'element', label: 'Element' }, { value: 'full', label: 'Full-scale' }]} />}
          {view !== 'bba' && <Range label="Representative flaw" value={flaw} min={.05} max={1} step={.05} unit=" in" onChange={setFlaw} />}
          {view === 'inspection' && <Range label="Inspection access" value={access} min={20} max={100} unit="%" onChange={setAccess} />}
        </div>
        <div>
          <div className={plotGrid}>
            {view === 'bba' ? <>
              <svg viewBox="0 0 340 260" className="h-full w-full sm:hidden"><BuildingBlockMap testLevel={testLevel} mobile /></svg>
              <svg viewBox="0 0 620 260" className="hidden h-full w-full sm:block"><BuildingBlockMap testLevel={testLevel} /></svg>
            </> : <>
              <div className="flex h-full flex-col justify-center gap-3 p-4 sm:hidden">
                {view === 'impact' ? (
                  <>
                    {[
                      ['DTA', '공구·위치·지지·환경을 위협으로 고정'],
                      ['IDMP', '보호·절차·검사가 실제로 줄인 범위를 기록'],
                      ['RTD', `${flaw.toFixed(2)} in 대표 잔류 손상을 시험·해석에 남김`],
                    ].map(([label, detail]) => <div key={label} className="border-l-2 border-blue-500 pl-3"><strong className="text-xs">{label}</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>)}
                  </>
                ) : view === 'delamination' ? (
                  <>
                    <div className="h-7 rounded-sm border border-blue-500/30 bg-blue-500/15" />
                    <div className="h-1 bg-red-500" style={{ width: `${Math.min(90, 12 + flaw * 70)}%` }} />
                    <div className="h-7 rounded-sm border border-teal-500/30 bg-teal-500/15" />
                    <p className="text-xs leading-relaxed text-muted-foreground">계면 flaw 크기만으로 닫지 않습니다. 위치·mixed mode·mesh·interface data·대표 시험을 함께 봅니다.</p>
                  </>
                ) : (
                  <>
                    <div className="h-10 overflow-hidden rounded border border-border bg-muted">
                      <div className="h-full bg-teal-500/25" style={{ width: `${access}%` }} />
                    </div>
                    <p className="text-xs font-black">{access}% 접근 가능 · {100 - access}% blind</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">비접근 영역은 무결함이 아니라 RTD가 남는 영역입니다.</p>
                  </>
                )}
              </div>
              <svg viewBox="0 0 620 260" className="hidden h-full w-full sm:block">
              {view === 'impact' ? <>
                  <path d="M70 92H550" stroke="#2563eb" strokeWidth="12" />
                  <circle cx="310" cy="56" r="25" fill="#94a3b8" />
                  <ellipse cx="310" cy="145" rx={45 + damage * 80} ry={18 + damage * 20} fill="#fca5a5" opacity=".75" />
                  <path d="M310 80V114" stroke="#d97706" strokeWidth="4" />
                  <text x="72" y="220" fontSize="20" fontWeight="700" fill="var(--muted-foreground)">IDMP가 줄여도 RTD는 잔류 위협을 대표해야 한다</text>
                </> : view === 'delamination' ? <>
                  <rect x="72" y="85" width="476" height="32" fill="#bfdbfe" />
                  <rect x="72" y="147" width="476" height="32" fill="#99f6e4" />
                  <path d={`M72 132H${72 + flaw * 330}`} stroke="#dc2626" strokeWidth="7" />
                  <path d={`M${72 + flaw * 330} 132 Q${120 + flaw * 350} 82 ${180 + flaw * 350} 104`} fill="none" stroke="#d97706" strokeWidth="3" />
                  <text x="74" y="220" fontSize="20" fontWeight="700" fill="var(--muted-foreground)">계면 데이터·mesh audit·대표 시험이 함께 필요</text>
                </> : <>
                  <rect x="72" y="78" width="476" height="112" rx="7" fill="#e2e8f0" />
                  <rect x="72" y="78" width={476 * access / 100} height="112" rx="7" fill="#ccfbf1" />
                  <line x1={72 + 476 * access / 100} x2={72 + 476 * access / 100} y1="62" y2="208" stroke="#d97706" strokeWidth="3" strokeDasharray="6 5" />
                  <ellipse cx={95 + flaw * 320} cy="135" rx="35" ry="13" fill="#dc2626" opacity=".75" />
                  <text x="74" y="228" fontSize="20" fontWeight="700" fill="var(--muted-foreground)">비접근 구역은 무결함이 아니라 잔류 위협이다</text>
                </>}
              </svg>
            </>}
            <span className="absolute left-3 top-3 text-[10px] font-black text-muted-foreground">{view === 'bba' ? 'ITERATIVE BBA, NOT A ONE-WAY PYRAMID' : view === 'impact' ? 'DTA → IDMP → RTD' : view === 'delamination' ? 'TEST-VERIFIED INTERFACE ANALYSIS' : 'METHOD × FLAW × ACCESS'}</span>
          </div>
          <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/[.04] p-3 text-xs leading-relaxed">{explanation}</div>
        </div>
      </div>
      <div className="mt-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Threat state', value: 'DEFINED INPUT' },
        { label: 'RTD represented', value: `${flaw.toFixed(2)} in` },
        { label: 'Test correlation', value: testState },
        { label: 'NDE state', value: ndeState },
        { label: 'Release decision', value: 'AUTHORITY REQUIRED' },
      ]} /></div>
    </div>
  </SourceShell>;
}
