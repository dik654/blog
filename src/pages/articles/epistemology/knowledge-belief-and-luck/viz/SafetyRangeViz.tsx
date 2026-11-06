import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 안전성을 지나치게 강하게 요구하면 정상 지각도 탈락하고, 평균 신뢰도만 보면 오늘 멈춘 예외를 놓친다.
 * 가운데 점 = 실제 경우(12:00), 가운데 고리 = 1분 앞뒤, 바깥 고리 = 정교한 속임수. 파란 원 = 검사하는 범위.
 */
const SCENES = [
  { label: "1분 앞뒤까지 검사", summary: "정상 통과 · 멈춤 탈락", mode: "near", note: "범위 안에서 정상 시계는 세 점 모두 맞고 멈춘 시계는 12:00에서만 맞습니다. 이 범위에서는 기준이 두 시계를 가릅니다." },
  { label: "속임수까지 넓히기", summary: "정상 시계도 탈락", mode: "far", note: "“혹시 정교한 속임수가 있었을 수 있다”까지 넣으면 정상적인 지각도 틀리는 점을 갖게 되어 탈락합니다. 지나치게 강한 요구입니다." },
  { label: "평균만 볼 때", summary: "오늘의 고장을 놓침", mode: "average", note: "반대로 과정의 평균 신뢰도만 보면, 평소 좋은 시계가 오늘 멈춘 예외가 보이지 않습니다. 칸은 며칠을 뜻하며 칸 수는 모양만 보여 줍니다." },
] as const;

const W = 340;
const H = 220;
const R_NEAR = 44;
const R_FAR = 76;
const CY = 106;
const CX = [84, 256];

const OK = "#2563eb";
const BAD = "#dc2626";
const INK = "#94a3b8";
const LABEL = "#64748b";

function Mark({ x, y, good }: { x: number; y: number; good: boolean }) {
  return good ? (
    <circle cx={x} cy={y} r={5} fill={OK} />
  ) : (
    <path d={`M${x - 5} ${y - 5} l10 10 m0 -10 l-10 10`} stroke={BAD} strokeWidth={1.25} fill="none" />
  );
}

function Disc({ cx, title, near, far, verdict, range }: { cx: number; title: string; near: boolean; far: boolean; verdict: string; range: number }) {
  return (
    <g>
      <text x={cx} y={14} textAnchor="middle" fontSize={15} fontWeight={700} fill={LABEL}>{title}</text>
      <circle cx={cx} cy={CY} r={R_NEAR} fill="none" stroke={INK} strokeWidth={0.5} strokeDasharray="2 3" />
      <circle cx={cx} cy={CY} r={R_FAR} fill="none" stroke={INK} strokeWidth={0.5} strokeDasharray="2 3" />
      <circle cx={cx} cy={CY} r={range} fill={OK} fillOpacity={0.06} stroke={OK} strokeWidth={1.25} />
      <Mark x={cx} y={CY} good />
      <Mark x={cx - R_NEAR + 16} y={CY} good={near} />
      <Mark x={cx + R_NEAR - 16} y={CY} good={near} />
      <Mark x={cx} y={CY - R_FAR + 14} good={far} />
      <text x={cx} y={H - 4} textAnchor="middle" fontSize={15} fontWeight={700} fill={verdict === "통과" ? OK : BAD}>{verdict}</text>
    </g>
  );
}

export default function SafetyRangeViz() {
  return (
    <SceneShell
      eyebrow="기준의 범위"
      title="검사 범위를 넓히고 좁힐 때 걸러지는 실패가 달라집니다"
      description="원 하나가 한 시계의 검사표입니다. 가운데는 실제 12:00, 좌우는 11:59와 12:01, 위쪽 점은 정교한 속임수입니다. 동그라미는 맞음, 가위표는 틀림입니다."
      ariaLabel="안전성 검사의 범위를 바꾸면 정상 시계와 멈춘 시계의 판정이 달라지고 평균 신뢰도는 오늘의 고장을 놓치는 과정"
      scenes={SCENES}
      render={(active) => {
        const { mode } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {mode !== "average" && (
              <g>
                <Disc cx={CX[0]} title="정상 시계" near far={false} verdict={mode === "near" ? "통과" : "탈락"} range={mode === "near" ? R_NEAR : R_FAR} />
                <Disc cx={CX[1]} title="멈춘 시계" near={false} far={false} verdict="탈락" range={mode === "near" ? R_NEAR : R_FAR} />
              </g>
            )}
            {mode === "average" && (
              <g>
                <text x={W / 2} y={40} textAnchor="middle" fontSize={15} fontWeight={700} fill={LABEL}>평소 좋은 시계의 며칠</text>
                {Array.from({ length: 10 }, (_, index) => (
                  <g key={index}>
                    <rect x={20 + index * 30.4} y={56} width={26} height={40} rx={4} fill={index === 9 ? "none" : OK} fillOpacity={0.18} stroke={index === 9 ? BAD : OK} strokeWidth={index === 9 ? 1.25 : 1} />
                    {index < 9 ? <circle cx={33 + index * 30.4} cy={76} r={4} fill={OK} /> : <path d={`M${28 + index * 30.4} 71 l10 10 m0 -10 l-10 10`} stroke={BAD} strokeWidth={1.25} fill="none" />}
                  </g>
                ))}
                <text x={W - 20} y={116} textAnchor="end" fontSize={15} fontWeight={700} fill={BAD}>오늘 멈춤</text>
                <line x1={20} x2={W - 20} y1={144} y2={144} stroke={OK} strokeWidth={1.25} />
                <text x={W / 2} y={166} textAnchor="middle" fontSize={15} fontWeight={700} fill={OK}>평균: 대체로 참을 냄</text>
                <text x={W / 2} y={186} textAnchor="middle" fontSize={15} fontWeight={700} fill={BAD}>오늘 멈춘 예외는 안 보임</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
