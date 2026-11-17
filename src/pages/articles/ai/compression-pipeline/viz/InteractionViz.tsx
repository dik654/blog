import PipelineSceneShell from "./PipelineSceneShell";

/**
 * 본문 대응: #benchmark 첫 ExplainedFormula — throughput baseline 100, A 130, B 120, A+B 145.
 * 단독 gain 30·20, 합이라면 150, 실제 145 → interaction 145 − 150 = −5.
 */
const BASE = 100;
const A = 130;
const B = 120;
const AB = 145;
const ADDITIVE = BASE + (A - BASE) + (B - BASE);
const INTERACTION = AB - ADDITIVE;

const SCENES = [
  {
    label: "단독 gain",
    summary: "A +30 · B +20",
    note: "gain은 같은 workload에서 baseline보다 throughput이 얼마나 늘었는지입니다. A만 적용하면 100→130으로 +30, B만 적용하면 100→120으로 +20입니다.",
  },
  {
    label: "단독 효과의 합이라면",
    summary: "100 + 30 + 20 = 150",
    note: "두 gain이 서로 간섭하지 않는다면(additive) A+B는 baseline에 두 gain을 그대로 쌓은 150이어야 합니다. 이 막대는 측정값이 아니라 비교 기준선입니다.",
  },
  {
    label: "실제 결합 측정",
    summary: `145 − 150 = ${INTERACTION}`,
    note: "A+B를 같은 조건에서 측정하니 145입니다. baseline보다 빨라졌지만 합으로 기대한 150보다 5 적습니다. 0이면 additive, 양수면 synergy, 이 예처럼 음수면 서로의 이득을 깎은 interaction입니다.",
  },
] as const;

const W = 360;
const H = 190;
const LABEL_W = 78;
const RIGHT = 44;
const MAX = 160;
const ROW_H = 30;
const TOP = 14;
const sx = (value: number) => LABEL_W + (value / MAX) * (W - LABEL_W - RIGHT);

type Row = { key: string; label: string; value: number; gain: number; dashed?: boolean; show: number };

const ROWS: readonly Row[] = [
  { key: "base", label: "Baseline", value: BASE, gain: 0, show: 0 },
  { key: "a", label: "A만", value: A, gain: A - BASE, show: 0 },
  { key: "b", label: "B만", value: B, gain: B - BASE, show: 0 },
  { key: "sum", label: "합이라면", value: ADDITIVE, gain: ADDITIVE - BASE, dashed: true, show: 1 },
  { key: "ab", label: "A+B 측정", value: AB, gain: AB - BASE, show: 2 },
];

export default function InteractionViz() {
  return (
    <PipelineSceneShell
      eyebrow="결합 효과 · 설명용 throughput"
      title="결합 후보가 단독 gain의 합보다 덜 얻었는지 막대로 비교합니다"
      description="막대 길이는 throughput이고, 회색 부분은 baseline 100, 진한 부분은 baseline 위로 얻은 gain입니다. 숫자는 아래 식의 설명용 예시입니다."
      ariaLabel="baseline 100, A 130, B 120, 합 기대 150, 실제 A+B 145로 interaction -5 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, index) => {
            const y = TOP + index * ROW_H;
            const visible = active >= row.show;
            const color = row.key === "ab" ? "#2563eb" : row.key === "a" || row.key === "b" ? "#64748b" : "#94a3b8";
            return (
              <g key={row.key} opacity={visible ? 1 : 0}>
                <text x={0} y={y + 14} fontSize={11} fontWeight={row.key === "ab" ? 700 : 400} fill="#475569">{row.label}</text>
                <rect x={sx(0)} y={y + 3} width={sx(BASE) - sx(0)} height={16} rx={2} fill={row.dashed ? "none" : "#e2e8f0"} stroke={row.dashed ? "#94a3b8" : "none"} strokeWidth={1} strokeDasharray={row.dashed ? "3 2" : undefined} />
                {row.gain > 0 && (
                  <rect x={sx(BASE)} y={y + 3} width={sx(row.value) - sx(BASE)} height={16} rx={2} fill={row.dashed ? "none" : color} stroke={row.dashed ? "#64748b" : "none"} strokeWidth={1} strokeDasharray={row.dashed ? "3 2" : undefined} />
                )}
                <text x={(row.key === "ab" ? sx(ADDITIVE) : sx(row.value)) + 5} y={y + 15} fontSize={11} fontWeight={700} fill="#0f172a">
                  {row.value}
                </text>
                {row.gain > 0 && (
                  <text x={(sx(BASE) + sx(row.value)) / 2} y={y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={row.dashed ? "#475569" : "#ffffff"}>
                    +{row.gain}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={sx(BASE)} x2={sx(BASE)} y1={TOP} y2={TOP + ROWS.length * ROW_H - 6} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
          <g opacity={active >= 2 ? 1 : 0}>
            <line x1={sx(AB)} x2={sx(AB)} y1={TOP + 4 * ROW_H + 3} y2={TOP + 4 * ROW_H + 27} stroke="#dc2626" strokeWidth={1} />
            <line x1={sx(ADDITIVE)} x2={sx(ADDITIVE)} y1={TOP + 3 * ROW_H + 3} y2={TOP + 4 * ROW_H + 27} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={sx(AB)} x2={sx(ADDITIVE)} y1={TOP + 4 * ROW_H + 27} y2={TOP + 4 * ROW_H + 27} stroke="#dc2626" strokeWidth={1} />
            <text x={(sx(AB) + sx(ADDITIVE)) / 2} y={TOP + 5 * ROW_H + 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
              {INTERACTION}
            </text>
          </g>
          <text x={sx(BASE)} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">baseline 100</text>
        </svg>
      )}
    />
  );
}
