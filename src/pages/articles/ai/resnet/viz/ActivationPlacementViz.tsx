import SceneShell from "./SceneShell";

/**
 * 본문 대응: #architecture "Post-activation과 pre-activation은 activation 위치가 다르다" + v1/v2 AlgorithmBlock.
 * v1: out = ReLU(h + shortcut(x)) → 두 block을 쌓으면 x_{l+2} = ReLU(ReLU(x_l + F_l) + F_{l+1})
 * v2: out = h + shortcut(x)       → x_{l+2} = x_l + F_l(x_l) + F_{l+1}(x_{l+1}) (SkipConnection 절의 합 전개)
 */
const SCENES = [
  { label: "v1 · post-activation", summary: "더한 뒤 ReLU", note: "v1은 residual과 shortcut을 더한 다음 ReLU를 적용합니다. 그래서 xₗ에서 출발한 shortcut 경로도 block마다 ReLU를 한 번씩 지나며, 두 block을 쌓으면 xₗ₊₂=ReLU(ReLU(xₗ+Fₗ)+Fₗ₊₁)가 됩니다." },
  { label: "v2 · pre-activation", summary: "더한 뒤 아무 연산 없음", note: "v2는 BN과 ReLU를 conv 앞, 즉 residual branch 안으로 옮겼습니다. Addition 뒤에는 연산이 없어 shortcut 경로가 block을 지나도 바뀌지 않고, xₗ₊₂=xₗ+Fₗ(xₗ)+Fₗ₊₁(xₗ₊₁)로 바로 전개됩니다." },
] as const;

const BRANCH = [
  ["conv·BN·ReLU", "conv·BN"],
  ["BN·ReLU·conv", "BN·ReLU·conv"],
] as const;

const FORMULA: readonly string[] = ["xₗ₊₂ = ReLU(ReLU(xₗ + Fₗ) + Fₗ₊₁)", "xₗ₊₂ = xₗ + Fₗ(xₗ) + Fₗ₊₁(xₗ₊₁)"];

const LINE_Y = 112;
const STARTS: readonly number[] = [30, 182];
const NODE_LABELS: readonly string[] = ["xₗ", "xₗ₊₁", "xₗ₊₂"];
const NODE_X: readonly number[] = [16, 176, 334];

export default function ActivationPlacementViz() {
  return (
    <SceneShell
      eyebrow="Activation 위치"
      title="ReLU가 덧셈 뒤에 있느냐에 따라 shortcut 경로가 달라집니다"
      description="Residual block 두 개를 이어 붙였습니다. 위쪽 상자는 residual branch, 아래 굵은 선은 xₗ에서 출발한 shortcut 경로입니다. ReLU는 음수를 0으로 바꾸는 activation입니다."
      ariaLabel="ResNet v1과 v2에서 두 block을 지나는 shortcut 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const v1 = active === 0;
        const pathColor = v1 ? "#d97706" : "#059669";
        const [top, bottom] = v1 ? BRANCH[0] : BRANCH[1];
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${FORMULA[active]}`}>
            {STARTS.map((bx, block) => {
              const plusX = bx + 96;
              return (
                <g key={bx}>
                  <path d={`M${bx} ${LINE_Y} L${bx} 66 L${bx + 10} 66`} fill="none" stroke="#64748b" strokeWidth={1} />
                  <rect x={bx + 10} y={34} width={76} height={44} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
                  <text x={bx + 48} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{block === 0 ? "Fₗ" : "Fₗ₊₁"}</text>
                  <text x={bx + 48} y={60} textAnchor="middle" fontSize={9.5} fill="#475569">{top}</text>
                  <text x={bx + 48} y={72} textAnchor="middle" fontSize={9.5} fill="#475569">{bottom}</text>
                  <path d={`M${bx + 86} 56 L${plusX} 56 L${plusX} ${LINE_Y - 9}`} fill="none" stroke="#64748b" strokeWidth={1} />
                  <line x1={bx} x2={plusX - 9} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
                  <circle cx={plusX} cy={LINE_Y} r={9} fill="none" stroke="#475569" strokeWidth={1} />
                  <text x={plusX} y={LINE_Y + 4} textAnchor="middle" fontSize={12} fill="#475569">+</text>
                  {v1 ? (
                    <>
                      <line x1={plusX + 9} x2={plusX + 14} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
                      <rect x={plusX + 14} y={LINE_Y - 10} width={30} height={20} rx={4} fill="#ffffff" stroke="#dc2626" strokeWidth={1.25} />
                      <text x={plusX + 29} y={LINE_Y + 3.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#dc2626">ReLU</text>
                      <line x1={plusX + 44} x2={NODE_X[block + 1]} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
                    </>
                  ) : (
                    <line x1={plusX + 9} x2={NODE_X[block + 1]} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
                  )}
                </g>
              );
            })}
            <line x1={NODE_X[0]} x2={STARTS[0]} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
            <line x1={NODE_X[1]} x2={STARTS[1]} y1={LINE_Y} y2={LINE_Y} stroke={pathColor} strokeWidth={1.25} />
            {NODE_X.map((x, index) => (
              <g key={x}>
                <circle cx={x} cy={LINE_Y} r={3.5} fill={pathColor} />
                <text x={x} y={LINE_Y + 22} textAnchor="middle" fontSize={11} fill="#475569">{NODE_LABELS[index]}</text>
              </g>
            ))}
            <text x={180} y={162} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={pathColor}>
              {v1 ? "shortcut 경로가 ReLU를 2번 지남" : "shortcut 경로에 연산 0개"}
            </text>
            <text x={180} y={182} textAnchor="middle" fontSize={11} fill="#475569" fontFamily="ui-monospace, monospace">{FORMULA[active]}</text>
          </svg>
        );
      }}
    />
  );
}
