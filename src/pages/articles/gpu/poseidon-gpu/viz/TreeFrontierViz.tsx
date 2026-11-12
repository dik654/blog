import SceneShell from "./SceneShell";

/**
 * 본문 대응: #batch-tree — arity a=2 tree에서 level별 job 수 N(ℓ+1)=⌈N(ℓ)/2⌉,
 * parent는 ordered children이 모두 준비된 뒤 실행, N₀=7이면 마지막 묶음에 child가 하나뿐.
 * N₀=8: 8→4→2→1, N₀=7: 7→4→2→1 (⌈7/2⌉=4, ⌈4/2⌉=2, ⌈2/2⌉=1).
 */
const SCENES = [
  {
    label: "level 0 · leaf 8개",
    summary: "8개를 한 batch로",
    note: "Leaf hash 8개는 서로 독립이라 같은 batch로 함께 돌립니다. 이 level에는 job이 많아 GPU가 충분히 찹니다. Leaf는 leaf용 domain으로 계산합니다.",
  },
  {
    label: "level 1 · parent 4개",
    summary: "⌈8/2⌉ = 4",
    note: "Parent 하나는 정해진 순서의 child 2개를 받습니다. 두 child가 모두 끝나야 그 parent를 시작할 수 있고, internal node는 leaf와 다른 domain을 씁니다.",
  },
  {
    label: "level 2 · parent 2개",
    summary: "⌈4/2⌉ = 2",
    note: "Level 1의 4개가 모두 끝난 뒤에야 level 2의 2개를 시작합니다. Root에 가까워질수록 병렬로 돌릴 job이 줄어듭니다.",
  },
  {
    label: "level 3 · root 1개",
    summary: "⌈2/2⌉ = 1",
    note: "Root는 level 2의 두 결과를 기다린 뒤 혼자 실행됩니다. 이 level에서 동시에 돌릴 job은 1개뿐입니다.",
  },
  {
    label: "leaf가 7개이면",
    summary: "⌈7/2⌉ = 4, 마지막 칸 비어 있음",
    note: "7을 2로 나눠 올리면 parent는 여전히 4개지만, 마지막 parent는 child가 하나뿐입니다. 빈 칸을 padding할지 exact size가 아니면 거절할지를 profile에 고정하지 않으면 root의 의미가 정해지지 않고, 규칙이 다르면 같은 leaves에서도 다른 root가 나옵니다.",
  },
] as const;

const SEVEN_SCENE = 4;

const LEAF_X = [26, 60, 94, 128, 162, 196, 230, 264] as const;
const LEVEL_Y = [198, 146, 94, 42] as const;
const NODE_W = 28;
const NODE_H = 22;

const ACCENT = "#2563eb";
const DONE = "#64748b";
const LINE = "#94a3b8";
const WARN = "#d97706";

const midpoints = (xs: readonly number[]) => xs.filter((_, i) => i % 2 === 0).map((x, i) => (x + xs[i * 2 + 1]) / 2);
const LEVEL_X: readonly (readonly number[])[] = [LEAF_X, midpoints(LEAF_X), midpoints(midpoints(LEAF_X)), midpoints(midpoints(midpoints(LEAF_X)))];

type NodeState = "todo" | "active" | "done" | "missing";

function nodeState(active: number, level: number, index: number): NodeState {
  const seven = active === SEVEN_SCENE;
  if (seven && level === 0 && index === 7) return "missing";
  const current = seven ? 1 : active;
  if (level === current) return "active";
  return level < current ? "done" : "todo";
}

const STYLE: Record<NodeState, { fill: string; stroke: string; text: string; dash?: string }> = {
  todo: { fill: "none", stroke: LINE, text: LINE, dash: "3 3" },
  active: { fill: "#dbeafe", stroke: ACCENT, text: "#1e3a8a" },
  done: { fill: "#e2e8f0", stroke: DONE, text: "#334155" },
  missing: { fill: "#fff7ed", stroke: WARN, text: "#9a3412", dash: "3 3" },
};

export default function TreeFrontierViz() {
  return (
    <SceneShell
      eyebrow="03 · level별 job"
      title="Root에 가까울수록 일이 줄고, 마지막 묶음은 규칙이 필요합니다"
      description="Arity 2(parent 하나가 child 2개를 받음)인 tree입니다. 파란 칸과 ▶ 표시가 지금 실행하는 level, 회색 칸은 끝난 level, 회색 점선 칸은 아직 기다리는 level입니다. 오른쪽 숫자는 그 level의 job 수입니다."
      ariaLabel="leaf 8개에서 root까지 level별 job 수가 8, 4, 2, 1로 줄고 leaf가 7개면 마지막 parent에 child가 하나뿐인 tree"
      scenes={SCENES}
      render={(active) => {
        const seven = active === SEVEN_SCENE;
        const counts = seven ? [7, 4, 2, 1] : [8, 4, 2, 1];
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LEVEL_X.slice(1).map((xs, li) =>
              xs.map((px, pi) =>
                [0, 1].map((c) => {
                  const level = li + 1;
                  const childX = LEVEL_X[level - 1][pi * 2 + c];
                  const missingEdge = seven && level === 1 && pi === 3 && c === 1;
                  return (
                    <line
                      key={`e-${level}-${pi}-${c}`}
                      x1={childX}
                      y1={LEVEL_Y[level - 1] - NODE_H / 2}
                      x2={px}
                      y2={LEVEL_Y[level] + NODE_H / 2}
                      stroke={missingEdge ? WARN : LINE}
                      strokeWidth={1}
                      strokeDasharray={missingEdge ? "3 3" : undefined}
                    />
                  );
                }),
              ),
            )}
            {LEVEL_X.map((xs, level) =>
              xs.map((x, index) => {
                const s = STYLE[nodeState(active, level, index)];
                const label = nodeState(active, level, index) === "missing" ? "?" : level === 0 ? `L${index}` : level === 3 ? "root" : level === 2 ? `Q${index}` : `P${index}`;
                const w = level === 3 ? 36 : NODE_W;
                return (
                  <g key={`n-${level}-${index}`}>
                    <rect x={x - w / 2} y={LEVEL_Y[level] - NODE_H / 2} width={w} height={NODE_H} rx={5} fill={s.fill} stroke={s.stroke} strokeWidth={1} strokeDasharray={s.dash} />
                    <text x={x} y={LEVEL_Y[level] + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.text}>{label}</text>
                  </g>
                );
              }),
            )}
            {LEVEL_Y.map((y, level) => (
              <g key={`c-${level}`}>
                <text x={300} y={y + 4} fontSize={11} fontWeight={700} fill={DONE}>N<tspan fontSize={8} dy={3}>{level}</tspan></text>
                <text x={352} y={y + 4} textAnchor="end" fontSize={13} fontWeight={800} fill={seven && level === 0 ? WARN : level === (seven ? 1 : active) ? ACCENT : "#1e293b"}>{level === (seven ? 1 : active) ? `▶ ${counts[level]}` : counts[level]}</text>
              </g>
            ))}
            <text x={326} y={16} textAnchor="middle" fontSize={9} fill={DONE}>level별 job 수</text>
            {seven && (
              <text x={264} y={224} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>padding? 거절?</text>
            )}
          </svg>
        );
      }}
    />
  );
}
