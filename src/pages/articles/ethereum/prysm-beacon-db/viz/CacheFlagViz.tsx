import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-boundary — SaveROBlocks의 db.Update callback은 entry마다 Put·index 갱신 뒤 updated=true를 둔다.
 * 뒤 entry에서 오류가 나면 bbolt write transaction은 rollback되지만 앞 entry의 flag는 남을 수 있고,
 * v7.3.1 코드는 err를 확인하기 전에 cache loop에 들어간다. 오류 위치(B)는 설명용 가정이다.
 */
type Cell = { text: string; tone: "none" | "pending" | "on" | "warn" | "error" };

interface Row {
  updated: Cell;
  tx: Cell;
  db: Cell;
  cache: Cell;
}

interface CacheScene {
  label: string;
  summary: string;
  note: string;
  rows: readonly Row[];
}

const NONE = (text: string): Cell => ({ text, tone: "none" });
const PENDING = (text: string): Cell => ({ text, tone: "pending" });
const ON = (text: string): Cell => ({ text, tone: "on" });
const WARN = (text: string): Cell => ({ text, tone: "warn" });
const ERROR = (text: string): Cell => ({ text, tone: "error" });

const SCENES = [
  {
    label: "Batch 준비",
    summary: "A·B 모두 updated = false",
    note: "prepareBlockBatch가 A와 B의 root·index·encoded bytes를 transaction 밖에서 준비했습니다. 아직 DB와 cache에는 아무것도 없고 두 entry의 updated 표시는 false입니다.",
    rows: [
      { updated: NONE("false"), tx: NONE("—"), db: NONE("없음"), cache: NONE("없음") },
      { updated: NONE("false"), tx: NONE("—"), db: NONE("없음"), cache: NONE("없음") },
    ],
  },
  {
    label: "A 쓰기 성공",
    summary: "A: Put + index → updated = true",
    note: "db.Update callback 안에서 A의 Put과 slot·parent index 갱신이 끝나면 A의 updated가 true가 됩니다. A의 쓰기는 아직 commit 전입니다.",
    rows: [
      { updated: ON("true"), tx: PENDING("commit 전"), db: NONE("없음"), cache: NONE("없음") },
      { updated: NONE("false"), tx: NONE("—"), db: NONE("없음"), cache: NONE("없음") },
    ],
  },
  {
    label: "B에서 오류 (가정)",
    summary: "callback이 error 반환",
    note: "뒤쪽 entry B를 처리하다 오류가 났다고 가정합니다. callback은 error를 반환하고 B의 updated는 false로 남습니다.",
    rows: [
      { updated: ON("true"), tx: PENDING("commit 전"), db: NONE("없음"), cache: NONE("없음") },
      { updated: NONE("false"), tx: ERROR("오류"), db: NONE("없음"), cache: NONE("없음") },
    ],
  },
  {
    label: "Rollback",
    summary: "DB에는 A·B 없음 · A 표시는 true",
    note: "bbolt는 write transaction을 commit하지 않으므로 A의 쓰기도 DB에 남지 않습니다. 그러나 A의 updated 표시는 DB 쓰기가 아니라서 true로 남을 수 있습니다.",
    rows: [
      { updated: WARN("true 남음"), tx: NONE("버려짐"), db: NONE("없음"), cache: NONE("없음") },
      { updated: NONE("false"), tx: NONE("버려짐"), db: NONE("없음"), cache: NONE("없음") },
    ],
  },
  {
    label: "Cache loop",
    summary: "err 확인 전 → A가 cache에 들어갈 수 있음",
    note: "v7.3.1 코드는 err가 nil인지 확인하기 전에 updated가 true인 entry를 block cache에 넣습니다. 그러면 DB에 없는 A가 cache에만 있을 수 있습니다. 실제로 cache-only read가 일어나는지는 별도 fault-injection test가 필요합니다.",
    rows: [
      { updated: WARN("true 남음"), tx: NONE("버려짐"), db: NONE("없음"), cache: WARN("A 들어갈 수 있음") },
      { updated: NONE("false"), tx: NONE("버려짐"), db: NONE("없음"), cache: NONE("없음") },
    ],
  },
] as const satisfies readonly CacheScene[];

const COLUMNS = ["updated 표시", "transaction 안 쓰기", "DB (commit된 것)", "block cache"] as const;
const KEYS = ["updated", "tx", "db", "cache"] as const;

const TONE: Record<Cell["tone"], string> = {
  none: "border-border text-muted-foreground",
  pending: "border-dashed border-primary text-primary",
  on: "border-primary bg-primary/5 font-bold text-primary",
  warn: "border-amber-600 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-300",
  error: "border-red-600 bg-red-500/10 font-bold text-red-700 dark:text-red-300",
};

export default function CacheFlagViz() {
  return (
    <SceneShell
      eyebrow="Rollback과 cache 사이"
      title="Rollback 뒤에도 updated 표시는 남을 수 있습니다"
      description="한 줄이 batch의 block 하나입니다. Block A·B와 B에서 나는 오류 위치는 설명용 가정입니다."
      ariaLabel="SaveROBlocks에서 뒤 entry 오류로 rollback된 뒤 앞 entry의 updated 표시가 남아 cache loop로 들어갈 수 있는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly CacheScene[])[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.25rem_repeat(4,minmax(0,1fr))] gap-1.5 text-center">
              <span />
              {COLUMNS.map((column) => (
                <span key={column} className="break-keep text-[10px] font-bold leading-4 text-muted-foreground">{column}</span>
              ))}
              {scene.rows.map((row, index) => (
                <div key={index} className="contents">
                  <span className="flex items-center justify-center font-mono text-xs font-bold">{index === 0 ? "A" : "B"}</span>
                  {KEYS.map((key) => {
                    const cell = row[key];
                    return (
                      <span key={key} className={`flex min-h-[2.75rem] items-center justify-center break-keep rounded-md border px-1 py-1 text-[11px] leading-4 ${TONE[cell.tone]}`}>
                        {cell.text}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              점선 칸은 아직 commit되지 않은 쓰기, 빨간 칸은 오류가 난 곳, 주황 칸은 DB와 어긋날 수 있는 값입니다.
            </p>
          </div>
        );
      }}
    />
  );
}
