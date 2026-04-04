import { TIERS } from './archVisualsFlowData';

function TierStack({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="space-y-1.5 text-[10px]">
      {TIERS.map((t, i) => (
        <div key={t.label} className={`rounded-lg border-2 p-2 transition-all ${i === activeIdx ? t.active + ' shadow-sm' : 'border-border opacity-40'}`}>
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t.label}</span>
            <span className="text-[9px] text-foreground/75">{t.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const StorageTier0 = () => <TierStack activeIdx={0} />;
export const StorageTier1 = () => <TierStack activeIdx={1} />;
export const StorageTier2 = () => <TierStack activeIdx={2} />;

export function StorageQuery() {
  return (
    <div className="space-y-2 text-[10px]">
      <div className="flex items-center gap-2 font-mono">
        <span className="rounded border border-border/50 px-2 py-0.5">eth_getBlock(1000)</span>
        <span className="">→ RPC 요청</span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-foreground/75 shrink-0">탐색 순서:</span>
        {TIERS.map((t, i) => (
          <span key={t.label} className="flex items-center gap-1">
            <span className={`rounded px-1.5 py-0.5 border-2 font-bold ${t.active}`}>{i + 1}</span>
            {i < 2 && <span className="">→</span>}
          </span>
        ))}
        <span className="text-foreground/75 ml-1 text-[9px]">(찾으면 즉시 반환)</span>
      </div>
    </div>
  );
}
