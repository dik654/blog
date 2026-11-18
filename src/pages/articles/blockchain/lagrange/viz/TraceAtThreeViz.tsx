import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — 입력 3에서 기저값 1·14·3, 표본값 1·4·9를 곱해 1+56+27=84, 84 mod 17 = 16.
 * ℓ₁(3) = −3 → F17에서 14. 84 = 4×17 + 16. 계수식 9+6+1=16과 일치.
 */
const MOD = 17;
const BASIS = [
  { name: "ℓ₀(3)", value: 1, raw: "2×1/2 = 1", y: 1, color: "#2563eb" },
  { name: "ℓ₁(3)", value: 14, raw: "−3 → 14", y: 4, color: "#d97706" },
  { name: "ℓ₂(3)", value: 3, raw: "3×2/2 = 3", y: 9, color: "#059669" },
] as const;
const PRODUCTS = BASIS.map((item) => item.value * item.y);
const TOTAL = PRODUCTS.reduce<number>((sum, value) => sum + value, 0);
const STARTS = PRODUCTS.map((_, index) => PRODUCTS.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
const WRAPS = Math.floor(TOTAL / MOD);
const REMAINDER = TOTAL % MOD;
const MAX = 85;

const W = 360;
const H = 92;
const LEFT = 12;
const RIGHT = 12;
const BAR_Y = 30;
const BAR_H = 18;
const px = (value: number) => LEFT + (value / MAX) * (W - LEFT - RIGHT);
const MULTIPLES = Array.from({ length: WRAPS + 1 }, (_, index) => index * MOD);

const SCENES = [
  { label: "기저에 3을 넣기", summary: "ℓ₀,ℓ₁,ℓ₂ = 1, 14, 3", note: "ℓ₁(3)=−3×1=−3입니다. 17로 나눈 나머지만 쓰는 계산에서는 17을 더한 14가 같은 값입니다." },
  { label: "표본값을 곱하기", summary: "1×1, 4×14, 9×3", note: "각 기저에 자기 표본값을 곱하면 1, 56, 27입니다. 막대의 세 조각이 각각 이 값입니다." },
  { label: "더한 뒤 17씩 덜어 내기", summary: "84 = 4×17 + 16", note: "세 조각을 이으면 84입니다. 17로 나눈 나머지는 17을 네 번 덜어 낸 뒤 남는 16이며 이것이 L(3)입니다." },
  { label: "계수식과 비교", summary: "9 + 6 + 1 = 16", note: "7절의 계수식 x²+2x+1에 3을 넣으면 9+6+1=16입니다. 기저 합으로 계산한 값과 같습니다." },
] as const;

export default function TraceAtThreeViz() {
  return (
    <SceneShell
      eyebrow="입력 3에서 평가"
      title="1·14·3에 1·4·9를 곱해 더하고 17씩 덜어 냅니다"
      description="모든 값은 17로 나눈 나머지(F17)입니다. 아래 막대의 눈금은 17의 배수이고, 마지막 눈금을 넘어 남는 길이가 나머지입니다."
      ariaLabel="입력 3에서 세 기저값과 표본값의 곱을 더해 84를 만들고 17로 나눈 나머지 16을 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const showProducts = active >= 1;
        const showWrap = active >= 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {BASIS.map((item, index) => (
                <div key={item.name} className="min-w-0 rounded-lg border bg-background px-1.5 py-2 text-center" style={{ borderColor: item.color }}>
                  <span className="block font-mono text-xs font-semibold" style={{ color: item.color }}>{item.name}</span>
                  <span className="mt-1 block font-mono text-base font-bold">{item.value}</span>
                  <span className="block h-4 text-[11px] leading-4 text-muted-foreground">{item.raw}</span>
                  <span className={`mt-1 block h-5 font-mono text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${showProducts ? "opacity-100" : "opacity-0"}`}>
                    ×{item.y} = <b>{PRODUCTS[index]}</b>
                  </span>
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className={`mx-auto mt-4 h-auto w-full max-w-[560px] transition-opacity duration-300 motion-reduce:transition-none ${showProducts ? "opacity-100" : "opacity-25"}`} role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={px(0)} x2={px(MAX)} y1={BAR_Y + BAR_H} y2={BAR_Y + BAR_H} stroke="#94a3b8" strokeWidth={1} />
              {BASIS.map((item, index) => (
                <rect key={item.name} x={px(STARTS[index])} y={BAR_Y} width={px(PRODUCTS[index]) - px(0)} height={BAR_H} fill={item.color} opacity={showWrap && active === 2 ? 0.35 : 0.75} stroke="#ffffff" strokeWidth={1} />
              ))}
              {showWrap && (
                <rect x={px(WRAPS * MOD)} y={BAR_Y - 3} width={px(REMAINDER) - px(0)} height={BAR_H + 6} fill="none" stroke="#7c3aed" strokeWidth={1.25} />
              )}
              {MULTIPLES.map((value) => (
                <g key={value}>
                  <line x1={px(value)} x2={px(value)} y1={BAR_Y - (showWrap ? 8 : 4)} y2={BAR_Y + BAR_H + 4} stroke="#475569" strokeWidth={1} />
                  <text x={px(value)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fontSize={10} fill="#64748b">{value}</text>
                </g>
              ))}
              <text x={px(TOTAL)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">{TOTAL}</text>
              {showWrap && (
                <text x={px(WRAPS * MOD + REMAINDER / 2)} y={BAR_Y - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#7c3aed">남는 {REMAINDER}</text>
              )}
              {showProducts && !showWrap && (
                <text x={px(TOTAL / 2)} y={BAR_Y - 10} textAnchor="middle" fontSize={11} fill="#475569">1 + 56 + 27 = {TOTAL}</text>
              )}
            </svg>
            <p className="mt-2 h-5 text-center font-mono text-sm font-bold text-primary">{active === 3 ? "L(3) = 16 = 9 + 6 + 1" : showWrap ? "L(3) = 16" : ""}</p>
          </div>
        );
      }}
    />
  );
}
