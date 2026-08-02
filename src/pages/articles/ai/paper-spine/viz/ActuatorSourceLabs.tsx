import { useState, type ReactNode } from 'react';
import { Activity, BookOpenCheck, GitCompareArrows } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function RangeControl({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void }) {
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span><span className="flex min-h-11 items-center"><input className="h-11 w-full cursor-pointer accent-blue-600" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></span></label>;
}

function EvidenceCell({ label, children, tone = 'neutral' }: { label: string; children: ReactNode; tone?: 'neutral' | 'blue' | 'teal' | 'amber' | 'red' | 'violet' }) {
  const color = { neutral: 'bg-background', blue: 'bg-blue-500/[0.035]', teal: 'bg-teal-500/[0.035]', amber: 'bg-amber-500/[0.04]', red: 'bg-red-500/[0.04]', violet: 'bg-violet-500/[0.035]' }[tone];
  return <div className={`min-w-0 p-4 ${color}`}><p className="text-[10px] font-black text-muted-foreground">{label}</p><div className="mt-2 text-xs leading-relaxed">{children}</div></div>;
}

type CatalogView = 'selection' | 'duty' | 'stiffness' | 'accuracy' | 'bearing' | 'brake' | 'evidence';

const catalogEvidence: Record<CatalogView, { page: string; claim: string; assumes: string; reject: string; measure: string }> = {
  selection: { page: 'PDF pp. 158–159', claim: 'Torque뿐 아니라 stiffness, wave-generator bearing, output-bearing와 duty/life를 함께 검사하는 selection flow를 제시한다.', assumes: 'Exact product family, size, ratio와 catalog condition을 사용한다.', reject: '“Rated output torque 이내면 actuator selection 완료”라는 단일 gate.', measure: 'Mission torque/speed history와 mounting/load interface.' },
  duty: { page: 'PDF p. 159', claim: 'Reference cycle에서 RMS torque, average speed와 wave-generator bearing L10 workflow를 제공한다.', assumes: 'Catalog가 정의한 segment, factor와 product-side quantity를 따른다.', reject: '한 번의 peak 또는 다른 vendor의 factor를 그대로 대입.', measure: 'Full cycle histogram, repetition, shock와 temperature.' },
  stiffness: { page: 'PDF pp. 160–161', claim: 'Piecewise K1/K2/K3 stiffness와 simplified load-inertia resonance screen을 제공한다.', assumes: 'Housing stiffness가 충분히 높고 example의 model boundary가 맞는다.', reject: 'One-inertia formula를 모든 flexible joint의 control mode proof로 사용.', measure: 'Assembled joint sweep-sine, load pose와 housing/link deformation.' },
  accuracy: { page: 'PDF pp. 166–167', claim: 'Zero tooth backlash와 hysteresis loss, lost motion, repeatability, transmission accuracy를 분리한다.', assumes: '각 test torque, direction, fixture와 exact part condition을 보존한다.', reject: 'Zero backlash를 zero reversal error 또는 guaranteed accuracy로 번역.', measure: 'Loading/unloading angle trace and repeated position data.' },
  bearing: { page: 'PDF pp. 158–159, product data', claim: 'Output bearing과 wave-generator bearing life를 reducer torque와 별도 check로 둔다.', assumes: 'Radial/axial/moment load가 catalog reference에 올바르게 환산된다.', reject: 'Link output torque만으로 integrated bearing capacity를 결론.', measure: '3D load spectrum, moment arm, shock, preload and mounting.' },
  brake: { page: 'PDF pp. 172–173', claim: 'Brake를 holding/fail-safe 용도로 설명하고 motor/output feedback options를 구분한다.', assumes: 'Selected brake option, rated condition와 controller handover가 확인된다.', reject: 'Holding brake를 반복 dynamic service brake 또는 safety proof로 간주.', measure: 'Torque overlap, delay, wear, output fall and dual-encoder residual.' },
  evidence: { page: 'PDF p. 175; issue p. 177', claim: '여러 시험·경험에 기반한 값에는 제품별 산포가 있으며, 달리 합의하지 않는 한 보증 특성이 아니다.', assumes: 'Issue 1053524 05/2026 and exact data row identity remain attached. 평균으로 명시된 항목과 일반 시험 기반 값을 분리한다.', reject: '시험 기반 값을 guaranteed minimum이나 다른 revision/ratio의 property로 전이.', measure: 'Purchased-part certificate/data, incoming test and assembled system evidence.' },
};

function CatalogVisual({ view }: { view: CatalogView }) {
  if (view === 'selection') return <div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border">{[
    ['Torque / speed', '임무의 peak torque와 입력·출력 speed gate를 먼저 닫는다.'],
    ['RMS / cycle', '가속·유지·반전·감속·idle을 전체 cycle로 합친다.'],
    ['Stiffness / mode', 'piecewise torsional stiffness와 조립 joint 공진을 분리한다.'],
    ['WG + output bearing', 'wave-generator life와 radial·axial·moment bearing load를 따로 계산한다.'],
    ['Brake / feedback', 'holding brake의 인계 시점과 motor/output feedback 잔차를 검증한다.'],
  ].map(([label, note], index) => <div key={label} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-3 bg-background p-3">
    <span className="font-mono text-[10px] font-black text-blue-700 dark:text-blue-300">{String(index + 1).padStart(2, '0')}</span>
    <div className="min-w-0"><p className="break-words text-xs font-black leading-snug">{label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p></div>
  </div>)}</div>;
  if (view === 'duty') return <div><div className="grid h-40 grid-cols-5 items-end gap-3 border-b border-l border-border p-3">{[75, 42, 92, 58, 12].map((height, index) => <div key={height} className={index === 2 ? 'bg-red-500/70' : index === 4 ? 'bg-muted' : 'bg-blue-600/65'} style={{ height: `${height}%` }} />)}</div><div className="mt-2 grid grid-cols-5 gap-2 text-center text-[10px] text-muted-foreground">{['가속', '유지', '반전', '감속', 'Idle'].map((label) => <span key={label}>{label}</span>)}</div></div>;
  if (view === 'stiffness') return <div className="relative h-48 overflow-hidden rounded border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.4)_1px,transparent_1px)] bg-[size:16.66%_25%]"><svg role="img" aria-label="세 구간 torsional stiffness 곡선" viewBox="0 0 600 190" className="h-full w-full" preserveAspectRatio="none"><polyline points="30,165 185,120 360,75 570,35" fill="none" stroke="#2563eb" strokeWidth="3" /><line x1="185" x2="185" y1="25" y2="170" stroke="#d97706" strokeDasharray="6 5" /><line x1="360" x2="360" y1="25" y2="170" stroke="#d97706" strokeDasharray="6 5" /></svg><div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 text-center text-[10px] font-black"><span>K₁</span><span>K₂</span><span>K₃</span></div></div>;
  if (view === 'accuracy') return <div className="relative h-48 overflow-hidden rounded border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.4)_1px,transparent_1px)] bg-[size:16.66%_25%]"><svg role="img" aria-label="Loading unloading hysteresis loop" viewBox="0 0 600 190" className="h-full w-full" preserveAspectRatio="none"><path d="M30 160 C180 145 260 112 305 90 C360 60 450 35 570 28" fill="none" stroke="#0d9488" strokeWidth="3" /><path d="M30 148 C185 135 275 101 325 80 C390 54 480 37 570 39" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="7 5" /></svg><span className="absolute bottom-3 left-3 rounded border border-border bg-background px-2 py-1 text-[10px] font-black">LOST MOTION ≠ TOOTH BACKLASH</span></div>;
  if (view === 'bearing') return <div className="relative h-48 overflow-hidden rounded border border-border"><div className="absolute left-[24%] top-[18%] h-[64%] w-16 rounded-sm border-2 border-foreground/25 bg-muted" /><div className="absolute left-[24%] top-1/2 h-px w-[55%] bg-violet-500" /><span className="absolute left-[18%] top-3 text-xs font-black text-blue-700 dark:text-blue-300">↓ Radial</span><span className="absolute bottom-3 left-[38%] text-xs font-black text-teal-700 dark:text-teal-300">→ Axial</span><span className="absolute right-3 top-[42%] text-xs font-black text-violet-700 dark:text-violet-300">↻ Moment</span></div>;
  if (view === 'brake') return <div className="grid gap-4"><div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3"><div className="rounded border border-blue-500/30 bg-blue-500/[0.035] p-3"><p className="text-[10px] font-black">MOTOR FEEDBACK</p><p className="mt-2 text-xs">Rotor/input state</p></div><GitCompareArrows className="h-5 w-5 text-muted-foreground" /><div className="rounded border border-teal-500/30 bg-teal-500/[0.035] p-3"><p className="text-[10px] font-black">OUTPUT FEEDBACK</p><p className="mt-2 text-xs">Actual link state</p></div></div><div className="rounded border border-amber-500/30 bg-amber-500/[0.04] p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">HOLDING BRAKE CONTRACT</p><p className="mt-2 text-xs leading-relaxed">Brake torque가 충분한가 → engagement가 proven됐는가 → 그 뒤 motor torque를 제거하는가.</p></div></div>;
  return <div className="grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">{[['Artifact identity', '1053524 · 05/2026', true], ['Test condition', 'Normal pressure · temperature · standard lubrication', true], ['Value type', 'Test-based · scatter · not warranted', false], ['Transfer', 'Exact product / ratio / mounting only', false]].map(([label, value, stable]) => <div key={String(label)} className={`bg-background p-4 ${stable ? '' : 'bg-amber-500/[0.035]'}`}><p className="text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-2 text-xs font-semibold leading-relaxed">{value}</p></div>)}</div>;
}

export function HarmonicDriveReferenceLab() {
  const [view, setView] = useState<CatalogView>('selection');
  const selected = catalogEvidence[view];
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background"><figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pl-6 sm:pr-20"><span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300"><BookOpenCheck className="h-4 w-4" /> SOURCE EXPLORER</span><strong className="min-w-0 break-words text-sm leading-snug">Harmonic Drive Mechatronics 05/2026</strong><span className="text-xs font-black text-violet-700 dark:text-violet-300">{selected.page}</span></figcaption><div className="p-4 sm:p-6"><SegmentedControl label="Catalog evidence view" value={view} onChange={setView} options={[{ value: 'selection', label: 'Selection' }, { value: 'duty', label: 'Duty / life' }, { value: 'stiffness', label: 'Stiffness' }, { value: 'accuracy', label: 'Accuracy' }, { value: 'bearing', label: 'Bearing' }, { value: 'brake', label: 'Brake / feedback' }, { value: 'evidence', label: 'Disclaimer' }]} /><div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]"><CatalogVisual view={view} /><div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border"><EvidenceCell label="SOURCE CLAIM" tone="blue">{selected.claim}</EvidenceCell><EvidenceCell label="ASSUMPTION" tone="amber">{selected.assumes}</EvidenceCell><EvidenceCell label="DO NOT TRANSFER" tone="red">{selected.reject}</EvidenceCell><EvidenceCell label="CLOSE WITH SYSTEM EVIDENCE" tone="teal">{selected.measure}</EvidenceCell></div></div></div></figure>;
}

type SeaContact = 'clamped' | 'hard' | 'soft' | 'moving';
type SeaMode = 'source' | 'sandbox';

const contactEvidence: Record<SeaContact, { label: string; observation: string; boundary: string }> = {
  clamped: { label: 'Clamped sweep', observation: '이상식은 48 rad/s를 예측했지만 측정 공진은 38.4 rad/s였다.', boundary: '고정 출력의 작은 신호 응답만 다루며 움직이는 환경을 설명하지 않는다.' },
  hard: { label: 'Hard contact', observation: '낮은 주파수 힘 추종을 보였지만 transient에는 마찰·current clipping·phase가 남았다.', boundary: '한 hard fixture가 임의의 사람·구조 접촉 안정성을 보장하지 않는다.' },
  soft: { label: 'Soft contact', observation: '환경 compliance가 바뀌면 같은 controller에서도 force transient와 settling이 달라졌다.', boundary: '환경 stiffness를 모르면 clamped transfer만으로 결과를 예측할 수 없다.' },
  moving: { label: 'Moving output', observation: '부하 운동이 motor demand에 J_ms²θ_l 항으로 들어와 spring을 감는 운동과 경쟁한다.', boundary: '정지 벽에서 얻은 bandwidth를 움직이는 출력에 그대로 옮기지 않는다.' },
};

export function WilliamsonSeaLab() {
  const [mode, setMode] = useState<SeaMode>('source');
  const [contact, setContact] = useState<SeaContact>('clamped');
  const [stiffness, setStiffness] = useState(46);
  const [motorInertia, setMotorInertia] = useState(.02);
  const predictedOmega = Math.sqrt(46 / .02);
  const measuredOmega = 38.4;
  const inferredInertia = 46 / measuredOmega ** 2;
  const sandboxOmega = Math.sqrt(stiffness / motorInertia);
  const sandboxHz = sandboxOmega / (2 * Math.PI);
  const selected = contactEvidence[contact];

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pl-6 sm:pr-20">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300"><Activity className="h-4 w-4" /> SEA RECONSTRUCTION</span>
        <strong className="min-w-0 break-words text-sm leading-snug">원문 측정 replay와 가상 parameter sandbox를 분리한다</strong>
        <span className="text-xs font-black text-teal-700 dark:text-teal-300">{mode === 'source' ? 'SOURCE REPLAY' : 'HYPOTHETICAL'}</span>
      </figcaption>
      <div className="p-4 sm:p-6">
        <SegmentedControl label="Evidence mode" value={mode} onChange={setMode} options={[{ value: 'source', label: '1995 source replay' }, { value: 'sandbox', label: 'What-if sandbox' }]} />
        {mode === 'source' ? (
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
            <div className="min-w-0 space-y-5">
              <SegmentedControl label="Source experiment boundary" value={contact} onChange={setContact} options={[{ value: 'clamped', label: 'Clamped' }, { value: 'hard', label: 'Hard contact' }, { value: 'soft', label: 'Soft contact' }, { value: 'moving', label: 'Moving output' }]} />
              <div className="border-y border-border py-4">
                <p className="text-xs font-black">{selected.label}</p>
                <p className="mt-2 text-sm leading-relaxed">{selected.observation}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">전이 경계:</strong> {selected.boundary}</p>
              </div>
            </div>
            <div className="min-w-0">
              <div className="relative h-44 rounded-md border border-border p-5">
                <p className="text-[10px] font-black text-muted-foreground">CLAMPED NATURAL FREQUENCY · rad/s</p>
                <div className="absolute inset-x-5 top-1/2 h-1 rounded bg-muted">
                  <span className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 bg-teal-600" style={{ left: `${measuredOmega / 60 * 100}%` }} />
                  <span className="absolute top-1/2 h-12 w-0.5 -translate-y-1/2 bg-blue-600" style={{ left: `${predictedOmega / 60 * 100}%` }} />
                </div>
                <div className="absolute inset-x-5 bottom-4 flex flex-wrap justify-between gap-3 text-xs">
                  <span className="font-semibold text-teal-700 dark:text-teal-300">측정 38.4</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">J=0.02 예측 {fmt(predictedOmega, 1)}</span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">K=46 N·m/rad와 측정 38.4 rad/s를 역산하면 effective J≈{fmt(inferredInertia, 3)} kg·m²다. Quoted motor inertia보다 큰 값은 gearbox와 spring-side moving inertia를 model에 되돌려 넣어야 한다는 원문 evidence다.</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
            <div className="min-w-0 space-y-5">
              <RangeControl label="Series stiffness" value={stiffness} min={20} max={180} step={2} unit=" N·m/rad" onChange={setStiffness} />
              <RangeControl label="Effective motor-side inertia" value={motorInertia} min={.01} max={.08} step={.005} unit=" kg·m²" onChange={setMotorInertia} />
              <p className="border-y border-border py-3 text-xs leading-relaxed text-muted-foreground">이 control은 ωn=√(k/J)의 민감도만 계산하는 가상 sandbox다. 논문 측정, contact stability 또는 제품 성능 판정이 아니다.</p>
            </div>
            <div className="min-w-0">
              <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                <EvidenceCell label="PREDICTED ωₙ" tone="blue"><strong className="text-lg">{fmt(sandboxOmega, 1)} rad/s</strong></EvidenceCell>
                <EvidenceCell label="PREDICTED fₙ" tone="teal"><strong className="text-lg">{fmt(sandboxHz, 1)} Hz</strong></EvidenceCell>
                <EvidenceCell label="STIFFNESS EFFECT">k를 네 배로 하면 이상 고유 주파수는 두 배가 된다.</EvidenceCell>
                <EvidenceCell label="INERTIA EFFECT" tone="amber">J를 네 배로 하면 이상 고유 주파수는 절반이 된다.</EvidenceCell>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border p-4 sm:p-6">
        <MetricGrid mobileColumns={2} items={mode === 'source' ? [
          { label: 'Source stiffness', value: '46 N·m/rad' },
          { label: 'Quoted J', value: '0.020 kg·m²' },
          { label: 'Predicted ωₙ', value: `${fmt(predictedOmega, 1)} rad/s` },
          { label: 'Measured ωₙ', value: '38.4 rad/s' },
          { label: 'Inferred effective J', value: `${fmt(inferredInertia, 3)} kg·m²`, accent: true },
        ] : [
          { label: 'Sandbox k', value: `${stiffness} N·m/rad` },
          { label: 'Sandbox J', value: `${motorInertia} kg·m²` },
          { label: 'Predicted ωₙ', value: `${fmt(sandboxOmega, 1)} rad/s` },
          { label: 'Evidence status', value: 'HYPOTHETICAL ONLY' },
        ]} />
      </div>
    </figure>
  );
}
