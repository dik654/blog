import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data 끝 — truncation은 무엇을 보존할지 정하고, packing은 example 경계가 섞이지 않는지 확인한다.
 * 길이 상한 12, 긴 example 16 token(앞부분 6 + 최신 요청 4 + 답변 6)은 설명용 가정.
 * 앞에서 4개 자르기: 2+4+6 → 답변 6개 유지. 뒤에서 4개 자르기: 6+4+2 → 답변 2개만 남음.
 * Packing: A(prompt 2 + 답변 3) + B(prompt 3 + 답변 4) = 12 (가정).
 * Causal attention 12×12: B 행이 A 열을 보는 칸은 5×7 = 35칸.
 */
type Kind = "old" | "req" | "ans" | "aP" | "aA" | "bP" | "bA";

const LONG: readonly Kind[] = [
  ...Array<Kind>(6).fill("old"),
  ...Array<Kind>(4).fill("req"),
  ...Array<Kind>(6).fill("ans"),
];
const PACKED: readonly Kind[] = [
  ...Array<Kind>(2).fill("aP"),
  ...Array<Kind>(3).fill("aA"),
  ...Array<Kind>(3).fill("bP"),
  ...Array<Kind>(4).fill("bA"),
];
const A_LEN = 5;

const SCENES = [
  {
    label: "앞부분을 자르면",
    summary: "16 → 12 · 답변 6개 그대로",
    note: "길이 상한 12보다 4개 긴 example입니다(가정). 앞에서 4개를 자르면 오래된 대화 일부만 빠지고 최신 요청과 답변 6개가 남습니다. 채점할 답변 token은 그대로지만, 잘린 앞부분의 맥락은 모델이 보지 못합니다.",
    mode: "front",
  },
  {
    label: "뒷부분을 자르면",
    summary: "16 → 12 · 답변 6개 중 2개만 남음",
    note: "같은 example을 뒤에서 자르면 앞부분은 모두 남지만 답변이 4개 잘려 mask=1인 token이 2개로 줄어듭니다. 답변이 통째로 잘리면 mask가 모두 0인 example이 됩니다. 어느 쪽을 남길지는 규칙으로 정해 두어야 합니다.",
    mode: "back",
  },
  {
    label: "Packing · 경계 없음",
    summary: "B의 7개 token이 A를 참고하는 칸 35개",
    note: "짧은 example A(5 token)와 B(7 token)를 한 sequence 12칸에 이어 붙인 것이 packing입니다(가정). 아래 격자의 행은 지금 계산하는 token, 열은 그 token이 참고할 수 있는 앞쪽 token입니다. 경계를 두지 않으면 B의 token이 관계없는 A까지 참고합니다(빨간 칸).",
    mode: "mixed",
  },
  {
    label: "Packing · 경계 있음",
    summary: "A는 A끼리, B는 B끼리만",
    note: "Example 경계에서 attention을 끊으면 격자가 두 블록으로 나뉘어 B는 자기 token만 참고합니다. 채점도 A의 답변 3개, B의 답변 4개가 각자 위치에서만 이루어지는지 함께 확인합니다.",
    mode: "split",
  },
] as const;

const FILL: Record<Kind, string> = {
  old: "#cbd5e1",
  req: "#64748b",
  ans: "#2563eb",
  aP: "#94a3b8",
  aA: "#2563eb",
  bP: "#94a3b8",
  bA: "#2563eb",
};
const MASKED = new Set<Kind>(["ans", "aA", "bA"]);

const PITCH = 16;
const SLOT = 14;
const X0 = 10;
const WIN_START = 4;
const WIN_LEN = 12;
const STRIP_Y = 40;
const sx = (slot: number) => X0 + slot * PITCH;

const CELL = 10;
const GX = 120;
const GY = 104;

const BLUE = "#2563eb";
const RED = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

export default function TruncationPackingViz() {
  return (
    <SceneShell
      eyebrow="Truncation · Packing"
      title="12칸에 무엇을 남기고, 이어 붙인 example을 어떻게 떼어 둘까"
      description="칸 하나가 token 하나이고 파란 칸은 mask=1인 답변 token입니다. 파란 테두리는 sequence 길이 상한 12칸입니다. 길이와 example 구성은 설명용 가정입니다."
      ariaLabel="길이 상한을 넘는 example의 앞자르기와 뒷자르기, packing에서 attention 경계 유무 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const packing = s.mode === "mixed" || s.mode === "split";
        const offset = s.mode === "front" ? 0 : WIN_START;
        const tokens = packing ? PACKED : LONG;
        const kept = tokens.filter((kind, i) => {
          const slot = (packing ? WIN_START : offset) + i;
          return slot >= WIN_START && slot < WIN_START + WIN_LEN && MASKED.has(kind);
        }).length;
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {packing ? (
                <>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#94a3b8" }} />prompt · m=0</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: BLUE }} />답변 · m=1</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: RED }} />다른 example 참고</span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#cbd5e1" }} />이전 대화</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#64748b" }} />최신 요청</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: BLUE }} />답변 · m=1</span>
                </>
              )}
            </div>
            <svg viewBox="0 0 340 232" className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${s.label}: ${s.summary}`}>
              <rect x={sx(WIN_START) - 3} y={STRIP_Y - 5} width={WIN_LEN * PITCH + 4} height={SLOT + 10} rx={3} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={sx(WIN_START) - 3} y={STRIP_Y - 11} fontSize={10} fill={BLUE}>길이 상한 12칸</text>
              {tokens.map((kind, i) => {
                const slot = (packing ? WIN_START : offset) + i;
                const inside = slot >= WIN_START && slot < WIN_START + WIN_LEN;
                return (
                  <g key={i}>
                    <rect x={sx(slot)} y={STRIP_Y} width={SLOT} height={SLOT} rx={2} fill={FILL[kind]} opacity={inside ? 1 : 0.25} />
                    {!inside && <line x1={sx(slot)} y1={STRIP_Y + SLOT} x2={sx(slot) + SLOT} y2={STRIP_Y} stroke={RED} strokeWidth={1} />}
                    {inside && (
                      <text x={sx(slot) + SLOT / 2} y={STRIP_Y + SLOT + 14} fontSize={9} textAnchor="middle" fill={MASKED.has(kind) ? BLUE : MUTED}>
                        {MASKED.has(kind) ? 1 : 0}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={sx(WIN_START) - 8} y={STRIP_Y + SLOT + 14} fontSize={9} textAnchor="end" fill={MUTED}>m</text>
              {packing && (
                <>
                  <line x1={sx(WIN_START + A_LEN) - 1} x2={sx(WIN_START + A_LEN) - 1} y1={STRIP_Y - 4} y2={STRIP_Y + SLOT + 4} stroke="currentColor" strokeWidth={1.25} />
                  <text x={sx(WIN_START) + (A_LEN * PITCH) / 2} y={STRIP_Y + SLOT + 28} fontSize={10} fontWeight={700} textAnchor="middle" fill="currentColor">A</text>
                  <text x={sx(WIN_START + A_LEN) + ((WIN_LEN - A_LEN) * PITCH) / 2} y={STRIP_Y + SLOT + 28} fontSize={10} fontWeight={700} textAnchor="middle" fill="currentColor">B</text>
                </>
              )}
              {!packing && (
                <>
                  <text x={170} y={18} fontSize={10} textAnchor="middle" fill={MUTED}>
                    {s.mode === "front" ? "← 앞의 4개를 버림" : "뒤의 4개를 버림 →"}
                  </text>
                  <text x={170} y={140} fontSize={14} fontWeight={700} textAnchor="middle" fill={kept === 6 ? BLUE : RED}>
                    채점할 답변 token {kept}개 / 6개
                  </text>
                  <text x={170} y={162} fontSize={11} textAnchor="middle" fill={MUTED}>
                    {s.mode === "front" ? "잘린 것: 이전 대화 4개" : "잘린 것: 답변 4개"}
                  </text>
                </>
              )}
              {packing && (
                <>
                  <text x={GX} y={GY - 8} fontSize={10} fill={MUTED}>참고하는 token →</text>
                  <text x={GX - 6} y={GY + 4} fontSize={10} textAnchor="end" fill={MUTED}>지금</text>
                  <text x={GX - 6} y={GY + 16} fontSize={10} textAnchor="end" fill={MUTED}>token ↓</text>
                  {PACKED.map((_, row) =>
                    PACKED.map((__, col) => {
                      const causal = col <= row;
                      const sameA = row < A_LEN && col < A_LEN;
                      const sameB = row >= A_LEN && col >= A_LEN;
                      const cross = causal && !sameA && !sameB;
                      const fill = !causal ? "none" : sameA || sameB ? BLUE : s.mode === "mixed" ? RED : "none";
                      return (
                        <rect
                          key={`${row}-${col}`}
                          x={GX + col * CELL}
                          y={GY + row * CELL}
                          width={CELL - 1.5}
                          height={CELL - 1.5}
                          fill={fill}
                          fillOpacity={cross ? 0.75 : 0.45}
                          stroke={LINE}
                          strokeWidth={0.5}
                          strokeOpacity={0.5}
                        />
                      );
                    }),
                  )}
                  <rect x={GX - 1} y={GY - 1} width={A_LEN * CELL} height={A_LEN * CELL} fill="none" stroke="currentColor" strokeWidth={1} />
                  <rect x={GX + A_LEN * CELL - 1} y={GY + A_LEN * CELL - 1} width={(WIN_LEN - A_LEN) * CELL} height={(WIN_LEN - A_LEN) * CELL} fill="none" stroke="currentColor" strokeWidth={1} />
                  <text x={GX + WIN_LEN * CELL + 8} y={GY + 4 * CELL} fontSize={10} fill={s.mode === "mixed" ? RED : MUTED}>
                    {s.mode === "mixed" ? "B → A: 35칸" : "B → A: 0칸"}
                  </text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
