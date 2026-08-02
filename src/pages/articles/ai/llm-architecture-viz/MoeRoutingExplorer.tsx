import { useMemo, useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type Pattern = 'balanced' | 'collapsed';
type Policy = 'capacity' | 'no-drop';
type CapacityFactor = '1' | '1.25' | '1.5';

const tokens = Array.from({ length: 16 }, (_, index) => `t${index + 1}`);
const expertTones = [
  'bg-violet-600 text-white',
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-neutral-800 text-white',
];

function formatMiB(bytes: number) {
  return `${(bytes / 1024 ** 2).toFixed(0)} MiB`;
}

export default function MoeRoutingExplorer() {
  const [pattern, setPattern] = useState<Pattern>('collapsed');
  const [policy, setPolicy] = useState<Policy>('capacity');
  const [factor, setFactor] = useState<CapacityFactor>('1');

  const result = useMemo(() => {
    const routes = tokens.map((_, index) => pattern === 'balanced'
      ? [index % 4, (index + 1) % 4]
      : [0, index < 10 ? 1 : index < 14 ? 2 : 3]);
    const loads = [0, 1, 2, 3].map((expert) => routes.reduce((sum, route) => sum + (route.includes(expert) ? 1 : 0), 0));
    const assignments = tokens.length * 2;
    const ideal = assignments / 4;
    const capacity = Math.ceil(ideal * Number(factor));
    const overflow = policy === 'capacity' ? loads.reduce((sum, load) => sum + Math.max(0, load - capacity), 0) : 0;
    const admitted = assignments - overflow;
    const dropRate = 100 * overflow / assignments;
    const straggler = Math.max(...loads) / ideal;
    const deepSeekPayload = 2 * 4096 * 8 * 7168 * 2;
    return { routes, loads, assignments, ideal, capacity, overflow, admitted, dropRate, straggler, deepSeekPayload };
  }, [factor, pattern, policy]);

  return (
    <div data-moe-routing-lab className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background">
      <header className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="text-xs font-bold text-muted-foreground">ROUTING / CAPACITY / DISPATCH LAB</p>
        <h3 className="mt-2 text-lg font-bold">같은 Top-2라도 drop과 latency는 정책에 따라 달라진다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">16개 token의 32개 assignment를 4개 expert에 보낸다. Training capacity는 넘친 assignment를 제한하고, no-drop serving은 모두 처리하는 대신 가장 바쁜 expert를 기다린다.</p>
      </header>

      <div className="grid gap-5 border-b border-border p-4 sm:p-6 lg:grid-cols-[auto_auto_minmax(12rem,1fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Router load</p>
          <div className="mt-2"><SegmentedControl label="Router load pattern" options={[{ value: 'balanced', label: '균형' }, { value: 'collapsed', label: '쏠림' }]} value={pattern} onChange={setPattern} /></div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">실행 정책</p>
          <div className="mt-2"><SegmentedControl label="Routing capacity policy" options={[{ value: 'capacity', label: 'Capacity 제한' }, { value: 'no-drop', label: 'No-drop' }]} value={policy} onChange={setPolicy} /></div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Capacity factor</p>
          <div className="mt-2"><SegmentedControl label="Expert capacity factor" options={[{ value: '1', label: '1.00' }, { value: '1.25', label: '1.25' }, { value: '1.5', label: '1.50' }]} value={factor} onChange={setFactor} /></div>
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-muted-foreground">
            {expertTones.map((tone, index) => <span key={tone} className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 ${tone.split(' ')[0]}`} />Expert {index + 1}</span>)}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Token to expert assignments">
            {tokens.map((token, index) => (
              <div key={token} className="min-w-0 border border-border p-2">
                <span className="block font-mono text-[10px] font-bold text-muted-foreground">{token}</span>
                <span className="mt-2 flex gap-1">
                  {result.routes[index].map((expert) => <span key={expert} className={`flex h-6 min-w-0 flex-1 items-center justify-center text-[10px] font-black ${expertTones[expert]}`}>E{expert + 1}</span>)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {result.loads.map((load, index) => {
              const admitted = policy === 'capacity' ? Math.min(load, result.capacity) : load;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold">Expert {index + 1}</span><span className="font-mono">{admitted} 처리{load > admitted ? ` · ${load - admitted} overflow` : ''}</span></div>
                  <div className="mt-1.5 flex h-2.5 overflow-hidden border border-border bg-muted">
                    <span className={`block h-full ${expertTones[index].split(' ')[0]}`} style={{ width: `${Math.min(100, (admitted / 16) * 100)}%` }} />
                    {load > admitted && <span className="block h-full bg-rose-500/70" style={{ width: `${((load - admitted) / 16) * 100}%` }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="min-w-0 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-px border border-border bg-border">
            <Metric label="Expert capacity" value={`${result.capacity}`} detail={`ceil(${result.assignments} / 4 × ${Number(factor).toFixed(2)})`} dataName="data-expert-capacity" />
            <Metric label="처리 assignment" value={`${result.admitted} / ${result.assignments}`} detail={policy === 'capacity' ? 'capacity 안에 들어온 선택만' : '모든 expert 선택을 보존'} dataName="data-admitted-assignments" />
            <Metric label="Overflow / drop" value={`${result.overflow} · ${result.dropRate.toFixed(2)}%`} detail={policy === 'capacity' ? 'residual로 우회하거나 구현 정책 적용' : 'drop 없이 straggler를 감수'} dataName="data-routing-overflow" />
            <Metric label="Max / ideal load" value={`${result.straggler.toFixed(2)}x`} detail="no-drop step의 straggler 하한" dataName="data-routing-straggler" />
          </div>

          <div className="mt-5 border-l-2 border-blue-600/40 bg-blue-500/[0.04] px-4 py-3">
            <p className="text-xs font-bold">Expert parallel network ledger</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">DeepSeek-V3형 한 batch에서 <strong className="text-foreground">T=4,096, k=8, d=7,168, bf16</strong> hidden을 다른 expert GPU로 보내고 결과를 되돌리면 payload 하한은 다음과 같다.</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 border-t border-border pt-3">
              <span className="font-mono text-[11px] text-muted-foreground">2 × T × k × d × b</span>
              <strong data-dispatch-roundtrip={formatMiB(result.deepSeekPayload)} className="font-mono text-xl">{formatMiB(result.deepSeekPayload)} / MoE layer</strong>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 값은 activation payload만 센 하한이다. Router metadata, padding, collective protocol, 중복 expert, topology와 overlap 효율은 포함하지 않는다.</p>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, dataName }: { label: string; value: string; detail: string; dataName: string }) {
  return (
    <div className="min-w-0 bg-background p-4" {...{ [dataName]: value }}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-lg font-black leading-none">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
