import SceneShell from "./SceneShell";

/**
 * 본문 대응: #latent-patches — 64×64 latent를 p×p patch로 자르면 token N = (64/p)².
 * p=2 → 32×32 = 1,024 token, p=4 → 16×16 = 256 token.
 * Dense attention pair N²: 1,024² = 1,048,576, 256² = 65,536 → 16배 차이.
 */
const LATENT = 64;
const PATCHES = [2, 4] as const;
const perAxis = (p: number) => LATENT / p;
const tokens = (p: number) => perAxis(p) * perAxis(p);
const pairs = (p: number) => tokens(p) * tokens(p);

const SCENES = [
  { label: "2×2 patch", summary: "32 × 32 = 1,024 token", note: "64칸을 2칸씩 묶으면 한 축에 32개, 두 축을 곱해 1,024개의 token이 됩니다. 칠한 작은 사각형 하나가 token 하나이며 latent 2×2칸을 담습니다." },
  { label: "4×4 patch", summary: "16 × 16 = 256 token", note: "patch 한 변을 4로 키우면 한 축에 16개, 전체 256개로 줄어듭니다. 대신 칠한 사각형처럼 token 하나가 latent 4×4칸을 한꺼번에 뭉칩니다." },
  { label: "attention pair", summary: "2배 → 4배 → 16배", note: "dense self-attention은 모든 token 쌍(N²)을 봅니다. patch 한 변이 4에서 2로 절반이 되면 한 축 token은 2배, 전체 token은 4배, token 쌍은 16배가 됩니다(같은 d·dense global attention 가정)." },
] as const;

const GRID = 136;
const GRID_Y = 24;
const GRID_X = [22, 182] as const;

function Grid({ p, x, dim }: { p: number; x: number; dim: boolean }) {
  const n = perAxis(p);
  const step = GRID / n;
  const lines = Array.from({ length: n + 1 }, (_, i) => i * step);
  return (
    <g opacity={dim ? 0.3 : 1}>
      <text x={x + GRID / 2} y={GRID_Y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
        p = {p}
      </text>
      <rect x={x} y={GRID_Y} width={GRID} height={GRID} fill="#f8fafc" stroke="#64748b" strokeWidth={1} />
      {lines.map((offset) => (
        <g key={offset}>
          <line x1={x + offset} x2={x + offset} y1={GRID_Y} y2={GRID_Y + GRID} stroke="#94a3b8" strokeWidth={0.5} />
          <line x1={x} x2={x + GRID} y1={GRID_Y + offset} y2={GRID_Y + offset} stroke="#94a3b8" strokeWidth={0.5} />
        </g>
      ))}
      <rect x={x + step * 2} y={GRID_Y + step * 2} width={step} height={step} fill="#2563eb" />
      <text x={x + GRID / 2} y={GRID_Y + GRID + 16} textAnchor="middle" fontSize={11} fill="#334155">
        {n} × {n} = {tokens(p).toLocaleString("en-US")} token
      </text>
    </g>
  );
}

const ROWS = [
  { name: "한 축 token (64 ÷ p)", value: perAxis, ratio: "2배" },
  { name: "전체 token N", value: tokens, ratio: "4배" },
  { name: "token 쌍 N²", value: pairs, ratio: "16배" },
] as const;

export default function PatchTokenGridViz() {
  return (
    <SceneShell
      eyebrow="Patch와 token 수"
      title="Patch 한 변이 절반이 되면 token은 4배, token 쌍은 16배가 됩니다"
      description="두 정사각형은 모두 같은 64×64 latent입니다. 선으로 나뉜 작은 사각형 하나가 Transformer token 하나가 되고, 파란 칸은 token 하나가 덮는 넓이입니다."
      ariaLabel="64×64 latent를 2×2와 4×4 patch로 잘랐을 때 token 수와 attention pair 수 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 182" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PATCHES.map((p, i) => (
              <Grid key={p} p={p} x={GRID_X[i]} dim={active < 2 && active !== i} />
            ))}
          </svg>
          <div className="mt-4 space-y-3">
            {ROWS.map((row, rowIndex) => {
              const big = row.value(2);
              const highlight = active === 2;
              return (
                <div key={row.name} className={rowIndex === 2 && active < 2 ? "opacity-60" : ""}>
                  <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold">{row.name}</span>
                    <span className={`font-mono font-bold ${highlight ? "text-primary" : "text-transparent"}`} aria-hidden={!highlight}>
                      p=2가 {row.ratio}
                    </span>
                  </div>
                  {PATCHES.map((p, i) => {
                    const value = row.value(p);
                    const visible = active === 2 || active === i;
                    return (
                      <div key={p} className={`mt-1 grid grid-cols-[2.5rem_minmax(0,1fr)_5.75rem] items-center gap-2 text-xs ${visible ? "" : "opacity-30"}`}>
                        <span className="font-mono text-muted-foreground">p={p}</span>
                        <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                          <div className="h-full rounded-sm" style={{ width: `${Math.max((value / big) * 100, 1)}%`, backgroundColor: i === 0 ? "#2563eb" : "#64748b" }} />
                        </div>
                        <span className="text-right font-mono">{value.toLocaleString("en-US")}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
