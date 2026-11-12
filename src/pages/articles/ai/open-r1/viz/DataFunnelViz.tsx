import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-pipeline "Dataset 숫자는 generation 수와 unique problem 수를 구분한다".
 * OpenR1-Math-220k update: 약 40만 problem × 두 답 = 80만 trace → correctness filtering → 약 22만 problem의 trace.
 * 칸 하나 = problem 1만 개. 22/40 = 55%의 problem이 남음. 남은 trace 수는 글에 없어 그리지 않음.
 */
const PROBLEMS = 40;
const KEPT = 22;
const ANSWERS = 2;
const KEPT_RATE = Math.round((KEPT / PROBLEMS) * 100);

const SCENES = [
  {
    label: "Source problem",
    summary: "약 40만 problem",
    note: "칸 하나가 problem 1만 개입니다. 출발점은 약 40만 problem입니다.",
  },
  {
    label: "Generation",
    summary: `× ${ANSWERS}답 = 80만 trace`,
    note: "Problem마다 답을 두 개씩 생성해 trace가 80만 개가 됩니다. Sampling budget은 이 숫자입니다.",
  },
  {
    label: "Correctness filtering",
    summary: `약 22만 problem (${KEPT_RATE}%)`,
    note: `Correctness filtering 뒤 trace가 남은 problem은 약 22만, 출발 problem의 약 ${KEPT_RATE}%입니다. 남은 problem마다 trace가 몇 개인지는 이 숫자만으로 알 수 없습니다. 그래서 "220k trace를 생성했다"로 줄이면 80만이라는 생성 수와 선별률이 사라집니다.`,
  },
] as const;

const W = 360;
const H = 176;
const COLS = 10;
const CELL_W = 32;
const CELL_H = 26;
const X0 = (W - COLS * CELL_W) / 2;
const Y0 = 24;

export default function DataFunnelViz() {
  return (
    <SceneShell
      eyebrow="생성 수와 남은 수"
      title="22만은 생성한 trace 수가 아니라 남은 problem 수입니다"
      description="OpenR1-Math-220k update의 숫자를 problem 단위 칸으로 셉니다. 어느 칸이 남았는지의 위치는 그림을 위한 배치입니다."
      ariaLabel="40만 problem에서 80만 trace를 생성하고 약 22만 problem이 남는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <text x={X0} y={14} fontSize={12} fill="#64748b">칸 하나 = problem 1만 개</text>
          {Array.from({ length: PROBLEMS }, (_, i) => {
            const x = X0 + (i % COLS) * CELL_W;
            const y = Y0 + Math.floor(i / COLS) * CELL_H;
            const kept = i < KEPT;
            const dim = active === 2 && !kept;
            return (
              <g key={i} opacity={dim ? 0.3 : 1}>
                <rect x={x + 1} y={y + 1} width={CELL_W - 2} height={CELL_H - 2} rx={2} fill="#ffffff" fillOpacity={0} stroke="#94a3b8" strokeWidth={1} />
                {active === 2 && kept && (
                  <rect x={x + 5} y={y + 7} width={22} height={12} fill="#2563eb" />
                )}
                {active === 1 &&
                  [0, 1].map((a) => (
                    <rect
                      key={a}
                      x={x + 5 + a * 12}
                      y={y + 7}
                      width={10}
                      height={12}
                      fill="#d97706"
                    />
                  ))}
                {active === 2 && !kept && (
                  <line x1={x + 4} x2={x + CELL_W - 4} y1={y + CELL_H - 4} y2={y + 4} stroke="#64748b" strokeWidth={1} />
                )}
              </g>
            );
          })}
          <text x={X0} y={Y0 + 4 * CELL_H + 22} fontSize={13} fontWeight={700} fill="#334155">
            {active === 0 ? "problem 40칸 = 약 40만" : active === 1 ? "작은 막대 80개 = trace 80만" : `trace가 남은 problem 22칸 = 약 22만 (${KEPT_RATE}%)`}
          </text>
          {active === 2 && (
            <text x={X0} y={Y0 + 4 * CELL_H + 40} fontSize={12} fill="#64748b">
              남은 칸 안의 trace 수는 글에 없음
            </text>
          )}
        </svg>
      )}
    />
  );
}
