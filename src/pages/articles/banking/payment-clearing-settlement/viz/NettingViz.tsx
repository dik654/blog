import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: rtgs-vs-dns — 같은 지급 묶음을 총액으로 결제할 때와 상계할 때 */
const SCENES = [
  "총액으로 하나씩 결제한다",
  "서로 주고받을 것을 지운다",
  "남는 차액만 옮긴다",
  "아낀 자금만큼 위험이 쌓인다",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 세 기관 사이의 지급 여섯 건(단위: 억 원). 합계 260. */
const FLOWS = [
  { from: "A", to: "B", amount: 100 },
  { from: "B", to: "A", amount: 90 },
  { from: "B", to: "C", amount: 30 },
  { from: "C", to: "B", amount: 20 },
  { from: "A", to: "C", amount: 10 },
  { from: "C", to: "A", amount: 10 },
];

const GROSS = FLOWS.reduce((sum, flow) => sum + flow.amount, 0);

const NET: Record<string, number> = { A: 0, B: 0, C: 0 };
for (const flow of FLOWS) {
  NET[flow.from] -= flow.amount;
  NET[flow.to] += flow.amount;
}
const SETTLED =
  Object.values(NET).reduce((sum, value) => sum + Math.abs(value), 0) / 2;
const EFFICIENCY = Math.round((1 - SETTLED / GROSS) * 100);

const NOTES = [
  `지시 여섯 건을 건별로 처리하면 총 ${GROSS}만큼의 자금이 실제로 움직여야 합니다.`,
  "같은 주기 안의 지급은 방향이 엇갈립니다. 받을 것에서 줄 것을 빼면 각 기관의 순포지션이 남습니다.",
  `실제로 옮기는 금액은 ${SETTLED}로 줄어듭니다. 상계 효율은 약 ${EFFICIENCY}%입니다.`,
  `지워진 ${GROSS - SETTLED}은 사라진 것이 아니라 정산 시각까지 미결제로 남아 있던 금액입니다.`,
] as const;

const NODES = [
  { id: "A", x: 60, y: 96 },
  { id: "B", x: 220, y: 46 },
  { id: "C", x: 220, y: 146 },
];

export default function NettingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="상계 효율"
      title="같은 지급 묶음도 언제 정산하느냐에 따라 필요한 자금이 달라집니다"
      description="건별로 넘기면 총액이 움직이고, 모아서 지우면 차액만 움직입니다."
      note="단위는 억 원이고 여섯 건은 계산이 보이도록 고른 예시입니다. 실제 시스템의 상계 효율은 참가자 구성과 흐름에 따라 크게 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="총액 결제와 차액 결제의 비교"
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
              {step === 0 &&
                FLOWS.map((flow, index) => {
                  const from = NODES.find((node) => node.id === flow.from)!;
                  const to = NODES.find((node) => node.id === flow.to)!;
                  return (
                    <line
                      key={index}
                      x1={from.x + 20}
                      y1={from.y + 14 + (index % 2 ? 4 : -4)}
                      x2={to.x - 20}
                      y2={to.y + 14 + (index % 2 ? 4 : -4)}
                      stroke={ACCENT}
                      strokeWidth={1}
                    />
                  );
                })}

              {NODES.map((node) => (
                <g key={node.id}>
                  <rect
                    x={node.x - 20}
                    y={node.y}
                    width={40}
                    height={28}
                    fill={step >= 1 && NET[node.id] !== 0 ? (NET[node.id] > 0 ? OK : WARN) : ACCENT}
                    fillOpacity={0.12}
                    stroke={step >= 1 && NET[node.id] !== 0 ? (NET[node.id] > 0 ? OK : WARN) : ACCENT}
                    strokeWidth={1}
                  />
                  <text x={node.x} y={node.y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>
                    {node.id}
                  </text>
                  {step >= 1 && (
                    <text
                      x={node.x}
                      y={node.y + 42}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={700}
                      fill={NET[node.id] > 0 ? OK : NET[node.id] < 0 ? WARN : MUTED}
                    >
                      순 {NET[node.id] > 0 ? `+${NET[node.id]}` : NET[node.id]}
                    </text>
                  )}
                </g>
              ))}

              {step >= 2 && (
                <g>
                  <line
                    x1={NODES[0].x + 20}
                    y1={NODES[0].y + 20}
                    x2={NODES[2].x - 20}
                    y2={NODES[2].y + 10}
                    stroke={OK}
                    strokeWidth={1.25}
                  />
                  <text x={152} y={110} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    실제 이동은 이 한 건 {SETTLED}
                  </text>
                </g>
              )}

              <text x={312} y={40} fontSize={9} fontWeight={700} fill={step === 0 ? ACCENT : MUTED}>
                총액 기준 {GROSS}
              </text>
              {step >= 2 && (
                <text x={312} y={60} fontSize={10} fontWeight={700} fill={OK}>
                  실제 이동 {SETTLED}
                </text>
              )}
              {step >= 2 && (
                <text x={312} y={80} fontSize={9} fill={OK}>
                  상계 효율 약 {EFFICIENCY}%
                </text>
              )}
              {step === 3 && (
                <g>
                  <rect x={306} y={98} width={156} height={58} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1} />
                  <text x={384} y={116} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    미결제로 남은 {GROSS - SETTLED}
                  </text>
                  <text x={384} y={132} textAnchor="middle" fontSize={8} fill={MUTED}>
                    정산 시각까지의 익스포저
                  </text>
                  <text x={384} y={148} textAnchor="middle" fontSize={8} fill={MUTED}>
                    효율이 높을수록 커집니다
                  </text>
                </g>
              )}
              {step === 0 && (
                <text x={312} y={60} fontSize={8} fill={MUTED}>
                  여섯 건을 건별로 넘깁니다
                </text>
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
