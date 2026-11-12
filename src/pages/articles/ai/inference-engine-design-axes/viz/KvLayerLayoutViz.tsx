import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kv-unit 마지막 문단 — 같은 32 token을 host로 옮길 때의 배치 차이.
 * token 하나 KV = 32층 × 4 KiB = 128 KiB. TensorRT-LLM block = 32 token × 128 KiB = 4 MiB 한 덩어리.
 * vLLM은 층마다 따로 된 tensor라 16 token block 2개 × 32층 = 64조각, 조각 하나 16 × 4 KiB = 64 KiB.
 */
const LAYERS = 32;
const TOKENS = 32;
const LAYER_KIB = 4;
const VLLM_BLOCK = 16;
const PIECES = (TOKENS / VLLM_BLOCK) * LAYERS;
const PIECE_KIB = VLLM_BLOCK * LAYER_KIB;
const TOKEN_KIB = LAYERS * LAYER_KIB;

const SCENES = [
  { label: "칸 하나 = 한 층의 한 token", summary: `32층 × 4 KiB = ${TOKEN_KIB} KiB`, note: "가로가 token 32개, 세로가 층 32개입니다. 칸 하나에는 한 층에서 한 token의 K·V 4 KiB가 들어가고, 세로 한 줄을 모으면 token 하나의 KV 128 KiB입니다." },
  { label: "TensorRT-LLM · block 1개", summary: "32 token × 128 KiB = 4 MiB", note: "TensorRT-LLM의 32칸 block 하나는 32개 층의 K·V를 모두 담습니다. 이 32 token은 4 MiB 한 덩어리입니다." },
  { label: "vLLM · block 2개", summary: `${PIECES}번 × ${PIECE_KIB} KiB 복사`, note: "vLLM은 block 번호를 모든 층이 함께 쓰지만 저장은 층마다 따로 된 tensor에 있습니다. 같은 32 token을 host(CPU 쪽 메모리)로 옮기면 block 2개 × 층 32개 = 64번의 64 KiB 복사가 됩니다." },
] as const;

const W = 360;
const H = 258;
const LEFT = 52;
const TOP = 30;
const CELL_W = 9;
const ROW_H = 5;
const GAP_X = 6;
const GAP_Y = 1;

function Grid({ active }: { active: number }) {
  const split = active === 2;
  const gx = split ? GAP_X : 0;
  const gy = split ? GAP_Y : 0;
  const halfW = VLLM_BLOCK * CELL_W;
  const rowY = (layer: number) => TOP + layer * (ROW_H + gy);
  const gridH = rowY(LAYERS - 1) + ROW_H - TOP;
  const gridW = TOKENS * CELL_W + gx;
  const rows = Array.from({ length: LAYERS }, (_, layer) => layer);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={LEFT} y={TOP - 10} fontSize={11} fill="#64748b">token 0</text>
      <text x={LEFT + gridW} y={TOP - 10} textAnchor="end" fontSize={11} fill="#64748b">token 31</text>
      <text x={LEFT - 6} y={TOP + 5} textAnchor="end" fontSize={11} fill="#64748b">층 0</text>
      <text x={LEFT - 6} y={TOP + gridH} textAnchor="end" fontSize={11} fill="#64748b">층 31</text>

      {active === 0 && (
        <>
          <rect x={LEFT} y={TOP} width={gridW} height={gridH} fill="#93c5fd" opacity={0.25} />
          {rows.map((layer) => (
            <rect key={layer} x={LEFT} y={rowY(layer)} width={CELL_W} height={ROW_H} fill="#2563eb" stroke="#ffffff" strokeWidth={0.5} />
          ))}
          <rect x={LEFT} y={TOP} width={CELL_W} height={gridH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
          <text x={LEFT + CELL_W + 8} y={TOP + gridH / 2} fontSize={11} fontWeight={700} fill="#2563eb">← token 하나 = 세로 한 줄 128 KiB</text>
        </>
      )}

      {active === 1 && (
        <>
          <rect x={LEFT} y={TOP} width={gridW} height={gridH} fill="#16a34a" opacity={0.35} />
          <rect x={LEFT} y={TOP} width={gridW} height={gridH} fill="none" stroke="#16a34a" strokeWidth={1.25} />
          <text x={LEFT + gridW / 2} y={TOP + gridH / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#166534">block 1개 · 4 MiB</text>
        </>
      )}

      {active === 2 &&
        rows.map((layer) =>
          [0, 1].map((half) => (
            <rect
              key={`${layer}-${half}`}
              x={LEFT + half * (halfW + gx)}
              y={rowY(layer)}
              width={halfW}
              height={ROW_H}
              fill={half === 0 ? "#d97706" : "#f59e0b"}
              opacity={0.75}
            />
          )),
        )}

      <text x={LEFT + gridW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">
        {active === 2 ? `조각 하나 = 층 1개 × 16 token = ${PIECE_KIB} KiB` : active === 1 ? "32층 × 32 token이 한 덩어리" : `칸 하나 = ${LAYER_KIB} KiB`}
      </text>
    </svg>
  );
}

export default function KvLayerLayoutViz() {
  return (
    <SceneShell
      eyebrow="block 안의 층 배치"
      title="같은 32 token이 한 덩어리일 수도, 64조각일 수도 있습니다"
      description="Llama 3 8B 모양(층 32개, 층당 token 하나 4 KiB)으로 같은 32 token의 KV를 그렸습니다. 두 번째·세 번째 장면에서 진한 색 덩어리 하나가 따로 떨어져 저장된 한 단위입니다."
      ariaLabel="TensorRT-LLM과 vLLM이 32 token의 KV를 층별로 배치하는 차이"
      scenes={SCENES}
      render={(active) => <Grid active={active} />}
    />
  );
}
