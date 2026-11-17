import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mosaic — tile마다 resize와 offset이 달라 box를 tile 좌표로 옮기고, canvas에서 clip한 뒤
 * visible ratio와 minimum size를 통과한 annotation만 union한다.
 * 모든 값은 가정: 원본 200×200, canvas 200×200, A·B·C는 ×0.5, D는 ×0.6 + (100,100).
 * x' = s·x + o, clip 뒤 보이는 비율 = clip 면적 / 옮긴 면적, 기준 0.3과 최소 변 8.
 */
type Box = readonly [number, number, number, number];

const CANVAS = 200;
const MIN_RATIO = 0.3;
const MIN_SIDE = 8;

const TILES: readonly { name: string; s: number; ox: number; oy: number }[] = [
  { name: "A", s: 0.5, ox: 0, oy: 0 },
  { name: "B", s: 0.5, ox: 100, oy: 0 },
  { name: "C", s: 0.5, ox: 0, oy: 100 },
  { name: "D", s: 0.6, ox: 100, oy: 100 },
];

const ANNOTATIONS: readonly { id: string; tile: number; src: Box }[] = [
  { id: "a", tile: 0, src: [40, 60, 120, 140] },
  { id: "b", tile: 1, src: [60, 80, 72, 92] },
  { id: "d1", tile: 3, src: [100, 50, 200, 150] },
  { id: "d2", tile: 3, src: [150, 150, 200, 200] },
];

const area = (box: Box) => Math.max(0, box[2] - box[0]) * Math.max(0, box[3] - box[1]);
const clamp = (value: number) => Math.min(CANVAS, Math.max(0, value));

const ROWS = ANNOTATIONS.map((item) => {
  const tile = TILES[item.tile];
  const moved: Box = [
    tile.s * item.src[0] + tile.ox,
    tile.s * item.src[1] + tile.oy,
    tile.s * item.src[2] + tile.ox,
    tile.s * item.src[3] + tile.oy,
  ];
  const clipped: Box = [clamp(moved[0]), clamp(moved[1]), clamp(moved[2]), clamp(moved[3])];
  const ratio = area(clipped) / area(moved);
  const side = Math.min(clipped[2] - clipped[0], clipped[3] - clipped[1]);
  const reason = ratio < MIN_RATIO ? `버림 · 비율 ${ratio.toFixed(2)} < ${MIN_RATIO}` : side < MIN_SIDE ? `버림 · 변 ${side} < ${MIN_SIDE}` : "유지";
  return { ...item, tileName: tile.name, moved, clipped, ratio, keep: reason === "유지", reason };
});

const fmt = (box: Box) => `(${box[0]},${box[1]})–(${box[2]},${box[3]})`;

const SCENES = [
  {
    label: "tile마다 다른 resize·offset",
    summary: "A·B·C ×0.5 · D ×0.6",
    note: "네 원본을 각자 다른 배율로 줄여 다른 자리에 놓습니다(모든 숫자는 가정). D는 한 변이 120으로 커서 canvas 오른쪽·아래 경계를 넘습니다. 표의 좌표는 아직 옮기기 전, 원본 image 기준 box입니다.",
  },
  {
    label: "box를 tile 좌표로 옮깁니다",
    summary: "x′ = s·x + offset",
    note: "box의 네 좌표에 그 tile의 배율을 곱하고 offset을 더합니다. mask와 keypoint도 같은 배율과 offset을 따라 옮겨야 합니다. d1의 x 100은 0.6배 뒤 100을 더해 160이 됩니다.",
  },
  {
    label: "canvas에서 clip",
    summary: "보이는 비율 = clip 면적 ÷ 옮긴 면적",
    note: "canvas 밖으로 나간 부분을 잘라 냅니다. d1은 폭 60 중 40만 남아 0.67, d2는 30×30 중 10×10만 남아 0.11입니다.",
  },
  {
    label: "기준을 통과한 것만 union",
    summary: `기준(가정): 비율 ≥ ${MIN_RATIO}, 변 ≥ ${MIN_SIDE}`,
    note: "d2는 보이는 비율이, b는 줄인 뒤 크기가 기준에 못 미쳐 빠지고 a와 잘린 d1만 정답 목록에 합쳐집니다. source ID·tile map·clip 결과를 함께 남기지 않으면 잘못 들어간 object를 나중에 재현할 수 없습니다.",
  },
] as const;

const PAD = 14;

function rowText(active: number, row: (typeof ROWS)[number]) {
  if (active === 0) return `원본 ${fmt(row.src)}`;
  if (active === 1) return fmt(row.moved);
  if (active === 2) return `${fmt(row.clipped)} · ${row.ratio.toFixed(2)}`;
  return row.reason;
}

export default function MosaicAnnotationViz() {
  return (
    <SceneShell
      eyebrow="Mosaic annotation"
      title="box는 tile을 따라 옮기고, 잘린 뒤 기준을 다시 통과해야 합니다"
      description="200×200 canvas에 네 image를 tile로 붙입니다(좌표·배율·기준은 모두 가정). 굵은 선이 canvas 경계, 주황 점선은 clip 전 box, 회색 점선은 버린 box입니다."
      ariaLabel="Mosaic에서 tile별 배율과 offset으로 box를 옮기고 clip한 뒤 비율과 최소 크기로 거르는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center sm:gap-6">
          <svg viewBox="0 0 250 250" role="img" aria-label={SCENES[active].label} className="mx-auto block h-auto w-full max-w-[15rem]">
            {TILES.map((tile) => {
              const size = CANVAS * tile.s;
              return (
                <g key={tile.name}>
                  <rect x={PAD + tile.ox} y={PAD + tile.oy} width={size} height={size} fill={tile.name === "D" ? "#fef3c7" : "#f1f5f9"} stroke="#94a3b8" strokeWidth="1" />
                  <text x={PAD + tile.ox + 5} y={PAD + tile.oy + 12} fontSize="9" fill="#475569">
                    {`${tile.name} ×${tile.s} +(${tile.ox},${tile.oy})`}
                  </text>
                </g>
              );
            })}
            {active >= 1 &&
              ROWS.map((row) => {
                const box = active >= 2 ? row.clipped : row.moved;
                const dropped = active === 3 && !row.keep;
                return (
                  <g key={row.id}>
                    {active >= 2 && area(row.moved) > area(row.clipped) && (
                      <rect
                        x={PAD + row.moved[0]}
                        y={PAD + row.moved[1]}
                        width={row.moved[2] - row.moved[0]}
                        height={row.moved[3] - row.moved[1]}
                        fill="none"
                        stroke="#b45309"
                        strokeWidth="1"
                        strokeDasharray="3 2"
                      />
                    )}
                    <rect
                      x={PAD + box[0]}
                      y={PAD + box[1]}
                      width={box[2] - box[0]}
                      height={box[3] - box[1]}
                      fill={dropped ? "none" : "#2563eb"}
                      fillOpacity={0.18}
                      stroke={dropped ? "#94a3b8" : "#2563eb"}
                      strokeWidth="1.25"
                      strokeDasharray={dropped ? "2 2" : undefined}
                    />
                    <text x={PAD + box[0] + 3} y={box[1] > 150 ? PAD + box[3] + 10 : PAD + box[1] - 3} fontSize="9" fill={dropped ? "#94a3b8" : "#1d4ed8"}>
                      {row.id}
                    </text>
                  </g>
                );
              })}
            <rect x={PAD} y={PAD} width={CANVAS} height={CANVAS} fill="none" stroke="#334155" strokeWidth="1.25" />
            <text x={PAD} y={PAD + CANVAS + 16} fontSize="9" fill="#64748b">
              canvas 0–200
            </text>
          </svg>
          <div className="grid min-w-0 gap-1 font-mono text-xs sm:text-sm">
            {ROWS.map((row) => (
              <div key={row.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <span className="text-muted-foreground">{`${row.id} · ${row.tileName}`}</span>
                <span className={active === 3 ? (row.keep ? "font-bold text-blue-700 dark:text-blue-300" : "text-muted-foreground line-through decoration-1") : ""}>
                  {rowText(active, row)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
