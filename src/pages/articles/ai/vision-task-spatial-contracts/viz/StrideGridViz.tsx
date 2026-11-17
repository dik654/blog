import SceneShell from "./SceneShell";

/**
 * 본문 대응: #preservation — output stride는 한 feature cell이 input에서 몇 pixel 간격인지이며,
 * downsampling으로 지운 작은 물체와 경계는 head가 저절로 복원하지 못하고 skip path가 높은 resolution feature를 전달한다.
 * 16×16 입력, 3×3 작은 물체, 대각선 경계의 큰 물체, stride 1·4·8·2는 모두 설명용 가정이다.
 * 칸별 비율은 그 칸 면적 중 작은 물체가 차지하는 pixel 개수 비다.
 */
const SIZE = 16;
const CELL = 11;
const PAD = 4;

const isSmall = (x: number, y: number) => x >= 9 && x <= 11 && y >= 3 && y <= 5;
const isLarge = (x: number, y: number) => y - x >= 4;

const SMALL_TOTAL = 9;

type Cell = { cx: number; cy: number; small: number; large: number };

function cellsFor(stride: number): Cell[] {
  const n = SIZE / stride;
  const area = stride * stride;
  return Array.from({ length: n * n }, (_, index) => {
    const cx = index % n;
    const cy = Math.floor(index / n);
    const pixels = Array.from({ length: area }, (_, k) => [cx * stride + (k % stride), cy * stride + Math.floor(k / stride)] as const);
    const small = pixels.filter(([x, y]) => isSmall(x, y)).length / area;
    const large = pixels.filter(([x, y]) => isLarge(x, y)).length / area;
    return { cx, cy, small, large };
  });
}

function stats(stride: number) {
  const cells = cellsFor(stride);
  const smallCells = cells.filter((cell) => cell.small > 0);
  const maxSmall = smallCells.reduce<number>((max, cell) => Math.max(max, cell.small), 0);
  const shares = smallCells.map((cell) => `${Math.round(cell.small * 100)}%`).join(" · ");
  const mixed = cells.filter((cell) => cell.large > 0 && cell.large < 1).length;
  return { cells, smallCells: smallCells.length, maxSmall: Math.round(maxSmall * 100), shares, mixed };
}

const SCENES = [
  {
    label: "입력 grid (stride 1)",
    stride: 1,
    gridLabel: "출력 칸 = pixel 1개",
    note: "16×16 pixel 입력(가정)에 3×3 작은 물체와 대각선 경계를 가진 큰 물체를 놓았습니다. Output stride는 한 feature cell이 input에서 몇 pixel 간격인지를 뜻합니다. stride 1이면 칸 하나가 pixel 하나라 두 모양을 pixel 단위로 나타낼 수 있습니다.",
  },
  {
    label: "stride 4",
    stride: 4,
    gridLabel: "출력 칸 = 4×4 pixel",
    note: "칸 하나가 16 pixel을 대표합니다. 작은 물체 9 pixel은 두 칸에 나뉘어 각 칸 면적의 19%와 38%만 차지하고, 큰 물체의 대각선은 일부만 덮인 칸들로 바뀝니다.",
  },
  {
    label: "stride 8",
    stride: 8,
    gridLabel: "출력 칸 = 8×8 pixel",
    note: "칸 하나가 64 pixel입니다. 작은 물체는 한 칸의 14%뿐입니다. Segmentation이 이 grid의 칸마다 class score 하나를 낸다면 3×3 모양과 대각선은 칸 안에서 구분되지 않고, head 이름을 바꿔도 이 grid보다 촘촘한 정보가 생기지 않습니다.",
  },
  {
    label: "skip path로 stride 2 결합",
    stride: 2,
    gridLabel: "skip feature 칸 = 2×2 pixel (가정)",
    note: "Skip path는 encoder의 높은 resolution feature를 decoder에 직접 전달합니다. 지우기 전의 stride 2 feature를 받았다고 가정하면 작은 물체가 한 칸을 100% 채우고 경계도 더 작은 칸으로 나뉩니다. 세부는 head가 새로 만든 것이 아니라 지우기 전 feature에서 다시 가져온 것입니다.",
  },
] as const;

const SCENE_STATS = SCENES.map((scene) => stats(scene.stride));

const SHELL_SCENES = SCENES.map((scene, index) => ({
  label: scene.label,
  summary: `작은 물체 = 칸 ${SCENE_STATS[index].smallCells}개 · 최대 ${SCENE_STATS[index].maxSmall}%`,
  note: scene.note,
}));

const LARGE_OUTLINE = [
  `M${PAD} ${PAD + 4 * CELL}`,
  ...Array.from({ length: 12 }, (_, x) => `H${PAD + (x + 1) * CELL} V${PAD + Math.min(x + 5, SIZE) * CELL}`),
  `H${PAD} Z`,
].join(" ");

function Grid({ stride }: { stride: number }) {
  const { cells } = stats(stride);
  const side = stride * CELL;
  const full = SIZE * CELL;
  return (
    <svg viewBox={`0 0 ${full + PAD * 2} ${full + PAD * 2}`} className="mx-auto h-auto w-full max-w-[15rem]" role="img" aria-label={`output stride ${stride} grid 위의 작은 물체와 큰 물체`}>
      <rect x={PAD} y={PAD} width={full} height={full} fill="none" stroke="#94a3b8" strokeWidth={1} />
      {cells.map((cell) => {
        const x = PAD + cell.cx * side;
        const y = PAD + cell.cy * side;
        const mixedLarge = cell.large > 0 && cell.large < 1;
        return (
          <g key={`${cell.cx}-${cell.cy}`}>
            {cell.large > 0 && <rect x={x} y={y} width={side} height={side} fill="#2563eb" fillOpacity={0.12 + 0.5 * cell.large} />}
            {cell.small > 0 && <rect x={x} y={y} width={side} height={side} fill="#dc2626" fillOpacity={0.12 + 0.5 * cell.small} />}
            <rect
              x={x}
              y={y}
              width={side}
              height={side}
              fill="none"
              stroke={mixedLarge && stride > 1 ? "#d97706" : "#cbd5e1"}
              strokeWidth={mixedLarge && stride > 1 ? 1.25 : 0.75}
              strokeDasharray={mixedLarge && stride > 1 ? "3 2" : undefined}
            />
          </g>
        );
      })}
      <path d={LARGE_OUTLINE} fill="none" stroke="#1d4ed8" strokeWidth={1} />
      <rect x={PAD + 9 * CELL} y={PAD + 3 * CELL} width={3 * CELL} height={3 * CELL} fill="none" stroke="#b91c1c" strokeWidth={1.25} />
    </svg>
  );
}

function Readout({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-mono font-bold" style={{ color: tone }}>{value}</span>
    </div>
  );
}

export default function StrideGridViz() {
  return (
    <SceneShell
      eyebrow="Output stride와 skip path"
      title="Stride가 커지면 작은 물체와 경계가 칸 하나 안에 묻힙니다"
      description="그림의 칸 하나가 출력 grid(마지막 장면은 skip path로 받은 feature grid)의 한 칸입니다. 빨간 사각형(3×3 작은 물체)과 파란 계단선(대각선 경계를 가진 큰 물체)은 입력 pixel 단위의 실제 모양이고, 칸 색이 진할수록 그 물체가 칸을 많이 덮습니다. 입력 16×16 pixel과 물체 배치는 설명용 가정입니다."
      ariaLabel="output stride 1, 4, 8과 skip path stride 2에서 작은 물체와 경계가 출력 칸에 어떻게 나뉘는지 네 장면"
      scenes={SHELL_SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const stat = SCENE_STATS[active];
        const n = SIZE / scene.stride;
        return (
          <div className="grid min-w-0 items-center gap-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <Grid stride={scene.stride} />
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold text-primary">{scene.gridLabel}</p>
              <Readout label={scene.stride === 2 ? "skip feature grid" : "출력 grid"} value={`${n}×${n}칸`} tone="#475569" />
              <Readout label="작은 물체(9 pixel)가 걸친 칸" value={`${stat.smallCells}칸`} tone="#b91c1c" />
              <Readout label="칸별로 차지한 면적" value={scene.stride === 1 ? "칸마다 100%" : stat.shares} tone="#b91c1c" />
              <Readout label="큰 물체가 일부만 덮은 경계 칸" value={`${stat.mixed}칸`} tone="#b45309" />
              <p className="mt-2 text-xs leading-5 text-muted-foreground">점선 주황 칸은 경계가 지나가 일부만 덮인 칸입니다. 작은 물체 전체 = {SMALL_TOTAL} pixel.</p>
            </div>
          </div>
        );
      }}
    />
  );
}
