import SceneShell from "./SceneShell";

/**
 * 본문 대응: #corruption — N = 10,000에서 기대값 target 1,500 → MASK 1,200 · random 150 · unchanged 150.
 * 칸 하나 = token 50개, 200칸 = 10,000. 선택 30칸 = 1,500, MASK 24칸 · random 3칸 · unchanged 3칸.
 * 선택 칸의 위치는 예시이며(가정) 실제로는 위치마다 독립 sampling합니다.
 */
const CELLS = 200;
const PER_CELL = 50;
type Kind = "mask" | "random" | "same";
// 흩어진 예시 위치를 고정된 식으로 고릅니다(가정). 매 render마다 같은 30칸이 나옵니다.
const scatterKey = (i: number) => (i * i * 31 + i * 17) % 997;
const SELECTED: ReadonlyMap<number, Kind> = new Map(
  Array.from({ length: CELLS }, (_, i) => i)
    .sort((a, b) => scatterKey(a) - scatterKey(b))
    .slice(0, 30)
    .map((cellIndex, k) => [cellIndex, (k < 24 ? "mask" : k < 27 ? "random" : "same") as Kind]),
);

const COLOR: Record<Kind, string> = { mask: "#2563eb", random: "#d97706", same: "#7c3aed" };
const LABEL: Record<Kind, string> = { mask: "[MASK]", random: "random", same: "unchanged" };
const GLYPH: Record<Kind, string> = { mask: "M", random: "R", same: "U" };

const SCENES = [
  {
    label: "선택 가능한 token",
    summary: "200칸 × 50 = 10,000",
    note: "PAD·special token을 뺀 선택 가능 위치만 셉니다. 칸 하나가 token 50개입니다.",
  },
  {
    label: "15%를 target으로 선택",
    summary: "10,000 × .15 = 1,500",
    note: "먼저 전체에서 약 15%를 prediction 문제로 고릅니다. 이 30칸(1,500개)이 집합 M이고, 나머지 170칸(8,500개)은 loss를 받지 않습니다.",
  },
  {
    label: "M 안에서 80·10·10",
    summary: "1,500 → 1,200 · 150 · 150",
    note: "두 번째 sampling은 선택된 30칸 안에서만 일어납니다. 24칸은 [MASK]라는 특수 기호로, 3칸은 random token으로 바꾸고, 3칸은 원래 token 그대로 둡니다.",
  },
  {
    label: "전체 기준으로 다시 보기",
    summary: "MASK = 전체의 12%",
    note: "80%는 M 안의 비율이라 [MASK]는 전체 10,000개 중 1,200개, 즉 12%입니다. random·unchanged는 각각 1.5%이고, unchanged 150개도 M에 속하므로 loss를 받습니다.",
  },
] as const;

export default function NestedSplitViz() {
  return (
    <SceneShell
      eyebrow="두 번의 sampling"
      title="10,000 token에서 1,500을 고르고 그 안을 다시 나눕니다"
      description="칸 하나가 token 50개입니다. 숫자는 각 위치를 독립 sampling할 때의 기대값이고, 실제 batch count는 다를 수 있습니다. 칸의 위치는 예시입니다(가정)."
      ariaLabel="10,000개 중 15%인 1,500개를 고르고, 그 안을 MASK 1,200, random 150, unchanged 150으로 나누는 기대값"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 400 204" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: CELLS }, (_, index) => {
              const kind = SELECTED.get(index);
              const x = (index % 20) * 20;
              const y = Math.floor(index / 20) * 20;
              const fill =
                active === 0 ? "#94a3b8" : kind === undefined ? "#cbd5e1" : active === 1 ? "#0f766e" : COLOR[kind];
              const opacity = active === 0 ? 0.55 : kind === undefined ? 0.35 : 1;
              // 색만으로 branch를 구분하지 않도록 선택 칸에 글자를 함께 둡니다(M·R·U, 범례와 같은 글자).
              const glyph = active >= 2 && kind !== undefined ? GLYPH[kind] : active === 1 && kind !== undefined ? "✓" : "";
              return (
                <g key={index}>
                  <rect x={x + 1} y={y + 1} width={18} height={18} rx={2} fill={fill} opacity={opacity} />
                  {glyph && (
                    <text x={x + 10} y={y + 13.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
                      {glyph}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <ul className="mt-3 flex min-h-[2.5rem] flex-wrap content-start gap-x-4 gap-y-1 text-[11px] sm:text-xs">
            {active === 0 && (
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#94a3b8" }} />
                선택 가능 200칸 · {(CELLS * PER_CELL).toLocaleString("en-US")}개
              </li>
            )}
            {active === 1 && (
              <>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[9px] font-bold text-white" style={{ backgroundColor: "#0f766e" }}>
                    ✓
                  </span>
                  target M 30칸 · 1,500개
                </li>
                <li className="flex items-center gap-1.5 text-muted-foreground">
                  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm opacity-50" style={{ backgroundColor: "#cbd5e1" }} />
                  선택 안 됨 170칸 · 8,500개 · loss 없음
                </li>
              </>
            )}
            {active >= 2 &&
              (["mask", "random", "same"] as const).map((kind) => {
                const cells = kind === "mask" ? 24 : 3;
                const share = active === 3 ? ` · 전체의 ${((cells * PER_CELL) / (CELLS * PER_CELL)) * 100}%` : "";
                return (
                  <li key={kind} className="flex items-center gap-1.5">
                    <span aria-hidden className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[9px] font-bold text-white" style={{ backgroundColor: COLOR[kind] }}>
                      {GLYPH[kind]}
                    </span>
                    {LABEL[kind]} {cells}칸 · {(cells * PER_CELL).toLocaleString("en-US")}개{share}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    />
  );
}
