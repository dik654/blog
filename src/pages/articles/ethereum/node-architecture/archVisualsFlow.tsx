import { motion } from 'framer-motion';

// ── Sync visuals ──────────────────────────────────────────────

export function SyncSlotCompare() {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <div className="rounded-lg border-2 border-foreground/20 bg-card p-2 text-center shrink-0">
        <p className="text-muted-foreground text-[9px]">우리 노드</p>
        <p className="font-mono font-bold text-blue-600 text-sm">45,230</p>
        <p className="text-[9px] text-muted-foreground">slot</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl text-muted-foreground">↔</span>
        <div className="rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-300 px-2 py-0.5">
          <p className="text-[9px] font-mono text-amber-700 dark:text-amber-400">gap: 2,270 slots</p>
        </div>
      </div>
      <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 p-2 text-center shrink-0">
        <p className="text-muted-foreground text-[9px]">피어</p>
        <p className="font-mono font-bold text-emerald-600 text-sm">47,500</p>
        <p className="text-[9px] text-muted-foreground">ahead</p>
      </div>
    </div>
  );
}

export function SyncBatchRequest() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      {[
        { range: '45,231 – 45,250', done: true },
        { range: '45,251 – 45,270', done: true },
        { range: '45,271 – 45,290', done: false },
      ].map(({ range, done }) => (
        <div key={range} className="flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 border text-[9px] shrink-0 ${done
            ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
            : 'border-border bg-muted/40 text-muted-foreground'}`}>
            {range}
          </span>
          {done
            ? <span className="text-emerald-600">← 20 blocks ✓</span>
            : <motion.span className="text-amber-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}>
                requesting...
              </motion.span>
          }
        </div>
      ))}
    </div>
  );
}

export function SyncBlockSubmit() {
  return (
    <div className="flex items-center gap-1 flex-wrap text-[10px]">
      {[45231, 45232, 45233, 45234, 45235].map((slot) => (
        <div key={slot} className="rounded border border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-1.5 py-0.5 font-mono text-[9px]">
          {slot}
        </div>
      ))}
      <motion.span className="text-emerald-600 font-bold mx-1"
        animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}>
        →
      </motion.span>
      <span className="font-semibold">BeaconChain</span>
    </div>
  );
}

export function SyncBackfill() {
  return (
    <div className="space-y-2 text-[10px]">
      <div className="flex items-center gap-1.5">
        <motion.span className="text-amber-500 font-bold text-sm"
          animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
          ◄◄◄
        </motion.span>
        <span className="text-muted-foreground">역방향으로 히스토리 채우기</span>
      </div>
      <div className="flex items-center gap-1">
        {[8997, 8998, 8999, 9000].map((slot) => (
          <div key={slot} className="rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 px-1.5 py-0.5 font-mono text-[9px]">
            {slot}
          </div>
        ))}
        <span className="text-muted-foreground mx-1">···</span>
        <div className="rounded border-2 border-foreground/40 px-2 py-0.5 font-bold text-[9px]">HEAD</div>
      </div>
    </div>
  );
}

// ── Storage visuals ───────────────────────────────────────────

const TIERS = [
  { label: 'CanonicalInMemoryState', sub: 'RAM · ~64 블록 · O(1)', active: 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' },
  { label: 'DatabaseProvider (MDBX)', sub: '디스크 B+Tree', active: 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' },
  { label: 'StaticFileProvider', sub: '불변 mmap 아카이브', active: 'border-purple-400 bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400' },
];

function TierStack({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="space-y-1.5 text-[10px]">
      {TIERS.map((t, i) => (
        <div key={t.label} className={`rounded-lg border-2 p-2 transition-all ${i === activeIdx ? t.active + ' shadow-sm' : 'border-border bg-muted/20 opacity-40'}`}>
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t.label}</span>
            <span className="text-[9px] text-muted-foreground">{t.sub}</span>
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
        <span className="bg-muted/60 rounded px-2 py-0.5">eth_getBlock(1000)</span>
        <span className="text-muted-foreground">→ RPC 요청</span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-muted-foreground shrink-0">탐색 순서:</span>
        {TIERS.map((t, i) => (
          <span key={t.label} className="flex items-center gap-1">
            <span className={`rounded px-1.5 py-0.5 border-2 font-bold ${t.active}`}>{i + 1}</span>
            {i < 2 && <span className="text-muted-foreground">→</span>}
          </span>
        ))}
        <span className="text-muted-foreground ml-1 text-[9px]">(찾으면 즉시 반환)</span>
      </div>
    </div>
  );
}
