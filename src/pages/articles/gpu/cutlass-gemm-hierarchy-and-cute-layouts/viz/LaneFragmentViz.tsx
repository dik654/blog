import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tile-hierarchy — m16n8k16 의 C fragment 16×8 을 32 lane 이 4개씩 나눠 드는 자리.
 * lane = 4·(행 mod 8) + 열 쌍. lane 5 → 몫 1(행 1), 나머지 1(열 2·3), 그리고 행 9 의 열 2·3.
 */
const ROWS = 16;
const COLS = 8;
const CELL_W = 34;
const CELL_H = 17;
const X0 = 40;
const Y0 = 28;
const LANE = 5;

const laneOf = (r: number, c: number) => 4 * (r % 8) + Math.floor(c / 2);

const SCENES = [
  { label: "몫 → 행", summary: "5 ÷ 4 = 1 … 1", focus: "row", note: "칸 안 숫자는 그 원소를 드는 lane 번호입니다. Lane 번호를 4로 나눈 몫이 행을 정하므로 lane 4·5·6·7은 모두 행 1을 나눠 듭니다." },
  { label: "나머지 → 열 쌍", summary: "나머지 1 → 열 2·3", focus: "pair", note: "나머지는 열 두 칸짜리 쌍을 고릅니다. 나머지 0이 열 0·1, 1이 열 2·3, 2가 열 4·5, 3이 열 6·7입니다. Lane 5는 행 1의 열 2·3을 듭니다." },
  { label: "8행 아래 한 번 더", summary: "(1,2) (1,3) (9,2) (9,3)", focus: "lane", note: "본문의 lane 5처럼 같은 열 쌍을 8행 아래인 행 9에서 한 번 더 듭니다. 그래서 lane 하나의 값 4개가 서로 붙어 있지 않고 두 행에 흩어집니다." },
  { label: "32 lane × 4 = 128", summary: "16 × 8 = 128칸", focus: "all", note: "같은 규칙을 32 lane 모두에 적용하면 128칸이 빠짐없이 한 번씩 덮입니다. 이 배치는 명령이 고정하며, CuTe는 이것을 thread-value layout으로 적습니다." },
] as const;

export default function LaneFragmentViz() {
  return (
    <SceneShell
      eyebrow="C fragment"
      title="Lane 하나가 16×8 결과에서 쥐는 네 칸"
      description="mma.sync.m16n8k16의 출력 C는 16행 × 8열 fp32입니다. 칸마다 그 원소를 register에 든 lane 번호를 적었습니다."
      ariaLabel="16행 8열 C fragment에서 lane 5가 행 1과 행 9의 열 2와 3을 드는 배치"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        const hit = (r: number, c: number) => {
          const lane = laneOf(r, c);
          if (focus === "row") return r === 1;
          if (focus === "pair") return r === 1 && lane === LANE;
          if (focus === "lane") return lane === LANE;
          return true;
        };
        const strong = (r: number, c: number) => focus !== "row" && focus !== "all" && laneOf(r, c) === LANE;
        return (
          <svg viewBox={`0 0 ${X0 + COLS * CELL_W + 12} ${Y0 + ROWS * CELL_H + 30}`} className="mx-auto block w-full max-w-[26rem]" role="img" aria-label="C fragment lane 배치">
            {Array.from({ length: COLS }, (_, c) => (
              <text key={`c${c}`} x={X0 + c * CELL_W + CELL_W / 2} y={Y0 - 8} textAnchor="middle" fontSize={10} className="fill-muted-foreground">
                열{c}
              </text>
            ))}
            {Array.from({ length: ROWS }, (_, r) => (
              <text key={`r${r}`} x={X0 - 6} y={Y0 + r * CELL_H + 12} textAnchor="end" fontSize={10} className="fill-muted-foreground">
                행{r}
              </text>
            ))}
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const on = hit(r, c);
                const s = strong(r, c);
                const color = s ? "#dc2626" : "#2563eb";
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={X0 + c * CELL_W + 1}
                      y={Y0 + r * CELL_H + 1}
                      width={CELL_W - 2}
                      height={CELL_H - 2}
                      rx={2}
                      fill={on ? color : "#94a3b8"}
                      fillOpacity={on ? (s ? 0.3 : 0.16) : 0.08}
                      stroke={s ? "#dc2626" : "#94a3b8"}
                      strokeOpacity={s ? 1 : 0.35}
                      strokeWidth={s ? 1.25 : 1}
                    />
                    <text x={X0 + c * CELL_W + CELL_W / 2} y={Y0 + r * CELL_H + 12} textAnchor="middle" fontSize={9} fontWeight={s ? 700 : 400} className={on ? "fill-foreground" : "fill-muted-foreground"} opacity={on ? 1 : 0.55}>
                      {laneOf(r, c)}
                    </text>
                  </g>
                );
              }),
            )}
            <line x1={X0} x2={X0 + COLS * CELL_W} y1={Y0 + 8 * CELL_H} y2={Y0 + 8 * CELL_H} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X0 + (COLS * CELL_W) / 2} y={Y0 + ROWS * CELL_H + 20} textAnchor="middle" fontSize={10} className="fill-muted-foreground">
              점선 아래 행 8–15는 위 행 0–7과 같은 lane 배치를 반복합니다
            </text>
          </svg>
        );
      }}
    />
  );
}
