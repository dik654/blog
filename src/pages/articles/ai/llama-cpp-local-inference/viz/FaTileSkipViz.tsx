import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mask-source — CUDA FlashAttention은 mask를 끝에서부터 256칸 tile 단위로 보며
 * 모두 −∞인 tile만 계산 범위에서 뺀다. 중간에 낀 −∞ 칸은 계산한 뒤 버린다.
 * 이 훑기는 query 1,024개 이상 또는 stream 여럿일 때만 켠다.
 * n_kv 1,536(tile 6개)과 칸 무늬는 설명용 가정이다. 작은 사각형 하나 = cell 16개.
 */
const TILE = 256;
const KEEP: readonly (readonly number[])[] = [
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const TILES = KEEP.length;
const N_KV = TILES * TILE;
/** 끝에서부터 모두 −∞인 tile이 이어지는 동안 줄인 경계: 마지막으로 0이 있는 tile 다음 */
const LAST_LIVE = KEEP.reduce<number>((last, tile, index) => (tile.some((cell) => cell === 1) ? index : last), -1);
const KV_MAX = (LAST_LIVE + 1) * TILE;

const SCENES = [
  { label: "mask 행을 256칸 tile로 자릅니다", summary: `n_kv ${N_KV.toLocaleString("en-US")} = tile ${TILES}개`, mode: "plain", note: "파란 칸이 남길 칸(0), 회색 칸이 지울 칸(−∞)입니다. 커널은 이 행을 256 cell짜리 tile 단위로 봅니다. tile 수와 무늬는 그림을 위한 가정입니다." },
  { label: "끝에서부터 훑습니다", summary: `tile 5·4 생략 → ${KV_MAX.toLocaleString("en-US")}칸 계산`, mode: "scan", note: "맨 뒤 tile부터 보며 칸이 모두 −∞이면 계산 범위에서 뺍니다. tile 3에서 0인 칸을 만나는 순간 멈추고, 계산 범위는 tile 0~3입니다." },
  { label: "중간의 −∞는 건너뛰지 않습니다", summary: "tile 2는 전부 −∞여도 계산", mode: "middle", note: "tile 2는 모두 −∞지만 끝에 붙어 있지 않아 범위에 남습니다. tile 0·1·3 사이사이에 낀 회색 칸(예: 다른 sequence의 cell)도 점수까지 계산한 뒤 버립니다." },
  { label: "조건이 거짓이면 훑지 않습니다", summary: `query 4 · stream 1 → ${N_KV.toLocaleString("en-US")}칸 전부`, mode: "off", note: "이 훑기는 query가 1,024개 이상이거나 stream이 여럿일 때만 켭니다. unified 배열에서 slot 네 개가 한 token씩 decode하는 step은 query 4개, stream 1개라 끝 tile도 그대로 계산합니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 9;
const GAP = 6;
const TW = (W - 2 * LEFT - (TILES - 1) * GAP) / TILES;
const CELL = 11;
const CELL_GAP = (TW - 4 * CELL) / 3;
const TOP = 30;
const tx = (tile: number) => LEFT + tile * (TW + GAP);

export default function FaTileSkipViz() {
  return (
    <SceneShell
      eyebrow="FlashAttention 끝 tile 생략"
      title="mask 끝에 붙은 −∞ tile만 계산에서 빠집니다"
      description="한 query의 mask 행입니다. 작은 사각형 하나가 cell 16개이고, 파랑은 남길 칸(0), 회색은 지울 칸(−∞)입니다. tile 6개와 칸 무늬는 설명용 가정입니다."
      ariaLabel="mask 행을 256칸 tile로 나눠 끝에서부터 모두 −∞인 tile을 생략하는 과정"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const skipped = (tile: number) => (mode === "scan" || mode === "middle") && tile > LAST_LIVE;
        const computedEnd = mode === "plain" ? null : mode === "off" ? TILES : LAST_LIVE + 1;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {KEEP.map((tile, t) => {
                const dim = skipped(t);
                const highlightMiddle = mode === "middle" && t === 2;
                return (
                  <g key={t} opacity={dim ? 0.3 : 1}>
                    <text x={tx(t) + TW / 2} y={TOP - 8} textAnchor="middle" fontSize={12} fontWeight={highlightMiddle ? 700 : 400} fill={highlightMiddle ? "#b45309" : "#64748b"}>
                      tile {t}
                    </text>
                    <rect x={tx(t) - 2} y={TOP - 2} width={TW + 4} height={4 * CELL + 3 * CELL_GAP + 4} rx={4} fill="none" stroke={highlightMiddle ? "#b45309" : "#94a3b8"} strokeWidth={highlightMiddle ? 1.25 : 1} />
                    {tile.map((keep, c) => (
                      <rect
                        key={c}
                        x={tx(t) + (c % 4) * (CELL + CELL_GAP)}
                        y={TOP + Math.floor(c / 4) * (CELL + CELL_GAP)}
                        width={CELL}
                        height={CELL}
                        rx={1.5}
                        fill={keep ? "#2563eb" : "#cbd5e1"}
                      />
                    ))}
                  </g>
                );
              })}
              {KEEP.map((_, t) =>
                skipped(t) ? (
                  <text key={`skip-${t}`} x={tx(t) + TW / 2} y={TOP + 2 * CELL + 1.5 * CELL_GAP + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
                    생략
                  </text>
                ) : null,
              )}
              {computedEnd !== null && (
                <g>
                  <line x1={LEFT} x2={tx(computedEnd - 1) + TW} y1={104} y2={104} stroke="#2563eb" strokeWidth={1.25} />
                  <line x1={LEFT} x2={LEFT} y1={99} y2={109} stroke="#2563eb" strokeWidth={1.25} />
                  <line x1={tx(computedEnd - 1) + TW} x2={tx(computedEnd - 1) + TW} y1={99} y2={109} stroke="#2563eb" strokeWidth={1.25} />
                  <text x={LEFT} y={124} fontSize={11} fontWeight={700} fill="#2563eb">
                    계산 범위 cell 0~{(computedEnd * TILE - 1).toLocaleString("en-US")}
                  </text>
                </g>
              )}
              {mode === "scan" && (
                <text x={W - LEFT} y={124} textAnchor="end" fontSize={11} fill="#475569">
                  ← 끝에서부터 확인
                </text>
              )}
              <text x={LEFT} y={H - 6} fontSize={11} fill="#64748b">
                {mode === "off"
                  ? "훑기 꺼짐: query 4 < 1,024, stream 1"
                  : mode === "plain"
                    ? "훑기 조건: query ≥ 1,024 또는 stream 여럿"
                    : "조건 충족을 가정: query ≥ 1,024 또는 stream 여럿"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
