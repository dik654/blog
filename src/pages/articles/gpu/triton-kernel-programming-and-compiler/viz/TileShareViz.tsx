import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #launch-and-autotune — 출력 tile 128×128 = 16,384.
 * num_warps 8: 8×32 = 256 thread, warp당 2,048, thread당 64. num_warps 4: 128 thread, thread당 128.
 * 16×16칸의 한 칸이 accumulator 64개이므로 칸 수를 그대로 셀 수 있습니다.
 */
const SCENES: readonly (ShellScene & { warps: number; threads: number; perWarp: number; perThread: number })[] = [
  { label: "출력 tile 하나", summary: "128 × 128 = 16,384", note: "출력 tile 전체가 accumulator입니다. 결과를 쌓아 두는 fp32 값 16,384개를 register에 나눠 둬야 합니다.", warps: 0, threads: 0, perWarp: 0, perThread: 0 },
  { label: "warp 8개로 나누기", summary: "16,384 ÷ 8 = 2,048", note: "num_warps=8이면 띠 하나가 warp 하나의 몫입니다. 32칸 × 칸마다 64개 = 2,048개입니다.", warps: 8, threads: 0, perWarp: 2048, perThread: 0 },
  { label: "thread까지 나누기", summary: "16,384 ÷ 256 = 64", note: "8 warp × 32 thread = 256 thread가 나눕니다. 칸 하나가 thread 하나의 몫이고 fp32 accumulator 64개입니다.", warps: 8, threads: 256, perWarp: 2048, perThread: 64 },
  { label: "num_warps를 4로", summary: "16,384 ÷ 128 = 128", note: "128 thread가 나누면 thread마다 128개로 두 배가 되어 register 압박이 커집니다. 두 칸을 합친 조각 하나가 thread 하나입니다.", warps: 4, threads: 128, perWarp: 4096, perThread: 128 },
];

const CELL = 15;
const SIDE = 16;
const STRIPE = ["#2563eb", "#d97706"];

export default function TileShareViz() {
  return (
    <SceneShell
      eyebrow="출력 tile 나누기"
      title="Warp 수를 줄이면 thread 하나가 맡을 accumulator가 늘어납니다"
      description="M 128행 × N 128열의 출력을 16×16칸으로 그렸습니다. 칸 하나가 accumulator 64개이고, warp는 thread 32개를 묶은 단위입니다."
      note="띠와 칸의 위치는 개수를 세기 위한 표시이며(가정), 실제 layout이 아닙니다."
      ariaLabel="출력 tile 16384개를 warp와 thread로 나눈 개수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rowsPerWarp = scene.warps === 0 ? SIDE : SIDE / scene.warps;
        const merge = scene.warps === 4;
        return (
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <svg viewBox={`0 0 ${SIDE * CELL + 2} ${SIDE * CELL + 2}`} className="block w-36 shrink-0 sm:w-60" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: SIDE * SIDE }, (_, index) => {
                const row = Math.floor(index / SIDE);
                const col = index % SIDE;
                const band = Math.floor(row / rowsPerWarp);
                const fill = scene.warps === 0 ? "#64748b" : STRIPE[band % 2];
                return <rect key={index} x={1 + col * CELL} y={1 + row * CELL} width={CELL} height={CELL} fill={fill} fillOpacity={scene.warps === 0 ? 0.18 : band % 2 ? 0.3 : 0.22} stroke="none" />;
              })}
              {Array.from({ length: SIDE + 1 }, (_, line) => (
                <line key={`h${line}`} x1={1} y1={1 + line * CELL} x2={1 + SIDE * CELL} y2={1 + line * CELL} stroke="#64748b" strokeWidth={0.75} strokeOpacity={scene.threads > 0 ? 1 : 0.4} />
              ))}
              {Array.from({ length: (merge ? SIDE / 2 : SIDE) + 1 }, (_, line) => {
                const x = 1 + line * CELL * (merge ? 2 : 1);
                return <line key={`v${line}`} x1={x} y1={1} x2={x} y2={1 + SIDE * CELL} stroke="#64748b" strokeWidth={0.75} strokeOpacity={scene.threads > 0 ? 1 : 0.4} />;
              })}
              {scene.threads > 0 && <rect x={1} y={1} width={merge ? CELL * 2 : CELL} height={CELL} fill="#dc2626" fillOpacity={0.55} stroke="#dc2626" strokeWidth={1} />}
              <rect x={1} y={1} width={SIDE * CELL} height={SIDE * CELL} fill="none" stroke="#64748b" strokeWidth={1} />
            </svg>
            <dl className="min-w-0 flex-1 space-y-1 text-xs sm:max-w-xs sm:text-sm">
              <dt className="text-muted-foreground">warp 수</dt>
              <dd className="font-mono font-bold">{scene.warps || "−"}</dd>
              <dt className="text-muted-foreground">thread 수</dt>
              <dd className="font-mono font-bold">{scene.threads || "−"}</dd>
              <dt className="text-muted-foreground">warp 하나의 몫</dt>
              <dd className="font-mono font-bold">{scene.perWarp ? scene.perWarp.toLocaleString("en-US") : "−"}</dd>
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 bg-[#dc2626]/55" />
                thread 하나의 몫
              </dt>
              <dd className="font-mono font-bold">{scene.perThread || "−"}</dd>
            </dl>
          </div>
        );
      }}
    />
  );
}
