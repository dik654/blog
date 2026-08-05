import { useState } from 'react';
import { BookOpenCheck, CheckCircle2, CircuitBoard, Clock3 } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type View = 'architecture' | 'assumptions' | 'diagnostics' | 'timing' | 'revision' | 'tuev';

const views: Record<View, { page: string; title: string; condition: string; observation: string; transfer: string; limit: string; status: string }> = {
  architecture: {
    page: 'Guide pp. 4-6',
    title: '두 channel은 서로 다른 gate-driver power path를 de-energize한다',
    condition: 'STO_1은 primary logic supply VCC path, STO_2는 P24를 거쳐 isolated DC/DC와 secondary gate supply path를 차단한다. 두 입력은 active-low이며 diagnostic MCU는 safety path 밖이다.',
    observation: '한 path가 stuck되어도 다른 power-removal path가 torque-producing gate energy를 없애도록 1oo2/HFT1 architecture를 만든다.',
    transfer: 'Independent removal principles, de-energize-to-trip direction, channel feedback and external-assumption ledger.',
    limit: 'Target board의 layout, supply faults, gate-driver discharge, motor behavior와 machine safe state는 다시 검증한다.',
    status: 'FUNCTIONAL ARCHITECTURE',
  },
  assumptions: {
    page: 'Guide pp. 3, 5-6',
    title: 'Headline target는 외부 assumption과 excluded work 위에 서 있다',
    condition: 'Protected 3.3/24 V supplies, secondary rails below threshold within 10 ms, added temperature sensor/shutdown, MCU/software outside scope, PCB CCF and quantitative PFH/MTTFd analysis outside concept study.',
    observation: 'Reference design은 input pulse, supply and rail-decay contracts가 깨지면 같은 claim을 자동 유지하지 않는다.',
    transfer: 'Assumption-to-test matrix and explicit ownership at every external interface.',
    limit: 'Nominal 10 ms, max 200 ms, DTI 100 ms and PFH target are not target-machine measurements or completed quantitative proof.',
    status: 'ASSUMPTIONS EXPOSED',
  },
  diagnostics: {
    page: 'Guide pp. 10-12',
    title: 'Truth table은 single fault와 dual dangerous fault의 경계를 함께 보여 준다',
    condition: 'STO inputs and feedback are evaluated as channel combinations. One dangerous channel fault is tolerated/detected; two dangerous faults can leave normal state because architecture is HFT1, not HFT2.',
    observation: 'Feedback must reveal channel mismatch and a monitor must interpret it within the diagnostic interval. Feedback alone does not create diagnostic coverage.',
    transfer: 'Fault truth table, stale-feedback detection, single/combined fault injection and DTI ownership.',
    limit: 'Final MCU self-test, diagnostic effectiveness, common-cause analysis and software implementation were not certified by the concept report.',
    status: 'HFT1 BOUNDARY VISIBLE',
  },
  timing: {
    page: 'Guide pp. 27-32',
    title: 'Published milliseconds are test-point observations, not robot stop time',
    condition: 'Shown tests on Rev. E1.0 report about 2.7 ms STO_1-to-RDY, 7.4 ms STO_2-to-RDY and 1.52 ms trip-zone PWM shutdown, with 1 ms pulse rejection and 100 µs diagnostic-pulse observations.',
    observation: 'Different paths have different delays; input filtering and isolated-rail decay are visible parts of response.',
    transfer: 'Measure each electronic path and preserve pulse-width contract, maximum condition and test point.',
    limit: 'These numbers do not include motor coast, brake engagement, vertical load motion, DC-link discharge or E2.1 retest evidence.',
    status: 'BOARD-SPECIFIC OBSERVATION',
  },
  revision: {
    page: 'Guide pp. 25-26',
    title: 'Test figures identify Rev. E1.0 while released design is Rev. E2.1',
    condition: 'The guide lists 15 major changes, including separated isolators/logic for HFT1, a safe-fail load switch, clamp, feedback/power-rail scope and PCB-layer changes.',
    observation: 'Architecture improvements can invalidate or require repetition of earlier timing, EMC, thermal and fault evidence.',
    transfer: 'Pin schematic/PCB/BOM/test revision separately and attach every claim to the artifact actually measured.',
    limit: 'A later public design file does not silently upgrade a waveform captured on an earlier assembly.',
    status: 'REVISION PROVENANCE ON',
  },
  tuev: {
    page: 'TF97657T pp. 7-8',
    title: 'TÜV report is a concept assessment with explicit end-user duties',
    condition: 'The review covers concept/system structure and block FMEA. Functional-safety management and self-tests are outside scope; final diagnostic effectiveness, DTI and integration must be re-evaluated. ISO 13849 basis is the historical 2015 edition.',
    observation: 'The architecture is described as generally suitable/capable of supporting intended SIL3/PL e applications under its assumptions.',
    transfer: 'Read assessor language, reviewed artifacts, standards edition, exclusions and final owner before using the result.',
    limit: 'The report does not certify the reader’s PCB, firmware, robot, cable, holding brake, EMC or machine lifecycle.',
    status: 'CONCEPT, NOT MACHINE CERT',
  },
};

function Block({ label, detail, tone = 'blue' }: { label: string; detail: string; tone?: 'blue' | 'teal' | 'amber' | 'red' | 'violet' }) {
  const css = { blue: 'border-blue-500/30 bg-blue-500/[0.035]', teal: 'border-teal-500/30 bg-teal-500/[0.035]', amber: 'border-amber-500/30 bg-amber-500/[0.04]', red: 'border-red-500/30 bg-red-500/[0.04]', violet: 'border-violet-500/30 bg-violet-500/[0.035]' }[tone];
  return <div className={`min-w-0 rounded-md border p-4 ${css}`}><p className="text-xs font-black">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>;
}

export default function TidaStoReferenceLab() {
  const [view, setView] = useState<View>('architecture');
  const item = views[view];
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24"><span className="flex items-center gap-2 font-mono text-xs font-black text-violet-700 dark:text-violet-300"><CircuitBoard className="h-4 w-4" /> TIDA-01599 LAB</span><strong className="min-w-0 text-sm leading-snug">Architecture와 assessor evidence의 경계를 보존하기</strong><span className="text-xs font-black text-emerald-700 dark:text-emerald-300">SOURCE BOUNDARY ON</span></figcaption>
    <div className="p-4 sm:p-6"><SegmentedControl label="Evidence slice" value={view} onChange={setView} options={[{ value: 'architecture', label: 'Architecture' }, { value: 'assumptions', label: 'Assumptions' }, { value: 'diagnostics', label: 'Diagnostics' }, { value: 'timing', label: 'Timing' }, { value: 'revision', label: 'Revision' }, { value: 'tuev', label: 'TÜV scope' }]} /><div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"><div className="min-w-0 rounded-md border border-border bg-muted/[0.055] p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">PINNED SOURCE · {item.page}</p><h4 className="mt-2 text-base font-black leading-snug">{item.title}</h4></div><BookOpenCheck className="h-5 w-5 shrink-0 text-muted-foreground" /></div><div className="mt-5 border-l-2 border-violet-500/40 pl-4"><p className="text-[10px] font-black text-muted-foreground">SOURCE CONDITION</p><p className="mt-2 text-sm leading-relaxed">{item.condition}</p></div><div className="mt-5"><p className="text-[10px] font-black text-muted-foreground">OBSERVATION</p><p className="mt-2 text-sm leading-relaxed">{item.observation}</p></div><div className="mt-5 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/[0.04] px-3 py-2 text-xs font-black text-emerald-800 dark:text-emerald-200"><CheckCircle2 className="h-4 w-4" />{item.status}</div></div><div className="min-w-0">{view === 'architecture' ? <div><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-2"><Block label="STO_1 · PRIMARY PATH" detail="24 V input → filter/logic → primary VCC load switch" tone="blue" /><Block label="Gate command path" detail="Primary logic supply removed · de-energize to trip" tone="teal" /></div><div className="space-y-2"><Block label="STO_2 · SECONDARY PATH" detail="24 V input → filter/logic → P24 isolated DC/DC input" tone="violet" /><Block label="Isolated gate rails" detail="Secondary supply decays below driver enable/UVLO" tone="teal" /></div></div><Block label="DIAGNOSTIC MCU" detail="Feedback observer outside the declared safety path; firmware still owns final monitoring implementation." tone="amber" /></div> : view === 'timing' ? <div><div className="space-y-3">{[['STO_1 → RDY', 2.7, 'Primary path'], ['STO_2 → RDY', 7.4, 'Isolated supply path'], ['Trip zone → PWM off', 1.52, 'MCU/hardware PWM path']].map(([label, value, note]) => <div key={String(label)} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-3"><div><div className="mb-1 flex items-center justify-between gap-2 text-xs"><strong>{label}</strong><span className="text-muted-foreground">{note}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-violet-600" style={{ width: `${Number(value) / 8 * 100}%` }} /></div></div><span className="text-right font-mono text-xs font-black">{value} ms</span></div>)}</div><div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-700" /><p className="text-xs font-black">REV E1.0 OBSERVATIONS</p></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">READY/PWM test point까지의 example이다. Motion-safe와 E2.1 evidence가 아니다.</p></div></div> : view === 'revision' ? <div className="grid gap-3 sm:grid-cols-2"><Block label="TESTED ASSEMBLY" detail="Figures identify Rev. E1.0 for the shown tests." tone="amber" /><Block label="PUBLIC DESIGN" detail="Released design files and revision log identify E2.1." tone="blue" /><Block label="ARCHITECTURE CHANGES" detail="Separated logic/isolators, safe-fail switch, feedback and rail scope." tone="violet" /><Block label="EVIDENCE ACTION" detail="Re-run affected timing, EMC, fault and integration tests." tone="red" /></div> : view === 'tuev' ? <div className="grid gap-3"><Block label="REVIEWED" detail="Concept, system structure and block FMEA." tone="teal" /><Block label="OUTSIDE SCOPE" detail="Functional-safety management and self-test implementation." tone="amber" /><Block label="FINAL OWNER" detail="Diagnostics, DTI, integration, verification, lifecycle and exact machine claim." tone="red" /></div> : <div className="grid gap-3"><Block label="TRANSFERS" detail={item.transfer} tone="blue" /><Block label="DOES NOT TRANSFER" detail={item.limit} tone="amber" />{view === 'diagnostics' && <div className="grid gap-2 sm:grid-cols-2"><Block label="ONE DANGEROUS FAULT" detail="Other path removes torque power or mismatch is diagnosed." tone="teal" /><Block label="TWO / COMMON CAUSE" detail="Can defeat HFT1; separate claim and analysis required." tone="red" /></div>}</div>}</div></div></div>
    <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Guide revision', value: 'TIDUDS9B · 2022' }, { label: 'Assessor report', value: 'TF97657T · 2022' }, { label: 'Evidence slice', value: view.toUpperCase() }, { label: 'Claim class', value: 'CONCEPT SUPPORT', accent: true }]} /></div>
  </figure>;
}
