import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cute-layout — 열 우선 (128,128):(1,128) 을 (16,8) tile 로 logical divide.
 * 결과 ((16,8),(8,16)):((1,128),(16,1024)). M 방향 tile 8개 × N 방향 tile 16개.
 * tile 번호 (2,3) → 행 32, 열 24 에서 시작 → 32 + 24·128 = 2·16 + 3·1024 = 3,104.
 */
const TILES_M = 8;
const TILES_N = 16;
const TW = 18;
const TH = 30;
const X0 = 34;
const Y0 = 30;
const W = X0 + TILES_N * TW + 12;
const H = Y0 + TILES_M * TH + 24;

const SCENES = [
  { label: "원래 layout", summary: "(128,128):(1,128)", focus: "none", note: "열 우선이므로 행 한 칸은 offset +1, 열 한 칸은 +128입니다. 아직 tile 구분은 없고 정사각형 하나의 주소 규칙만 있습니다." },
  { label: "앞 mode: tile 안", summary: "(16,8):(1,128)", focus: "inner", note: "16행 × 8열 tile 하나 안에서는 원래 stride를 그대로 씁니다. 행 한 칸 +1, 열 한 칸 +128입니다." },
  { label: "뒤 mode: tile 번호", summary: "(8,16):(16,1024)", focus: "outer", note: "아래 tile로 한 칸 가면 16행을 건너므로 +16, 오른쪽 tile로 한 칸 가면 8열을 건너므로 8×128 = +1024입니다. 128÷16 = 8, 128÷8 = 16이 tile 개수입니다." },
  { label: "tile (2,3) 고정", summary: "2·16 + 3·1024 = 3,104", focus: "pick", note: "뒤 mode에 (2,3)을 넣으면 행 32·열 24에서 시작하는 16×8 조각이 남습니다. 32 + 24×128 = 3,104로 같은 값이며, 원소는 한 번도 옮기지 않았습니다." },
] as const;

export default function DivideTileViz() {
  return (
    <SceneShell
      eyebrow="Logical divide"
      title="128×128을 16×8 tile로 나누면 stride가 두 쌍이 됩니다"
      description="큰 사각형은 열 우선 128×128 layout이고 작은 칸 하나가 16행 × 8열 tile입니다. 위쪽 숫자는 N 방향 tile 번호, 왼쪽 숫자는 M 방향 tile 번호입니다."
      ariaLabel="128 by 128 layout을 16 by 8 tile 8 곱하기 16개로 나누고 tile 2,3의 시작 offset 3104를 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[34rem]" role="img" aria-label="logical divide tile 격자">
            {Array.from({ length: TILES_N }, (_, j) => (
              <text key={`n${j}`} x={X0 + j * TW + TW / 2} y={Y0 - 8} textAnchor="middle" fontSize={8} className="fill-muted-foreground" opacity={focus === "none" ? 0.3 : 1}>
                {j}
              </text>
            ))}
            {Array.from({ length: TILES_M }, (_, i) => (
              <text key={`m${i}`} x={X0 - 6} y={Y0 + i * TH + TH / 2 + 3} textAnchor="end" fontSize={8} className="fill-muted-foreground" opacity={focus === "none" ? 0.3 : 1}>
                {i}
              </text>
            ))}
            {Array.from({ length: TILES_M }, (_, i) =>
              Array.from({ length: TILES_N }, (_, j) => {
                const picked = focus === "pick" && i === 2 && j === 3;
                const first = focus === "inner" && i === 0 && j === 0;
                const stepTile = focus === "outer" && ((i === 0 && j === 0) || (i === 1 && j === 0) || (i === 0 && j === 1));
                const on = picked || first || stepTile;
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={X0 + j * TW}
                    y={Y0 + i * TH}
                    width={TW}
                    height={TH}
                    fill={on ? (picked ? "#dc2626" : "#2563eb") : "#94a3b8"}
                    fillOpacity={on ? 0.28 : 0.08}
                    stroke="#94a3b8"
                    strokeOpacity={focus === "none" ? 0 : 0.6}
                    strokeWidth={1}
                  />
                );
              }),
            )}
            <rect x={X0} y={Y0} width={TILES_N * TW} height={TILES_M * TH} fill="none" stroke="#64748b" strokeWidth={1} />
            {focus === "none" && (
              <g>
                <line x1={X0 + 4} x2={X0 + 4} y1={Y0 + 6} y2={Y0 + 40} stroke="#2563eb" strokeWidth={1.25} />
                <text x={X0 + 9} y={Y0 + 30} fontSize={9} className="fill-foreground">행 +1 → offset +1</text>
                <line x1={X0 + 6} x2={X0 + 60} y1={Y0 + 52} y2={Y0 + 52} stroke="#d97706" strokeWidth={1.25} />
                <text x={X0 + 6} y={Y0 + 66} fontSize={9} className="fill-foreground">열 +1 → offset +128</text>
              </g>
            )}
            {focus === "inner" && (
              <text x={X0 + TW + 6} y={Y0 + 18} fontSize={9} className="fill-foreground">← 이 칸 하나 = 16행 × 8열</text>
            )}
            {focus === "outer" && (
              <g>
                <text x={X0 + 2 * TW + 6} y={Y0 + 18} fontSize={9} className="fill-foreground">← 오른쪽 tile: +8열 = +1024</text>
                <text x={X0 + TW + 6} y={Y0 + TH + 20} fontSize={9} className="fill-foreground">← 아래 tile: +16행 = +16</text>
              </g>
            )}
            {focus === "pick" && (
              <text x={X0 + 4 * TW + 6} y={Y0 + 2 * TH + 20} fontSize={9} className="fill-foreground">← tile (2,3) = 행 32·열 24부터</text>
            )}
            <text x={X0} y={H - 6} fontSize={9} className="fill-muted-foreground">M 방향 tile 8개 × N 방향 tile 16개 = 128개</text>
          </svg>
        );
      }}
    />
  );
}
