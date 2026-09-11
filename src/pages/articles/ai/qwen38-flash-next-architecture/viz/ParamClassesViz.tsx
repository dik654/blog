import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ParamClasses.tsx — 체크포인트 180B를 세 묶음으로 나누는 회계 */
const SCENES = ["체크포인트 180B", "세 묶음으로 분해", "층 하나의 expert", "토큰이 지나는 11개"] as const;

const NOTES = [
  "공개 가중치 색인의 전체 바이트를 BF16으로 나누면 1,800억 개입니다.",
  "backbone 125.5B, n-gram 표 51.2B, 예측 모듈이 나머지입니다. 세 묶음은 놓이는 자리가 다릅니다.",
  "층마다 expert 512개가 있고 하나가 491만 개입니다. 층당 25.2억, 48층이면 1,208억 개입니다.",
  "토큰 하나는 라우팅된 10개와 공유 1개만 지납니다. 층당 5,407만 개로 전체의 47분의 1입니다.",
] as const;

const BACKBONE = "#6366f1";
const TABLE = "#f59e0b";
const MTP = "#8b5cf6";
const ACTIVE = "#10b981";
const MUTED = "#94a3b8";

export default function ParamClassesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="파라미터 회계"
      title="같은 모델의 세 숫자는 서로 다른 대상을 셉니다"
      description="총량과 활성량을 한 막대에 겹쳐 그리지 않고 단계별로 분리했습니다."
      note="공개 config와 reference 구현의 텐서 모양으로 센 논리적 개수입니다. 양자화 후 실제 메모리와는 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="파라미터 묶음 분해"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={70} width={432} height={44} fill={BACKBONE} fillOpacity={0.12} stroke={BACKBONE} strokeWidth={1.25} />
                <text x={240} y={90} textAnchor="middle" fontSize={12} fontWeight={700} fill={BACKBONE}>
                  359,999,963,128 바이트 · BF16
                </text>
                <text x={240} y={106} textAnchor="middle" fontSize={10} fill={MUTED}>
                  파라미터 1,800억 개
                </text>
              </g>
            )}

            {step === 1 && (
              <g>
                <rect x={24} y={70} width={301} height={44} fill={BACKBONE} fillOpacity={0.14} stroke={BACKBONE} strokeWidth={1.25} />
                <rect x={325} y={70} width={123} height={44} fill={TABLE} fillOpacity={0.14} stroke={TABLE} strokeWidth={1.25} />
                <rect x={448} y={70} width={8} height={44} fill={MTP} fillOpacity={0.2} stroke={MTP} strokeWidth={1} />
                <text x={174} y={96} textAnchor="middle" fontSize={11} fontWeight={700} fill={BACKBONE}>
                  backbone 125.5B
                </text>
                <text x={386} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill={TABLE}>
                  n-gram 51.2B
                </text>
                <text x={456} y={132} textAnchor="end" fontSize={9} fill={MTP}>
                  예측 모듈
                </text>
                <text x={24} y={144} fontSize={9} fill={MUTED}>
                  GPU 상주
                </text>
                <text x={325} y={144} fontSize={9} fill={MUTED}>
                  호스트 메모리 가능
                </text>
              </g>
            )}

            {(step === 2 || step === 3) && (
              <g>
                <text x={16} y={30} fontSize={10} fontWeight={700} fill={MUTED}>
                  층 하나의 expert 512개 · 칸 하나가 expert 하나
                </text>
                {Array.from({ length: 512 }, (_, index) => index).map((index) => {
                  const on = step === 3 && index < 10;
                  return (
                    <rect
                      key={index}
                      x={16 + (index % 32) * 14}
                      y={38 + Math.floor(index / 32) * 7}
                      width={12}
                      height={5}
                      fill={on ? ACTIVE : BACKBONE}
                      fillOpacity={on ? 0.45 : 0.08}
                      stroke={on ? ACTIVE : BACKBONE}
                      strokeWidth={on ? 1 : 0.5}
                    />
                  );
                })}
                {step === 3 && (
                  <g>
                    <rect x={16} y={180} width={12} height={5} fill={ACTIVE} fillOpacity={0.45} stroke={ACTIVE} strokeWidth={1} />
                    <text x={34} y={185} fontSize={8} fontWeight={700} fill={ACTIVE}>
                      라우팅 10개
                    </text>
                    <rect x={112} y={180} width={12} height={5} fill={ACTIVE} fillOpacity={0.2} stroke={ACTIVE} strokeWidth={1} />
                    <text x={130} y={185} fontSize={8} fontWeight={700} fill={ACTIVE}>
                      공유 1개는 항상 켜짐
                    </text>
                  </g>
                )}
                <text x={16} y={166} fontSize={9} fill={MUTED} data-slot="expert-size">
                  expert 하나 4,915,200개
                </text>
                {step === 2 && (
                  <text x={200} y={166} fontSize={10} fontWeight={700} fill={BACKBONE}>
                    층당 25.2억 · 48층이면 1,208억
                  </text>
                )}
                {step === 3 && (
                  <text x={200} y={166} fontSize={10} fontWeight={700} fill={ACTIVE}>
                    층당 5,407만 · 전체의 47분의 1
                  </text>
                )}
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
