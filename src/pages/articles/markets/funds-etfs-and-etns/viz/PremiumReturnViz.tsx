import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1억÷1만 좌=1만 원. 매수 1만100, 매도 1만1000.
 * 자산 (1만1000−1만)÷1만=10%, 투자자 (1만1000−1만100)÷1만100≈8.91%. 모두 본문의 가정입니다.
 */
const SCENES = [
  { label: "1억 원을 1만 좌로", summary: "1억 ÷ 1만 좌 = 1만 원", note: "비용과 빚을 뺀 자산 묶음 1억 원을 1만 좌로 나누면 한 좌에 담긴 자산은 1만 원입니다." },
  { label: "1만100원에 삽니다", summary: "담긴 값보다 100원 더", note: "거래 화면의 체결 가격은 1만100원입니다. 담긴 자산 1만 원보다 100원을 더 내고 시작합니다." },
  { label: "둘 다 1만1000원이 되면", summary: "자산 +1000 · 투자자 +900", note: "도착점은 같아도 출발점이 100원 다릅니다. 그래서 투자자가 번 돈은 1000원이 아니라 900원입니다." },
  { label: "수익률은 출발점으로 나눕니다", summary: "10% 대 8.91%", note: "자산은 1000원을 1만 원으로 나눠 10%, 투자자는 900원을 1만100원으로 나눠 약 8.91%입니다. 줄어든 분자와 커진 분모가 함께 작용합니다." },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const GRAY = "#64748b";
const AMBER = "#d97706";
const X = (value: number) => 40 + ((value - 9900) / 1200) * 260;
const ROW_A = 56;
const ROW_B = 124;

function Pool() {
  return (
    <g>
      <text x={10} y={26} fontSize={13} fontWeight={700} fill="currentColor">자산 묶음 1억 원 (비용·빚을 뺀 값)</text>
      {Array.from({ length: 40 }, (_, index) => (
        <rect key={index} x={10 + index * 8} y={38} width={7} height={70} rx={1} fill={index === 0 ? ACCENT : MUTED} opacity={index === 0 ? 1 : 0.35} />
      ))}
      <text x={10} y={130} fontSize={13} fontWeight={700} fill={ACCENT}>막대 하나 = 한 좌 = 1만 원</text>
      <text x={10} y={150} fontSize={12} fill={GRAY}>실제로는 1만 칸이고, 그림은 줄여 그렸습니다</text>
    </g>
  );
}

function Rows({ active }: { active: number }) {
  return (
    <g>
      <text x={0} y={ROW_A - 24} fontSize={12} fontWeight={700} fill="currentColor">한 좌에 담긴 자산</text>
      <text x={X(10000) + 6} y={ROW_B - 24} fontSize={12} fontWeight={700} fill={ACCENT}>내가 낸 가격</text>
      <line x1={10} x2={330} y1={ROW_A} y2={ROW_A} stroke={MUTED} strokeWidth={0.5} />
      <line x1={10} x2={330} y1={ROW_B} y2={ROW_B} stroke={MUTED} strokeWidth={0.5} />
      <line x1={X(10000)} x2={X(10000)} y1={ROW_A + 24} y2={ROW_B} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={X(10000)} x2={X(10100)} y1={ROW_B} y2={ROW_B} stroke={AMBER} strokeWidth={1.25} />
      {active === 1 && <text x={X(10100) + 12} y={ROW_B + 4} fontSize={13} fontWeight={700} fill={AMBER}>100원 더 냄</text>}
      <circle cx={X(10000)} cy={ROW_A} r={4} fill={GRAY} />
      <text x={X(10000)} y={ROW_A + 19} textAnchor="middle" fontSize={12} fill={GRAY}>1만</text>
      <circle cx={X(10100)} cy={ROW_B} r={4} fill={ACCENT} />
      <text x={X(10100)} y={ROW_B + 19} textAnchor="middle" fontSize={12} fill={ACCENT}>1만100</text>
      {active >= 2 && (
        <g>
          <line x1={X(10000)} x2={X(11000)} y1={ROW_A} y2={ROW_A} stroke={GRAY} strokeWidth={1.25} />
          <line x1={X(10100)} x2={X(11000)} y1={ROW_B} y2={ROW_B} stroke={ACCENT} strokeWidth={1.25} />
          <circle cx={X(11000)} cy={ROW_A} r={4} fill={GRAY} />
          <circle cx={X(11000)} cy={ROW_B} r={4} fill={ACCENT} />
          <text x={X(11000)} y={ROW_A + 19} textAnchor="middle" fontSize={12} fill={GRAY}>1만1000</text>
          <text x={X(11000)} y={ROW_B + 19} textAnchor="middle" fontSize={12} fill={ACCENT}>1만1000</text>
          <text x={204} y={ROW_A - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>{active === 2 ? "+1000원" : "1000 ÷ 1만 = 10%"}</text>
          <text x={204} y={ROW_B - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>{active === 2 ? "+900원" : "900 ÷ 1만100 ≈ 8.91%"}</text>
        </g>
      )}
    </g>
  );
}

export default function PremiumReturnViz() {
  return (
    <SceneShell
      eyebrow="출발점의 차이"
      title="자산이 10% 올랐는데 내 수익이 8.91%인 이유"
      description="가로로 갈수록 가격이 높습니다. 위 줄은 한 좌에 담긴 자산, 아래 줄은 내가 낸 가격입니다."
      note="모든 수치는 가정이며 세금과 분배금은 제외합니다."
      ariaLabel="한 좌의 자산 가치와 매수 가격이 같은 도착점까지 움직일 때 수익률이 갈리는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 164" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <Pool /> : <Rows active={active} />}
        </svg>
      )}
    />
  );
}
