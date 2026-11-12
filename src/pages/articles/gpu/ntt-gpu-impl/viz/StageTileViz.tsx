import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stage-tile "Shared memory에 여러 stages를 묶으면 global traffic이 줄어듭니다 … Tile 밖 stage에는
 * kernel boundary나 검증된 global synchronization이 필요합니다."
 * pair는 글의 식 h=2^s, j=t mod h, g=floor(t/h), (2hg+j, 2hg+j+h)로 N=8, t=0..3에서 계산합니다.
 * block 하나가 원소 4개를 맡는 tile 크기와 traffic 단순 모델은 설명용 가정입니다.
 */
const N = 8;
const TILE = 4;
const ELEMENT_BYTES = 32;

const pairsOf = (s: number): readonly (readonly [number, number])[] => {
  const h = 2 ** s;
  return [0, 1, 2, 3].map((t) => {
    const j = t % h;
    const g = Math.floor(t / h);
    const i0 = 2 * h * g + j;
    return [i0, i0 + h] as const;
  });
};

const STAGES = [0, 1, 2].map((s) => pairsOf(s));

const crosses = ([a, b]: readonly [number, number]) => Math.floor(a / TILE) !== Math.floor(b / TILE);

type Scene = { label: string; summary: string; note: string; stage: number };

const SCENES: readonly Scene[] = [
  {
    label: "stage s=0 · h=1",
    summary: "(0,1) (2,3) (4,5) (6,7)",
    note: "Stage 0에서 pair 간 거리는 h=1입니다. 네 thread가 이웃한 두 원소씩 맡고, 모든 pair가 원소 4개짜리 tile 하나 안에 있습니다. Tile은 한 thread block이 shared memory에 올려 두고 함께 처리하는 원소 묶음입니다.",
    stage: 0,
  },
  {
    label: "stage s=1 · h=2",
    summary: "(0,2) (1,3) (4,6) (5,7)",
    note: "다음 stage는 앞 stage의 output을 읽으므로, 같은 block 안 모든 thread가 stage 0을 끝낼 때까지 block barrier로 기다립니다. 이 stage의 pair도 여전히 tile 안에 있어 global memory를 거치지 않고 shared memory에서 이어서 계산할 수 있습니다. t=3은 (5,7)입니다.",
    stage: 1,
  },
  {
    label: "stage s=2 · h=4",
    summary: "(0,4) (1,5) (2,6) (3,7) · tile을 넘음",
    note: "h=4가 되면 모든 pair가 두 tile에 걸칩니다. 다른 block이 쓴 값을 읽어야 하는데, block barrier는 자기 block 안의 순서만 보장하고 grid 전체 순서를 만들지 못합니다. 그래서 여기에는 kernel boundary나 검증된 global synchronization이 필요합니다.",
    stage: 2,
  },
  {
    label: "묶으면 줄어드는 global pass",
    summary: "3 pass → 2 pass (가정 모델)",
    note: "stage마다 global memory에서 N개를 읽고 쓰면 4절의 단순 모델대로 2×8×32×3 = 1,536B입니다. Stage 0·1을 shared memory tile 하나로 묶고 stage 2만 따로 돌리며, kernel마다 N개를 한 번 읽고 쓴다고 단순화하면 2×8×32×2 = 1,024B입니다(가정). 대가로 block barrier, shared capacity와 bank mapping이 새 제약으로 붙습니다.",
    stage: 3,
  },
];

const W = 480;
const H = 250;
const X0 = 92;
const DX = 52;
const Y: readonly number[] = [46, 102, 158, 214];
const x = (i: number) => X0 + i * DX;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREY = "#94a3b8";

function passBytes(passes: number) {
  return 2 * N * ELEMENT_BYTES * passes;
}

export default function StageTileViz() {
  return (
    <SceneShell
      eyebrow="Stage와 tile 경계"
      title="h가 tile 크기에 이르는 stage에서 block barrier만으로는 순서를 못 지킵니다"
      description="위에서 아래로 N=8 배열이 stage 0·1·2를 지납니다. Pair 거리 h가 tile 크기(원소 4개)와 같아지는 stage 2부터 pair의 두 원소가 서로 다른 tile에 놓입니다. X자 선 하나가 butterfly 하나, 세로 점선이 tile 경계입니다. Block 하나가 원소 4개를 맡는다는 tile 크기는 설명용 가정입니다."
      ariaLabel="N=8 radix-2 세 stage의 butterfly pair와 원소 4개 tile 경계, global pass 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fused = scene.stage === 3;
        return (
          <div className="min-w-0 space-y-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[440px]" role="img" aria-label="butterfly network">
              <rect x={x(0) - 22} y={16} width={DX * 3 + 44} height={H - 26} rx={8} fill="none" stroke={GREY} strokeWidth={1} />
              <rect x={x(4) - 22} y={16} width={DX * 3 + 44} height={H - 26} rx={8} fill="none" stroke={GREY} strokeWidth={1} />
              <text x={x(0) - 16} y={33} fontSize={14} fill={GREY}>block A</text>
              <text x={x(4) - 16} y={33} fontSize={14} fill={GREY}>block B</text>
              <line x1={(x(3) + x(4)) / 2} y1={10} x2={(x(3) + x(4)) / 2} y2={H - 4} stroke={GREY} strokeWidth={1} strokeDasharray="4 4" />

              {STAGES.map((pairs, s) => {
                const current = fused ? true : s === scene.stage;
                const done = !fused && s < scene.stage;
                return (
                  <g key={s} opacity={current ? 1 : done ? 0.55 : 0.15}>
                    {pairs.map((pair) => {
                      const [a, b] = pair;
                      const color = current && crosses(pair) ? RED : current ? BLUE : GREY;
                      return (
                        <g key={`${a}-${b}`} stroke={color} strokeWidth={current ? 1.25 : 1}>
                          <line x1={x(a)} y1={Y[s] + 11} x2={x(a)} y2={Y[s + 1] - 11} />
                          <line x1={x(b)} y1={Y[s] + 11} x2={x(b)} y2={Y[s + 1] - 11} />
                          <line x1={x(a)} y1={Y[s] + 11} x2={x(b)} y2={Y[s + 1] - 11} />
                          <line x1={x(b)} y1={Y[s] + 11} x2={x(a)} y2={Y[s + 1] - 11} />
                        </g>
                      );
                    })}
                    <text x={4} y={(Y[s] + Y[s + 1]) / 2 - 3} fontSize={15} fontWeight={700} fill={current ? (s === 2 ? RED : BLUE) : GREY} stroke="none">
                      <tspan x={4}>s={s}</tspan>
                      <tspan x={4} dy={18}>h={2 ** s}</tspan>
                    </text>
                  </g>
                );
              })}

              {Y.map((y, layer) => (
                <g key={y}>
                  {Array.from({ length: N }, (_, i) => (
                    <g key={i}>
                      <circle cx={x(i)} cy={y} r={10} fill="none" stroke={layer === 0 ? "#64748b" : GREY} strokeWidth={1} />
                      <text x={x(i)} y={y + 4.5} fontSize={13} textAnchor="middle" fill="#64748b">
                        {i}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
            </svg>

            <div className="grid gap-2 text-xs sm:grid-cols-3">
              {[0, 1, 2].map((s) => {
                const crossing = STAGES[s].some(crosses);
                const lit = fused || s === scene.stage;
                return (
                  <div
                    key={s}
                    className={`rounded-lg border bg-background px-3 py-2 ${lit ? (crossing ? "border-[#dc2626]" : "border-[#2563eb]") : "border-border text-muted-foreground"}`}
                  >
                    <span className="font-mono font-bold">s={s}</span>{" "}
                    {crossing ? "tile 밖 · kernel boundary 또는 global sync" : s === 0 ? "tile 안 · shared memory" : "tile 안 · 앞에 block barrier"}
                  </div>
                );
              })}
            </div>

            <div className={`space-y-1.5 text-xs transition-opacity duration-300 motion-reduce:transition-none ${fused ? "opacity-100" : "opacity-30"}`}>
              {[
                { label: "stage마다 global", passes: 3 },
                { label: "s0·s1 묶음 (가정)", passes: 2 },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)_4.5rem] items-center gap-2">
                  <span>{row.label}</span>
                  <div className="flex h-4 min-w-0 gap-0.5">
                    {Array.from({ length: row.passes }, (_, p) => (
                      <div key={p} className="h-full w-1/3 rounded-sm" style={{ backgroundColor: row.passes === 3 ? GREY : BLUE }} />
                    ))}
                  </div>
                  <span className="text-right font-mono">{passBytes(row.passes).toLocaleString("en-US")}B</span>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground">막대 한 칸 = global memory에서 N개를 한 번 읽고 쓰는 pass(8×32B×2 = 512B).</p>
            </div>
          </div>
        );
      }}
    />
  );
}
