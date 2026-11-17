import SceneShell from "./SceneShell";
import StaircasePlot from "./StaircasePlot";

/**
 * 본문 대응: #fake-quant — q=Q(x;s,z), x̂=s(q−z). round·clip 뒤 곧바로 float로 복원.
 * 가정: s=0.5, z=0, q∈{−4…3}.
 * x=0.8 → 0.8/0.5=1.6 → q=2 → x̂=1.0, 오차 0.2.
 * x=2.4 → 2.4/0.5=4.8 → round 5 → clip 3 → x̂=1.5, 오차 0.9.
 */
const SCENES = [
  {
    label: "1. Quantizer가 없다면",
    summary: "x = 0.8 → 그대로 0.8",
    note: "점선은 x̂=x, 즉 입력을 그대로 넘기는 경우입니다. 이 그림에서는 scale s=0.5(code 한 칸이 나타내는 float 간격), zero-point z=0(code 0이 놓이는 자리), code q는 −4부터 3까지의 정수 8개로 둡니다(가정).",
  },
  {
    label: "2. Round: 가까운 칸으로",
    summary: "q = round(0.8 / 0.5) = round(1.6) = 2",
    note: "파란 계단이 round 결과입니다. x를 s로 나눈 1.6이 가장 가까운 정수 2로 바뀝니다. 평평한 칸 하나 안에서는 x가 조금 움직여도 같은 code가 나옵니다.",
  },
  {
    label: "3. Dequantize: 다시 float로",
    summary: "x̂ = 0.5 × (2 − 0) = 1.0 · 오차 0.2",
    note: "Code를 곧바로 float 단위로 되돌리므로 다음 operator는 여전히 float tensor를 받습니다. 다만 받는 값은 0.8이 아니라 1.0이고, 그 차이 0.2가 학습 중에 드러나는 rounding 오차입니다.",
  },
  {
    label: "4. Clip: 범위 밖은 끝 칸에",
    summary: "round(4.8) = 5 → clip 3 → x̂ = 1.5 · 오차 0.9",
    note: "x=2.4는 code 5가 필요하지만 가장 큰 code가 3이라 3으로 잘립니다. x̂는 1.5에 붙고 오차 0.9가 생깁니다. 칸 안에서 반올림만 하면 오차가 s/2=0.25를 넘지 않는 것과 비교하면 clipping 오차가 훨씬 큽니다.",
  },
] as const;

const ORANGE = "#d97706";
const BLUE = "#2563eb";
const GRAY = "#64748b";

export default function FakeQuantStaircaseViz() {
  return (
    <SceneShell
      eyebrow="Fake quantizer 한 번 통과하기"
      title="연속값 x가 계단 위 x̂로 바뀌는 과정"
      description="가로축은 입력 x, 세로축은 fake quantizer가 다음 operator에 넘기는 x̂입니다. s·z·code 범위는 그림을 위한 가정값입니다."
      ariaLabel="fake quantizer의 round, dequantize, clip을 계단 그래프로 보는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <StaircasePlot showIdentity showSteps={active >= 1} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {(px, py) => (
            <>
              {active >= 3 && (
                <>
                  <line x1={px(-3)} x2={px(3)} y1={py(1.5)} y2={py(1.5)} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
                  <text x={px(-2.9)} y={py(1.5) - 5} fontSize={10} fill={GRAY}>가장 큰 x̂ = 1.5 (q=3)</text>
                </>
              )}
              {active === 0 && <circle cx={px(0.8)} cy={py(0.8)} r={4} fill={GRAY} />}
              {active === 0 && <text x={px(0.8) + 8} y={py(0.8) + 4} fontSize={11} fill={GRAY}>x̂ = 0.8</text>}
              {active >= 1 && active <= 2 && (
                <>
                  <line x1={px(0.8)} x2={px(0.8)} y1={py(0)} y2={py(0.8)} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
                  <circle cx={px(0.8)} cy={py(0.8)} r={3} fill="#ffffff" stroke={GRAY} strokeWidth={1} />
                  <circle cx={px(0.8)} cy={py(1)} r={4} fill={BLUE} />
                  <text x={px(0.8) - 2} y={py(1) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>
                    {active === 1 ? "q = 2" : "x̂ = 1.0"}
                  </text>
                  <text x={px(0.8)} y={py(0) + 28} textAnchor="middle" fontSize={10} fill={GRAY}>x=0.8</text>
                </>
              )}
              {active === 2 && (
                <>
                  <line x1={px(0.8)} x2={px(0.8)} y1={py(0.8)} y2={py(1)} stroke={ORANGE} strokeWidth={1.25} />
                  <text x={px(0.8) + 9} y={py(0.8) + 12} fontSize={11} fontWeight={700} fill={ORANGE}>오차 0.2</text>
                </>
              )}
              {active >= 3 && (
                <>
                  <line x1={px(2.4)} x2={px(2.4)} y1={py(0)} y2={py(2.4)} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
                  <circle cx={px(2.4)} cy={py(2.4)} r={3} fill="#ffffff" stroke={GRAY} strokeWidth={1} />
                  <circle cx={px(2.4)} cy={py(1.5)} r={4} fill={BLUE} />
                  <line x1={px(2.4) + 7} x2={px(2.4) + 7} y1={py(2.4)} y2={py(1.5)} stroke={ORANGE} strokeWidth={1.25} />
                  <text x={px(2.4) + 4} y={py(2.4) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={ORANGE}>오차 0.9</text>
                  <text x={px(2.4)} y={py(0) + 28} textAnchor="middle" fontSize={10} fill={GRAY}>x=2.4</text>
                </>
              )}
            </>
          )}
        </StaircasePlot>
      )}
    />
  );
}
