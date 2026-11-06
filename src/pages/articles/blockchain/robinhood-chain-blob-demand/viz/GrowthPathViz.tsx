import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reading-checklist — 시작 평균 5, 다섯 달 뒤 10이라는 두 끝점의 환산.
 * 배율 = 2^(1/5) ≈ 1.149 → 월 14.9%. 중간값은 환산이며 관측이 아닙니다.
 */
const START = 5;
const END = 10;
const MONTHS = 5;
const RATE = (END / START) ** (1 / MONTHS);
const SMOOTH = Array.from({ length: MONTHS + 1 }, (_, month) => START * RATE ** month);
const OTHER = [5, 5, 5, 5, 5, 10] as const;

const SCENES = [
  { label: "두 끝점만 있습니다", summary: "5 → 다섯 달 → 10", note: "시작 평균 5와 다섯 달 뒤 10이라는 두 수만 가정했습니다. 그 사이 달의 값은 이 가정에 없습니다." },
  { label: "같은 배율 다섯 번", summary: "약 1.149⁵ ≈ 2 → 월 약 14.9%", note: "다섯 번 곱해 2배가 되는 배율이 2의 5제곱근, 약 1.149입니다. 1을 빼면 약 14.9%입니다. 점선 막대는 이 환산으로 계산한 값이지 관측값이 아닙니다." },
  { label: "다른 경로도 같은 값", summary: "끝점이 같으면 약 14.9%", note: "넉 달 뒤까지 5에 머물다 다섯째 달에 10이 되어도(가정) 두 끝점으로 환산한 값은 약 14.9%로 같습니다. 그래서 이 수는 중간 변동이나 다음 다섯 달의 수요를 말해 주지 않습니다." },
] as const;

const W = 360;
const H = 184;
const BASE = 150;
const TOP = 22;
const LEFT = 12;
const BAR = 38;
const GAP = (W - 2 * LEFT - (MONTHS + 1) * BAR) / MONTHS;
const bx = (month: number) => LEFT + month * (BAR + GAP);
const bh = (value: number) => (value / END) * (BASE - TOP);

export default function GrowthPathViz() {
  return (
    <SceneShell
      eyebrow="복리 환산"
      title="두 끝점으로 구한 월 14.9%가 말하는 것"
      description="막대 높이는 블록당 평균 blob 개수입니다. 5와 10은 모두 글이 가정한 값이고 날짜별 원자료가 아닙니다."
      ariaLabel="평균 5에서 10까지의 두 끝점과 월 복리 환산, 끝점이 같은 다른 경로의 비교"
      scenes={SCENES}
      render={(active) => {
        const values = active === 2 ? OTHER : SMOOTH;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {values.map((value, month) => {
              const end = month === 0 || month === MONTHS;
              const hidden = active === 0 && !end;
              return (
                <g key={month}>
                  {hidden ? (
                    <text x={bx(month) + BAR / 2} y={BASE - 8} textAnchor="middle" fontSize={15} fontWeight={700} fill="#94a3b8">?</text>
                  ) : (
                    <>
                      <rect
                        x={bx(month)}
                        y={BASE - bh(value)}
                        width={BAR}
                        height={bh(value)}
                        rx={2}
                        fill={end ? "#2563eb" : "none"}
                        stroke={end ? "none" : "#64748b"}
                        strokeWidth={1}
                        strokeDasharray={end ? undefined : "4 3"}
                      />
                      <text x={bx(month) + BAR / 2} y={BASE - bh(value) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
                        {Number.isInteger(value) || end ? Math.round(value) : value.toFixed(1)}
                      </text>
                    </>
                  )}
                  {active === 1 && month < MONTHS && (
                    <text x={bx(month) + BAR + GAP / 2} y={BASE + 28} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#2563eb">×1.149</text>
                  )}
                  <text x={bx(month) + BAR / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fill="#64748b">{month === 0 ? "시작" : `${month}달`}</text>
                </g>
              );
            })}
            <line x1={LEFT} x2={W - LEFT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
