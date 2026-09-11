import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: BrokenNotDifferent.tsx — 최대 강도의 열화와 유일하게 살아남은 신호 */
const SCENES = ["최대 강도의 대조군", "무엇이 그려졌나", "낮은 값의 정체", "살아남은 신호"] as const;
const NOTES = [
  "네 장 중 세 장이 얼굴로 검출조차 되지 않았습니다. 계산이 시작되지 않은 것입니다.",
  "깊이 실루엣을 문자 그대로 받아 머리를 공으로 그리고 눈 홈을 안경으로 렌더했습니다.",
  "그 지점의 낮은 유사도는 \"다른 사람\"이 아니라 \"망가진 이미지\"였습니다.",
  "가장 극단적인 형태 하나만 시드 노이즈 범위를 벗어납니다.",
] as const;

const BAD = "#ef4444";
const OK = "#10b981";
const MID = "#f59e0b";
const MUTED = "#94a3b8";

export default function BrokenViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="열화"
      title="지표가 가장 좋아 보이던 끝점이 사용 불가 구간이었습니다"
      description="탐지 실패를 낮은 유사도로 읽으면 이 구간을 최적점으로 고릅니다."
      note="탐지 실패와 낮은 유사도의 구분은 별도 글이 소유합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="최대 강도 구간의 열화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  강도 1.00 · 같은 깊이 맵에 시드만 바꾼 네 장
                </text>
                {[0, 1, 2, 3].map((i) => {
                  const dead = i < 3;
                  return (
                    <g key={i}>
                      <rect x={24 + i * 112} y={44} width={100} height={62} fill={dead ? BAD : OK} fillOpacity={0.12} stroke={dead ? BAD : OK} strokeWidth={1.25} />
                      <text x={74 + i * 112} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={dead ? BAD : OK}>
                        시드 {i + 1}
                      </text>
                      <text x={74 + i * 112} y={90} textAnchor="middle" fontSize={8} fontWeight={700} fill={dead ? BAD : OK}>
                        {dead ? "얼굴 미검출" : "검출됨"}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={144} fontSize={9} fontWeight={700} fill={BAD}>
                  유사도가 낮은 것이 아니라 계산이 시작되지 않았습니다.
                </text>
                <text x={24} y={166} fontSize={8} fill={MUTED}>
                  결과 표에서는 이것이 빈칸이나 0으로 보여 "아주 다름"과 구분되지 않습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  모델이 깊이 실루엣을 문자 그대로 받아들였습니다
                </text>
                <circle cx={130} cy={100} r={40} fill={BAD} fillOpacity={0.15} stroke={BAD} strokeWidth={1.25} />
                <ellipse cx={116} cy={92} rx={11} ry={7} fill="none" stroke={BAD} strokeWidth={1.25} />
                <ellipse cx={146} cy={92} rx={11} ry={7} fill="none" stroke={BAD} strokeWidth={1.25} />
                <line x1={127} y1={92} x2={135} y2={92} stroke={BAD} strokeWidth={1.25} />
                <text x={130} y={160} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  공 모양 머리 · 안경
                </text>
                <text x={210} y={86} fontSize={9} fontWeight={700} fill={BAD}>
                  머리를 공으로 그리고
                </text>
                <text x={210} y={106} fontSize={9} fontWeight={700} fill={BAD}>
                  눈 홈을 안경으로 렌더했습니다
                </text>
                <text x={210} y={132} fontSize={8} fill={MUTED}>
                  제어 신호를 형태 힌트가 아니라 그려야 할 대상으로 받은 것입니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  강도 1.00의 낮은 유사도 0.229는 무엇이었나
                </text>
                <rect x={24} y={52} width={200} height={56} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={124} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  읽고 싶었던 것
                </text>
                <text x={124} y={94} textAnchor="middle" fontSize={9} fill={MUTED}>
                  "네 사람이 서로 다르다"
                </text>
                <rect x={256} y={52} width={200} height={56} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1.25} />
                <text x={356} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  실제
                </text>
                <text x={356} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  상당 부분이 망가진 이미지
                </text>
                <text x={24} y={146} fontSize={9} fontWeight={700} fill={BAD}>
                  낮은 유사도를 성공 신호로 읽으면 결과가 무너지는 쪽이 항상 이깁니다.
                </text>
                <text x={24} y={168} fontSize={8} fill={MUTED}>
                  단조 감소 그래프에서 가장 좋아 보이던 끝점이 사용 불가 구간이었습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  세로 대 가로 비 · 시드 노이즈 범위와 비교
                </text>
                <line x1={60} y1={120} x2={440} y2={120} stroke={MUTED} strokeWidth={1} />
                {[1.2, 1.35, 1.5, 1.65].map((t) => (
                  <g key={t}>
                    <line x1={60 + ((t - 1.2) / 0.5) * 380} y1={120} x2={60 + ((t - 1.2) / 0.5) * 380} y2={125} stroke={MUTED} strokeWidth={1} />
                    <text x={60 + ((t - 1.2) / 0.5) * 380} y={138} textAnchor="middle" fontSize={8} fill={MUTED}>
                      {t.toFixed(2)}
                    </text>
                  </g>
                ))}
                <rect
                  x={60 + ((1.215 - 1.2) / 0.5) * 380}
                  y={70}
                  width={((1.518 - 1.215) / 0.5) * 380}
                  height={44}
                  fill={MUTED}
                  fillOpacity={0.14}
                  stroke={MUTED}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text x={60 + ((1.37 - 1.2) / 0.5) * 380} y={62} textAnchor="middle" fontSize={8} fill={MUTED}>
                  시드 노이즈 범위 1.215 ~ 1.518
                </text>
                <circle cx={60 + ((1.644 - 1.2) / 0.5) * 380} cy={92} r={6} fill={OK} fillOpacity={0.5} stroke={OK} strokeWidth={1.25} />
                <text x={60 + ((1.644 - 1.2) / 0.5) * 380} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill={OK}>
                  1.644
                </text>
                <text x={24} y={168} fontSize={9} fontWeight={700} fill={MID}>
                  가장 극단적인 형태 하나만 노이즈 범위를 벗어납니다.
                </text>
                <text x={24} y={190} fontSize={8} fill={MUTED}>
                  극단적인 형태만 살아남고 미묘한 차이는 전부 흡수된다는 앞 절의 관찰과 같은 방향입니다.
                </text>
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
