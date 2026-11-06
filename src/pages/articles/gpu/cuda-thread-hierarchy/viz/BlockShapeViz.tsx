import SceneShell from "./SceneShell";

/**
 * 본문 대응: #indexing-2d — 16×16과 32×8은 모두 256 threads지만 같은 warp가 지나는 행이 달라질 수 있다.
 * Thread 번호를 x축부터 센다고 놓으면(가정) warp 하나(32개)는 16×16에서 2행, 32×8에서 1행.
 * 256÷32 = 8 warps. 가장자리 칸: 2(16+16)−4 = 60, 2(32+8)−4 = 76.
 */
const C = 6;
const A_X = 12;
const B_X = 152;
const TOP = 28;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const INK = "#64748b";
const SHAPES = [
  { x: A_X, w: 16, h: 16, name: "16 × 16" },
  { x: B_X, w: 32, h: 8, name: "32 × 8" },
];

const SCENES = [
  { label: "칸 수는 같습니다", summary: "16×16 = 32×8 = 256", note: "칸 하나가 thread 하나입니다. 두 block 모두 256 threads이지만 모양이 다릅니다. 어느 쪽이든 같은 입력을 덮도록 grid를 올림해 잡을 수 있습니다." },
  { label: "첫 warp가 지나는 칸", summary: "두 행 대 한 행", note: "Thread 번호를 x축부터 센다고 놓으면(가정) 32개짜리 첫 warp는 16×16에서 두 행에 걸치고 32×8에서는 한 행 안에 들어갑니다." },
  { label: "block 전체를 warp로", summary: "256 ÷ 32 = warp 8개", note: "같은 색 띠 하나가 warp 하나입니다. 개수는 8개로 같지만 warp 하나가 지나는 행은 16×16에서 두 행, 32×8에서 한 행입니다." },
  { label: "주변 경계를 보면", summary: "가장자리 60칸 대 76칸", note: "그림에서 가장자리 칸을 세면 16×16은 60칸, 32×8은 76칸입니다. 한 행의 이웃을 읽는 데 유리한 모양과 주변 경계까지 복사하는 데 유리한 모양은 다를 수 있습니다. 어느 쪽이 빠른지는 정답을 확인한 뒤 실제 요청량과 시간으로 비교합니다." },
] as const;

function warpOf(col: number, row: number, width: number) {
  return Math.floor((row * width + col) / 32);
}

export default function BlockShapeViz() {
  return (
    <SceneShell
      eyebrow="Block 모양과 warp"
      title="같은 256 threads도 모양에 따라 warp가 지나는 행이 달라질 수 있습니다"
      description="두 block을 같은 축척으로 그렸습니다. 칸 하나가 thread 하나이고, 가로가 x축(열), 세로가 y축(행)입니다."
      note="Thread 번호를 x축부터 세는 순서는 설명을 위한 가정이며, 어느 모양이 더 빠르다는 측정이 아닙니다."
      ariaLabel="16 곱하기 16과 32 곱하기 8 block에서 warp가 차지하는 칸 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 140" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {SHAPES.map((shape) => (
            <g key={shape.name}>
              <text x={shape.x} y={TOP - 8} fontSize={12} fontWeight={700} fill={INK}>{shape.name}</text>
              {Array.from({ length: shape.w * shape.h }, (_, index) => {
                const col = index % shape.w;
                const row = Math.floor(index / shape.w);
                const warp = warpOf(col, row, shape.w);
                const edge = col === 0 || row === 0 || col === shape.w - 1 || row === shape.h - 1;
                const fill =
                  active === 1 ? (warp === 0 ? BLUE : "none")
                  : active === 2 ? (warp % 2 === 0 ? BLUE : "#93c5fd")
                  : active === 3 ? (edge ? AMBER : "none")
                  : "none";
                return <rect key={index} x={shape.x + col * C} y={TOP + row * C} width={C} height={C} fill={fill} stroke={LINE} strokeWidth={0.5} />;
              })}
            </g>
          ))}
          {active === 1 && (
            <>
              <text x={B_X} y={TOP + 8 * C + 18} fontSize={12} fontWeight={700} fill={BLUE}>첫 warp = 32칸 · 행 0 하나</text>
              <text x={B_X} y={TOP + 8 * C + 36} fontSize={12} fontWeight={700} fill={BLUE}>16×16에서는 행 0·1 두 줄</text>
            </>
          )}
          {active === 2 && (
            <text x={B_X} y={TOP + 8 * C + 18} fontSize={12} fontWeight={700} fill={BLUE}>같은 색 띠 하나 = warp 하나</text>
          )}
          {active === 3 && (
            <text x={B_X} y={TOP + 8 * C + 18} fontSize={12} fontWeight={700} fill={AMBER}>칠한 칸 = 가장자리</text>
          )}
          {active === 0 && (
            <text x={B_X} y={TOP + 8 * C + 18} fontSize={12} fontWeight={700} fill={INK}>둘 다 256칸</text>
          )}
        </svg>
      )}
    />
  );
}
