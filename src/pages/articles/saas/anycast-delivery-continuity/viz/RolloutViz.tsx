import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: CorrelatedChange.tsx — 전역 동시 적용 vs 단계적 적용, 되돌리기 시간의 무게 */
const SCENES = ["전역 동시 적용", "단계적 적용", "지표로 매개", "되돌리기가 느리면"] as const;
const NOTES = [
  "모든 지점이 같은 변경을 같은 순간에 받으면 중복 구성은 아무 도움이 되지 않습니다.",
  "한 번에 닿는 범위를 좁히면 나쁜 변경이 만드는 피해도 그 비율만큼으로 줄어듭니다.",
  "단계마다 미리 정한 지표로 계속·중지·되돌리기를 판정하면 사람의 판단을 기다리지 않습니다.",
  "단계를 잘게 나눠도 되돌리기가 느리면 그 시간은 그대로 남습니다.",
] as const;

const BAD = "#ef4444";
const OK = "#10b981";
const STEP = "#6366f1";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

const SITES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RolloutViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="변경 층"
      title="중복 구성이 막지 못하는 실패는 변경 절차로만 막힙니다"
      description="같은 나쁜 변경이 전역 적용과 단계적 적용에서 만드는 차이를 봅니다."
      note="단계 비율과 시간은 계산 구조를 보여 주기 위한 예시이며 권고값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="변경 적용 범위와 피해량"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={26} fontSize={9} fill={MUTED}>
              지점 10개 · 나쁜 변경 하나
            </text>
            {SITES.map((i) => {
              const hit = step === 0 ? true : i === 0;
              const c = hit ? BAD : step === 0 ? BAD : OK;
              return (
                <g key={i}>
                  <rect x={24 + i * 43} y={40} width={36} height={30} fill={c} fillOpacity={hit ? 0.18 : 0.08} stroke={c} strokeWidth={hit ? 1.25 : 1} />
                  <text x={42 + i * 43} y={60} textAnchor="middle" fontSize={8} fontWeight={700} fill={c}>
                    {hit ? "적용" : "대기"}
                  </text>
                </g>
              );
            })}
            {step === 0 && (
              <g>
                <text x={24} y={96} fontSize={9} fontWeight={700} fill={BAD}>
                  영향 비율 f = 1 · 열 곳이 함께 넘어집니다
                </text>
                <text x={24} y={116} fontSize={8} fill={MUTED}>
                  지점을 늘려도 같은 설정을 받으면 늘린 만큼이 함께 망가집니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                <text x={24} y={96} fontSize={9} fontWeight={700} fill={STEP}>
                  첫 단계 f = 0.1 · 나머지는 아직 옛 상태입니다
                </text>
              </g>
            )}
            {step === 1 && (
              <text x={24} y={116} fontSize={8} fill={MUTED}>
                피해량은 영향 비율에 감지 시간과 되돌리기 시간의 합을 곱한 값입니다.
              </text>
            )}
            {step >= 2 && (
              <g>
                <rect x={24} y={112} width={140} height={28} fill={WARN} fillOpacity={0.12} stroke={WARN} strokeWidth={1} />
                <text x={94} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  지표 확인
                </text>
                <line x1={164} y1={126} x2={196} y2={126} stroke={MUTED} strokeWidth={1} />
                <rect x={196} y={112} width={84} height={28} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1} />
                <text x={238} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  계속
                </text>
                <rect x={288} y={112} width={84} height={28} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={330} y={130} textAnchor="middle" fontSize={9} fill={MUTED}>
                  중지
                </text>
                <rect x={380} y={112} width={76} height={28} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1} />
                <text x={418} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  되돌리기
                </text>
              </g>
            )}
            {step === 2 && (
              <text x={24} y={162} fontSize={8} fill={MUTED}>
                기준의 예로 공개된 것은 오류율이 0.1% 미만이어야 한다는 식의 조건입니다.
              </text>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={154} width={40} height={18} fill={WARN} fillOpacity={0.22} stroke={WARN} strokeWidth={1} />
                <text x={44} y={167} textAnchor="middle" fontSize={8} fontWeight={700} fill={WARN}>
                  감지
                </text>
                <rect x={64} y={154} width={300} height={18} fill={BAD} fillOpacity={0.18} stroke={BAD} strokeWidth={1} />
                <text x={214} y={167} textAnchor="middle" fontSize={8} fontWeight={700} fill={BAD}>
                  사람 손을 거치는 되돌리기
                </text>
                <text x={24} y={190} fontSize={8} fill={MUTED}>
                  첫 단계를 1%로 줄여도 이 칸은 그대로입니다. 자동 되돌리기가 더 큰 효과를 냅니다.
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
