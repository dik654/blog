import SceneShell from "./SceneShell";

/**
 * 본문 대응: #jl-lemma — ε=0.2, 원래 거리 2의 허용 구간은 제곱거리 3.2~4.8, 거리 약 1.789~2.191.
 * 위 눈금은 제곱거리, 아래 눈금은 거리입니다. 합÷2는 2로 통과, 첫 칸은 1로 실패.
 */
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 188;
const LEFT = 22;
const RIGHT = 22;
const Y1 = 58;
const Y2 = 138;
const sx = (value: number) => LEFT + (value / 6) * (W - LEFT - RIGHT);
const dx = (value: number) => LEFT + (value / 3) * (W - LEFT - RIGHT);

const SCENES = [
  { label: "제곱거리 구간", summary: "4 × (1±0.2) = 3.2 ~ 4.8", note: "원래 거리 2의 제곱거리는 4입니다. ε=0.2는 제곱거리를 0.8배에서 1.2배 사이에 두라는 조건이므로 띠가 3.2부터 4.8까지입니다." },
  { label: "거리로 옮기기", summary: "√3.2 ≈ 1.789 · √4.8 ≈ 2.191", note: "띠의 양 끝에 제곱근을 취하면 거리의 구간입니다. 2에서 아래로 약 0.211, 위로 약 0.191이라 위아래 폭이 똑같지는 않습니다." },
  { label: "합을 2로 나눈 규칙", summary: "거리 2 → 통과", note: "우리 변환의 출력 거리는 2이고 제곱하면 4입니다. 두 눈금 모두 띠 안입니다." },
  { label: "첫 칸만 남긴 규칙", summary: "거리 1 → 실패", note: "첫 칸만 남기면 거리 1, 제곱거리 1입니다. 띠의 아래 끝 3.2에 미치지 못해 조건을 어깁니다. 순서가 유지돼도 이 조건은 통과하지 못합니다." },
] as const;

export default function ToleranceBandViz() {
  return (
    <SceneShell
      eyebrow="허용 오차의 띠"
      title="ε=0.2의 띠 안에 들어와야 거리를 보존했다고 말합니다"
      description="위는 제곱거리, 아래는 거리를 잰 눈금입니다. 색칠한 띠가 원래 거리 2에 허용되는 구간입니다."
      note="ε=0.2와 네 점은 본문의 사례입니다. 소수는 본문처럼 셋째 자리까지 적었습니다."
      ariaLabel="제곱거리 허용 구간과 두 변환의 통과 여부"
      scenes={SCENES}
      render={(active) => {
        const value = active === 2 ? 2 : active === 3 ? 1 : null;
        const color = active === 3 ? RED : BLUE;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={16} fontSize={12} fill={GRAY}>제곱거리</text>
            <rect x={sx(3.2)} y={Y1 - 14} width={sx(4.8) - sx(3.2)} height={28} fill={AMBER} opacity={0.16} />
            <line x1={LEFT} x2={W - RIGHT} y1={Y1} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3, 4, 5, 6].map((tick) => (
              <g key={tick}>
                <line x1={sx(tick)} x2={sx(tick)} y1={Y1 - 4} y2={Y1 + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(tick)} y={Y1 + 20} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>
              </g>
            ))}
            <text x={sx(3.2)} y={Y1 - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>3.2</text>
            <text x={sx(4.8)} y={Y1 - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>4.8</text>

            {active >= 1 && (
              <g>
                <text x={LEFT} y={Y2 - 24} fontSize={12} fill={GRAY}>거리</text>
                <path d={`M ${sx(3.2)} ${Y1 + 26} L ${dx(1.789)} ${Y2 - 14}`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                <path d={`M ${sx(4.8)} ${Y1 + 26} L ${dx(2.191)} ${Y2 - 14}`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                <rect x={dx(1.789)} y={Y2 - 12} width={dx(2.191) - dx(1.789)} height={24} fill={AMBER} opacity={0.16} />
                <line x1={LEFT} x2={W - RIGHT} y1={Y2} y2={Y2} stroke="#94a3b8" strokeWidth={1} />
                {[0, 1, 2, 3].map((tick) => (
                  <g key={tick}>
                    <line x1={dx(tick)} x2={dx(tick)} y1={Y2 - 4} y2={Y2 + 4} stroke="#94a3b8" strokeWidth={1} />
                    <text x={dx(tick)} y={Y2 + 20} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>
                  </g>
                ))}
                <text x={dx(1.789) - 4} y={Y2 + 38} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>약 1.789</text>
                <text x={dx(2.191) + 4} y={Y2 + 38} fontSize={12} fontWeight={700} fill={AMBER}>약 2.191</text>
              </g>
            )}
            {value !== null && (
              <g>
                <circle cx={sx(value * value)} cy={Y1} r={6} fill={color} />
                <circle cx={dx(value)} cy={Y2} r={6} fill={color} />
                <text x={sx(value * value)} y={Y1 - 20 - (active === 2 ? 0 : 0)} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{value * value}</text>
                <text x={dx(value)} y={Y2 - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{value}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
