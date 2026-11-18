import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 첫 문단 — 행사가격 100인 4개월 평균가격 콜(가정).
 * 월말 가격 100·102·106·112 → 평균 (100+102+106+112)÷4 = 105 → 지급 105−100 = 5.
 * 마지막 값 112만 넣으면 112−100 = 12.
 */
const PRICES = [100, 102, 106, 112] as const;
const PRICE_LIST: readonly number[] = PRICES;
const STRIKE = 100;
const AVERAGE = PRICE_LIST.reduce<number>((sum, price) => sum + price, 0) / PRICE_LIST.length;
const LAST = PRICE_LIST[PRICE_LIST.length - 1];

const SCENES = [
  { label: "월말 가격 네 개", summary: "100 · 102 · 106 · 112", note: "행사가격 100인 4개월 평균가격 콜(가정)의 한 경로입니다. 점 하나가 한 달의 월말 가격이고, 지급은 이 네 점 모두로 정해집니다." },
  { label: "네 가격의 평균", summary: "(100+102+106+112)÷4 = 105", note: "네 월말 가격을 더해 4로 나누면 105입니다. 가로 파란 선이 이 평균입니다." },
  { label: "지급은 평균 − 행사가격", summary: "105 − 100 = 5", note: "평균 105에서 행사가격 100을 뺀 5가 이 경로의 지급입니다. 평균이 100보다 낮았다면 지급은 0입니다." },
  { label: "마지막 값만 넣으면", summary: "112 − 100 = 12 · 계약 지급 5와 다름", note: "만기 가격 112 하나만 쓰면 12가 나와 계약의 지급 5와 다릅니다. 마지막 값만 알아서는 이 계약을 계산할 수 없습니다." },
] as const;

const W = 360;
const H = 200;
const LEFT = 44;
const RIGHT = 70;
const TOP = 16;
const BOTTOM = 168;
const Y_MIN = 96;
const Y_MAX = 116;
const y = (value: number) => BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
const x = (month: number) => LEFT + 68 + month * ((W - LEFT - RIGHT - 88) / (PRICE_LIST.length - 1));
const TICKS = [100, 105, 110, 115] as const;

export default function AveragePathViz() {
  return (
    <SceneShell
      eyebrow="경로가 정하는 지급"
      title="평균가격 콜은 네 점을 모두 봐야 지급이 나옵니다"
      description="가로는 1~4월 월말, 세로는 가격입니다. 회색 점선은 행사가격 100이며 경로와 계약은 1절의 가정입니다."
      ariaLabel="월말 가격 100, 102, 106, 112의 평균 105와 지급 5, 마지막 값 112로 계산한 12 비교"
      scenes={SCENES}
      render={(active) => {
        const showAverage = active >= 1;
        const showPayoff = active >= 2;
        const showLast = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT + 10} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={LEFT} x2={W - RIGHT + 10} y1={y(STRIKE)} y2={y(STRIKE)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <text x={W - RIGHT + 14} y={y(STRIKE) + 4} fontSize={11} fill="#64748b">행사 100</text>
            <polyline points={PRICE_LIST.map((price, month) => `${x(month)},${y(price)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {PRICE_LIST.map((price, month) => (
              <g key={month}>
                <circle cx={x(month)} cy={y(price)} r={4.5} fill={showLast && month === PRICE_LIST.length - 1 ? "#d97706" : "#334155"} />
                <text x={x(month)} y={y(price) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{price}</text>
                <text x={x(month)} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#64748b">{month + 1}월</text>
              </g>
            ))}
            {showAverage && (
              <>
                <line x1={LEFT} x2={W - RIGHT + 10} y1={y(AVERAGE)} y2={y(AVERAGE)} stroke="#2563eb" strokeWidth={1.25} />
                <text x={W - RIGHT + 14} y={y(AVERAGE) + 4} fontSize={11} fontWeight={700} fill="#2563eb">평균 {AVERAGE}</text>
              </>
            )}
            {showPayoff && (
              <g>
                <line x1={LEFT + 8} x2={LEFT + 8} y1={y(STRIKE)} y2={y(AVERAGE)} stroke="#2563eb" strokeWidth={1.25} />
                <rect x={LEFT + 2} y={y(AVERAGE)} width={12} height={y(STRIKE) - y(AVERAGE)} fill="#2563eb" opacity={0.18} />
                <text x={LEFT + 18} y={(y(STRIKE) + y(AVERAGE)) / 2 + 4} fontSize={12} fontWeight={700} fill="#2563eb">지급 {AVERAGE - STRIKE}</text>
              </g>
            )}
            {showLast && (
              <g>
                <line x1={x(3) + 14} x2={x(3) + 14} y1={y(STRIKE)} y2={y(LAST)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={x(3) + 18} y={(y(STRIKE) + y(LAST)) / 2 + 4} fontSize={12} fontWeight={700} fill="#d97706">{LAST - STRIKE}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
