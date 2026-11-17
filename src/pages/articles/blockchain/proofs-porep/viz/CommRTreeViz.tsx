import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pc2-artifact — Comm_R = H_2(Comm_C ‖ Comm_RLast).
 * 왼쪽: SDR label column(같은 node의 모든 layer label) → TreeC → CommC.
 * 오른쪽: labels로 encoding한 replica → TreeRLast → CommRLast.
 * layer 3개·node 8개, 두 개씩 묶는 tree 모양은 설명용 가정이다.
 */
const NODES = 8;
const LAYERS = 3;
const W = 480;
const H = 330;
const PITCH = 25;
const LEFT_X0 = 22;
const RIGHT_X0 = 262;
const CHANGED = 2;

const leafX = (x0: number, index: number) => x0 + PITCH * index + PITCH / 2;
const levelX = (x0: number, level: number, index: number) => {
  const span = 2 ** level;
  return x0 + PITCH * (span * index + span / 2);
};
// level 0 = leaves(8), 1 = 4, 2 = 2, 3 = root(1)
const LEVEL_Y: readonly number[] = [190, 160, 130, 96];

const SCENES = [
  {
    label: "label column",
    summary: "node 하나의 layer 1~3 label = column 하나",
    note: "Label column은 같은 node v의 모든 layer label을 세로로 모은 묶음이고, column 하나가 TreeC의 잎 하나입니다. Merkle tree는 값을 hash로 묶어 올라가 root 하나만 남기는 tree입니다.",
  },
  {
    label: "TreeC → CommC",
    summary: "column 8개 → root CommC",
    note: "column 잎 8개를 묶어 올라가면 TreeC의 root인 CommC가 남습니다. 여기서는 두 개씩 묶은 모양으로 그렸습니다(가정).",
  },
  {
    label: "replica → CommRLast",
    summary: "encoded replica → root CommRLast",
    note: "PC2는 labels로 원본 data를 encoding해 replica를 만들고, replica bytes로 TreeRLast를 만들어 root CommRLast를 얻습니다.",
  },
  {
    label: "두 root를 결속",
    summary: "CommR = H₂(CommC ‖ CommRLast)",
    note: "두 root를 profile의 2-input hash H₂에 함께 넣어 on-chain에 쓰는 CommR 하나를 만듭니다.",
  },
  {
    label: "replica 한 칸이 다르면",
    summary: "CommC 그대로 · CommR 달라짐",
    note: "TreeC는 같아도 replica의 한 부분이 다르면 그 잎에서 root까지 올라가는 길이 바뀌어 CommRLast가 달라지고, 결국 CommR도 달라집니다.",
  },
  {
    label: "다른 job의 root",
    summary: "job A의 CommC + job B의 CommRLast → 거절",
    note: "두 root는 같은 sector·RID·PC1 generation에서 나와야 합니다. 서로 다른 job의 root를 섞은 조합은 CommR로 승인하지 않습니다.",
  },
] as const;

const BLUE = "#2563eb";
const TEAL = "#0d9488";
const RED = "#dc2626";
const MUTED = "#cbd5e1";
const INK = "#475569";

function Tree({ x0, color, on, changedLeaf }: { x0: number; color: string; on: boolean; changedLeaf: number | null }) {
  const onPath = (level: number, index: number) => changedLeaf !== null && index === Math.floor(changedLeaf / 2 ** level);
  return (
    <g>
      {[0, 1, 2].map((level) =>
        Array.from({ length: NODES / 2 ** level }, (_, index) => {
          const parent = Math.floor(index / 2);
          const red = onPath(level, index);
          return (
            <line
              key={`${level}-${index}`}
              x1={levelX(x0, level, index)}
              y1={LEVEL_Y[level] - 4}
              x2={levelX(x0, level + 1, parent)}
              y2={level === 2 ? LEVEL_Y[3] - 6 : LEVEL_Y[level + 1] + 4}
              stroke={red ? RED : on ? color : MUTED}
              strokeWidth={red ? 1.25 : 1}
            />
          );
        }),
      )}
      {[0, 1, 2].map((level) =>
        Array.from({ length: NODES / 2 ** level }, (_, index) => (
          <circle
            key={`n-${level}-${index}`}
            cx={levelX(x0, level, index)}
            cy={LEVEL_Y[level]}
            r={4}
            fill={onPath(level, index) ? RED : on ? color : "#ffffff"}
            stroke={onPath(level, index) ? RED : on ? color : MUTED}
            strokeWidth={1}
          />
        )),
      )}
    </g>
  );
}

function RootBox({ x, y, label, color, on, sub }: { x: number; y: number; label: string; color: string; on: boolean; sub?: string }) {
  return (
    <g>
      <rect x={x - 62} y={y - 14} width={124} height={sub ? 34 : 26} rx={6} fill="#ffffff" stroke={on ? color : MUTED} strokeWidth={on ? 1.25 : 1} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={on ? color : "#94a3b8"}>
        {label}
      </text>
      {sub && (
        <text x={x} y={y + 16} textAnchor="middle" fontSize={11} fill={INK}>
          {sub}
        </text>
      )}
    </g>
  );
}

export default function CommRTreeViz() {
  return (
    <SceneShell
      eyebrow="PC2 commitment"
      title="label column의 root와 replica의 root를 한 번 더 묶은 값이 CommR입니다"
      description="왼쪽은 label grid에서 TreeC로, 오른쪽은 encoded replica에서 TreeRLast로 올라갑니다. layer 3개·node 8개와 두 개씩 묶는 tree 모양은 설명용 가정입니다."
      ariaLabel="label column으로 만든 TreeC와 encoded replica로 만든 TreeRLast의 root를 CommR로 묶는 구조"
      scenes={SCENES}
      render={(active) => {
        const leftOn = active >= 1;
        const rightOn = active >= 2;
        const topOn = active >= 3;
        const changed = active === 4;
        const mixed = active === 5;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 꼭대기 CommR */}
            <line x1={levelX(LEFT_X0, 3, 0)} y1={LEVEL_Y[3] - 32} x2={W / 2 - 30} y2={44} stroke={topOn ? INK : MUTED} strokeWidth={1} />
            <line x1={levelX(RIGHT_X0, 3, 0)} y1={LEVEL_Y[3] - 32} x2={W / 2 + 30} y2={44} stroke={changed ? RED : topOn ? INK : MUTED} strokeWidth={changed ? 1.25 : 1} />
            <RootBox
              x={W / 2}
              y={26}
              label={mixed ? "CommR 거절" : "CommR"}
              color={mixed || changed ? RED : INK}
              on={topOn}
              sub={topOn ? (mixed ? "서로 다른 job" : changed ? "값이 달라짐" : "H₂(CommC ‖ CommRLast)") : undefined}
            />
            <Tree x0={LEFT_X0} color={BLUE} on={leftOn} changedLeaf={null} />
            <Tree x0={RIGHT_X0} color={TEAL} on={rightOn} changedLeaf={changed ? CHANGED : null} />
            <RootBox x={levelX(LEFT_X0, 3, 0)} y={LEVEL_Y[3] - 18} label={mixed ? "CommC · job A" : "CommC"} color={BLUE} on={leftOn} />
            <RootBox
              x={levelX(RIGHT_X0, 3, 0)}
              y={LEVEL_Y[3] - 18}
              label={mixed ? "CommRLast · job B" : "CommRLast"}
              color={changed || mixed ? RED : TEAL}
              on={rightOn}
            />
            {Array.from({ length: NODES }, (_, col) => (
              <g key={`c-${col}`}>
                <line x1={leafX(LEFT_X0, col)} y1={196} x2={leafX(LEFT_X0, col)} y2={224} stroke={leftOn || (active === 0 && col === 5) ? BLUE : MUTED} strokeWidth={1} strokeDasharray="2 2" />
                <line x1={leafX(RIGHT_X0, col)} y1={196} x2={leafX(RIGHT_X0, col)} y2={224} stroke={changed && col === CHANGED ? RED : rightOn ? TEAL : MUTED} strokeWidth={1} strokeDasharray="2 2" />
              </g>
            ))}
            <text x={LEFT_X0} y={322} fontSize={11} fontWeight={700} fill={INK}>TreeC 잎 = label column</text>
            <text x={RIGHT_X0} y={322} fontSize={11} fontWeight={700} fill={INK}>TreeRLast 잎 = replica</text>
            {/* 왼쪽: label grid */}
            {Array.from({ length: LAYERS }, (_, row) =>
              Array.from({ length: NODES }, (_, col) => {
                const inColumn = active === 0 && col === 5;
                return (
                  <rect
                    key={`g-${row}-${col}`}
                    x={leafX(LEFT_X0, col) - 10}
                    y={226 + row * 20}
                    width={20}
                    height={16}
                    rx={2}
                    fill={inColumn ? "#dbeafe" : "#f1f5f9"}
                    stroke={inColumn ? BLUE : MUTED}
                    strokeWidth={1}
                  />
                );
              }),
            )}
            {active === 0 && (
              <rect x={leafX(LEFT_X0, 5) - 12} y={222} width={24} height={64} rx={3} fill="none" stroke={BLUE} strokeWidth={1.25} />
            )}
            <text x={LEFT_X0} y={302} fontSize={11} fill="#64748b">위→아래 layer 1~3 · 가로 node 1~8</text>
            {/* 오른쪽: 원본 data와 encoded replica */}
            {Array.from({ length: NODES }, (_, col) => (
              <g key={`r-${col}`}>
                <rect x={leafX(RIGHT_X0, col) - 10} y={270} width={20} height={16} rx={2} fill="#f1f5f9" stroke={MUTED} strokeWidth={1} />
                <rect
                  x={leafX(RIGHT_X0, col) - 10}
                  y={226}
                  width={20}
                  height={16}
                  rx={2}
                  fill={changed && col === CHANGED ? "#fecaca" : rightOn ? "#ccfbf1" : "#f1f5f9"}
                  stroke={changed && col === CHANGED ? RED : rightOn ? TEAL : MUTED}
                  strokeWidth={1}
                />
              </g>
            ))}
            <text x={RIGHT_X0 + 4} y={262} fontSize={11} fill={rightOn ? TEAL : "#94a3b8"}>↑ labels로 encoding</text>
            <text x={RIGHT_X0} y={302} fontSize={11} fill="#64748b">위: replica · 아래: 원본 data</text>
          </svg>
        );
      }}
    />
  );
}
