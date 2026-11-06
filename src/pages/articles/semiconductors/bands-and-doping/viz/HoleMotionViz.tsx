import SceneShell from "./SceneShell";

/**
 * 본문 대응: #intrinsic — 결합을 떠난 전자와 남은 빈자리, 이웃 전자가 메우며 빈자리가 반대로 움직이는 과정.
 * 전자들은 한 칸씩 왼쪽으로, 빈자리는 오른쪽으로 간다. 자리 7칸과 이동 거리는 그림용 가정이다.
 */
const W = 360;
const H = 160;
const SITES = 7;
const site = (index: number) => 36 + index * 48;
const FREE_Y = 42;
const BOND_Y = 118;

const HOLE: readonly (number | null)[] = [null, 1, 2, 3, 3, null];

const SCENES = [
  { label: "전자가 모두 결합에 있을 때", summary: "결합 전자 7 · 빈자리 0", note: "그림의 출발점입니다. 전자가 모두 결합에 묶여 있으면 움직이는 전자도 빈자리도 없습니다." },
  { label: "전자 하나가 결합을 떠납니다", summary: "움직이는 전자 1 · 빈자리 1", note: "온도가 0 K보다 높으면 일부 전자가 결합 상태를 떠나 움직일 수 있는 상태로 올라갑니다. 전자가 떠난 결합에는 빈자리가 남으니 둘은 짝으로 생깁니다." },
  { label: "이웃 전자가 빈자리를 메웁니다", summary: "전자 ← 한 칸 · 빈자리 → 한 칸", note: "오른쪽 이웃 전자가 왼쪽 빈자리로 옮겨 갑니다. 움직인 것은 전자인데, 빈자리는 오른쪽으로 옮겨 간 셈이 됩니다." },
  { label: "다음 이웃이 또 메웁니다", summary: "빈자리 → 또 한 칸", note: "차례로 메우면 전자들은 각각 한 칸씩만 왼쪽으로 갔는데 빈자리는 계속 오른쪽으로 갑니다." },
  { label: "이 빈자리를 정공이라 부릅니다", summary: "정공 = 양전하를 옮기는 역할", note: "빈자리 자체가 반대쪽으로 움직이는 것처럼 셀 수 있으므로 이동하는 전자는 음전하를, 이 빈자리는 양전하를 옮기는 역할을 합니다. 결정에 뚫린 구멍이 아닙니다." },
  { label: "다시 만나면 함께 사라질 수 있습니다", summary: "전자 −1 · 정공 −1", note: "생길 때도 사라질 때도 짝이라, 외부 주입이나 빛이 없는 열평형의 순수 실리콘에서 두 농도는 같습니다. 300 K 기준값은 각각 약 10¹⁰ cm⁻³입니다." },
] as const;

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 7;
  const p1 = `${x2 - head * Math.cos(angle - 0.5)},${y2 - head * Math.sin(angle - 0.5)}`;
  const p2 = `${x2 - head * Math.cos(angle + 0.5)},${y2 - head * Math.sin(angle + 0.5)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polyline points={`${p1} ${x2},${y2} ${p2}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function HoleMotionViz() {
  return (
    <SceneShell
      eyebrow="움직이는 전자와 빈자리"
      title="전자가 왼쪽으로 메우면 빈자리는 오른쪽으로 갑니다"
      description="아래 줄의 칸은 결합 속 전자 자리이고, 위 줄은 결합을 떠나 움직일 수 있는 상태입니다. 채운 점이 전자, 점선 점이 빈자리입니다."
      note="칸 수와 방향은 그림용입니다(가정). 강의안도 결합 그림은 전자와 빈자리가 여러 원자 자리에 퍼지는 모습을 단순화한다고 경고합니다."
      ariaLabel="결합을 떠난 전자와 빈자리가 짝으로 생기고 빈자리가 이동하는 과정"
      scenes={SCENES}
      render={(active) => {
        const hole = HOLE[active];
        const showFree = active >= 1 && active <= 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={12} y={18} fontSize={11} fontWeight={700} fill="currentColor">움직일 수 있는 상태</text>
            <line x1={12} x2={W - 12} y1={FREE_Y} y2={FREE_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 4" />
            <text x={12} y={BOND_Y + 36} fontSize={11} fontWeight={700} fill="currentColor">결합 속 전자 자리</text>
            <line x1={12} x2={W - 12} y1={BOND_Y} y2={BOND_Y} stroke="#94a3b8" strokeWidth={1} />

            {Array.from({ length: SITES }, (_, index) => {
              const isHole = hole === index;
              return (
                <g key={index}>
                  <rect x={site(index) - 16} y={BOND_Y - 16} width={32} height={32} rx={6} fill="#64748b" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
                  <circle
                    cx={site(index)}
                    cy={BOND_Y}
                    r={8}
                    fill={isHole ? "none" : "#2563eb"}
                    stroke={isHole ? "#d97706" : "#2563eb"}
                    strokeWidth={isHole ? 1.25 : 1}
                    strokeDasharray={isHole ? "2 2" : undefined}
                  />
                  {isHole && <text x={site(index)} y={BOND_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">+</text>}
                </g>
              );
            })}

            {showFree && <circle cx={site(1)} cy={FREE_Y} r={8} fill="#2563eb" />}
            {showFree && <text x={site(1) + 13} y={FREE_Y - 11} fontSize={11} fill="currentColor">움직이는 전자</text>}

            {active === 1 && <Arrow x1={site(1)} y1={BOND_Y - 12} x2={site(1)} y2={FREE_Y + 12} color="#2563eb" />}
            {active === 2 && <Arrow x1={site(2) - 10} y1={BOND_Y - 22} x2={site(1) + 10} y2={BOND_Y - 22} color="#2563eb" />}
            {active === 3 && <Arrow x1={site(3) - 10} y1={BOND_Y - 22} x2={site(2) + 10} y2={BOND_Y - 22} color="#2563eb" />}
            {active === 4 && (
              <g>
                <Arrow x1={site(1)} y1={BOND_Y + 21} x2={site(3)} y2={BOND_Y + 21} color="#d97706" />
                <text x={site(3) + 8} y={BOND_Y + 25} fontSize={11} fontWeight={700} fill="currentColor">정공이 움직인 방향</text>
              </g>
            )}
            {active === 5 && (
              <g>
                <circle cx={site(1)} cy={FREE_Y} r={8} fill="#2563eb" fillOpacity={0.25} />
                <Arrow x1={site(1) + 7} y1={FREE_Y + 7} x2={site(3) - 7} y2={BOND_Y - 12} color="#2563eb" />
                <text x={site(3) + 14} y={BOND_Y - 40} fontSize={11} fontWeight={700} fill="currentColor">전자가 빈자리로 돌아옴</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
