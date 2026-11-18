import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 정부·채권시장 → 개발은행 → (민간은행과 위험 분담) → 기업,
 * 상환금은 새 대출 재원으로 돌아가고, 연체는 충당금과 자본을 줄이며, 정부가 메우면 납세자 부담.
 */
const W = 360;
const H = 262;
const NODE_W = 128;
const NODE_H = 46;
const LEFT_X = 12;
const RIGHT_X = W - 12 - NODE_W;
const ROW = [12, 108, 204];

type NodeKey = "gov" | "pb" | "db" | "firm" | "cap" | "tax";

const NODES: Record<NodeKey, { x: number; y: number; title: string; sub: string }> = {
  gov: { x: LEFT_X, y: ROW[0], title: "정부·채권시장", sub: "자본·채권으로 자금" },
  pb: { x: RIGHT_X, y: ROW[0], title: "민간은행", sub: "함께 위험 분담" },
  db: { x: LEFT_X, y: ROW[1], title: "개발은행", sub: "임무에 맞는 사업 선별" },
  firm: { x: RIGHT_X, y: ROW[1], title: "기업", sub: "설비·고용·운전자금" },
  cap: { x: LEFT_X, y: ROW[2], title: "충당금·자본", sub: "연체 손실을 흡수" },
  tax: { x: RIGHT_X, y: ROW[2], title: "납세자", sub: "정부가 메운 손실" },
};

interface Edge {
  key: string;
  scene: number;
  path: string;
  arrow: [number, number, "down" | "up" | "left" | "right"];
  label: string;
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
  loss?: boolean;
}

const MID_L = LEFT_X + NODE_W / 2;
const MID_R = RIGHT_X + NODE_W / 2;

const EDGES: readonly Edge[] = [
  { key: "fund", scene: 0, path: `M${MID_L},${ROW[0] + NODE_H} L${MID_L},${ROW[1]}`, arrow: [MID_L, ROW[1], "down"], label: "자금", lx: MID_L + 6, ly: (ROW[0] + NODE_H + ROW[1]) / 2 + 4, anchor: "start" },
  { key: "loan", scene: 1, path: `M${LEFT_X + NODE_W},${ROW[1] + 15} L${RIGHT_X},${ROW[1] + 15}`, arrow: [RIGHT_X, ROW[1] + 15, "right"], label: "대출", lx: W / 2, ly: ROW[1] + 10, anchor: "middle" },
  { key: "co", scene: 1, path: `M${MID_R},${ROW[0] + NODE_H} L${MID_R},${ROW[1]}`, arrow: [MID_R, ROW[1], "down"], label: "공동금융", lx: MID_R - 6, ly: (ROW[0] + NODE_H + ROW[1]) / 2 + 4, anchor: "end" },
  { key: "repay", scene: 2, path: `M${RIGHT_X},${ROW[1] + 33} L${LEFT_X + NODE_W},${ROW[1] + 33}`, arrow: [LEFT_X + NODE_W, ROW[1] + 33, "left"], label: "원리금 상환", lx: W / 2, ly: ROW[1] + 47, anchor: "middle" },
  { key: "default", scene: 3, path: `M${MID_L},${ROW[1] + NODE_H} L${MID_L},${ROW[2]}`, arrow: [MID_L, ROW[2], "down"], label: "연체 손실", lx: MID_L + 6, ly: (ROW[1] + NODE_H + ROW[2]) / 2 + 4, anchor: "start", loss: true },
  { key: "bail", scene: 3, path: `M${RIGHT_X},${ROW[2] + 23} L${LEFT_X + NODE_W},${ROW[2] + 23}`, arrow: [LEFT_X + NODE_W, ROW[2] + 23, "left"], label: "정부가 메우면", lx: W / 2, ly: ROW[2] + 17, anchor: "middle", loss: true },
];

const NODE_SCENE: Record<NodeKey, number> = { gov: 0, db: 0, pb: 1, firm: 1, cap: 3, tax: 3 };

const SCENES = [
  { label: "자금이 들어옵니다", summary: "정부·채권시장 → 개발은행", note: "정부와 채권시장이 개발은행에 자금을 댑니다. 개발은행은 이 돈으로 임무에 맞는 사업을 찾습니다." },
  { label: "기업에 대출합니다", summary: "개발은행 + 민간은행 → 기업", note: "개발은행은 민간은행과 함께 위험을 나눌 수 있습니다. 기업은 대출을 설비·고용·운전자금에 씁니다. 1절 장부에서 늘어난 15도 이 화살표로 갑니다." },
  { label: "상환금이 다시 돕니다", summary: "기업 → 개발은행 → 새 대출", note: "기업이 매출에서 원리금을 갚으면 그 돈이 새 대출의 재원이 됩니다. 대출과 상환 두 화살표가 한 바퀴를 이룹니다." },
  { label: "연체는 아래로 내려갑니다", summary: "연체 → 충당금·자본 감소 → 납세자", note: "연체는 충당금(예상 손실에 대비해 떼어 두는 돈)과 자본을 줄이고, 정부가 메우면 납세자 부담이 됩니다. 그래서 대출액과 함께 민간자금 유입, 투자 완료, 고용·배출, 연체, 보조금 상당액을 공개해야 합니다." },
] as const;

function Arrow({ x, y, dir, color }: { x: number; y: number; dir: "down" | "up" | "left" | "right"; color: string }) {
  const s = 5;
  const points = {
    down: `${x},${y} ${x - s},${y - s * 1.4} ${x + s},${y - s * 1.4}`,
    up: `${x},${y} ${x - s},${y + s * 1.4} ${x + s},${y + s * 1.4}`,
    right: `${x},${y} ${x - s * 1.4},${y - s} ${x - s * 1.4},${y + s}`,
    left: `${x},${y} ${x + s * 1.4},${y - s} ${x + s * 1.4},${y + s}`,
  }[dir];
  return <polygon points={points} fill={color} />;
}

export default function LoanCycleViz() {
  return (
    <SceneShell
      eyebrow="돈이 도는 길"
      title="대출은 상환으로 돌아오고, 연체는 자본과 납세자에게 내려갑니다"
      description="상자는 돈을 대거나 받거나 손실을 떠안는 쪽이고, 화살표는 돈이 움직이는 방향입니다. 빨간 화살표는 연체 손실이 넘어가는 곳과 그 손실을 메우는 돈입니다. 장면을 넘기면 한 단계씩 길이 더해집니다."
      ariaLabel="정부와 채권시장의 자금이 개발은행 대출로 기업에 가고, 상환은 새 대출 재원으로, 연체는 충당금과 자본, 납세자 부담으로 이어지는 흐름"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {EDGES.map((edge) => {
            if (edge.scene > active) return null;
            const current = edge.scene === active;
            const color = edge.loss ? "#dc2626" : current ? "#2563eb" : "#94a3b8";
            return (
              <g key={edge.key}>
                <path d={edge.path} fill="none" stroke={color} strokeWidth={current ? 1.25 : 1} />
                <Arrow x={edge.arrow[0]} y={edge.arrow[1]} dir={edge.arrow[2]} color={color} />
                <text x={edge.lx} y={edge.ly} textAnchor={edge.anchor} fontSize={11} fontWeight={current ? 700 : 400} fill={edge.loss ? "#dc2626" : current ? "#2563eb" : "#64748b"}>{edge.label}</text>
              </g>
            );
          })}
          {(Object.keys(NODES) as NodeKey[]).map((key) => {
            const node = NODES[key];
            const on = NODE_SCENE[key] <= active;
            const current = NODE_SCENE[key] === active;
            const loss = key === "cap" || key === "tax";
            const recycled = key === "db" && active >= 2;
            const stroke = !on ? "#cbd5e1" : loss ? "#dc2626" : current ? "#2563eb" : "#94a3b8";
            return (
              <g key={key} opacity={on ? 1 : 0.5}>
                <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke={stroke} strokeWidth={current ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                <text x={node.x + NODE_W / 2} y={node.y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill={on ? "currentColor" : "#94a3b8"}>{node.title}</text>
                <text x={node.x + NODE_W / 2} y={node.y + 35} textAnchor="middle" fontSize={10} fontWeight={recycled ? 700 : 400} fill={recycled ? "#16a34a" : on ? "#64748b" : "#cbd5e1"}>{recycled ? "상환금 → 새 대출 재원" : node.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
