import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hard-negatives — s(q,d) < s(q,p) − m 일 때만 negative로 받는다.
 * 0.86 · 0.05 · 0.82 · 0.76은 글 첫 그림의 설명용 값 [A]. margin 0.03·0.12는 경계를 보이려는 가정.
 */
const POSITIVE = 0.86;
const CANDIDATES = [0.82, 0.76] as const;

const SCENES = [
  {
    label: "positive 점수가 기준",
    summary: "s(q,p) = 0.86",
    margin: null,
    note: "Query와 관련 있다고 라벨된 positive 문서의 점수 0.86에서 출발합니다. 고정 숫자 하나를 모든 query에 쓰지 않고 이 query의 positive 점수를 기준으로 삼습니다.",
  },
  {
    label: "margin만큼 내린 경계",
    summary: "0.86 − 0.05 = 0.81",
    margin: 0.05,
    note: "Margin은 positive 점수 아래에 두는 여유 폭입니다. 0.05를 빼면 이 query의 경계는 0.81이고, 이보다 낮은 후보만 negative로 받습니다.",
  },
  {
    label: "0.82는 제외, 0.76은 받음",
    summary: "negative 1개 · 제외 1개",
    margin: 0.05,
    note: "0.82는 경계 0.81보다 높아 positive 0.86과의 차이 0.04가 margin 0.05보다 작습니다. 실제 relevant 문서일 수 있어 어렵더라도 negative로 확정하지 않습니다. 0.76은 경계 아래라 negative 후보로 남습니다.",
  },
  {
    label: "margin이 작으면 (가정 0.03)",
    summary: "경계 0.83 · 0.82도 받음",
    margin: 0.03,
    note: "Margin을 0.03으로 줄이면 경계가 0.83으로 올라가 0.82도 negative가 됩니다. 이 후보가 실제 relevant 문서라면 false negative가 섞입니다.",
  },
  {
    label: "margin이 크면 (가정 0.12)",
    summary: "경계 0.74 · 둘 다 제외",
    margin: 0.12,
    note: "Margin을 0.12로 늘리면 경계가 0.74로 내려가 0.76까지 제외됩니다. 유용했을 hard negative가 사라집니다.",
  },
] as const;

const W = 380;
const H = 168;
const X_MIN = 0.7;
const X_MAX = 0.9;
const LEFT = 22;
const RIGHT = 358;
const AXIS_Y = 108;
const TICKS = [0.7, 0.74, 0.78, 0.82, 0.86, 0.9] as const;

const OK = "#16a34a";
const NEG = "#2563eb";
const OUT = "#d97706";
const WARN = "#ef4444";
const MUTED = "#64748b";
const GRID = "#94a3b8";

const sx = (v: number) => LEFT + ((v - X_MIN) / (X_MAX - X_MIN)) * (RIGHT - LEFT);
const fmt = (v: number) => v.toFixed(2);

export default function MarginFilterViz() {
  return (
    <SceneShell
      eyebrow="positive-aware mining"
      title="경계는 positive 점수에서 margin만큼 아래에 그어집니다"
      description="가로축은 같은 mining encoder로 잰 query-문서 유사도입니다. 초록 점 p는 query와 관련 있다고 라벨된 positive 문서이고, 나머지 두 점은 negative 후보입니다."
      note="0.86·0.05·0.82·0.76은 글 첫 그림과 같은 설명용 값 [A]입니다. 실제 margin은 공개되지 않았고, 0.03·0.12는 경계의 움직임을 보이려는 가정입니다."
      ariaLabel="positive 점수에서 margin을 뺀 경계로 negative 후보를 거르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showBoundary = scene.margin !== null;
        const boundary = scene.margin === null ? POSITIVE : POSITIVE - scene.margin;
        const judged = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {showBoundary && (
              <>
                <rect x={sx(boundary)} y={34} width={RIGHT - sx(boundary)} height={AXIS_Y - 34} fill={OUT} opacity={0.1} />
                <text x={RIGHT - 2} y={30} textAnchor="end" fontSize={13} fill={OUT}>제외 →</text>
                <text x={sx(boundary) - 4} y={30} textAnchor="end" fontSize={13} fill={NEG}>← 받음</text>
                <line x1={sx(boundary)} x2={sx(boundary)} y1={34} y2={AXIS_Y + 4} stroke={WARN} strokeWidth={1.25} strokeDasharray="4 3" />
                <line x1={sx(boundary)} x2={sx(POSITIVE)} y1={46} y2={46} stroke={WARN} strokeWidth={1} />
                <text x={(sx(boundary) + sx(POSITIVE)) / 2} y={60} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>m {scene.margin}</text>
              </>
            )}
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke={GRID} strokeWidth={1} />
            {TICKS.map((t) => (
              <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke={GRID} strokeWidth={1} />
                <text x={sx(t)} y={AXIS_Y + 17} textAnchor="middle" fontSize={12} fill={MUTED}>{fmt(t)}</text>
              </g>
            ))}
            <text x={LEFT} y={H - 10} fontSize={12} fill={MUTED}>유사도 s(q,·) · 오른쪽일수록 query와 가깝다</text>
            {showBoundary && (
              <text x={sx(boundary)} y={AXIS_Y + 32} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>경계 {fmt(boundary)}</text>
            )}
            <circle cx={sx(POSITIVE)} cy={88} r={7} fill={OK} />
            <text x={sx(POSITIVE)} y={76} textAnchor="middle" fontSize={13} fontWeight={700} fill={OK}>p {fmt(POSITIVE)}</text>
            {CANDIDATES.map((c) => {
              const accepted = c < boundary;
              const color = !judged ? MUTED : accepted ? NEG : OUT;
              return (
                <g key={c}>
                  <circle cx={sx(c)} cy={88} r={6} fill={color} opacity={judged ? 1 : 0.6} />
                  <text x={sx(c)} y={76} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
                    {fmt(c)}
                    {judged ? (accepted ? " 받음" : " 제외") : ""}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
