import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wesolowski — 2^T = qℓ + r 을 칸으로 배치한다.
 * T=4, ℓ=5: 16 = 3·5 + 1, π = g³ = 10, 10⁵·3 mod 17 = 1 = y (글의 mod 17 예시).
 */
const SCENES = [
  { label: "지수 16을 칸으로", summary: "2^T = 2⁴ = 16칸", note: "칸 하나가 지수 1입니다. g를 이 칸 수만큼 거듭제곱한 값이 y입니다. T번 제곱하면 칸 수가 2^T까지 커집니다." },
  { label: "소수 ℓ로 나눕니다", summary: "16 = 3·5 + 1", note: "칸을 ℓ=5칸씩 가로로 묶어 쌓으면 세 묶음이 나오고 한 칸이 남습니다. 묶음 수가 몫 q=3, 남은 칸이 나머지 r=1이며, 세로로 보면 3칸짜리 줄이 다섯 개입니다." },
  { label: "세로 한 줄이 증명 π", summary: "π = g³ = 10", note: "q칸 한 줄을 군의 지수로 옮긴 값이 π입니다. 증명을 만드는 쪽(prover)은 칸 전체가 아니라 군 원소 하나만 보냅니다." },
  { label: "검증자가 다시 채웁니다", summary: "10⁵·3 mod 17 = 1 = y", note: "π를 ℓ번 곱하면 다섯 줄이 채워지고 g^r이 남은 한 칸을 채웁니다. 합이 16칸이므로 π^ℓ g^r은 제출된 y와 같아야 합니다. 이 산술이 mod 17을 안전한 VDF로 만들지는 않습니다." },
  { label: "T가 크면", summary: "q만 커지고 π 안에 담깁니다", note: "T=4는 손으로 확인하려는 값이라 칸 절약이 보이지 않습니다. T가 커지면 세로 줄 길이 q가 거대해지지만 검증자는 π와 2^T보다 작은 지수 ℓ·r로 계산합니다. 긴 세로 줄의 길이는 모양만 나타냅니다." },
] as const;

const ACCENT = "#2563eb";
const REM = "#d97706";
const SIZE = 28;
const STEP = 32;
const X0 = 74;
const Y0 = 34;
const COLS = [0, 1, 2, 3, 4];
const ROWS = [0, 1, 2];
const ONE_LINE = Array.from({ length: 16 }, (_, index) => index);

export default function QuotientGridViz() {
  return (
    <SceneShell
      eyebrow="설명용 값 · g=3 · T=4 · ℓ=5 · mod 17"
      title="큰 지수를 몫과 나머지 칸으로 접습니다"
      description="몫 q와 나머지 r은 2^T를 소수 ℓ로 나눈 결과이고, 증명 π는 g를 q번 거듭제곱한 군 원소입니다. ℓ=5는 손 계산용이며 실제로는 충분히 큰 소수를 씁니다."
      ariaLabel="지수 16을 다섯 칸씩 나눠 몫 3과 나머지 1로 접고 증명으로 검증하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {active === 0 &&
              ONE_LINE.map((index) => (
                <rect key={index} x={20 + index * 20} y={68} width={18} height={18} rx={3} fill="#2563eb22" stroke={ACCENT} strokeWidth={1} />
              ))}
            {active === 0 && <text x={180} y={114} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>g¹⁶ = y</text>}

            {active >= 1 && active <= 3 && (
              <>
                <text x={X0 + 78} y={24} textAnchor="middle" fontSize={12} fill="#64748b">ℓ=5줄</text>
                <text x={X0 - 10} y={Y0 + 52} textAnchor="end" fontSize={12} fill="#64748b">q=3칸</text>
                {COLS.map((col) =>
                  ROWS.map((row) => {
                    const lit = (active === 2 && col === 0) || active === 3;
                    return (
                      <rect key={`${col}-${row}`} x={X0 + col * STEP} y={Y0 + row * STEP} width={SIZE} height={SIZE} rx={3} fill={lit ? ACCENT : "#2563eb22"} stroke={ACCENT} strokeWidth={1} />
                    );
                  }),
                )}
                {active === 2 && <text x={X0 + 14} y={Y0 + 3 * STEP + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>π=g³</text>}
                {active === 3 && <text x={X0 + 78} y={Y0 + 3 * STEP + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>π⁵</text>}
                <rect x={X0 + 5 * STEP + 22} y={Y0} width={SIZE} height={SIZE} rx={3} fill={active === 3 ? REM : "#d9770622"} stroke={REM} strokeWidth={1} />
                <text x={X0 + 5 * STEP + 36} y={Y0 + 50} textAnchor="middle" fontSize={12} fontWeight={700} fill={REM}>{active === 3 ? "g¹" : "r=1"}</text>
              </>
            )}

            {active === 4 && (
              <>
                <text x={X0 + 78} y={18} textAnchor="middle" fontSize={12} fill="#64748b">ℓ줄 (2^T보다 작음)</text>
                <text x={X0 - 10} y={84} textAnchor="end" fontSize={12} fill="#64748b">q칸 (거대)</text>
                {COLS.map((col) => (
                  <g key={col}>
                    <rect x={X0 + col * STEP} y={26} width={SIZE} height={124} fill={col === 0 ? "#2563eb33" : "#2563eb11"} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
                  </g>
                ))}
                <text x={X0 + 14} y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>π</text>
                <rect x={X0 + 5 * STEP + 22} y={26} width={SIZE} height={SIZE} rx={3} fill="#d9770622" stroke={REM} strokeWidth={1} />
                <text x={X0 + 5 * STEP + 36} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={REM}>r</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
