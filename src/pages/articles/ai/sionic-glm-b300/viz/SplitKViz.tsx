import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel 1절 — 출력 tile이 적으면 CTA가 적어 SM 대부분이 memory request를 내지 못하고,
 * Split-K는 K축을 여러 CTA로 나눠 그 수를 늘리는 대신 부분합 reduction 비용을 더한다.
 * tile 4개·K 조각 4개·SM 16개는 모양을 보이려는 가정이다.
 */
const TILES = 4;
const SPLITS = 4;
const SMS = 16;
const MX = 22;
const MY = 40;
const CELL_W = 30;
const CELL_H = 28;
const GX = 206;
const GY = 40;
const SM = 26;
const SM_GAP = 8;
const COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed"] as const;
const palette: readonly string[] = COLORS;

const SCENES = [
  {
    label: "출력 tile이 적으면",
    summary: "CTA 4개 → SM 4개만 요청",
    note: "batch 1에서는 출력이 한 줄뿐이라 출력 tile 수가 적습니다. SM은 GPU 안의 연산 묶음이고, CTA는 한 SM에 함께 배정되는 thread 묶음입니다. 그림은 tile 4개(가정)라 CTA도 4개이고, SM 16개(가정) 중 4개만 weight를 읽으러 memory request를 냅니다.",
  },
  {
    label: "K축을 나누면",
    summary: "CTA 16개 → SM 16개가 요청",
    note: "K축은 곱한 값들을 더해 하나로 합치는 축입니다. 각 tile의 K축을 4조각(가정)으로 나눠 조각마다 CTA를 하나씩 두면 CTA가 16개가 되어 더 많은 SM이 동시에 memory request를 냅니다. 이것이 occupancy와 memory-level parallelism을 늘리는 방법입니다.",
  },
  {
    label: "부분합을 다시 더하는 비용",
    summary: "tile마다 부분합 4개 → 1개",
    note: "조각마다 나온 값은 부분합이라 tile마다 4개를 다시 더해야 합니다. 이 reduction이 Split-K가 추가하는 비용이므로 항상 유리하지 않고, shape별로 split 수와 reduction overhead를 튜닝해야 합니다.",
  },
] as const;

export default function SplitKViz() {
  return (
    <SceneShell
      eyebrow="Split-K"
      title="K축을 나누면 일하는 SM이 늘고, 더할 부분합이 생깁니다"
      description="왼쪽은 weight 행렬, 오른쪽은 GPU의 SM입니다. 같은 색은 같은 출력 tile이며, K축을 나누면 한 tile을 CTA 여러 개가 나눠 맡습니다. tile·조각·SM 수는 가정입니다."
      ariaLabel="출력 tile이 적을 때와 K축을 나눴을 때 일하는 SM 수, 그리고 부분합 reduction"
      scenes={SCENES}
      render={(active) => {
        const split = active > 0;
        const busy = split ? TILES * SPLITS : TILES;
        return (
          <svg viewBox="0 0 360 228" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={MX} y={MY - 22} fontSize={11} fontWeight={700} fill="#64748b">weight 행렬</text>
            <text x={MX + (TILES * CELL_W) / 2} y={MY - 6} textAnchor="middle" fontSize={10.5} fill="#64748b">출력 tile 4개 (가정) →</text>
            <text x={MX - 8} y={MY + (SPLITS * CELL_H) / 2} textAnchor="middle" fontSize={10.5} fill="#64748b" transform={`rotate(-90 ${MX - 8} ${MY + (SPLITS * CELL_H) / 2})`}>K축 →</text>
            {Array.from({ length: TILES }, (_, tile) =>
              Array.from({ length: SPLITS }, (_, k) => {
                const color = palette[tile];
                const x = MX + tile * CELL_W;
                const y = MY + k * CELL_H;
                return (
                  <g key={`${tile}-${k}`}>
                    <rect x={x} y={y} width={CELL_W} height={CELL_H} fill={color} fillOpacity={split ? 0.12 + k * 0.1 : 0.22} stroke="#94a3b8" strokeWidth={1} />
                    {split && <line x1={x} x2={x + CELL_W} y1={y} y2={y} stroke={color} strokeWidth={1.25} />}
                  </g>
                );
              }),
            )}
            {Array.from({ length: TILES }, (_, tile) => (
              <rect key={`o-${tile}`} x={MX + tile * CELL_W} y={MY} width={CELL_W} height={SPLITS * CELL_H} fill="none" stroke={palette[tile]} strokeWidth={1.25} />
            ))}

            {active === 2 &&
              Array.from({ length: TILES }, (_, tile) => {
                const cx = MX + tile * CELL_W + CELL_W / 2;
                const cy = MY + SPLITS * CELL_H + 24;
                return (
                  <g key={`r-${tile}`}>
                    <line x1={cx} y1={MY + SPLITS * CELL_H} x2={cx} y2={cy - 9} stroke={palette[tile]} strokeWidth={1.25} />
                    <circle cx={cx} cy={cy} r={9} fill="none" stroke={palette[tile]} strokeWidth={1.25} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={palette[tile]}>+</text>
                  </g>
                );
              })}
            {active === 2 && (
              <text x={MX} y={MY + SPLITS * CELL_H + 52} fontSize={11} fill="#d97706">부분합 4개씩 더하기 = 추가 비용</text>
            )}

            <text x={GX} y={MY - 22} fontSize={11} fontWeight={700} fill="#64748b">SM 16개 (가정)</text>
            {Array.from({ length: SMS }, (_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const working = i < busy;
              const owner = split ? Math.floor(i / SPLITS) : i;
              return (
                <rect
                  key={`sm-${i}`}
                  x={GX + col * (SM + SM_GAP)}
                  y={GY + row * (SM + SM_GAP)}
                  width={SM}
                  height={SM}
                  rx={3}
                  fill={working ? palette[owner] : "#94a3b8"}
                  fillOpacity={working ? 0.55 : 0.12}
                  stroke={working ? palette[owner] : "#94a3b8"}
                  strokeWidth={1}
                />
              );
            })}
            <text x={GX} y={GY + 4 * (SM + SM_GAP) + 10} fontSize={11} fill="#64748b">
              {`memory request: ${busy} / ${SMS}`}
            </text>
            <text x={GX} y={GY + 4 * (SM + SM_GAP) + 26} fontSize={11} fill="#64748b">
              {busy < SMS ? `${SMS - busy}개는 놂` : "모두 요청 중"}
            </text>
          </svg>
        );
      }}
    />
  );
}
