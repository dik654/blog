import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries(10절) — f∘(g∘h)와 (f∘g)∘h는 묶는 위치만 다르고 실행 순서는 x→h→g→f로 같다.
 * 비교로 g∘f처럼 두 함수를 맞바꾸면 순서 자체가 바뀌어 2→4→13이 된다(본문 수치).
 * h는 본문이 구체식을 주지 않으므로 상자만 그린다. 세 장면 모두 상자 세 칸과 괄호 줄을 같은 자리에 둔다.
 */
const W = 360;
const H = 132;
const BOX_W = 64;
const BOX_H = 36;
const BOX_Y = 62;
const SLOT_X = [64, 148, 232] as const;
const SLOTS: readonly number[] = SLOT_X;

const ACCENT = "#2563eb";
const SWAP = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#475569";

const SCENES = [
  {
    label: "f∘(g∘h)",
    summary: "x → h → g → f",
    names: ["h", "g", "f"],
    group: [0, 1],
    groupLabel: "g∘h를 먼저 한 이름으로 묶음",
    note: "안쪽 괄호 g∘h는 'h 다음 g'를 한 함수로 묶은 이름입니다. 그 결과에 f를 적용하므로 값은 x → h(x) → g(h(x)) → f(g(h(x)))로 흐릅니다.",
  },
  {
    label: "(f∘g)∘h",
    summary: "x → h → g → f (같음)",
    names: ["h", "g", "f"],
    group: [1, 2],
    groupLabel: "f∘g를 먼저 한 이름으로 묶음",
    note: "묶는 위치가 바뀌어도 상자의 순서는 그대로입니다. 모든 연결이 정의되는 입력에서 결과가 같으므로 결합법칙이 성립합니다.",
  },
  {
    label: "맞바꾸기와 비교",
    summary: "g∘f: 2 → 4 → 13",
    names: ["f", "g", ""],
    group: [] as number[],
    groupLabel: "괄호가 아니라 상자 순서가 바뀜",
    note: "f∘g와 g∘f는 상자 자체의 순서가 다릅니다. 2를 넣으면 f∘g는 2 → 7 → 49, g∘f는 2 → 4 → 13이라 교환법칙은 일반적으로 성립하지 않습니다.",
  },
] as const;

export default function AssociativityViz() {
  return (
    <SceneShell
      eyebrow="결합법칙 · 교환법칙"
      title="괄호를 옮기면 이름만 바뀌고, 함수를 맞바꾸면 순서가 바뀝니다"
      description="상자 하나가 함수 하나이고, 화살표 방향으로 값이 지나갑니다. 위 괄호는 어느 둘을 먼저 한 이름으로 묶었는지 보여 줍니다. h는 셋째 함수를 가리키는 이름일 뿐 구체식은 정하지 않았습니다."
      ariaLabel="세 함수 합성에서 괄호 위치를 바꿔도 실행 순서가 같고, 두 함수를 맞바꾸면 순서가 달라지는 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const swapped = active === 2;
        const group: readonly number[] = scene.group;
        const names: readonly string[] = scene.names;
        const first = group.length > 0 ? SLOTS[group[0]] : 0;
        const last = group.length > 0 ? SLOTS[group[group.length - 1]] + BOX_W : 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="as-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" fill={TEXT} />
              </marker>
            </defs>
            {group.length > 0 ? (
              <g>
                <path d={`M${first} ${BOX_Y - 10} L${first} ${BOX_Y - 22} L${last} ${BOX_Y - 22} L${last} ${BOX_Y - 10}`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <text x={(first + last) / 2} y={BOX_Y - 30} fontSize={11} fontWeight={700} textAnchor="middle" fill={ACCENT}>
                  {scene.groupLabel}
                </text>
              </g>
            ) : (
              <text x={W / 2} y={BOX_Y - 30} fontSize={11} fontWeight={700} textAnchor="middle" fill={SWAP}>
                {scene.groupLabel}
              </text>
            )}
            <text x={22} y={BOX_Y + BOX_H / 2 + 4} fontSize={12} fontWeight={700} textAnchor="middle" fill={TEXT}>
              {swapped ? "2" : "x"}
            </text>
            {SLOTS.map((sx, i) => {
              const name = names[i];
              const prevEnd = i === 0 ? 32 : SLOTS[i - 1] + BOX_W;
              if (!name) return null;
              return (
                <g key={i}>
                  <line x1={prevEnd + 2} y1={BOX_Y + BOX_H / 2} x2={sx - 3} y2={BOX_Y + BOX_H / 2} stroke={TEXT} strokeWidth={1} markerEnd="url(#as-arrow)" />
                  <rect x={sx} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke={swapped ? SWAP : LINE} strokeWidth={1.25} />
                  <text x={sx + BOX_W / 2} y={BOX_Y + BOX_H / 2 + 5} fontSize={15} fontWeight={700} textAnchor="middle" fill={swapped ? SWAP : TEXT}>
                    {name}
                  </text>
                </g>
              );
            })}
            {swapped ? (
              <>
                <text x={SLOTS[0] + BOX_W / 2} y={BOX_Y + BOX_H + 18} fontSize={11} textAnchor="middle" fill={TEXT}>
                  2² = 4
                </text>
                <text x={SLOTS[1] + BOX_W / 2} y={BOX_Y + BOX_H + 18} fontSize={11} textAnchor="middle" fill={TEXT}>
                  3×4+1 = 13
                </text>
              </>
            ) : (
              <text x={W / 2} y={BOX_Y + BOX_H + 20} fontSize={11} textAnchor="middle" fill={TEXT}>
                x → h(x) → g(h(x)) → f(g(h(x)))
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
