import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·both-better·inside-vs-outside 절. 네 숫자는 Ricardo(1817) 7장 */
const SCENES = [
  "네 숫자가 전부입니다",
  "포르투갈이 둘 다 적게 듭니다",
  "그래도 교역이 일어납니다",
  "같은 나라 안이라면 일어나지 않습니다",
] as const;

/** 한 해 동안 그 물건을 만드는 데 드는 사람 수 */
const COST = {
  england: { cloth: 100, wine: 120 },
  portugal: { cloth: 90, wine: 80 },
} as const;

const ENG = "#6366f1";
const POR = "#0ea5e9";
const MARK = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function FourNumbersViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `한 해 동안 그 물건을 만드는 데 드는 사람 수입니다. 영국은 옷감 ${COST.england.cloth}명, 포도주 ${COST.england.wine}명이 듭니다. 포르투갈은 옷감 ${COST.portugal.cloth}명, 포도주 ${COST.portugal.wine}명이 듭니다.`,
    `포르투갈이 둘 다 적게 듭니다. 옷감도 ${COST.portugal.cloth} 대 ${COST.england.cloth}으로 적고 포도주도 ${COST.portugal.wine} 대 ${COST.england.wine}으로 적습니다. 영국은 두 가지 모두에서 뒤집니다.`,
    `그런데도 포르투갈은 포도주를 보내고 옷감을 받아 옵니다. 영국은 ${COST.england.cloth}명이 한 해 일한 몫을 주고 포르투갈 ${COST.portugal.wine}명이 한 해 일한 몫을 받습니다. 왜 이런 교환이 성립하는지를 1단계에서 이미 봤습니다.`,
    `Ricardo가 바로 다음 문장에서 못 박는 것이 이 지점입니다. 같은 나라 안의 두 사람 사이에서는 ${COST.england.cloth}명분을 ${COST.portugal.wine}명분과 바꾸는 일이 일어나지 않습니다. 나라와 나라 사이에서만 일어납니다. 무엇이 둘을 가릅니까.`,
  ] as const;

  const rows = [
    { key: "cloth", label: "옷감" },
    { key: "wine", label: "포도주" },
  ] as const;

  return (
    <VizFrame
      eyebrow="네 숫자"
      title="한쪽이 둘 다 적게 드는데도 교역이 일어나고, 같은 나라 안에서는 일어나지 않습니다"
      description="같은 비율의 교환이 나라 사이에서는 성립하고 한 나라 안에서는 성립하지 않는다는 것이 이 장의 출발점입니다."
      note="네 숫자는 Ricardo 『On the Principles of Political Economy, and Taxation』(1817) 7장의 예시 그대로입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 나라의 생산에 드는 사람 수와 교환의 비율"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={118} y={38} fontSize={8.5} fontWeight={700} fill={ENG} textAnchor="middle">
                영국
              </text>
              <text x={232} y={38} fontSize={8.5} fontWeight={700} fill={POR} textAnchor="middle">
                포르투갈
              </text>
              <text x={20} y={38} fontSize={8} fontWeight={700} fill={MUTED}>
                드는 사람 수
              </text>

              {rows.map((r, i) => {
                const e = COST.england[r.key];
                const p = COST.portugal[r.key];
                const y = 62 + i * 46;
                return (
                  <g key={r.key}>
                    <text x={20} y={y + 16} fontSize={8.5} fontWeight={700} fill={INK}>
                      {r.label}
                    </text>
                    <rect x={72} y={y} width={e * 0.62} height={22} rx={2} fill={ENG} opacity={0.75} />
                    <text x={76 + e * 0.62} y={y + 15} fontSize={9} fontWeight={700} fill={ENG}>
                      {e}
                    </text>
                    <rect x={72} y={y + 24} width={p * 0.62} height={22} rx={2} fill={POR} opacity={0.75} />
                    <text x={76 + p * 0.62} y={y + 39} fontSize={9} fontWeight={700} fill={POR}>
                      {p}
                    </text>
                    {s === 1 && (
                      <text x={196} y={y + 39} fontSize={8} fontWeight={700} fill={MARK}>
                        포르투갈이 {e - p}명 적음
                      </text>
                    )}
                  </g>
                );
              })}

              {s >= 2 && (
                <g>
                  <line x1={296} y1={70} x2={360} y2={70} stroke={ENG} strokeWidth={1.25} />
                  <text x={328} y={64} fontSize={8} fontWeight={700} fill={ENG} textAnchor="middle">
                    옷감 {COST.england.cloth}명분 →
                  </text>
                  <line x1={296} y1={96} x2={360} y2={96} stroke={POR} strokeWidth={1.25} />
                  <text x={328} y={110} fontSize={8} fontWeight={700} fill={POR} textAnchor="middle">
                    ← 포도주 {COST.portugal.wine}명분
                  </text>
                  <text x={386} y={84} fontSize={14} fontWeight={700} fill={MARK}>
                    {COST.england.cloth} ↔ {COST.portugal.wine}
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={290} y={122} width={176} height={42} rx={4} fill={MARK} opacity={0.1} stroke={MARK} strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={378} y={140} fontSize={8} fontWeight={700} fill={MARK} textAnchor="middle">
                    같은 나라 안의 두 사람 사이
                  </text>
                  <text x={378} y={155} fontSize={8} fontWeight={700} fill={MARK} textAnchor="middle">
                    이 교환은 일어나지 않습니다
                  </text>
                </g>
              )}

              <text x={20} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "네 숫자가 이 장의 전부입니다"
                  : s === 1
                    ? "포르투갈이 옷감도 포도주도 적게 듭니다"
                    : s === 2
                      ? `영국은 ${COST.england.cloth}명분을 주고 ${COST.portugal.wine}명분을 받습니다`
                      : "같은 비율이 안에서는 성립하지 않습니다"}
              </text>
              <text x={20} y={196} fontSize={7.5} fill={MUTED}>
                숫자는 한 해 동안 그 물건을 만드는 데 드는 사람 수입니다
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
