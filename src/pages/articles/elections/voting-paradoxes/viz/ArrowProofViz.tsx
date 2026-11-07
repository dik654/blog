import SceneShell from "./SceneShell";

/**
 * 본문 대응: #arrow — 결정 집단을 최소로 잡고 두 묶음으로 나누면 모순이 생겨 한 명만 남는다.
 * 점 아홉 개와 최소 집단 세 명은 그림용 가정이다. 글은 사람 수를 정하지 않는다.
 */
const DOTS = Array.from({ length: 9 }, (_, index) => 28 + index * 38);
const CONDITION_NAMES = ["전원일치 존중", "선호 제한 없음", "사회적 순서", "두 안만 보고 비교하기", "비독재"] as const;
const DOT_Y = 58;
const ACCENT = "#2563eb";
const WARN = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

type Ring = { from: number; to: number; label: string; dashed?: boolean; color: string };

const SCENES: readonly (
  { label: string; summary: string; note: string; members: readonly number[]; rings: Ring[]; used: readonly number[]; broken?: number }
)[] = [
  {
    label: "처음엔 전체가 결정 집단",
    summary: "전원일치 때문에",
    note: "결정 집단은 다른 사람들이 반대해도 사회의 판단을 정할 수 있는 집단입니다. 전원일치를 지켜야 하므로 처음에는 전체 유권자 집단이 그런 힘을 가집니다.",
    members: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    rings: [{ from: 0, to: 8, label: "결정 집단 = 전체", color: ACCENT }],
    used: [0],
  },
  {
    label: "더 줄일 수 없는 최소 집단",
    summary: "하나를 골라 잡습니다",
    note: "그 힘을 가진 집단 가운데 더는 줄일 수 없는 최소 집단을 하나 잡습니다. 세 명은 그림을 위한 가정입니다.",
    members: [3, 4, 5],
    rings: [{ from: 3, to: 5, label: "최소 집단 (가정: 3명)", color: ACCENT }],
    used: [],
  },
  {
    label: "두 명 이상이라고 가정",
    summary: "두 묶음으로 나눕니다",
    note: "최소 집단이 두 명 이상이라고 가정하고 둘로 나눈 뒤, 선택지 셋의 순서를 서로 다르게 놓은 입력을 만듭니다. 어떤 입력도 허용하므로 이 조합을 시험할 수 있습니다.",
    members: [3, 4, 5],
    rings: [
      { from: 3, to: 4, label: "묶음 1", color: ACCENT },
      { from: 5, to: 5, label: "묶음 2", color: ACCENT },
    ],
    used: [1],
  },
  {
    label: "더 작은 결정 집단이 생깁니다",
    summary: "최소라는 가정과 충돌",
    note: "사회의 순서가 앞뒤로 이어지고 두 안의 판단이 그 둘의 상대 순서에만 의존하려면, 두 묶음 가운데 하나가 더 작은 결정 집단이 되어야 합니다. 처음 집단이 최소라는 전제와 어긋나므로 두 명 이상이라는 가정이 틀렸습니다.",
    members: [3, 4, 5],
    rings: [
      { from: 3, to: 4, label: "이쪽 또는", dashed: true, color: WARN },
      { from: 5, to: 5, label: "저쪽", dashed: true, color: WARN },
    ],
    used: [2, 3],
  },
  {
    label: "최소 집단은 한 명",
    summary: "그 한 명이 독재자",
    note: "최소 집단은 한 명뿐이고, 같은 논리를 모든 안의 쌍으로 옮기면 그 한 명이 독재자가 됩니다. 나머지 네 조건을 유지하면 비독재가 깨지고, 비독재를 지키려면 다른 조건 가운데 적어도 하나를 내려놓아야 합니다.",
    members: [4],
    rings: [{ from: 4, to: 4, label: "한 명", color: "#dc2626" }],
    used: [0, 1, 2, 3],
    broken: 4,
  },
];

export default function ArrowProofViz() {
  return (
    <SceneShell
      eyebrow="증명의 뼈대"
      title="가장 작은 결정 집단은 왜 한 명일까요?"
      description="점 하나가 유권자 한 명이고, 칠한 점이 지금 결정 집단입니다. 점 아홉 개와 위치는 그림을 위한 가정입니다. 아래 칩은 그 단계에서 쓰인 조건입니다."
      ariaLabel="애로우 정리 증명의 흐름: 전체에서 최소 집단으로, 두 묶음으로 나눠 모순을 얻고 한 명이 남는다"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <svg viewBox="0 0 360 100" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.rings.map((ring) => (
                <g key={ring.label}>
                  <rect
                    x={DOTS[ring.from] - 15}
                    y={DOT_Y - 17}
                    width={DOTS[ring.to] - DOTS[ring.from] + 30}
                    height={34}
                    rx={10}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={1.25}
                    strokeDasharray={ring.dashed ? "4 3" : undefined}
                  />
                  <text x={(DOTS[ring.from] + DOTS[ring.to]) / 2} y={DOT_Y - 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={ring.color}>
                    {ring.label}
                  </text>
                </g>
              ))}
              {DOTS.map((x, index) => {
                const member = scene.members.includes(index);
                return <circle key={x} cx={x} cy={DOT_Y} r={9} fill={member ? ACCENT : "none"} stroke={member ? ACCENT : MUTED} strokeWidth={1} />;
              })}
              <text x={180} y={94} textAnchor="middle" fontSize={12} fill={TEXT}>
                칠한 점 = 결정 집단 안 · 빈 점 = 밖
              </text>
            </svg>
            <div className="flex flex-wrap gap-2">
              {CONDITION_NAMES.map((name, index) => {
                const used = scene.used.includes(index);
                const broken = scene.broken === index;
                return (
                  <span
                    key={name}
                    className={`rounded border px-2 py-1 text-xs ${broken ? "border-red-600 font-bold text-red-700 dark:text-red-400" : used ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {broken ? "✗ " : used ? "● " : ""}
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
