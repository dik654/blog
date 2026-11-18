import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 이 글의 z=(1,x,y,w,v)=(1,3,16,4,12)를 Nova의 Z=(W,x,1)=(4,12,3,16,1)로 옮긴다.
 * 값이 옮겨 간 자리로 계수도 함께 옮기면 3×4−12=0, (4+12)×1−16=0이 그대로다.
 */
const NAMES: readonly string[] = ["1", "x", "y", "w", "v"];
const VALUES: readonly number[] = [1, 3, 16, 4, 12];
/** 이 글의 i번째 칸이 Nova 순서에서 몇 번째 칸으로 가는지 */
const TO_NOVA: readonly number[] = [4, 2, 3, 0, 1];
const NOVA_NAMES: readonly string[] = NAMES.map((_, j) => NAMES[TO_NOVA.indexOf(j)]);
const NOVA_VALUES: readonly number[] = VALUES.map((_, j) => VALUES[TO_NOVA.indexOf(j)]);

type Tag = "A" | "B" | "C";
const COLORS: Record<Tag, string> = { A: "#2563eb", B: "#d97706", C: "#16a34a" };

/** 이 글 순서 기준으로 각 칸을 읽는 계수 */
const ROW_TAGS: readonly (readonly (Tag | null)[])[] = [
  [null, null, null, null, null],
  [null, "A", null, "B", "C"],
  ["B", null, "C", "A", "A"],
];

const SCENES = [
  { label: "값을 새 순서로", summary: "(1,3,16,4,12) → (4,12,3,16,1)", note: "Nova는 비공개 W=(4,12)를 앞에, 공개 x=(3,16)을 가운데, 상수 1을 맨 뒤에 둡니다. 선은 같은 값이 옮겨 간 자리입니다." },
  { label: "첫 행의 계수도 이동", summary: "3 × 4 − 12 = 0", note: "A는 x 자리에서 세 번째 자리로, B는 w 자리에서 첫 번째 자리로, C는 v 자리에서 두 번째 자리로 옮깁니다. 읽는 값은 여전히 3, 4, 12입니다." },
  { label: "둘째 행의 계수도 이동", summary: "(4 + 12) × 1 − 16 = 0", note: "A는 첫째와 둘째 자리를 더하고, B는 마지막 1, C는 네 번째 16을 읽습니다. 값만 옮기고 계수를 그대로 두면 다른 칸을 읽게 됩니다." },
] as const;

const W = 360;
const SLOT_W = 54;
const SLOT_H = 42;
const GAP = (W - 2 * 18 - 5 * SLOT_W) / 4;
const sx = (i: number) => 18 + i * (SLOT_W + GAP);
const TOP_Y = 24;
const BOT_Y = 150;

function Slot({ i, y, name, value, tag, top }: { i: number; y: number; name: string; value: number; tag: Tag | null; top: boolean }) {
  const color = tag ? COLORS[tag] : "#94a3b8";
  const mid = sx(i) + SLOT_W / 2;
  return (
    <g>
      <text x={mid} y={top ? y - 7 : y + SLOT_H + 16} textAnchor="middle" fontSize={12} fill="#64748b">
        {i + 1}번째
      </text>
      <rect x={sx(i)} y={y} width={SLOT_W} height={SLOT_H} rx={6} fill="#ffffff" stroke={color} strokeWidth={tag ? 1.25 : 1} />
      <text x={mid} y={y + 15} textAnchor="middle" fontSize={11} fill="#64748b">
        {name}
      </text>
      <text x={mid} y={y + 34} textAnchor="middle" fontSize={15} fontWeight={700} fill="#0f172a">
        {value}
      </text>
      {tag && (
        <g>
          <rect x={mid - 9} y={top ? y + SLOT_H + 3 : y - 21} width={18} height={18} rx={4} fill={color} />
          <text x={mid} y={top ? y + SLOT_H + 16 : y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
            {tag}
          </text>
        </g>
      )}
    </g>
  );
}

export default function ReorderViz() {
  return (
    <SceneShell
      eyebrow="벡터 순서 바꾸기"
      title="값이 옮겨 간 자리로 계수도 따라갑니다"
      description="위 줄은 이 글의 순서 (1,x,y,w,v), 아래 줄은 Nova 원문의 순서 Z=(W,x,1)입니다. 네모에 붙은 A·B·C는 그 칸을 읽는 계수입니다. 숫자는 3절의 가정입니다."
      ariaLabel="값 묶음 (1,3,16,4,12)를 (4,12,3,16,1)로 재배열하고 두 행의 A, B, C 계수도 같은 자리로 옮김"
      scenes={SCENES}
      render={(active) => {
        const tags = ROW_TAGS[active];
        return (
          <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {NAMES.map((_, i) => {
              const j = TO_NOVA[i];
              const tag = tags[i];
              return (
                <line
                  key={`l${i}`}
                  x1={sx(i) + SLOT_W / 2}
                  y1={TOP_Y + SLOT_H + (tags[i] ? 21 : 0)}
                  x2={sx(j) + SLOT_W / 2}
                  y2={BOT_Y - (tag ? 21 : 0)}
                  stroke={tag ? COLORS[tag] : "#cbd5e1"}
                  strokeWidth={tag ? 1.25 : 1}
                  strokeDasharray={tag || active === 0 ? undefined : "3 3"}
                />
              );
            })}
            {NAMES.map((name, i) => (
              <Slot key={`t${i}`} i={i} y={TOP_Y} name={name} value={VALUES[i]} tag={tags[i]} top />
            ))}
            {NOVA_NAMES.map((name, j) => (
              <Slot key={`b${j}`} i={j} y={BOT_Y} name={name} value={NOVA_VALUES[j]} tag={tags[TO_NOVA.indexOf(j)]} top={false} />
            ))}
          </svg>
        );
      }}
    />
  );
}
