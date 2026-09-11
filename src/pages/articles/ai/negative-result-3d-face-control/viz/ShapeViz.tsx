import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ShapeSurvival.tsx — 형태 신호 감쇠와 정체성 측정 */
const SCENES = ["조잡한 쪽이 더 보존", "신호 감쇠", "정체성 측정", "판정 정정"] as const;
const NOTES = [
  "극단적인 실루엣은 모델에게 선택지를 주지 않습니다. 다듬어진 형태는 사전이 개입합니다.",
  "3차원에서 64.8퍼센트 벌려 놓은 것이 출력에서 1.6퍼센트로 남습니다.",
  "여섯 쌍의 최솟값이 0.728입니다. 판정 임계값의 두 배 근처입니다.",
  "처음에 \"부분 성공\"이라고 적은 것은 후한 판정이었습니다.",
] as const;

const IN = "#6366f1";
const OUT = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

/** 실측 — 여섯 쌍 정체성 */
const PAIRS = [
  { p: "A′–B′", v: 0.728 },
  { p: "A′–C′", v: 0.859 },
  { p: "A′–D′", v: 0.91 },
  { p: "B′–C′", v: 0.789 },
  { p: "B′–D′", v: 0.743 },
  { p: "C′–D′", v: 0.886 },
];

export default function ShapeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="감쇠"
      title="벌려 놓은 형태 차이가 출력에 얼마나 남는가"
      description="형태 지표와 얼굴 임베딩이 같은 결론을 냅니다."
      note="네 얼굴 표본이라 편차 추정이 거칠고 자릿수를 읽는 용도입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="형태 신호 감쇠와 정체성"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={46} width={200} height={70} fill={IN} fillOpacity={0.1} stroke={IN} strokeWidth={1.25} />
                <text x={124} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={IN}>
                  1차 · 조립식
                </text>
                <text x={124} y={86} textAnchor="middle" fontSize={8} fill={OK}>
                  실루엣과 비율이 살아남음
                </text>
                <text x={124} y={104} textAnchor="middle" fontSize={8} fill={OUT}>
                  턱 타원체가 콧수염으로 복사
                </text>
                <rect x={256} y={46} width={200} height={70} fill={IN} fillOpacity={0.1} stroke={IN} strokeWidth={1.25} />
                <text x={356} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={IN}>
                  2차 · 단일 두상
                </text>
                <text x={356} y={86} textAnchor="middle" fontSize={8} fill={OK}>
                  눈두덩·코·입이 깨끗하게 보임
                </text>
                <text x={356} y={104} textAnchor="middle" fontSize={8} fill={OUT}>
                  네 결과가 서로 수렴
                </text>
                <text x={24} y={150} fontSize={9} fontWeight={700} fill={OUT}>
                  훨씬 조잡했던 쪽이 형태를 더 잘 보존했습니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  극단적인 실루엣은 모델에게 선택지를 주지 않고, 다듬어진 형태는 사전이 개입할 여지를 줍니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  네 얼굴의 폭 대 높이 비 편차
                </text>
                <text x={100} y={62} textAnchor="end" fontSize={9} fontWeight={700} fill={IN}>
                  3차원 입력
                </text>
                <rect x={110} y={48} width={(64.8 / 70) * 300} height={20} fill={IN} fillOpacity={0.3} stroke={IN} strokeWidth={1} />
                <text x={110 + (64.8 / 70) * 300 + 8} y={63} fontSize={10} fontWeight={700} fill={IN}>
                  64.8%
                </text>
                <text x={100} y={106} textAnchor="end" fontSize={9} fontWeight={700} fill={OUT}>
                  출력
                </text>
                <rect x={110} y={92} width={Math.max(3, (1.6 / 70) * 300)} height={20} fill={OUT} fillOpacity={0.3} stroke={OUT} strokeWidth={1} />
                <text x={128} y={107} fontSize={10} fontWeight={700} fill={OUT}>
                  1.6%
                </text>
                <text x={24} y={148} fontSize={10} fontWeight={700} fill={OUT}>
                  기하 변화의 약 97퍼센트가 사라집니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  조금 약하게 전달하는 것이 아니라 사실상 전달하지 못합니다.
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  결과 네 장의 여섯 쌍 정체성
                </text>
                <line x1={110} y1={34} x2={110} y2={150} stroke={MUTED} strokeWidth={1} />
                {PAIRS.map((r, i) => (
                  <g key={r.p}>
                    <text x={100} y={50 + i * 20} textAnchor="end" fontSize={8} fill={MUTED}>
                      {r.p}
                    </text>
                    <rect x={110} y={40 + i * 20} width={r.v * 300} height={13} fill={OUT} fillOpacity={0.28} stroke={OUT} strokeWidth={1} />
                    <text x={110 + r.v * 300 + 6} y={50 + i * 20} fontSize={8} fontWeight={700} fill={OUT}>
                      {r.v.toFixed(3)}
                    </text>
                  </g>
                ))}
                <line x1={110 + 0.4 * 300} y1={34} x2={110 + 0.4 * 300} y2={160} stroke={OK} strokeWidth={1.25} strokeDasharray="3 3" />
                <text x={110 + 0.4 * 300} y={172} textAnchor="middle" fontSize={8} fill={OK}>
                  임계 0.40
                </text>
                {step === 2 && (
                  <text x={24} y={192} fontSize={8} fontWeight={700} fill={OUT}>
                    최솟값 0.728 — 얼굴 인식 시스템에 넣으면 넷 다 같은 사람으로 등록됩니다.
                  </text>
                )}
                {step === 3 && (
                  <text x={24} y={192} fontSize={8} fontWeight={700} fill={OUT}>
                    사전에 세운 합격 기준은 넷이 모두 구분되는 것이었고 여기에 명확히 미달합니다.
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
