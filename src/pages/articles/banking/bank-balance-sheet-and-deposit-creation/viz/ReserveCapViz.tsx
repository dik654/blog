import SceneShell from "./SceneShell";

/**
 * 본문 대응: #money-multiplier — rD ≤ R 조건을 예금 D에 대한 그래프로 읽는다.
 * R=20, r=0.2: D=92 → 18.4, D=100 → 20, D=102 → 20.4. r=0이면 rD=0이라 R과 만나지 않는다.
 */
const W = 360;
const H = 226;
const LEFT = 34;
const RIGHT = 350;
const BASE = 192;
const TOP = 14;
const X_MAX = 130;
const Y_MAX = 26;
const x = (d: number) => LEFT + (d / X_MAX) * (RIGHT - LEFT);
const y = (v: number) => BASE - (v / Y_MAX) * (BASE - TOP);

const SCENES = [
  { label: "상한은 두 선이 만나는 곳", summary: "20 / 0.2 = 100", point: 100, need: 20, tone: "#2563eb", tag: "D=100 · 필요 20", note: "예금 D가 늘면 필요 준비금 rD가 함께 올라갑니다. 고정한 보유 준비금 R=20에 닿는 지점이 이 모형의 예금 상한 100입니다." },
  { label: "예금 92일 때", summary: "18.4 ≤ 20 · 8 더 허용", point: 92, need: 18.4, tone: "#16a34a", tag: "D=92 · 필요 18.4", note: "필요 준비금이 아직 보유량 아래입니다. 상한 100까지 이 고정 모형에서 더 허용되는 예금은 8입니다." },
  { label: "예금 102일 때", summary: "20.4 > 20 · 조건 미충족", point: 102, need: 20.4, tone: "#dc2626", tag: "D=102 · 필요 20.4", note: "대출 직후 A은행의 예금 102에 20%를 억지로 대입한 경우입니다. 이 20%를 A은행에 실제 규제로 적용한 적은 없으므로 두 계산을 섞어 읽으면 안 됩니다." },
  { label: "상한은 도달 예고가 아닙니다", summary: "D / R ≤ 5", point: null, need: null, tone: "#64748b", tag: "", note: "색칠한 구간 어디든 조건을 만족합니다. 초과 준비금을 남기거나 다른 제약이 걸리면 예금은 상한보다 작을 수 있고, 부등식은 은행들이 한도까지 대출한다는 행동 법칙을 포함하지 않습니다." },
  { label: "준비율이 0이면", summary: "r = 0 · 유한한 상한 없음", point: null, need: null, tone: "#d97706", tag: "", note: "필요 준비금 선이 바닥에 붙어 R과 만나지 않습니다. 이 조건만으로 유한한 상한을 얻지 못한다는 뜻이며 무한 대출이 가능하다는 뜻이 아닙니다." },
] as const;

export default function ReserveCapViz() {
  return (
    <SceneShell
      eyebrow="별도의 정적 모형"
      title="준비율 공식의 100은 넘지 못할 선이지 도달할 목표가 아닙니다"
      description="가로축은 예금 D, 세로축은 필요 준비금 rD입니다. 보유 준비금 R=20과 준비율 r=0.2를 고정한 가정이며 앞 A은행의 실제 규제가 아닙니다."
      ariaLabel="예금에 따른 필요 준비금과 보유 준비금 20의 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const zero = active === 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            {active === 3 && <rect x={x(0)} y={y(26)} width={x(100) - x(0)} height={BASE - y(26)} fill="#2563eb" fillOpacity={0.1} />}
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 50, 100].map((tick) => (
              <text key={tick} x={x(tick)} y={BASE + 15} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
            ))}
            <text x={RIGHT} y={BASE + 30} textAnchor="end" fontSize={12} fill="#64748b">예금 D</text>
            {[0, 10, 20].map((tick) => (
              <text key={tick} x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={y(20)} y2={y(20)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <text x={LEFT + 6} y={y(20) - 6} fontSize={12} fontWeight={700} fill="#64748b">보유 R = 20</text>
            <line x1={x(0)} y1={y(0)} x2={x(125)} y2={y(25)} stroke="#2563eb" strokeWidth={1.25} strokeOpacity={zero ? 0.2 : 1} />
            {!zero && <text x={x(44)} y={y(4)} fontSize={12} fontWeight={700} fill="#2563eb">필요 준비금 rD (r=0.2)</text>}
            {zero && (
              <>
                <line x1={x(0)} y1={y(0)} x2={RIGHT} y2={y(0)} stroke="#d97706" strokeWidth={1.25} />
                <text x={x(125)} y={y(0) - 7} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">r=0이면 rD는 늘 0</text>
              </>
            )}
            {active === 3 && (
              <>
                <line x1={x(100)} x2={x(100)} y1={y(26)} y2={BASE} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={x(50)} y={y(24)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">상한 100 아래 어디든 가능</text>
              </>
            )}
            {s.point !== null && s.need !== null && (
              <>
                <line x1={x(s.point)} x2={x(s.point)} y1={y(s.need)} y2={BASE} stroke={s.tone} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={x(s.point)} cy={y(s.need)} r={4} fill={s.tone} />
                <text x={x(s.point) - 8} y={y(s.need) - (s.point === 102 ? 24 : 26)} textAnchor="end" fontSize={12} fontWeight={700} fill={s.tone}>{s.tag}</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
