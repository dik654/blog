import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sample-correction — 세 번 뽑는 64개 순서의 표본평균 거리 합.
 * 거리 합 0: 10개, 2/3: 36개, 2: 12개, 8/3: 6개. 전체 합 0+24+24+16=64 → 평균 1.
 * 분모 3의 평균 1/3, 분모 2의 평균 1/2. 1·2·3 묶음은 거리 합 2의 12개 순서에 든다.
 */
const ROWS = [
  { sum: "0", total: 10, by3: "0", by2: "0", example: "2·2·2 등" },
  { sum: "2/3", total: 36, by3: "2/9", by2: "1/3", example: "1·1·2 등" },
  { sum: "2", total: 12, by3: "2/3", by2: "1", example: "1·2·3 등" },
  { sum: "8/3", total: 6, by3: "8/9", by2: "4/3", example: "1·1·3 등" },
] as const;

const SCENES = [
  { label: "64개 순서", summary: "4³ = 64칸", note: "네모 하나가 세 번 뽑는 순서 하나이고 비중은 모두 같습니다. 각 묶음의 표본평균에서 잰 거리 합별로 모았습니다.", column: "sum", marker: null, highlight: -1 },
  { label: "거리 합의 평균", summary: "(0 + 24 + 24 + 16) / 64 = 1", note: "거리 합 × 개수를 모으면 64, 나누면 1입니다. 위 식의 (n−1)σ² = 2·1/2 = 1과 같습니다.", column: "sum", marker: 1, highlight: -1 },
  { label: "분모 3", summary: "값들의 평균 1/3", note: "각 거리 합을 3으로 나눈 값을 64개 전부 평균하면 1/3입니다. 목표인 원래 분산 1/2보다 작습니다.", column: "by3", marker: 1 / 3, highlight: -1 },
  { label: "분모 2", summary: "값들의 평균 1/2", note: "2로 나누면 평균이 1/2로 목표와 같습니다. 맞는 것은 64개 전체의 반복 평균입니다.", column: "by2", marker: 1 / 2, highlight: -1 },
  { label: "한 묶음은", summary: "1·2·3 → 1 ≠ 1/2", note: "1·2·3 한 묶음의 추정값 1은 주황 줄의 값 하나일 뿐이고 반복 평균 1/2과 다른 양입니다. 값이 0인 묶음도 있습니다.", column: "by2", marker: 1 / 2, highlight: 2 },
] as const;

const W = 360;
const LABEL = 62;
const CELL = 6.5;
const ROW_H = 30;
const AX0 = 30;
const AX1 = 320;
const ax = (value: number) => AX0 + (value / (4 / 3)) * (AX1 - AX0);

export default function SixtyFourOrdersViz() {
  return (
    <SceneShell
      eyebrow="세 번 뽑는 모든 순서"
      title="분모 2가 맞는 것은 64개 순서를 평균했을 때입니다"
      description="왼쪽 수는 묶음의 값이고 오른쪽 네모는 그 값이 나오는 순서의 수입니다. 아래 축의 ●은 지금 값 64개의 평균이고, 3이나 2로 나눈 장면의 ▲은 목표인 원래 분산 1/2입니다."
      ariaLabel="세 번 뽑는 64개 순서의 거리 합 분포와 분모 3, 2로 나눈 값의 평균"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const value = (row: (typeof ROWS)[number]) => row[scene.column];
        const head = scene.column === "sum" ? "거리 합" : scene.column === "by3" ? "÷ 3" : "÷ 2";
        return (
          <svg viewBox={`0 0 ${W} 216`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LABEL - 10} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">{head}</text>
            <text x={LABEL} y={14} fontSize={12} fill="#64748b">순서의 수</text>
            {ROWS.map((row, r) => {
              const y = 22 + r * ROW_H;
              const on = scene.highlight === r;
              return (
                <g key={row.sum}>
                  <text x={LABEL - 10} y={y + 15} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">{value(row)}</text>
                  {Array.from({ length: row.total }, (_, i) => (
                    <rect
                      key={i}
                      x={LABEL + (i % 36) * (CELL + 1)}
                      y={y + 6}
                      width={CELL}
                      height={12}
                      fill={on ? "#d97706" : "#2563eb"}
                      fillOpacity={scene.highlight >= 0 && !on ? 0.2 : 0.55}
                    />
                  ))}
                  <text x={LABEL + row.total * (CELL + 1) + 4} y={y + 16} fontSize={11} fontWeight={700} fill="#64748b" style={{ display: row.total === 36 ? "none" : undefined }}>{row.total}개 · {row.example}</text>
                  {row.total === 36 ? <text x={LABEL} y={y + 29} fontSize={11} fontWeight={700} fill="#64748b">{row.total}개 · {row.example}</text> : null}
                </g>
              );
            })}
            <line x1={AX0} x2={AX1} y1={172} y2={172} stroke="#94a3b8" strokeWidth={1} />
            {[{ v: 0, t: "0" }, { v: 1 / 2, t: "1/2" }, { v: 1, t: "1" }, { v: 4 / 3, t: "4/3" }].map((tick) => (
              <g key={tick.t}>
                <line x1={ax(tick.v)} x2={ax(tick.v)} y1={168} y2={176} stroke="#94a3b8" strokeWidth={1} />
                <text x={ax(tick.v)} y={205} textAnchor="middle" fontSize={12} fill="#64748b">{tick.t}</text>
              </g>
            ))}
            {scene.column !== "sum" && <path d={`M${ax(1 / 2)} 180 l-5 9 h10 z`} fill="#64748b" />}
            {scene.marker !== null && <circle cx={ax(scene.marker)} cy={160} r={6} fill="#2563eb" />}
            {scene.highlight === 2 && (
              <>
                <rect x={ax(1) - 5} y={155} width={10} height={10} fill="#d97706" />
                <text x={ax(1) + 9} y={164} fontSize={11} fontWeight={700} fill="#b45309">이번 한 묶음</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
