import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verification Order — h, h/2, h/4 error가 기대한 convergence order로 줄어드는지 본다.
 * 관측 order p = log2(E(h) / E(h/2)).
 * 가정 1(order 2 기대): 0.08 → 0.02 → 0.005 (매번 ÷4, p = 2).
 * 가정 2(구현 이상): 0.08 → 0.04 → 0.02 (매번 ÷2, p = 1).
 */
const EXPECTED = [0.08, 0.02, 0.005] as const;
const STALLED = [0.08, 0.04, 0.02] as const;
const MESH = ["h", "h/2", "h/4"] as const;

const SCENES = [
  { label: "기대 order 2 (가정)", summary: "0.08 → 0.02 → 0.005", note: "Convergence order p는 격자 간격 h를 반으로 줄일 때 error가 2^p배 줄어드는 정도입니다. 기대 order가 2인 scheme이라고 가정하면, 해석해를 아는 문제에서 h를 반으로 줄일 때마다 error가 4분의 1이 돼야 합니다." },
  { label: "관측 order 계산", summary: "log₂(0.08 ÷ 0.02) = 2", note: "두 격자의 error 비를 밑이 2인 log로 바꾸면 관측 order가 나옵니다. h→h/2에서 0.08 ÷ 0.02 = 4, h/2→h/4에서 0.02 ÷ 0.005 = 4이므로 두 구간 모두 log₂4 = 2로 기대와 같습니다." },
  { label: "Order 1로 나오면 (가정)", summary: "log₂(0.08 ÷ 0.04) = 1", note: "같은 문제에서 error가 0.08 → 0.04 → 0.02로만 줄었다고 가정합니다. 비는 매번 2라 관측 order는 1이고 기대한 2와 다릅니다. Error가 줄고 있어도 order가 맞지 않으면 이 검사를 통과한 것이 아닙니다." },
] as const;

const W = 360;
const BASE = 140;
const TOP = 26;
const SCALE = (BASE - TOP) / 0.08;
const BAR = 54;
const xAt = (index: number) => 52 + index * 104;

export default function ConvergenceOrderViz() {
  return (
    <SceneShell
      eyebrow="Refinement order 검사"
      title="격자를 반으로 줄일 때 error가 몇 배 줄어드는지 봅니다"
      description="막대 하나가 한 격자에서 해석해와 비교한 error입니다. 막대 사이의 숫자는 다음 격자로 갈 때 error가 줄어든 배수입니다."
      note="Error 값 0.08·0.02·0.005·0.04와 기대 order 2는 설명용 가정입니다. 실제 기대 order는 선택한 scheme에 따릅니다."
      ariaLabel="h, h/2, h/4 격자에서 error가 줄어드는 배수로 convergence order를 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const values: readonly number[] = active === 2 ? STALLED : EXPECTED;
        const ghost: readonly number[] = EXPECTED;
        const color = active === 2 ? "#dc2626" : "#2563eb";
        return (
          <svg viewBox={`0 0 ${W} 176`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {MESH.map((mesh, index) => {
              const height = values[index] * SCALE;
              return (
                <g key={mesh}>
                  {active === 2 && (
                    <rect x={xAt(index)} y={BASE - ghost[index] * SCALE} width={BAR} height={ghost[index] * SCALE} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  )}
                  <rect x={xAt(index)} y={BASE - height} width={BAR} height={height} fill={color} opacity={0.75} />
                  <text x={xAt(index) + BAR / 2} y={BASE - height - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{values[index]}</text>
                  <text x={xAt(index) + BAR / 2} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#334155">{mesh}</text>
                  {index < 2 && (
                    <text x={xAt(index) + BAR + 25} y={BASE - 36} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 0 ? "#64748b" : color}>
                      {`÷${Math.round(values[index] / values[index + 1])}`}
                    </text>
                  )}
                  {index < 2 && active >= 1 && (
                    <text x={xAt(index) + BAR + 25} y={BASE - 20} textAnchor="middle" fontSize={10} fill={color}>
                      {`p=${Math.round(Math.log2(values[index] / values[index + 1]))}`}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={30} x2={W - 30} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {active === 2 && <text x={W - 30} y={BASE + 32} textAnchor="end" fontSize={10} fill="#64748b">점선 = 기대 order 2의 error</text>}
          </svg>
        );
      }}
    />
  );
}
