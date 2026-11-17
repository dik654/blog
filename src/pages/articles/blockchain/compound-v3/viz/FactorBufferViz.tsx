import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collateral-borrow — 같은 담보 $1,000에 CF_b 75%와 CF_l 85%를 곱한 두 선 사이에 buffer가 생긴다.
 * debt $800: L_borrow = 750 − 800 = −50, L_liq = 850 − 800 = +50.
 * debt $900: L_liq = 850 − 900 = −50 → liquidatable.
 * 마지막 장면의 CF_b 70%는 "governance가 borrow factor를 낮추는" 경우를 보이려는 가정값이다.
 */
const COLLATERAL = 1000;
const LIQ_FACTOR = 0.85;

const SCENES = [
  {
    label: "같은 담보에 두 개의 선",
    summary: "×75% = $750 · ×85% = $850",
    borrowFactor: 0.75,
    debt: null,
    note: "CF_b는 차입·인출을, CF_l은 청산을 판정할 때 담보 가치에 곱하는 비율입니다. 두 선 사이 $100은 추가 차입은 막히고 청산은 아닌 buffer입니다.",
  },
  {
    label: "Debt $800: 차입은 막히고 청산은 아님",
    summary: "L_borrow −$50 · L_liq +$50",
    borrowFactor: 0.75,
    debt: 800,
    note: "L_borrow(담보×CF_b − 부채) = $750 − $800 = −$50이라 추가 차입과 위험한 담보 인출은 거절됩니다. L_liq(담보×CF_l − 부채) = $850 − $800 = $50이라 아직 청산 대상은 아닙니다.",
  },
  {
    label: "Debt $900: 청산선 통과",
    summary: "L_liq = $850 − $900 = −$50",
    borrowFactor: 0.75,
    debt: 900,
    note: "L_liq가 −$50으로 0 아래가 되어 계정이 liquidatable이 됩니다. 이때부터 청산 함수 absorb를 호출할 수 있습니다.",
  },
  {
    label: "Borrow factor만 낮추면",
    summary: "차입선만 $700(가정)으로",
    borrowFactor: 0.7,
    debt: 800,
    note: "CF_l이 그대로면 debt $800 계정의 L_liq는 여전히 +$50입니다. CF_b를 낮춰도 기존 계정이 즉시 청산 대상이 되지 않을 수 있는 이유입니다.",
  },
] as const;

const W = 360;
const H = 110;
const LEFT = 16;
const RIGHT = 16;
const BAND_Y = 34;
const BAND_H = 30;
const x = (value: number) => LEFT + (value / COLLATERAL) * (W - LEFT - RIGHT);
const money = (value: number) => "$" + value.toLocaleString("en-US");

const ZONES = [
  { color: "#16a34a", text: "차입 가능" },
  { color: "#d97706", text: "buffer" },
  { color: "#dc2626", text: "청산 가능" },
] as const;

export default function FactorBufferViz() {
  return (
    <SceneShell
      eyebrow="차입선과 청산선"
      title="추가 차입이 막히는 선과 청산되는 선은 서로 다릅니다"
      description="가로 띠는 담보 가치 $1,000을 기준으로 잰 부채 크기입니다. 파란 세로선이 현재 부채이며, 금액과 factor는 본문 공식의 설명용 예시입니다."
      note="실제 판정은 oracle 가격·asset scale·담보 목록을 같은 snapshot에서 읽고, supply cap·baseBorrowMin·pause 같은 별도 검사도 거칩니다."
      ariaLabel="담보 1,000달러에서 차입선 750달러와 청산선 850달러 사이 buffer와 부채 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const borrowLine = COLLATERAL * scene.borrowFactor;
        const liqLine = COLLATERAL * LIQ_FACTOR;
        const bounds: readonly number[] = [0, borrowLine, liqLine, COLLATERAL];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {ZONES.map((zone, index) => (
                <rect
                  key={zone.text}
                  x={x(bounds[index])}
                  y={BAND_Y}
                  width={x(bounds[index + 1]) - x(bounds[index])}
                  height={BAND_H}
                  fill={zone.color}
                  opacity={0.18}
                  className="transition-all duration-300 motion-reduce:transition-none"
                />
              ))}
              <rect x={x(0)} y={BAND_Y} width={x(COLLATERAL) - x(0)} height={BAND_H} fill="none" stroke="#94a3b8" strokeWidth={1} />

              <line x1={x(borrowLine)} x2={x(borrowLine)} y1={BAND_Y - 18} y2={BAND_Y + BAND_H} stroke="#d97706" strokeWidth={1.25} />
              <text x={x(borrowLine) - 3} y={BAND_Y - 22} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">
                차입선 {money(borrowLine)}
              </text>
              <line x1={x(liqLine)} x2={x(liqLine)} y1={BAND_Y - 18} y2={BAND_Y + BAND_H} stroke="#dc2626" strokeWidth={1.25} />
              <text x={x(liqLine) + 4} y={BAND_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b91c1c">
                청산선 {money(liqLine)}
              </text>

              {scene.debt !== null && (
                <g>
                  <line x1={x(scene.debt)} x2={x(scene.debt)} y1={BAND_Y - 4} y2={BAND_Y + BAND_H + 8} stroke="#2563eb" strokeWidth={1.25} />
                  <circle cx={x(scene.debt)} cy={BAND_Y + BAND_H / 2} r={4} fill="#2563eb" />
                  <text x={x(scene.debt)} y={BAND_Y + BAND_H + 36} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">
                    debt {money(scene.debt)}
                  </text>
                </g>
              )}

              <text x={x(0)} y={BAND_Y + BAND_H + 18} fontSize={11} fill="#64748b">$0</text>
              <text x={x(COLLATERAL)} y={BAND_Y + BAND_H + 18} textAnchor="end" fontSize={11} fill="#64748b">{money(COLLATERAL)}</text>
            </svg>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5">
              {ZONES.map((zone) => (
                <li key={zone.text} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: zone.color, opacity: 0.45 }} />
                  <span className="break-keep text-muted-foreground">{zone.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
