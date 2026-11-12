import SceneShell from "../../cross-validation/viz/CvSceneShell";

/**
 * 본문 대응: #small-case, #pooling — 100행을 첫 20행과 나머지 80행으로 나눈 사례(가정).
 * 모델 1: 80행 학습 → 20행 예측, 평균 0.2, 합 4.
 * 모델 2: 20행 학습 → 80행 예측, 평균 0.4, 합 32.
 * 모은 뒤 (4 + 32) / (20 + 80) = 0.36.
 */
const X0 = 20;
const W = 320;
const PER_ROW = W / 100;
const SMALL_W = 20 * PER_ROW;
const BIG_W = 80 * PER_ROW;
const BAR_Y = 74;
const BAR_H = 30;

const SCENES = [
  { label: "모델 1", summary: "80행으로 학습 → 20행 예측", note: "첫 20행을 빼 두고 나머지 80행으로 학습한 모델이 빼 둔 20행만 예측합니다. 평균 손실 0.2이면 20행의 손실 합은 4입니다." },
  { label: "모델 2", summary: "20행으로 학습 → 80행 예측", note: "자리를 바꿉니다. 이번에는 20행으로 학습한 모델이 뒤 80행을 예측합니다. 평균 손실 0.4이면 손실 합은 32입니다." },
  { label: "원래 자리에 모으기", summary: "(4 + 32) / 100 = 0.36", note: "100행 모두 자신을 배우지 않은 모델의 답을 하나씩 갖습니다. 손실 합 36을 행 수 100으로 나누면 0.36이고, 두 평균 0.2와 0.4를 그냥 평균한 0.30과 다릅니다." },
];

type Role = "train" | "test" | "idle";

function Segment({ x, w, role, top, bottom }: { x: number; w: number; role: Role; top: string; bottom: string }) {
  const fill = role === "test" ? "#2563eb" : "#94a3b8";
  return (
    <g>
      <rect x={x} y={BAR_Y} width={w} height={BAR_H} rx={3} fill={fill} fillOpacity={role === "test" ? 0.8 : 0.35} stroke={fill} strokeWidth={1} />
      <text x={x + w / 2} y={BAR_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={role === "test" ? "#ffffff" : "#334155"}>
        {role === "test" ? "예측" : "학습"}
      </text>
      <text x={x + w / 2} y={BAR_Y - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{top}</text>
      {bottom && (
        <text x={x + w / 2} y={BAR_Y + BAR_H + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{bottom}</text>
      )}
    </g>
  );
}

export default function OofSwapViz() {
  return (
    <SceneShell
      eyebrow="자리 바꾸기"
      title="두 모델이 서로 빼 둔 행을 예측해 100행을 채웁니다"
      description="막대 길이가 행 수입니다. 100행을 20행과 80행으로 나누고 평균 손실 0.2와 0.4를 둔 가정 사례입니다."
      ariaLabel="20행과 80행을 번갈아 빼 두고 예측해 손실 합 36, 전체 평균 0.36을 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const small: Role = active === 0 || active === 2 ? "test" : "train";
        const big: Role = active === 1 || active === 2 ? "test" : "train";
        return (
          <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={22} fontSize={10} fill="#64748b">행 1</text>
            <text x={X0 + W} y={22} textAnchor="end" fontSize={10} fill="#64748b">행 100</text>
            <Segment x={X0} w={SMALL_W} role={small} top="첫 20행" bottom={small === "test" ? (active === 2 ? "모델 1의 답 · 합 4" : "평균 0.2 · 합 4") : ""} />
            <Segment x={X0 + SMALL_W} w={BIG_W} role={big} top="나머지 80행" bottom={big === "test" ? (active === 2 ? "모델 2의 답 · 합 32" : "평균 0.4 · 합 32") : ""} />
            {active === 2 && (
              <text x={X0 + W} y={BAR_Y + BAR_H + 44} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">
                (4 + 32) / (20 + 80) = 0.36
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
