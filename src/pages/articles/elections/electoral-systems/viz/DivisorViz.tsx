import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: proportional 의 AlgorithmBlock — 동트 방식이 의석을 하나씩 가져가는 과정 */
const SCENES = [
  "첫 의석은 표가 가장 많은 정당에",
  "세 번째 의석까지 · 몫이 줄며 순서가 바뀐다",
  "여섯 번째 의석까지 · 작은 정당에도 차례가 온다",
  "아홉 의석을 나눈 뒤 · 배분선 밖에 남은 몫",
] as const;

const TAKEN = [1, 3, 6, 9] as const;

const NAMES = ["가당", "나당", "다당"] as const;
const VOTES = [396, 369, 135] as const;
// 9석을 나눈 다음 경계(10번째 몫)까지 보여 주려면 4석을 받은
// 가당·나당의 다음 몫인 ÷5 열이 필요하다.
const DIVISORS = [1, 2, 3, 4, 5] as const;

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

type Cell = { party: number; divisor: number; value: number };

/** 몫이 큰 순서로 줄을 세운다. 앞에서부터 k개가 지금까지 배분된 의석이다 */
const RANKED: Cell[] = NAMES.flatMap((_, party) =>
  DIVISORS.map((divisor) => ({ party, divisor, value: VOTES[party] / divisor })),
).sort((a, b) => b.value - a.value);

const TX = 80;
const CW = 70;
const TY = 50;
const RH = 36;

export default function DivisorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const k = TAKEN[step];
  const rankOf = (party: number, divisor: number) => {
    const i = RANKED.findIndex((c) => c.party === party && c.divisor === divisor);
    return i < k ? i + 1 : null;
  };
  const seats = NAMES.map((_, p) => RANKED.slice(0, k).filter((c) => c.party === p).length);
  const nextCell = RANKED[k];
  const visibleCells = RANKED.slice(0, k + 1);

  const NOTES = [
    `표를 1로 나눈 몫이 그대로 첫 줄이 됩니다. ${NAMES[RANKED[0].party]}이 ${RANKED[0].value}으로 가장 커서 첫 석을 가져갑니다.`,
    `의석을 받은 당은 다음 계산에서 나누는 수가 하나 커집니다. 그래서 ${NAMES[0]}의 몫이 ${VOTES[0]}에서 ${VOTES[0] / 2}로 줄고, 아직 한 석도 받지 못한 ${NAMES[1]}의 ${VOTES[1]}이 앞으로 나옵니다.`,
    `다섯 번째 자리에서 ${NAMES[2]}의 첫 몫 ${VOTES[2]}이 ${NAMES[0]}의 세 번째 몫 ${VOTES[0] / 3}보다 커서 한 석을 가져갑니다. 큰 당의 몫이 충분히 줄어드는 순간에만 작은 당의 차례가 옵니다.`,
    `아홉 석을 다 나누면 ${NAMES.map((n, i) => `${n} ${seats[i]}석`).join(" · ")}입니다. 열 번째 자리에 놓인 ${NAMES[nextCell.party]}의 몫 ${nextCell.value}는 배분선 바로 밖에 남습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="비례 배분"
      title="소수점으로 남는 의석을 큰 몫부터 배분합니다"
      description="표를 1·2·3…으로 나눈 몫을 큰 순서로 세우고, 의석 수만큼 고릅니다."
      note={`득표 ${VOTES.join(" · ")}, 나눌 의석 9석으로 둔 예입니다. 1·3·5… 방식도 첫 몫은 같습니다. 한 석 뒤의 다음 몫부터 더 작아져 경계 의석이 달라질 수 있습니다.`}
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="동트 방식의 의석 배분"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center sm:min-h-[30.5rem]">
          <p className="text-[11px] font-black text-primary">
            장면 · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div
            className="mt-4 grid grid-cols-2 gap-2 sm:hidden"
            role="img"
            aria-label={`${SCENES[step]}의 큰 몫 순서`}
          >
            {visibleCells.map((cell, index) => {
              const selected = index < k;
              const cut = step === 3 && index === k;
              return (
                <div
                  key={`${cell.party}-${cell.divisor}`}
                  className={`min-w-0 border px-3 py-2 ${cut ? "border-dashed border-destructive" : "border-border"}`}
                  style={{
                    backgroundColor: selected ? `${COLORS[cell.party]}18` : "transparent",
                    borderColor: selected ? COLORS[cell.party] : undefined,
                  }}
                >
                  <p
                    className="text-[11px] font-bold leading-4"
                    style={{ color: selected ? COLORS[cell.party] : MUTED }}
                  >
                    {index + 1} · {NAMES[cell.party]}
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold leading-5 tabular-nums text-foreground">
                    {VOTES[cell.party]} ÷ {cell.divisor} = {cell.value}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] font-semibold leading-4"
                    style={{ color: cut ? WARN : selected ? COLORS[cell.party] : MUTED }}
                  >
                    {selected
                      ? `${index + 1}번째 의석`
                      : cut
                        ? "배분선 밖에 남은 몫"
                        : "다음 후보"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 hidden w-full min-w-0 sm:block">
            <svg
              viewBox="0 0 450 230"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full max-w-2xl"
            >
              {DIVISORS.map((d, c) => (
                <text key={d} x={TX + c * CW + CW / 2} y={TY - 10} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={MUTED}>
                  ÷ {d}
                </text>
              ))}
              <text x={TX - 10} y={TY - 10} textAnchor="end" fontSize={11.5} fontWeight={700} fill={MUTED}>
                득표
              </text>

              {NAMES.map((name, p) => (
                <g key={name}>
                  <text x={TX - 10} y={TY + p * RH + 20} textAnchor="end" fontSize={11.5} fontWeight={700} fill={COLORS[p]}>
                    {name} {VOTES[p]}
                  </text>
                  {DIVISORS.map((d, c) => {
                    const rank = rankOf(p, d);
                    const isNext = nextCell && nextCell.party === p && nextCell.divisor === d;
                    return (
                      <g key={d}>
                        <rect
                          x={TX + c * CW}
                          y={TY + p * RH}
                          width={CW - 6}
                          height={RH - 6}
                          fill={rank ? COLORS[p] : MUTED}
                          fillOpacity={rank ? 0.22 : 0.05}
                          stroke={rank ? COLORS[p] : isNext && step === 3 ? WARN : MUTED}
                          strokeWidth={1}
                          strokeDasharray={isNext && step === 3 ? "3 3" : undefined}
                        />
                        <text
                          x={TX + c * CW + (CW - 6) / 2}
                          y={TY + p * RH + 17}
                          textAnchor="middle"
                          fontSize={11.5}
                          fontWeight={rank ? 700 : 400}
                          fill={rank ? COLORS[p] : MUTED}
                        >
                          {VOTES[p] / d}
                        </text>
                        {rank ? (
                          <text x={TX + c * CW + (CW - 6) / 2} y={TY + p * RH + 28} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={COLORS[p]}>
                            {rank}번째 의석
                          </text>
                        ) : isNext && step === 3 ? (
                          <text x={TX + c * CW + (CW - 6) / 2} y={TY + p * RH + 28} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={WARN}>
                            배분선 밖
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              ))}

              <text x={TX - 10} y={TY + 3 * RH + 22} textAnchor="end" fontSize={10.5} fontWeight={700} fill={MUTED}>
                지금까지
              </text>
              <text x={TX} y={TY + 3 * RH + 22} fontSize={10.5} fontWeight={700} fill={MUTED}>
                {k}석 배분 · {NAMES.map((n, i) => `${n} ${seats[i]}`).join(" · ")}
              </text>
              {step === 3 && (
                <text x={TX} y={TY + 3 * RH + 39} fontSize={10.5} fill={MUTED}>
                  배분선 바로 밖에 놓인 몫은 다음 의석을 받지 못합니다
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
