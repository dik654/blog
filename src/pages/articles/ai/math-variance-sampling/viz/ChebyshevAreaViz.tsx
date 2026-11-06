import SceneShell from "./SceneShell";

/**
 * 본문 대응: #law-of-large-numbers — 두 장 평균의 제곱 오차를 넓이로 그린다.
 * 폭 = 쌍의 비중(16쌍), 높이 = 제곱 오차. 전체 넓이 = 분산 = 1/4.
 * ε=1/2: 사건 10쌍(5/8), 직사각형 넓이 5/8 × 1/4 = 5/32 ≤ 1/4. 나누면 P ≤ 1, 실제 5/8.
 */
const COLUMNS = [
  { mean: 1, count: 1, err: 1 },
  { mean: 1.5, count: 4, err: 1 / 4 },
  { mean: 2, count: 6, err: 0 },
  { mean: 2.5, count: 4, err: 1 / 4 },
  { mean: 3, count: 1, err: 1 },
] as const;

const SCENES = [
  { label: "넓이 = 분산", summary: "1/16 + 1/16 + 0 + 1/16 + 1/16 = 1/4", note: "폭은 쌍의 비중, 높이는 2에서 잰 제곱 오차입니다. 폭×높이를 다 더한 넓이가 제곱 오차의 평균, 곧 분산 1/4입니다." },
  { label: "큰 오차 칸", summary: "(1 + 4 + 4 + 1) / 16 = 5/8", note: "오차가 허용 오차 ε=1/2 이상인 쌍은 열 개이고 평균 2인 여섯 쌍만 빠집니다. 표시한 칸은 모두 제곱 오차가 ε²=1/4 선 이상입니다." },
  { label: "선 아래 넓이", summary: "5/8 × 1/4 = 5/32 ≤ 1/4", note: "큰 오차 칸을 선 높이까지만 남겨도 그 넓이는 전체 분산보다 클 수 없습니다. 칸이 선 위로 튀어나온 만큼 남습니다." },
  { label: "상한", summary: "P ≤ (1/4) / (1/4) = 1", note: "양변을 ε²으로 나누면 확률의 상한입니다. 실제 5/8과 다른 것은 튀어나온 넓이를 버렸기 때문입니다. 분산만으로 얻은 값이라 정확한 확률을 주지는 않습니다." },
] as const;

const W = 360;
const X0 = 40;
const UNIT = 18;
const BASE = 168;
const TOP = 28;
const sy = (value: number) => BASE - value * (BASE - TOP);

export default function ChebyshevAreaViz() {
  return (
    <SceneShell
      eyebrow="제곱 오차를 넓이로"
      title="체비쇼프 상한은 넓이 비교에서 나옵니다"
      description="두 장 평균의 16쌍을 평균값 순서로 폈습니다. 칸의 폭이 쌍의 수, 높이가 제곱 오차입니다. 체비쇼프 상한은 분산만으로 큰 오차의 확률을 제한하는 값입니다."
      ariaLabel="제곱 오차 넓이와 허용 오차 선으로 체비쇼프 상한을 얻는 그림"
      scenes={SCENES}
      render={(active) => {
        let cursor = X0;
        return (
          <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {COLUMNS.map((col) => {
              const x = cursor;
              const w = col.count * UNIT;
              cursor += w;
              const event = col.err >= 1 / 4;
              const onEvent = active >= 1 && event;
              return (
                <g key={col.mean}>
                  <rect x={x} y={sy(col.err)} width={w} height={BASE - sy(col.err)} fill={onEvent ? "#2563eb" : "#64748b"} fillOpacity={active >= 2 && event ? 0.14 : 0.32} stroke={onEvent ? "#2563eb" : "#64748b"} strokeWidth={1} />
                  {active >= 2 && event && <rect x={x} y={sy(1 / 4)} width={w} height={BASE - sy(1 / 4)} fill="#d97706" fillOpacity={0.45} />}
                  <text x={x + w / 2} y={BASE + 16} textAnchor="middle" fontSize={col.count === 1 ? 11 : 12} fill="#64748b">{col.mean}</text>
                  <text x={x + w / 2} y={BASE + 32} textAnchor="middle" fontSize={11} fill="#64748b">{col.count}쌍</text>
                </g>
              );
            })}
            <line x1={X0} x2={X0 + 16 * UNIT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={X0 - 6} y={sy(1) + 4} textAnchor="end" fontSize={12} fill="#64748b">1</text>
            <text x={X0 - 6} y={sy(1 / 4) + 4} textAnchor="end" fontSize={12} fill="#64748b">1/4</text>
            <text x={X0 - 6} y={BASE + 4} textAnchor="end" fontSize={12} fill="#64748b">0</text>
            <text x={X0} y={14} fontSize={12} fill="#64748b">제곱 오차</text>
            <text x={X0 - 6} y={BASE + 16} textAnchor="end" fontSize={11} fill="#64748b">평균</text>
            {active >= 1 && (
              <>
                <line x1={X0} x2={X0 + 16 * UNIT} y1={sy(1 / 4)} y2={sy(1 / 4)} stroke="#b45309" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={X0 + 8 * UNIT} y={sy(1 / 4) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">ε² = 1/4</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
