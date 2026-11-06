import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 시작과 마지막 날에 돈과 공간의 방향이 뒤집힌다. 3천만, 200만 × 36 = 7천200만, 공제 없는 3천만 반환은 모두 (가정).
 */
const W = 340;
const ROW = 80;
const TOP = 26;
const H = TOP + ROW * 3 + 4;
const XL = 30;
const XR = 310;
const MONEY = "#2563eb";
const SPACE = "#d97706";
const TEXT = "#64748b";
const AXIS = "#94a3b8";

const ROWS = [
  { when: "시작할 때", money: { text: "3천만 원 맡김", right: true }, space: { text: "약정한 상태의 공간 인도", right: false } },
  { when: "매달", money: { text: "200만 원 × 36번 = 7천200만 원", right: true }, space: { text: "36개월 동안 공간 사용", right: false } },
  { when: "마지막 날", money: { text: "공제 없이 3천만 원 반환", right: false }, space: { text: "약정대로 공간 반환", right: true } },
] as const;

const SCENES = [
  { label: "시작할 때", summary: "돈 → · ← 공간", note: "점주가 3천만 원을 맡기고 공간을 인도받습니다." },
  { label: "매달", summary: "200만 원 × 36 = 7천200만 원", note: "방향은 그대로입니다. 돈은 건물주 쪽으로 쌓이고 점주는 그 대가로 공간을 계속 씁니다." },
  { label: "마지막 날", summary: "← 돈 · 공간 →", note: "화살표가 뒤집힙니다. 공간은 건물주에게, 맡긴 돈은 점주에게 돌아갑니다. 공제 사유가 없을 때의 (가정)입니다." },
  { label: "월별 지급만 적으면", summary: "뒤집히는 줄이 사라짐", note: "가운데 줄만 기록하면 처음 맡긴 돈과 마지막 날의 반환·복구 책임이 그림에서 빠집니다." },
] as const;

function Arrow({ y, right, text, color }: { y: number; right: boolean; text: string; color: string }) {
  const from = right ? XL + 3 : XR - 3;
  const to = right ? XR - 3 : XL + 3;
  const head = right ? -6 : 6;
  return (
    <g>
      <text x={(XL + XR) / 2} y={y - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{text}</text>
      <line x1={from} x2={to} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${to + head} ${y - 4} L${to} ${y} L${to + head} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function ExchangeDirectionViz() {
  return (
    <SceneShell
      eyebrow="주고받는 방향"
      title="언제 돈과 공간의 방향이 뒤집힐까요"
      description="왼쪽 세로줄이 점주, 오른쪽 세로줄이 건물주입니다. 파란 화살표는 돈, 주황 화살표는 공간입니다."
      note="금액과 공제 없는 반환은 이 글 사례의 (가정)입니다. 월세 외 관리비·세금·공사비는 그리지 않았습니다."
      ariaLabel="점주와 건물주 사이에서 시작, 매달, 마지막 날에 돈과 공간이 오가는 방향"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={XL - 2} y={14} fontSize={13} fontWeight={700} fill={TEXT} textAnchor="start">점주</text>
          <text x={XR + 2} y={14} fontSize={13} fontWeight={700} fill={TEXT} textAnchor="end">건물주</text>
          <line x1={XL} x2={XL} y1={20} y2={H} stroke={AXIS} strokeWidth={1} />
          <line x1={XR} x2={XR} y1={20} y2={H} stroke={AXIS} strokeWidth={1} />
          {ROWS.map((row, index) => {
            const y = TOP + ROW * index;
            const on = active === 3 ? index === 1 : index === active;
            const seen = active !== 3 && index < active;
            return (
              <g key={row.when} opacity={on ? 1 : seen ? 0.5 : 0.18}>
                <text x={(XL + XR) / 2} y={y + 12} textAnchor="middle" fontSize={12} fill={TEXT}>{row.when}</text>
                <Arrow y={y + 36} right={row.money.right} text={row.money.text} color={MONEY} />
                <Arrow y={y + 66} right={row.space.right} text={row.space.text} color={SPACE} />
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
