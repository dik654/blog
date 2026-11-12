import SceneShell from "./SceneShell";

/**
 * 본문 대응: #maximum — 독립적인 두 후보가 각각 실제 평균 0.70에서 ±0.04로 같은 확률로 흔들린다(가정).
 * 네 경우의 최고값 0.66·0.74·0.74·0.74 → 평균 (0.66+3×0.74)/4 = 0.72.
 * 완전히 같은 잡음이면 (0.66,0.66)·(0.74,0.74) 두 경우뿐 → (0.66+0.74)/2 = 0.70, 차이 0.
 */
const LOW = 0.66;
const HIGH = 0.74;
const VALUES: readonly number[] = [LOW, HIGH];
const CASES = VALUES.flatMap((first) => VALUES.map((second) => ({ first, second, max: Math.max(first, second) })));
const MEAN_MAX = CASES.reduce<number>((sum, item) => sum + item.max, 0) / CASES.length;
const SAME_MEAN = (LOW + HIGH) / 2;

const SCENES = [
  { label: "네 경우", summary: "각 1/4 · 독립 (가정)", note: "두 후보 모두 실제 평균은 0.70이고, 각각 0.66 또는 0.74가 같은 확률로 나옵니다. 두 후보가 독립이면 네 조합이 1/4씩 나옵니다." },
  { label: "각 경우의 최고값", summary: "0.66 한 번 · 0.74 세 번", note: "둘 다 낮은 한 칸만 최고값이 0.66입니다. 나머지 세 칸은 둘 중 하나라도 0.74라서 최고값이 0.74입니다." },
  { label: "최고값의 평균", summary: `(0.66 + 3×0.74) ÷ 4 = ${MEAN_MAX.toFixed(2)}`, note: "네 칸을 평균하면 0.72로 실제 평균 0.70보다 0.02 높습니다. 평균이 0인 흔들림이어도 최고값만 남기면 평균이 위로 이동합니다." },
  { label: "한 번의 시행", summary: "둘 다 0.66 → 0.66 < 0.70", note: "0.02는 반복해서 최고값을 고를 때의 평균 효과입니다. 둘 다 0.66인 한 시행에서는 실제 평균보다 낮게 보고하므로, 매번 과대평가한다는 뜻은 아닙니다." },
  { label: "완전히 같은 잡음이면", summary: `(0.66 + 0.74) ÷ 2 = ${SAME_MEAN.toFixed(2)} · 차이 0`, note: "두 후보가 완전히 같은 잡음으로 움직이면 엇갈린 두 칸은 일어나지 않습니다. 남은 두 칸이 1/2씩이라 최고값 평균은 0.70이고 차이가 0입니다." },
];

const W = 360;
const H = 236;
const GRID_X = 92;
const GRID_Y = 34;
const CELL_W = 124;
const CELL_H = 64;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const INK = "#1e293b";

// 아래 수직선 0.64..0.76
const AX_L = 40;
const AX_R = W - 20;
const AX_Y = 206;
const ax = (value: number) => AX_L + ((value - 0.64) / (0.76 - 0.64)) * (AX_R - AX_L);

export default function FourCasesViz() {
  return (
    <SceneShell
      eyebrow="최고값의 평균"
      title="두 후보의 네 경우를 세면 최고값 평균은 0.72입니다"
      description="칸 하나가 한 경우입니다. 가로는 후보 2, 세로는 후보 1의 관측값이며 7절의 작은 확률 모형을 그대로 씁니다(가정)."
      ariaLabel="두 독립 후보의 네 경우와 최고값, 그 평균 0.72, 한 시행과 같은 잡음의 경우"
      scenes={SCENES}
      render={(active) => {
        const meanShown = active === 4 ? SAME_MEAN : MEAN_MAX;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GRID_X + CELL_W} y={14} textAnchor="middle" fontSize={12} fill={MUTED}>후보 2</text>
            {VALUES.map((value, col) => (
              <text key={`c${value}`} x={GRID_X + col * CELL_W + CELL_W / 2} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>{value.toFixed(2)}</text>
            ))}
            <text x={10} y={GRID_Y + CELL_H + 4} fontSize={12} fill={MUTED}>후보 1</text>
            {VALUES.map((value, row) => (
              <text key={`r${value}`} x={GRID_X - 8} y={GRID_Y + row * CELL_H + CELL_H / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={INK}>{value.toFixed(2)}</text>
            ))}
            {CASES.map((item, index) => {
              const row = Math.floor(index / 2);
              const col = index % 2;
              const cellX = GRID_X + col * CELL_W;
              const cellY = GRID_Y + row * CELL_H;
              const offDiagonal = row !== col;
              const impossible = active === 4 && offDiagonal;
              const focused = active === 3 && index === 0;
              const faded = impossible || (active === 3 && index !== 0);
              const highlightMax = active >= 1;
              const maxColor = item.max === LOW ? SLATE : AMBER;
              return (
                <g key={index} opacity={faded ? 0.3 : 1}>
                  <rect x={cellX + 2} y={cellY + 2} width={CELL_W - 4} height={CELL_H - 4} rx={6} fill="none" stroke={focused ? BLUE : LINE} strokeWidth={focused ? 1.25 : 1} strokeDasharray={impossible ? "4 3" : undefined} />
                  <text x={cellX + CELL_W / 2} y={cellY + 24} textAnchor="middle" fontSize={12} fill={MUTED}>({item.first.toFixed(2)}, {item.second.toFixed(2)})</text>
                  {impossible ? (
                    <text x={cellX + CELL_W / 2} y={cellY + 46} textAnchor="middle" fontSize={12} fill={MUTED}>일어나지 않음</text>
                  ) : highlightMax ? (
                    <text x={cellX + CELL_W / 2} y={cellY + 46} textAnchor="middle" fontSize={14} fontWeight={700} fill={maxColor}>최고 {item.max.toFixed(2)}</text>
                  ) : (
                    <text x={cellX + CELL_W / 2} y={cellY + 46} textAnchor="middle" fontSize={12} fill={MUTED}>확률 1/4</text>
                  )}
                </g>
              );
            })}

            <line x1={AX_L} x2={AX_R} y1={AX_Y} y2={AX_Y} stroke={LINE} strokeWidth={1} />
            {[0.64, 0.66, 0.68, 0.7, 0.72, 0.74, 0.76].map((tick) => (
              <text key={tick} x={ax(tick)} y={AX_Y + 16} textAnchor="middle" fontSize={11} fill={MUTED}>{tick.toFixed(2)}</text>
            ))}
            <line x1={ax(0.7)} x2={ax(0.7)} y1={AX_Y - 22} y2={AX_Y} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
            <text x={ax(0.7) - 4} y={AX_Y - 24} textAnchor="end" fontSize={11} fill={MUTED}>실제 0.70</text>
            {(active === 2 || active === 4) && (
              <g>
                <circle cx={ax(meanShown)} cy={AX_Y - 8} r={5} fill={BLUE} />
                <text x={ax(meanShown) + 8} y={AX_Y - 20} fontSize={11} fontWeight={700} fill={BLUE}>최고값 평균 {meanShown.toFixed(2)}</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <circle cx={ax(LOW)} cy={AX_Y - 8} r={5} fill={BLUE} />
                <text x={ax(LOW) - 8} y={AX_Y - 20} fontSize={11} fontWeight={700} textAnchor="end" fill={BLUE}>이번 보고 0.66</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
