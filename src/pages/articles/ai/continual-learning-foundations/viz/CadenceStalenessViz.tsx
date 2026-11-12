import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cadence-freshness — 하루 단위로 바뀌는 정보를 주 단위로만 재학습하면
 * 최대 6일치 변화가 반영되지 않은 채 서빙된다. 매일 재학습하면 freshness는 좋아지지만
 * 매 cycle마다 gain·forgetting 확인이 필요하다.
 * 14일(가정) 동안: 주 단위 → 재학습 2회, 밀린 변화 0,1,…,6일 반복 · 매일 → 재학습 14회, 0일.
 */
const DAYS = 14;
const WEEKLY = Array.from({ length: DAYS }, (_, day) => day % 7);
const DAILY = Array.from({ length: DAYS }, () => 0);
const RETRAIN_WEEKLY = WEEKLY.filter((lag) => lag === 0).length;
const MAX_LAG = 6;

const SCENES = [
  {
    label: "주 단위 재학습",
    summary: `14일에 ${RETRAIN_WEEKLY}회 · 밀린 변화 최대 ${MAX_LAG}일`,
    note: "재학습한 날에는 그날까지의 변화가 반영됩니다. 다음 날부터 매일 하루치 변화가 쌓여, 다음 재학습 직전 날에는 6일치 변화가 반영되지 않은 채 서빙됩니다. 7일치가 아니라 6일치인 이유는 재학습한 날이 0일치이기 때문입니다.",
  },
  {
    label: "매일 재학습",
    summary: `14일에 ${DAYS}회 · 밀린 변화 0일`,
    note: "매일 재학습하면 하루치 변화가 쌓이기 전에 반영돼 같은 셈법으로 밀린 날이 0입니다. 대신 재학습이 2회에서 14회로 늘고, 그때마다 adaptation gain과 forgetting을 다시 확인해야 합니다.",
  },
] as const;

const W = 360;
const H = 170;
const LEFT = 12;
const BASE_Y = 128;
const TOP_Y = 26;
const BAR_W = 16;
const GAP = (W - 2 * LEFT - DAYS * BAR_W) / (DAYS - 1);
const bx = (day: number) => LEFT + day * (BAR_W + GAP);
const bh = (lag: number) => (lag / MAX_LAG) * (BASE_Y - TOP_Y);

export default function CadenceStalenessViz() {
  return (
    <SceneShell
      eyebrow="Update cadence"
      title="주 단위로 재학습하면 밀린 변화가 6일까지 쌓였다 0으로 돌아갑니다"
      description="막대 하나가 하루이고, 높이는 그날 서빙하는 모델에 반영되지 않은 변화가 며칠치인지입니다. 정보가 하루 단위로 바뀌는 서비스를 14일 동안 본다고 가정했습니다. 아래 ▲는 재학습한 날입니다."
      ariaLabel="주 단위와 매일 재학습에서 반영되지 않은 변화 일수와 재학습 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        const lags = active === 0 ? WEEKLY : DAILY;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={W - LEFT} y1={TOP_Y} y2={TOP_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={LEFT} y={TOP_Y - 7} textAnchor="start" fontSize={11} fill="#64748b">점선 = 6일치</text>
            {lags.map((lag, day) => (
              <g key={day}>
                {lag > 0 && (
                  <rect x={bx(day)} y={BASE_Y - bh(lag)} width={BAR_W} height={bh(lag)} rx={2} fill="#d97706" opacity={lag === MAX_LAG ? 0.95 : 0.6} />
                )}
                {lag > 0 && (
                  <text x={bx(day) + BAR_W / 2} y={BASE_Y - bh(lag) - 4} textAnchor="middle" fontSize={10} fill="#92400e">{lag}</text>
                )}
                {lag === 0 && (
                  <text x={bx(day) + BAR_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill="#2563eb">▲</text>
                )}
                {(day === 0 || day === 6 || day === 7 || day === DAYS - 1) && (
                  <text x={bx(day) + BAR_W / 2} y={BASE_Y + 32} textAnchor="middle" fontSize={10} fill="#64748b">{day + 1}일</text>
                )}
              </g>
            ))}
            <line x1={LEFT} x2={W - LEFT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
