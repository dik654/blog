import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 평균 이용자 수가 맞아도 출근시간 한 방향에 수요가 몰리면 필요한 차량과 설비가 달라집니다.
 * 칸 6개와 수요 값은 설명용 가정입니다. 두 경우 모두 합 60, 평균 10.
 */
const SLOT_LABELS = ["출근 ↑", "출근 ↓", "낮 ↑", "낮 ↓", "저녁 ↑", "저녁 ↓"] as const;
const EVEN = [10, 10, 10, 10, 10, 10] as const;
const PEAK = [30, 5, 5, 5, 5, 10] as const;
const average = (values: readonly number[]) => values.reduce<number>((sum, value) => sum + value, 0) / values.length;
const AVG_EVEN = average(EVEN);
const AVG_PEAK = average(PEAK);
const MAX_PEAK = Math.max(...PEAK);
const MAX_EVEN = Math.max(...EVEN);

const W = 360;
const H = 170;
const LEFT = 8;
const BASE = 138;
const TOP = 22;
const SCALE_MAX = 32;
const BAR = 40;
const GAP = (W - 2 * LEFT - SLOT_LABELS.length * BAR) / (SLOT_LABELS.length - 1);
const barX = (index: number) => LEFT + index * (BAR + GAP);
const y = (value: number) => BASE - (value / SCALE_MAX) * (BASE - TOP);

const SCENES = [
  { label: "수요가 고르면", summary: `평균 ${AVG_EVEN} · 최대 ${MAX_EVEN}`, note: "하루를 시간대와 방향으로 나눈 여섯 칸입니다(가정). ↑는 출근 쪽 방향, ↓는 그 반대입니다. 모든 칸이 같으면 평균과 최대가 같습니다." },
  { label: "출근시간 한 방향에 몰리면", summary: `평균 ${AVG_PEAK} · 최대 ${MAX_PEAK}`, note: "합계 60과 평균 10은 그대로입니다. 평균 이용자 수만 보면 앞 장면과 구별되지 않습니다." },
  { label: "평균이 맞아도 달라지는 것", summary: `가장 붐비는 칸 ${MAX_EVEN} → ${MAX_PEAK}`, note: "가장 붐비는 칸이 세 배가 되고 필요한 차량과 설비도 달라집니다. 수치는 모양을 보이기 위한 가정이며 차량 수를 계산한 것이 아닙니다." },
] as const;

export default function PeakDemandViz() {
  return (
    <SceneShell
      eyebrow="평균과 쏠림"
      title="평균 이용자 수가 같아도 몰리는 칸은 다를 수 있습니다"
      description="막대 높이가 그 칸의 수요입니다. 점선이 평균 10입니다. 칸과 값은 모두 가정입니다."
      ariaLabel="평균이 같은 두 수요 분포에서 가장 붐비는 칸의 차이"
      scenes={SCENES}
      render={(active) => {
        const values: readonly number[] = active === 0 ? EVEN : PEAK;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {values.map((value, index) => (
              <g key={SLOT_LABELS[index]}>
                <rect x={barX(index)} y={y(value)} width={BAR} height={BASE - y(value)} rx={2} fill={active > 0 && value === MAX_PEAK ? "#d97706" : "#64748b"} />
                <text x={barX(index) + BAR / 2} y={y(value) - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{value}</text>
                <text x={barX(index) + BAR / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fill="#64748b">{SLOT_LABELS[index]}</text>
              </g>
            ))}
            {active === 2 && (
              <g>
                <line x1={barX(0) + BAR + 5} x2={barX(0) + BAR + 5} y1={y(MAX_EVEN)} y2={y(MAX_PEAK)} stroke="#b45309" strokeWidth={1} />
                <text x={barX(0) + BAR + 9} y={y((MAX_EVEN + MAX_PEAK) / 2) + 4} fontSize={11} fontWeight={700} fill="#b45309">{MAX_PEAK / MAX_EVEN}배</text>
              </g>
            )}
            <line x1={LEFT} x2={W - LEFT} y1={y(AVG_EVEN)} y2={y(AVG_EVEN)} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
            <line x1={LEFT} x2={W - LEFT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
