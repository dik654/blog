import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PipelineContract.tsx — 지문 불일치가 만드는 조용한 고장 */
const SCENES = ["색인 지문", "질의 지문 일치", "전처리만 변경", "백본 변경"] as const;
const NOTES = [
  "벡터마다 백본·전처리·풀링·정규화를 지문처럼 함께 저장합니다.",
  "질의 경로가 같은 지문을 쓰면 두 벡터는 같은 공간에 있습니다.",
  "전처리만 바뀌면 원본이 남아 있는 한 다시 계산해 부분 재색인이 가능합니다.",
  "백본이 바뀌면 전량 재계산입니다. 차원이 같아도 섞어 쓰면 조용히 망가집니다.",
] as const;

const OKC = "#10b981";
const WARN = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const FIELDS = ["백본·체크포인트", "전처리 설정", "풀링 방식", "정규화 여부"];

export default function ContractViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const mismatch = step === 2 ? 1 : step === 3 ? 0 : -1;
  return (
    <VizFrame
      eyebrow="파이프라인 지문"
      title="차원이 같다고 같은 공간은 아닙니다"
      description="색인 경로와 질의 경로의 네 항목을 나란히 놓고 비교합니다."
      note="지문이 어긋나도 코드는 오류를 내지 않으므로 검사를 따로 둬야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="임베딩 파이프라인 지문 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
              색인 경로
            </text>
            <text x={268} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
              질의 경로
            </text>
            {FIELDS.map((f, i) => {
              const y = 42 + i * 30;
              const bad = mismatch === i;
              return (
                <g key={f}>
                  <rect x={24} y={y} width={200} height={22} fill={OKC} fillOpacity={0.1} stroke={OKC} strokeWidth={1} />
                  <text x={34} y={y + 15} fontSize={9} fill={OKC}>
                    {f}
                  </text>
                  {step >= 1 && (
                    <g>
                      <rect
                        x={268}
                        y={y}
                        width={188}
                        height={22}
                        fill={bad ? BAD : OKC}
                        fillOpacity={0.1}
                        stroke={bad ? BAD : OKC}
                        strokeWidth={bad ? 1.25 : 1}
                      />
                      <text x={278} y={y + 15} fontSize={9} fill={bad ? BAD : OKC}>
                        {bad ? `${f} · 다름` : f}
                      </text>
                      <line x1={224} y1={y + 11} x2={268} y2={y + 11} stroke={bad ? BAD : OKC} strokeWidth={1} />
                    </g>
                  )}
                </g>
              );
            })}
            {step >= 2 && (
              <text x={24} y={182} fontSize={9} fontWeight={700} fill={step === 2 ? WARN : BAD}>
                {step === 2
                  ? "원본이 있으면 해당 항목만 다시 계산해 부분 재색인"
                  : "전량 재계산 · 두 벌 운영 여부를 미리 정해야 함"}
              </text>
            )}
            {step === 1 && (
              <text x={24} y={182} fontSize={9} fontWeight={700} fill={OKC}>
                네 항목이 모두 같아야 비교가 성립합니다
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
