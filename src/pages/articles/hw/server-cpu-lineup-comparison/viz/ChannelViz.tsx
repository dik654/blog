import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: MemoryChannels.tsx — 채널 수가 정하는 두 값 */
const SCENES = ["채널 수와 대역폭", "채널을 덜 채우면", "용량을 늘리면", "무엇이 병목인가"] as const;
const NOTES = [
  "12채널은 8채널보다 같은 속도 등급에서 1.5배의 대역폭을 갖습니다.",
  "채널을 다 채우지 않으면 그만큼 대역폭이 줄어듭니다. 모듈을 대칭으로 꽂아야 합니다.",
  "채널당 모듈을 둘로 늘리면 용량은 두 배지만 전기적 부하로 속도 등급이 내려갈 수 있습니다.",
  "가속기 사용률이 낮고 CPU 대기가 길면 데이터 공급이 병목입니다. 코어보다 채널을 먼저 봅니다.",
] as const;

const CH = "#6366f1";
const LOW = "#94a3b8";
const CAP = "#f59e0b";
const WARN = "#ef4444";

export default function ChannelViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const configs = [
    { n: "12채널 · 전부 채움", ch: 12, filled: 12, bw: 1.0 },
    { n: "8채널 · 전부 채움", ch: 8, filled: 8, bw: 0.67 },
  ];
  const partial = { n: "12채널 · 8개만 채움", ch: 12, filled: 8, bw: 0.67 };
  const rows = step === 1 ? [configs[0], partial] : configs;
  return (
    <VizFrame
      eyebrow="메모리 채널"
      title="채널 수가 대역폭과 용량을 함께 정합니다"
      description="같은 속도 등급에서 채널 구성만 바꿔 봅니다."
      note="실제 대역폭은 속도 등급과 모듈 종류에 따라 달라지며 그림은 비율만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="메모리 채널 구성 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {rows.map((c, i) => {
              const y = 44 + i * 62;
              return (
                <g key={c.n}>
                  <text x={24} y={y - 6} fontSize={9} fontWeight={700} fill={CH}>
                    {c.n}
                  </text>
                  {Array.from({ length: c.ch }, (_, k) => k).map((k) => (
                    <rect
                      key={k}
                      x={24 + k * 22}
                      y={y}
                      width={18}
                      height={20}
                      fill={k < c.filled ? CH : LOW}
                      fillOpacity={k < c.filled ? 0.3 : 0.08}
                      stroke={k < c.filled ? CH : LOW}
                      strokeWidth={1}
                    />
                  ))}
                  <rect x={300} y={y} width={c.bw * 140} height={20} fill={CH} fillOpacity={0.22} stroke={CH} strokeWidth={1} />
                  <text x={300 + c.bw * 140 + 6} y={y + 15} fontSize={8} fill={CH}>
                    ×{c.bw.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {step >= 2 && (
              <g>
                <rect x={24} y={168} width={200} height={26} fill={CAP} fillOpacity={0.1} stroke={CAP} strokeWidth={1.25} />
                <text x={124} y={185} textAnchor="middle" fontSize={9} fontWeight={700} fill={CAP}>
                  채널당 2모듈 → 용량 2배
                </text>
                <rect x={240} y={168} width={200} height={26} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1.25} />
                <text x={340} y={185} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  전기적 부하로 속도 등급 하락 가능
                </text>
              </g>
            )}
            {step === 3 && (
              <text x={24} y={158} fontSize={9} fontWeight={700} fill={WARN}>
                가속기 사용률이 낮고 CPU 대기가 길면 이 축부터 확인합니다
              </text>
            )}
            <text x={300} y={34} fontSize={9} fill={CH}>
              상대 대역폭
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
