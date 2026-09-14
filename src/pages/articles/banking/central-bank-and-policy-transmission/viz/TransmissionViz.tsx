import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: transmission — 한 점에서 여러 경로로 갈라져 시차를 두고 닿는다 */
const SCENES = [
  "고정된 점은 하나뿐이다",
  "기대가 곡선 전체를 끌어올린다",
  "경로가 넷으로 갈라진다",
  "도착 시각이 서로 다르다",
] as const;

const NOTES = [
  "중앙은행이 직접 정하는 것은 은행 간 하루짜리 금리 하나입니다.",
  "긴 금리는 앞으로의 단기금리 기대 평균에 기간 프리미엄을 더한 값이라, 말 한마디로도 움직입니다.",
  "같은 변화가 대출금리·자산가격·환율·기대라는 서로 다른 경로로 동시에 퍼집니다.",
  "경로마다 속도가 달라 효과가 한 번에 오지 않으므로, 정책은 늘 예측 위에서 이루어집니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const MUTED = "#94a3b8";

const PATHS = [
  { label: "은행 대출금리", y: 40, lag: "수개월" },
  { label: "자산 가격", y: 74, lag: "즉시~수주" },
  { label: "환율", y: 108, lag: "즉시" },
  { label: "기대 인플레이션", y: 142, lag: "수개월~수년" },
];

export default function TransmissionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="파급 경로"
      title="한 점의 변화가 서로 다른 속도로 여러 곳에 닿습니다"
      description="직접 정하는 것은 하나지만, 기대를 거쳐 곡선 전체와 실물로 퍼집니다."
      note="도착 시각은 일반적으로 보고되는 순서를 개념적으로 표시한 것이며 특정 국가·시기의 추정치가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="통화정책 파급 경로"
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
              <rect x={20} y={80} width={92} height={40} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeWidth={1} />
              <text x={66} y={97} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                정책금리
              </text>
              <text x={66} y={111} textAnchor="middle" fontSize={8} fill={MUTED}>
                하루짜리 한 점
              </text>

              {step === 1 && (
                <g>
                  <text x={140} y={54} fontSize={9} fontWeight={700} fill={OK}>
                    기대 경로
                  </text>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <g key={index}>
                      <rect
                        x={140 + index * 56}
                        y={96 - index * 9}
                        width={44}
                        height={18}
                        fill={OK}
                        fillOpacity={0.12}
                        stroke={OK}
                        strokeWidth={1}
                      />
                      <text x={162 + index * 56} y={109 - index * 9} textAnchor="middle" fontSize={8} fill={OK}>
                        {index === 0 ? "1일" : `${index * 2}년`}
                      </text>
                    </g>
                  ))}
                  <text x={140} y={150} fontSize={8} fill={MUTED}>
                    긴 금리 = 앞으로의 단기금리 기대 평균 + 기간 프리미엄
                  </text>
                </g>
              )}

              {step >= 2 &&
                PATHS.map((path) => (
                  <g key={path.label}>
                    <line x1={112} y1={100} x2={196} y2={path.y + 12} stroke={OK} strokeWidth={1} />
                    <rect x={198} y={path.y} width={116} height={24} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                    <text x={256} y={path.y + 16} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                      {path.label}
                    </text>
                    {step === 3 && (
                      <g>
                        <line x1={314} y1={path.y + 12} x2={360} y2={path.y + 12} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                        <text x={364} y={path.y + 16} fontSize={8} fill={MUTED}>
                          {path.lag}
                        </text>
                      </g>
                    )}
                  </g>
                ))}

              {step === 3 && (
                <text x={196} y={186} fontSize={9} fill={MUTED}>
                  도착이 엇갈리므로 오늘의 물가가 아니라 도착 시점의 상태를 겨냥해야 합니다
                </text>
              )}

              {step === 0 && (
                <text x={140} y={100} fontSize={9} fill={MUTED}>
                  나머지 금리는 아직 아무것도 정해지지 않았습니다
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
