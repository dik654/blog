import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 한도(30,000→3,000), 50% 청산선, 가격 틈, 마이너스 잔액 보호를 한 계좌 자금 축에 놓는다.
 * 계좌 자금 = 100 − 노출 × 불리한 이동.
 * 30,000: 1% → 100−300 = −200 (보호 장치 없다고 놓은 계산). 3,000: 1% → 70, 50÷3,000 ≈ 1.67%에서 자금 50.
 * 가격 틈 1.5%(자금 55) → 4%(자금 −20)는 설명용 가정이며, 보호가 −20을 0으로 제한한다.
 * 틈 구간은 체결이 없으므로 선으로 잇지 않는다(이으면 3,000 노출 기울기와 같아 청산선을 지나며 거래된 것처럼 읽힌다).
 */
const X0 = 46;
const X1 = 344;
const Y_TOP = 18;
const Y_BOT = 182;
const MOVE_MAX = 5;
const V_MAX = 120;
const V_MIN = -220;

const x = (move: number) => X0 + (move / MOVE_MAX) * (X1 - X0);
const y = (value: number) => Y_TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (Y_BOT - Y_TOP);
const equity = (exposure: number, move: number) => 100 - (exposure * move) / 100;

const WIDE_END = 320 / 300; // 30,000 노출이 축 아래(−220)에 닿는 이동(%)
const CLOSE_MOVE = 5 / 3; // 손실 50 = 3,000 × 1.67%
const GAP_FROM = 1.5;
const GAP_TO = 4;

const SCENES = [
  {
    label: "한도 전: 노출 30,000",
    summary: "1% 이동 → 손실 300 · 자금 −200",
    note: "현금 100으로 노출 30,000을 잡던 거래(4절)라면 1% 불리한 이동의 손실은 30,000×1%=300입니다. 다른 장치가 없다고 놓은 계산이면 계좌는 100−300=−200이 되고, 약 0.33%만 움직여도 100이 모두 사라집니다.",
  },
  {
    label: "30대 1 한도: 노출 3,000",
    summary: "1% 이동 → 손실 30 · 자금 70",
    note: "30대 1 한도는 같은 현금 100의 노출을 3,000으로 줄여 1% 이동의 손실을 30으로 낮춥니다(다른 손익·비용·입출금 없음 가정). 속도가 줄었을 뿐 방향을 틀리면 손실은 계속 생기고, 약 3.33%에서 초기 현금 100과 맞먹습니다.",
  },
  {
    label: "50% 청산선",
    summary: "손실 50(약 1.67% 이동)에서 닫음",
    note: "유지에 필요한 증거금도 100이고 50% 계좌 청산 규칙이 그대로 작동한다고 놓으면(3절의 설명용 가정) 자금이 50까지 줄 때, 곧 50÷3,000≈1.67% 이동에서 포지션을 닫습니다. 실제 청산 가격은 계좌 전체 포지션·가격 틈·비용을 반영해 약관과 화면에서 다시 계산해야 합니다.",
  },
  {
    label: "주말 가격 틈",
    summary: "청산선 너머 4%에서 체결 → −20 (가정)",
    note: "거래가 멈춘 사이 가격이 움직이면 다음에 주문 가능한 가격이 청산선 너머에서 시작할 수 있습니다. 1.5%에서 멈췄다가 4%에서 다시 열렸다고 놓으면(가정) 계산한 선 50이 아니라 100−3,000×4%=−20에서 닫힙니다.",
  },
  {
    label: "마이너스 잔액 보호",
    summary: "−20을 0으로 제한 → 손실은 넣은 100",
    note: "적용 대상 소매 CFD 계좌라면 마이너스 잔액 보호가 넣은 전체 자금을 넘는 손실을 막아 −20의 빚을 0으로 제한합니다. 그래도 넣은 100은 모두 잃었습니다. 이 장치는 빚이 생기는 피해를 막을 뿐, 계좌가 0으로 가는 손실을 막지는 않습니다.",
  },
] as const;

const TICKS_X = [0, 1, 2, 3, 4, 5];
const TICKS_Y = [100, 50, 0, -100, -200];

export default function LeverageCloseoutViz() {
  return (
    <SceneShell
      eyebrow="한도와 제동장치"
      title="불리한 이동에 따라 계좌 자금이 줄어드는 길"
      description="가로축은 기초 환율의 불리한 이동(%), 세로축은 현금 100으로 시작한 계좌 자금입니다. 1·3절의 설명용 계좌(다른 손익·비용·입출금 없음)를 그대로 씁니다."
      ariaLabel="노출 30,000과 3,000의 계좌 자금 경로, 50퍼센트 청산선, 가격 틈과 마이너스 잔액 보호"
      scenes={SCENES}
      render={(active) => {
        const wideStrong = active === 0;
        const narrowStrong = active >= 1;
        const showClose = active >= 2;
        const showGap = active >= 3;
        const showFloor = active === 4;
        // 청산 장면에서는 청산선에서 실선을 멈추고, 그 뒤는 닫히지 않았을 때의 참고선(점선)으로만 둔다.
        const narrowEnd = showGap ? GAP_FROM : active === 2 ? CLOSE_MOVE : MOVE_MAX;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {TICKS_Y.map((value) => (
              <g key={value}>
                <line x1={X0} x2={X1} y1={y(value)} y2={y(value)} stroke={value === 0 ? "#64748b" : "#e2e8f0"} strokeWidth={1} />
                <text x={X0 - 6} y={y(value) + 4} textAnchor="end" fontSize={10} fill="#64748b">{value}</text>
              </g>
            ))}
            {TICKS_X.map((move) => (
              <text key={move} x={x(move)} y={Y_BOT + 14} textAnchor="middle" fontSize={10} fill="#64748b">{move}%</text>
            ))}
            <text x={X1} y={Y_BOT + 28} textAnchor="end" fontSize={10} fill="#64748b">불리한 이동 →</text>
            <text x={X0 - 38} y={Y_TOP - 6} fontSize={10} fill="#64748b">계좌 자금</text>

            {showClose && (
              <g>
                <line x1={X0} x2={X1} y1={y(50)} y2={y(50)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={X1} y={y(50) - 5} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">청산선 50 (가정)</text>
              </g>
            )}

            <line x1={x(0)} y1={y(100)} x2={x(WIDE_END)} y2={y(V_MIN)} stroke={wideStrong ? "#dc2626" : "#cbd5e1"} strokeWidth={wideStrong ? 1.25 : 1} />
            <text x={x(0.4) + 6} y={y(-20) + 4} fontSize={10} fill={wideStrong ? "#b91c1c" : "#94a3b8"}>노출 30,000</text>
            {wideStrong && (
              <g>
                <circle cx={x(1)} cy={y(-200)} r={3.5} fill="#dc2626" />
                <text x={x(1) + 8} y={y(-200) + 4} fontSize={11} fontWeight={700} fill="#b91c1c">1% → −200</text>
              </g>
            )}

            {active === 2 && (
              <line x1={x(CLOSE_MOVE)} y1={y(50)} x2={x(MOVE_MAX)} y2={y(equity(3000, MOVE_MAX))} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            )}
            <line
              x1={x(0)}
              y1={y(100)}
              x2={x(narrowEnd)}
              y2={y(equity(3000, narrowEnd))}
              stroke={narrowStrong ? "#2563eb" : "#cbd5e1"}
              strokeWidth={narrowStrong ? 1.25 : 1}
            />
            {!showGap && <text x={x(MOVE_MAX) - 2} y={y(equity(3000, MOVE_MAX)) + 14} textAnchor="end" fontSize={10} fill={narrowStrong ? "#1d4ed8" : "#94a3b8"}>노출 3,000</text>}
            {active === 1 && (
              <g>
                <circle cx={x(1)} cy={y(70)} r={3.5} fill="#2563eb" />
                <text x={x(1) + 8} y={y(70) - 6} fontSize={11} fontWeight={700} fill="#1d4ed8">1% → 70</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <circle cx={x(CLOSE_MOVE)} cy={y(50)} r={3.5} fill="#d97706" />
                <text x={x(CLOSE_MOVE) - 6} y={y(50) + 16} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">≈1.67%에서 닫음</text>
              </g>
            )}
            {showGap && (
              <g>
                <circle cx={x(GAP_FROM)} cy={y(equity(3000, GAP_FROM))} r={3} fill="#2563eb" />
                <text x={x(GAP_FROM) - 4} y={y(equity(3000, GAP_FROM)) + 15} textAnchor="end" fontSize={10} fill="#1d4ed8">1.5% 멈춤</text>
                {/* 가격 틈: 1.5%와 4% 사이 가격에서는 체결이 없었으므로 잇는 선 대신 빈 구간으로 둔다. */}
                <rect x={x(GAP_FROM)} y={Y_TOP} width={x(GAP_TO) - x(GAP_FROM)} height={Y_BOT - Y_TOP} fill="#94a3b8" fillOpacity={0.14} />
                <text x={(x(GAP_FROM) + x(GAP_TO)) / 2} y={y(-120)} textAnchor="middle" fontSize={10} fill="#475569">이 사이 가격엔</text>
                <text x={(x(GAP_FROM) + x(GAP_TO)) / 2} y={y(-120) + 13} textAnchor="middle" fontSize={10} fill="#475569">체결 없음(가격 틈)</text>
                <circle cx={x(GAP_TO)} cy={y(-20)} r={3.5} fill={showFloor ? "none" : "#dc2626"} stroke="#dc2626" strokeWidth={1.25} />
                <text x={x(GAP_TO) + 8} y={y(-20) + 14} fontSize={11} fontWeight={700} fill="#b91c1c">4%에서 −20</text>
              </g>
            )}
            {showFloor && (
              <g>
                <line x1={x(GAP_TO)} y1={y(-20) - 4} x2={x(GAP_TO)} y2={y(0) + 5} stroke="#16a34a" strokeWidth={1.25} />
                <path d={`M ${x(GAP_TO) - 4} ${y(0) + 8} L ${x(GAP_TO)} ${y(0) + 2} L ${x(GAP_TO) + 4} ${y(0) + 8}`} fill="none" stroke="#16a34a" strokeWidth={1.25} />
                <circle cx={x(GAP_TO)} cy={y(0)} r={3.5} fill="#16a34a" />
                <text x={x(GAP_TO) - 8} y={y(0) - 8} textAnchor="end" fontSize={11} fontWeight={700} fill="#15803d">보호 뒤 0</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
