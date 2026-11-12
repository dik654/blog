import SceneShell from "./SceneShell";

/**
 * 본문 대응: #where-it-slips — 마지막 채움의 몫은 한 번의 눈금(1만) 안에 있을 수 있지만,
 * 채움마다 100명씩 차이가 나면(글의 예) 170번에 17,000명이 되어 1만을 넘습니다.
 * 100 × 100 = 10,000 → 100번째 채움에서 1만에 닿습니다.
 * 방향 예시(가정): 매 채움에 실제로 9,900명 → 170 × 9,900 = 1,683,000, 기록 1,700,000보다 17,000 적음.
 */
const FILLS = 170;
const UNIT = 10000;
const PER_FILL = 100;
const CROSS = UNIT / PER_FILL;
const TOTAL_GAP = FILLS * PER_FILL;
const RECORDED = FILLS * UNIT;
const ACTUAL = FILLS * (UNIT - PER_FILL);

const fmt = (n: number) => n.toLocaleString("en-US");

const SCENES = [
  {
    label: "눈금 하나의 높이",
    summary: "1만 = 표기 단위",
    note: "가로는 채움 횟수, 세로는 그때까지 쌓인 차이(명)입니다. 점선은 눈금 하나인 1만입니다. 170만이라는 기록은 1만 단위로 적혀 있으므로, 이 선보다 작은 차이는 기록에 나타나지 않습니다.",
  },
  {
    label: "마지막 채움의 몫",
    summary: "한 번의 눈금 안에 있을 수 있음",
    note: "마지막에 덜 찬 담에서 빠진 몫은 한 번의 채움에서만 생기므로 1만 안에 있을 수 있습니다. 그 몫이 얼마였는지는 적혀 있지 않아 칸 전체를 흐리게 칠했습니다.",
  },
  {
    label: "채움마다 100명씩",
    summary: `${PER_FILL} × ${FILLS} = ${fmt(TOTAL_GAP)}명`,
    note: "빽빽함이나 부대 구성의 차이는 한 번에 끝나지 않고 여러 채움에서 되풀이될 수 있습니다. 글이 든 예처럼 한 번에 100명씩 차이가 나면 50번에 5,000명, 170번에 17,000명으로 쌓입니다.",
  },
  {
    label: "1만을 넘는 자리",
    summary: `${CROSS}번째 채움에서 1만`,
    note: "100명씩 쌓이면 100번째 채움에서 이미 1만에 닿고, 170번째에는 17,000명입니다. 그래서 1만은 표기 단위로 남을 뿐 총오차의 상한은 아닙니다. 이 기록만으로 실제 인원이 어느 범위에 있었는지는 정할 수 없습니다.",
  },
  {
    label: "밀도를 크게 잡았다면",
    summary: `기록 ${fmt(RECORDED)} · 실제 ${fmt(ACTUAL)} (가정)`,
    note: "담의 밀도를 실제보다 크게 잡았다면 같은 170번의 채움이 실제보다 많은 사람으로 환산됩니다. 매 채움에 실제로 9,900명이 들어갔다고 가정하면 실제는 1,683,000명이고 기록은 17,000명 많게 나옵니다. 100명은 글이 든 예일 뿐이며, 실제 차이의 크기는 이 기록에서 알 수 없습니다.",
  },
] as const;

const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const UNIT_C = "#0ea5e9";
const LAST = "#f59e0b";
const SLIP = "#ef4444";

const X0 = 56;
const X1 = 330;
const Y0 = 170;
const Y1 = 30;
const MAX_Y = 20000;
const px = (fill: number) => X0 + (fill / FILLS) * (X1 - X0);
const py = (people: number) => Y0 - (people / MAX_Y) * (Y0 - Y1);

export default function AccumulatedErrorViz() {
  return (
    <SceneShell
      eyebrow="쌓이는 차이"
      title="한 번의 몫은 눈금 안에 머물 수 있지만, 채움마다 되풀이된 차이는 눈금을 넘습니다"
      description="가로는 채움 횟수(170번), 세로는 쌓인 차이(명)입니다. 채움마다 100명은 본문이 든 예이고, 실제 차이의 크기는 사료에 적혀 있지 않습니다."
      ariaLabel="채움마다 쌓이는 인원 차이가 1만이라는 표기 단위를 넘는 과정"
      scenes={SCENES}
      render={(active) => {
        const showLine = active >= 2;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 축 */}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke={LINE} strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke={LINE} strokeWidth={1} />
            {[0, 50, 100, 170].map((f) => (
              <text key={f} x={px(f)} y={Y0 + 14} textAnchor="middle" fontSize={9.5} fill={MUTED}>{f}</text>
            ))}
            <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={9.5} fill={MUTED}>채움 횟수</text>
            {[0, 10000, 20000].map((v) => (
              <text key={v} x={X0 - 6} y={py(v) + 3} textAnchor="end" fontSize={9.5} fill={MUTED}>{v === 0 ? "0" : `${v / 10000}만`}</text>
            ))}
            <text x={10} y={Y1 - 12} fontSize={9.5} fill={MUTED}>쌓인 차이(명)</text>

            {/* 1만 눈금 */}
            <line x1={X0} x2={X1} y1={py(UNIT)} y2={py(UNIT)} stroke={UNIT_C} strokeWidth={1} strokeDasharray="4 3" />
            <text x={X0 + 4} y={py(UNIT) - 5} fontSize={9.5} fontWeight={700} fill={UNIT_C}>눈금 하나 = 1만</text>

            {/* 마지막 채움의 몫: 크기를 모르므로 칸 전체를 흐리게 */}
            {active === 1 && (
              <g>
                <rect x={px(FILLS) - 10} y={py(UNIT)} width={10} height={Y0 - py(UNIT)} fill={LAST} opacity={0.25} stroke={LAST} strokeWidth={1} strokeDasharray="2 2" />
                <text x={px(FILLS) - 16} y={py(UNIT / 2)} textAnchor="end" fontSize={9.5} fontWeight={700} fill="#b45309">마지막 채움의 몫</text>
                <text x={px(FILLS) - 16} y={py(UNIT / 2) + 14} textAnchor="end" fontSize={9} fill={MUTED}>이 칸 안 어딘가 · 크기 미상</text>
              </g>
            )}

            {showLine && (
              <g>
                <line x1={px(0)} y1={py(0)} x2={px(FILLS)} y2={py(TOTAL_GAP)} stroke={SLIP} strokeWidth={1.25} />
                <circle cx={px(50)} cy={py(50 * PER_FILL)} r={3} fill={SLIP} />
                <text x={px(50)} y={py(50 * PER_FILL) - 7} textAnchor="middle" fontSize={9.5} fill={INK}>5,000</text>
                <circle cx={px(FILLS)} cy={py(TOTAL_GAP)} r={3.5} fill={SLIP} />
                <text x={px(FILLS) - 6} y={py(TOTAL_GAP) - 8} textAnchor="end" fontSize={10.5} fontWeight={700} fill={SLIP}>{`${fmt(TOTAL_GAP)}명`}</text>
              </g>
            )}
            {active >= 3 && (
              <g>
                <line x1={px(CROSS)} x2={px(CROSS)} y1={py(UNIT)} y2={Y0} stroke={SLIP} strokeWidth={1} strokeDasharray="2 2" />
                <circle cx={px(CROSS)} cy={py(UNIT)} r={3.5} fill="#ffffff" stroke={SLIP} strokeWidth={1.25} />
                <text x={px(CROSS) + 6} y={py(UNIT) + 16} fontSize={9.5} fontWeight={700} fill={SLIP}>100번째에 1만</text>
              </g>
            )}
            {active === 4 && (
              <g>
                <rect x={X0 + 6} y={Y1 - 4} width={176} height={40} rx={4} fill="#ffffff" stroke={LINE} strokeWidth={1} />
                <text x={X0 + 12} y={Y1 + 10} fontSize={9} fill={INK}>{`기록 170 × 1만 = ${fmt(RECORDED)}`}</text>
                <text x={X0 + 12} y={Y1 + 26} fontSize={9} fill={INK}>{`실제(가정) 170 × 9,900 = ${fmt(ACTUAL)}`}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
