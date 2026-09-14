import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·why-regulate — 한 칸의 손실이 그물을 타고 번지는 경로 */
const SCENES = [
  "한 은행에서 손실이 난다",
  "받을 것이 있던 곳으로 번진다",
  "급매가 남의 장부까지 깎는다",
  "그래서 결정과 비용이 어긋난다",
] as const;

const NOTES = [
  "자산이 깎이면 먼저 그 은행의 자본이 줄어듭니다. 여기까지는 그 은행의 문제입니다.",
  "정산 전에 무너지면 미결제 금액을 걸어 둔 상대가 그대로 손실을 봅니다.",
  "자산을 급히 팔면 가격이 내려가고, 같은 자산을 들고 있던 다른 기관의 장부도 함께 깎입니다.",
  "손실의 일부를 결정하지 않은 쪽이 치르므로, 각자에게 맡기면 사회가 원하는 만큼 자본이 쌓이지 않습니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const BANKS = [
  { id: "A", label: "은행 A", x: 40, y: 92 },
  { id: "B", label: "은행 B", x: 196, y: 46 },
  { id: "C", label: "은행 C", x: 196, y: 138 },
  { id: "D", label: "은행 D", x: 336, y: 92 },
];

const NODE_W = 84;
const NODE_H = 32;

/** 각 장면에서 손실이 닿은 기관 */
const HIT: Record<number, string[]> = {
  0: ["A"],
  1: ["A", "B"],
  2: ["A", "B", "C", "D"],
  3: ["A", "B", "C", "D"],
};

export default function ContagionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const hit = new Set(HIT[step]);

  return (
    <VizFrame
      eyebrow="손실의 전염"
      title="한 칸의 손실이 그물을 타고 다른 칸으로 옮겨 갑니다"
      description="직접 받을 것이 있던 경로와, 같은 자산을 들고 있어 값이 함께 깎이는 경로가 따로 있습니다."
      note="기관 수와 연결은 구조를 보이기 위한 단순화입니다. 실제 금융망은 훨씬 조밀하고 비은행 기관도 포함합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="손실이 번지는 세 경로"
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
              <line
                x1={BANKS[0].x + NODE_W}
                y1={BANKS[0].y + 10}
                x2={BANKS[1].x}
                y2={BANKS[1].y + NODE_H / 2}
                stroke={step >= 1 ? WARN : MUTED}
                strokeWidth={step >= 1 ? 1.25 : 1}
              />
              <text x={132} y={62} textAnchor="middle" fontSize={8} fill={step >= 1 ? WARN : MUTED}>
                미결제 잔액
              </text>

              <line
                x1={BANKS[1].x + NODE_W}
                y1={BANKS[1].y + NODE_H / 2}
                x2={BANKS[3].x}
                y2={BANKS[3].y + 10}
                stroke={step >= 2 ? WARN : MUTED}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <line
                x1={BANKS[2].x + NODE_W}
                y1={BANKS[2].y + NODE_H / 2}
                x2={BANKS[3].x}
                y2={BANKS[3].y + NODE_H - 8}
                stroke={step >= 2 ? WARN : MUTED}
                strokeWidth={1}
                strokeDasharray="4 3"
              />

              {step >= 2 && (
                <g>
                  <rect x={168} y={176} width={148} height={18} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1} />
                  <text x={242} y={189} textAnchor="middle" fontSize={8} fontWeight={700} fill={WARN}>
                    같은 자산을 함께 보유
                  </text>
                  <line x1={BANKS[2].x + 20} y1={BANKS[2].y + NODE_H} x2={200} y2={176} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                  <line x1={BANKS[3].x + 20} y1={BANKS[3].y + NODE_H} x2={290} y2={176} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                </g>
              )}

              {BANKS.map((bank) => {
                const struck = hit.has(bank.id);
                const color = struck ? WARN : OK;
                return (
                  <g key={bank.id}>
                    <rect
                      x={bank.x}
                      y={bank.y}
                      width={NODE_W}
                      height={NODE_H}
                      fill={color}
                      fillOpacity={struck ? 0.16 : 0.07}
                      stroke={color}
                      strokeWidth={struck ? 1.25 : 1}
                    />
                    <text x={bank.x + NODE_W / 2} y={bank.y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
                      {bank.label}
                    </text>
                  </g>
                );
              })}

              {step === 0 && (
                <text x={40} y={150} fontSize={9} fill={WARN}>
                  자산 하락 → 자본 감소
                </text>
              )}

              {step === 3 && (
                <g>
                  <rect x={340} y={26} width={132} height={52} fill={WARN} fillOpacity={0.06} stroke={WARN} strokeWidth={1} />
                  <text x={406} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    결정은 A가
                  </text>
                  <text x={406} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    비용은 B·C·D도
                  </text>
                  <text x={406} y={72} textAnchor="middle" fontSize={8} fill={MUTED}>
                    외부효과
                  </text>
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
