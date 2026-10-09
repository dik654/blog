import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·two-ratios·per-head 절. 숫자는 Malthus(1798) 초판 24~26쪽 */
const SCENES = [
  "섬 하나를 100년 동안 따라갑니다",
  "한쪽은 곱으로, 다른 쪽은 더하기로 늡니다",
  "두 줄을 나누면 한 사람 몫이 나옵니다",
  "더 멀리 가면 차이가 벌어집니다",
] as const;

/** Malthus 21~24쪽: 섬 인구 700만에서 시작해 25년마다 두 배(100년 뒤 숫자는 24쪽) */
const START = 7;
const STEPS = [0, 25, 50, 75, 100] as const;
const people = (i: number) => START * 2 ** i;
/** 식량은 25년마다 지금 생산량만큼씩 더해집니다 */
const food = (i: number) => START * (i + 1);

/** Malthus 25쪽("512 to 10"은 26쪽 첫 줄): 세계로 넓혔을 때의 두 수열 */
const WORLD_P = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512] as const;
const WORLD_F = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const POP = "#ef4444";
const FOOD = "#0ea5e9";
const SHORT = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

/** 100만 단위의 수를 한국어 자릿수로 적습니다. 112 → 1억 1,200만 */
const man = (n: number) =>
  n >= 100
    ? `${Math.floor(n / 100)}억 ${((n % 100) * 100).toLocaleString("ko-KR")}만`
    : `${(n * 100).toLocaleString("ko-KR")}만`;

const X0 = 74;
const COL = 56;
const BASE = 150;

export default function TwoRatiosViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const last = STEPS.length - 1;
  const SHORTFALL = people(last) - food(last);

  const NOTES = [
    `섬 인구가 ${man(START)}이고 지금 거두는 양이 딱 그만큼을 먹여 살린다고 둡니다. 시작점에서는 모자람이 없습니다. 이 한 줄이 이후 100년 셈의 출발점입니다.`,
    `인구는 25년마다 두 배가 되어 ${man(people(1))}, ${man(people(2))}, ${man(people(3))}, ${man(people(4))}이 됩니다. 식량은 25년마다 지금 거두는 양만큼씩 더해져 ${man(food(1))}분, ${man(food(2))}분, ${man(food(3))}분, ${man(food(4))}분이 됩니다. 두 줄이 늘어나는 방식이 다릅니다.`,
    `100년 뒤 인구는 ${man(people(last))}인데 먹일 수 있는 것은 ${man(food(last))}분입니다. ${man(SHORTFALL)} 명분이 비어 있습니다. 총량은 양쪽 다 늘었는데 한 사람에게 돌아가는 몫은 1에서 ${(food(last) / people(last)).toFixed(2)}로 내려갔습니다.`,
    `같은 셈을 세계로 넓히면 인구가 1·2·4·8로 가는 동안 식량은 1·2·3·4로 갑니다. 225년 뒤에는 ${WORLD_P[9]} 대 ${WORLD_F[9]}입니다. 곱으로 느는 것과 더해서 느는 것의 차이는 시간이 갈수록 좁혀지지 않습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 줄의 늘어남"
      title="총량은 둘 다 늘어나는데 한 사람 몫은 내려갑니다"
      description="늘어나는 방식이 곱이냐 더하기냐가 다르면, 두 줄을 나눈 값은 시간이 갈수록 한쪽으로 기웁니다."
      note="숫자는 Malthus(1798) 초판 21~26쪽의 예시 그대로입니다. 단위는 그가 쓴 100만 명입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="인구와 식량이 다른 방식으로 늘어날 때 한 사람 몫의 변화"
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
              {s <= 2 && (
                <g>
                  <text x={14} y={34} fontSize={8} fontWeight={700} fill={MUTED}>
                    지난 햇수
                  </text>
                  {STEPS.map((y, i) => (
                    <text key={y} x={X0 + i * COL} y={34} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                      {y}년
                    </text>
                  ))}

                  {STEPS.map((_, i) => {
                    const show = s === 0 ? i === 0 : true;
                    if (!show) return null;
                    const ph = people(i) * 0.75;
                    const fh = food(i) * 0.75;
                    return (
                      <g key={i}>
                        <rect x={X0 + i * COL - 20} y={BASE - ph} width={18} height={ph} rx={2} fill={POP} opacity={0.75} />
                        <rect x={X0 + i * COL + 2} y={BASE - fh} width={18} height={fh} rx={2} fill={FOOD} opacity={0.75} />
                        <text x={X0 + i * COL - 11} y={BASE - ph - 5} fontSize={7.5} fontWeight={700} fill={POP} textAnchor="middle">
                          {people(i)}
                        </text>
                        <text x={X0 + i * COL + 11} y={BASE - fh - 5} fontSize={7.5} fontWeight={700} fill={FOOD} textAnchor="middle">
                          {food(i)}
                        </text>
                        {s === 2 && (
                          <text x={X0 + i * COL} y={BASE + 14} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                            {(food(i) / people(i)).toFixed(2)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <line x1={X0 - 30} y1={BASE} x2={X0 + 4 * COL + 26} y2={BASE} stroke={MUTED} strokeWidth={0.75} />
                  {s === 2 && (
                    <text x={14} y={BASE + 14} fontSize={8} fontWeight={700} fill={INK}>
                      한 사람 몫
                    </text>
                  )}
                </g>
              )}

              {s === 3 && (
                <g>
                  <text x={14} y={40} fontSize={8} fontWeight={700} fill={POP}>
                    사람
                  </text>
                  <text x={14} y={68} fontSize={8} fontWeight={700} fill={FOOD}>
                    먹일 수 있는 양
                  </text>
                  {WORLD_P.map((v, i) => (
                    <text key={`p${i}`} x={96 + i * 33} y={40} fontSize={8.5} fontWeight={700} fill={POP} textAnchor="middle">
                      {v}
                    </text>
                  ))}
                  {WORLD_F.map((v, i) => (
                    <text key={`f${i}`} x={96 + i * 33} y={68} fontSize={8.5} fontWeight={700} fill={FOOD} textAnchor="middle">
                      {v}
                    </text>
                  ))}
                  <text x={96} y={90} fontSize={7.5} fill={MUTED} textAnchor="middle">
                    지금
                  </text>
                  <text x={96 + 9 * 33} y={90} fontSize={7.5} fill={MUTED} textAnchor="middle">
                    225년 뒤
                  </text>
                  <text x={240} y={124} fontSize={15} fontWeight={700} fill={SHORT} textAnchor="middle">
                    {WORLD_P[9]} 대 {WORLD_F[9]}
                  </text>
                  <text x={240} y={144} fontSize={8} fill={MUTED} textAnchor="middle">
                    한 사람 몫은 {(WORLD_F[9] / WORLD_P[9]).toFixed(3)}
                  </text>
                </g>
              )}

              {/* 범례 */}
              {s <= 2 && (
                <g>
                  {[
                    { color: POP, label: "사람" },
                    { color: FOOD, label: "먹일 수 있는 양" },
                  ].map((row, i) => (
                    <g key={row.label}>
                      <rect x={372} y={42 + i * 18} width={12} height={8} rx={2} fill={row.color} opacity={0.75} />
                      <text x={390} y={50 + i * 18} fontSize={8} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {s === 2 && (
                <g>
                  <text x={372} y={96} fontSize={8} fontWeight={700} fill={MUTED}>
                    100년 뒤 모자람
                  </text>
                  <text x={372} y={118} fontSize={14} fontWeight={700} fill={SHORT}>
                    {man(SHORTFALL)} 명
                  </text>
                </g>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `시작점에서는 ${man(START)}과 ${man(START)}분이 딱 맞습니다`
                  : s === 1
                    ? "두 줄 다 늘어나지만 늘어나는 방식이 다릅니다"
                    : s === 2
                      ? `한 사람 몫이 1에서 ${(food(last) / people(last)).toFixed(2)}로 내려갔습니다`
                      : "곱과 더하기의 차이는 시간이 갈수록 벌어집니다"}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                단위는 100만 명과 100만 명분입니다
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
