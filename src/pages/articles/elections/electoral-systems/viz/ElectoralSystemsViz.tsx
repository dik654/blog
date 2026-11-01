import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·disproportionality — 같은 표가 규칙과 지도에 따라 다른 의석이 된다 */
const SCENES = [
  "같은 표에서 시작한다",
  "소선거구 단순다수로 세면",
  "같은 표를 비례로 나누면",
  "규칙은 그대로 두고 지도만 바꾸면",
] as const;

const NAMES = ["가당", "나당", "다당"] as const;
const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 선거구 9곳 · 각 100표. 지도 A는 균등, 지도 B는 가당 표가 세 곳에 몰려 있다 */
const MAP_A: Array<readonly [number, number, number]> = Array.from({ length: 9 }, () => [44, 41, 15] as const);
const MAP_B: Array<readonly [number, number, number]> = [
  ...Array.from({ length: 3 }, () => [90, 5, 5] as const),
  ...Array.from({ length: 6 }, () => [21, 59, 20] as const),
];

const totals = (map: Array<readonly [number, number, number]>) =>
  map.reduce<[number, number, number]>(
    (acc, d) => [acc[0] + d[0], acc[1] + d[1], acc[2] + d[2]],
    [0, 0, 0],
  );

/** 각 선거구에서 1등만 의석을 가져가는 계산 */
function pluralitySeats(map: Array<readonly [number, number, number]>) {
  const seats = [0, 0, 0];
  const winners = map.map((d) => {
    const w = d.indexOf(Math.max(...d));
    seats[w] += 1;
    return w;
  });
  return { seats, winners };
}

/** 동트 방식: 몫이 큰 순서로 의석을 하나씩 준다 */
function dhondt(votes: readonly number[], total: number) {
  const seats = votes.map(() => 0);
  for (let s = 0; s < total; s += 1) {
    let best = 0;
    for (let i = 1; i < votes.length; i += 1) {
      if (votes[i] / (seats[i] + 1) > votes[best] / (seats[best] + 1)) best = i;
    }
    seats[best] += 1;
  }
  return seats;
}

/** Gallagher 최소제곱지수: 득표율과 의석률 차이의 제곱합을 반으로 나눈 뒤 제곱근 */
function lsq(votes: readonly number[], seats: readonly number[]) {
  const vSum = votes.reduce((a, b) => a + b, 0);
  const sSum = seats.reduce((a, b) => a + b, 0);
  const sq = votes.reduce((acc, v, i) => {
    const d = (v / vSum) * 100 - (seats[i] / sSum) * 100;
    return acc + d * d;
  }, 0);
  return Math.sqrt(sq / 2);
}

const GX = 26;
const GY = 42;
const CW = 44;
const CH = 30;

export default function ElectoralSystemsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  const map = step === 3 ? MAP_B : MAP_A;
  const votes = totals(map);
  const voteSum = votes.reduce((a, b) => a + b, 0);
  const { seats: fptp, winners } = pluralitySeats(map);
  const pr = dhondt(votes, 9);
  const seats = step === 2 ? pr : fptp;
  const showSeats = step >= 1;
  const index = lsq(votes, seats);

  const NOTES = [
    `선거구 아홉 곳이 있고 어디서나 득표가 똑같습니다. 전국 득표율은 ${NAMES.map((n, i) => `${n} ${((votes[i] / voteSum) * 100).toFixed(0)}%`).join(" · ")}이며, 이 숫자는 네 장면 내내 바뀌지 않습니다.`,
    `모든 선거구에서 가당이 1등이라 아홉 석을 전부 가져갑니다. ${((votes[0] / voteSum) * 100).toFixed(0)}%의 표가 100%의 의석이 되고, 나머지 ${((1 - votes[0] / voteSum) * 100).toFixed(0)}%의 표는 의석으로 전혀 바뀌지 않습니다.`,
    `같은 표를 전국 단위로 나누면 ${NAMES.map((n, i) => `${n} ${pr[i]}석`).join(" · ")}입니다. 득표율과 의석률의 차이를 하나의 수로 잰 값이 ${lsq(votes, fptp).toFixed(1)}에서 ${index.toFixed(1)}로 내려갑니다.`,
    `규칙도 전국 득표도 그대로 두고 선거구 경계만 다시 그었습니다. 가당의 표가 세 곳에 몰린 탓에 아홉 석을 전부 가져가던 당이 세 석만 가져갑니다. 표를 몰아 이기면 남는 표가 버려집니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="표에서 의석으로"
      title="같은 표가 규칙과 지도에 따라 전혀 다른 의석이 됩니다"
      description="전국 득표율을 고정해 두고 계산 규칙과 선거구 경계만 바꿔 봅니다."
      note="선거구 아홉 곳, 각 100표로 줄인 예입니다. 실제 선거에서는 유권자가 제도에 맞춰 투표를 바꾸므로 득표율 자체도 함께 움직입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 표가 다른 의석이 되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(30rem,calc(100svh-15rem))] sm:min-h-[23rem] sm:overflow-y-auto"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div
            className="mt-4 space-y-2 sm:hidden"
            role="img"
            aria-label={`${SCENES[step]}. 전국 득표는 같고, 선거구별 표와 의석 결과만 비교합니다.`}
          >
            <section className="border border-border p-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-foreground">
                  {step === 3 ? "선거구 지도 B" : "선거구 지도 A"}
                </p>
                <p className="text-[11px] leading-4 text-muted-foreground">
                  {step === 2 ? "경계를 쓰지 않음" : "각 칸이 한 선거구"}
                </p>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                {map.map((district, districtIndex) => {
                  const winner = winners[districtIndex];
                  const showWinner = step === 1 || step === 3;
                  return (
                    <div
                      key={districtIndex}
                      className="min-w-0 border px-1 py-1 text-center"
                      style={{
                        borderColor: step === 2 ? MUTED : COLORS[winner],
                        backgroundColor: step === 2 ? `${MUTED}0f` : `${COLORS[winner]}18`,
                      }}
                    >
                      <p className="text-[10px] font-semibold leading-3 tabular-nums text-muted-foreground">
                        {district.join("·")}
                      </p>
                      <p
                        className={`min-h-3 text-[11px] font-bold leading-3 ${showWinner ? "" : "invisible"}`}
                        style={{ color: COLORS[winner] }}
                        aria-hidden={!showWinner}
                      >
                        {NAMES[winner]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border border-border p-2">
              <p className="text-xs font-bold text-foreground">전국 득표율 · 네 장면 모두 고정</p>
              <div className="mt-1.5 space-y-1">
                {votes.map((vote, partyIndex) => {
                  const share = (vote / voteSum) * 100;
                  return (
                    <div key={NAMES[partyIndex]} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2">
                      <span className="text-[11px] font-bold" style={{ color: COLORS[partyIndex] }}>
                        {NAMES[partyIndex]}
                      </span>
                      <span className="h-2 border" style={{ borderColor: COLORS[partyIndex] }}>
                        <span
                          className="block h-full"
                          style={{ width: `${share}%`, backgroundColor: `${COLORS[partyIndex]}55` }}
                        />
                      </span>
                      <span className="text-right text-[11px] tabular-nums text-muted-foreground">
                        {share.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="min-h-[6.75rem] border border-border p-2">
              {showSeats ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-foreground">
                      의석 · {step === 2 ? "전국 비례 9석" : "소선거구 9석"}
                    </p>
                    <p className="text-[11px] font-bold" style={{ color: index > 20 ? WARN : COLORS[2] }}>
                      불비례 {index.toFixed(1)}
                    </p>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {seats.map((seatCount, partyIndex) => {
                      const share = (seatCount / 9) * 100;
                      return (
                        <div key={NAMES[partyIndex]} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2">
                          <span className="text-[11px] font-bold" style={{ color: COLORS[partyIndex] }}>
                            {NAMES[partyIndex]}
                          </span>
                          <span className="h-2 border" style={{ borderColor: COLORS[partyIndex] }}>
                            <span
                              className="block h-full"
                              style={{ width: `${Math.max(share, seatCount === 0 ? 0 : 1)}%`, backgroundColor: COLORS[partyIndex] }}
                            />
                          </span>
                          <span
                            className="text-right text-[11px] font-bold tabular-nums"
                            style={{ color: seatCount === 0 ? WARN : COLORS[partyIndex] }}
                          >
                            {seatCount}석
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">
                    불비례 값은 0에 가까울수록 득표율과 의석률이 비슷합니다.
                  </p>
                </>
              ) : (
                <div className="flex min-h-[5rem] items-center justify-center text-center">
                  <p className="text-xs leading-5 text-muted-foreground">
                    아직 의석을 계산하지 않았습니다.<br />다음 장면부터 같은 표를 서로 다른 규칙으로 셉니다.
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="mt-4 hidden w-full min-w-0 sm:block">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full max-w-2xl"
            >
              <text x={GX} y={GY - 12} fontSize={9} fontWeight={700} fill={MUTED}>
                {step === 3 ? "선거구 지도 B" : "선거구 지도 A"}
              </text>
              {map.map((d, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = GX + col * CW;
                const y = GY + row * CH;
                const w = winners[i];
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width={CW - 4}
                      height={CH - 4}
                      fill={step === 2 ? MUTED : COLORS[w]}
                      fillOpacity={step === 0 ? 0.08 : step === 2 ? 0.06 : 0.22}
                      stroke={step === 2 ? MUTED : COLORS[w]}
                      strokeWidth={1}
                    />
                    <text x={x + (CW - 4) / 2} y={y + 12} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                      {d.join("·")}
                    </text>
                    {step === 1 || step === 3 ? (
                      <text x={x + (CW - 4) / 2} y={y + 22} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS[w]}>
                        {NAMES[w]}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              {step === 2 && (
                <text x={GX + 1.5 * CW} y={GY + 3 * CH + 10} textAnchor="middle" fontSize={8} fill={MUTED}>
                  경계를 쓰지 않고 전국을 한 덩어리로 봅니다
                </text>
              )}

              <text x={192} y={GY - 12} fontSize={9} fontWeight={700} fill={MUTED}>
                전국 득표율
              </text>
              {votes.map((v, i) => {
                const y = GY + i * 18;
                const share = v / voteSum;
                return (
                  <g key={NAMES[i]}>
                    <text x={186} y={y + 10} textAnchor="end" fontSize={8.5} fontWeight={700} fill={COLORS[i]}>
                      {NAMES[i]}
                    </text>
                    <rect x={192} y={y} width={share * 160} height={12} fill={COLORS[i]} fillOpacity={0.25} stroke={COLORS[i]} strokeWidth={1} />
                    <text x={358} y={y + 10} fontSize={8.5} fill={MUTED}>
                      {(share * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })}

              {showSeats && (
                <g>
                  <text x={192} y={GY + 74} fontSize={9} fontWeight={700} fill={MUTED}>
                    의석률 · {step === 2 ? "전국 비례 9석" : "소선거구 9석"}
                  </text>
                  {seats.map((s, i) => {
                    const y = GY + 82 + i * 18;
                    const share = s / 9;
                    return (
                      <g key={NAMES[i]}>
                        <text x={186} y={y + 10} textAnchor="end" fontSize={8.5} fontWeight={700} fill={COLORS[i]}>
                          {NAMES[i]}
                        </text>
                        <rect x={192} y={y} width={Math.max(share * 160, 0.6)} height={12} fill={COLORS[i]} fillOpacity={0.65} stroke={COLORS[i]} strokeWidth={1} />
                        <text x={358} y={y + 10} fontSize={8.5} fontWeight={700} fill={s === 0 ? WARN : COLORS[i]}>
                          {s}석
                        </text>
                      </g>
                    );
                  })}
                  <text x={400} y={GY + 74} fontSize={9} fontWeight={700} fill={index > 20 ? WARN : COLORS[2]}>
                    불비례 {index.toFixed(1)}
                  </text>
                  <text x={400} y={GY + 88} fontSize={7.5} fill={MUTED}>
                    0에 가까울수록
                  </text>
                  <text x={400} y={GY + 98} fontSize={7.5} fill={MUTED}>
                    득표와 의석이 일치
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
