import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: BatchAndNegatives.tsx — 배치 크기와 비용·이득 */
const SCENES = ["작은 배치", "큰 배치", "포화", "가짜 음성"] as const;
const NOTES = [
  "음성이 적어 신호가 약합니다. 정규화 없는 손실은 이 구간에서 상대적으로 잘 동작한다고 보고됐습니다.",
  "음성이 늘어 신호가 세집니다. 대신 유사도 행렬과 통신 요구가 함께 커집니다.",
  "원 논문은 배치를 백만까지 올려도 이득이 빠르게 줄고 3만 규모면 충분하다고 보고했습니다.",
  "배치가 커질수록 같은 내용의 다른 쌍이 함께 들어와 서로를 밀어내는 일이 늘어납니다.",
] as const;

const GAIN = "#10b981";
const COST = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const POINTS = [
  { n: "1k", gain: 30, cost: 8 },
  { n: "4k", gain: 52, cost: 18 },
  { n: "16k", gain: 68, cost: 44 },
  { n: "32k", gain: 74, cost: 72 },
  { n: "256k", gain: 78, cost: 118 },
  { n: "1M", gain: 79, cost: 150 },
];

export default function BatchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const visible = step === 0 ? 2 : step === 1 ? 4 : POINTS.length;
  return (
    <VizFrame
      eyebrow="배치 크기"
      title="이득은 포화하고 비용은 계속 오릅니다"
      description="가로축은 배치 크기, 두 막대는 학습 신호의 이득과 자원 비용의 개념적 추세입니다."
      note="막대 값은 추세를 보여 주기 위한 예시이며 특정 실험의 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="배치 크기와 이득·비용"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <line x1={40} y1={150} x2={456} y2={150} stroke={MUTED} strokeWidth={1} />
            {POINTS.slice(0, visible).map((p, i) => (
              <g key={p.n}>
                <rect x={52 + i * 68} y={150 - p.gain} width={24} height={p.gain} fill={GAIN} fillOpacity={0.3} stroke={GAIN} strokeWidth={1} />
                <rect x={78 + i * 68} y={150 - Math.min(p.cost, 110)} width={24} height={Math.min(p.cost, 110)} fill={COST} fillOpacity={0.25} stroke={COST} strokeWidth={1} />
                <text x={77 + i * 68} y={164} textAnchor="middle" fontSize={9} fill={MUTED}>
                  {p.n}
                </text>
              </g>
            ))}
            <rect x={40} y={28} width={10} height={10} fill={GAIN} fillOpacity={0.3} stroke={GAIN} strokeWidth={1} />
            <text x={56} y={37} fontSize={9} fill={GAIN}>
              학습 신호 이득
            </text>
            <rect x={150} y={28} width={10} height={10} fill={COST} fillOpacity={0.25} stroke={COST} strokeWidth={1} />
            <text x={166} y={37} fontSize={9} fill={COST}>
              메모리·통신 비용
            </text>

            {step === 2 && (
              <g>
                <line x1={256} y1={60} x2={456} y2={60} stroke={GAIN} strokeWidth={1} strokeDasharray="4 3" />
                <text x={300} y={54} fontSize={9} fontWeight={700} fill={GAIN}>
                  이득은 여기서부터 거의 평평
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={40} y={176} width={416} height={20} fill={BAD} fillOpacity={0.06} stroke={BAD} strokeWidth={1} />
                <text x={248} y={190} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  같은 내용의 다른 쌍이 음성으로 섞여 서로를 밀어냅니다
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
