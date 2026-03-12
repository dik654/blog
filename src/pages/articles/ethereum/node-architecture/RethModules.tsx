type Mod = { id: string; name: string; border: string; bg: string; title: string; inner: string; items: [string, string][] };

const net: Mod  = { id: 'net',   name: 'Networking',       border: 'border-teal-400',   bg: 'bg-teal-50/50 dark:bg-teal-950/20',   title: 'text-teal-600 dark:text-teal-400',   inner: 'border-teal-300/60 dark:border-teal-600/30',   items: [['devp2p', '세션 관리·피어 스코어링'], ['eth/68', '블록·트랜잭션 교환 프로토콜'], ['discv4 / discv5', '피어 디스커버리']] };
const pool: Mod = { id: 'pool',  name: 'Transaction Pool', border: 'border-amber-400',  bg: 'bg-amber-50/50 dark:bg-amber-950/20',  title: 'text-amber-600 dark:text-amber-400',  inner: 'border-amber-300/60 dark:border-amber-600/30',  items: [['Pending / Queued', 'nonce 순서 기반 서브풀'], ['Basefee / Blob', 'fee·EIP-4844 서브풀'], ['TransactionValidator', '서명·nonce·balance 검증'], ['TransactionsManager', '√n 피어 브로드캐스트'], ['PayloadBuilder', '최적 tx 선별·블록 구성']] };
const exec: Mod = { id: 'exec',  name: 'Execution',        border: 'border-rose-400',   bg: 'bg-rose-50/50 dark:bg-rose-950/20',   title: 'text-rose-600 dark:text-rose-400',   inner: 'border-rose-300/60 dark:border-rose-600/30',   items: [['EngineApiTreeHandler', '중앙 이벤트 루프'], ['PayloadProcessor', 'REVM 트랜잭션 실행'], ['SparseStateTrie', 'rayon 병렬 상태 루트'], ['PersistenceService', 'finalized 블록 비동기 기록']] };
const store: Mod= { id: 'store', name: 'Storage (3-Tier)', border: 'border-orange-400', bg: 'bg-orange-50/50 dark:bg-orange-950/20', title: 'text-orange-600 dark:text-orange-400', inner: 'border-orange-300/60 dark:border-orange-600/30', items: [['CanonicalInMemoryState', '최근 ~64블록 캐시'], ['DatabaseProvider (MDBX)', '가변 상태 저장소'], ['StaticFileProvider', '불변 히스토리 mmap'], ['BlockchainProvider', '3-tier 통합 라우팅']] };

function ModBox({ m, style }: { m: Mod; style?: React.CSSProperties }) {
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

function HArrow({ label, dir, style }: { label: string; dir: '→' | '↔'; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center justify-center px-3 gap-1" style={style}>
      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="relative w-8 h-3 flex items-center">
        <div className="absolute inset-x-0 h-px bg-border" />
        <span className="absolute right-0 text-[10px] leading-none text-muted-foreground">▶</span>
        {dir === '↔' && <span className="absolute left-0 text-[10px] leading-none text-muted-foreground">◀</span>}
      </div>
    </div>
  );
}

function VArrow({ label, dir, style }: { label: string; dir: '↓' | '↕'; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 gap-0.5" style={style}>
      {dir === '↕' && <span className="text-[10px] leading-none text-muted-foreground">▲</span>}
      <div className="w-px flex-1 min-h-[28px] bg-border" />
      <span className="text-[11px] text-muted-foreground px-1 text-center leading-tight">{label}</span>
      <div className="w-px flex-1 min-h-[28px] bg-border" />
      <span className="text-[10px] leading-none text-muted-foreground">▼</span>
    </div>
  );
}

// Diagonal connector for TxPool (top-right) → Execution (bottom-left)
function DiagArrow({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="relative flex items-center justify-center" style={style}>
      <svg viewBox="0 0 64 64" className="w-12 h-12 overflow-visible opacity-40">
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        <line x1="62" y1="2" x2="4" y2="60" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="4,3" markerEnd="url(#arr)" className="text-muted-foreground" />
      </svg>
      <span className="absolute text-[10px] text-muted-foreground/60 whitespace-nowrap rotate-[-43deg] translate-x-1">
        payload
      </span>
    </div>
  );
}

export default function RethModules() {
  // Layout:
  // [Networking]  ↔ tx전파  [Transaction Pool]
  //      ↓ Engine API    ↘ payload   ↕ state조회
  // [Execution]   ↔ 읽기/쓰기 [Storage]
  return (
    <div className="not-prose overflow-x-auto">
      <div
        className="min-w-[520px]"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gridTemplateRows: 'auto auto auto' }}
      >
        <ModBox m={net}  style={{ gridColumn: 1, gridRow: 1 }} />
        <HArrow label="tx 전파" dir="↔" style={{ gridColumn: 2, gridRow: 1 }} />
        <ModBox m={pool} style={{ gridColumn: 3, gridRow: 1 }} />

        <VArrow label="Engine API & 블록 전파" dir="↓" style={{ gridColumn: 1, gridRow: 2 }} />
        <DiagArrow style={{ gridColumn: 2, gridRow: 2 }} />
        <VArrow label="state 조회" dir="↕" style={{ gridColumn: 3, gridRow: 2 }} />

        <ModBox m={exec}  style={{ gridColumn: 1, gridRow: 3 }} />
        <HArrow label="읽기/쓰기" dir="↔" style={{ gridColumn: 2, gridRow: 3 }} />
        <ModBox m={store} style={{ gridColumn: 3, gridRow: 3 }} />
      </div>
    </div>
  );
}
