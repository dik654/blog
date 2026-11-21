import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tile-scheduler — linear tile 번호 0~19를 4×5 output 격자의 (m, n)으로 푸는 순서.
 * tile (m, n)은 A의 m번째 행 조각과 B의 n번째 열 조각을 쓴다(gA(m,…), gB(n,…)).
 * 첫 wave(worker 8개 → tile 0~7)가 동시에 쓰는 서로 다른 조각 수를 센다.
 *   AlongN: 행 0 전체 + 행 1의 n 0~2 → A 2 + B 5 = 7
 *   AlongM: 열 0·1 전체 → A 4 + B 2 = 6
 *   swizzle k=2(가정, log_swizzle_size=1) + AlongN: 행 0~1 × 열 0~3 → A 2 + B 4 = 6
 *   swizzle 번호는 CUTLASS v4.8.1 PersistentTileSchedulerSm90::get_work_idx_m_and_n 의 decode를 cluster 1×1로 따른다.
 *   initialize()가 열 수 5를 2의 배수 6으로 올리므로 번호 10·11·22·23은 격자 밖 열 n=5로 풀린다.
 */
const ROWS = 4;
const COLS = 5;
/** log_swizzle_size=1 일 때 initialize()가 round_up(5, 2)로 올린 N 방향 tile 수 */
const SWIZZLE_COLS = 6;
const WAVE = 8;

type Order = (m: number, n: number) => number;

const alongN: Order = (m, n) => m * COLS + n;
const alongM: Order = (m, n) => n * ROWS + m;
const swizzled: Order = (m, n) => Math.floor(m / 2) * 2 * SWIZZLE_COLS + n * 2 + (m % 2);

const SCENES = [
  {
    label: "tile 하나가 쓰는 조각",
    summary: "tile (1,2) ← A1 + B2",
    order: null,
    note: "Output tile (m, n)은 A의 m번째 행 조각과 B의 n번째 열 조각을 곱해 만듭니다. 그래서 같은 행의 tile끼리는 A 조각을, 같은 열의 tile끼리는 B 조각을 공유합니다.",
  },
  {
    label: "Raster AlongN",
    summary: "첫 wave: A 2 + B 5 = 7조각",
    order: alongN,
    note: "번호가 N 방향으로 먼저 늘어 0~4가 모두 A0을 씁니다. Worker 8개가 동시에 받는 tile 0~7은 A0·A1과 B0~B4, 서로 다른 조각 7개를 씁니다.",
  },
  {
    label: "Raster AlongM",
    summary: "첫 wave: A 4 + B 2 = 6조각",
    order: alongM,
    note: "번호가 M 방향으로 먼저 늘면 0~3이 모두 B0을 씁니다. 첫 wave tile 0~7은 A0~A3과 B0·B1을 씁니다. 두 방향 중 어느 쪽이 빠른지는 이 글이 측정값으로 말하지 않습니다.",
  },
  {
    label: "Swizzle k=2 (가정)",
    summary: "첫 wave: A 2 + B 4 = 6조각",
    order: swizzled,
    note: "AlongN에 log_swizzle_size=1을 주면 CUTLASS의 get_work_idx_m_and_n이 번호를 2개씩 묶어 두 행을 함께 훑습니다. 열 수 5를 2의 배수 6으로 올리므로 10·11은 격자 밖 열로 풀리고 셋째 행은 12부터 시작합니다. 첫 wave가 2×4 덩어리에 모여 AlongN의 7조각이 6조각으로 줄어, 같은 시간에 L2에 있는 A·B 조각을 더 많이 다시 씁니다. AlongM도 첫 wave가 6조각이라 이 작은 격자에서는 조각 수만으로 둘의 우열이 갈리지 않습니다.",
  },
] as const;

const WAVE_COLOR = "#2563eb";

export default function RasterSwizzleViz() {
  return (
    <SceneShell
      eyebrow="Raster order와 swizzle"
      title="같은 20개 tile도 번호를 푸는 순서에 따라 첫 wave가 쓰는 조각이 달라집니다"
      description="왼쪽 A0~A3은 A의 행 조각, 위쪽 B0~B4는 B의 열 조각입니다. 칸 안 숫자는 linear tile 번호이고, 파란 칸이 worker 8개가 동시에 받는 첫 wave(번호 0~7)입니다. 여기의 swizzle은 shared memory swizzle과 다른, tile 번호를 묶는 순서입니다."
      ariaLabel="4 곱하기 5 output tile 격자에서 raster AlongN, AlongM, swizzle 순서별 첫 wave가 쓰는 A와 B 조각 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const order = scene.order;
        const inWave = (m: number, n: number) => {
          if (order === null) return m === 1 && n === 2;
          return order(m, n) < WAVE;
        };
        const usedA = Array.from({ length: ROWS }, (_, m) => Array.from({ length: COLS }, (_, n) => inWave(m, n)).some(Boolean));
        const usedB = Array.from({ length: COLS }, (_, n) => Array.from({ length: ROWS }, (_, m) => inWave(m, n)).some(Boolean));
        return (
          <div className="mx-auto w-full max-w-lg min-w-0">
            <div className="grid min-w-0 grid-cols-[2.5rem_repeat(5,minmax(0,1fr))] gap-1.5 text-xs">
              <span />
              {usedB.map((used, n) => (
                <span
                  key={`b${n}`}
                  className={`rounded-md border py-1 text-center font-mono font-bold ${used ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground/60"}`}
                >
                  B{n}
                </span>
              ))}
              {Array.from({ length: ROWS }, (_, m) => (
                <div key={`row${m}`} className="contents">
                  <span
                    className={`flex items-center justify-center rounded-md border font-mono font-bold ${usedA[m] ? "border-violet-600 text-violet-700 dark:text-violet-400" : "border-border text-muted-foreground/60"}`}
                  >
                    A{m}
                  </span>
                  {Array.from({ length: COLS }, (_, n) => {
                    const hot = inWave(m, n);
                    const label = order === null ? `(${m},${n})` : String(order(m, n));
                    return (
                      <span
                        key={`c${m}-${n}`}
                        className={`flex h-10 min-w-0 items-center justify-center rounded-md border font-mono transition-colors duration-300 motion-reduce:transition-none sm:h-12 ${hot ? "font-bold text-white" : "border-border bg-background"}`}
                        style={hot ? { backgroundColor: WAVE_COLOR, borderColor: WAVE_COLOR } : undefined}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
              {order === null
                ? "칸 안은 (m, n) 좌표 · 파란 칸 하나가 A1과 B2를 씀"
                : `첫 wave가 쓰는 A ${usedA.filter(Boolean).length}개 + B ${usedB.filter(Boolean).length}개`}
            </p>
          </div>
        );
      }}
    />
  );
}
