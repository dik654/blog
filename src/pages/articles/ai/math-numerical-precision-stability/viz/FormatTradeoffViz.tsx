import SceneShell from "./SceneShell";

/**
 * 본문 대응: #formats — 같은 16 bit를 지수와 소수부에 어떻게 나누느냐가 간격과 범위를 정한다.
 * 필드 수·간격·최대값은 본문 표입니다. 8칸(2⁻⁷÷2⁻¹⁰)과 65,536칸(2⁻⁷÷2⁻²³)은 그 표의 산술입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 200;
const CELL = 9.6;
const X0 = 16;

const FORMATS = [
  { name: "FP16", exp: 5, frac: 10 },
  { name: "BF16", exp: 8, frac: 7 },
  { name: "FP32", exp: 8, frac: 23 },
] as const;

const rx = (exponent: number) => 16 + ((exponent + 130) / 260) * 308;
const RANGES = [
  { name: "FP16", from: -14, to: 16, left: "2⁻¹⁴", right: "65504" },
  { name: "BF16", from: -126, to: 128, left: "2⁻¹²⁶", right: "약 3.3895×10³⁸" },
  { name: "FP32", from: -126, to: 128, left: "2⁻¹²⁶", right: "약 3.4028×10³⁸" },
] as const;

const SCENES = [
  { label: "칸 나누기", summary: "지수 5·소수 10 / 지수 8·소수 7", note: "칸 하나가 1 bit이고 맨 앞 회색 칸이 부호입니다. BF16은 FP16보다 소수부 3칸을 지수에 내주었습니다. FP32와 지수 칸 수가 같습니다." },
  { label: "1 근처의 간격", summary: "BF16 한 칸 = FP16 8칸", note: "소수부 칸이 적을수록 간격이 큽니다. 1 위쪽에서 BF16의 2⁻⁷ 한 칸에 FP16의 2⁻¹⁰이 8칸, FP32의 2⁻²³이 65,536칸 들어갑니다." },
  { label: "다룰 수 있는 크기", summary: "FP16 최대 65504", note: "대신 지수 칸이 크기의 범위를 정합니다. 눈금이 2의 지수라 한 칸이 두 배입니다. 막대는 최소 양의 정규수부터 최대 유한값까지이며 BF16과 FP32의 끝값은 조금 다릅니다." },
] as const;

export default function FormatTradeoffViz() {
  return (
    <SceneShell
      eyebrow="같은 16 bit의 두 가지 배분"
      title="지수에 칸을 주면 범위가 넓어지고 1 근처의 자리가 성겨집니다"
      description="세 형식을 같은 칸 크기와 같은 눈금에 놓았습니다. 값은 위 표와 같습니다."
      note="저장 형식의 비교입니다. 어떤 연산에 어떤 형식을 쓰는지는 장치와 구현을 따로 확인합니다."
      ariaLabel="FP16, BF16, FP32의 비트 배분과 간격, 범위 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && FORMATS.map((format, row) => {
            const y = 26 + row * 62;
            return (
              <g key={format.name}>
                <text x={X0} y={y - 6} fontSize={12} fontWeight={700} fill={GRAY}>{`${format.name} · ${1 + format.exp + format.frac} bit`}</text>
                <rect x={X0} y={y} width={CELL} height={26} fill={GRAY} fillOpacity={0.45} stroke={GRAY} strokeWidth={1} />
                <rect x={X0 + CELL} y={y} width={format.exp * CELL} height={26} fill={AMBER} fillOpacity={0.18} stroke={AMBER} strokeWidth={1} />
                <rect x={X0 + CELL * (1 + format.exp)} y={y} width={format.frac * CELL} height={26} fill={BLUE} fillOpacity={0.14} stroke={BLUE} strokeWidth={1} />
                <text x={X0 + CELL + (format.exp * CELL) / 2} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>{`지수 ${format.exp}`}</text>
                <text x={X0 + CELL * (1 + format.exp) + (format.frac * CELL) / 2} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{`소수 ${format.frac}`}</text>
              </g>
            );
          })}
          {active === 1 && (
            <g>
              <text x={X0} y={22} fontSize={12} fontWeight={700} fill={AMBER}>BF16: 2⁻⁷ 한 칸</text>
              <line x1={X0} x2={W - X0} y1={42} y2={42} stroke="#94a3b8" strokeWidth={1} />
              {[X0, W - X0].map((tx) => <line key={tx} x1={tx} x2={tx} y1={32} y2={52} stroke={AMBER} strokeWidth={1.25} />)}
              <text x={X0} y={88} fontSize={12} fontWeight={700} fill={BLUE}>FP16: 2⁻¹⁰ 8칸</text>
              <line x1={X0} x2={W - X0} y1={108} y2={108} stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: 9 }, (_, i) => {
                const tx = X0 + (i / 8) * (W - 2 * X0);
                return <line key={i} x1={tx} x2={tx} y1={100} y2={116} stroke={BLUE} strokeWidth={1} />;
              })}
              <text x={X0} y={148} fontSize={12} fontWeight={700} fill={GRAY}>FP32: 2⁻²³ 65,536칸 (너무 촘촘해 띠로 표시)</text>
              <rect x={X0} y={160} width={W - 2 * X0} height={8} fill={GRAY} fillOpacity={0.5} />
              <text x={X0} y={186} fontSize={12} fill={GRAY}>1</text>
              <text x={W - X0} y={186} textAnchor="end" fontSize={12} fill={GRAY}>1+2⁻⁷</text>
            </g>
          )}
          {active === 2 && (
            <g>
              {RANGES.map((range, row) => {
                const y = 24 + row * 50;
                const color = row === 0 ? BLUE : row === 1 ? AMBER : GRAY;
                return (
                  <g key={range.name}>
                    <text x={16} y={y} fontSize={12} fontWeight={700} fill={color}>{range.name}</text>
                    <rect x={rx(range.from)} y={y + 6} width={rx(range.to) - rx(range.from)} height={14} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={1} />
                    <text x={W - 16} y={y} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>{`${range.left} ~ ${range.right}`}</text>
                  </g>
                );
              })}
              <line x1={16} x2={W - 16} y1={172} y2={172} stroke="#94a3b8" strokeWidth={1} />
              {[-126, 0, 128].map((exponent) => (
                <g key={exponent}>
                  <line x1={rx(exponent)} x2={rx(exponent)} y1={168} y2={176} stroke="#94a3b8" strokeWidth={1} />
                  <text x={rx(exponent)} y={192} textAnchor="middle" fontSize={12} fill={GRAY}>{exponent === -126 ? "2⁻¹²⁶" : exponent === 0 ? "1" : "2¹²⁸"}</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
