import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — D×t는 길이의 제곱이라 곱끼리 더한 뒤 제곱근을 취한다.
 * D₁t₁ = 10⁻¹⁴×3600 = 3.6×10⁻¹¹ cm² → a₁ = 2√(3.6×10⁻¹¹) cm = 120 nm
 * D₂t₂ = 4×10⁻¹⁴×1800 = 7.2×10⁻¹¹ cm² → 혼자라면 2√(7.2×10⁻¹¹) cm ≈ 169.7 nm
 * 합 1.08×10⁻¹⁰ cm² → a ≈ 207.85 nm. 길이끼리 더하면 120 + 169.7 ≈ 290 nm로 다르다.
 * 정사각형 한 변 ∝ a, 넓이 ∝ D×t.
 */
const K = 0.62; // px per nm (한 변)
const SIDE1 = 120 * K;
const SIDE2 = 169.7 * K;
const SIDE3 = 207.85 * K;
const BASE_Y = 180;
const XA = 14;
const XB = XA + SIDE1 + 30;
const XC = XB + SIDE2 + 30;
const BAR_K = K; // px per nm (아래 길이 막대 — 정사각형 한 변과 같은 축척이라 초록 막대 = 초록 칸 한 변)
const FIRST = "#d97706";
const SECOND = "#2563eb";
const SUM = "#16a34a";
const WRONG = "#dc2626";

const SCENES = [
  {
    label: "첫 단계의 곱",
    summary: "10⁻¹⁴ × 3600 = 3.6×10⁻¹¹ cm²",
    note: "정사각형의 넓이가 D×t, 한 변이 폭 척도에 비례하도록 그렸습니다. 첫 단계의 넓이 3.6에서 a₁ = 2√(3.6×10⁻¹¹ cm²) = 120 nm가 나옵니다(숫자는 가정).",
  },
  {
    label: "둘째 단계의 곱",
    summary: "4×10⁻¹⁴ × 1800 = 7.2×10⁻¹¹ cm²",
    note: "시간은 절반이지만 퍼지기 쉬운 정도가 네 배라 넓이는 두 배인 7.2입니다. 이 단계만 따로 계산하면 한 변은 약 170 nm입니다.",
  },
  {
    label: "넓이를 더한 뒤 한 변",
    summary: "3.6 + 7.2 = 10.8 → a ≈ 208 nm",
    note: "더하는 것은 넓이(D×t)입니다. 합 1.08×10⁻¹⁰ cm²의 제곱근에 2를 곱하면 약 208 nm입니다.",
  },
  {
    label: "길이끼리 더하면",
    summary: "120 + 170 ≈ 290 nm ≠ 208 nm",
    note: "각 단계의 길이를 먼저 구해 더하면 약 290 nm가 되어 맞지 않습니다. 합을 구한 다음 제곱근을 취하는 순서가 필요합니다.",
  },
] as const;

function Square({ x, side, color, top, bottom, faded }: { x: number; side: number; color: string; top: string; bottom: string; faded: boolean }) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <rect x={x} y={BASE_Y - side} width={side} height={side} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.25} />
      <text x={x + side / 2} y={BASE_Y - side / 2 + 5} fontSize={14} textAnchor="middle" fill={color} fontWeight={700}>{top}</text>
      <text x={x + side / 2} y={BASE_Y + 18} fontSize={13} textAnchor="middle" fill="currentColor">{bottom}</text>
    </g>
  );
}

export default function BudgetSquaresViz() {
  return (
    <SceneShell
      eyebrow="곱끼리 더하기"
      title="넓이를 더하고 나서 한 변을 잽니다"
      description="퍼지기 쉬운 정도 D(cm²/s)에 가열 시간 t(s)를 곱한 D×t는 단위가 cm²라서 정사각형의 넓이처럼 더합니다. 칸 속 숫자는 ×10⁻¹¹ cm², 아래는 한 변에 해당하는 폭 척도(곱의 제곱근의 2배)입니다."
      ariaLabel="두 가열 단계의 D 곱하기 t를 넓이로 더하고 제곱근으로 길이를 얻는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 400 262" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="넓이로 그린 D 곱하기 t">
          <Square x={XA} side={SIDE1} color={FIRST} top="3.6" bottom="120 nm" faded={active === 3} />
          {active >= 1 ? <Square x={XB} side={SIDE2} color={SECOND} top="7.2" bottom="약 170 nm" faded={active === 3} /> : null}
          {active >= 1 ? <text x={XB - 15} y={BASE_Y - 30} fontSize={18} textAnchor="middle" fill="currentColor">+</text> : null}
          {active >= 2 ? (
            <>
              <text x={XC - 15} y={BASE_Y - 30} fontSize={18} textAnchor="middle" fill="currentColor">=</text>
              <Square x={XC} side={SIDE3} color={SUM} top="10.8" bottom="약 208 nm" faded={false} />
            </>
          ) : null}
          {active === 3 ? (
            <g>
              <rect x={14} y={206} width={120 * BAR_K} height={12} fill={FIRST} fillOpacity={0.5} />
              <rect x={14 + 120 * BAR_K} y={206} width={169.7 * BAR_K} height={12} fill={SECOND} fillOpacity={0.5} />
              <text x={14 + 289.7 * BAR_K + 6} y={217} fontSize={13} fill={WRONG} fontWeight={700}>290 틀림</text>
              <rect x={14} y={230} width={207.85 * BAR_K} height={12} fill={SUM} fillOpacity={0.6} />
              <text x={14 + 207.85 * BAR_K + 6} y={241} fontSize={13} fill={SUM} fontWeight={700}>208 nm 맞음</text>
            </g>
          ) : null}
        </svg>
      )}
    />
  );
}
