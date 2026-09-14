import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·why-paper-binds — 종이가 조정 신호가 되어 힘을 묶는 경로 */
const SCENES = [
  "불만은 각자 다른 시점에 생긴다",
  "선을 미리 그어 둔다",
  "선을 넘으면 판단이 한 점에 모인다",
  "선이 흐리면 신호가 켜지지 않는다",
] as const;

const NOTES = [
  "각자 참을 수 있는 정도가 달라 저항이 흩어집니다. 흩어진 저항은 통치를 위협하지 못합니다.",
  "어디까지가 허용이고 어디부터가 위반인지를 문서로 못 박아 둡니다. 아직 아무 일도 일어나지 않았습니다.",
  "선을 넘는 순간 모두가 같은 시점에 같은 판단을 합니다. 지배자가 물러서는 이유는 이 조정 가능성입니다.",
  "조항이 모호하면 사람마다 다르게 읽혀 판단이 모이지 않고, 그러면 선을 넘어도 큰일이 생기지 않습니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 시민 여덟 명이 각자 참는 한계(가로 위치가 임계점) */
const CITIZENS = [18, 34, 52, 61, 74, 86, 95, 108];
const LINE_X = 240;

export default function PaperBindsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="헌법의 구속력"
      title="종이가 힘을 묶는 것은 판단을 한곳에 모으기 때문입니다"
      description="구속력은 문서 자체가 아니라 그 문서가 만들어 내는 조정 효과에서 나옵니다."
      note="시민을 여덟 명으로 줄이고 판단을 한 줄에 놓은 단순화입니다. 실제 저항의 조직에는 더 많은 조건이 필요합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="헌법이 조정 신호가 되는 경로"
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
              <line x1={24} y1={150} x2={456} y2={150} stroke={MUTED} strokeWidth={1} />
              <text x={24} y={170} fontSize={8} fill={MUTED}>
                지배자의 행위가 점점 심해지는 방향 →
              </text>

              {CITIZENS.map((limit, index) => {
                const x = 40 + limit * 2.6;
                const triggered =
                  step === 2 ? x <= LINE_X + 120 : step === 3 ? index % 3 === 0 : false;
                const color = triggered ? WARN : MUTED;
                return (
                  <g key={limit}>
                    <circle cx={x} cy={150} r={4} fill={color} fillOpacity={triggered ? 0.9 : 0.35} />
                    {step === 0 && (
                      <line x1={x} y1={146} x2={x} y2={126} stroke={MUTED} strokeWidth={1} />
                    )}
                  </g>
                );
              })}

              {step === 0 && (
                <text x={40} y={116} fontSize={9} fill={MUTED}>
                  각자의 인내 한계가 흩어져 있습니다
                </text>
              )}

              {step >= 1 && (
                <g>
                  <line
                    x1={LINE_X}
                    y1={40}
                    x2={LINE_X}
                    y2={160}
                    stroke={step === 3 ? MUTED : ACCENT}
                    strokeWidth={step === 3 ? 1 : 1.25}
                    strokeDasharray={step === 3 ? "3 5" : undefined}
                  />
                  <text
                    x={LINE_X + 6}
                    y={54}
                    fontSize={9}
                    fontWeight={700}
                    fill={step === 3 ? MUTED : ACCENT}
                  >
                    {step === 3 ? "모호한 선" : "헌법이 그은 선"}
                  </text>
                  <text x={LINE_X + 6} y={68} fontSize={8} fill={MUTED}>
                    {step === 3 ? "읽는 사람마다 위치가 다름" : "여기부터 위반"}
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <rect x={40} y={86} width={300} height={28} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
                  <text x={190} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    같은 시점에 같은 판단 · 저항이 한꺼번에 조직될 수 있음
                  </text>
                  <text x={350} y={104} fontSize={9} fontWeight={700} fill={OK}>
                    그래서 물러선다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  {[LINE_X - 46, LINE_X, LINE_X + 52].map((x, index) => (
                    <line key={index} x1={x} y1={96} x2={x} y2={160} stroke={MUTED} strokeWidth={1} strokeDasharray="3 5" />
                  ))}
                  <text x={40} y={110} fontSize={9} fontWeight={700} fill={MUTED}>
                    누구는 넘었다 하고 누구는 아니라 합니다
                  </text>
                  <text x={40} y={128} fontSize={9} fontWeight={700} fill={WARN}>
                    판단이 모이지 않아 선을 넘어도 조용합니다
                  </text>
                </g>
              )}

              {step === 1 && (
                <text x={40} y={116} fontSize={9} fill={MUTED}>
                  선이 뚜렷할수록, 그리고 널리 알려질수록 뒤 장면이 강해집니다
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
