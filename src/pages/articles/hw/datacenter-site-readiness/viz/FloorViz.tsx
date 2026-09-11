import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: FloorLoad.tsx — 면하중과 점하중 */
const SCENES = ["랙 총 무게", "면하중", "점하중", "분산판"] as const;
const NOTES = [
  "랙 자체와 섀시, 전원 모듈, 케이블을 더합니다. 액체 냉각이면 배관과 냉각수도 포함합니다.",
  "바닥 투영 면적으로 나누면 1,400 ÷ 0.72 ≈ 1,944 kg/m²입니다.",
  "레벨러 네 개로 나누면 한 점이 350 kg을 받습니다. 접지면이 좁아 국부 압력이 큽니다.",
  "분산판으로 접지 면적을 넓히면 점하중 문제는 완화되지만 면하중은 그대로입니다.",
] as const;

const W = "#6366f1";
const AREA = "#10b981";
const POINT = "#ef4444";
const PLATE = "#f59e0b";
const MUTED = "#94a3b8";

export default function FloorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="바닥 하중"
      title="같은 무게를 두 번 나눠 봅니다"
      description="예시 값 1,400 kg · 0.6 m × 1.2 m 랙 기준입니다."
      note="숫자는 계산 방법을 보여 주기 위한 예시이며 실제 무게와 허용치는 제품과 건물마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="면하중과 점하중 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={60} y={40} width={110} height={100} fill={W} fillOpacity={0.14} stroke={W} strokeWidth={1.25} />
            <text x={115} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill={W}>
              랙
            </text>
            <text x={115} y={102} textAnchor="middle" fontSize={10} fontWeight={700} fill={W}>
              1,400 kg
            </text>
            <text x={60} y={32} fontSize={9} fill={MUTED}>
              0.6 m × 1.2 m
            </text>

            {step >= 1 && (
              <g>
                <rect x={220} y={40} width={110} height={46} fill={AREA} fillOpacity={0.12} stroke={AREA} strokeWidth={1.25} />
                <text x={275} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={AREA}>
                  면하중
                </text>
                <text x={275} y={74} textAnchor="middle" fontSize={9} fill={AREA}>
                  ≈ 1,944 kg/m²
                </text>
                <line x1={170} y1={64} x2={220} y2={64} stroke={MUTED} strokeWidth={1} />
              </g>
            )}
            {step >= 2 && (
              <g>
                <rect x={220} y={96} width={110} height={46} fill={POINT} fillOpacity={0.12} stroke={POINT} strokeWidth={1.25} />
                <text x={275} y={114} textAnchor="middle" fontSize={9} fontWeight={700} fill={POINT}>
                  점하중
                </text>
                <text x={275} y={130} textAnchor="middle" fontSize={9} fill={POINT}>
                  350 kg × 4점
                </text>
                <line x1={170} y1={118} x2={220} y2={118} stroke={MUTED} strokeWidth={1} />
                {[0, 1, 2, 3].map((i) => (
                  <circle key={i} cx={74 + (i % 2) * 82} cy={134 + Math.floor(i / 2) * 0} r={4} fill={POINT} stroke={POINT} strokeWidth={1} />
                ))}
              </g>
            )}
            {step >= 3 && (
              <g>
                <rect x={360} y={96} width={100} height={46} fill={PLATE} fillOpacity={0.12} stroke={PLATE} strokeWidth={1.25} />
                <text x={410} y={114} textAnchor="middle" fontSize={9} fontWeight={700} fill={PLATE}>
                  분산판
                </text>
                <text x={410} y={130} textAnchor="middle" fontSize={8} fill={PLATE}>
                  접지 면적 확대
                </text>
                <line x1={330} y1={118} x2={360} y2={118} stroke={MUTED} strokeWidth={1} />
                <text x={360} y={74} fontSize={8} fill={MUTED}>
                  면하중은 그대로
                </text>
              </g>
            )}
            <text x={60} y={172} fontSize={9} fill={MUTED}>
              두 값 중 하나만 넘어도 그대로 들일 수 없습니다
            </text>
            <text x={60} y={190} fontSize={9} fill={MUTED}>
              참고로 일반 사무실 설계 기준은 수백 kg/m² 수준입니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
