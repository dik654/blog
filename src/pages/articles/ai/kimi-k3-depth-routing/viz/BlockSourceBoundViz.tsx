import SceneShell from "./SceneShell";

/**
 * 본문 대응: #block-bound — 93 main layer를 최대 12층 block으로 묶으면 ⌈93/12⌉=8 block,
 * embedding을 더해 장기 source 9개(약 9d). Full은 약 93d.
 * 한 줄 = block 하나. 앞 block부터 12층씩 채우면 12×7=84, 마지막 block은 93−84=9층(가정).
 */
const LAYERS = 93;
const PER_BLOCK = 12;
const BLOCKS = Math.ceil(LAYERS / PER_BLOCK);
const LOST_BLOCK = 2;

const ROWS = Array.from({ length: BLOCKS }, (_, row) => {
  const first = row * PER_BLOCK + 1;
  const last = Math.min(first + PER_BLOCK - 1, LAYERS);
  return { row, first, last, count: last - first + 1 };
});

const SCENES = [
  {
    label: "Full: 층마다 source",
    summary: "embedding + 93층 · 약 93d",
    note: "Full AttnRes는 embedding과 앞선 모든 layer를 source로 둘 수 있습니다. 칸 하나가 main layer 하나입니다. 각 source가 hidden width d짜리 representation이므로 source state는 약 93d로 layer 수에 비례해 늘어납니다.",
  },
  {
    label: "최대 12층씩 묶기",
    summary: "⌈93 ÷ 12⌉ = ⌈7.75⌉ = 8 block",
    note: "한 줄이 block 하나입니다. 12층씩 일곱 줄을 채우면 84층이고, 남은 9층도 source가 필요하므로 여덟 번째 block이 됩니다. 그래서 내림 7이 아니라 올림 8입니다.",
  },
  {
    label: "장기 source 9개",
    summary: "8 block + embedding = 9 · 약 9d",
    note: "오래 보관하는 것은 오른쪽 점으로 표시한 block output 8개와 embedding 1개입니다. 장기 source state는 layer 수 93 대신 block 수 8에 embedding 하나를 더한 9에 비례합니다.",
  },
  {
    label: "그 대신 잃는 것",
    summary: "block 안 층은 따로 못 고름",
    note: "예를 들어 block 3 안의 층 25–36은 하나씩 골라 읽을 수 없고 block output 하나로만 읽힙니다. 93d 대 9d는 depth-source storage의 비교이며, parameter·KV cache·MoE state까지 같은 비율로 줄었다는 뜻은 아닙니다.",
  },
] as const;

const LABEL_W = 70;
const CELL = 22;
const CELL_GAP = 1;
const ROW_H = 17;
const TOP = 36;
const cx = (col: number) => LABEL_W + col * (CELL + CELL_GAP);
const ry = (row: number) => TOP + row * (ROW_H + 3);
const DOT_X = cx(PER_BLOCK) + 9;

export default function BlockSourceBoundViz() {
  return (
    <SceneShell
      eyebrow="93층을 8개 block으로"
      title="Block으로 묶으면 오래 들고 있을 source가 9개로 줄어듭니다"
      description="칸 하나가 main layer 하나, 한 줄이 최대 12층짜리 block 하나입니다. Source는 현재 layer가 골라 읽을 수 있는 이전 depth representation이고, d는 그 representation의 hidden width입니다. 앞 block부터 12층씩 채운다고 가정했습니다(가정)."
      ariaLabel="93개 layer를 12층씩 8개 block으로 묶어 embedding을 포함한 장기 source를 9개로 줄이는 과정"
      scenes={SCENES}
      render={(active) => {
        const grouped = active >= 1;
        const collapsed = active >= 2;
        const height = ry(BLOCKS) + 6;
        return (
          <svg viewBox={`0 0 ${DOT_X + 12} ${height}`} role="img" aria-label={SCENES[active].label} className="block h-auto w-full">
            <rect x={LABEL_W} y={6} width={92} height={20} rx={3} fill="#7c3aed" fillOpacity={active === 3 ? 0.12 : 0.28} stroke="#7c3aed" strokeWidth="1" />
            <text x={LABEL_W + 46} y={20} textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              embedding
            </text>
            <circle cx={DOT_X} cy={16} r={5} fill="#7c3aed" opacity={collapsed ? 1 : 0} />
            {ROWS.map(({ row, first, last, count }) => {
              const y = ry(row);
              const lost = active === 3 && row === LOST_BLOCK;
              return (
                <g key={row}>
                  <text x={0} y={y + 12} className={`text-[10px] ${lost ? "fill-foreground font-bold" : "fill-muted-foreground"}`}>
                    {grouped ? `block ${row + 1} · ${count}층` : `층 ${first}–${last}`}
                  </text>
                  {Array.from({ length: count }, (_, col) => (
                    <rect
                      key={col}
                      x={cx(col)}
                      y={y}
                      width={CELL}
                      height={ROW_H}
                      rx={2}
                      fill={lost ? "#94a3b8" : "#7c3aed"}
                      fillOpacity={collapsed ? (lost ? 0.35 : 0.1) : grouped ? (row % 2 === 0 ? 0.42 : 0.24) : 0.42}
                      stroke={lost ? "#64748b" : "#7c3aed"}
                      strokeWidth="1"
                      strokeOpacity={collapsed ? 0.35 : 0.8}
                      strokeDasharray={lost ? "2 2" : undefined}
                    />
                  ))}
                  {grouped ? (
                    <rect x={cx(0) - 2} y={y - 1.5} width={cx(count) - cx(0) + 3} height={ROW_H + 3} rx={3} fill="none" stroke="#7c3aed" strokeWidth={collapsed ? 1.25 : 1} />
                  ) : null}
                  <circle cx={DOT_X} cy={y + ROW_H / 2} r={5} fill="#7c3aed" opacity={collapsed ? 1 : 0} />
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
