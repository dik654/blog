import SceneShell from "./SeqSceneShell";

/**
 * 본문 대응: #provenance — 목표 mixture (.4,.4,.2), accepted mixture (.1,.7,.2).
 * slice별 차이 .3, .3, 0 → 합 .6 → 절반 G = .3.
 */
const TARGET = [0.4, 0.4, 0.2] as const;
const ACCEPTED = [0.1, 0.7, 0.2] as const;
const COLORS = ["#2563eb", "#d97706", "#64748b"] as const;
const DIFFS = TARGET.map((value, index) => Math.abs(value - ACCEPTED[index]));
const DIFF_SUM = DIFFS.reduce<number>((sum, value) => sum + value, 0);

const W = 360;
const L = 64;
const R = 344;
const BAR_H = 26;
const span = R - L;

const SCENES = [
  {
    label: "목표 mixture",
    summary: "π = (.4, .4, .2)",
    note: "배포 목표가 요구한 slice 비율입니다. Slice는 정해 둔 label 규칙으로 나눈 데이터 묶음이고, 막대 전체 길이가 1입니다.",
  },
  {
    label: "실제 accepted mixture",
    summary: "π̂ = (.1, .7, .2)",
    note: "Filter를 통과해 최종 dataset에 남은 비율입니다. 같은 길이 1의 막대 안에서 slice 1이 줄고 slice 2가 늘었습니다. 전체 개수가 많아도 이 비율은 따로 봐야 합니다.",
  },
  {
    label: "Slice별 차이",
    summary: "|.4−.1|=.3 · |.4−.7|=.3 · 0",
    note: "Slice 1은 .3 부족하고 slice 2는 .3 많으며 slice 3은 그대로입니다. 절댓값을 씌워 부족과 과잉의 방향을 없애고 크기만 셉니다.",
  },
  {
    label: "합의 절반이 G",
    summary: "(.3 + .3 + 0) ÷ 2 = .3",
    note: "두 막대 모두 합이 1이라 한쪽의 부족분 .3은 다른 쪽의 과잉분 .3과 같은 몫입니다. 차이 합 .6은 그 몫을 두 번 센 것이므로 절반인 G = .3을 coverage gap으로 읽습니다.",
  },
] as const;

function Stacked({ y, values, label }: { y: number; values: readonly number[]; label: string }) {
  const starts = values.map((_, index) => values.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
  return (
    <g>
      <text x={L - 8} y={y + BAR_H / 2 + 4} textAnchor="end" fontSize={11} fill="#475569">
        {label}
      </text>
      {values.map((value, index) => (
        <g key={index}>
          <rect x={L + starts[index] * span} y={y} width={value * span} height={BAR_H} fill={COLORS[index]} fillOpacity={0.75} stroke="#ffffff" strokeWidth={1} />
          <text x={L + (starts[index] + value / 2) * span} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
            {value.toFixed(1).replace("0.", ".")}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function CoverageGapViz() {
  return (
    <SceneShell
      eyebrow="Coverage gap"
      title="목표 비율과 실제 비율의 차이를 합해 절반으로 나눕니다"
      description="위 식 해석의 예를 그대로 씁니다. 막대 하나가 dataset 전체(합 1)이고 색 조각이 slice 1·2·3의 비율입니다."
      ariaLabel="목표 mixture .4 .4 .2와 accepted mixture .1 .7 .2의 slice별 차이와 G = .3"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 1, 2].map((index) => (
            <g key={index}>
              <rect x={L + index * 92} y={4} width={10} height={10} fill={COLORS[index]} fillOpacity={0.75} />
              <text x={L + index * 92 + 15} y={13} fontSize={11} fill="#475569">
                slice {index + 1}
              </text>
            </g>
          ))}
          <Stacked y={28} values={TARGET} label="목표 π" />
          {active >= 1 && <Stacked y={66} values={ACCEPTED} label="실제 π̂" />}
          {active >= 2 && (
            <g>
              <text x={L - 8} y={124} textAnchor="end" fontSize={11} fill="#475569">
                차이
              </text>
              <rect x={L} y={110} width={DIFFS[0] * span} height={20} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={L + (DIFFS[0] / 2) * span} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">
                slice 1 부족 .3
              </text>
              <rect x={L + DIFFS[0] * span} y={110} width={DIFFS[1] * span} height={20} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={L + (DIFFS[0] + DIFFS[1] / 2) * span} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">
                slice 2 과잉 .3
              </text>
              <text x={L + (DIFF_SUM + 0.2) * span} y={124} textAnchor="middle" fontSize={11} fill="#475569">
                slice 3: 0
              </text>
            </g>
          )}
          {active >= 3 && (
            <g>
              <line x1={L} x2={L + DIFF_SUM * span} y1={140} y2={140} stroke="#475569" strokeWidth={1} />
              <line x1={L} x2={L} y1={136} y2={144} stroke="#475569" strokeWidth={1} />
              <line x1={L + DIFF_SUM * span} x2={L + DIFF_SUM * span} y1={136} y2={144} stroke="#475569" strokeWidth={1} />
              <line x1={L + (DIFF_SUM / 2) * span} x2={L + (DIFF_SUM / 2) * span} y1={106} y2={150} stroke="#1d4ed8" strokeWidth={1.25} />
              <text x={L} y={166} fontSize={12} fill="#334155">
                차이 합 .6 ÷ 2
              </text>
              <text x={R} y={166} textAnchor="end" fontSize={14} fontWeight={700} fill="#1d4ed8">
                G = .3
              </text>
              <text x={L} y={186} fontSize={11} fill="#64748b">
                부족 .3과 과잉 .3은 같은 몫을 두 번 센 것
              </text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
