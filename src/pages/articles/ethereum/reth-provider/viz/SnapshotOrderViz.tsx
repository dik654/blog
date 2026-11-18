import SceneShell from "./SceneShell";

/**
 * 본문 대응: #snapshot — memory head를 먼저 잡고 DB snapshot을 나중에 연다.
 * 출발: DB는 995까지, memory에 996~1,000. 그 사이 flush로 996~998이 DB로 옮겨지고 memory에서 지워진다(가정).
 * DB 먼저: 쥔 것 = …995 + 999~1,000 → 996~998 빈칸. Memory 먼저: 쥔 것 = 996~1,000 + …998 → 빈칸 없음.
 */
type Cell = "db" | "mem" | "both" | "gap" | "none";

interface Scene {
  label: string;
  summary: string;
  note: string;
  dbTip: number;
  memFrom: number;
  held: readonly Cell[];
}

const COLS = [995, 996, 997, 998, 999, 1000] as const;
const N: Cell = "none";

const SCENES: readonly Scene[] = [
  {
    label: "출발 상태",
    summary: "DB …995 · memory 996~1,000",
    note: "영속 저장은 995까지 끝났고 996~1,000은 아직 memory에만 있습니다. 조회는 두 곳을 합쳐야 1,000까지 읽을 수 있습니다.",
    dbTip: 995,
    memFrom: 996,
    held: [N, N, N, N, N, N],
  },
  {
    label: "뒤집은 순서 ① DB 먼저",
    summary: "DB snapshot = …995",
    note: "DB read snapshot을 먼저 열면 그 순간의 DB, 즉 995까지가 고정됩니다. Memory는 아직 잡지 않았습니다.",
    dbTip: 995,
    memFrom: 996,
    held: ["db", N, N, N, N, N],
  },
  {
    label: "뒤집은 순서 ② 그 사이 flush",
    summary: "996~998 → DB, memory에서 삭제",
    note: "그 사이 memory block 일부가 DB로 flush되고 memory에서 지워집니다. 열어 둔 DB snapshot은 여전히 995까지만 봅니다. 996~998이라는 범위는 설명용 가정입니다.",
    dbTip: 998,
    memFrom: 999,
    held: ["db", N, N, N, N, N],
  },
  {
    label: "뒤집은 순서 ③ memory 나중",
    summary: "996~998 어느 쪽에도 없음",
    note: "이제 memory를 잡으면 999~1,000만 남아 있습니다. 쥔 두 snapshot을 합쳐도 996~998이 빠져, 어느 쪽에도 없는 구간이 생깁니다.",
    dbTip: 998,
    memFrom: 999,
    held: ["db", "gap", "gap", "gap", "mem", "mem"],
  },
  {
    label: "올바른 순서 ① memory 먼저",
    summary: "memory 996~1,000 고정",
    note: "같은 출발 상태에서 이번에는 memory head를 먼저 capture합니다. 아직 flush되지 않은 996~1,000이 고정됩니다.",
    dbTip: 995,
    memFrom: 996,
    held: [N, "mem", "mem", "mem", "mem", "mem"],
  },
  {
    label: "올바른 순서 ② flush 뒤 DB",
    summary: "빠진 구간 없음",
    note: "그 뒤 같은 flush가 일어나도 DB snapshot은 그 이후에 열리므로 998까지 봅니다. 996~998은 양쪽에 겹쳐 있을 뿐, 빠진 구간은 없습니다.",
    dbTip: 998,
    memFrom: 999,
    held: ["db", "both", "both", "both", "mem", "mem"],
  },
];

const BLUE = "#2563eb";
const SLATE = "#475569";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const LABEL_W = 78;
const CELL_W = 44;
const CELL_H = 26;
const ROWS = [
  { key: "db", label: "DB", y: 22 },
  { key: "mem", label: "Memory", y: 58 },
  { key: "held", label: "조회가 쥔 것", y: 110 },
] as const;
const cx = (index: number) => LABEL_W + index * CELL_W;

function heldStyle(cell: Cell) {
  if (cell === "db") return { fill: "#e2e8f0", stroke: SLATE, text: "DB", color: SLATE };
  if (cell === "mem") return { fill: "#dbeafe", stroke: BLUE, text: "MEM", color: BLUE };
  if (cell === "both") return { fill: "#dbeafe", stroke: BLUE, text: "겹침", color: BLUE };
  if (cell === "gap") return { fill: "#fee2e2", stroke: RED, text: "빈칸", color: RED };
  return { fill: "#ffffff", stroke: MUTED, text: "", color: TEXT };
}

export default function SnapshotOrderViz() {
  return (
    <SceneShell
      eyebrow="Snapshot 순서"
      title="DB를 먼저 열면 flush 사이에 빈 구간이 생깁니다"
      description="칸 하나가 블록 하나입니다. 위 두 줄(DB·Memory)은 그 장면에서 각 저장소에 있는 블록, 맨 아래 줄은 조회가 붙잡아 둔 범위입니다. 995·996~1,000은 본문 예시, flush된 996~998은 설명용 가정입니다."
      ariaLabel="DB snapshot을 먼저 열면 996부터 998까지 빈 구간이 생기고, memory를 먼저 잡으면 빈 구간이 없는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {COLS.map((block, index) => (
              <text key={block} x={cx(index) + CELL_W / 2} y={12} textAnchor="middle" fontSize={10.5} fill={TEXT}>{index === 0 ? "…995" : block.toLocaleString("en-US")}</text>
            ))}
            {ROWS.map((row) => (
              <text key={row.key} x={0} y={row.y + CELL_H / 2 + 4} fontSize={10.5} fontWeight={row.key === "held" ? 700 : 400} fill={row.key === "held" ? "#0f172a" : TEXT}>{row.label}</text>
            ))}
            <line x1={0} x2={360} y1={96} y2={96} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
            {COLS.map((block, index) => {
              const inDb = block <= scene.dbTip;
              const inMem = block >= scene.memFrom;
              const held = heldStyle(scene.held[index]);
              return (
                <g key={block}>
                  <rect x={cx(index) + 2} y={22} width={CELL_W - 4} height={CELL_H} rx={3} fill={inDb ? "#e2e8f0" : "#ffffff"} stroke={inDb ? SLATE : MUTED} strokeWidth={1} strokeDasharray={inDb ? undefined : "2 2"} />
                  <rect x={cx(index) + 2} y={58} width={CELL_W - 4} height={CELL_H} rx={3} fill={inMem ? "#dbeafe" : "#ffffff"} stroke={inMem ? BLUE : MUTED} strokeWidth={1} strokeDasharray={inMem ? undefined : "2 2"} />
                  <rect x={cx(index) + 2} y={110} width={CELL_W - 4} height={CELL_H} rx={3} fill={held.fill} stroke={held.stroke} strokeWidth={scene.held[index] === "gap" ? 1.25 : 1} strokeDasharray={scene.held[index] === "none" ? "2 2" : undefined} />
                  {held.text && <text x={cx(index) + CELL_W / 2} y={110 + CELL_H / 2 + 3.5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={held.color}>{held.text}</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
