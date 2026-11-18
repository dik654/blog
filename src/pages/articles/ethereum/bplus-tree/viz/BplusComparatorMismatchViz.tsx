import BplusSceneShell from "./BplusSceneShell";

/**
 * 본문 대응: #search-range 마지막 문단 — build와 lookup의 순서 해석이 다르면
 * 존재하는 key가 다른 child에 놓여 도달할 수 없다.
 * Root separator [20, 40]은 본문의 예. key 100과 leaf 값은 설명용 가정.
 * 숫자 비교: 100 > 40 → 오른쪽. 글자 순서 비교: "100" < "20"('1' < '2') → 왼쪽.
 */
const W = 360;
const H = 206;
const ROOT = { x: 110, y: 34, w: 140, h: 32 };
const LEAF_Y = 122;
const LEAF_H = 36;
const LEAF_W = 104;
const LEAF_XS = [8, 128, 248] as const;
const BRANCH_LABELS = ["≤ 20", "20…40", "> 40"] as const;
const LEAF_VALUES: readonly (readonly number[])[] = [
  [4, 12, 20],
  [21, 35, 39],
  [52, 62, 100],
];

const BLUE = "#2563eb";
const RED = "#b91c1c";
const INK = "#475569";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const SCENES = [
  {
    label: "build: 숫자로 비교",
    summary: "100 > 40 → 오른쪽 child",
    head: "build comparator · 숫자로 비교",
    verdict: "100 > 40 → 오른쪽 leaf에 저장",
    child: 2,
    found: true,
    note: "Index를 만들 때 key를 숫자로 비교하면 100은 40보다 크므로 오른쪽 child의 leaf에 들어갑니다. Key 100과 leaf의 값들은 설명용 가정입니다.",
  },
  {
    label: "lookup: 글자 순서로 비교",
    summary: "\"100\" < \"20\" → 왼쪽 child",
    head: "lookup comparator · 글자 순서로 비교",
    verdict: "첫 글자 '1' < '2' → \"100\" < \"20\" → 왼쪽",
    child: 0,
    found: false,
    note: "조회가 같은 bytes를 글자 순서(앞 글자부터 하나씩 비교)로 해석하면 첫 글자 '1'이 '2'보다 앞서므로 \"100\"을 \"20\"보다 작다고 판정합니다. 왼쪽 child로 내려가 100이 없다고 답합니다.",
  },
  {
    label: "같은 comparator",
    summary: "100 > 40 → 오른쪽에서 찾음",
    head: "lookup comparator · build와 같은 숫자 비교",
    verdict: "100 > 40 → 오른쪽 leaf에서 100 확인",
    child: 2,
    found: true,
    note: "Build와 lookup이 같은 comparator를 쓰면 두 경로가 같은 child를 고르고 100을 찾습니다. Key가 사라진 것처럼 보인 원인은 page가 아니라 순서 해석의 불일치였습니다.",
  },
] as const;

export default function BplusComparatorMismatchViz() {
  return (
    <BplusSceneShell
      eyebrow="Comparator 불일치"
      title="같은 key도 다른 순서로 비교하면 다른 child로 내려갑니다"
      description="Comparator는 두 key 중 무엇이 앞인지 정하는 비교 규칙입니다. Root의 separator [20, 40]은 본문의 예입니다. Key 100과 leaf 값은 설명용 가정이며, 굵은 선이 그 장면의 경로입니다."
      ariaLabel="build는 숫자 비교로 100을 오른쪽 leaf에 넣고 lookup은 글자 순서 비교로 왼쪽 leaf를 찾아 실패하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pathColor = scene.found ? BLUE : RED;
        const rootBottomX = ROOT.x + ROOT.w / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={W / 2} y={18} fontSize={13} fontWeight={700} fill={INK} textAnchor="middle">{scene.head}</text>
            <rect x={ROOT.x} y={ROOT.y} width={ROOT.w} height={ROOT.h} rx={3} fill="none" stroke={INK} strokeWidth={1.25} />
            <text x={ROOT.x + 8} y={ROOT.y + 12} fontSize={10} fill={MUTED}>ROOT · separator</text>
            <text x={rootBottomX} y={ROOT.y + 26} fontSize={13.5} fontWeight={700} fill={INK} textAnchor="middle" fontFamily="monospace">20 │ 40</text>

            {LEAF_XS.map((x, index) => {
              const onPath = index === scene.child;
              const values = LEAF_VALUES[index];
              const leafCenter = x + LEAF_W / 2;
              return (
                <g key={x}>
                  <line
                    x1={rootBottomX}
                    y1={ROOT.y + ROOT.h}
                    x2={leafCenter}
                    y2={LEAF_Y}
                    stroke={onPath ? pathColor : LINE}
                    strokeWidth={onPath ? 1.25 : 1}
                    strokeDasharray={onPath ? undefined : "3 3"}
                  />
                  <text x={leafCenter} y={100} fontSize={12} fontWeight={onPath ? 700 : 400} fill={onPath ? pathColor : MUTED} textAnchor="middle">{BRANCH_LABELS[index]}</text>
                  <rect x={x} y={LEAF_Y} width={LEAF_W} height={LEAF_H} rx={3} fill="none" stroke={onPath ? pathColor : LINE} strokeWidth={onPath ? 1.25 : 1} />
                  {values.map((value, slot) => {
                    const isKey = value === 100;
                    const strong = isKey && (active !== 1 || !onPath);
                    return (
                      <text
                        key={value}
                        x={x + (slot + 0.5) * (LEAF_W / values.length)}
                        y={LEAF_Y + 23}
                        fontSize={13.5}
                        fontWeight={strong ? 700 : 400}
                        fill={isKey ? BLUE : INK}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {value}
                      </text>
                    );
                  })}
                  {onPath ? (
                    <text x={leafCenter} y={LEAF_Y + LEAF_H + 16} fontSize={12} fontWeight={700} fill={pathColor} textAnchor="middle">
                      {scene.found ? (active === 0 ? "여기에 저장" : "100 찾음") : "100 없음"}
                    </text>
                  ) : !scene.found && index === 2 ? (
                    <text x={leafCenter} y={LEAF_Y + LEAF_H + 16} fontSize={12} fill={BLUE} textAnchor="middle">100은 여기 있음</text>
                  ) : null}
                </g>
              );
            })}
            <text x={W / 2} y={H - 4} fontSize={12} fontWeight={700} fill={pathColor} textAnchor="middle">{scene.verdict}</text>
          </svg>
        );
      }}
    />
  );
}
