import TelemetrySceneShell from "./TelemetrySceneShell";

/**
 * 본문 대응: #usage ExplainedFormula 해석 — I=1000, O=200, R=500, W=0, 단가 1·4·0.2·1.25.
 * 비용 = 1000 + 800 + 100 + 0 = 1900 단가 단위. token 합 1700.
 */
type Category = { key: string; label: string; tokens: number; price: number; color: string };

const CATEGORIES: readonly Category[] = [
  { key: "I", label: "input", tokens: 1000, price: 1, color: "#64748b" },
  { key: "O", label: "output", tokens: 200, price: 4, color: "#2563eb" },
  { key: "R", label: "cache 읽기", tokens: 500, price: 0.2, color: "#16a34a" },
  { key: "W", label: "cache 쓰기", tokens: 0, price: 1.25, color: "#d97706" },
];

const TOKEN_TOTAL = CATEGORIES.reduce<number>((sum, item) => sum + item.tokens, 0);
const COST_TOTAL = CATEGORIES.reduce<number>((sum, item) => sum + item.tokens * item.price, 0);
const pct = (part: number, whole: number) => Math.round((part / whole) * 100);

const SCENES = [
  {
    label: "token 수만 보면",
    summary: `합계 ${TOKEN_TOTAL.toLocaleString("en-US")} token`,
    note: "응답 usage는 input 1000, output 200, cache 읽기 500, cache 쓰기 0입니다. 이 막대만 보면 output은 전체의 12%로 작은 몫입니다.",
  },
  {
    label: "category마다 단가를 곱하면",
    summary: `1000 + 800 + 100 + 0 = ${COST_TOTAL.toLocaleString("en-US")}`,
    note: "단가는 같은 축의 예로 1, 4, 0.2, 1.25입니다. output 200 × 4 = 800, cache 읽기 500 × 0.2 = 100이 되어 추정치는 1900 단가 단위입니다. 청구 금액(billed amount)이 아닙니다.",
  },
  {
    label: "몫이 뒤바뀝니다",
    summary: "output 12% → 42% · cache 읽기 29% → 5%",
    note: "token으로는 작던 output이 비용의 42%를 차지하고, token으로는 두 번째로 많던 cache 읽기는 5%로 줄어듭니다. token 합계 하나에 단가 하나를 곱하면 이 차이가 사라지므로 category를 나눠 곱합니다.",
  },
] as const;

const W = 360;
const H = 150;
const LEFT = 8;
const BAR_W = W - 2 * LEFT;

function StackedBar({ y, values, total, showPct }: { y: number; values: readonly number[]; total: number; showPct: boolean }) {
  const offsets = values.reduce<number[]>((acc, value, index) => [...acc, (index === 0 ? 0 : acc[index - 1]) + (index === 0 ? 0 : values[index - 1])], []);
  return (
    <g>
      {values.map((value, index) => {
        if (value === 0) return null;
        const x = LEFT + (offsets[index] / total) * BAR_W;
        const width = (value / total) * BAR_W;
        const item = CATEGORIES[index];
        return (
          <g key={item.key}>
            <rect x={x} y={y} width={width} height={26} fill={item.color} stroke="#ffffff" strokeWidth={1} />
            {width > 16 && (
              <text x={x + width / 2} y={y + 17} textAnchor="middle" fontSize={width < 30 ? 8.5 : 10} fontWeight={700} fill="#ffffff">
                {showPct ? `${pct(value, total)}%` : value}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function CostBreakdownViz() {
  return (
    <TelemetrySceneShell
      eyebrow="ESTIMATED COST · 설명용 단가 단위"
      title="token 몫과 비용 몫은 category별 단가 때문에 달라집니다"
      description="위 막대는 한 model attempt의 token 수, 아래 막대는 category별 token × 단가로 만든 추정 비용입니다. 숫자는 아래 식의 설명용 예시이며 실제 가격이 아닙니다."
      ariaLabel="input 1000, output 200, cache 읽기 500 token이 단가를 곱하면 1000, 800, 100으로 바뀌어 합계 1900"
      scenes={SCENES}
      render={(active) => {
        const costs = CATEGORIES.map((item) => item.tokens * item.price);
        const tokens = CATEGORIES.map((item) => item.tokens);
        const showPct = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#334155">token 수</text>
              <text x={W - LEFT} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">{TOKEN_TOTAL.toLocaleString("en-US")} token</text>
              <StackedBar y={22} values={tokens} total={TOKEN_TOTAL} showPct={showPct} />
              <text x={LEFT} y={78} fontSize={11} fontWeight={700} fill="#334155">추정 비용</text>
              <text x={W - LEFT} y={78} textAnchor="end" fontSize={11} fontWeight={700} fill={active >= 1 ? "#0f172a" : "#cbd5e1"}>
                {active >= 1 ? `${COST_TOTAL.toLocaleString("en-US")} 단가 단위` : "단가 적용 전"}
              </text>
              {active >= 1 ? (
                <StackedBar y={86} values={costs} total={COST_TOTAL} showPct={showPct} />
              ) : (
                <rect x={LEFT} y={86} width={BAR_W} height={26} rx={2} fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 2" />
              )}
              {CATEGORIES.map((item, index) => {
                const x = LEFT + index * (BAR_W / 4);
                return (
                  <g key={item.key}>
                    <rect x={x} y={128} width={10} height={10} rx={2} fill={item.color} />
                    <text x={x + 14} y={137} fontSize={9.5} fill="#475569">
                      {item.label} ×{item.price}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
