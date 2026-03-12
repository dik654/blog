type Mod = { name: string; border: string; bg: string; title: string; inner: string; items: [string, string][] };

const vc: Mod = {
  name: 'Validator Client', border: 'border-violet-400', bg: 'bg-violet-50/50 dark:bg-violet-950/20',
  title: 'text-violet-600 dark:text-violet-400', inner: 'border-violet-300/60 dark:border-violet-600/30',
  items: [
    ['별도 바이너리', 'BN과 REST API 통신'],
    ['ValidatorStore', 'EIP-2335 키스토어'],
    ['BeaconNodeFallback', '다중 노드 failover'],
    ['DoppelgangerService', '중복 인스턴스 탐지'],
  ],
};

const beacon: Mod = {
  name: 'BeaconChain', border: 'border-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20',
  title: 'text-blue-600 dark:text-blue-400', inner: 'border-blue-300/60 dark:border-blue-600/30',
  items: [
    ['상태 머신', '블록 검증, 상태 전이'],
    ['Fork Choice', 'LMD-GHOST + Casper FFG'],
    ['OperationPool', '어테스테이션·exits 수집'],
    ['Slasher', '이중 서명 탐지·증거 생성'],
  ],
};

const store: Mod = {
  name: 'Storage (HotColdDB)', border: 'border-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
  title: 'text-indigo-600 dark:text-indigo-400', inner: 'border-indigo-300/60 dark:border-indigo-600/30',
  items: [
    ['Hot DB (LevelDB/Redb)', '최근 상태'],
    ['Cold DB (Freezer)', '히스토리 아카이브'],
    ['Blobs DB', 'EIP-4844 블롭·데이터 컬럼'],
  ],
};

const net: Mod = {
  name: 'Networking (libp2p)', border: 'border-cyan-400', bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
  title: 'text-cyan-600 dark:text-cyan-400', inner: 'border-cyan-300/60 dark:border-cyan-600/30',
  items: [
    ['Gossipsub', '블록·어테스테이션 전파'],
    ['Request/Response', '동기화 블록 룩업'],
    ['Discv5', 'ENR 기반 피어 디스커버리'],
    ['SyncManager', 'Range/Backfill/Lookup'],
  ],
};

function Box({ m, style }: { m: Mod; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border-2 p-3 ${m.border} ${m.bg}`} style={style}>
      <p className={`text-xs font-bold mb-2 ${m.title}`}>{m.name}</p>
      <div className="flex flex-col gap-1">
        {m.items.map(([name, desc]) => (
          <div key={name} className={`rounded border ${m.inner} bg-background/70 dark:bg-background/20 px-2 py-1.5`}>
            <p className="text-[11px] font-medium text-foreground/80 leading-tight">{name}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HArr({ label, dir, style }: { label: string; dir: string; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center justify-start pt-5 px-1 shrink-0 gap-0.5" style={style}>
      <span className="text-[11px] text-muted-foreground whitespace-nowrap leading-none">{label}</span>
      <div className="relative w-8 h-3.5 flex items-center mt-0.5">
        <div className="absolute inset-x-0 h-px bg-border" />
        <span className="absolute right-0 text-[10px] leading-none text-muted-foreground">▶</span>
        {dir === '↔' && <span className="absolute left-0 text-[10px] leading-none text-muted-foreground">◀</span>}
      </div>
    </div>
  );
}

function VConn({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center py-1 gap-0.5" style={style}>
      <span className="text-[10px] text-muted-foreground">▲</span>
      <div className="w-px flex-1 min-h-[16px] bg-border" />
      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="w-px flex-1 min-h-[16px] bg-border" />
      <span className="text-[10px] text-muted-foreground">▼</span>
    </div>
  );
}

export default function LighthouseModules() {
  // Layout: [VC] → [BeaconChain] ↔ [HotColdDB]
  //                     ↕ tokio ch
  //               [Networking]
  return (
    <div className="not-prose overflow-x-auto">
      <div className="min-w-[580px]" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr' }}>
        <Box m={vc}     style={{ gridColumn: 1, gridRow: 1 }} />
        <HArr label="Beacon API" dir="↔" style={{ gridColumn: 2, gridRow: 1 }} />
        <Box m={beacon} style={{ gridColumn: 3, gridRow: 1 }} />
        <HArr label="직접 호출" dir="↔" style={{ gridColumn: 4, gridRow: 1 }} />
        <Box m={store}  style={{ gridColumn: 5, gridRow: 1 }} />
        <VConn label="tokio ch" style={{ gridColumn: 3, gridRow: 2 }} />
        <Box m={net}    style={{ gridColumn: 3, gridRow: 3 }} />
      </div>
    </div>
  );
}
