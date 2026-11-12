import RcGrid, { type GridCol, type GridRow } from "./RcGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #delay·#source — 같은 다섯 칸을 저항 기준(60+14)과 용량 위치 기준(25+49)으로 묶는다.
 * 칸 = 저항 × 그 저항을 거쳐 충전되는 용량. 500×50=25, 500×50=25, 500×20=10, 200×50=10, 200×20=4 (ps).
 * 선 저항 × 시작 쪽 50 fF 칸은 없다(시작 쪽 용량은 선 저항을 거치지 않음).
 */
const ROWS: readonly GridRow[] = [
  { label: "출력 500 Ω", ohm: 500 },
  { label: "선 200 Ω", ohm: 200 },
];
const COLS: readonly GridCol[] = [
  { label: "시작 50 fF", ff: 50 },
  { label: "끝 50 fF", ff: 50 },
  { label: "입력 20 fF", ff: 20 },
];

const BLUE = "#2563eb";
const AMBER = "#d97706";
const TEXT = "#64748b";

const value = (row: number, col: number) => (row === 1 && col === 0 ? null : (ROWS[row].ohm * COLS[col].ff) / 1000);

const SCENES = [
  { label: "칸 하나가 저항 × 용량", summary: "25 · 25 · 10 · 10 · 4 ps", note: "행 높이는 저항, 열 너비는 용량에 비례합니다. 칸의 넓이가 곧 시간이고, 1 Ω·1 fF = 1 fs입니다. 선 저항과 시작 쪽 용량이 만나는 칸은 비어 있습니다." },
  { label: "행으로 묶기 · 8절", summary: "60 + 14 = 74 ps", note: "저항마다 그 뒤에서 충전되는 용량을 모읍니다. 출력 저항 행은 120 fF 전체로 60 ps, 선 저항 행은 70 fF로 14 ps입니다." },
  { label: "열로 묶기 · 원문 식", summary: "25 + 49 = 74 ps", note: "용량의 위치마다 거치는 저항을 모읍니다. 시작 쪽은 500 Ω만 거쳐 25 ps, 끝 쪽과 입력 70 fF는 700 Ω을 거쳐 49 ps입니다. 같은 다섯 칸이므로 합이 같습니다." },
] as const;

export default function CountOrderViz() {
  return (
    <SceneShell
      eyebrow="같은 회로, 두 가지 세는 순서"
      title="60 + 14와 25 + 49는 같은 다섯 칸을 다르게 묶은 것입니다"
      description="3절의 가정 수치(출력 500 Ω, 선 200 Ω·100 fF, 입력 20 fF)를 그대로 씁니다."
      ariaLabel="저항과 용량의 칸 그림을 행과 열로 묶어 74 피코초를 두 방법으로 세기"
      scenes={SCENES}
      render={(active) => {
        const color = (row: number, col: number) => {
          if (active === 1) return row === 0 ? BLUE : AMBER;
          if (active === 2) return col === 0 ? BLUE : AMBER;
          return BLUE;
        };
        return (
          <div className="w-full min-w-0 overflow-x-auto">
            <svg viewBox="0 0 420 222" className="mx-auto h-auto w-full min-w-[20rem] max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <RcGrid
                x0={86}
                y0={40}
                pxPerFf={2}
                pxPerOhm={0.2}
                rows={ROWS}
                cols={COLS}
                cellText={(row, col) => {
                  const v = value(row, col);
                  return v === null ? null : `${v}`;
                }}
                cellColor={color}
                overlay={({ xs, ys }) => (
                  <g>
                    {active === 1 &&
                      ROWS.map((row, i) => (
                        <text key={row.label} x={xs[3] + 10} y={(ys[i] + ys[i + 1]) / 2 + 4} fontSize={14} fontWeight={700} fill={i === 0 ? BLUE : AMBER}>
                          = {i === 0 ? 60 : 14} ps
                        </text>
                      ))}
                    {active === 2 && (
                      <g>
                        <text x={(xs[0] + xs[1]) / 2} y={ys[2] + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>= 25 ps</text>
                        <line x1={xs[1] + 4} x2={xs[3] - 4} y1={ys[2] + 8} y2={ys[2] + 8} stroke={AMBER} strokeWidth={1} />
                        <text x={(xs[1] + xs[3]) / 2} y={ys[2] + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={AMBER}>= 49 ps</text>
                      </g>
                    )}
                    {active === 0 && (
                      <text x={xs[0]} y={ys[2] + 22} fontSize={13} fill={TEXT}>칸 다섯 개의 넓이 합 = 74 ps</text>
                    )}
                  </g>
                )}
              />
            </svg>
          </div>
        );
      }}
    />
  );
}
