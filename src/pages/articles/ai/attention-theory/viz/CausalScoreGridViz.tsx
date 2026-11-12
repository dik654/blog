import SceneShell from "./SceneShell";

/**
 * 본문 대응: #self-attention 끝 — dense score matrix는 n×n, causal mask는 미래 위치를 막고,
 * autoregressive decode의 새 query는 과거 key/value만 읽어 한 step score가 n에 선형이다.
 * 칸 하나 = (query 행, key 열) score 하나. 8×8 틀에 n=4·5·8(가정)을 그린다.
 * n=4: 16칸, causal 허용 4·5/2=10칸 / decode 5번째 query: 5칸 / n=8: 64칸(16의 4배), causal 허용 36칸.
 */
type Mode = "dense" | "causal" | "decode";

const MAX = 8;

const SCENES = [
  {
    label: "n = 4 · dense",
    n: 4,
    mode: "dense" as Mode,
    summary: "4 × 4 = 16칸",
    note: "행이 query, 열이 key인 score 행렬입니다. 한 layer 안에서 모든 칸을 동시에 계산할 수 있지만 칸 수는 n×n입니다.",
  },
  {
    label: "n = 4 · causal mask",
    n: 4,
    mode: "causal" as Mode,
    summary: "허용 10칸 · 차단 6칸",
    note: "Causal language model은 각 query가 자기보다 뒤(미래) 위치를 읽지 못하게 mask합니다. 대각선 위쪽 6칸에 −∞를 더해 softmax weight를 0으로 만듭니다.",
  },
  {
    label: "decode · 5번째 token",
    n: 5,
    mode: "decode" as Mode,
    summary: "새로 계산하는 score 5칸",
    note: "Autoregressive decode에서는 새 token의 query 한 행만 계산합니다. 과거 key/value는 KV cache에서 읽으므로 이 step의 score 칸 수는 sequence length에 비례하고, 대신 cache가 한 칸씩 쌓입니다.",
  },
  {
    label: "n = 8 · causal mask",
    n: 8,
    mode: "causal" as Mode,
    summary: "8 × 8 = 64칸 · 16칸의 4배",
    note: "n을 4에서 8로 두 배 늘리면 score 행렬 칸은 16에서 64로 네 배가 됩니다. Causal mask로 읽는 칸도 10에서 36으로 늘어납니다. 긴 문맥 모델이 sliding window·sparse·linear attention으로 이 비용을 줄이려는 이유입니다.",
  },
] as const;

const W = 300;
const H = 286;
const LEFT = 52;
const TOP = 34;
const CELL = 28;

export default function CausalScoreGridViz() {
  return (
    <SceneShell
      eyebrow="Score matrix"
      title="Sequence가 길어지면 score 칸은 제곱으로, decode 한 step은 한 줄씩 늘어납니다"
      description="칸 하나가 query 하나와 key 하나의 score입니다. 파란 칸은 계산해 softmax에 들어가는 칸, 빗금 칸은 causal mask로 막힌 칸입니다. n=4·5·8은 설명용입니다(가정)."
      ariaLabel="sequence length n에 따른 self-attention score 행렬, causal mask, decode 한 step 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const allowed = (row: number, col: number) => scene.mode === "dense" || col <= row;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <pattern id="causal-grid-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" strokeWidth={1} />
              </pattern>
            </defs>
            <text x={LEFT + (MAX * CELL) / 2} y={14} textAnchor="middle" fontSize={11} fill="#64748b">key 위치 →</text>
            <text x={14} y={TOP + (MAX * CELL) / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(90 14 ${TOP + (MAX * CELL) / 2})`}>query 위치 →</text>
            {Array.from({ length: MAX }, (_, i) => (
              <g key={i}>
                <text x={LEFT + i * CELL + CELL / 2} y={TOP - 6} textAnchor="middle" fontSize={10} fill={i < scene.n ? "#475569" : "#cbd5e1"}>{i + 1}</text>
                <text x={LEFT - 8} y={TOP + i * CELL + CELL / 2 + 3} textAnchor="end" fontSize={10} fill={i < scene.n ? "#475569" : "#cbd5e1"}>{i + 1}</text>
              </g>
            ))}
            {Array.from({ length: MAX * MAX }, (_, k) => {
              const row = Math.floor(k / MAX);
              const col = k % MAX;
              const x = LEFT + col * CELL;
              const y = TOP + row * CELL;
              const inside = row < scene.n && col < scene.n;
              if (!inside) {
                return <rect key={k} x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={2} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 2" />;
              }
              if (!allowed(row, col)) {
                return <rect key={k} x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={2} fill="url(#causal-grid-hatch)" stroke="#94a3b8" strokeWidth={1} />;
              }
              const isNewRow = scene.mode === "decode" && row === scene.n - 1;
              const cached = scene.mode === "decode" && !isNewRow;
              return (
                <rect
                  key={k}
                  x={x + 1}
                  y={y + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={2}
                  fill={cached ? "#e2e8f0" : "#2563eb"}
                  fillOpacity={cached ? 0.5 : isNewRow ? 0.85 : 0.35}
                  stroke={cached ? "#94a3b8" : "#2563eb"}
                  strokeWidth={isNewRow ? 1.25 : 1}
                />
              );
            })}
            <text x={LEFT} y={H - 8} fontSize={10} fill="#64748b">
              {scene.mode === "decode" ? "진한 행 = 새 query 한 행 · 회색 = 이전 step에서 끝난 행" : `칸 ${scene.n * scene.n}개 중 계산 ${scene.mode === "dense" ? scene.n * scene.n : (scene.n * (scene.n + 1)) / 2}개`}
            </text>
          </svg>
        );
      }}
    />
  );
}
