import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 매달 100만 원이면 1,000 ÷ 100 = 10개월, 월세 50만 원이 오르면 1,000 ÷ 50 = 20개월.
 * 가로 = 개월, 세로 = 누적 회수액(만 원). 10개월째 500은 50 × 10입니다.
 */
const W = 340;
const H = 216;
const LEFT = 46;
const RIGHT = 12;
const TOP = 54;
const BOTTOM = 34;
const X_MAX = 20;
const Y_MAX = 1000;

const px = (month: number) => LEFT + (month / X_MAX) * (W - LEFT - RIGHT);
const py = (value: number) => H - BOTTOM - (value / Y_MAX) * (H - TOP - BOTTOM);

const OLD = "#2563eb";
const NEW = "#b45309";
const RENT = "#dc2626";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const BAR_Y = 6;
const BAR_H = 22;
const BAR_X = LEFT;
const BAR_W = W - LEFT - RIGHT;

const SCENES = [
  { label: "월세가 그대로일 때", summary: "1,000 ÷ 100 = 10개월", note: "운영 비용을 반영한 뒤 매달 100만 원이 남는다고 가정합니다. 미래 기대에 준 1천만 원을 이 돈으로만 나누면 열 달째에 선에 닿습니다." },
  { label: "월세가 50만 원 오르면", summary: "100 − 50 = 50만 원", note: "같은 가게인데 매달 남는 칸이 절반이 됩니다. 열 달째의 누적은 1천만 원이 아니라 50 × 10 = 500만 원입니다." },
  { label: "선에 닿는 달", summary: "1,000 ÷ 50 = 20개월", note: "50만 원씩 쌓이면 스무 달째에 선에 닿습니다. 금액이 매달 같다는 가정이며 세금·이자·시설값 회수와 돈의 시간가치는 제외했습니다. 전체 3천300만 원의 투자 평가나 적정 권리금 계산은 아닙니다." },
] as const;

function Stage({ step }: { step: number }) {
  const reach = step === 1 ? 10 : 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      {/* 매달 남는 돈 */}
      <text x={LEFT - 6} y={BAR_Y + 16} textAnchor="end" fontSize={12} fill={TEXT}>매달</text>
      {step === 0 ? (
        <g>
          <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} fill={OLD} />
          <text x={BAR_X + BAR_W / 2} y={BAR_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">남는 돈 100만</text>
        </g>
      ) : (
        <g>
          <rect x={BAR_X} y={BAR_Y} width={BAR_W / 2} height={BAR_H} fill={NEW} />
          <text x={BAR_X + BAR_W / 4} y={BAR_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">남는 돈 50만</text>
          <rect x={BAR_X + BAR_W / 2} y={BAR_Y} width={BAR_W / 2} height={BAR_H} fill="none" stroke={RENT} strokeWidth={1} strokeDasharray="3 2" />
          <text x={BAR_X + (BAR_W * 3) / 4} y={BAR_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={RENT}>월세 +50만</text>
        </g>
      )}

      {/* 눈금 */}
      {[0, 500, 1000].map((value) => (
        <g key={value}>
          <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke={DIM} strokeWidth={value === 1000 ? 1.25 : 0.5} strokeDasharray={value === 500 ? "2 3" : undefined} />
          <text x={LEFT - 6} y={py(value) + 4} textAnchor="end" fontSize={12} fill={TEXT}>{value.toLocaleString("en-US")}</text>
        </g>
      ))}
      {[0, 10, 20].map((month) => (
        <text key={month} x={px(month)} y={H - BOTTOM + 17} textAnchor={month === 20 ? "end" : "middle"} fontSize={12} fill={TEXT}>{month}개월</text>
      ))}
      <text x={px(0) + 2} y={py(1000) - 7} fontSize={12} fontWeight={700} fill={TEXT}>미래 기대에 준 1,000만</text>

      {/* 월 100만 */}
      <line x1={px(0)} y1={py(0)} x2={px(10)} y2={py(1000)} stroke={OLD} strokeWidth={1.25} strokeDasharray={step === 0 ? undefined : "4 3"} />
      <circle cx={px(10)} cy={py(1000)} r={3.5} fill={OLD} />
      <line x1={px(10)} x2={px(10)} y1={py(1000)} y2={py(0)} stroke={OLD} strokeWidth={0.75} strokeDasharray="2 3" />

      {/* 월 50만 */}
      {step >= 1 && (
        <g>
          <line x1={px(0)} y1={py(0)} x2={px(reach)} y2={py(reach * 50)} stroke={NEW} strokeWidth={1.25} />
          <circle cx={px(reach)} cy={py(reach * 50)} r={3.5} fill={NEW} />
          {step === 1 && <text x={px(10) + 8} y={py(500) + 18} fontSize={13} fontWeight={700} fill={NEW}>10개월째 500만</text>}
          {step === 2 && <text x={px(20)} y={py(760)} textAnchor="end" fontSize={13} fontWeight={700} fill={NEW}>20개월</text>}
        </g>
      )}
      <text x={px(10) + 7} y={py(1000) + 20} fontSize={13} fontWeight={700} fill={OLD}>10개월</text>
    </svg>
  );
}

export default function PaybackMonthsViz() {
  return (
    <SceneShell
      eyebrow="단순 회수기간"
      title="월세 50만 원이 회수에 걸리는 시간을 두 배로 늘립니다"
      description="위 막대는 한 달의 돈, 아래 그래프는 그 돈이 쌓인 금액입니다. 단위는 만 원이고 금액과 매달 같다는 조건은 모두 (가정)입니다."
      ariaLabel="매달 남는 돈이 100만 원에서 50만 원으로 줄 때 1천만 원 회수가 10개월에서 20개월로 늘어나는 그래프"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
