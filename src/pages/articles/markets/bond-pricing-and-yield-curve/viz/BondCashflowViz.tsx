import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·cashflow-to-price — 적힌 현금흐름을 할인해 가격을 만든다 */
const SCENES = [
  "약속은 미리 적혀 있다",
  "각 금액을 오늘로 되돌린다",
  "더하면 가격이 된다",
  "할인율을 올리면 가격이 내려간다",
] as const;

const FACE = 100;
const COUPON_RATE = 0.03;
const YEARS = [1, 2, 3];

function cashflow(year: number) {
  return year === YEARS.length ? FACE * (1 + COUPON_RATE) : FACE * COUPON_RATE;
}

function price(rate: number) {
  return YEARS.reduce((sum, year) => sum + cashflow(year) / (1 + rate) ** year, 0);
}

const BASE_PRICE = price(COUPON_RATE);
const HIGH_PRICE = price(0.05);

const NOTES = [
  `액면 ${FACE}, 표면금리 ${COUPON_RATE * 100}%, 만기 ${YEARS.length}년이면 받을 금액이 날짜까지 정해집니다.`,
  "각 금액에 그 시점의 할인계수를 곱해 오늘 값으로 바꿉니다. 늦은 금액일수록 많이 깎입니다.",
  `할인율이 표면금리와 같으면 합이 정확히 액면 ${FACE}이 됩니다.`,
  `할인율을 5%로 올리면 같은 약속의 값이 약 ${HIGH_PRICE.toFixed(1)}로 내려갑니다.`,
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

export default function BondCashflowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;
  const rate = step === 3 ? 0.05 : COUPON_RATE;
  const total = step === 3 ? HIGH_PRICE : BASE_PRICE;

  return (
    <VizFrame
      eyebrow="채권 가격"
      title="적혀 있는 현금흐름을 오늘로 모으면 그것이 가격입니다"
      description="채권은 할인 계산을 실제 청구권에 처음 적용하는 자리입니다."
      note="단위는 액면을 100으로 둔 상대값이며, 이자 지급 시점이 정확히 1년 간격이라고 두었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="채권 현금흐름의 할인"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <line x1={40} y1={160} x2={452} y2={160} stroke={MUTED} strokeWidth={1} />
              {[0, ...YEARS].map((year) => (
                <g key={year}>
                  <line x1={60 + year * 120} y1={156} x2={60 + year * 120} y2={164} stroke={MUTED} strokeWidth={1} />
                  <text x={60 + year * 120} y={178} textAnchor="middle" fontSize={9} fill={MUTED}>
                    {year}년
                  </text>
                </g>
              ))}

              {YEARS.map((year) => {
                const amount = cashflow(year);
                const present = amount / (1 + rate) ** year;
                const height = amount * 0.9;
                const presentHeight = present * 0.9;
                return (
                  <g key={year}>
                    <rect
                      x={42 + year * 120}
                      y={160 - height}
                      width={36}
                      height={height}
                      fill={MUTED}
                      fillOpacity={0.12}
                      stroke={MUTED}
                      strokeWidth={1}
                    />
                    <text x={60 + year * 120} y={154 - height} textAnchor="middle" fontSize={9} fill={MUTED}>
                      {amount}
                    </text>
                    {step >= 1 && (
                      <g>
                        <rect
                          x={42 + year * 120}
                          y={160 - presentHeight}
                          width={36}
                          height={presentHeight}
                          fill={step === 3 ? WARN : ACCENT}
                          fillOpacity={0.2}
                          stroke={step === 3 ? WARN : ACCENT}
                          strokeWidth={1}
                        />
                        <text
                          x={60 + year * 120}
                          y={160 - presentHeight - 6}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight={700}
                          fill={step === 3 ? WARN : ACCENT}
                        >
                          {present.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {step >= 2 && (
                <g>
                  <rect
                    x={24}
                    y={160 - total * 0.9}
                    width={36}
                    height={total * 0.9}
                    fill={step === 3 ? WARN : OK}
                    fillOpacity={0.18}
                    stroke={step === 3 ? WARN : OK}
                    strokeWidth={1}
                  />
                  <text x={42} y={154 - total * 0.9} textAnchor="middle" fontSize={10} fontWeight={700} fill={step === 3 ? WARN : OK}>
                    {total.toFixed(1)}
                  </text>
                  <text x={42} y={22} textAnchor="middle" fontSize={8} fill={MUTED}>
                    가격
                  </text>
                </g>
              )}

              <text x={452} y={22} textAnchor="end" fontSize={9} fontWeight={700} fill={step === 3 ? WARN : ACCENT}>
                할인율 {(rate * 100).toFixed(0)}%
              </text>
              {step >= 1 && (
                <text x={452} y={38} textAnchor="end" fontSize={8} fill={MUTED}>
                  회색은 받을 금액, 색칠은 오늘 값
                </text>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
