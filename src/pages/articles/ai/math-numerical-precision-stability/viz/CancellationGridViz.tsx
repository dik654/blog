import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #cancellation — 차이 1인 두 모멘트가 간격 8인 FP32 자리에서 같은 값이 된다.
 * 1억 근처는 2²⁶ 이상 2²⁷ 미만이고 f=23이므로 간격은 2^(26−23)=8입니다(본문 #precision의 gap 식).
 */
const W = 340;
const H = 170;
const AXIS_Y = 96;
const CENTER = 170;
const UNIT = 17; // 값 1의 화면 폭

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

const ox = (offset: number) => CENTER + offset * UNIT;

const SCENES = [
  { label: "제곱을 저장", summary: "100040004 → 100040000", note: "1억 근처의 FP32 자리는 8씩 떨어져 있습니다. 10002의 제곱 100040004는 두 자리의 가운데라 짝수 번호인 100040000이 됩니다." },
  { label: "제곱들의 평균", summary: "E[X²] = 100020000", note: "저장된 두 제곱 100000000과 100040000의 평균은 100020000입니다. 정확한 제곱들의 평균(2차 모멘트) 100020002보다 2 작습니다. 점선 점은 비교용 정답이며 실제로 계산되는 값이 아닙니다." },
  { label: "평균의 제곱", summary: "같은 자리 · 차 0", note: "10001의 제곱 100020001도 같은 자리에 저장됩니다. 정확한 차이 1이 간격 8 안에 들어가 저장값의 차는 0입니다." },
  { label: "평균을 먼저 빼기", summary: "−1, 1 → 분산 1", note: "입력에서 평균 10001을 먼저 빼면 −1과 1입니다. 큰 제곱을 만들지 않으므로 분산 1이 남습니다." },
] as const;

export default function CancellationGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const base = active === 0 ? "100040000" : "100020000";
  const ticks = [-8, 0, 8];

  return (
    <VizFrame
      eyebrow="FP32 자리에서 본 분산"
      title="차이 1이 간격 8 안에 들어가면 분산이 지워집니다"
      description="입력 10000, 10002의 정확한 분산은 1입니다. 눈금이 FP32 자리, 빈 점이 저장 직전의 값입니다."
      note="입력은 가정 사례입니다. 간격 8은 앞의 gap 식에 E=26, f=23을 넣은 값입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="큰 제곱들의 차로 분산을 구할 때와 평균을 먼저 뺄 때의 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 && (
            <g>
              <line x1={ox(-9.4)} x2={ox(9.4)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {ticks.map((o) => (
                <g key={o}>
                  <line x1={ox(o)} x2={ox(o)} y1={AXIS_Y - 9} y2={AXIS_Y + 9} stroke={o === 0 ? BLUE : GRAY} strokeWidth={o === 0 ? 1.25 : 1} />
                  <text x={ox(o)} y={AXIS_Y + 28} textAnchor="middle" fontSize={12} fontWeight={o === 0 ? 700 : 400} fill={o === 0 ? BLUE : GRAY}>{o === 0 ? base : o < 0 ? "−8" : "+8"}</text>
                </g>
              ))}
              <path d={`M ${ox(0)} ${AXIS_Y + 40} v 6 H ${ox(8)} v -6`} fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={ox(4)} y={AXIS_Y + 62} textAnchor="middle" fontSize={12} fill={GRAY}>간격 8</text>
              <circle cx={ox(0)} cy={AXIS_Y} r={5} fill={BLUE} />
            </g>
          )}
          {active === 0 && (
            <g>
              <path d={`M ${ox(4)} ${AXIS_Y - 45} L ${ox(0)} ${AXIS_Y - 6}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <circle cx={ox(4)} cy={AXIS_Y - 50} r={5} fill="#ffffff" stroke={AMBER} strokeWidth={1.25} />
              <text x={ox(4) + 10} y={AXIS_Y - 46} fontSize={12} fontWeight={700} fill={AMBER}>100040004</text>
            </g>
          )}
          {active >= 1 && active < 3 && (
            <g>
              <circle cx={ox(2)} cy={AXIS_Y - 50} r={5} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="2 2" />
              <text x={ox(2) + 10} y={AXIS_Y - 46} fontSize={12} fill={GRAY}>정답 100020002</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <path d={`M ${ox(1)} ${AXIS_Y - 20} L ${ox(0)} ${AXIS_Y - 6}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <circle cx={ox(1)} cy={AXIS_Y - 25} r={5} fill="#ffffff" stroke={AMBER} strokeWidth={1.25} />
              <text x={ox(1) + 10} y={AXIS_Y - 21} fontSize={12} fontWeight={700} fill={AMBER}>100020001</text>
            </g>
          )}
          {active === 3 && (
            <g>
              {(() => {
                const sx = (value: number) => CENTER + value * 70;
                return (
                  <g>
                    <line x1={sx(-2)} x2={sx(2)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
                    {[-2, -1, 0, 1, 2].map((value) => (
                      <g key={value}>
                        <line x1={sx(value)} x2={sx(value)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={GRAY} strokeWidth={1} />
                        <text x={sx(value)} y={AXIS_Y + 24} textAnchor="middle" fontSize={12} fill={GRAY}>{value < 0 ? `−${-value}` : value}</text>
                      </g>
                    ))}
                    {[-1, 1].map((value) => (
                      <g key={value}>
                        <circle cx={sx(value)} cy={AXIS_Y} r={5} fill={BLUE} />
                        <text x={sx(value)} y={AXIS_Y - 40} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{value < 0 ? "10000 − 10001" : "10002 − 10001"}</text>
                        <text x={sx(value)} y={AXIS_Y - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>제곱 1</text>
                      </g>
                    ))}
                    <text x={CENTER} y={AXIS_Y + 56} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>(1 + 1) ÷ 2 = 1</text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
