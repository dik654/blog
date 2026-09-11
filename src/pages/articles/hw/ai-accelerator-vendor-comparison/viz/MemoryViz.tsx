import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: MemoryAxis.tsx — 용량과 대역폭이 답하는 질문이 다르다 */
const SCENES = ["용량: 들어가는가", "용량 부족: 나누기", "대역폭: 토큰당 시간", "두 질문을 분리"] as const;
const NOTES = [
  "모델과 실행 상태가 한 장에 들어가면 통신이 필요 없습니다.",
  "들어가지 않으면 나눠야 하고, 그 순간 링크 축의 비용이 생깁니다.",
  "배치가 작을 때는 읽어야 할 바이트를 대역폭으로 나눈 값이 토큰당 하한 시간입니다.",
  "용량은 나눌지를, 대역폭은 얼마나 빠를지를 정합니다. 한 숫자로 합치면 안 됩니다.",
] as const;

const CAP = "#6366f1";
const BW = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

export default function MemoryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="메모리 축"
      title="같은 메모리에서 두 개의 다른 질문이 나옵니다"
      description="용량과 대역폭이 각각 어떤 판단에 쓰이는지 나눠 봅니다."
      note="토큰당 시간은 하한이며 커널 효율과 KV 읽기, 통신이 더해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="용량과 대역폭의 역할 구분"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 && (
              <g>
                <rect x={24} y={44} width={150} height={90} fill="none" stroke={CAP} strokeWidth={1.25} />
                <text x={99} y={38} textAnchor="middle" fontSize={9} fill={CAP}>
                  카드 한 장 용량
                </text>
                <rect x={32} y={52} width={134} height={step === 0 ? 60 : 96} fill={step === 0 ? CAP : WARN} fillOpacity={0.22} stroke={step === 0 ? CAP : WARN} strokeWidth={1} />
                <text x={99} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? CAP : WARN}>
                  모델 + 상태
                </text>
                {step === 1 && (
                  <g>
                    <text x={200} y={70} fontSize={9} fontWeight={700} fill={WARN}>
                      넘침 → 여러 장에 나눔
                    </text>
                    <rect x={200} y={82} width={110} height={46} fill="none" stroke={WARN} strokeWidth={1} />
                    <rect x={324} y={82} width={110} height={46} fill="none" stroke={WARN} strokeWidth={1} />
                    <line x1={310} y1={105} x2={324} y2={105} stroke={WARN} strokeWidth={1.25} />
                    <text x={317} y={146} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                      링크 비용 발생
                    </text>
                  </g>
                )}
                {step === 0 && (
                  <text x={200} y={90} fontSize={9} fontWeight={700} fill={CAP}>
                    들어감 → 통신 없음
                  </text>
                )}
              </g>
            )}

            {step >= 2 && (
              <g>
                <text x={24} y={38} fontSize={9} fill={BW} fontWeight={700}>
                  토큰당 하한 시간 = 읽을 바이트 ÷ 대역폭
                </text>
                {[
                  { n: "대역폭 8 TB/s", t: 1.0 },
                  { n: "대역폭 3.7 TB/s", t: 2.16 },
                ].map((r, i) => (
                  <g key={r.n}>
                    <text x={24} y={70 + i * 44} fontSize={9} fill={BW}>
                      {r.n}
                    </text>
                    <rect x={160} y={56 + i * 44} width={r.t * 130} height={20} fill={BW} fillOpacity={0.28} stroke={BW} strokeWidth={1} />
                    <text x={166 + r.t * 130} y={71 + i * 44} fontSize={8} fill={BW}>
                      상대 시간 ×{r.t.toFixed(2)}
                    </text>
                  </g>
                ))}
                {step === 3 && (
                  <g>
                    <rect x={24} y={144} width={200} height={40} fill={CAP} fillOpacity={0.08} stroke={CAP} strokeWidth={1.25} />
                    <text x={124} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill={CAP}>
                      용량 → 나눌지 여부
                    </text>
                    <text x={124} y={176} textAnchor="middle" fontSize={8} fill={CAP}>
                      링크 축으로 넘어감
                    </text>
                    <rect x={248} y={144} width={200} height={40} fill={BW} fillOpacity={0.08} stroke={BW} strokeWidth={1.25} />
                    <text x={348} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill={BW}>
                      대역폭 → 속도 상한
                    </text>
                    <text x={348} y={176} textAnchor="middle" fontSize={8} fill={BW}>
                      같으면 상한도 같음
                    </text>
                  </g>
                )}
                <text x={300} y={38} fontSize={8} fill={MUTED}>
                  같은 모델·같은 배치 가정
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
