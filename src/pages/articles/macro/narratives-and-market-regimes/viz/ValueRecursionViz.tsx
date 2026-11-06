import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단 — V=(C+V)÷(1+r) → rV=C → V=C÷r.
 * C=150, r=8%, V=1875: 1년 뒤 150+1875=2025, 2025÷1.08=1875, 1875×0.08=150.
 */
const SCENES = [
  { label: "1년 뒤에 손에 쥐는 것", summary: "V + C = 1875 + 150 = 2025", note: "1년 뒤에는 그해 현금 C를 받고, 그 뒤로도 똑같은 흐름을 가진 회사가 남습니다. 앞으로의 조건이 오늘과 같으므로 남은 회사의 가치도 다시 V입니다." },
  { label: "오늘로 당기면", summary: "2025 ÷ 1.08 = 1875", note: "1년 뒤의 합을 1+r로 나누면 오늘 가치입니다. 계산 결과가 출발한 V와 같으니 식 V=(C+V)÷(1+r)이 맞습니다." },
  { label: "같은 V를 양쪽에서 지우면", summary: "0.08 × 1875 = 150", note: "양변에 1+r을 곱하면 V+rV=C+V입니다. 두 줄의 V가 같으니 지우면 rV=C만 남고, 나누면 V=C÷r입니다. 100과 10%도 (100+1000)÷1.10=1000으로 같습니다." },
] as const;

const X0 = 16;
const SCALE = 328 / 2025;
const V_W = 1875 * SCALE;
const C_W = 150 * SCALE;
const BAR_H = 30;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

function Stacked({ y, label, tail, faded }: { y: number; label: string; tail: string; faded: boolean }) {
  return (
    <g>
      <text x={X0} y={y - 7} fontSize={12} fontWeight={700} fill={GRAY}>{label}</text>
      <text x={X0 + V_W + C_W} y={y - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>{tail} 150</text>
      <rect x={X0} y={y} width={V_W} height={BAR_H} fill={BLUE} opacity={faded ? 0.18 : 0.8} />
      <text x={X0 + V_W / 2} y={y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={faded ? GRAY : "#ffffff"}>V 1875</text>
      <rect x={X0 + V_W} y={y} width={C_W} height={BAR_H} fill={AMBER} />
    </g>
  );
}

export default function ValueRecursionViz() {
  return (
    <SceneShell
      eyebrow="V=C÷r이 나오는 자리"
      title="오늘 가치 안에는 1년 뒤의 같은 가치가 다시 들어 있습니다"
      description="매년 같은 현금 C가 계속되고 할인율 r이 양수라는 가정입니다. 숫자는 C=150, r=8%, 오늘 가치 V=1875이며 막대 길이는 같은 축척입니다."
      ariaLabel="1년 뒤의 현금과 남은 가치를 할인해 V=C÷r을 얻는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? (
            <>
              <Stacked y={24} label="1년 뒤: 남은 회사 + 그해 현금" tail="C" faded={false} />
              {active === 0 ? (
                <>
                  <rect x={X0} y={108} width={V_W} height={BAR_H} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={X0 + V_W / 2} y={128} textAnchor="middle" fontSize={12} fill={GRAY}>오늘 가치 V는 얼마?</text>
                </>
              ) : (
                <>
                  <text x={X0 + 160} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>↓ ÷ (1 + 0.08)</text>
                  <rect x={X0} y={108} width={V_W} height={BAR_H} fill={BLUE} opacity={0.8} />
                  <text x={X0 + V_W / 2} y={128} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">오늘 가치 V 1875</text>
                </>
              )}
            </>
          ) : (
            <>
              <Stacked y={24} label="오늘 V를 1년 키우면" tail="rV" faded />
              <Stacked y={92} label="1년 뒤에 받는 것" tail="C" faded />
              <text x={X0} y={150} fontSize={12} fontWeight={700} fill={AMBER}>남은 칸끼리 같음: rV = C</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
