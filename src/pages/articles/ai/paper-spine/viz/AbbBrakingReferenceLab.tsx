import { useState } from 'react';
import { BookOpenCheck, CheckCircle2, Factory, ShieldAlert } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type View = 'mechanics' | 'headroom' | 'chopper' | 'alternatives' | 'common' | 'boundary';

const fmt = (value: number, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

const evidence: Record<View, { page: string; claim: string; condition: string; observation: string; transfer: string; limit: string; status: string }> = {
  mechanics: {
    page: 'pp. 6-11',
    claim: 'Braking devices are dimensioned from mechanical braking power and energy.',
    condition: 'Torque, speed, inertia, load characteristic and requested braking time are declared.',
    observation: 'The guide derives P=Tω, kinetic energy and average power, then shows that natural load behavior changes the required active braking profile.',
    transfer: 'Robot joint sizing starts from payload/reflected inertia and the requested motion, not motor nameplate current.',
    limit: 'The fan example does not model a robot gearbox, vertical payload, spring, battery or simultaneous axes.',
    status: 'MECHANICS FIRST',
  },
  headroom: {
    page: 'pp. 13-14',
    claim: 'The DC-link capacitor alone has very little time to absorb rated reverse power.',
    condition: 'ABB worked example: C=5 mF, Vdc 565→735 V, P=90 kW.',
    observation: 'The published calculation gives approximately 6 ms before the capacitor reaches its assumed maximum.',
    transfer: 'Use the same squared-voltage energy method to calculate a robot supervisor/chopper deadline.',
    limit: 'The 565/735 V thresholds and 90 kW operating point do not transfer to a 48 V robot.',
    status: 'ABOUT 6 ms',
  },
  chopper: {
    page: 'pp. 14-15',
    claim: 'A threshold-controlled switch can move bus energy into a resistor when the input cannot return power.',
    condition: 'Occasional braking, bounded duty cycle, declared resistor cooling and bus threshold.',
    observation: 'ABB lists simple construction and supply-loss availability, alongside heat, space, cycle, fire and insulation-stress costs.',
    transfer: 'A robot chopper is a local deterministic sink only inside current, pulse-energy and thermal limits.',
    limit: 'The guide does not choose a resistance, switch or enclosure for the reader’s 48 V design.',
    status: 'LOCAL HEAT SINK',
  },
  alternatives: {
    page: 'pp. 12-22',
    claim: 'Flux braking, resistor braking and regenerative front ends solve different energy-destination problems.',
    condition: 'Load duty, continuous versus occasional braking, efficiency, harmonics, footprint and cost are compared.',
    observation: 'Motor-loss braking adds motor heat; resistor braking discards energy; regenerative units return energy and add system complexity.',
    transfer: 'Choose from destination availability and duty instead of treating every negative torque as the same brake mode.',
    limit: 'Industrial mains front-end economics are not a battery-robot architecture ranking.',
    status: 'TOPOLOGY DEPENDS ON DUTY',
  },
  common: {
    page: 'pp. 23-25',
    claim: 'A common DC bus lets a motoring drive reuse another drive’s braking energy.',
    condition: 'Several drives share one DC link and their instantaneous signed powers overlap.',
    observation: 'Peer-axis motoring can reduce conversion loss and chopper size, but net braking still requires a resistor or regenerative supply.',
    transfer: 'A multi-axis robot can reuse energy only from measured concurrent demand.',
    limit: 'Future peer demand and all-axes-braking faults cannot be counted as guaranteed absorption.',
    status: 'REUSE, NOT GUARANTEE',
  },
  boundary: {
    page: 'pp. 26-30',
    claim: 'The guide is a selection method with application-specific examples, not a universal component prescription.',
    condition: 'ABB comparison data uses a 90 kW hoisting application with a 50% braking cycle and named drive assumptions.',
    observation: 'The guide explicitly states that results vary with equipment and dimensioning.',
    transfer: 'Preserve the mechanics-first IR and replace every operating value with target robot evidence.',
    limit: 'No BMS charge acceptance, 48 V contactor diagnostics, mechanical holding or certified safety stop is established.',
    status: 'NO BLIND TRANSFER',
  },
};

const alternativeRows = [
  ['Motor loss', 'motor copper/iron heat', 'motor thermal state', 'limited'],
  ['Resistor', 'external heat', 'pulse + cooling', 'occasional'],
  ['Regenerative unit', 'electrical source/network', 'bidirectional front end', 'continuous-capable'],
  ['Common DC', 'peer motoring axes', 'simultaneous demand', 'net-dependent'],
];

export default function AbbBrakingReferenceLab() {
  const [view, setView] = useState<View>('headroom');
  const item = evidence[view];
  const abbEnergy = 0.5 * 0.005 * (735 ** 2 - 565 ** 2);
  const abbTimeMs = abbEnergy / 90000 * 1000;
  const robotEnergy = 0.5 * 0.0022 * (56 ** 2 - 50 ** 2);
  const robotTimeMs = robotEnergy / 5000 * 1000;
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-red-700 dark:text-red-300"><BookOpenCheck className="h-4 w-4" /> ABB GUIDE LAB</span>
        <strong className="min-w-0 text-sm leading-snug">원문 example과 robot adaptation을 분리해 읽기</strong>
        <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">SOURCE BOUNDARY ON</span>
      </figcaption>
      <div className="p-4 sm:p-6">
        <SegmentedControl label="Evidence slice" value={view} onChange={setView} options={[{ value: 'mechanics', label: 'Mechanics' }, { value: 'headroom', label: 'Headroom' }, { value: 'chopper', label: 'Chopper' }, { value: 'alternatives', label: 'Alternatives' }, { value: 'common', label: 'Common DC' }, { value: 'boundary', label: 'Boundary' }]} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div className="min-w-0 rounded-md border border-border bg-muted/[0.06] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black text-red-700 dark:text-red-300">TECHNICAL GUIDE NO. 8 · {item.page}</p><h4 className="mt-2 text-base font-black leading-snug">{item.claim}</h4></div><Factory className="h-5 w-5 shrink-0 text-muted-foreground" /></div>
            <div className="mt-5 border-l-2 border-red-500/40 pl-4"><p className="text-[10px] font-black text-muted-foreground">SOURCE CONDITION</p><p className="mt-2 text-sm leading-relaxed">{item.condition}</p></div>
            <div className="mt-5"><p className="text-[10px] font-black text-muted-foreground">OBSERVED / DERIVED IN SOURCE</p><p className="mt-2 text-sm leading-relaxed">{item.observation}</p></div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/[0.04] px-3 py-2 text-xs font-black text-emerald-800 dark:text-emerald-200"><CheckCircle2 className="h-4 w-4" />{item.status}</div>
          </div>
          <div className="min-w-0">
            {view === 'headroom' ? <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-red-500/25 bg-red-500/[0.025] p-4"><p className="text-[10px] font-black text-red-700 dark:text-red-300">ABB PUBLISHED EXAMPLE</p><p className="mt-3 font-mono text-2xl font-black">{fmt(abbTimeMs, 1)} ms</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">5 mF · 565→735 V · 90 kW<br />Source p. 14 reports about 6 ms.</p></div><div className="rounded-md border border-blue-500/25 bg-blue-500/[0.025] p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">SEPARATE ROBOT ADAPTATION</p><p className="mt-3 font-mono text-2xl font-black">{fmt(robotTimeMs, 2)} ms</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">2.2 mF · 50→56 V · 5 kW<br />Illustrative inputs, not ABB evidence.</p></div><div className="sm:col-span-2"><svg viewBox="0 0 520 180" className="block aspect-[520/180] w-full rounded-md border border-border bg-muted/[0.04]" role="img" aria-label="ABB and robot capacitor headroom timelines"><line x1="64" y1="54" x2="470" y2="54" className="stroke-border" strokeWidth="4" strokeLinecap="round" /><line x1="64" y1="126" x2="470" y2="126" className="stroke-border" strokeWidth="4" strokeLinecap="round" /><line x1="64" y1="54" x2={64 + Math.min(abbTimeMs / 8, 1) * 406} y2="54" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" /><line x1="64" y1="126" x2={64 + Math.max(robotTimeMs / 8 * 406, 8)} y2="126" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" /><text x="16" y="59" className="fill-foreground text-[11px] font-bold">ABB</text><text x="16" y="131" className="fill-foreground text-[11px] font-bold">Robot</text><text x="416" y="84" className="fill-muted-foreground text-[9px]">8 ms scale</text></svg></div></div> : view === 'alternatives' ? <div>
              <div className="grid gap-2 sm:hidden">{alternativeRows.map((row) => <div key={row[0]} className="rounded-md border border-border bg-muted/[0.035] p-4"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{row[0]}</strong><span className="text-[10px] font-black text-red-700 dark:text-red-300">{row[3]}</span></div><dl className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-relaxed"><dt className="font-black text-muted-foreground">ENERGY 도착점</dt><dd>{row[1]}</dd><dt className="font-black text-muted-foreground">성립 조건</dt><dd>{row[2]}</dd></dl></div>)}</div>
              <div className="hidden overflow-hidden rounded-md border border-border sm:block"><div className="grid grid-cols-[0.8fr_1.2fr_1fr_0.8fr] gap-px bg-border text-[10px] font-black text-muted-foreground"><span className="bg-muted/70 p-3">PATH</span><span className="bg-muted/70 p-3">DESTINATION</span><span className="bg-muted/70 p-3">DEPENDENCY</span><span className="bg-muted/70 p-3">DUTY</span></div>{alternativeRows.map((row) => <div key={row[0]} className="grid grid-cols-[0.8fr_1.2fr_1fr_0.8fr] gap-px border-t border-border bg-border text-xs"><strong className="bg-background p-3">{row[0]}</strong><span className="bg-background p-3 text-muted-foreground">{row[1]}</span><span className="bg-background p-3 text-muted-foreground">{row[2]}</span><span className="bg-background p-3 text-muted-foreground">{row[3]}</span></div>)}</div>
            </div> : view === 'common' ? <div className="rounded-md border border-border bg-muted/[0.04] p-4"><p className="text-[10px] font-black text-muted-foreground">COMMON DC · INSTANTANEOUS POWER</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4"><p className="text-xs font-black">Axis A</p><p className="mt-2 font-mono text-xl font-black">−4.0 kW</p><p className="mt-1 text-xs text-muted-foreground">regeneration</p></div><div className="rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-4"><p className="text-xs font-black">Axis B</p><p className="mt-2 font-mono text-xl font-black">+2.5 kW</p><p className="mt-1 text-xs text-muted-foreground">motoring reuse</p></div><div className="rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-4"><p className="text-xs font-black">Residual</p><p className="mt-2 font-mono text-xl font-black">1.5 kW</p><p className="mt-1 text-xs text-muted-foreground">source or chopper</p></div></div><p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">ABB의 topology insight는 transfer된다. 이 숫자는 설명용 robot state이며 guide의 test result가 아니다.</p></div> : <div className="grid gap-3"><div className="rounded-md border border-blue-500/25 bg-blue-500/[0.03] p-4"><p className="text-[10px] font-black text-muted-foreground">TRANSFERS TO ROBOT</p><p className="mt-2 text-sm font-semibold leading-relaxed">{item.transfer}</p></div><div className="rounded-md border border-amber-500/25 bg-amber-500/[0.03] p-4"><div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-700" /><p className="text-[10px] font-black text-muted-foreground">DOES NOT TRANSFER</p></div><p className="mt-2 text-sm leading-relaxed">{item.limit}</p></div></div>}
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Source revision', value: 'REV C · 2018' }, { label: 'Evidence pages', value: item.page }, { label: 'Reading mode', value: view.toUpperCase() }, { label: 'Transfer rule', value: 'METHOD, NOT VALUES', accent: true }]} /></div>
    </figure>
  );
}
