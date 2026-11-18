import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fp12 — Fq6 값에 v를 곱하면 [C₀,C₁,C₂] → [ξC₂, C₀, C₁].
 * v·v² = v³ = ξ 이므로 맨 끝 계수만 ξ를 곱해 맨 앞으로 돌아옵니다.
 * 이번 값: [0, 6+28u, 0] → [0, 0, 6+28u].  ξ 없이 순환만 하면 [C₂, C₀, C₁].
 */
const SCENES = [
  { label: "일반 규칙", summary: "[C₀,C₁,C₂] → [ξC₂, C₀, C₁]", note: "v를 곱하면 각 계수가 한 칸씩 높은 차수로 옮겨 갑니다. v² 칸의 C₂는 v³가 되는데, v³=ξ라서 ξ를 곱한 뒤 상수 칸으로 돌아옵니다." },
  { label: "이번 값", summary: "(6+28u)v → (6+28u)v²", note: "w²=v 때문에 바깥 곱의 상수 쪽은 v·z₁입니다. z₁의 0 아닌 계수는 v 칸에 있으므로 ξ 없이 v² 칸으로 한 칸 옮겨 갑니다. 출력 (6+28u)v²가 여기서 나옵니다." },
  { label: "순환만 하면", summary: "[C₂, C₀, C₁] · ξ 누락", note: "세 계수를 그냥 돌리기만 하면 맨 앞 칸에 ξ가 빠집니다. 이번 값은 C₂가 0이라 두 규칙의 결과가 같으므로, 이 입력 하나로는 이 오류가 드러나지 않습니다." },
] as const;

const W = 360;
const H = 176;
const SX = [40, 140, 240] as const;
const SW = 86;
const TOP = 30;
const BOT = 118;
const BH = 36;
const POW: readonly string[] = ["v⁰ 칸", "v¹ 칸", "v² 칸"];

const BEFORE: readonly (readonly string[])[] = [
  ["C₀", "C₁", "C₂"],
  ["0", "6+28u", "0"],
  ["C₀", "C₁", "C₂"],
];
const AFTER: readonly (readonly string[])[] = [
  ["ξ·C₂", "C₀", "C₁"],
  ["0", "0", "6+28u"],
  ["C₂", "C₀", "C₁"],
];

export default function VShiftViz() {
  return (
    <SceneShell
      eyebrow="v 곱하기"
      title="v를 곱하면 세 칸이 한 칸씩 밀리고 끝 칸만 ξ를 곱해 돌아옵니다"
      description="위는 곱하기 전, 아래는 v를 곱한 뒤의 세 계수입니다. 각 계수는 Fq2 값이고 ξ=9+u입니다."
      ariaLabel="Fq6 값에 v를 곱할 때 세 계수의 이동"
      scenes={SCENES}
      render={(active) => {
        const before = BEFORE[active];
        const after = AFTER[active];
        const wrapColor = active === 2 ? "#dc2626" : "#d97706";
        const cx = (k: number) => SX[k as 0 | 1 | 2] + SW / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="vshift-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill="#64748b" />
              </marker>
              <marker id="vshift-arrow-wrap" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill={wrapColor} />
              </marker>
            </defs>
            <text x={4} y={TOP + BH / 2 + 4} fontSize={12} fill="#64748b">전</text>
            <text x={4} y={BOT + BH / 2 + 4} fontSize={12} fill="#64748b">후</text>
            {[0, 1, 2].map((k) => (
              <text key={`p${k}`} x={cx(k)} y={TOP - 8} textAnchor="middle" fontSize={12} fill="#64748b">{POW[k]}</text>
            ))}
            {[0, 1, 2].map((k) => {
              const live = active !== 1 || before[k] !== "0";
              return (
                <g key={`b${k}`}>
                  <rect x={SX[k as 0 | 1 | 2]} y={TOP} width={SW} height={BH} rx={8} fill="#2563eb" fillOpacity={active === 1 && live ? 0.12 : 0} stroke={active === 1 && live ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={cx(k)} y={TOP + BH / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={live ? "currentColor" : "#94a3b8"}>{before[k]}</text>
                </g>
              );
            })}
            {[0, 1, 2].map((k) => {
              const live = active !== 1 || after[k] !== "0";
              const wrong = active === 2 && k === 0;
              const stroke = wrong ? "#dc2626" : active === 1 && live ? "#2563eb" : k === 0 ? "#d97706" : "#94a3b8";
              return (
                <g key={`a${k}`}>
                  <rect x={SX[k as 0 | 1 | 2]} y={BOT} width={SW} height={BH} rx={8} fill={stroke} fillOpacity={(active === 1 && live) || wrong ? 0.1 : 0} stroke={stroke} strokeWidth={1} strokeDasharray={wrong ? "4 3" : undefined} />
                  <text x={cx(k)} y={BOT + BH / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={wrong ? "#dc2626" : live ? "currentColor" : "#94a3b8"}>{after[k]}</text>
                </g>
              );
            })}
            {[0, 1].map((k) => (
              <line key={`m${k}`} x1={cx(k)} y1={TOP + BH + 2} x2={cx(k + 1) - 8} y2={BOT - 4} stroke="#64748b" strokeWidth={1} markerEnd="url(#vshift-arrow)" />
            ))}
            <line x1={cx(2)} y1={TOP + BH + 2} x2={cx(0) + 10} y2={BOT - 4} stroke={wrapColor} strokeWidth={1.25} strokeDasharray={active === 2 ? "4 3" : undefined} markerEnd="url(#vshift-arrow-wrap)" />
            <text x={cx(2) - 34} y={TOP + BH + 22} textAnchor="start" fontSize={13} fontWeight={700} fill={wrapColor}>
              {active === 2 ? "ξ 없음" : "× ξ"}
            </text>
          </svg>
        );
      }}
    />
  );
}
