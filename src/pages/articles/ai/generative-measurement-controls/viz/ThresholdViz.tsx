import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: IdentityMetric.tsx — 실측 남남 45쌍의 분포와 두 임계값 */
const SCENES = ["두 단계", "남남 45쌍", "임계 0.28", "임계 0.40"] as const;
const NOTES = [
  "탐지기가 상자를 찾고 인식기가 벡터를 만듭니다. 앞이 실패하면 숫자가 나오지 않습니다.",
  "명백히 다른 여섯 인물을 세 스타일로 만들어 쌍마다 쟀습니다. 전부 남남 쌍이므로 넘으면 오판입니다.",
  "근거 없이 쓰던 값입니다. 45쌍 중 6쌍이 임계를 넘어 같은 사람으로 오판됐습니다.",
  "이 표본에서는 넘는 쌍이 없습니다. 최댓값 0.390과의 여유는 0.01뿐이라 넉넉하지는 않습니다.",
] as const;

const DETECT = "#6366f1";
const RECOG = "#8b5cf6";
const OVER = "#ef4444";
const UNDER = "#10b981";
const LINE = "#f59e0b";
const MUTED = "#94a3b8";

/** 실측값 — 여섯 인물 × 세 스타일, 스타일마다 15쌍 (2026-09-11) */
const PAIRS: Record<string, number[]> = {
  사진: [0.003, 0.064, 0.067, 0.08, 0.083, 0.092, 0.093, 0.115, 0.13, 0.142, 0.162, 0.182, 0.205, 0.212, 0.351],
  유화: [0.013, 0.033, 0.083, 0.117, 0.138, 0.18, 0.183, 0.186, 0.191, 0.213, 0.217, 0.274, 0.286, 0.344, 0.39],
  "3D 렌더": [0.06, 0.073, 0.101, 0.103, 0.109, 0.138, 0.16, 0.166, 0.181, 0.21, 0.236, 0.248, 0.269, 0.286, 0.302],
};
const ROWS = Object.keys(PAIRS);
/** 코사인 0~0.5 구간을 x 60~440 에 대응 */
const X = (c: number) => 60 + (c / 0.5) * 380;

export default function ThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const tau = step === 2 ? 0.28 : step === 3 ? 0.4 : null;
  const over = tau === null ? 0 : ROWS.reduce((s, r) => s + PAIRS[r].filter((v) => v > tau).length, 0);
  return (
    <VizFrame
      eyebrow="얼굴 심판"
      title="임계값은 남남 쌍이 어디까지 올라가는지가 정합니다"
      description="실측한 45쌍을 축에 그대로 찍고 두 임계값을 그어 봅니다."
      note="점은 2026-09-11 실측값이며 한 장비·한 모델 조합에서 얻은 45쌍입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="얼굴 임베딩 임계값과 남남 쌍 분포"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  얼굴 유사도는 한 모델이 아니라 두 모델이 이어 붙은 것입니다
                </text>
                <rect x={24} y={56} width={120} height={40} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={84} y={80} textAnchor="middle" fontSize={9} fill={MUTED}>
                  입력 이미지
                </text>
                <line x1={144} y1={76} x2={172} y2={76} stroke={MUTED} strokeWidth={1} />
                <rect x={172} y={56} width={120} height={40} fill={DETECT} fillOpacity={0.14} stroke={DETECT} strokeWidth={1.25} />
                <text x={232} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={DETECT}>
                  탐지기
                </text>
                <text x={232} y={88} textAnchor="middle" fontSize={8} fill={DETECT}>
                  상자 · 기준점 · 정렬
                </text>
                <line x1={292} y1={76} x2={320} y2={76} stroke={MUTED} strokeWidth={1} />
                <rect x={320} y={56} width={130} height={40} fill={RECOG} fillOpacity={0.14} stroke={RECOG} strokeWidth={1.25} />
                <text x={385} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={RECOG}>
                  인식기
                </text>
                <text x={385} y={88} textAnchor="middle" fontSize={8} fill={RECOG}>
                  단위 길이 512차원 벡터
                </text>
                <text x={24} y={128} fontSize={8} fill={OVER}>
                  탐지 실패는 숫자가 나오지 않는 것인데, 결과 표에서는 빈칸이나 0으로 보입니다.
                </text>
                <text x={24} y={146} fontSize={8} fill={MUTED}>
                  그래서 "유사도가 낮다"와 구분되지 않습니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={RECOG}>
                  벡터가 단위 길이라 내적이 곧 코사인이고 범위는 −1에서 1입니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  서로 다른 여섯 인물 · 스타일마다 15쌍 · 전부 남남 쌍
                </text>
                <line x1={60} y1={150} x2={440} y2={150} stroke={MUTED} strokeWidth={1} />
                {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((t) => (
                  <g key={t}>
                    <line x1={X(t)} y1={150} x2={X(t)} y2={155} stroke={MUTED} strokeWidth={1} />
                    <text x={X(t)} y={167} textAnchor="middle" fontSize={8} fill={MUTED}>
                      {t.toFixed(1)}
                    </text>
                  </g>
                ))}
                {ROWS.map((r, ri) => (
                  <g key={r}>
                    <text x={54} y={51 + ri * 32} textAnchor="end" fontSize={8} fill={MUTED}>
                      {r}
                    </text>
                    <line x1={60} y1={47 + ri * 32} x2={440} y2={47 + ri * 32} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" opacity={0.4} />
                    {PAIRS[r].map((v, vi) => {
                      const hot = tau !== null && v > tau;
                      return (
                        <circle
                          key={vi}
                          cx={X(v)}
                          cy={47 + ri * 32}
                          r={hot ? 4.5 : 3.5}
                          fill={tau === null ? DETECT : hot ? OVER : UNDER}
                          fillOpacity={hot ? 0.5 : 0.28}
                          stroke={tau === null ? DETECT : hot ? OVER : UNDER}
                          strokeWidth={1}
                        />
                      );
                    })}
                  </g>
                ))}
                {tau !== null && (
                  <g>
                    <line x1={X(tau)} y1={30} x2={X(tau)} y2={150} stroke={LINE} strokeWidth={1.25} />
                    <text x={X(tau)} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={LINE}>
                      {tau.toFixed(2)}
                    </text>
                  </g>
                )}
                <text x={24} y={186} fontSize={9} fontWeight={700} fill={tau === null ? MUTED : over > 0 ? OVER : UNDER}>
                  {tau === null
                    ? "점 하나가 남남 한 쌍입니다. 오른쪽으로 갈수록 같은 사람처럼 보인 것입니다."
                    : `임계를 넘은 쌍 ${over} / 45 — ${over > 0 ? "전부 오판입니다" : "이 표본에서는 오판이 없습니다"}`}
                </text>
                {step === 3 && (
                  <text x={24} y={200} fontSize={8} fill={MUTED}>
                    최댓값 0.390과의 여유는 0.01뿐이라 표본이 커지면 달라질 수 있습니다.
                  </text>
                )}
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
