import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview ExplainedFormula — origin을 stride S만큼 옮기면 다음 sample이 생기지만
 * 겹치는 window는 독립 관측을 같은 비율로 늘리지 않는다.
 * L=6, H=3은 본문 값. S=1과 S=3은 설명용 가정.
 * S=1, sample 3개: input 칸 18개, 서로 다른 input 관측 t−5~t+2 = 8개.
 */
const L = 6;
const H = 3;
const COLS = 12;
const T_INDEX = 5;
const LABELS = Array.from({ length: COLS }, (_, i) => {
  const offset = i - T_INDEX;
  return offset === 0 ? "t" : offset < 0 ? `t−${-offset}` : `t+${offset}`;
});

const SCENES = [
  {
    label: "Sample 1",
    summary: "input 6칸 · target 3칸",
    origins: [0],
    note: "Forecast origin t에서 t−5~t 여섯 step이 input, t+1~t+3 세 step이 target입니다. L=6, H=3입니다.",
  },
  {
    label: "S=1로 한 칸 이동 (가정)",
    summary: "input 6칸 중 5칸이 sample 1과 같음",
    origins: [0, 1],
    note: "Origin을 한 step 옮기면 sample 2가 생깁니다. input 여섯 칸 중 t−4~t 다섯 칸은 sample 1과 같은 관측이고, 새로 들어온 것은 t+1 하나입니다. Sample 1의 target이던 t+1이 sample 2에서는 origin 값이라 input에 들어갑니다.",
  },
  {
    label: "Sample 3개",
    summary: "input 칸 18개 · 서로 다른 관측 8개",
    origins: [0, 1, 2],
    note: "Sample 3개의 input 칸은 6×3=18개지만 서로 다른 관측은 t−5~t+2 여덟 개뿐입니다. 겹치는 window는 sample 수를 늘리지만 독립 관측을 같은 비율로 늘리지는 않습니다.",
  },
  {
    label: "S=3으로 이동 (가정)",
    summary: "sample 1과 겹치는 input 3칸",
    origins: [0, 3],
    note: "S=3이면 sample 2의 origin은 t+3이고 input은 t−2~t+3입니다. Sample 1과 겹치는 input은 t−2~t 세 칸으로 줄고, 같은 길이의 구간에서 만들어지는 sample 수도 줄어듭니다.",
  },
] as const;

const W = 360;
const LEFT = 62;
const CELL = 22;
const GAP = 2;
const TOP = 22;
const ROW_H = 30;
const ROWS = 3;
const SVG_H = TOP + ROWS * ROW_H + 6;
const cx = (col: number) => LEFT + col * (CELL + GAP);

export default function WindowStrideViz() {
  return (
    <SceneShell
      eyebrow="Origin 이동과 겹침"
      title="Origin을 옮기면 sample은 늘지만 관측은 겹칩니다"
      description="한 줄이 sample 하나입니다. 파란 칸이 input(look-back L=6), 주황 칸이 target(horizon H=3)이고, 연한 파랑은 sample 1과 같은 관측을 다시 쓴 input 칸입니다. 세로선은 각 sample의 origin입니다. stride S는 origin을 한 번에 옮기는 step 수이며, 여기서 고른 S 값은 설명용 가정입니다."
      ariaLabel="forecast origin을 stride만큼 옮길 때 sample끼리 input이 겹치는 모습"
      scenes={SCENES}
      render={(active) => {
        const origins: readonly number[] = SCENES[active].origins;
        return (
          <svg viewBox={`0 0 ${W} ${SVG_H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LABELS.map((label, col) => (
              <text key={label} x={cx(col) + CELL / 2} y={TOP - 8} textAnchor="middle" fontSize={10} fill={col === T_INDEX ? "#2563eb" : "#64748b"} fontWeight={col === T_INDEX ? 700 : 400}>
                {label}
              </text>
            ))}
            {Array.from({ length: ROWS }, (_, row) => {
              const origin = origins[row];
              const y = TOP + row * ROW_H;
              if (origin === undefined) {
                return (
                  <g key={row}>
                    <text x={4} y={y + 15} fontSize={10} fill="#94a3b8">sample {row + 1}</text>
                    <rect x={cx(0)} y={y} width={COLS * (CELL + GAP) - GAP} height={CELL} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                  </g>
                );
              }
              const originCol = origin + T_INDEX;
              return (
                <g key={row}>
                  <text x={4} y={y + 15} fontSize={10} fontWeight={700} fill="#475569">sample {row + 1}</text>
                  {LABELS.map((label, col) => {
                    const isInput = col > originCol - L && col <= originCol;
                    const isTarget = col > originCol && col <= originCol + H;
                    const shared = row > 0 && isInput && col > origins[0] + T_INDEX - L && col <= origins[0] + T_INDEX;
                    return (
                      <rect
                        key={label}
                        x={cx(col)}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={3}
                        fill={isInput ? "#2563eb" : isTarget ? "#d97706" : "none"}
                        fillOpacity={isInput ? (shared ? 0.35 : 0.85) : isTarget ? 0.8 : 0}
                        stroke={isInput || isTarget ? "none" : "#e2e8f0"}
                        strokeWidth={1}
                      />
                    );
                  })}
                  <line x1={cx(originCol) + CELL + GAP / 2} x2={cx(originCol) + CELL + GAP / 2} y1={y - 3} y2={y + CELL + 3} stroke="#0f172a" strokeWidth={1} />
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
