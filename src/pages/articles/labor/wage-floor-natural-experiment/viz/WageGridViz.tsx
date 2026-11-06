import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 임금 합계를 칸 수로 센다. 칸 하나 = 1시간 × 1달러.
 * 3×6=18 → 4×7=28, 차이 10 = 새 시간 7 + 앞 세 시간 3. 최저시급 9에서는 27 → 36, 차이 9 = 새 시간 9.
 */
const CELL_W = 30;
const CELL_H = 15;
const BASE_Y = 166;
const LEFT_X = 34;
const RIGHT_X = 200;

const SCENES = [
  { label: "3시간 · 시급 6", summary: "3 × 6 = 18달러", note: "가로는 노동시간, 세로는 시급입니다. 칸 수를 세면 임금 합계입니다. 3시간을 구하려면 시급 6을 제시해야 한다고 가정합니다." },
  { label: "4시간 · 시급 7", summary: "4 × 7 = 28달러", note: "4시간을 구하려면 시급 7을 제시해야 한다고 가정합니다. 같은 하루에 고르는 두 계획이라 어제 준 급여를 다시 정산하는 일이 아닙니다." },
  { label: "늘어난 칸을 나눕니다", summary: "7 + 3 = 10 > 수입 +9.5", note: "새 시간의 세로줄 7칸에 앞 세 시간의 맨 윗줄 3칸이 더 생겨 10칸입니다. 시급 7만 보면 놓치는 칸이 3칸입니다. 수입 증가 9.5보다 커서 이익이 0.5 줄어듭니다." },
  { label: "최저시급 9를 적용하면", summary: "9 + 0 = 9 < 수입 +9.5", note: "두 계획의 시급이 모두 9여서 앞 세 시간의 칸 수가 같습니다. 늘어나는 것은 새 시간의 세로줄 9칸뿐입니다. 시급은 높아졌는데 추가 비용은 10에서 9로 작아집니다. 이익 수준은 4시간 계획도 16에서 8로 줄어듭니다." },
] as const;

function Grid({ x, hours, wage, base, title, showNew }: { x: number; hours: number; wage: number; base: number; title: string; showNew: boolean }) {
  return (
    <g>
      <text x={x + 60} y={12} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{title}</text>
      {Array.from({ length: hours }, (_, col) =>
        Array.from({ length: wage }, (_, row) => {
          const isNew = showNew && col === hours - 1;
          const isStrip = showNew && !isNew && row >= base;
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={x + col * CELL_W + 1}
                y={BASE_Y - (row + 1) * CELL_H + 1}
                width={CELL_W - 2}
                height={CELL_H - 2}
                fill={isNew ? "#2563eb" : isStrip ? "#d97706" : "#94a3b8"}
                opacity={isNew || isStrip ? 0.85 : 0.4}
              />
              {isStrip && (
                <text x={x + col * CELL_W + CELL_W / 2} y={BASE_Y - (row + 1) * CELL_H + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">+1</text>
              )}
            </g>
          );
        }),
      )}
      <line x1={x} x2={x + 4 * CELL_W} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
      {[1, 2, 3, 4].map((hour) => (
        <text key={hour} x={x + (hour - 1) * CELL_W + CELL_W / 2} y={BASE_Y + 14} textAnchor="middle" fontSize={11} fill="#64748b">{hour}</text>
      ))}
    </g>
  );
}

export default function WageGridViz() {
  return (
    <SceneShell
      eyebrow="임금 합계를 칸으로"
      title="시급이 바뀌면 새 시간 옆의 칸도 함께 늘어납니다"
      description="칸 하나가 1시간 × 1달러입니다. 아래 숫자는 몇 번째 시간인지입니다. 숫자는 이 글의 설명용 가게입니다(가정)."
      ariaLabel="3시간 계획과 4시간 계획의 임금 합계를 칸 수로 비교"
      scenes={SCENES}
      render={(active) => {
        const floor = active === 3;
        const leftWage = floor ? 9 : 6;
        const rightWage = floor ? 9 : 7;
        const split = active >= 2;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Grid x={LEFT_X} hours={3} wage={leftWage} base={leftWage} showNew={false} title={`3시간 × ${leftWage} = ${3 * leftWage}`} />
            {active >= 1 && <Grid x={RIGHT_X} hours={4} wage={rightWage} base={leftWage} showNew={split} title={`4시간 × ${rightWage} = ${4 * rightWage}`} />}
            {split && (
              <text x={180} y={204} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
                <tspan fill="#2563eb">새 시간 {rightWage}칸</tspan>
                <tspan> + </tspan>
                <tspan fill="#b45309">앞 세 시간 {floor ? 0 : 3}칸</tspan>
                <tspan> = {4 * rightWage - 3 * leftWage}칸</tspan>
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
