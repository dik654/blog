import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·systematic-risk — 총위험이 두 조각으로 갈리고 보상은 한쪽에만 */
const SCENES = [
  "한 종목만 들고 있을 때",
  "여럿으로 나눠 담을 때",
  "끝내 남는 조각",
  "보상은 남는 조각에만 붙는다",
] as const;

const NOTES = [
  "한 종목의 변동에는 그 회사에만 생기는 일과 모두에게 함께 오는 일이 섞여 있습니다.",
  "종목을 늘리면 회사마다 다른 방향으로 생기는 일들이 서로 상쇄되며 사라집니다.",
  "아무리 늘려도 모두에게 함께 오는 부분은 남습니다. 이 바닥이 평균 공분산입니다.",
  "없앨 수 있는 위험을 지고 있는 것은 선택이므로 대가가 없습니다. 요구 수익률은 남는 조각에만 비례합니다.",
] as const;

const IDIO = "#94a3b8";
const SYS = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

/** 평균 표준편차 30%, 평균 상관 0.3 기준의 예시 */
const AVG_SD = 0.3;
const AVG_RHO = 0.3;

function portfolioSd(n: number) {
  const variance = AVG_SD * AVG_SD;
  const cov = AVG_RHO * variance;
  return Math.sqrt(variance / n + ((n - 1) / n) * cov);
}

const FLOOR = Math.sqrt(AVG_RHO) * AVG_SD;
const COUNTS = [1, 5, 30];

export default function RiskDecompositionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;
  const n = COUNTS[Math.min(step, 2)];
  const total = portfolioSd(n);
  const scale = 380;

  return (
    <VizFrame
      eyebrow="위험의 분해"
      title="총위험은 나눠서 없앨 수 있는 것과 없는 것으로 갈립니다"
      description="종목 수를 늘리면 앞 조각만 사라지고 뒤 조각은 바닥으로 남습니다."
      note="평균 표준편차 30%, 평균 상관 0.3을 가정한 예시입니다. 막대 길이는 표준편차이고, 회색 구간은 분산을 쪼갠 값이 아니라 총 표준편차와 바닥 사이의 차이(%p)라는 점에 주의하세요. 분해 자체는 본문 식처럼 분산 단위에서 이루어집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="분산 가능한 위험과 체계적 위험"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={24} y={28} fontSize={10} fontWeight={700} fill={MUTED}>
                종목 {n}개를 균등하게 담았을 때의 표준편차 {(total * 100).toFixed(1)}%
              </text>

              <rect x={24} y={44} width={FLOOR * scale} height={30} fill={SYS} fillOpacity={0.18} stroke={SYS} strokeWidth={1} />
              <text x={24 + (FLOOR * scale) / 2} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill={SYS}>
                체계적 {Math.round(FLOOR * 100)}%
              </text>

              {(total - FLOOR) * scale > 46 && (
                <g>
                  <rect
                    x={24 + FLOOR * scale}
                    y={44}
                    width={(total - FLOOR) * scale}
                    height={30}
                    fill={IDIO}
                    fillOpacity={0.14}
                    stroke={IDIO}
                    strokeWidth={1}
                  />
                  <text
                    x={24 + (FLOOR + (total - FLOOR) / 2) * scale}
                    y={63}
                    textAnchor="middle"
                    fontSize={9}
                    fill={IDIO}
                  >
                    분산 가능 {Math.round((total - FLOOR) * 100)}%p
                  </text>
                </g>
              )}

              <line x1={24 + FLOOR * scale} y1={38} x2={24 + FLOOR * scale} y2={92} stroke={SYS} strokeWidth={1} strokeDasharray="4 3" />
              <text x={24 + FLOOR * scale + 6} y={104} fontSize={8} fill={SYS}>
                아무리 늘려도 여기까지
              </text>

              {step === 3 && (
                <g>
                  <rect x={24} y={124} width={FLOOR * scale} height={26} fill={OK} fillOpacity={0.16} stroke={OK} strokeWidth={1} />
                  <text x={24 + (FLOOR * scale) / 2} y={141} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    보상이 붙는 구간
                  </text>
                  <rect
                    x={24 + FLOOR * scale}
                    y={124}
                    width={(portfolioSd(1) - FLOOR) * scale}
                    height={26}
                    fill="none"
                    stroke={MUTED}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={24 + (FLOOR + (portfolioSd(1) - FLOOR) / 2) * scale}
                    y={141}
                    textAnchor="middle"
                    fontSize={9}
                    fill={MUTED}
                  >
                    보상 없음
                  </text>
                  <text x={24} y={172} fontSize={9} fill={MUTED}>
                    없앨 수 있는 위험을 계속 지는 것은 선택이지 필연이 아닙니다
                  </text>
                </g>
              )}

              {step < 3 && (
                <text x={24} y={172} fontSize={9} fill={MUTED}>
                  {step === 0
                    ? "둘이 섞여 있어 겉으로는 구분되지 않습니다"
                    : step === 1
                      ? "다섯 개만 담아도 회색 조각이 크게 줄어듭니다"
                      : "서른 개에서는 회색이 거의 남지 않습니다"}
                </text>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
