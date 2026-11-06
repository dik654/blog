import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #exposure — 부도 처리 규칙에 따라 B의 결과가 달라진다.
 * 가정 1: 유효한 순액 의무가 A의 10만 남는다 → A−10·B 0·C+10.
 * 가정 2: A가 실패하면 A가 들어간 ①②⑤⑥을 빼고 다시 계산 → ③ B→C 30, ④ C→B 20 → B−10·C+10.
 * 어느 쪽도 특정 시스템의 현행 부도 규칙이 아니다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "가정 1: 순액 의무만 남음", summary: "A −10 · B 0 · C +10", note: "유효한 순액 의무가 A의 10만 남는다고 가정한 경우입니다. B의 순포지션은 0이므로 B가 새로 낼 돈은 없습니다. C의 +10은 받을 몫을 계산한 값입니다." },
  { label: "가정 2: A의 지시를 뺌", summary: "①②⑤⑥ 네 건 제거", note: "이번에는 A가 실패하면 관련 지시를 제거하고 다시 계산한다고 가정합니다. 점선이 A가 들어간 네 건입니다. 특정 시스템의 현행 부도 규칙을 설명하는 예가 아닙니다." },
  { label: "가정 2: 다시 계산", summary: "B −10 · C +10", note: "남은 ③과 ④만 계산하면 B는 30을 보내고 20을 받으므로 10을 내야 합니다. 원래 순포지션 0이던 B에게 새 자금 수요가 생깁니다." },
];

const R = 22;
const NODES = {
  A: { x: 66, y: 58 },
  B: { x: 294, y: 58 },
  C: { x: 180, y: 190 },
};
type Bank = keyof typeof NODES;

interface Edge {
  no: string;
  from: Bank;
  to: Bank;
  amount: number;
}

const EDGES: readonly Edge[] = [
  { no: "①", from: "A", to: "B", amount: 100 },
  { no: "②", from: "B", to: "A", amount: 90 },
  { no: "③", from: "B", to: "C", amount: 30 },
  { no: "④", from: "C", to: "B", amount: 20 },
  { no: "⑤", from: "A", to: "C", amount: 10 },
  { no: "⑥", from: "C", to: "A", amount: 10 },
];

const NET_EDGE: Edge = { no: "", from: "A", to: "C", amount: 10 };

/** 두 은행 사이의 화살표 하나. 방향별로 진행 방향의 오른쪽으로 비켜 그려 왕복 화살표가 겹치지 않습니다. */
function Arrow({ edge, removed, label }: { edge: Edge; removed: boolean; label: string }) {
  const p = NODES[edge.from];
  const q = NODES[edge.to];
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const off = 8;
  const x1 = p.x + ux * (R + 2) + nx * off;
  const y1 = p.y + uy * (R + 2) + ny * off;
  const x2 = q.x - ux * (R + 4) + nx * off;
  const y2 = q.y - uy * (R + 4) + ny * off;
  const color = removed ? "#94a3b8" : "#2563eb";
  const head = `${x2},${y2} ${x2 - ux * 8 + nx * 4},${y2 - uy * 8 + ny * 4} ${x2 - ux * 8 - nx * 4},${y2 - uy * 8 - ny * 4}`;
  // 대각선 화살표는 가로로 긴 글자가 선에 닿지 않도록 더 멀리 띄웁니다.
  const gap = 12 + 16 * Math.abs(nx);
  const mx = (x1 + x2) / 2 + nx * gap;
  const my = (y1 + y2) / 2 + ny * gap + 4;
  return (
    <g opacity={removed ? 0.75 : 1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={removed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
      <text x={mx} y={my} textAnchor="middle" fontSize={12} fontWeight={700} fill={removed ? "#64748b" : "#2563eb"}>
        {label}
      </text>
    </g>
  );
}

function BankNode({ name, net, strong }: { name: Bank; net: string; strong: boolean }) {
  const { x, y } = NODES[name];
  const textY = name === "C" ? y + R + 18 : y - R - 8;
  return (
    <g>
      <circle cx={x} cy={y} r={R} fill={strong ? "#fee2e2" : "#f1f5f9"} stroke={strong ? "#dc2626" : "#64748b"} strokeWidth={1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#0f172a">
        {name}
      </text>
      <text x={x} y={textY} textAnchor="middle" fontSize={13} fontWeight={700} fill={strong ? "#dc2626" : "#64748b"}>
        {net}
      </text>
    </g>
  );
}

const A_INVOLVED = (edge: Edge) => edge.from === "A" || edge.to === "A";

export default function UnwindViz() {
  return (
    <SceneShell
      eyebrow="부도 처리 규칙"
      title="A가 실패했을 때 어떤 규칙을 쓰느냐에 따라 B의 몫이 달라집니다"
      description="원은 은행, 화살표는 지시, 숫자는 억 원입니다. 은행 옆 숫자는 순포지션(받은 합 − 보낸 합)입니다. 두 규칙 모두 설명을 위한 가정입니다."
      ariaLabel="부도 처리 가정에 따른 세 은행의 순포지션 변화"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? (
            <Arrow edge={NET_EDGE} removed={false} label="의무 10" />
          ) : (
            EDGES.filter((edge) => active === 1 || !A_INVOLVED(edge)).map((edge) => (
              <Arrow key={edge.no} edge={edge} removed={A_INVOLVED(edge)} label={`${edge.no} ${edge.amount}`} />
            ))
          )}
          <BankNode name="A" net={active === 0 ? "−10" : active === 1 ? "실패" : "제외"} strong={false} />
          <BankNode name="B" net={active === 0 ? "0" : active === 1 ? "?" : "−10"} strong={active === 2} />
          <BankNode name="C" net={active === 0 ? "+10" : active === 1 ? "?" : "+10"} strong={false} />
        </svg>
      )}
    />
  );
}
