import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 판매 10억에서 공사 5억, 금융·허가·관련 1억, 정상 이익 1억을 빼면 토지 3억(가정).
 * 10−5=5, 5−1=4, 4−1=3. 막대 폭은 금액에 비례한다.
 */
const UNIT = 26;
const X0 = 88;
const ROW = 36;
const STEPS = [
  { name: "공사", amount: 5, color: "#64748b" },
  { name: "금융·허가", amount: 1, color: "#d97706" },
  { name: "정상 이익", amount: 1, color: "#16a34a" },
] as const;
const REMAINING = STEPS.map((_, index) => 10 - STEPS.slice(0, index + 1).reduce<number>((sum, step) => sum + step.amount, 0));

const SCENES = [
  { label: "예상 판매대금", summary: "10억 원", note: "완성한 집을 팔아 들어올 것으로 예상하는 돈입니다(가정). 세금과 시간 차이는 아래 합계에 반영했다고 단순화합니다." },
  { label: "공사비를 뺍니다", summary: "10 − 5 = 5억 원", note: "막대 왼쪽이 아직 남은 돈입니다. 오른쪽부터 쓰임새를 덜어 냅니다." },
  { label: "금융·허가·관련 비용을 뺍니다", summary: "5 − 1 = 4억 원", note: "돈을 빌리고 허가를 받는 데 드는 비용입니다(가정). 남은 돈은 4억 원입니다." },
  { label: "정상 이익도 먼저 뺍니다", summary: "4 − 1 = 3억 원", note: "정상 이익은 사업자가 이 사업을 하려고 요구하는 몫입니다. 토지비를 정하기 전에 비용처럼 덜어 둡니다." },
  { label: "남은 칸이 토지의 상한", summary: "최대 토지비 3억 원", note: "3억은 거래된 땅의 시세가 아닙니다. 예상 판매가와 비용을 받아들일 때 사업자가 감당할 수 있는 최대 금액을 계산한 값입니다." },
] as const;

export default function ResidualStackViz() {
  return (
    <SceneShell
      eyebrow="거꾸로 계산"
      title="판매대금에서 다른 몫을 덜어 내면 땅에 쓸 돈이 남습니다"
      description="막대 폭은 금액에 비례합니다. 모든 금액은 이 글의 가정입니다."
      ariaLabel="판매대금 10억에서 비용과 정상 이익을 빼 토지비 3억을 얻는 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0 - 8} y={26} textAnchor="end" fontSize={13} fontWeight={700} fill="#64748b">판매</text>
          <rect x={X0} y={10} width={10 * UNIT} height={24} rx={2} fill="#94a3b8" />
          <text x={X0 + 5 * UNIT} y={27} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">10억</text>
          {STEPS.map((step, index) => {
            if (active < index + 1) return null;
            const y = 10 + ROW * (index + 1);
            const left = REMAINING[index];
            return (
              <g key={step.name}>
                <text x={X0 - 8} y={y + 16} textAnchor="end" fontSize={13} fontWeight={700} fill={step.color}>{step.name}</text>
                <rect x={X0} y={y} width={left * UNIT} height={24} rx={2} fill="#94a3b8" opacity={0.35} />
                <rect x={X0 + left * UNIT} y={y} width={step.amount * UNIT} height={24} fill={step.color} />
                <text x={X0 + left * UNIT + (step.amount * UNIT) / 2} y={y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{step.amount}억</text>
                <text x={X0 + (left * UNIT) / 2} y={y + 17} textAnchor="middle" fontSize={13} fill="#64748b">남음 {left}억</text>
              </g>
            );
          })}
          {active === 4 && (
            <>
              <text x={X0 - 8} y={10 + ROW * 4 + 16} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">토지 상한</text>
              <rect x={X0} y={10 + ROW * 4} width={3 * UNIT} height={24} rx={2} fill="#2563eb" />
              <text x={X0 + 1.5 * UNIT} y={10 + ROW * 4 + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">3억</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
