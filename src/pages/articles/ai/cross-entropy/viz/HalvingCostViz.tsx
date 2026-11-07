import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 1을 절반으로 줄인 횟수가 비용이다.
 * 1 → 0, 1/2 → 1, 1/4 → 2, 1/8 → 3. 두 번째 표에서 A(1/4) 다음 C(1/2)는 1/8, 비용 2+1=3.
 */
const SCENES = [
  { label: "확률 1", summary: "줄인 횟수 0 → 비용 0", note: "막대 전체가 확률 1입니다. 한 번도 줄이지 않았으므로 비용은 0입니다." },
  { label: "확률 1/2", summary: "줄인 횟수 1 → 비용 1", note: "절반으로 한 번 줄입니다. 첫 번째 표에서 확률 1/2인 A에 1자리를 쓴 것과 같습니다." },
  { label: "확률 1/4", summary: "줄인 횟수 2 → 비용 2", note: "한 번 더 줄입니다. 첫 번째 표에서 확률 1/4인 B와 C에 2자리를 쓴 것과 같습니다." },
  { label: "확률 1/8", summary: "줄인 횟수 3 → 비용 3", note: "확률이 절반이 될 때마다 비용 칸이 하나씩 늘어납니다." },
  { label: "A 다음 C", summary: "1/4 × 1/2 = 1/8 · 2 + 1 = 3", note: "두 번째 예측표에서 독립으로 뽑는다고 하면 A가 막대를 1/4로 줄이고 C가 그 절반으로 줄입니다. 확률은 곱해지고 비용 칸은 이어 붙습니다." },
] as const;

const COUNTS = [0, 1, 2, 3, 3] as const;
const BAR_X = 30;
const BAR_W = 300;
const CELL = 40;

export default function HalvingCostViz() {
  return (
    <SceneShell
      eyebrow="절반의 횟수"
      title="막대를 절반으로 줄인 횟수가 비용입니다"
      description="위 막대의 채운 길이가 확률이고, 아래 칸 하나가 비용 1입니다."
      ariaLabel="확률을 절반으로 줄일 때마다 비용이 1씩 늘어나는 과정"
      scenes={SCENES}
      render={(active) => {
        const count = COUNTS[active];
        const isPair = active === 4;
        const width = BAR_W / 2 ** count;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={BAR_X} y={16} fontSize={13} fontWeight={700} fill="#64748b">남은 확률</text>
            <rect x={BAR_X} y={24} width={BAR_W} height={30} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <rect x={BAR_X} y={24} width={width} height={30} rx={3} fill="#2563eb" />
            {[1, 2, 3].map((times) => (
              <line key={times} x1={BAR_X + BAR_W / 2 ** times} x2={BAR_X + BAR_W / 2 ** times} y1={54} y2={60} stroke="#94a3b8" strokeWidth={1} />
            ))}
            {["1/2", "1/4", "1/8"].map((text, index) => (
              <text key={text} x={BAR_X + BAR_W / 2 ** (index + 1)} y={73} textAnchor="middle" fontSize={13} fill="#64748b">{text}</text>
            ))}
            <text x={BAR_X} y={100} fontSize={13} fontWeight={700} fill="#64748b">비용</text>
            {[0, 1, 2].map((slot) => {
              const filled = slot < count;
              const fromC = isPair && slot === 2;
              return (
                <g key={slot}>
                  <rect
                    x={BAR_X + slot * (CELL + 6)}
                    y={108}
                    width={CELL}
                    height={CELL}
                    rx={3}
                    fill={filled ? (fromC ? "#d97706" : "#2563eb") : "none"}
                    stroke={filled ? (fromC ? "#d97706" : "#2563eb") : "#cbd5e1"}
                    strokeDasharray={filled ? undefined : "3 3"}
                    strokeWidth={1}
                  />
                  {isPair && (
                    <text x={BAR_X + slot * (CELL + 6) + CELL / 2} y={133} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{fromC ? "C" : "A"}</text>
                  )}
                </g>
              );
            })}
            <text x={BAR_X + 3 * (CELL + 6) + 8} y={134} fontSize={18} fontWeight={700} fill="#2563eb">{count}</text>
          </svg>
        );
      }}
    />
  );
}
