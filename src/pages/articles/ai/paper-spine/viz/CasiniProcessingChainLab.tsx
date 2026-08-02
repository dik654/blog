import { useState } from 'react';
import { ArrowRight, Cpu, TimerReset } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

function RangeControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="font-mono">{value}{unit}</span></span><input className="h-2 w-full accent-violet-600" type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

type Design = 'event' | 'time';

export default function CasiniProcessingChainLab() {
  const [design, setDesign] = useState<Design>('event');
  const [budget, setBudget] = useState(45);
  const [jitter, setJitter] = useState(20);
  const [wholeChain, setWholeChain] = useState(true);

  const work = 30.4;
  const supplyDelay = work * (100 / budget - 1);
  const sampling = design === 'time' ? 80 : 0;
  const burst = design === 'event' ? Math.max(0, jitter - 35) * 0.55 : 0;
  const overcount = wholeChain ? 8 : 52 * (45 / budget);
  const response = work + supplyDelay + sampling + burst + overcount;
  const deadline = 160;
  const margin = deadline - response;
  const converges = wholeChain || budget >= 50;
  const safe = converges && margin >= 0;
  const callbacks = [
    { label: 'pose', cost: '0.2 ms', tone: 'border-blue-500/35 bg-blue-500/[0.04]' },
    { label: 'map update', cost: '2 ms', tone: 'border-teal-500/35 bg-teal-500/[0.04]' },
    { label: 'local plan', cost: '18 ms', tone: 'border-violet-500/35 bg-violet-500/[0.04]' },
    { label: 'velocity', cost: '10 ms', tone: 'border-emerald-500/35 bg-emerald-500/[0.04]' },
  ];

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">PAPER LAB · ECRTS 2019</span>
        <strong className="text-sm">move_base critical chain의 design/budget what-if 분석</strong>
        <span className={`text-xs font-black ${safe ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{converges ? (safe ? 'BOUND WITHIN DEADLINE' : 'BOUND EXCEEDS DEADLINE') : 'BOUND SEARCH DIVERGES'}</span>
      </figcaption>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Activation design" value={design} onChange={setDesign} options={[{ value: 'event', label: 'Event-driven' }, { value: 'time', label: 'Time-driven' }]} />
          <RangeControl label="Local reservation budget" value={budget} min={30} max={100} step={5} unit="%" onChange={setBudget} />
          <RangeControl label="Sensor input jitter" value={jitter} min={0} max={200} step={5} unit=" ms" onChange={setJitter} />
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-600" checked={wholeChain} onChange={(event) => setWholeChain(event.target.checked)} /><span><span className="block text-sm font-semibold">Whole-chain analysis</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">같은 reservation의 연속 callbacks를 subchain으로 묶어 같은 arrival burst를 callback마다 중복 계산하지 않습니다.</span></span></label>
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Cpu className="h-4 w-4" />Local reservation</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {callbacks.map((callback, index) => <div key={callback.label} className="contents"><div className={`min-w-0 rounded-md border p-3 ${callback.tone}`}><p className="text-xs font-bold">{callback.label}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">WCET {callback.cost}</p></div>{index < callbacks.length - 1 && <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:hidden" />}</div>)}
          </div>
          <div className="mt-5 rounded-md bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold"><span className="flex items-center gap-1.5"><TimerReset className="h-4 w-4" />Response-time bound</span><span className="font-mono">{converges ? `${response.toFixed(0)} ms` : 'no finite bound'}</span></div>
            <div className="relative mt-3 h-3 overflow-hidden rounded bg-muted"><span className={`absolute inset-y-0 left-0 rounded ${safe ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${converges ? clamp(response / deadline * 100, 2, 100) : 100}%` }} /><span className="absolute inset-y-0 right-0 border-l-2 border-foreground/60" /></div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">이 lab의 숫자는 논문의 질적 trade-off를 재현하는 교육 모델이며 원 Figure 8 data의 복사본이 아닙니다. 논문 결과는 time-driven의 sampling delay, event-driven의 jitter burst, reservation budget과 whole-chain pessimism의 상호작용을 보여줍니다.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Callback work', value: `${work.toFixed(1)} ms` },
        { label: 'Supply delay', value: `${supplyDelay.toFixed(0)} ms` },
        { label: design === 'time' ? 'Sampling delay' : 'Burst interference', value: `${(sampling + burst).toFixed(0)} ms` },
        { label: '160 ms margin', value: converges ? `${margin.toFixed(0)} ms` : 'unbounded' },
      ]} /></div>
    </figure>
  );
}
