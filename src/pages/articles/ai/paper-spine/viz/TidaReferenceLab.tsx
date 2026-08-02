import { useState } from 'react';
import { AlertTriangle, CheckCircle2, CircuitBoard } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type Path = 'power' | 'gate' | 'sense' | 'shutdown';
type Evidence = 'rating' | 'switching' | 'propagation' | 'sense' | 'thermal' | 'shutdown';

const PATHS: Record<Path, { label: string; summary: string; color: string; nodes: Array<{ label: string; value: string; x: number; y: number }> }> = {
  power: { label: 'Power path', summary: '24-60 V input과 local DC-link에서 세 half bridge를 거쳐 motor phase로 energy가 이동한다.', color: '#2563eb', nodes: [{ label: '24-60 V input', value: 'connector / fuse', x: 20, y: 52 }, { label: 'DC link', value: '>700 µF board', x: 148, y: 52 }, { label: '3-phase bridge', value: '2 parallel FET / switch', x: 276, y: 52 }, { label: 'Servo motor', value: 'U · V · W', x: 404, y: 52 }] },
  gate: { label: 'Gate path', summary: '12 V bias와 DRV8162L의 source/sink·dead-time 설정이 parallel MOSFET VGS를 만든다.', color: '#7c3aed', nodes: [{ label: '12 V bias', value: 'driver supply', x: 20, y: 52 }, { label: 'DRV8162L', value: '1 A / 2 A', x: 148, y: 52 }, { label: 'Gate network', value: 'R · bootstrap · DT', x: 276, y: 52 }, { label: 'Parallel FETs', value: 'measured VGS', x: 404, y: 52 }] },
  sense: { label: 'Sense path', summary: 'Inline shunt의 작은 differential voltage를 INA241/delta-sigma 경로가 PWM common-mode step 속에서 복원한다.', color: '#0f766e', nodes: [{ label: 'Inline shunt', value: 'phase current', x: 20, y: 52 }, { label: 'INA241 A/B', value: 'PWM rejection', x: 148, y: 52 }, { label: 'Output / ADC', value: 'settling window', x: 276, y: 52 }, { label: 'C2000 host', value: 'current evidence', x: 404, y: 52 }] },
  shutdown: { label: 'Shutdown path', summary: 'External channel과 split high/low gate supplies가 MCU PWM과 다른 경로로 bridge drive를 차단하도록 설계됐다.', color: '#dc2626', nodes: [{ label: 'External input', value: 'channel A / B', x: 20, y: 52 }, { label: 'Load switch', value: 'split supplies', x: 148, y: 52 }, { label: 'PWM buffer', value: 'independent enable', x: 276, y: 52 }, { label: 'Gate energy off', value: 'architecture aid', x: 404, y: 52 }] },
};

const EVIDENCE: Record<Evidence, { claim: string; condition: string; observation: string; supports: string; limit: string; status: string }> = {
  rating: { claim: 'Reference title: 48 V, 85 Arms servo drive', condition: 'Architecture/device sizing and design documentation', observation: '24-60 V input, two parallel MOSFETs per switch, programmable driver and current-sense/protection paths are documented.', supports: '85 Arms를 목표로 한 component/topology architecture가 존재한다.', limit: '공개 thermal figure가 85 Arms continuous 운전을 직접 시연하지는 않는다.', status: 'DESIGN CLAIM' },
  switching: { claim: 'Hard/soft switching behavior is characterized', condition: 'Published gate and switch-node captures in the documented setup', observation: 'Turn-on/off VGS and switch-node transitions, hard/soft commutation behavior are shown.', supports: 'Selected gate network and PCB switch path가 실제 switching waveform을 만든다.', limit: '모든 current, cable, device lot, temperature와 snubber option의 worst case를 입증하지 않는다.', status: 'WAVEFORM EVIDENCE' },
  propagation: { claim: 'PWM input becomes gate output with bounded timing', condition: 'Published propagation capture and stated dead-time setting', observation: 'About 200 ns turn-on, 70 ns turn-off and roughly 130 ns additional dead time are visible in the displayed case.', supports: 'Digital request와 physical gate 사이의 nonzero/asymmetric latency를 정량화한다.', limit: 'Datasheet/board/temperature tolerance 전체와 every leg mismatch를 한 trace로 닫지 않는다.', status: 'TIMING EVIDENCE' },
  sense: { claim: 'Inline current sensing resolves PWM phase current', condition: 'Published amplifier/current trace under the reference setup', observation: 'The guide reports a displayed worst-case settling around 1 µs.', supports: 'ADC trigger가 switching edge와 분리된 valid window를 가져야 함을 보인다.', limit: '1 µs가 모든 gain/filter/common-mode/temperature의 universal constant는 아니다.', status: 'SETTLING EVIDENCE' },
  thermal: { claim: 'The power stage can operate without heatsink/fan at the shown point', condition: '48 V, 16 kHz, 26.2 Arms / 37 A peak, 28 °C ambient, no heatsink/fan', observation: 'Reported MOSFET surface rise is 45.5 °C to about 73.5 °C; junction is estimated below 125 °C.', supports: '해당 board와 operating point에서 한 thermal data point와 cooling baseline을 제공한다.', limit: '85 Arms continuous, hotter enclosure, lifetime, transient overload나 all-component hotspot을 입증하지 않는다.', status: 'BOUNDED THERMAL' },
  shutdown: { claim: 'Multichannel shutdown paths assist a STO-oriented architecture', condition: 'Schematic split supplies, load switches, PWM buffer enable and external channels', observation: 'High/low drive-energy and PWM paths can be disabled through more than one mechanism.', supports: 'MCU software 밖에 독립된 shutdown structure를 설계할 수 있음을 보인다.', limit: 'Reference architecture 자체가 certified STO, PFH/PFD, diagnostic coverage나 target-system safety case를 제공하지 않는다.', status: 'ARCHITECTURE ONLY' },
};

export default function TidaReferenceLab() {
  const [path, setPath] = useState<Path>('sense');
  const [evidence, setEvidence] = useState<Evidence>('thermal');
  const selectedPath = PATHS[path];
  const selectedEvidence = EVIDENCE[evidence];
  const bounded = evidence !== 'rating' && evidence !== 'shutdown';
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid gap-2 border-b border-border py-4 pl-4 pr-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-24"><span className="flex items-center gap-2 font-mono text-xs font-black text-violet-700 dark:text-violet-300"><CircuitBoard className="h-4 w-4" /> TIDA-010956 LAB</span><strong className="text-sm leading-snug">Path와 claim-evidence를 분리해 읽기</strong><span className="text-xs font-black text-emerald-700 dark:text-emerald-300">SOURCE BOUNDARY ON</span></figcaption>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Physical path" value={path} onChange={setPath} options={[{ value: 'power', label: 'Power' }, { value: 'gate', label: 'Gate' }, { value: 'sense', label: 'Sense' }, { value: 'shutdown', label: 'Shutdown' }]} />
          <SegmentedControl label="Claim / evidence slice" value={evidence} onChange={setEvidence} options={[{ value: 'rating', label: '85 Arms' }, { value: 'switching', label: 'Switching' }, { value: 'propagation', label: 'Timing' }, { value: 'sense', label: 'Sense' }, { value: 'thermal', label: 'Thermal' }, { value: 'shutdown', label: 'Shutdown' }]} />
          <div className="rounded-md border border-border p-4"><p className="text-[10px] font-black text-muted-foreground">SELECTED PATH</p><p className="mt-2 text-sm font-black">{selectedPath.label}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selectedPath.summary}</p></div>
        </div>
        <div className="min-w-0">
          <div className="rounded-md border border-border bg-muted/[0.06] p-3 sm:p-4">
            <div className="grid gap-2 sm:hidden">
              {selectedPath.nodes.map((node, index) => <div key={node.label} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-md border border-border bg-background p-3"><span className="font-mono text-xs font-black" style={{ color: selectedPath.color }}>{String(index + 1).padStart(2, '0')}</span><span className="min-w-0"><strong className="block text-xs">{node.label}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{node.value}</span></span></div>)}
            </div>
            <svg viewBox="0 0 520 165" className="hidden aspect-[520/165] w-full sm:block" role="img" aria-label={`${selectedPath.label} architecture path`}>
              <line x1="58" y1="78" x2="462" y2="78" stroke={selectedPath.color} strokeWidth="1.5" strokeLinecap="round" />
              {selectedPath.nodes.map((node, index) => <g key={node.label}><rect x={node.x} y={node.y} width="96" height="54" rx="5" className="fill-background" stroke={selectedPath.color} strokeWidth={index === 0 || index === selectedPath.nodes.length - 1 ? 1.4 : 1} /><text x={node.x + 48} y={node.y + 22} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{node.label}</text><text x={node.x + 48} y={node.y + 39} textAnchor="middle" className="fill-muted-foreground text-[8px]">{node.value}</text>{index < selectedPath.nodes.length - 1 && <path d={`M ${node.x + 107} 78 l -7 -4 v 8 z`} fill={selectedPath.color} />}</g>)}
              <text x="260" y="138" textAnchor="middle" className="fill-muted-foreground text-[9px]">선택한 path만 강조한다 · schematic의 모든 net을 한 장에 축소하지 않는다</text>
            </svg>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            <div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">CLAIM</p><p className="mt-2 text-sm font-bold leading-relaxed">{selectedEvidence.claim}</p><p className="mt-3 text-[10px] font-black text-muted-foreground">TEST / DOCUMENT CONDITION</p><p className="mt-2 text-xs leading-relaxed">{selectedEvidence.condition}</p></div>
            <div className="bg-background p-4"><p className="text-[10px] font-black text-muted-foreground">OBSERVED</p><p className="mt-2 text-xs leading-relaxed">{selectedEvidence.observation}</p><div className="mt-3 flex items-center gap-2">{bounded ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}<span className="font-mono text-xs font-black">{selectedEvidence.status}</span></div></div>
            <div className="bg-emerald-500/[0.035] p-4"><p className="text-[10px] font-black text-muted-foreground">SUPPORTS</p><p className="mt-2 text-xs leading-relaxed">{selectedEvidence.supports}</p></div>
            <div className="bg-amber-500/[0.04] p-4"><p className="text-[10px] font-black text-muted-foreground">DOES NOT SUPPORT</p><p className="mt-2 text-xs leading-relaxed">{selectedEvidence.limit}</p></div>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'Design input', value: '24-60 V DC' }, { label: 'Title current', value: '85 Arms CLAIM' }, { label: 'Shown thermal point', value: '26.2 Arms' }, { label: 'Evidence rule', value: 'NO EXTRAPOLATION', accent: true }]} /></div>
    </figure>
  );
}
