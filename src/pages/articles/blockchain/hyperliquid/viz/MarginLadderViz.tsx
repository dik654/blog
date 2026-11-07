import SceneShell from "./SceneShell";

/**
 * 본문 대응: #margin-liquidation — 계정 가치 계산과 두 기준선.
 * 1,000−1.35=998.65, −700=298.65, −20=278.65. 300−278.65=21.35 부족, 300×2/3=200.
 */
const VALUE_X = 8;
const AXIS = 344;
const scaleX = (value: number) => VALUE_X + (value / 1000) * AXIS;

const ROWS = [
  { label: "담보", after: 1000, from: 1000 },
  { label: "수수료 −1.35", after: 998.65, from: 1000 },
  { label: "미실현 손실 −700", after: 298.65, from: 998.65 },
  { label: "펀딩 순지급 −20", after: 278.65, from: 298.65 },
] as const;

const SCENES = [
  { label: "담보에서 비용 빼기", summary: "1,000 − 1.35 = 998.65", shown: 2, lines: 0, note: "앞에서 계산한 수수료 1.35를 뺀 값에서 시작합니다. 여기서 뒤 두 줄을 가정합니다." },
  { label: "손실 700", summary: "998.65 − 700 = 298.65", shown: 3, lines: 0, note: "미실현 손실은 포지션을 아직 닫지 않은 상태의 평가 손실입니다. 5,000달러 계약의 손실이 1,000 USDC 담보를 크게 줄입니다." },
  { label: "펀딩 20", summary: "298.65 − 20 = 278.65", shown: 4, lines: 0, note: "펀딩은 무기한 계약 보유자끼리 주고받는 정기 지급입니다. 순지급 20 USDC를 빼면 계정 가치는 278.65입니다." },
  { label: "유지 요구액 300", summary: "300 − 278.65 = 21.35 부족", shown: 4, lines: 1, note: "유지 요구액은 포지션을 유지하는 데 필요한 계정 가치입니다. 278.65는 이보다 21.35 부족합니다. 공식 규칙은 먼저 주문장에서 포지션을 닫으려 시도합니다." },
  { label: "기준의 2/3", summary: "300 × 2/3 = 200 < 278.65", shown: 4, lines: 2, note: "backstop은 주문장 밖에서 포지션을 인수하는 경로입니다. 주문장 정리에 실패하고 계정 가치가 200 아래로 내려가야 열리므로, 이 사례의 278.65는 아직 그 아래가 아닙니다." },
] as const;

export default function MarginLadderViz() {
  return (
    <SceneShell
      eyebrow="(가정) 계정 가치와 두 기준선"
      title="278.65는 어느 기준 아래이고 어느 기준 위일까요"
      description="막대 길이는 USDC 금액에 비례합니다. 손실 700, 펀딩 20, 유지 요구액 300은 모두 가정입니다."
      note="300은 설명용 값입니다. 실제 요구액은 자산·규모 구간·mark price로 다시 계산하고, 실제 주문장 가격과 평가가격은 다를 수 있으며, 큰 포지션에는 부분 청산 규칙도 있습니다."
      ariaLabel="1,000 USDC에서 비용과 손실을 뺀 계정 가치 278.65와 기준선 300, 200 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {ROWS.map((row, index) => {
              const y = 30 + index * 44;
              const on = index < scene.shown;
              return (
                <g key={row.label} opacity={on ? 1 : 0.2}>
                  <text x={scaleX(300) + 6} y={y - 4} fontSize={12} fill="currentColor">{row.label}</text>
                  <text x={VALUE_X + AXIS} y={y - 4} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">{on ? row.after.toLocaleString("en-US") : "−"}</text>
                  <rect x={VALUE_X} y={y} width={AXIS} height={16} rx={2} fill="#94a3b8" fillOpacity={0.14} />
                  {on && row.from !== row.after && <rect x={scaleX(row.after)} y={y} width={scaleX(row.from) - scaleX(row.after)} height={16} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />}
                  {on && <rect x={VALUE_X} y={y} width={scaleX(row.after) - VALUE_X} height={16} rx={2} fill="#2563eb" />}
                </g>
              );
            })}
            {scene.lines >= 1 && (
              <g>
                <line x1={scaleX(300)} x2={scaleX(300)} y1={16} y2={196} stroke="#dc2626" strokeWidth={1.25} />
                <text x={scaleX(300) + 4} y={207} fontSize={11} fontWeight={700} fill="#dc2626">300 유지 요구액</text>
              </g>
            )}
            {scene.lines >= 2 && (
              <g>
                <line x1={scaleX(200)} x2={scaleX(200)} y1={16} y2={196} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={scaleX(200) - 4} y={207} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">200 (2/3)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
