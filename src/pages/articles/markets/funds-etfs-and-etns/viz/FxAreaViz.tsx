import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 환노출 상품의 곱셈. 1.10×0.90=0.99, 즉 −1%.
 * 넓이로 읽습니다. 처음 1×1, 오른쪽에 +0.10을 붙이고 위에서 1.10×0.10=0.11을 잘라냅니다.
 */
const SCENES = [
  { label: "처음", summary: "1.00 × 1.00 = 1.00", note: "가로는 달러 기준 가치, 세로는 달러당 원화입니다. 넓이가 원화로 잰 내 돈입니다." },
  { label: "달러 자산이 10% 오르면", summary: "가로 1.10 · 넓이 +0.10", note: "달러 자산이 10% 오르면 가로가 1.10이 됩니다. 원화 환율이 그대로라면 넓이도 1.10입니다." },
  { label: "달러당 원화가 10% 내리면", summary: "세로 0.90 · 넓이 −0.11", note: "세로가 0.90이 되면 위쪽 띠가 잘립니다. 이 띠의 폭은 이미 늘어난 1.10이라 넓이가 0.10이 아니라 0.11입니다." },
  { label: "남는 넓이", summary: "1.10 × 0.90 = 0.99 → −1%", note: "더한 0.10보다 잘린 0.11이 커서 0.99가 남습니다. 10%를 더하고 빼면 0처럼 보이지만 실제로는 곱셈이라 −1%입니다." },
] as const;

const UNIT = 118;
const LEFT = 40;
const BOTTOM = 148;
const ACCENT = "#2563eb";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GRAY = "#64748b";

export default function FxAreaViz() {
  return (
    <SceneShell
      eyebrow="환율 곱셈"
      title="10% 오르고 10% 내렸는데 왜 −1%가 되는지 넓이로 봅니다"
      description="처음을 1×1 네모로 놓습니다. 파란 넓이가 원화로 잰 가치입니다."
      note="환노출 상품에서 달러 자산과 달러당 원화 숫자만 곱한 계산입니다. 보수·세금과 환헤지 비용은 넣지 않았습니다."
      ariaLabel="달러 자산 10퍼센트 상승과 달러당 원화 10퍼센트 하락을 넓이로 곱한 결과"
      scenes={SCENES}
      render={(active) => {
        const width = active >= 1 ? 1.1 : 1;
        const height = active >= 2 ? 0.9 : 1;
        const top = BOTTOM - UNIT * height;
        const fullTop = BOTTOM - UNIT;
        return (
          <svg viewBox="0 0 340 174" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={LEFT} y={top} width={UNIT * width} height={UNIT * height} fill={ACCENT} opacity={0.72} />
            {active === 1 && <rect x={LEFT + UNIT} y={fullTop} width={UNIT * 0.1} height={UNIT} fill={GREEN} opacity={0.85} />}
            {active >= 2 && <rect x={LEFT + 0.5} y={fullTop + 0.5} width={UNIT * 1.1 - 1} height={UNIT * 0.1 - 1} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />}
            {active >= 2 && <rect x={LEFT + UNIT} y={top} width={UNIT * 0.1} height={UNIT * 0.9} fill={GREEN} opacity={0.85} />}
            <rect x={LEFT} y={fullTop} width={UNIT} height={UNIT} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />

            <text x={LEFT + (UNIT * width) / 2} y={BOTTOM + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">달러 가치 {width.toFixed(2)}</text>
            <text x={LEFT - 8} y={(top + BOTTOM) / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">{height.toFixed(2)}</text>
            <text x={0} y={fullTop - 6} fontSize={11} fill={GRAY}>달러당 원화</text>

            <g fontWeight={700}>
              {active === 0 && <text x={190} y={92} fontSize={13} fill={ACCENT}>넓이 1.00</text>}
              {active >= 1 && (
                <g>
                  <text x={190} y={44} fontSize={12} fill={GREEN}>더한 띠</text>
                  <text x={190} y={60} fontSize={13} fill={GREEN}>1 × 0.10 = +0.10</text>
                </g>
              )}
              {active >= 2 && (
                <g>
                  <text x={190} y={88} fontSize={12} fill={RED}>잘린 띠</text>
                  <text x={190} y={104} fontSize={13} fill={RED}>1.10 × 0.10 = −0.11</text>
                </g>
              )}
              {active === 3 && (
                <g>
                  <text x={190} y={132} fontSize={12} fill={ACCENT}>남는 넓이</text>
                  <text x={190} y={148} fontSize={13} fill={ACCENT}>0.99 (−1%)</text>
                </g>
              )}
            </g>
          </svg>
        );
      }}
    />
  );
}
