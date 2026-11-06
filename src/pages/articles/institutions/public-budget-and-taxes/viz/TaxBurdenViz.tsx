import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 판매자에게 세금 1 부과, 가격 0.6 인상, 다른 조건 동일이라는 가정에서
 * 구매자 0.6·판매자 1 − 0.6 = 0.4 부담. 실제 전가 비율은 수요와 공급 반응으로 확인한다.
 */
const SCENES = [
  { label: "법적으로 내는 사람", summary: "판매자 → 정부 1", note: "세금 1은 판매자에게 부과했습니다. 정부에 내는 쪽은 판매자입니다." },
  { label: "가격을 올리면", summary: "구매자 → 판매자 +0.6", note: "판매자가 가격을 0.6 올리고 다른 조건이 같다고 둡니다. 구매자는 그만큼 더 냅니다." },
  { label: "경제적으로 부담하는 사람", summary: "구매자 0.6 · 판매자 0.4", note: "판매자는 1을 내고 0.6을 더 받았으니 1 − 0.6 = 0.4를 부담합니다. 이 비율은 가정이고 실제 전가 비율은 수요와 공급 반응으로 확인합니다." },
] as const;

const NODES = [
  { name: "구매자", x: 10 },
  { name: "판매자", x: 138 },
  { name: "정부", x: 266 },
] as const;
const NODE_W = 84;
const NODE_Y = 28;
const NODE_H = 40;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const BAR_X = 30;
const BAR_W = 300;
const BAR_Y = 118;

function Arrow({ x1, x2, color, text }: { x1: number; x2: number; color: string; text: string }) {
  const y = NODE_Y + NODE_H / 2;
  return (
    <g>
      <line x1={x1} x2={x2 - 1} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2 - 6} ${y - 4} L${x2} ${y} L${x2 - 6} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

export default function TaxBurdenViz() {
  return (
    <SceneShell
      eyebrow="세금의 부담 (가정)"
      title="세금을 내는 사람과 부담하는 사람이 갈라지는 경로"
      description="위는 돈이 움직이는 방향, 아래 막대는 세금 1을 누가 부담하는지입니다. 0.6은 본문의 가정입니다."
      ariaLabel="판매자가 정부에 세금 1을 내고 구매자가 판매자에게 0.6을 더 내어 부담이 0.6과 0.4로 나뉘는 흐름"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {NODES.map((node) => (
            <g key={node.name}>
              <rect x={node.x} y={NODE_Y} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
              <text x={node.x + NODE_W / 2} y={NODE_Y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>{node.name}</text>
            </g>
          ))}
          <Arrow x1={NODES[1].x + NODE_W} x2={NODES[2].x} color={BLUE} text="세금 1" />
          {active >= 1 && <Arrow x1={NODES[0].x + NODE_W} x2={NODES[1].x} color={AMBER} text="+0.6" />}
          <text x={BAR_X} y={BAR_Y - 8} fontSize={11.5} fontWeight={700} fill={GRAY}>세금 1의 부담</text>
          <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={28} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          {active >= 1 && (
            <g>
              <rect x={BAR_X} y={BAR_Y} width={BAR_W * 0.6} height={28} rx={3} fill={AMBER} />
              <text x={BAR_X + BAR_W * 0.3} y={BAR_Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">구매자 0.6</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <rect x={BAR_X + BAR_W * 0.6} y={BAR_Y} width={BAR_W * 0.4} height={28} rx={3} fill={BLUE} />
              <text x={BAR_X + BAR_W * 0.8} y={BAR_Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">판매자 0.4</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
