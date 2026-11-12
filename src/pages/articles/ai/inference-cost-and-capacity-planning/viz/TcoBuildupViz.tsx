import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #efficiency — $250,000 서버 8장을 4년 쓰는 TCO 가정.
 * 장비비 250,000 ÷ (4 × 8,760 × 8) ≈ 0.89, 전력비 700W × 8 × PUE 1.3 × 0.12 ÷ 8 ≈ 0.11,
 * 합 ≈ 1 $/GPU-h. 평균 이용률 40%면 실제로 일한 시간 기준 1 ÷ 0.4 = 2.5 $/GPU-h.
 */
const YEARS = 4;
const HOURS_PER_YEAR = 8760;
const GPUS = 8;
const SERVER_PRICE = 250000;
const WATTS = 700;
const PUE = 1.3;
const KWH_PRICE = 0.12;
const UTIL = 0.4;
const RENT = 2;

const GPU_HOURS = YEARS * HOURS_PER_YEAR * GPUS; // 280,320
const EQUIP = SERVER_PRICE / GPU_HOURS; // ≈ 0.89
const FACILITY_KW = (WATTS * GPUS * PUE) / 1000; // 7.28
const POWER_PER_HOUR = FACILITY_KW * KWH_PRICE; // ≈ 0.87
const POWER = POWER_PER_HOUR / GPUS; // ≈ 0.11
const TOTAL = EQUIP + POWER; // ≈ 1.00
const EFFECTIVE = TOTAL / UTIL; // ≈ 2.5

const usd = (value: number, digits = 2) => "$" + value.toFixed(digits);

const SCENES = [
  {
    label: "장비비를 GPU-시간으로 나눕니다",
    summary: "≈ " + usd(EQUIP) + "/GPU-h",
    note: "서버 값 $250,000을 4년 동안 GPU 8장이 쓸 수 있는 시간 전체로 나눕니다. 4 × 8,760 × 8 = 280,320 GPU-h이므로 GPU 한 장의 한 시간마다 약 $0.89입니다.",
  },
  {
    label: "전력비를 GPU 한 장 몫으로 나눕니다",
    summary: "≈ " + usd(POWER) + "/GPU-h",
    note: "PUE는 시설 전체가 쓰는 전력을 IT 장비 전력으로 나눈 값이라, 서버 5.6kW에 1.3을 곱해 냉각 등을 포함한 7.28kW가 됩니다. $0.12/kWh면 시간당 약 $0.87이고 8장으로 나누면 장당 약 $0.11입니다.",
  },
  {
    label: "두 몫을 더하면 약 $1입니다",
    summary: usd(EQUIP) + " + " + usd(POWER) + " ≈ " + usd(TOTAL),
    note: "이 $1/GPU-h는 GPU가 4년 내내 차 있다고 둔 값입니다. 아래 열 칸이 모두 일하는 시간으로 칠해져 있는 이유입니다.",
  },
  {
    label: "이용률 40%면 2.5배가 됩니다",
    summary: "$1 ÷ 0.4 = " + usd(EFFECTIVE, 1),
    note: "열 시간 중 네 시간만 일해도 열 시간 값이 모두 나갑니다. 실제로 일한 시간으로 나누면 약 $2.5라 $2/GPU-h 임대(가정)와 비슷해집니다. 소유와 임대를 가르는 것은 단가보다 이용률을 얼마나 높게 유지하느냐입니다.",
  },
] as const;

const FORMULAS: readonly (readonly string[])[] = [
  ["4년 × 8,760h × 8장 = 280,320 GPU-h", "$250,000 ÷ 280,320 ≈ $0.89"],
  ["700W × 8장 × PUE 1.3 = 7.28kW", "7.28kW × $0.12/kWh ≈ $0.87/h", "$0.87 ÷ 8장 ≈ $0.11"],
  ["장비 $0.89 + 전력 $0.11 ≈ $1.00/GPU-h"],
  ["10시간 값 $10 ÷ 일한 4시간 = $2.5/GPU-h"],
];

const X0 = 16;
const X1 = 344;
const MAX_USD = 3;
const xOf = (value: number) => X0 + (value / MAX_USD) * (X1 - X0);
const EQUIP_C = "#2563eb";
const POWER_C = "#d97706";
const IDLE_C = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

export default function TcoBuildupViz() {
  return (
    <SceneShell
      eyebrow="TCO를 시간 단가로"
      title="서버 값과 전기 요금을 GPU 한 장의 한 시간 값으로 바꿉니다"
      description="위 막대는 GPU 한 장을 한 시간 쓰는 값($/GPU-h)이고, 아래 열 칸은 하루 중 열 시간을 그림용으로 나눈 것입니다. 서버 값·전력·전기 요금·$2 임대 단가는 모두 본문의 계산용 가정입니다."
      ariaLabel="장비비와 전력비를 GPU-시간 단가로 바꾸고 이용률로 나누는 과정"
      scenes={SCENES}
      render={(active) => {
        const used = active === 3 ? 4 : 10;
        return (
          <div className="min-w-0">
            <StableSceneStack
              active={active}
              scenes={FORMULAS.map((parts, index) => (
                <div key={index} className="flex flex-wrap gap-2 font-mono text-xs">
                  {parts.map((part) => (
                    <span key={part} className="rounded-md border border-border px-2 py-1">
                      {part}
                    </span>
                  ))}
                </div>
              ))}
            />
            <svg viewBox="0 0 360 172" className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
              <text x={X0} y={14} fontSize={11} fontWeight={700} fill={MUTED}>
                GPU 한 장 한 시간의 값
              </text>
              <rect x={X0} y={22} width={X1 - X0} height={20} rx={2} fill="none" stroke={LINE} strokeWidth={1} />
              {active === 3 && <rect x={xOf(TOTAL)} y={22} width={xOf(EFFECTIVE) - xOf(TOTAL)} height={20} fill={IDLE_C} opacity={0.75} />}
              <rect x={xOf(0)} y={22} width={xOf(EQUIP) - xOf(0)} height={20} fill={EQUIP_C} opacity={active === 1 ? 0.35 : 0.8} />
              {active >= 1 && <rect x={xOf(EQUIP)} y={22} width={xOf(TOTAL) - xOf(EQUIP)} height={20} fill={POWER_C} />}
              {[0, 1, 2, 3].map((tick) => (
                <text key={tick} x={xOf(tick)} y={56} fontSize={10} fill={MUTED} textAnchor={tick === 0 ? "start" : tick === 3 ? "end" : "middle"}>
                  {"$" + tick}
                </text>
              ))}
              {active === 3 && (
                <g>
                  <line x1={xOf(RENT)} x2={xOf(RENT)} y1={18} y2={46} stroke="#0f172a" strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={xOf(RENT) - 4} y={70} fontSize={10} fontWeight={700} fill={MUTED} textAnchor="end">
                    임대 $2 (가정)
                  </text>
                  <text x={xOf(EFFECTIVE)} y={70} fontSize={10} fontWeight={700} fill={IDLE_C} textAnchor="middle">
                    {"≈ " + usd(EFFECTIVE, 1)}
                  </text>
                </g>
              )}
              {active === 2 && (
                <text x={xOf(TOTAL)} y={70} fontSize={10} fontWeight={700} fill={MUTED} textAnchor="middle">
                  {"≈ " + usd(TOTAL)}
                </text>
              )}
              {active < 2 && (
                <text x={active === 0 ? xOf(EQUIP / 2) : xOf(TOTAL) + 4} y={70} fontSize={10} fontWeight={700} fill={active === 0 ? EQUIP_C : POWER_C} textAnchor={active === 0 ? "middle" : "start"}>
                  {active === 0 ? "장비 " + usd(EQUIP) : "전력 +" + usd(POWER)}
                </text>
              )}

              <text x={X0} y={96} fontSize={11} fontWeight={700} fill={MUTED}>
                하루 중 열 시간 (그림용 열 칸)
              </text>
              {Array.from({ length: 10 }, (_, hour) => {
                const working = hour < used;
                return (
                  <rect
                    key={hour}
                    x={X0 + hour * 33}
                    y={104}
                    width={30}
                    height={26}
                    rx={2}
                    fill={working ? EQUIP_C : "none"}
                    opacity={working ? 0.7 : 1}
                    stroke={working ? EQUIP_C : IDLE_C}
                    strokeWidth={1}
                    strokeDasharray={working ? undefined : "3 2"}
                  />
                );
              })}
              <text x={X0} y={148} fontSize={10} fill={MUTED}>
                {active === 3 ? "파란 칸 = 일한 시간 4칸 · 빨간 점선 = 놀았지만 값을 낸 6칸" : "파란 칸 = 일한 시간 · 4년 내내 모든 칸이 차 있다고 둡니다"}
              </text>
              <text x={X0} y={164} fontSize={10} fontWeight={700} fill={active === 3 ? IDLE_C : MUTED}>
                {active === 3 ? "열 칸 값 $10을 일한 4칸이 나눠 냅니다" : "열 칸 값을 열 칸이 나눠 냅니다"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
