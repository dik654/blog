import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 첫 문단 — 생우 4만 lb × 2.20달러 = 88,000달러(가정), 기준 수율 63%·실제 62%.
 * 조정식 (62÷63−1)×2.20×40,000 ≈ −1,396.83달러. 88,000×62/63 = 86,603.17.
 * 도체 무게는 40,000×0.63 = 25,200 lb, 40,000×0.62 = 24,800 lb (비율의 뜻을 보이려는 산술).
 */
const LIVE_LB = 40000;
const PRICE = 2.2;
const BASE = LIVE_LB * PRICE;
const PAR = 63;
const ACTUAL = 62;
const ADJUSTED = (BASE * ACTUAL) / PAR;
const ADJUST = ADJUSTED - BASE;

const fmt = (value: number, digits = 0) =>
  `${value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

const SCENES = [
  { label: "기본가치", summary: `40,000 lb × 2.20 = ${fmt(BASE)}달러`, note: "정산가격을 파운드당 2.20달러로 놓은 가정입니다. 4만 파운드 한 계약의 기본가치는 88,000달러이고, 이 값이 조정의 출발점입니다." },
  { label: "수율이 뜻하는 것", summary: `63% → ${fmt(LIVE_LB * 0.63)} lb · 62% → ${fmt(LIVE_LB * 0.62)} lb`, note: "뜨거운 도체 수율은 도축 직후 도체 무게가 산 동물 무게에서 차지하는 비율입니다. 같은 4만 파운드라도 62%면 도체가 400파운드 적게 나옵니다. 기준은 63%입니다." },
  { label: "62÷63을 곱해 가치를 줄입니다", summary: `${fmt(ADJUST, 2)}달러`, note: "조정식은 기본가치에 62÷63을 곱한 값과의 차이입니다. 88,000×62÷63 ≈ 86,603.17달러이므로 약 1,396.83달러가 줄어듭니다. 1%포인트 차이가 88,000의 1%(880달러)가 아니라 63분의 1만큼 줄인다는 점이 핵심입니다. 실제 인도에는 개별 도체 무게·등급·연령·시설 비용 등 더 많은 조정이 붙을 수 있습니다." },
] as const;

const W = 360;
const H = 168;
const LEFT = 16;
const SPAN = W - 2 * LEFT;

export default function YieldAdjustViz() {
  return (
    <SceneShell
      eyebrow="수율 조정"
      title="수율 63%가 62%가 되면 기본가치에 62÷63을 곱합니다"
      description="생우 한 계약 4만 파운드에 2.20달러를 붙인 가정입니다(가정). 한 장면 안의 막대 길이는 같은 축척이며, 조정식은 본문이 인용한 CME Chapter 101의 식을 따릅니다."
      ariaLabel="생우 4만 파운드의 기본가치 88,000달러가 수율 62퍼센트에서 62분의 63 비율로 줄어 약 1,396.83달러 감소하는 계산"
      scenes={SCENES}
      render={(index) => {
        const row1 = 34;
        const row2 = 98;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            {index === 1 ? (
              <>
                <text x={LEFT} y={row1 - 8} fontSize={11} fill="#475569">산 무게 40,000 lb 중 도체 · 기준 63%</text>
                <rect x={LEFT} y={row1} width={SPAN} height={22} rx={2} fill="#e2e8f0" />
                <rect x={LEFT} y={row1} width={SPAN * 0.63} height={22} rx={2} fill="#64748b" />
                <text x={LEFT + SPAN * 0.63 - 6} y={row1 + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">25,200 lb</text>
                <text x={LEFT} y={row2 - 8} fontSize={11} fill="#475569">실제 62%</text>
                <rect x={LEFT} y={row2} width={SPAN} height={22} rx={2} fill="#e2e8f0" />
                <rect x={LEFT} y={row2} width={SPAN * 0.62} height={22} rx={2} fill="#dc2626" opacity={0.85} />
                <text x={LEFT + SPAN * 0.62 - 6} y={row2 + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">24,800 lb</text>
                <text x={LEFT + SPAN * 0.63 + 4} y={row2 + 40} textAnchor="middle" fontSize={11} fill="#dc2626">↑ 400 lb 차이</text>
              </>
            ) : (
              <>
                <text x={LEFT} y={row1 - 8} fontSize={11} fill="#475569">기본가치 · 40,000 lb × 2.20달러 (가정)</text>
                <rect x={LEFT} y={row1} width={SPAN} height={22} rx={2} fill="#64748b" />
                <text x={LEFT + SPAN - 6} y={row1 + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">{fmt(BASE)}달러</text>
                <g opacity={index === 2 ? 1 : 0}>
                  <text x={LEFT} y={row2 - 8} fontSize={11} fill="#475569">× 62 ÷ 63</text>
                  <rect x={LEFT} y={row2} width={SPAN * (ACTUAL / PAR)} height={22} rx={2} fill="#2563eb" />
                  <rect x={LEFT + SPAN * (ACTUAL / PAR)} y={row2} width={SPAN * (1 - ACTUAL / PAR)} height={22} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={LEFT + SPAN * (ACTUAL / PAR) - 6} y={row2 + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">≈ {fmt(ADJUSTED, 2)}달러</text>
                  <text x={W - LEFT} y={row2 + 40} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">점선 칸 ≈ {fmt(ADJUST, 2)}달러</text>
                </g>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
