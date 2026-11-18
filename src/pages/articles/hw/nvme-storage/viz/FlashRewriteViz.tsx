import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입 경로 절 — "Flash는 덮어쓰지 못하므로 새 위치에 쓰고, 나중에 살아 있는 data를
 * 옮긴 뒤 큰 block을 지웁니다." 묶음당 4칸, 고치는 칸 A·B는 설명용 가정입니다.
 * 사용자 쓰기 4 → 6, flash 쓰기 4 → 6 → 8 (C·D 복사 2칸).
 */
type Cell = { name: string; state: "live" | "stale" | "empty" };

const L = (name: string): Cell => ({ name, state: "live" });
const S = (name: string): Cell => ({ name, state: "stale" });
const E: Cell = { name: "", state: "empty" };

type Scene = { label: string; summary: string; note: string; blocks: readonly (readonly Cell[])[]; map: readonly string[]; user: number; media: number };

const SCENES: readonly Scene[] = [
  {
    label: "빈 칸에 처음 씁니다",
    summary: "사용자 4칸 · flash 4칸",
    note: "A·B·C·D 네 조각을 묶음 1의 빈 칸에 씁니다. 주소표는 각 조각이 지금 어느 칸에 있는지 기억합니다.",
    blocks: [[L("A"), L("B"), L("C"), L("D")], [E, E, E, E]],
    map: ["1-1", "1-2", "1-3", "1-4"],
    user: 4,
    media: 4,
  },
  {
    label: "A·B를 고쳐 씁니다",
    summary: "사용자 6칸 · flash 6칸",
    note: "이미 쓴 칸은 덮어쓸 수 없어서 새 내용 A·B를 묶음 2의 빈 칸에 쓰고 주소표만 바꿉니다. 묶음 1의 옛 A·B는 낡은 칸으로 남아 자리를 차지합니다.",
    blocks: [[S("A"), S("B"), L("C"), L("D")], [L("A"), L("B"), E, E]],
    map: ["2-1", "2-2", "1-3", "1-4"],
    user: 6,
    media: 6,
  },
  {
    label: "살아 있는 C·D를 옮깁니다",
    summary: "사용자 6칸 · flash 8칸",
    note: "묶음 1을 비우려면 아직 쓰이는 C·D를 다른 칸으로 옮겨야 합니다. 사용자는 아무것도 쓰지 않았는데 flash는 두 칸을 더 씁니다.",
    blocks: [[S("A"), S("B"), S("C"), S("D")], [L("A"), L("B"), L("C"), L("D")]],
    map: ["2-1", "2-2", "2-3", "2-4"],
    user: 6,
    media: 8,
  },
  {
    label: "묶음 1을 통째로 지웁니다",
    summary: "사용자 6칸 < flash 8칸",
    note: "지우기는 칸 하나가 아니라 묶음 단위로만 됩니다. 이제 묶음 1이 다시 빈 칸이 됩니다. 사용자가 쓴 양보다 flash가 움직인 양이 많고, 이 정리가 지속 쓰기 중에 끼어들면 속도가 떨어지고 꼬리 지연이 길어질 수 있습니다.",
    blocks: [[E, E, E, E], [L("A"), L("B"), L("C"), L("D")]],
    map: ["2-1", "2-2", "2-3", "2-4"],
    user: 6,
    media: 8,
  },
];

const W = 360;
const H = 118;
const CELL = 34;
const GAP = 4;
const BLOCK_X: readonly number[] = [16, 196];
const ROW_Y = 34;

const FILL: Record<Cell["state"], string> = { live: "#2563eb", stale: "#e5e7eb", empty: "#ffffff" };
const STROKE: Record<Cell["state"], string> = { live: "#1d4ed8", stale: "#9ca3af", empty: "#cbd5e1" };

function Counter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex min-w-0 gap-1">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="h-3 flex-1 rounded-sm border" style={{ backgroundColor: i < value ? color : "transparent", borderColor: i < value ? color : "#cbd5e1" }} />
        ))}
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

export default function FlashRewriteViz() {
  return (
    <SceneShell
      eyebrow="덮어쓰기가 안 되는 저장"
      title="고친 조각은 새 칸에 쓰고, 나중에 남은 조각을 옮긴 뒤 묶음째 지웁니다"
      description="칸 하나는 한 번에 쓰는 가장 작은 단위, 묶음은 한 번에 지울 수 있는 단위입니다. 묶음당 4칸과 고치는 조각 A·B는 설명용 가정입니다(가정). 파란 칸은 지금 쓰이는 조각, 회색 칸은 낡아서 버릴 조각입니다."
      ariaLabel="덮어쓰지 못하는 flash에서 고쳐 쓰기, 남은 조각 복사, 묶음 지우기가 사용자 쓰기보다 많은 flash 쓰기를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.blocks.map((cells, b) => (
                <g key={b}>
                  <text x={BLOCK_X[b]} y={ROW_Y - 10} fontSize={11} fontWeight={700} fill="#475569">{`묶음 ${b + 1}`}</text>
                  <rect x={BLOCK_X[b] - 4} y={ROW_Y - 4} width={4 * CELL + 3 * GAP + 8} height={CELL + 8} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {cells.map((cell, i) => {
                    const x = BLOCK_X[b] + i * (CELL + GAP);
                    return (
                      <g key={i}>
                        <rect x={x} y={ROW_Y} width={CELL} height={CELL} rx={4} fill={FILL[cell.state]} stroke={STROKE[cell.state]} strokeWidth={1} />
                        {cell.name && (
                          <text x={x + CELL / 2} y={ROW_Y + CELL / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={cell.state === "live" ? "#ffffff" : "#6b7280"} textDecoration={cell.state === "stale" ? "line-through" : undefined}>
                            {cell.name}
                          </text>
                        )}
                        <text x={x + CELL / 2} y={ROW_Y + CELL + 18} textAnchor="middle" fontSize={9} fill="#94a3b8">{`${b + 1}-${i + 1}`}</text>
                      </g>
                    );
                  })}
                </g>
              ))}
              {active === 3 && (
                <text x={BLOCK_X[0] + 4 * CELL + 3 * GAP} y={ROW_Y - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">통째로 지움</text>
              )}
            </svg>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              {["A", "B", "C", "D"].map((name, i) => (
                <div key={name} className="rounded-md border border-border bg-background px-1 py-1.5">
                  <span className="font-bold">{name}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="font-mono">{scene.map[i]}</span>
                </div>
              ))}
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">주소표: 조각 이름 → 지금 있는 칸</p>
            <div className="mt-4 space-y-2">
              <Counter label="사용자가 쓴 칸" value={scene.user} color="#64748b" />
              <Counter label="flash가 쓴 칸" value={scene.media} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
