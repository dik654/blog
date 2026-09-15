import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·what-binds·distinguishing — 판단이 쌓여 규칙처럼 굳는 과정 */
const SCENES = [
  "첫 사건이 회색을 메운다",
  "다음 사건이 그 이유를 끌어온다",
  "다른 사실이면 갈라 세운다",
  "쌓이고 나면 조문에 없는 규칙이 선다",
] as const;

const NOTES = [
  "앞 글의 회색 지대에 사건이 하나 들어옵니다. 법원은 답을 내야 하므로 어딘가에 선을 긋고, 왜 그렇게 그었는지를 함께 적습니다.",
  "비슷한 사건이 오면 그 이유가 근거로 제시됩니다. 여기서 끌려오는 것은 앞 사건의 결론이 아니라 결론을 떠받친 이유이며, 곁들여 한 말은 끌려오지 않습니다.",
  "사실이 다르면 갈라 세울 수 있습니다. 앞 판단의 이유가 닿지 않는 차이를 짚어 범위를 좁히는 것이고, 이것이 뒤집지 않고도 방향을 바꾸는 통로가 됩니다.",
  "이 과정이 반복되면 조문에는 없는 선이 사실상 규칙이 됩니다. 앞 글에서 기준으로 두었던 영역이 시간이 지나며 규칙에 가까워진다는 뜻입니다.",
] as const;

const ACCENT = "#6366f1";
const AMBER = "#f59e0b";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const CASES = [
  { label: "사건 1", detail: "선을 긋고 이유를 적음", color: ACCENT },
  { label: "사건 2", detail: "그 이유를 끌어옴", color: OK },
  { label: "사건 3", detail: "사실이 달라 갈라 세움", color: AMBER },
  { label: "사건 4", detail: "굳은 선을 그대로 적용", color: MUTED },
] as const;

const BX = 26;
const BW = 100;
const GAP = 12;
const BY = 66;

export default function PrecedentChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="선례"
      title="한 사건에서 메운 회색은 그 사건과 함께 사라지지 않습니다"
      description="판단이 다음 사건의 근거가 되고, 반복되면 조문에 없는 선이 규칙처럼 굳습니다."
      note="네 사건으로 줄인 그림입니다. 실제로는 하급심과 상급심, 그리고 변경을 위한 별도 절차가 이 사이에 들어갑니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="판단이 쌓여 규칙이 되는 과정"
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
              <rect x={BX} y={26} width={4 * BW + 3 * GAP} height={22} fill={AMBER} fillOpacity={step === 3 ? 0.05 : 0.12} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
              <text x={BX + (4 * BW + 3 * GAP) / 2} y={41} textAnchor="middle" fontSize={9} fontWeight={700} fill={AMBER}>
                앞 글의 회색 지대 · 조문만 읽어서는 정해지지 않는 구간
              </text>

              {CASES.map((c, i) => {
                const shown = i <= step;
                const x = BX + i * (BW + GAP);
                return (
                  <g key={c.label}>
                    <rect
                      x={x}
                      y={BY}
                      width={BW}
                      height={40}
                      rx={4}
                      fill={c.color}
                      fillOpacity={shown ? 0.14 : 0.04}
                      stroke={shown ? c.color : MUTED}
                      strokeWidth={1}
                      strokeDasharray={shown ? undefined : "3 3"}
                    />
                    <text x={x + BW / 2} y={BY + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill={shown ? c.color : MUTED}>
                      {c.label}
                    </text>
                    <text x={x + BW / 2} y={BY + 31} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                      {c.detail}
                    </text>
                    {i > 0 && shown && (
                      <line x1={x - GAP} y1={BY + 20} x2={x} y2={BY + 20} stroke={i === 2 ? AMBER : MUTED} strokeWidth={1} strokeDasharray={i === 2 ? "3 3" : undefined} />
                    )}
                  </g>
                );
              })}

              {step === 0 && (
                <g>
                  <text x={BX} y={136} fontSize={9.5} fill={MUTED}>
                    법원은 답을 내야 하므로 어딘가에 선을 긋습니다
                  </text>
                  <text x={BX} y={154} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    그리고 왜 그렇게 그었는지를 함께 적습니다
                  </text>
                </g>
              )}

              {step === 1 && (
                <g>
                  <text x={BX} y={136} fontSize={9.5} fontWeight={700} fill={OK}>
                    끌려오는 것 · 결론을 떠받친 이유
                  </text>
                  <text x={BX} y={154} fontSize={9.5} fill={MUTED}>
                    끌려오지 않는 것 · 곁들여 한 말, 그 사건에만 있는 사정
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <text x={BX} y={136} fontSize={9.5} fontWeight={700} fill={AMBER}>
                    앞 판단의 이유가 닿지 않는 사실의 차이를 짚습니다
                  </text>
                  <text x={BX} y={154} fontSize={9.5} fill={MUTED}>
                    뒤집지 않고도 범위를 좁혀 방향을 바꾸는 통로입니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <rect x={BX} y={124} width={4 * BW + 3 * GAP} height={24} rx={3} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
                  <text x={BX + (4 * BW + 3 * GAP) / 2} y={140} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={WARN}>
                    조문에 없는 선이 사실상 규칙이 되었습니다
                  </text>
                  <text x={BX} y={166} fontSize={9} fill={MUTED}>
                    앞 글에서 기준으로 두었던 영역이 시간이 지나며 규칙에 가까워집니다
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
