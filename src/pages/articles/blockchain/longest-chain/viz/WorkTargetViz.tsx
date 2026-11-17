import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chain-selection ExplainedFormula — 8-bit 설명용 예.
 * hash 값 256개(0~255) 중 0~T가 성공 칸. T=63 → 64칸 → 확률 1/4 → work 256/64 = 4.
 * T=15 → 16칸 → 1/16 → work 16. 같은 block 2개라도 누적 work는 4+4=8, 4+16=20.
 */
const W = 360;
const H = 236;
const CELL = 12;
const GRID_X = 16;
const GRID_Y = 28;
const COLS = 16;

const SCENES = [
  {
    label: "T=63: 성공 칸 64개",
    summary: "64/256 = 1/4 → work 4",
    target: 63,
    note: "Hash 256가지 중 T=63 이하인 0~63의 64칸이 성공입니다. 성공 확률 1/4의 역수인 4가 block work입니다.",
  },
  {
    label: "T=15: 성공 칸 16개",
    summary: "16/256 = 1/16 → work 16",
    target: 15,
    note: "Target을 15로 낮추면 성공 칸이 16개로 줄고, 확률 1/16의 역수인 work는 16으로 커집니다.",
  },
  {
    label: "Block 수가 같은 두 분기",
    summary: "둘 다 2개 · 누적 8 대 20",
    target: -1,
    note: "두 분기 모두 block 2개지만 누적 work는 A가 4+4=8, B가 4+16=20입니다. 노드는 개수가 아니라 이 합으로 비교합니다(target 배치는 가정).",
  },
] as const;

function Grid({ target }: { target: number }) {
  return (
    <g>
      {Array.from({ length: 256 }, (_, value) => {
        const row = Math.floor(value / COLS);
        const col = value % COLS;
        const hit = value <= target;
        return (
          <rect
            key={value}
            x={GRID_X + col * CELL}
            y={GRID_Y + row * CELL}
            width={CELL - 1.5}
            height={CELL - 1.5}
            rx={1.5}
            fill={hit ? "#2563eb" : "#94a3b8"}
            fillOpacity={hit ? 0.9 : 0.18}
          />
        );
      })}
      <text x={GRID_X} y={GRID_Y - 10} fontSize={11} fill="#64748b">hash 값 0 → 255 (칸 하나 = 값 하나)</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 22} fontSize={11} fill="#64748b">성공 칸 (0~T)</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 44} fontSize={20} fontWeight={700} fill="#2563eb">{target + 1}개</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 80} fontSize={11} fill="#64748b">성공 확률</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 100} fontSize={15} fontWeight={700} fill="#475569">{target + 1}/256</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 136} fontSize={11} fill="#64748b">block work</text>
      <text x={GRID_X + COLS * CELL + 18} y={GRID_Y + 160} fontSize={20} fontWeight={700} fill="#2563eb">{256 / (target + 1)}</text>
    </g>
  );
}

const BRANCHES = [
  { name: "분기 A", blocks: [{ t: 63, w: 4 }, { t: 63, w: 4 }], y: 60 },
  { name: "분기 B", blocks: [{ t: 63, w: 4 }, { t: 15, w: 16 }], y: 148 },
] as const;

function Branches() {
  return (
    <g>
      <rect x={16} y={98} width={40} height={36} rx={4} fill="#475569" />
      <text x={36} y={121} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">P</text>
      {BRANCHES.map((branch) => {
        const total = branch.blocks.reduce<number>((sum, block) => sum + block.w, 0);
        const heavy = total > 10;
        return (
          <g key={branch.name}>
            <line x1={56} y1={116} x2={84} y2={branch.y + 20} stroke="#94a3b8" strokeWidth={1} />
            <text x={84} y={branch.y - 8} fontSize={11} fontWeight={700} fill="#475569">{branch.name} · block 2개</text>
            {branch.blocks.map((block, index) => (
              <g key={index}>
                <rect x={84 + index * 76} y={branch.y} width={66} height={40} rx={4} fill={block.w > 4 ? "#2563eb" : "#94a3b8"} fillOpacity={block.w > 4 ? 0.9 : 0.25} stroke="#94a3b8" strokeWidth={1} />
                <text x={117 + index * 76} y={branch.y + 16} textAnchor="middle" fontSize={10} fill={block.w > 4 ? "#ffffff" : "#475569"}>T={block.t}</text>
                <text x={117 + index * 76} y={branch.y + 31} textAnchor="middle" fontSize={12} fontWeight={700} fill={block.w > 4 ? "#ffffff" : "#334155"}>+{block.w}</text>
              </g>
            ))}
            <text x={250} y={branch.y + 16} fontSize={11} fill="#64748b">누적 work</text>
            <text x={250} y={branch.y + 36} fontSize={20} fontWeight={700} fill={heavy ? "#2563eb" : "#475569"}>{total}</text>
            {heavy && <text x={290} y={branch.y + 36} fontSize={11} fontWeight={700} fill="#2563eb">더 큼</text>}
          </g>
        );
      })}
    </g>
  );
}

export default function WorkTargetViz() {
  return (
    <SceneShell
      eyebrow="Target → block work → 누적 work"
      title="Target이 작을수록 성공 칸이 줄고 block 하나의 work가 커집니다"
      description="8-bit 설명용 예입니다(실제 Bitcoin hash는 256-bit). Target T는 block header hash가 넘지 않아야 하는 상한이고, work는 성공 확률의 역수입니다."
      ariaLabel="8-bit 예에서 target 63과 15의 성공 칸 수, block work, 두 분기의 누적 work 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.target >= 0 ? <Grid target={scene.target} /> : <Branches />}
          </svg>
        );
      }}
    />
  );
}
