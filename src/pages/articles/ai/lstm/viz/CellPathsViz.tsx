import LstmSceneShell from "./LstmSceneShell";

/**
 * 본문 대응: #cell-state — Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙gₜ에서 Cₜ₋₁ → Cₜ direct edge의 미분은 fₜ.
 * 그러나 gate는 hₜ₋₁의 함수이고 hₜ₋₁ = oₜ₋₁⊙tanh(Cₜ₋₁)이므로
 * Cₜ₋₁ → hₜ₋₁ → (fₜ, iₜ, gₜ) → Cₜ 경로도 graph에 있다. 아래 식은 direct edge만 센다.
 */
const W = 360;
const H = 200;

const NODES = {
  cPrev: { x: 62, y: 46, label: "Cₜ₋₁" },
  cNow: { x: 298, y: 46, label: "Cₜ" },
  hPrev: { x: 62, y: 156, label: "hₜ₋₁" },
  gates: { x: 196, y: 156, label: "fₜ, iₜ, gₜ" },
} as const;

const SCENES = [
  { label: "Direct edge", summary: "∂Cₜ/∂Cₜ₋₁ |direct = fₜ", note: "Cₜ₋₁에 fₜ를 곱해 Cₜ로 바로 가는 한 줄만 따라가면 미분은 fₜ입니다. 여러 step을 지나면 이 값들이 곱해집니다." },
  { label: "다른 경로", summary: "Cₜ₋₁ → hₜ₋₁ → gate → Cₜ", note: "hₜ₋₁은 Cₜ₋₁을 tanh로 읽고 oₜ₋₁을 곱해 만든 값이고, 세 gate와 candidate는 hₜ₋₁을 입력으로 받습니다. 그래서 Cₜ₋₁이 바뀌면 gate를 거쳐서도 Cₜ가 바뀝니다." },
  { label: "아래 식이 세는 범위", summary: "direct만 = 전체 derivative의 일부", note: "아래 식의 곱 ∏fⱼ는 위쪽 direct edge만 이어 붙인 값입니다. 아래쪽 경로까지 더한 전체 derivative와 같지 않습니다." },
] as const;

function Node({ x, y, label, on }: { x: number; y: number; label: string; on: boolean }) {
  const width = label.length > 5 ? 92 : 64;
  return (
    <g>
      <rect x={x - width / 2} y={y - 17} width={width} height={34} rx={8} fill={on ? "#eff6ff" : "#ffffff"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? "#1e3a8a" : "#475569"}>{label}</text>
    </g>
  );
}

function Edge({ d, on, color, label, lx, ly, scene }: { d: string; on: boolean; color: string; label: string; lx: number; ly: number; scene: number }) {
  return (
    <g opacity={on ? 1 : 0.25}>
      <path d={d} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} markerEnd={`url(#cell-paths-arrow-${scene}-${color.slice(1)})`} />
      <text x={lx} y={ly} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function CellPathsViz() {
  return (
    <LstmSceneShell
      eyebrow="Computational graph의 두 갈래"
      title="Cₜ₋₁에서 Cₜ로 가는 길은 forget gate 한 줄만 있는 것이 아닙니다"
      description="파란 선은 cell의 direct edge, 주황 선은 hidden state와 gate를 거치는 경로입니다. 한 step만 그렸습니다."
      ariaLabel="cell state의 direct edge와 gate를 거치는 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const direct = active !== 1;
        const indirect = active !== 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {["2563eb", "d97706"].map((hex) => (
                <marker key={hex} id={`cell-paths-arrow-${active}-${hex}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill={`#${hex}`} />
                </marker>
              ))}
            </defs>
            <Edge d={`M${NODES.cPrev.x + 32} ${NODES.cPrev.y} L${NODES.cNow.x - 34} ${NODES.cNow.y}`} on={direct} color="#2563eb" label="× fₜ (direct)" scene={active} lx={180} ly={36} />
            <Edge d={`M${NODES.cPrev.x} ${NODES.cPrev.y + 17} L${NODES.hPrev.x} ${NODES.hPrev.y - 19}`} on={indirect} color="#d97706" label="oₜ₋₁·tanh" scene={active} lx={NODES.cPrev.x + 42} ly={104} />
            <Edge d={`M${NODES.hPrev.x + 32} ${NODES.hPrev.y} L${NODES.gates.x - 48} ${NODES.gates.y}`} on={indirect} color="#d97706" label="gate 입력" scene={active} lx={124} ly={146} />
            <Edge d={`M${NODES.gates.x + 46} ${NODES.gates.y - 10} L${NODES.cNow.x - 6} ${NODES.cNow.y + 19}`} on={indirect} color="#d97706" label="Cₜ 계산에 사용" scene={active} lx={300} ly={112} />
            <Node {...NODES.cPrev} on />
            <Node {...NODES.cNow} on />
            <Node {...NODES.hPrev} on={indirect} />
            <Node {...NODES.gates} on={indirect} />
          </svg>
        );
      }}
    />
  );
}
