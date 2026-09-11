import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 가속기 서버에서 CPU가 맡는 역할 */
const SCENES = ["데이터 읽기", "전처리", "장치 연결", "그래서 고르는 기준"] as const;
const NOTES = [
  "저장장치에서 데이터를 읽어 옵니다. 이 경로가 레인과 저장장치 성능에 묶입니다.",
  "디코딩과 증강을 수행해 가속기에 넘길 형태로 만듭니다. 메모리 대역폭이 상한입니다.",
  "가속기·네트워크·저장장치를 잇는 레인을 제공합니다. 레인 수가 붙일 수 있는 장치 수를 정합니다.",
  "행렬 연산이 아니라 통로가 일이므로 코어 수가 아니라 레인과 채널로 고릅니다.",
] as const;

const IO = "#6366f1";
const PRE = "#f59e0b";
const LANE = "#10b981";
const MUTED = "#94a3b8";

export default function RoleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="CPU의 역할"
      title="가속기 서버에서 CPU는 공급 경로입니다"
      description="세 가지 일이 각각 어떤 하드웨어 값에 묶이는지 봅니다."
      note="추론 전용 노드와 학습 노드는 CPU 요구가 다르며 그림은 학습 쪽에 가깝습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가속기 서버에서 CPU의 역할"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {[
              { n: "저장장치", x: 20, c: IO, on: step >= 0 },
              { n: "CPU", x: 150, c: PRE, on: step >= 1 },
              { n: "메모리", x: 150, c: PRE, on: step >= 1, y: 126 },
              { n: "가속기", x: 300, c: LANE, on: step >= 2 },
            ].map((b) => (
              <g key={b.n + b.x + (b.y ?? 0)}>
                <rect
                  x={b.x}
                  y={b.y ?? 56}
                  width={100}
                  height={44}
                  fill={b.c}
                  fillOpacity={b.on ? 0.14 : 0.05}
                  stroke={b.on ? b.c : MUTED}
                  strokeWidth={b.on ? 1.25 : 1}
                />
                <text x={b.x + 50} y={(b.y ?? 56) + 27} textAnchor="middle" fontSize={10} fontWeight={700} fill={b.on ? b.c : MUTED}>
                  {b.n}
                </text>
              </g>
            ))}
            <line x1={120} y1={78} x2={150} y2={78} stroke={step >= 0 ? IO : MUTED} strokeWidth={1} />
            <line x1={200} y1={100} x2={200} y2={126} stroke={step >= 1 ? PRE : MUTED} strokeWidth={1} />
            <line x1={250} y1={78} x2={300} y2={78} stroke={step >= 2 ? LANE : MUTED} strokeWidth={1} />

            <text x={20} y={40} fontSize={9} fill={step === 0 ? IO : MUTED}>
              레인 · 저장장치 성능
            </text>
            <text x={150} y={192} fontSize={9} fill={step === 1 ? PRE : MUTED}>
              메모리 채널 대역폭
            </text>
            <text x={300} y={40} fontSize={9} fill={step >= 2 ? LANE : MUTED}>
              레인 수 = 붙일 수 있는 장치 수
            </text>
            {step === 3 && (
              <g>
                <rect x={20} y={150} width={120} height={30} fill={LANE} fillOpacity={0.1} stroke={LANE} strokeWidth={1.25} />
                <text x={80} y={169} textAnchor="middle" fontSize={9} fontWeight={700} fill={LANE}>
                  레인과 채널로 선택
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
