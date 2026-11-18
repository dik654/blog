import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schwartz-zippel — F₇에서 R=x²−1은 x=1·6에서만 0(2/7),
 * F₇²에서 R=xy는 x=0인 7쌍과 y=0인 7쌍에서 (0,0)을 한 번만 세 13/49, 상한 2/7=14/49.
 * 위 띠 = 일변수 일곱 위치, 아래 격자 = 두 변수 49위치. 칸 안 숫자는 R의 값(mod 7).
 */
const P = 7;
const W = 340;
const ROW_Y = 26;
const ROW_CELL = 34;
const ROW_X0 = (W - P * ROW_CELL) / 2;
const GRID_CELL = 22;
const GRID_X0 = (W - P * GRID_CELL) / 2 + 8;
const GRID_Y0 = 104;
const H = GRID_Y0 + P * GRID_CELL + 14;
const VALUES = Array.from({ length: P }, (_, x) => x);
const oneVar = (x: number) => (x * x + P - 1) % P;
const ZEROS_1 = VALUES.filter((x) => oneVar(x) === 0).length; // 2
const ZEROS_2 = VALUES.reduce<number>((sum, x) => sum + VALUES.filter((y) => (x * y) % P === 0).length, 0); // 13

const SCENES = [
  {
    label: "x²−1을 일곱 위치에서",
    summary: `0인 위치 ${ZEROS_1}개 → ${ZEROS_1}/7`,
    note: "위치 1과 6에서만 x²−1이 0입니다. 일곱 위치를 같은 확률로 고르면 거짓 주장이 통과할 확률은 2/7입니다. 2차식이라 근은 두 개를 넘지 못합니다.",
  },
  {
    label: "xy를 7×7 위치에서",
    summary: `0인 칸 ${ZEROS_2}개 → ${ZEROS_2}/49`,
    note: "두 좌표를 각각 0~6에서 고르면 49칸입니다. x=0인 줄 7칸과 y=0인 줄 7칸이 0이고, 두 줄이 만나는 (0,0)(주황 테두리)은 한 번만 셉니다. 7+7−1=13칸입니다.",
  },
  {
    label: "총차수 상한과 비교",
    summary: `${ZEROS_2}/49 ≤ 2/7 = 14/49`,
    note: "xy의 총차수는 2이므로 상한은 2/7=14/49이고 실제 13/49는 그보다 작습니다. R을 먼저 고정하고 좌표를 독립·균등하게 고를 때의 보장입니다.",
  },
] as const;

export default function ZeroCountViz() {
  return (
    <SceneShell
      eyebrow="거짓 통과를 칸으로 세기"
      title="차이식이 0이 되는 칸만 거짓 주장이 통과합니다"
      description="칸 안 숫자는 두 규칙의 차이 R을 그 위치에 넣은 값(mod 7)입니다. R이 0이 되는 위치를 근이라고 부르며, 파란 칸이 근입니다. 무작위로 고른 위치가 파란 칸이면 다른 두 규칙이 같아 보입니다."
      ariaLabel="F7에서 x제곱 빼기 1과 xy가 0이 되는 위치의 개수"
      scenes={SCENES}
      render={(active) => {
        const rowOn = active === 0;
        const gridOn = active > 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={rowOn ? 1 : 0.35}>
              <text x={ROW_X0} y={ROW_Y - 8} fontSize={11} fill="#64748b">R = x²−1, x = 0…6</text>
              {VALUES.map((x) => {
                const zero = oneVar(x) === 0;
                return (
                  <g key={x}>
                    <rect x={ROW_X0 + x * ROW_CELL} y={ROW_Y} width={ROW_CELL - 4} height={30} rx={6} fill={zero ? "#dbeafe" : "#ffffff"} stroke={zero ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                    <text x={ROW_X0 + x * ROW_CELL + (ROW_CELL - 4) / 2} y={ROW_Y + 20} textAnchor="middle" fontSize={13} fontWeight={zero ? 700 : 400} fill="#0f172a">{oneVar(x)}</text>
                    <text x={ROW_X0 + x * ROW_CELL + (ROW_CELL - 4) / 2} y={ROW_Y + 44} textAnchor="middle" fontSize={10} fill="#64748b">{`x=${x}`}</text>
                  </g>
                );
              })}
            </g>
            <g opacity={gridOn ? 1 : 0.35}>
              <text x={GRID_X0} y={GRID_Y0 - 10} fontSize={11} fill="#64748b">R = xy (가로 x, 세로 y)</text>
              {VALUES.map((y) => (
                <text key={`y${y}`} x={GRID_X0 - 6} y={GRID_Y0 + y * GRID_CELL + 15} textAnchor="end" fontSize={9} fill="#64748b">{y}</text>
              ))}
              {VALUES.map((x) => (
                <text key={`x${x}`} x={GRID_X0 + x * GRID_CELL + (GRID_CELL - 2) / 2} y={GRID_Y0 + P * GRID_CELL + 9} textAnchor="middle" fontSize={9} fill="#64748b">{x}</text>
              ))}
              {VALUES.map((y) =>
                VALUES.map((x) => {
                  const v = (x * y) % P;
                  const zero = v === 0;
                  const corner = active === 1 && x === 0 && y === 0;
                  return (
                    <g key={`${x}-${y}`}>
                      <rect x={GRID_X0 + x * GRID_CELL} y={GRID_Y0 + y * GRID_CELL} width={GRID_CELL - 2} height={GRID_CELL - 2} rx={3} fill={zero ? "#dbeafe" : "#ffffff"} stroke={corner ? "#d97706" : zero ? "#2563eb" : "#e2e8f0"} strokeWidth={corner ? 1.25 : 1} />
                      <text x={GRID_X0 + x * GRID_CELL + (GRID_CELL - 2) / 2} y={GRID_Y0 + y * GRID_CELL + 14} textAnchor="middle" fontSize={9} fontWeight={zero ? 700 : 400} fill={zero ? "#1d4ed8" : "#94a3b8"}>{v}</text>
                    </g>
                  );
                }),
              )}
            </g>
          </svg>
        );
      }}
    />
  );
}
