import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — M₀=0, β=1, decay 없음. u₁=v₁=(2,0).
 * M₁=u₁k₁ᵀ이므로 M₁k₂=(k₁·k₂)u₁=0.6u₁=(1.2,0), u₂=v₂−0.6u₁=(−1.2,3).
 * 옮겨 적으면 u₂+0.6u₁=v₂ → (I+L)U=V, L의 대각선 아래 항 = 0.6.
 */
const SCENES = [
  {
    label: "첫 token: 빈 기억에서 시작",
    summary: "u₁ = (2,0) − 0 = (2,0)",
    note: "초기 기억 M₀가 0이라 k₁로 읽어도 0입니다. 첫 correction u₁은 값 v₁=(2,0) 그대로입니다.",
  },
  {
    label: "둘째 token: 첫 쓰기를 읽고 뺌",
    summary: "u₂ = (0,3) − 0.6×u₁ = (−1.2,3)",
    note: "u₁을 쓴 기억을 k₂로 읽으면 u₁에 두 주소의 내적 0.6을 곱한 (1.2,0)이 나옵니다. 그래서 u₂는 u₁이 정해진 뒤에야 계산됩니다.",
  },
  {
    label: "한 식으로 묶기",
    summary: "u₂ + 0.6u₁ = v₂",
    note: "빼던 항을 왼쪽으로 옮기면 더하기가 됩니다. 대각선 1과 그 아래 0.6만 있는 행렬로 두 correction을 한 번에 적은 것이 (I+L)U=diag(β)V이고, β=1이라 오른쪽은 V입니다. 위 행에서 u₁을 구하고 그 값을 아래 행에 넣어 u₂를 구합니다.",
  },
] as const;

const C_TOKEN = "#2563eb";
const C_DEP = "#d97706";

export default function TriangularCorrectionViz() {
  return (
    <SceneShell
      eyebrow="순차 의존성을 식 하나로"
      title="둘째 correction이 첫째에 기대는 관계가 대각선 아래 한 칸이 됩니다"
      description="3절의 두 쌍을 빈 기억 M₀=0부터 순서대로 쓰며, β=1·decay 없음으로 둡니다. correction u는 실제로 기억에 더하는 값입니다."
      ariaLabel="두 token의 correction을 순서대로 구하고 하삼각 연립식으로 묶는 과정"
      scenes={SCENES}
      render={(active) => {
        const showDep = active >= 1;
        const showMatrix = active === 2;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 두 token 행 */}
            {[0, 1].map((row) => {
              const y = 22 + row * 96;
              const solved = row === 0 || active >= 1;
              return (
                <g key={row}>
                  <rect x={10} y={y} width={170} height={58} rx={8} fill="none" stroke={C_TOKEN} strokeWidth={1} />
                  <text x={20} y={y + 18} fontSize={12} fill="#64748b">{row === 0 ? "1번 token · k₁=(1,0)" : "2번 token · k₂=(0.6,0.8)"}</text>
                  <text x={20} y={y + 36} fontSize={12} fill="#64748b" fontFamily="ui-monospace, monospace">{row === 0 ? "v₁ = (2, 0)" : "v₂ = (0, 3)"}</text>
                  <text x={20} y={y + 52} fontSize={13} fontWeight={700} fill={solved ? C_TOKEN : "#94a3b8"} fontFamily="ui-monospace, monospace">
                    {row === 0 ? "u₁ = (2, 0)" : solved ? "u₂ = (−1.2, 3)" : "u₂ = ?"}
                  </text>
                </g>
              );
            })}
            {/* 의존 화살표 */}
            <g opacity={showDep ? 1 : 0.15}>
              <line x1={40} y1={82} x2={40} y2={112} stroke={C_DEP} strokeWidth={1.25} />
              <polygon points="40,117 35,109 45,109" fill={C_DEP} />
              <text x={52} y={104} fontSize={13} fontWeight={700} fill="#b45309">0.6 × u₁를 뺌</text>
            </g>
            {/* 오른쪽: 장면 0·1은 기억 상태, 장면 2는 행렬 */}
            {!showMatrix && (
              <g>
                <text x={200} y={40} fontSize={12} fill="#64748b">{active === 0 ? "쓰기 전 기억" : "u₁을 쓴 뒤 기억"}</text>
                <text x={200} y={60} fontSize={13} fontWeight={700} className="fill-foreground" fontFamily="ui-monospace, monospace">{active === 0 ? "M₀ = 0" : "M₁ = [[2,0],[0,0]]"}</text>
                <text x={200} y={136} fontSize={12} fill="#64748b">{active === 0 ? "k₁로 읽기" : "k₂로 읽기"}</text>
                <text x={200} y={156} fontSize={13} fontWeight={700} fill={active === 0 ? "#64748b" : C_DEP} fontFamily="ui-monospace, monospace">{active === 0 ? "(0, 0)" : "(1.2, 0) = 0.6u₁"}</text>
              </g>
            )}
            {showMatrix && (
              <g>
                <text x={200} y={20} fontSize={12} fill="#64748b">I + L</text>
                {[0, 1].map((r) =>
                  [0, 1].map((c) => {
                    const v = r === c ? "1" : r === 1 && c === 0 ? "0.6" : "0";
                    const lower = r === 1 && c === 0;
                    return (
                      <g key={`${r}${c}`}>
                        <rect x={200 + c * 44} y={30 + r * 70} width={40} height={60} rx={4} fill={lower ? "#fef3c7" : "none"} stroke={lower ? C_DEP : "#94a3b8"} strokeWidth={1} strokeDasharray={v === "0" ? "3 3" : undefined} />
                        <text x={220 + c * 44} y={64 + r * 70} textAnchor="middle" fontSize={13} fontWeight={700} fill={lower ? "#b45309" : "#64748b"} fontFamily="ui-monospace, monospace">{v}</text>
                      </g>
                    );
                  }),
                )}
                <text x={292} y={64} fontSize={13} fill="#64748b" fontFamily="ui-monospace, monospace">u₁=v₁</text>
                <text x={292} y={126} fontSize={13} fill="#64748b" fontFamily="ui-monospace, monospace">0.6u₁</text>
                <text x={292} y={144} fontSize={13} fill="#64748b" fontFamily="ui-monospace, monospace">+u₂=v₂</text>
                <text x={200} y={188} fontSize={12} fill="#64748b">아래 칸 0.6 = β₂(k₂·k₁)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
