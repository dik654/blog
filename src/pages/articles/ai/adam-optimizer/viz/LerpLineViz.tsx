import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-moments — exp_avg.lerp_(grad, 0.1).
 * 저장한 평균과 이번 gradient 사이 거리의 1/10만 이동: m+0.1(g−m).
 * (0,2)→0.2, (0.2,−2)→0.2+0.1×(−2.2)=−0.02.
 */
const SCENES: readonly { label: string; summary: string; note: string; m: number; g: number; next: number; mText: string; nextText: string }[] = [
  { label: "첫 호출", summary: "0 + 0.1×(2 − 0) = 0.2", note: "저장한 평균 0과 gradient 2 사이의 거리는 2입니다. 그 거리를 열 칸으로 나눈 한 칸 0.2만 gradient 쪽으로 옮깁니다.", m: 0, g: 2, next: 0.2, mText: "저장한 평균 0", nextText: "새 평균 0.2" },
  { label: "둘째 호출", summary: "0.2 + 0.1×(−2 − 0.2) = −0.02", note: "이번에는 gradient가 반대쪽 −2에 있어 거리가 2.2입니다. 한 칸 0.22를 왼쪽으로 옮기면 0.2가 0을 살짝 넘어 −0.02가 됩니다. 0.9m+0.1g로 계산한 값과 같습니다.", m: 0.2, g: -2, next: -0.02, mText: "저장한 평균 0.2", nextText: "새 평균 −0.02" },
];

const W = 360;
const H = 146;
const AXIS_Y = 62;
const x = (value: number) => 180 + value * 75;
const MUTED = "#64748b";
const AMBER = "#d97706";
const BLUE = "#2563eb";

export default function LerpLineViz() {
  return (
    <SceneShell
      eyebrow="lerp_"
      title="lerp_는 저장한 평균을 gradient 쪽으로 거리의 10%만 옮깁니다"
      description="lerp는 두 값 사이를 주어진 비율만큼 옮기는 연산입니다. 비율이 1−beta1=0.1이므로 눈금 열 칸 가운데 주황색 한 칸만 움직입니다. 2와 −2는 이 글의 가정값입니다."
      ariaLabel="저장한 평균이 이번 gradient 쪽으로 거리의 10퍼센트만 이동하는 수직선"
      scenes={SCENES}
      render={(active) => {
        const { m, g, next, mText, nextText } = SCENES[active];
        const cuts = Array.from({ length: 11 }, (_, index) => x(m) + ((x(g) - x(m)) * index) / 10);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={14} x2={W - 14} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            {[-2, -1, 0, 1, 2].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y + 32} y2={AXIS_Y + 38} stroke={MUTED} strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 54} textAnchor="middle" fontSize={12} fill={MUTED}>{tick < 0 ? `−${-tick}` : tick}</text>
              </g>
            ))}
            {cuts.map((cx, index) => (
              <line key={index} x1={cx} x2={cx} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={MUTED} strokeWidth={1} />
            ))}
            <rect x={Math.min(x(m), x(next))} y={AXIS_Y - 6} width={Math.abs(x(next) - x(m))} height={12} fill={AMBER} opacity={0.75} />
            <circle cx={x(m)} cy={AXIS_Y} r={4} fill={MUTED} />
            <text x={x(m)} y={AXIS_Y - 30} textAnchor="middle" fontSize={12} fill={MUTED}>{mText}</text>
            <line x1={x(m)} x2={x(m)} y1={AXIS_Y - 26} y2={AXIS_Y - 6} stroke={MUTED} strokeWidth={1} />
            <rect x={x(g) - 4} y={AXIS_Y - 4} width={8} height={8} fill={BLUE} />
            <text x={x(g) + (g > 0 ? 8 : -8)} y={AXIS_Y - 14} textAnchor={g > 0 ? "end" : "start"} fontSize={12} fontWeight={700} fill={BLUE}>이번 gradient {g < 0 ? "−2" : "2"}</text>
            <line x1={x(next)} x2={x(next)} y1={AXIS_Y + 6} y2={AXIS_Y + 14} stroke={AMBER} strokeWidth={1.25} />
            <text x={x(next)} y={AXIS_Y + 27} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>{nextText}</text>
          </svg>
        );
      }}
    />
  );
}
