import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window AlgorithmBlock — rolling-buffer KV cache. idx = i mod W, valid = min(i+1, W).
 * 실제 W=4096 을 W=4 로 줄였다(가정). i=1: slot 1, valid 2 · i=3: 가득 · i=4: slot 0 에 덮어써 token 0 사라짐 · i=6: slot 2.
 */
const BUF = 4;
const STREAM = 8;

const SCENES = [
  { label: "i = 1", summary: "1 mod 4 = 1 · valid 2", i: 1, note: "초반에는 buffer 가 다 차지 않았습니다. 위치 1 은 slot 1 에 쓰이고, 실제로 쓰인 slot 2 개(token 0·1)만 봅니다." },
  { label: "i = 3", summary: "3 mod 4 = 3 · 가득 참", i: 3, note: "token 0~3 이 slot 0~3 을 채웠습니다. 여기서부터 buffer 는 더 커지지 않습니다." },
  { label: "i = 4", summary: "4 mod 4 = 0 · token 0 덮어씀", i: 4, note: "위치 4 는 slot 0 에 그대로 덮어씁니다. Shift 없이 token 0 의 K·V 가 사라지고, query 4 는 token 1~4 를 봅니다." },
  { label: "i = 6", summary: "6 mod 4 = 2 · token 2 덮어씀", i: 6, note: "slot 순서(4, 5, 6, 3)와 위치 순서는 다르지만 j mod 4 로 찾아 읽으므로 token 3~6 을 봅니다. 메모리는 계속 slot 4 개입니다." },
] as const;

const VW = 360;
const CELL = 34;
const STREAM_X = (VW - STREAM * CELL - (STREAM - 1) * 6) / 2;
const sx = (pos: number) => STREAM_X + pos * (CELL + 6);
const BUF_CELL = 56;
const BUF_X = (VW - BUF * BUF_CELL - (BUF - 1) * 10) / 2;
const bx = (slot: number) => BUF_X + slot * (BUF_CELL + 10);
const STREAM_Y = 26;
const BUF_Y = 116;
const VH = 196;

export default function RollingBufferViz() {
  return (
    <SceneShell
      eyebrow="Rolling-buffer KV cache"
      title="위치 i 는 i mod W 번 slot 에 덮어쓰고, buffer 크기는 W 로 고정됩니다"
      description="위 줄은 지금까지 들어온 token 위치, 아래 칸은 KV 를 담는 순환 buffer 의 slot 입니다. 실제 W=4,096 을 W=4 로 줄였습니다(가정)."
      ariaLabel="W=4 rolling buffer 에서 위치 i 가 i mod 4 slot 에 덮어써지는 모습"
      scenes={SCENES}
      render={(active) => {
        const i = SCENES[active].i;
        const idx = i % BUF;
        const valid = Math.min(i + 1, BUF);
        const slots = Array.from({ length: BUF }, (_, slot) => {
          const latest = Math.floor((i - slot) / BUF) * BUF + slot;
          return slot <= i ? latest : null;
        });
        return (
          <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={sx(0)} y={STREAM_Y - 8} fontSize={11} fill="#64748b">token 위치</text>
            {Array.from({ length: STREAM }, (_, pos) => {
              const future = pos > i;
              const seen = !future && pos > i - valid;
              const dropped = !future && !seen;
              const current = pos === i;
              return (
                <g key={pos}>
                  <rect
                    x={sx(pos)}
                    y={STREAM_Y}
                    width={CELL}
                    height={28}
                    rx={4}
                    fill={seen ? "#2563eb" : "none"}
                    fillOpacity={seen ? 0.2 : 0}
                    stroke={current ? "#d97706" : seen ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={current ? 1.25 : 1}
                    strokeDasharray={future ? "3 3" : undefined}
                  />
                  <text x={sx(pos) + CELL / 2} y={STREAM_Y + 18} textAnchor="middle" fontSize={11} fontWeight={current ? 700 : 400} fill={future || dropped ? "#94a3b8" : "#1e293b"} textDecoration={dropped ? "line-through" : undefined}>
                    {pos}
                  </text>
                  {dropped && (
                    <text x={sx(pos) + CELL / 2} y={STREAM_Y + 42} textAnchor="middle" fontSize={10} fill="#94a3b8">사라짐</text>
                  )}
                </g>
              );
            })}
            <line x1={sx(i) + CELL / 2} y1={STREAM_Y + 30} x2={bx(idx) + BUF_CELL / 2} y2={BUF_Y - 4} stroke="#d97706" strokeWidth={1.25} />
            <path d={`M ${bx(idx) + BUF_CELL / 2 - 4} ${BUF_Y - 9} L ${bx(idx) + BUF_CELL / 2} ${BUF_Y - 3} L ${bx(idx) + BUF_CELL / 2 + 4} ${BUF_Y - 9}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
            {slots.map((token, slot) => {
              const written = slot === idx;
              return (
                <g key={slot}>
                  <rect
                    x={bx(slot)}
                    y={BUF_Y}
                    width={BUF_CELL}
                    height={40}
                    rx={6}
                    fill={written ? "#d97706" : token === null ? "none" : "#2563eb"}
                    fillOpacity={written ? 0.2 : token === null ? 0 : 0.12}
                    stroke={written ? "#d97706" : token === null ? "#cbd5e1" : "#2563eb"}
                    strokeWidth={written ? 1.25 : 1}
                    strokeDasharray={token === null ? "3 3" : undefined}
                  />
                  <text x={bx(slot) + BUF_CELL / 2} y={BUF_Y + 25} textAnchor="middle" fontSize={12} fontWeight={700} fill={token === null ? "#94a3b8" : "#1e293b"}>
                    {token === null ? "빈칸" : `K·V ${token}`}
                  </text>
                  <text x={bx(slot) + BUF_CELL / 2} y={BUF_Y + 54} textAnchor="middle" fontSize={11} fill="#64748b">slot {slot}</text>
                </g>
              );
            })}
            <text x={VW / 2} y={VH - 6} textAnchor="middle" fontSize={11} fill="#334155">
              idx = {i} mod 4 = {idx} · valid = min({i + 1}, 4) = {valid} · buffer 4 칸 고정
            </text>
          </svg>
        );
      }}
    />
  );
}
