import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reparam-trick — sampling node를 그대로 두면 역전파 경로가 드러나지 않고,
 * ε를 밖으로 빼면 z = μ + σ⊙ε가 결정론적 변환이 되어 μ·σ까지 gradient가 흐른다.
 * 숫자는 이 글 첫 Viz의 값: μ=[1,−0.5], log σ²=[0,−1.386] → σ=[1,0.5], ε=[0.5,−1] → z=[1.5,−1].
 */
const MU = [1, -0.5] as const;
const SIGMA = [1, 0.5] as const;
const EPS_A = [0.5, -1] as const;
const EPS_B = [-1, 0.5] as const;
const zOf = (eps: readonly [number, number]) => [MU[0] + SIGMA[0] * eps[0], MU[1] + SIGMA[1] * eps[1]] as const;
const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);
const vec = (pair: readonly number[]) => `[${pair.map(fmt).join(", ")}]`;
const Z_A = zOf(EPS_A);
const Z_B = zOf(EPS_B);
const NUDGE = 0.1;

const SCENES = [
  { label: "뽑기를 그대로 두면", summary: "z ∼ qφ(z|x)", note: "μ·σ가 바뀔 때 뽑힌 z가 어떻게 변하는지 드러나지 않습니다. 확률적 연산이라 미분이 안 된다기보다, 평범한 역전파가 따라갈 경로가 안 보이는 것이 문제입니다." },
  { label: "난수를 밖으로", summary: "ε ∼ N(0, I)", note: "parameter와 무관한 ε를 먼저 뽑습니다. Gaussian posterior에서는 이 ε를 결정론적으로 변환해 z를 만들 수 있습니다." },
  { label: "숫자로 계산", summary: `z = ${vec(Z_A)}`, note: `log σ²=[0, −1.386]의 절반을 exp하면 σ=${vec(SIGMA)}입니다. 축별로 ${fmt(MU[0])}+${fmt(SIGMA[0])}×${fmt(EPS_A[0])}=${fmt(Z_A[0])}, ${fmt(MU[1])}+${fmt(SIGMA[1])}×(${fmt(EPS_A[1])})=${fmt(Z_A[1])}입니다.` },
  { label: "gradient가 지나갑니다", summary: `μ₁+${NUDGE} → z₁+${NUDGE}`, note: `gradient는 앞쪽 값을 조금 바꿀 때 뒤쪽 값이 변하는 정도입니다. ε를 상수처럼 두면 μ₁을 ${NUDGE} 올릴 때 z₁도 ${NUDGE}, σ₁을 ${NUDGE} 올릴 때 z₁은 ${NUDGE}×${fmt(EPS_A[0])}=${NUDGE * EPS_A[0]} 오릅니다.` },
  { label: "noise는 남습니다", summary: `ε=${vec(EPS_B)} → z=${vec(Z_B)}`, note: `다른 ε를 뽑으면 z도 ${vec(Z_B)}로 바뀌고, σ₁을 ${NUDGE} 올릴 때의 z₁ 변화도 ${fmt(NUDGE * EPS_B[0])}로 부호까지 바뀝니다. Monte Carlo sample을 쓰므로 경로가 열려도 gradient에는 noise가 남습니다.` },
] as const;

const W = 360;
const H = 176;
const BOX_H = 46;
const ROW_Y = 62;
const NODES = [
  { key: "enc", x: 6, w: 60, title: "Encoder", sub: "φ" },
  { key: "par", x: 80, w: 62, title: "μ · σ", sub: "분포 값" },
  { key: "z", x: 156, w: 72, title: "z", sub: "" },
  { key: "dec", x: 242, w: 56, title: "Decoder", sub: "θ" },
  { key: "loss", x: 312, w: 42, title: "loss", sub: "" },
] as const;

const GRAD = "#d97706";
const FORWARD = "#64748b";

export default function ReparamPathViz() {
  return (
    <SceneShell
      eyebrow="sampling과 미분 경로"
      title="난수를 z 밖으로 빼면 encoder까지 길이 이어집니다"
      description="회색 화살표는 값이 계산되는 방향, 주황 화살표는 loss를 줄이는 정보(gradient)가 되돌아가는 역전파입니다. 숫자는 글 첫머리 Viz의 가정값이고, 마지막 장면의 다른 ε만 새로 가정했습니다."
      ariaLabel="sampling node와 reparameterization에서 gradient 경로를 비교하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const direct = active === 0;
        const showEps = active >= 1;
        const gradTo = direct ? 2 : active >= 3 ? 0 : null;
        const showNumbers = active >= 2;
        const eps = active === 4 ? EPS_B : EPS_A;
        const z = active === 4 ? Z_B : Z_A;
        const edges = NODES.slice(0, -1).map((node, index) => ({ from: node, to: NODES[index + 1], index }));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="reparam-fwd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill={FORWARD} /></marker>
              <marker id="reparam-grad" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill={GRAD} /></marker>
            </defs>
            {edges.map(({ from, to, index }) => (
              <g key={from.key}>
                <line x1={from.x + from.w} x2={to.x - 1} y1={ROW_Y + 14} y2={ROW_Y + 14} stroke={FORWARD} strokeWidth={1} markerEnd="url(#reparam-fwd)" />
                {gradTo !== null && index >= gradTo && (
                  <line x1={to.x} x2={from.x + from.w + 1} y1={ROW_Y + 32} y2={ROW_Y + 32} stroke={GRAD} strokeWidth={1.25} markerEnd="url(#reparam-grad)" />
                )}
              </g>
            ))}
            {NODES.map((node) => {
              const isZ = node.key === "z";
              const stroke = isZ ? "#2563eb" : "#94a3b8";
              const title = isZ ? (direct ? "z ∼ q" : "μ + σ⊙ε") : node.title;
              const sub = isZ ? (showNumbers ? vec(z) : direct ? "뽑기 node" : "계산 node") : node.key === "par" && showNumbers ? "" : node.sub;
              return (
                <g key={node.key}>
                  <rect x={node.x} y={ROW_Y} width={node.w} height={BOX_H} rx={8} fill="none" stroke={stroke} strokeWidth={isZ ? 1.25 : 1} />
                  <text x={node.x + node.w / 2} y={ROW_Y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{title}</text>
                  <text x={node.x + node.w / 2} y={ROW_Y + 36} textAnchor="middle" fontSize={11} fill="#64748b">{sub}</text>
                </g>
              );
            })}
            {showNumbers && (
              <text x={NODES[1].x + NODES[1].w / 2} y={ROW_Y - 8} textAnchor="middle" fontSize={11} fill="#475569">μ={vec(MU)}, σ={vec(SIGMA)}</text>
            )}
            {direct && (
              <text x={NODES[2].x + NODES[2].w / 2} y={ROW_Y + BOX_H + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAD}>여기서 앞쪽 경로가 안 보임</text>
            )}
            {showEps && (
              <>
                <rect x={NODES[2].x} y={ROW_Y + BOX_H + 30} width={NODES[2].w} height={34} rx={8} fill="none" stroke="#16a34a" strokeWidth={1} strokeDasharray="4 3" />
                <text x={NODES[2].x + NODES[2].w / 2} y={ROW_Y + BOX_H + 44} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">ε 외부 입력</text>
                <text x={NODES[2].x + NODES[2].w / 2} y={ROW_Y + BOX_H + 58} textAnchor="middle" fontSize={11} fill="#16a34a">{showNumbers ? vec(eps) : "N(0, I)"}</text>
                <line x1={NODES[2].x + NODES[2].w / 2} x2={NODES[2].x + NODES[2].w / 2} y1={ROW_Y + BOX_H + 30} y2={ROW_Y + BOX_H + 1} stroke="#16a34a" strokeWidth={1} markerEnd="url(#reparam-fwd)" />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
