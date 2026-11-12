import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scaling — 기본 6장 약정($1.2/GPU-h × 720h)과 낮 6시간 추가 6장 온디맨드($2 × 180h).
 * 6 × 1.2 × 720 = 5,184, 6 × 2 × 180 = 2,160, 합 7,344. 12장 전부 온디맨드 한 달이면 12 × 2 × 720 = 17,280.
 * 칸 하나 = GPU 한 장의 한 시간, 그림은 하루치이고 한 달은 30배. 낮 6시간의 위치는 그림용 가정입니다.
 */
const BASE = 6;
const PEAK_EXTRA = 6;
const PEAK_HOURS = 6;
const DAYS = 30;
const MONTH_HOURS = 720;
const P_RES = 1.2;
const P_OD = 2;
const PEAK_START = 10; // 그림용 위치(가정)

const BASE_COST = BASE * P_RES * MONTH_HOURS; // 5,184
const PEAK_COST = PEAK_EXTRA * P_OD * PEAK_HOURS * DAYS; // 2,160
const MIXED_COST = BASE_COST + PEAK_COST; // 7,344
const ALL_OD_COST = (BASE + PEAK_EXTRA) * P_OD * MONTH_HOURS; // 17,280
const UNNEEDED_PER_DAY = PEAK_EXTRA * (24 - PEAK_HOURS); // 108

const money = (value: number) => "$" + value.toLocaleString("en-US");

const SCENES = [
  {
    label: "기본 6장은 하루 종일 약정으로",
    summary: "6장 × 720h × $1.2 = " + money(BASE_COST),
    note: "약정 용량은 일정 기간 사용을 약속하고 할인받는 방식입니다. 하루 종일 필요한 기본 부하 6장을 $1.2/GPU-h(가정)로 한 달 720시간 잡으면 $5,184입니다.",
  },
  {
    label: "낮 6시간만 6장을 더 빌립니다",
    summary: money(BASE_COST) + " + " + money(PEAK_COST) + " = " + money(MIXED_COST),
    note: "온디맨드는 장기 약정 없이 시간 단위로 빌리는 방식입니다. 최대 부하용 6장을 하루 6시간씩 30일, 모두 180시간 쓰면 6 × $2 × 180 = $2,160이고 둘을 더해 한 달 $7,344입니다.",
  },
  {
    label: "12장을 한 달 내내 온디맨드로 두면",
    summary: "12장 × 720h × $2 = " + money(ALL_OD_COST),
    note: "같은 12장을 모두 온디맨드로 한 달 내내 두면 $17,280입니다. 연한 칸처럼 하루 " + UNNEEDED_PER_DAY + "칸은 필요 없는 시간인데도 값을 냅니다. 가격은 모두 설명용 가정입니다.",
  },
] as const;

const GX = 44;
const CELL_W = 12.5;
const ROW_H = 9;
const GY = 24;
const RES_C = "#2563eb";
const OD_C = "#d97706";
const OD_LIGHT = "#fed7aa";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const COST_MAX = 18000;
const cx = (value: number) => GX + (value / COST_MAX) * (24 * CELL_W);

export default function ReservedOnDemandViz() {
  return (
    <SceneShell
      eyebrow="약정과 온디맨드"
      title="하루 종일 필요한 칸과 낮에만 필요한 칸을 다른 값으로 삽니다"
      description="칸 하나가 GPU 한 장의 한 시간이고, 가로 24칸이 하루, 세로 12줄이 GPU 12장입니다. 파랑은 약정, 주황은 온디맨드, 빈 칸은 빌리지 않은 시간입니다. 한 달 비용은 이 하루를 30번 쌓은 값입니다."
      note="$1.2·$2/GPU-h와 12장 구성은 본문의 설명용 가정이며, 낮 6시간을 10시부터 그린 위치도 그림용 가정입니다."
      ariaLabel="약정 기본 용량과 온디맨드 추가 용량의 하루 GPU-시간과 한 달 비용"
      scenes={SCENES}
      render={(active) => {
        const monthCost = active === 0 ? BASE_COST : active === 1 ? MIXED_COST : ALL_OD_COST;
        return (
          <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
            <text x={GX + PEAK_START * CELL_W + (PEAK_HOURS * CELL_W) / 2} y={16} fontSize={10} fontWeight={700} fill={OD_C} textAnchor="middle">
              낮 6시간
            </text>
            {Array.from({ length: 12 }, (_, row) => {
              const isBase = row >= 12 - BASE;
              return Array.from({ length: 24 }, (_, hour) => {
                const peak = hour >= PEAK_START && hour < PEAK_START + PEAK_HOURS;
                const needed = isBase || peak;
                const fill =
                  active === 2
                    ? needed
                      ? OD_C
                      : OD_LIGHT
                    : isBase
                      ? RES_C
                      : peak && active === 1
                        ? OD_C
                        : "none";
                return (
                  <rect
                    key={row + "-" + hour}
                    x={GX + hour * CELL_W + 0.5}
                    y={GY + row * ROW_H + 0.5}
                    width={CELL_W - 1}
                    height={ROW_H - 1}
                    fill={fill}
                    opacity={fill === "none" ? 1 : 0.85}
                    stroke={fill === "none" ? LINE : "none"}
                    strokeWidth={0.5}
                  />
                );
              });
            })}
            <text x={GX - 4} y={GY + 3 * ROW_H + 3} fontSize={10} fill={MUTED} textAnchor="end">
              추가 6
            </text>
            <text x={GX - 4} y={GY + 9 * ROW_H + 3} fontSize={10} fill={MUTED} textAnchor="end">
              기본 6
            </text>
            {[0, 12, 24].map((hour) => (
              <text key={hour} x={GX + hour * CELL_W} y={GY + 12 * ROW_H + 12} fontSize={10} fill={MUTED} textAnchor={hour === 0 ? "start" : hour === 24 ? "end" : "middle"}>
                {hour}시
              </text>
            ))}

            <text x={GX} y={158} fontSize={10.5} fontWeight={700} fill={MUTED}>
              한 달 비용
            </text>
            <rect x={GX} y={164} width={24 * CELL_W} height={14} rx={2} fill="none" stroke={LINE} strokeWidth={1} />
            {active < 2 ? (
              <g>
                <rect x={cx(0)} y={164} width={cx(BASE_COST) - cx(0)} height={14} fill={RES_C} opacity={0.85} />
                {active === 1 && <rect x={cx(BASE_COST)} y={164} width={cx(MIXED_COST) - cx(BASE_COST)} height={14} fill={OD_C} opacity={0.85} />}
              </g>
            ) : (
              <g>
                <rect x={cx(0)} y={164} width={cx(ALL_OD_COST) - cx(0)} height={14} fill={OD_C} opacity={0.85} />
                <line x1={cx(MIXED_COST)} x2={cx(MIXED_COST)} y1={160} y2={182} stroke="#0f172a" strokeWidth={1.25} strokeDasharray="3 2" />
              </g>
            )}
            <text x={GX + 24 * CELL_W} y={158} fontSize={10.5} fontWeight={700} fill={active === 2 ? OD_C : MUTED} textAnchor="end">
              {active === 2 ? money(monthCost) + " · 점선 = " + money(MIXED_COST) : money(monthCost)}
            </text>
          </svg>
        );
      }}
    />
  );
}
