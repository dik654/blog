import SceneShell from "./SceneShell";

/**
 * 본문 대응: #distribution ExplainedFormula — Q1=10, Q3=30 → IQR=20,
 * 검토 경계 = [10 − 1.5×20, 30 + 1.5×20] = [−20, 60].
 * 60보다 큰 값은 확인할 후보이지 삭제 대상이 아니다.
 */
const Q1 = 10;
const Q3 = 30;
const IQR = Q3 - Q1;
const REACH = 1.5 * IQR;
const LOW = Q1 - REACH;
const HIGH = Q3 + REACH;

const W = 360;
const H = 150;
const PAD = 22;
const MIN = -30;
const MAX = 80;
const x = (value: number) => PAD + ((value - MIN) / (MAX - MIN)) * (W - 2 * PAD);
const AXIS_Y = 112;
const BOX_Y = 56;
const BOX_H = 30;
const TICKS = [-20, 0, 10, 30, 60, 80] as const;

const SCENES = [
  {
    label: "가운데 50%의 폭",
    summary: `IQR = ${Q3} − ${Q1} = ${IQR}`,
    note: "정렬한 값의 25% 지점 Q1=10과 75% 지점 Q3=30 사이가 가운데 절반입니다. 그 폭 20을 이 데이터의 퍼짐 단위로 씁니다.",
  },
  {
    label: "양쪽으로 1.5배 늘립니다",
    summary: `1.5 × ${IQR} = ${REACH}`,
    note: "Q1에서 30을 빼고 Q3에 30을 더합니다. 아래 경계는 −20, 위 경계는 60입니다.",
  },
  {
    label: "경계 밖은 검토 후보",
    summary: `[${LOW}, ${HIGH}] 밖 → 원자료 확인`,
    note: "60보다 큰 값은 먼저 볼 후보일 뿐입니다. 실제 대형 주문일 수 있으므로 source row·단위·업무 상한을 확인한 뒤 수정·제외·유지를 정합니다.",
  },
] as const;

export default function IqrFenceViz() {
  return (
    <SceneShell
      eyebrow="IQR 검토 경계"
      title="가운데 절반의 폭으로 먼저 볼 값의 경계를 정합니다"
      description="가로축은 값의 크기이고, 상자는 Q1부터 Q3까지 가운데 50%입니다. 숫자는 아래 식의 Q1=10, Q3=30을 그대로 씁니다."
      ariaLabel="Q1 10과 Q3 30에서 IQR 20을 구하고 양쪽으로 30씩 늘려 검토 경계 −20과 60을 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 2 && (
            <>
              <rect x={x(HIGH)} y={BOX_Y - 16} width={x(MAX) - x(HIGH)} height={BOX_H + 32} fill="#dc2626" opacity={0.08} />
              <rect x={x(MIN)} y={BOX_Y - 16} width={x(LOW) - x(MIN)} height={BOX_H + 32} fill="#dc2626" opacity={0.08} />
              <text x={(x(HIGH) + x(MAX)) / 2} y={BOX_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">검토 후보</text>
            </>
          )}
          <rect x={x(Q1)} y={BOX_Y} width={x(Q3) - x(Q1)} height={BOX_H} rx={3} fill="#2563eb" opacity={0.15} stroke="#2563eb" strokeWidth={1} />
          <text x={(x(Q1) + x(Q3)) / 2} y={BOX_Y + BOX_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">IQR {IQR}</text>
          {active >= 1 && (
            <>
              <line x1={x(LOW)} x2={x(Q1)} y1={BOX_Y + BOX_H / 2} y2={BOX_Y + BOX_H / 2} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <line x1={x(Q3)} x2={x(HIGH)} y1={BOX_Y + BOX_H / 2} y2={BOX_Y + BOX_H / 2} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <line x1={x(LOW)} x2={x(LOW)} y1={BOX_Y - 6} y2={BOX_Y + BOX_H + 6} stroke="#d97706" strokeWidth={1.25} />
              <line x1={x(HIGH)} x2={x(HIGH)} y1={BOX_Y - 6} y2={BOX_Y + BOX_H + 6} stroke="#d97706" strokeWidth={1.25} />
              <text x={(x(LOW) + x(Q1)) / 2} y={BOX_Y - 6} textAnchor="middle" fontSize={10} fill="#b45309">−{REACH}</text>
              <text x={(x(Q3) + x(HIGH)) / 2} y={BOX_Y - 6} textAnchor="middle" fontSize={10} fill="#b45309">+{REACH}</text>
            </>
          )}
          <line x1={PAD} x2={W - PAD} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {TICKS.map((tick) => {
            const strong = tick === Q1 || tick === Q3 || (active >= 1 && (tick === LOW || tick === HIGH));
            return (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 17} textAnchor="middle" fontSize={11} fontWeight={strong ? 700 : 400} fill={strong ? "#64748b" : "#94a3b8"}>
                  {tick}
                </text>
              </g>
            );
          })}
          <text x={x(Q1)} y={AXIS_Y + 32} textAnchor="middle" fontSize={10} fill="#2563eb">Q1</text>
          <text x={x(Q3)} y={AXIS_Y + 32} textAnchor="middle" fontSize={10} fill="#2563eb">Q3</text>
        </svg>
      )}
    />
  );
}
