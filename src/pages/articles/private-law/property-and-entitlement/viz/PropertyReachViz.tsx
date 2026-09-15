import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·publicity — 계약은 두 사람만, 소유는 누구에게나 */
const SCENES = [
  "계약은 두 사람 사이에서만 통한다",
  "제삼자가 끼어들면 닿지 않는다",
  "소유는 누구에게나 통한다",
  "그래서 보이게 만들어야 한다",
] as const;

const NOTES = [
  "물건을 넘기기로 한 약속은 약속한 두 사람을 묶습니다. 어기면 그 사람에게 물릴 수 있습니다.",
  "그런데 다른 사람이 그 물건을 가져가면 이 약속으로는 아무것도 할 수 없습니다. 그 사람은 약속의 당사자가 아니기 때문입니다.",
  "소유는 다릅니다. 내 물건이라는 주장은 가져간 사람이 누구든 통합니다. 약속하지 않은 사람에게까지 미치는 힘입니다.",
  "대가가 있습니다. 모두에게 지키라고 하려면 모두가 알 수 있어야 하므로 점유나 등기로 밖에 드러나야 하고, 만들 수 있는 권리의 종류도 미리 정해진 목록으로 제한됩니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const OUTSIDERS = [
  { x: 92, label: "제삼자 가" },
  { x: 240, label: "제삼자 나" },
  { x: 388, label: "제삼자 다" },
] as const;

const COSTS = [
  { label: "공시", detail: "점유·등기로 드러나야 함" },
  { label: "종류 제한", detail: "미리 정해진 목록 안에서만" },
  { label: "조사 부담", detail: "거래 전에 확인해야 함" },
] as const;

export default function PropertyReachViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="도달 범위"
      title="두 사람만 묶는 힘과 누구에게나 미치는 힘은 다릅니다"
      description="약속에서 나온 힘은 약속한 사람에게만 닿습니다."
      note="사람을 다섯으로 줄인 그림입니다. 실제로는 채권을 제삼자에게 주장할 수 있게 만드는 별도의 장치들도 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="계약과 소유의 도달 범위"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <rect x={130} y={34} width={90} height={32} rx={4} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1} />
              <text x={175} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                나
              </text>
              <rect x={260} y={34} width={90} height={32} rx={4} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1} />
              <text x={305} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                상대
              </text>
              <line x1={220} y1={50} x2={260} y2={50} stroke={step >= 2 ? MUTED : ACCENT} strokeWidth={1} />
              <text x={240} y={44} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={step >= 2 ? MUTED : ACCENT}>
                약속
              </text>

              {OUTSIDERS.map((o, i) => {
                const reached = step >= 2;
                const color = step === 1 && i === 1 ? WARN : reached ? OK : MUTED;
                return (
                  <g key={o.label}>
                    <rect
                      x={o.x - 44}
                      y={104}
                      width={88}
                      height={28}
                      rx={4}
                      fill={color}
                      fillOpacity={step === 0 ? 0.05 : 0.12}
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray={step === 0 ? "3 3" : undefined}
                    />
                    <text x={o.x} y={122} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>
                      {o.label}
                    </text>
                    {reached && (
                      <line x1={240} y1={70} x2={o.x} y2={102} stroke={OK} strokeWidth={1} />
                    )}
                    {step === 1 && i === 1 && (
                      <g>
                        <line x1={240} y1={70} x2={240} y2={102} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                        <text x={250} y={90} fontSize={8.5} fontWeight={700} fill={WARN}>
                          약속이 닿지 않음
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {step === 0 && (
                <text x={40} y={160} fontSize={9.5} fill={MUTED}>
                  어기면 상대에게 물릴 수 있습니다. 나머지 사람들과는 아무 관계가 없습니다.
                </text>
              )}

              {step === 1 && (
                <text x={40} y={160} fontSize={9.5} fontWeight={700} fill={WARN}>
                  가져간 사람은 약속의 당사자가 아니므로 이 약속으로는 아무것도 할 수 없습니다
                </text>
              )}

              {step === 2 && (
                <g>
                  <text x={40} y={160} fontSize={9.5} fontWeight={700} fill={OK}>
                    내 물건이라는 주장은 가져간 사람이 누구든 통합니다
                  </text>
                  <text x={40} y={178} fontSize={9} fill={MUTED}>
                    약속하지 않은 사람에게까지 미치는 힘입니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  {COSTS.map((c, i) => (
                    <g key={c.label}>
                      <rect x={34 + i * 142} y={146} width={132} height={34} rx={4} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                      <text x={100 + i * 142} y={161} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                        {c.label}
                      </text>
                      <text x={100 + i * 142} y={173} textAnchor="middle" fontSize={7} fill={MUTED}>
                        {c.detail}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
