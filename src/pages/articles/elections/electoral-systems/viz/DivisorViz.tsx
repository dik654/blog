import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: proportional 의 AlgorithmBlock — 동트 방식이 의석을 하나씩 가져가는 과정 */
const SCENES = [
  "첫 석은 표가 가장 많은 당에",
  "세 석까지 · 몫이 반으로 줄며 순서가 바뀐다",
  "여섯 석까지 · 작은 당이 한 번 끼어든다",
  "아홉 석 전부 · 남은 몫과 잘린 몫",
] as const;

const TAKEN = [1, 3, 6, 9] as const;

const NAMES = ["가당", "나당", "다당"] as const;
const VOTES = [396, 369, 135] as const;
const DIVISORS = [1, 2, 3, 4] as const;

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

type Cell = { party: number; divisor: number; value: number };

/** 몫이 큰 순서로 줄을 세운다. 앞에서부터 k개가 지금까지 배분된 의석이다 */
const RANKED: Cell[] = NAMES.flatMap((_, party) =>
  DIVISORS.map((divisor) => ({ party, divisor, value: VOTES[party] / divisor })),
).sort((a, b) => b.value - a.value);

const TX = 96;
const CW = 84;
const TY = 46;
const RH = 30;

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

  const NOTES = [
    `표를 1로 나눈 몫이 그대로 첫 줄이 됩니다. ${NAMES[RANKED[0].party]}이 ${RANKED[0].value}로 가장 커서 첫 석을 가져갑니다.`,
    `의석을 받은 당은 다음 계산에서 나누는 수가 하나 커집니다. 그래서 ${NAMES[0]}의 몫이 ${VOTES[0]}에서 ${VOTES[0] / 2}로 줄고, 아직 한 석도 받지 못한 ${NAMES[1]}의 ${VOTES[1]}이 앞으로 나옵니다.`,
    `다섯 번째 자리에서 ${NAMES[2]}의 첫 몫 ${VOTES[2]}이 ${NAMES[0]}의 세 번째 몫 ${VOTES[0] / 3}보다 커서 한 석을 가져갑니다. 큰 당의 몫이 충분히 줄어드는 순간에만 작은 당의 차례가 옵니다.`,
    `아홉 석을 다 나누면 ${NAMES.map((n, i) => `${n} ${seats[i]}석`).join(" · ")}입니다. 열 번째 자리에 있던 ${NAMES[nextCell.party]}의 몫 ${nextCell.value}은 의석으로 바뀌지 못하고 잘립니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="비례 배분"
      title="나누어 떨어지지 않는 것을 순서대로 하나씩 나눕니다"
      description="표를 1·2·3…으로 나눈 몫을 한 줄로 세우고, 앞에서부터 의석 수만큼 끊습니다."
      note={`득표 ${VOTES.join(" · ")}, 나눌 의석 9석으로 둔 예입니다. 나누는 수를 1·3·5…로 바꾸면 작은 당이 더 일찍 들어오는 다른 방식이 됩니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="동트 방식의 의석 배분"
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
              {DIVISORS.map((d, c) => (
                <text key={d} x={TX + c * CW + CW / 2} y={TY - 10} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  ÷ {d}
                </text>
              ))}
              <text x={TX - 10} y={TY - 10} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                득표
              </text>

              {NAMES.map((name, p) => (
                <g key={name}>
                  <text x={TX - 10} y={TY + p * RH + 18} textAnchor="end" fontSize={9} fontWeight={700} fill={COLORS[p]}>
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
                          y={TY + p * RH + 15}
                          textAnchor="middle"
                          fontSize={9.5}
                          fontWeight={rank ? 700 : 400}
                          fill={rank ? COLORS[p] : MUTED}
                        >
                          {VOTES[p] / d}
                        </text>
                        {rank ? (
                          <text x={TX + c * CW + (CW - 6) / 2} y={TY + p * RH + 24} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={COLORS[p]}>
                            {rank}번째 의석
                          </text>
                        ) : isNext && step === 3 ? (
                          <text x={TX + c * CW + (CW - 6) / 2} y={TY + p * RH + 24} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={WARN}>
                            잘린 몫
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              ))}

              <text x={TX - 10} y={TY + 3 * RH + 22} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                지금까지
              </text>
              <text x={TX} y={TY + 3 * RH + 22} fontSize={9.5} fontWeight={700} fill={MUTED}>
                {k}석 배분 · {NAMES.map((n, i) => `${n} ${seats[i]}`).join(" · ")}
              </text>
              {step === 3 && (
                <text x={TX} y={TY + 3 * RH + 38} fontSize={9} fill={MUTED}>
                  의석이 하나씩만 있는 경계에서 누가 끊기는지가 제도의 성격을 정합니다
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
