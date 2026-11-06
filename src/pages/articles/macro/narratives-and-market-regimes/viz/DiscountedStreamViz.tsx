import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 첫 지급이 1년 뒤이고 같은 현금이 영원히 이어진다는 가정.
 * 막대 = 그해 지급액을 오늘 값으로 바꾼 크기(현금 ÷ (1+r)^연차). 아래 띠 = 그때까지의 누적 합.
 * 100·10%: 90.9, 10년 614.5, 30년 942.7, 끝까지 1000. 150·8%: 138.9, 30년 1688.7, 끝까지 1875.
 */
const SCENES = [
  { label: "1년 뒤 100의 오늘 값", summary: "100 ÷ 1.10 ≈ 90.9", cash: 100, rate: 0.1, shown: 1, note: "요구 수익률이 연 10%이면 오늘 90.9를 맡겨 1년 뒤 100이 되어야 수지가 맞습니다. 그래서 1년 뒤 100의 오늘 값은 90.9입니다." },
  { label: "더 먼 해일수록 작아집니다", summary: "10년까지 합 ≈ 614.5", cash: 100, rate: 0.1, shown: 10, note: "지급액은 해마다 100으로 같지만 1.10으로 나누는 횟수가 한 번씩 늘어 10년째의 오늘 값은 38.6입니다." },
  { label: "끝없이 더해도 1000에 머뭅니다", summary: "30년 ≈ 942.7 → 끝까지 1000", cash: 100, rate: 0.1, shown: 30, note: "지급이 영원히 이어져도 뒤쪽 막대가 점점 작아져 합은 1000을 넘지 않습니다. 이 합을 한 번에 구한 식이 100÷0.10입니다." },
  { label: "현금 150·요구 수익률 8%", summary: "30년 ≈ 1688.7 → 끝까지 1875", cash: 150, rate: 0.08, shown: 30, note: "회색 윤곽이 앞 장면의 막대입니다. 현금이 커져 막대가 높아지고 요구 수익률이 낮아져 천천히 줄어들어, 합이 150÷0.08=1875까지 늘어납니다." },
] as const;

const YEARS = 30;
const W = 360;
const LEFT = 10;
const PLOT_W = W - 2 * LEFT;
const BASE_Y = 120;
const PX_PER_VALUE = 0.62;
const BAR_STEP = PLOT_W / YEARS;
const STRIP_Y = 150;
const STRIP_SCALE = PLOT_W / 1875;

const presentValue = (cash: number, rate: number, year: number) => cash / (1 + rate) ** year;
const sumThrough = (cash: number, rate: number, years: number) => (cash / rate) * (1 - (1 + rate) ** -years);
const barX = (year: number) => LEFT + (year - 1) * BAR_STEP;
const YEAR_LIST = Array.from({ length: YEARS }, (_, index) => index + 1);

export default function DiscountedStreamViz() {
  return (
    <SceneShell
      eyebrow="영원히 받는 돈의 오늘 값"
      title="매년 끝없이 받아도 오늘 값의 합은 한 숫자에 머뭅니다"
      description="막대 하나가 한 해의 지급액을 오늘 값으로 바꾼 크기이고, 아래 띠는 그해까지 더한 합입니다. 현금과 요구 수익률은 모두 이 글의 가정입니다."
      ariaLabel="해마다 작아지는 지급액의 오늘 값과 그 합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sum = sumThrough(scene.cash, scene.rate, scene.shown);
        const limit = scene.cash / scene.rate;
        const showLimit = scene.shown === YEARS;
        const lastValue = presentValue(scene.cash, scene.rate, scene.shown);
        return (
          <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {active === 3 &&
              YEAR_LIST.map((year) => {
                const height = presentValue(100, 0.1, year) * PX_PER_VALUE;
                return <rect key={year} x={barX(year)} y={BASE_Y - height} width={BAR_STEP - 2} height={height} fill="none" stroke="#94a3b8" strokeWidth={1} />;
              })}
            {YEAR_LIST.filter((year) => year <= scene.shown).map((year) => {
              const height = presentValue(scene.cash, scene.rate, year) * PX_PER_VALUE;
              return <rect key={year} x={barX(year)} y={BASE_Y - height} width={BAR_STEP - 2} height={height} fill="#2563eb" opacity={active === 3 ? 0.55 : 0.8} />;
            })}
            <text x={LEFT} y={BASE_Y - presentValue(scene.cash, scene.rate, 1) * PX_PER_VALUE - 5} fontSize={12} fontWeight={700} fill="#2563eb">
              {presentValue(scene.cash, scene.rate, 1).toFixed(1)}
            </text>
            {scene.shown > 1 && (
              <text x={Math.min(barX(scene.shown) + BAR_STEP / 2, W - LEFT)} y={BASE_Y - lastValue * PX_PER_VALUE - 5} textAnchor={scene.shown === YEARS ? "end" : "middle"} fontSize={12} fontWeight={700} fill="#2563eb">
                {lastValue.toFixed(1)}
              </text>
            )}
            <line x1={LEFT} x2={W - LEFT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {[1, 10, 20, 30].map((year) => (
              <text key={year} x={barX(year) + BAR_STEP / 2} y={BASE_Y + 14} textAnchor="middle" fontSize={11} fill="#64748b">
                {year}년
              </text>
            ))}
            <rect x={LEFT} y={STRIP_Y} width={PLOT_W} height={14} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <rect x={LEFT} y={STRIP_Y} width={sum * STRIP_SCALE} height={14} fill="#2563eb" opacity={0.8} />
            {showLimit && <line x1={LEFT + limit * STRIP_SCALE} x2={LEFT + limit * STRIP_SCALE} y1={STRIP_Y - 5} y2={STRIP_Y + 19} stroke="#d97706" strokeWidth={1.25} />}
            <text x={LEFT} y={STRIP_Y + 32} fontSize={12} fontWeight={700} fill="#2563eb">{scene.shown}년까지 합 {sum.toFixed(1)}</text>
            {showLimit && <text x={W - LEFT} y={STRIP_Y + 32} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">세로선: 끝까지의 합 {limit}</text>}
          </svg>
        );
      }}
    />
  );
}
