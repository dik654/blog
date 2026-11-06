import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 언제든 바꿈과 절대 안 바꿈 사이에 놓인 조정 가능한 약속.
 * 위 축 = 약속의 강도. 아래 두 막대 = 약속 쪽 신뢰와 국내 정책 여지. 길이는 방향만 보입니다.
 */
const SCENES = [
  { label: "언제든 바꿀 수 있음", summary: "정책 여지 넓음 · 환율 걱정 클 수 있음", pos: 0.04, trust: 0.2, room: 0.9, note: "환율을 언제든 바꿀 수 있다면 국외 계약자는 손실을 걱정해 더 높은 가격을 요구할 수 있습니다." },
  { label: "절대 안 바꿈", summary: "신뢰 늘 수 있음 · 정책 여지 좁아질 수 있음", pos: 0.96, trust: 0.9, room: 0.2, note: "절대로 바꾸지 않겠다는 약속은 국내 실업이 커져도 금리와 지출을 방어에 맞추게 할 수 있습니다." },
  { label: "조정 가능한 약속", summary: "일시 부족은 지원 · 지속 불균형은 조정", pos: 0.5, trust: 0.55, room: 0.55, note: "브레턴우즈 설계자들은 전간기의 경쟁적 평가절하와 지급 제한을 피하면서, 일시적 부족은 국제 지원으로 넘기고 지속적 불균형에는 환율 조정을 허용하려 했습니다." },
] as const;

const W = 320;
const H = 150;
const AXIS_L = 12;
const AXIS_R = 308;
const AXIS_Y = 34;
const BAR_X = 78;
const BAR_MAX = W - BAR_X - 4;
const BLUE = "#2563eb";
const MUTED = "#64748b";
const AMBER = "#d97706";

function Row({ y, label, value, color }: { y: number; label: string; value: number; color: string }) {
  return (
    <g>
      <text x={0} y={y + 13} fontSize={12} fontWeight={700} fill={MUTED}>{label}</text>
      <rect x={BAR_X} y={y} width={BAR_MAX} height={18} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.75} />
      <rect x={BAR_X} y={y} width={BAR_MAX * value} height={18} rx={2} fill={color} />
    </g>
  );
}

export default function CommitmentSpectrumViz() {
  return (
    <SceneShell
      eyebrow="약속의 강도"
      title="약속이 강할수록 신뢰는 늘 수 있고 정책의 출구는 좁아질 수 있습니다"
      description="환율 약속을 어디에 놓느냐에 따라 무엇을 얻고 무엇을 내줄까요? 점이 약속의 자리입니다."
      note="막대 길이는 어느 쪽으로 움직이는지만 보이는 그림이며 측정값이 아닙니다."
      ariaLabel="언제든 바꾸는 환율과 절대 안 바꾸는 환율, 그 사이의 조정 가능한 약속 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const x = AXIS_L + (AXIS_R - AXIS_L) * scene.pos;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={AXIS_L} y={14} fontSize={12} fill={MUTED}>언제든 바꿈</text>
            <text x={AXIS_R} y={14} textAnchor="end" fontSize={12} fill={MUTED}>절대 안 바꿈</text>
            <line x1={AXIS_L} x2={AXIS_R} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            <line x1={160} x2={160} y1={AXIS_Y - 5} y2={AXIS_Y + 5} stroke={MUTED} strokeWidth={1} />
            <circle cx={x} cy={AXIS_Y} r={7} fill={BLUE} />
            <Row y={66} label="환율 신뢰" value={scene.trust} color={AMBER} />
            <Row y={100} label="정책 여지" value={scene.room} color={BLUE} />
            <text x={BAR_X} y={140} fontSize={12} fill={MUTED}>신뢰가 강할수록 다른 선택지는 좁아질 수 있음</text>
          </svg>
        );
      }}
    />
  );
}
