import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·two-errors — 오판은 두 종류이고 무게가 다르다 */
const SCENES = [
  "판정과 사실을 곱하면 네 칸이 된다",
  "무고한 사람을 벌하는 칸",
  "한 사람을 놓아주는 칸",
  "두 칸의 무게가 같지 않다",
] as const;

const NOTES = [
  "실제로 했는지와 유죄로 판정했는지를 곱하면 네 칸이 나옵니다. 대각선 두 칸은 맞은 것이고 나머지 두 칸이 틀린 것입니다.",
  "한 칸은 하지 않은 사람을 벌하는 경우입니다. 그 사람은 막을 방법이 없었고, 되돌릴 수도 없으며, 그 사실이 알려지면 다른 사람들의 판단도 함께 흔들립니다.",
  "다른 칸은 한 사람을 놓아주는 경우입니다. 손해가 남고 억제가 약해지지만, 그 사람에게 없던 불이익이 새로 생기지는 않습니다.",
  "두 칸이 같은 무게였다면 문턱은 반반에 놓였을 것입니다. 무게가 다르다면 문턱도 한쪽으로 옮겨야 하고, 얼마나 옮길지는 두 무게의 비가 정합니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const AMBER = "#f59e0b";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const GX = 150;
const GY = 50;
const CW = 138;
const CH = 44;

export default function TwoErrorsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  const cells = [
    { col: 0, row: 0, label: "맞게 벌함", color: OK, focus: false },
    { col: 1, row: 0, label: "무고한 유죄", color: WARN, focus: step === 1 || step === 3 },
    { col: 0, row: 1, label: "놓아줌", color: AMBER, focus: step === 2 || step === 3 },
    { col: 1, row: 1, label: "맞게 풀어 줌", color: OK, focus: false },
  ];

  return (
    <VizFrame
      eyebrow="두 종류의 잘못"
      title="틀리는 방식이 둘이고 둘의 무게가 같지 않습니다"
      description="무게가 다르면 얼마나 확실해야 벌할지의 문턱도 한쪽으로 옮겨야 합니다."
      note="실제로 했는지를 알 수 있다고 두고 그린 그림입니다. 판정하는 자리에서는 그것을 알 수 없다는 점이 이 문제의 출발점입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="판정과 사실이 만드는 네 칸"
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
              <text x={GX + CW} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                실제로 했는가
              </text>
              <text x={GX + CW / 2} y={42} textAnchor="middle" fontSize={9} fill={MUTED}>
                했다
              </text>
              <text x={GX + CW + CW / 2} y={42} textAnchor="middle" fontSize={9} fill={MUTED}>
                하지 않았다
              </text>
              <text x={20} y={GY - 8} fontSize={9} fontWeight={700} fill={MUTED}>
                판정
              </text>
              <text x={20} y={GY + CH / 2 + 4} fontSize={9} fill={MUTED}>
                유죄
              </text>
              <text x={20} y={GY + CH + CH / 2 + 4} fontSize={9} fill={MUTED}>
                무죄
              </text>

              {cells.map((cell) => {
                const x = GX + cell.col * CW;
                const y = GY + cell.row * CH;
                return (
                  <g key={cell.label}>
                    <rect
                      x={x}
                      y={y}
                      width={CW}
                      height={CH}
                      fill={cell.color}
                      fillOpacity={cell.focus ? 0.24 : step === 0 ? 0.1 : 0.05}
                      stroke={cell.color}
                      strokeWidth={cell.focus ? 1.25 : 1}
                    />
                    <text
                      x={x + CW / 2}
                      y={y + 27}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill={cell.focus || step === 0 ? cell.color : MUTED}
                    >
                      {cell.label}
                    </text>
                  </g>
                );
              })}

              {step === 1 && (
                <g>
                  <text x={20} y={158} fontSize={9.5} fontWeight={700} fill={WARN}>
                    막을 방법이 없었고, 되돌릴 수 없으며, 다른 사람들의 판단도 흔들립니다
                  </text>
                  <text x={20} y={178} fontSize={9} fill={MUTED}>
                    조심해서 피할 수 있는 종류의 불이익이 아닙니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <text x={20} y={158} fontSize={9.5} fontWeight={700} fill={AMBER}>
                    손해가 남고 억제가 약해집니다
                  </text>
                  <text x={20} y={178} fontSize={9} fill={MUTED}>
                    다만 그 사람에게 없던 불이익이 새로 생기지는 않습니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={20} y={152} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    두 무게가 같았다면 문턱은 반반에 놓였을 것입니다
                  </text>
                  <text x={20} y={172} fontSize={9.5} fontWeight={700} fill={WARN}>
                    다르다면 얼마나 옮길지는 두 무게의 비가 정합니다
                  </text>
                </g>
              )}

              {step === 0 && (
                <text x={20} y={158} fontSize={9.5} fill={MUTED}>
                  대각선 두 칸은 맞은 것이고 나머지 두 칸이 틀린 것입니다
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
