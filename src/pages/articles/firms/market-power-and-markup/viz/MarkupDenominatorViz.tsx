import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 차이 3을 가격 10으로 나누면 30%(러너 지수), 비용 7로 나누면 약 42.9%(원가 가산율),
 * μ=10÷7≈1.43이고 러너 지수=1−1/μ=0.3. 실증 수치 μ 1.21→1.61은 러너 지수 약 0.17→0.38입니다.
 * 막대 폭은 한계비용을 같은 폭(210)으로 맞춰 그렸습니다. 1.43의 차이 폭 90 = 3×30.
 */
const SCENES = [
  { label: "가격으로 나눔", summary: "3 ÷ 10 = 30%", note: "가격에서 한계비용을 뺀 차이를 가격으로 나눈 비율이 이 글의 마크업 지표입니다. 이 비율을 러너 지수(Lerner index)라고 부릅니다." },
  { label: "비용으로 나눔", summary: "3 ÷ 7 ≈ 42.9%", note: "같은 차이 3을 비용 7로 나누면 원가 가산율입니다. 분자는 그대로인데 분모만 달라 다른 숫자가 나옵니다." },
  { label: "몇 배인지로 읽음", summary: "μ = 10 ÷ 7 ≈ 1.43", note: "μ는 가격이 한계비용의 몇 배인지입니다. 러너 지수 = 1 − 1/μ = 1 − 7/10 = 0.3으로 서로 바뀝니다." },
  { label: "실증 수치 읽기", summary: "μ 1.21 → 1.61 · 러너 약 0.17 → 0.38", note: "De Loecker·Eeckhout·Unger의 2020년 QJE 논문이 보고한 집계 마크업을 러너 지수로 바꾼 값입니다. 작업논문판은 18%에서 67%로 적어 판본마다 수치가 다르고, 저자들은 중앙값은 그대로였다고 덧붙였습니다." },
] as const;

const X0 = 16;
const COST_W = 210;
const UNIT = COST_W / 7;

function Bar({ y, h, gap, costLabel, gapLabel }: { y: number; h: number; gap: number; costLabel: string; gapLabel: string }) {
  return (
    <g>
      <rect x={X0} y={y} width={COST_W} height={h} fill="#64748b" fillOpacity={0.22} stroke="#64748b" strokeWidth={1} />
      <rect x={X0 + COST_W} y={y} width={gap} height={h} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />
      <text x={X0 + COST_W / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fill="#64748b">{costLabel}</text>
      <text x={X0 + COST_W + gap / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{gapLabel}</text>
    </g>
  );
}

function Bracket({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <path d={`M${x1} ${y - 6} V${y} H${x2} V${y - 6}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
      <text x={(x1 + x2) / 2} y={y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">{label}</text>
    </g>
  );
}

export default function MarkupDenominatorViz() {
  return (
    <SceneShell
      eyebrow="같은 차이, 다른 분모"
      title="가격 10과 비용 7의 차이 3을 무엇과 견주느냐"
      description="막대 전체가 가격, 회색 부분이 한계비용, 파란 부분이 그 차이입니다. 숫자 10·7은 이 글의 (가정)이며, 마지막 장면만 논문의 수치입니다."
      ariaLabel="가격과 한계비용의 차이를 가격, 비용, 배수로 읽는 방법과 실증 수치"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? (
            <>
              <Bar y={32} h={40} gap={3 * UNIT} costLabel="한계비용 7" gapLabel="차이 3" />
              {active === 2 && <text x={X0 + 150} y={22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">가격 10</text>}
              {active === 2 && <path d={`M${X0} 30 V25 H${X0 + 300} V30`} fill="none" stroke="#64748b" strokeWidth={1} />}
              {active === 0 && <Bracket x1={X0} x2={X0 + 300} y={84} label="분모: 가격 10" />}
              {active === 1 && <Bracket x1={X0} x2={X0 + COST_W} y={84} label="분모: 비용 7" />}
              {active === 2 && <Bracket x1={X0} x2={X0 + COST_W} y={84} label="한 배 = 비용 7" />}
            </>
          ) : (
            <>
              <text x={X0} y={13} fontSize={12} fontWeight={700} fill="#64748b">1980년 μ = 1.21 · 러너 지수 ≈ 0.17</text>
              <Bar y={19} h={32} gap={0.21 * COST_W} costLabel="한계비용 = 1" gapLabel="0.21" />
              <text x={X0} y={81} fontSize={12} fontWeight={700} fill="#64748b">논문 시점 μ = 1.61 · 러너 지수 ≈ 0.38</text>
              <Bar y={87} h={32} gap={0.61 * COST_W} costLabel="한계비용 = 1" gapLabel="0.61" />
            </>
          )}
        </svg>
      )}
    />
  );
}
