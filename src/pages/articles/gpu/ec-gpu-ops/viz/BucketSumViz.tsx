import SceneShell from "./SceneShell";

/**
 * 본문 대응: #msm-mapping — c=3이면 nonzero digit 1..7이 bucket[0..6]에 대응한다(digit 3 → bucket[2]).
 * 뒤에서부터 j=6..0: acc ← acc + bucket[j], res ← res + acc.
 * j를 처리한 뒤 res 안 bucket[i]의 개수는 i−j+1(i≥j)이므로 끝나면 bucket[i]가 i+1번 = 자기 digit만큼 들어간다.
 */
const BUCKETS = 7;
const ROWS = Array.from({ length: BUCKETS }, (_, n) => BUCKETS - 1 - n);
const ROW_H = 26;
const TOP = 38;
const SQ = 17;
const RES_X = 156;

const SCENES = [
  {
    label: "digit이 bucket을 고릅니다",
    summary: "digit 3 → bucket[2]",
    note: "digit 0은 건너뛰고, 0이 아니면 1을 줄인 index의 bucket에 point를 mixed-add합니다. 그래서 bucket[j]에는 digit이 j+1인 point가 모입니다.",
  },
  ...Array.from({ length: BUCKETS }, (_, s) => {
    const j = BUCKETS - 1 - s;
    return {
      label: `j = ${j}`,
      summary: j === 0 ? "res = 1·b₀ + 2·b₁ + … + 7·b₆" : `acc = b[${j}..6] · res 누적`,
      note:
        j === 6
          ? "acc와 res는 0(무한원점)에서 시작합니다. 맨 뒤 bucket[6]을 acc에, 그 acc를 res에 더합니다."
          : j === 0
            ? "j=0까지 마치면 bucket[i]가 i+1번, 곧 자기 digit만큼 res에 들어 있습니다. bucket에는 같은 digit의 point가 모여 있으므로 res는 이 window의 digit×point 합입니다."
            : `acc는 bucket[${j}]~bucket[6]의 합이 됩니다. 이 acc를 res에 더하므로 뒤쪽 bucket은 한 번씩 더 쌓입니다.`,
    };
  }),
] as const;

export default function BucketSumViz() {
  return (
    <SceneShell
      eyebrow="Bucket 누적"
      title="뒤에서부터 두 번 누적하면 bucket마다 자기 digit만큼 더해집니다"
      description="한 줄이 한 window의 bucket 하나입니다(c=3이라 7개). 가운데 칸은 acc에 그 bucket이 들어 있는지, 오른쪽 네모 개수는 res 안에 그 bucket이 몇 번 더해졌는지입니다. 반복은 acc ← acc + bucket[j], res ← res + acc를 j=6에서 0까지 합니다."
      note="point 값 대신 bucket이 res에 몇 번 들어갔는지만 셉니다. 본문 4절과 위 경로 Viz의 summation-by-parts 반복을 그대로 따랐습니다."
      ariaLabel="bucket 7개를 뒤에서부터 누적해 res에 각 bucket이 digit 값만큼 들어가는 과정"
      scenes={SCENES}
      render={(active) => {
        const j = BUCKETS - active;
        return (
          <svg viewBox="0 0 360 238" className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={14} y={22} fontSize={10.5} fill="#64748b">bucket · digit</text>
            <text x={122} y={22} textAnchor="middle" fontSize={10.5} fill="#64748b">acc</text>
            <text x={RES_X} y={22} fontSize={10.5} fill="#64748b">res 안의 개수</text>
            {ROWS.map((i, n) => {
              const y = TOP + n * ROW_H;
              const inAcc = i >= j;
              const count = i >= j ? i - j + 1 : 0;
              const current = i === j;
              const pick = active === 0 && i === 2;
              return (
                <g key={i}>
                  {(current || pick) && <rect x={8} y={y - 4} width={344} height={ROW_H - 4} rx={4} fill="none" stroke={pick ? "#0f766e" : "#2563eb"} strokeWidth={1} />}
                  <text x={14} y={y + 12} fontSize={11} fontWeight={current || pick ? 700 : 400} fill="#334155">
                    bucket[{i}] · {i + 1}
                  </text>
                  <rect x={114} y={y + 1} width={SQ} height={SQ - 2} rx={2} fill={inAcc ? "#d97706" : "none"} stroke={inAcc ? "#d97706" : "#cbd5e1"} strokeWidth={1} />
                  {Array.from({ length: BUCKETS }, (_, q) => (
                    <rect key={q} x={RES_X + q * (SQ + 3)} y={y + 1} width={SQ} height={SQ - 2} rx={2} fill={q < count ? "#2563eb" : "none"} stroke={q < count ? "#2563eb" : "#e2e8f0"} strokeWidth={1} />
                  ))}
                  <text x={350} y={y + 12} textAnchor="end" fontSize={11} fontWeight={700} fill={count > 0 ? "#2563eb" : "#94a3b8"}>
                    ×{count}
                  </text>
                </g>
              );
            })}
            {active === 0 && (
              <text x={14} y={TOP + BUCKETS * ROW_H + 8} fontSize={10.5} fontWeight={700} fill="#0f766e">digit 3인 point → bucket[2] += point</text>
            )}
          </svg>
        );
      }}
    />
  );
}
