import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Pooling.tsx — 토큰 배치와 풀링 선택 */
const SCENES = ["토큰 배치", "요약 토큰 사용", "패치 평균", "앞칸을 안 자르면"] as const;
const NOTES = [
  "출력 시퀀스는 요약 토큰 1개, 보조 토큰 R개, 패치 토큰 P개 순서입니다.",
  "0번 토큰을 그대로 씁니다. 참조 구현의 pooler 출력이 바로 이 값입니다.",
  "앞의 1+R칸을 자른 뒤 패치만 평균 냅니다. 부분 정보가 고르게 섞입니다.",
  "자르지 않고 평균 내면 이미지 위치와 무관한 벡터가 섞여 들어갑니다.",
] as const;

const CLS = "#6366f1";
const REG = "#f59e0b";
const PATCH = "#8b5cf6";
const OUT = "#10b981";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

export default function PoolingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="풀링"
      title="어느 칸을 합치느냐가 벡터의 의미를 정합니다"
      description="토큰 16개로 줄인 그림입니다. 실제 패치 수는 해상도에 따라 수백 개입니다."
      note="보조 토큰 수 R은 모델 설정에서 읽어야 하며 모델마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="풀링 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {Array.from({ length: 16 }, (_, i) => i).map((i) => {
              const kind = i === 0 ? "cls" : i < 5 ? "reg" : "patch";
              const color = kind === "cls" ? CLS : kind === "reg" ? REG : PATCH;
              const used =
                step === 1 ? i === 0 : step === 2 ? i >= 5 : step === 3 ? true : false;
              return (
                <g key={i}>
                  <rect
                    x={24 + i * 27}
                    y={54}
                    width={22}
                    height={30}
                    fill={color}
                    fillOpacity={used ? 0.35 : 0.1}
                    stroke={step === 3 && i < 5 ? BAD : color}
                    strokeWidth={used ? 1.25 : 0.75}
                  />
                  <text x={35 + i * 27} y={98} textAnchor="middle" fontSize={7} fill={color}>
                    {kind === "cls" ? "C" : kind === "reg" ? "R" : i - 4}
                  </text>
                </g>
              );
            })}
            <text x={24} y={44} fontSize={9} fill={MUTED}>
              출력 시퀀스 · C = 요약, R = 보조, 숫자 = 패치
            </text>

            {step >= 1 && (
              <g>
                <rect x={24} y={118} width={180} height={32} fill={step === 3 ? BAD : OUT} fillOpacity={0.12} stroke={step === 3 ? BAD : OUT} strokeWidth={1.25} />
                <text x={114} y={138} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 3 ? BAD : OUT}>
                  {step === 1 ? "v = out[:, 0]" : step === 2 ? "v = out[:, 1+R:].mean(1)" : "v = out.mean(1)"}
                </text>
                <text x={220} y={132} fontSize={9} fill={MUTED}>
                  {step === 1 && "장면 단위 검색에 적합"}
                  {step === 2 && "부분 정보가 고르게 섞임"}
                  {step === 3 && "보조 토큰이 벡터를 오염시킴"}
                </text>
                {step === 3 && (
                  <text x={220} y={150} fontSize={9} fontWeight={700} fill={BAD}>
                    차원이 맞으니 오류 없이 조용히 잘못됩니다
                  </text>
                )}
              </g>
            )}
            <text x={24} y={186} fontSize={9} fill={MUTED}>
              무엇을 검색할지 정한 뒤에 고르는 결정입니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
