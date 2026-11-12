import GroupSceneShell from "./GroupSceneShell";

/**
 * 본문 대응: #evidence — 평가 행 C·C·C·D, 손실 0·0·0·1(가정).
 * 행 평균 = (0+0+0+1)/4 = 0.25, 대상별 같은 무게 평균 = (C 평균 0 + D 평균 1)/2 = 0.50.
 * 손실이 0 또는 1이므로 띠에서 칠해진 폭의 비율이 곧 평균입니다.
 */
type Row = { id: string; entity: string; loss: number };

const ROWS: readonly Row[] = [
  { id: "r5", entity: "C", loss: 0 },
  { id: "r6", entity: "C", loss: 0 },
  { id: "r7", entity: "C", loss: 0 },
  { id: "r8", entity: "D", loss: 1 },
];

const ENTITIES = ["C", "D"];
const COLOR: Record<string, string> = { C: "#d97706", D: "#7c3aed" };

const ROW_MEAN = ROWS.reduce<number>((sum, row) => sum + row.loss, 0) / ROWS.length;
const ENTITY_MEANS = ENTITIES.map((entity) => {
  const own = ROWS.filter((row) => row.entity === entity);
  return own.reduce<number>((sum, row) => sum + row.loss, 0) / own.length;
});
const ENTITY_MEAN = ENTITY_MEANS.reduce<number>((sum, value) => sum + value, 0) / ENTITIES.length;

/** 각 행의 무게(합 1). 0번 장면은 행 평균과 같은 폭으로 그립니다. */
function weights(mode: "row" | "entity"): number[] {
  if (mode === "row") return ROWS.map(() => 1 / ROWS.length);
  return ROWS.map((row) => {
    const count = ROWS.filter((other) => other.entity === row.entity).length;
    return 1 / ENTITIES.length / count;
  });
}

const SCENES = [
  {
    label: "평가 행 4개, 대상 2명",
    summary: "행 4개 → 대상 2명",
    note: "C는 세 번, D는 한 번 관측됐습니다. 두 사람이 서로 독립에 가깝다는 가정 아래 새 대상에 대한 근거 반복은 행 수 4가 아니라 2명입니다. 칸 안의 숫자는 각 행의 손실(예측이 얼마나 틀렸는지, 0이면 맞음)이며 이해를 위한 가정입니다.",
  },
  {
    label: "행마다 같은 무게",
    summary: "(0+0+0+1) ÷ 4 = 0.25",
    note: "네 행에 1/4씩 무게를 주면 손실 1인 D의 칸은 띠의 1/4만 차지합니다. 칠해진 폭이 평균이므로 행 평균은 0.25입니다. C가 세 행이라 C가 평균을 더 많이 끌어당깁니다.",
  },
  {
    label: "대상마다 같은 무게",
    summary: "(0 + 1) ÷ 2 = 0.50",
    note: "먼저 대상 안에서 평균을 내면 C는 0, D는 1입니다. 두 사람에게 1/2씩 주면 D의 칸이 띠의 절반이 되어 평균은 0.50입니다. 어느 평균을 쓸지는 배포 목적에 맞춰 먼저 정합니다.",
  },
] as const;

const LEFT = 20;
const WIDTH = 320;
const STRIP_Y = 52;
const STRIP_H = 40;

export default function UnitMeanViz() {
  return (
    <GroupSceneShell
      eyebrow="행 수와 대상 수"
      title="같은 손실이라도 행에 무게를 주느냐, 사람에게 주느냐에 따라 평균이 달라집니다"
      description="8절의 예(가정)입니다. 평가 쪽 C의 세 행과 D의 한 행이 있고 손실은 C 0·0·0, D 1입니다. 띠 전체 폭이 무게 1이고, 손실 1인 칸만 칠했습니다."
      ariaLabel="평가 행 네 개의 손실을 행 평균과 대상별 평균으로 계산한 비교"
      scenes={SCENES}
      render={(active) => {
        const mode = active === 2 ? "entity" : "row";
        const w = weights(mode);
        const starts = w.map((_, index) => w.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
        const mean = active === 0 ? null : mode === "row" ? ROW_MEAN : ENTITY_MEAN;
        return (
          <svg viewBox="0 0 360 178" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={20} fontSize={11} fill="#64748b">
              {active === 0 ? "평가 행 4개 (칸 안 숫자 = 손실)" : mode === "row" ? "무게: 행마다 1/4" : "무게: 대상마다 1/2 (C의 세 행은 1/6씩)"}
            </text>
            {ROWS.map((row, index) => {
              const x = LEFT + starts[index] * WIDTH;
              const width = w[index] * WIDTH;
              return (
                <g key={row.id}>
                  <rect
                    x={x}
                    y={STRIP_Y}
                    width={width}
                    height={STRIP_H}
                    fill={row.loss === 1 && active > 0 ? COLOR[row.entity] : "#ffffff"}
                    fillOpacity={row.loss === 1 && active > 0 ? 0.55 : 0}
                    stroke={COLOR[row.entity]}
                    strokeWidth={1}
                    style={{ transition: "x 400ms ease, width 400ms ease" }}
                  />
                  <text x={x + width / 2} y={STRIP_Y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLOR[row.entity]}>
                    {row.entity}
                  </text>
                  <text x={x + width / 2} y={STRIP_Y + 32} textAnchor="middle" fontSize={11} fill="#64748b">
                    {row.loss}
                  </text>
                </g>
              );
            })}
            {active === 0 &&
              ENTITIES.map((entity) => {
                const idx = ROWS.map((row, index) => (row.entity === entity ? index : -1)).filter((index) => index >= 0);
                const x1 = LEFT + starts[idx[0]] * WIDTH + 4;
                const x2 = LEFT + (starts[idx[idx.length - 1]] + w[idx[idx.length - 1]]) * WIDTH - 4;
                return (
                  <g key={entity}>
                    <path d={`M${x1} 100 V106 H${x2} V100`} fill="none" stroke={COLOR[entity]} strokeWidth={1} />
                    <text x={(x1 + x2) / 2} y={122} textAnchor="middle" fontSize={11} fill={COLOR[entity]} fontWeight={700}>
                      {entity} · {idx.length}행 → 1명
                    </text>
                  </g>
                );
              })}
            {mean !== null && (
              <g>
                <path
                  d={`M${LEFT + WIDTH - mean * WIDTH + 2} 98 V104 H${LEFT + WIDTH - 2} V98`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={1.25}
                />
                <text x={LEFT + WIDTH - (mean * WIDTH) / 2} y={118} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
                  칠해진 폭 {mean.toFixed(2)}
                </text>
                <path d={`M${LEFT} 128 V134 H${LEFT + WIDTH} V128`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={LEFT + WIDTH / 2} y={148} textAnchor="middle" fontSize={10} fill="#64748b">
                  띠 전체 폭 = 무게 1
                </text>
                <text x={LEFT + WIDTH} y={170} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">
                  평균 = 칠해진 폭 ÷ 전체 폭 = {mean.toFixed(2)}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
