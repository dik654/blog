import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need, #limits — 자산 만기는 길고 돈은 짧다. 연장 거절 시 95억95만이 필요하고
 * 증권을 90억으로만 평가받으면 원금 기준 95 − 90 = 5억 부족. 처음 여유 5억 < 하락 10억.
 * 위쪽 시간 띠의 길이는 비례가 아닌 그림(가정)이고, 아래쪽 막대만 금액에 비례한다.
 */
const SCENES = [
  { label: "연장이 이어지는 동안", summary: "긴 자산 · 짧은 돈", note: "자산의 만기는 긴데 돈을 되돌려줄 날짜는 짧으면 자금을 쓰는 쪽은 자주 새 거래를 구해야 합니다. 내일도 95억 원을 빌릴 수 있을 것으로 생각하는 상태입니다." },
  { label: "상대가 연장을 거절하면", summary: "만기에 95억95만 원 필요", note: "상대가 전액 연장을 거절하면 새 돈이 들어오지 않고, 만기에 약정한 95억95만 원을 구해야 합니다. 자산의 만기는 아직 남아 있습니다." },
  { label: "증권을 90억으로만 평가받으면", summary: "95 − 90 = 원금 기준 5억 부족", note: "환매와 연계한 매각이나 계약 종료 정산에서 증권을 90억 원으로만 평가받는 경우입니다. 원금 기준으로 5억 원이 모자랍니다." },
  { label: "처음의 여유와 비교하면", summary: "여유 5억 < 하락 10억", note: "처음의 5% 여유는 5억 원이고 실제 가격 하락은 10%, 곧 10억 원입니다. 여유가 하락을 모두 막지 못해 남은 차이가 5억 원입니다." },
] as const;

const W = 372;
const LEFT = 74;
const BAR_W = 280;
const x = (value: number) => LEFT + (value / 105) * BAR_W;
const BLOCK_W = 88;
const BLOCK_X = [LEFT, LEFT + BLOCK_W + 8, LEFT + 2 * (BLOCK_W + 8)];

export default function RolloverFailViz() {
  return (
    <SceneShell
      eyebrow="만기 연장 실패"
      title="담보가 있어도 연장이 끊기면 큰 현금이 한꺼번에 필요합니다"
      description="위쪽 띠는 시간 순서만 보이며 길이는 그림을 위한 가정입니다. 아래 막대는 금액에 비례합니다. 금액은 모두 설명을 위한 가정입니다."
      note="담보로 넘긴 증권을 차입자가 아무 조건 없이 먼저 팔 수 있다는 뜻은 아닙니다."
      ariaLabel="만기 연장 거절 뒤 필요한 현금과 증권 평가액의 차이"
      scenes={SCENES}
      render={(active) => {
        const refused = active >= 1;
        const valued = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={2} y={21} fontSize={13} fontWeight={700} className="fill-foreground">보유 자산</text>
            <rect x={LEFT} y={6} width={W - LEFT - 2} height={22} rx={3} fill="#64748b" opacity={0.85} />
            <text x={LEFT + 8} y={21} fontSize={13} fontWeight={700} fill="#ffffff">만기가 긴 자산</text>
            <text x={2} y={55} fontSize={13} fontWeight={700} className="fill-foreground">빌린 돈</text>
            {BLOCK_X.map((blockX, index) => {
              const broken = refused && index > 0;
              return (
                <g key={blockX}>
                  <rect x={blockX} y={38} width={BLOCK_W} height={26} rx={3} fill={broken ? "none" : "#2563eb"} opacity={broken ? 1 : 0.85} stroke={broken ? "#dc2626" : "#2563eb"} strokeWidth={1} strokeDasharray={broken ? "3 3" : undefined} />
                  <text x={blockX + BLOCK_W / 2} y={55} textAnchor="middle" fontSize={13} fontWeight={700} fill={broken ? "#dc2626" : "#ffffff"}>
                    {index === 0 ? "95억" : broken ? (index === 1 ? "연장 거절" : "새 돈 없음") : "연장 95억"}
                  </text>
                </g>
              );
            })}
            {refused && (
              <g>
                <line x1={BLOCK_X[1] - 4} x2={BLOCK_X[1] - 4} y1={32} y2={74} stroke="#dc2626" strokeWidth={1.25} />
                <text x={BLOCK_X[1] + 2} y={84} fontSize={13} fontWeight={700} fill="#dc2626">이날 95억95만 원을 구해야 합니다</text>
              </g>
            )}

            <text x={2} y={118} fontSize={13} fontWeight={700} className="fill-foreground">갚을 원금</text>
            <rect x={LEFT} y={102} width={x(95) - LEFT} height={24} rx={3} fill="#475569" />
            <text x={x(95) - 6} y={119} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">95억</text>

            <text x={2} y={158} fontSize={13} fontWeight={700} className="fill-foreground">증권 평가</text>
            {valued ? (
              <g>
                <rect x={LEFT} y={142} width={x(90) - LEFT} height={24} rx={3} fill="#2563eb" />
                <text x={x(90) - 6} y={159} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">90억</text>
                <rect x={x(90)} y={142} width={x(95) - x(90)} height={24} fill="#dc2626" opacity={0.25} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                {active === 3 && <rect x={x(95)} y={142} width={x(100) - x(95)} height={24} fill="#94a3b8" opacity={0.35} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />}
                <line x1={x(95)} x2={x(95)} y1={126} y2={172} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
                <text x={x(100)} y={186} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">
                  {active === 3 ? "100억에서 하락 10억 = 여유 5억 + 부족 5억" : "5억 부족"}
                </text>
                </g>
            ) : (
              <g>
                <rect x={LEFT} y={142} width={BAR_W} height={24} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
                <text x={LEFT + BAR_W / 2} y={159} textAnchor="middle" fontSize={13} className="fill-muted-foreground">아직 정해지지 않음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
