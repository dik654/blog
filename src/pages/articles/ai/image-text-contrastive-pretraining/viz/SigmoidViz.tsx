import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SigmoidLoss.tsx — 칸마다 독립인 이진 손실 */
const SCENES = ["부호 라벨", "칸마다 독립 계산", "편향의 역할", "장치별 조각"] as const;
const NOTES = [
  "대각선은 +1, 나머지는 -1입니다. 구현은 -ones + 2·eye 한 줄입니다.",
  "각 칸에 로지스틱 손실을 겁니다. 행의 합으로 나누는 정규화가 없습니다.",
  "음성 칸이 N배 많아 그대로 두면 기울기가 음성에 쏠립니다. 편향이 판정선을 옮겨 이를 흡수합니다.",
  "정규화가 없으니 전체 합이 부분 합의 합입니다. 자기 장치 조각만 들고 계산할 수 있습니다.",
] as const;

const POS = "#10b981";
const NEG = "#94a3b8";
const BIAS = "#f59e0b";
const DEV = "#6366f1";
const N = 5;

export default function SigmoidViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="시그모이드 손실"
      title="행을 묶는 상수가 사라지면 계산이 쪼개집니다"
      description="같은 5×5 행렬을 칸 단위 이진 분류로 다시 봅니다."
      note="장치 배치는 개념도이며 실제 구현의 통신 순서를 그대로 나타내지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="쌍 단위 시그모이드 손실"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {Array.from({ length: N }, (_, i) => i).map((i) =>
              Array.from({ length: N }, (_, j) => j).map((j) => {
                const isDiag = i === j;
                const inDevice = step >= 3 && i < 3 && j < 3;
                const color = isDiag ? POS : NEG;
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={24 + j * 30}
                      y={38 + i * 30}
                      width={28}
                      height={28}
                      fill={color}
                      fillOpacity={isDiag ? 0.35 : 0.12}
                      stroke={inDevice ? DEV : color}
                      strokeWidth={inDevice ? 1.25 : 0.5}
                    />
                    <text x={38 + j * 30} y={56 + i * 30} textAnchor="middle" fontSize={8} fontWeight={700} fill={color}>
                      {isDiag ? "+1" : "−1"}
                    </text>
                  </g>
                );
              }),
            )}
            <text x={24} y={30} fontSize={9} fill={NEG}>
              부호 라벨 행렬
            </text>

            {step >= 1 && (
              <g>
                <rect x={200} y={40} width={256} height={44} fill="none" stroke={POS} strokeWidth={1.25} />
                <text x={328} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={POS}>
                  logsigmoid(z · (t·s + b))
                </text>
                <text x={328} y={76} textAnchor="middle" fontSize={8} fill={NEG}>
                  칸마다 독립 · 행 합으로 나누지 않음
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <text x={200} y={104} fontSize={9} fontWeight={700} fill={BIAS}>
                  배치 N=1024일 때 한 행의 구성
                </text>
                <rect x={200} y={112} width={4} height={14} fill={POS} fillOpacity={0.5} stroke={POS} strokeWidth={1} />
                <rect x={206} y={112} width={250} height={14} fill={NEG} fillOpacity={0.25} stroke={NEG} strokeWidth={1} />
                <text x={200} y={140} fontSize={8} fill={POS}>
                  양성 1
                </text>
                <text x={250} y={140} fontSize={8} fill={NEG}>
                  음성 1023 · 편향이 판정선을 음수 쪽으로 옮겨 흡수
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={200} y={152} width={256} height={34} fill={DEV} fillOpacity={0.08} stroke={DEV} strokeWidth={1.25} />
                <text x={328} y={173} textAnchor="middle" fontSize={9} fontWeight={700} fill={DEV}>
                  장치는 b×b 조각만 동시에 보유
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
