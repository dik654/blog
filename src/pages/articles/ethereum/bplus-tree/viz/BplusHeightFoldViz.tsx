import BplusSceneShell from "./BplusSceneShell";

/**
 * 본문 대응: #page-layout — ExplainedFormula의 설명용 가정(fanout 160, leaf 평균 200)을 그대로 씁니다.
 * 1,000,000 ÷ 200 = 5,000 leaves, 5,000 ÷ 160 = 31.25 → 32 parents, 32 ≤ 160 → root 1.
 * 경로 = 1 + ⌈log160 5,000⌉ = 1 + 2 = 3 pages. internal 1층은 leaf 160장, 2층은 25,600장까지.
 */
const W = 360;
const H = 214;
const X0 = 20;
const SPAN = 320;
const ROW_H = 14;
const ROOT_Y = 22;
const PARENT_Y = 74;
const LEAF_Y = 126;
const ENTRY_Y = 178;

const PARENTS = 32;
const LEAVES_UNDER_ONE = 156;
const ENTRIES_IN_ONE = 200;
const PARENT_PITCH = SPAN / PARENTS;
const LEAF_PITCH = SPAN / LEAVES_UNDER_ONE;
const ENTRY_PITCH = SPAN / ENTRIES_IN_ONE;
const PICK_PARENT = 11;
const PICK_LEAF = 70;
const PICK_ENTRY = 120;

const ROOT_X = 150;
const ROOT_W = 60;

const NEED_LEAVES = 5000;
const ONE_LEVEL = 160;
const TWO_LEVELS = 160 * 160;
const capX = (count: number) => X0 + (count / TWO_LEVELS) * SPAN;

const BLUE = "#2563eb";
const INK = "#475569";
const MUTED = "#64748b";
const LIGHT = "#cbd5e1";
const LINE = "#94a3b8";

const SCENES = [
  {
    label: "entry를 leaf에 담기",
    summary: "1,000,000 ÷ 200 = 5,000 leaves",
    note: "Leaf 하나에 entry가 평균 200개 들어간다고 잡으면(본문의 설명용 가정) 100만 entry는 leaf 5,000장이 됩니다. 맨 아래 줄의 눈금 하나가 entry 하나입니다.",
  },
  {
    label: "leaf를 parent로 접기",
    summary: "5,000 ÷ 160 = 31.25 → 32 parents",
    note: "Parent 한 장이 leaf를 최대 160장 가리킨다고 잡으면(보수적 fanout) 5,000장을 덮는 데 parent 32장이 필요합니다. 가운데 줄은 그중 진하게 칠한 parent 한 장이 가리키는 leaf이며, 평균 약 156장입니다.",
  },
  {
    label: "parent를 root로 접기",
    summary: "32 ≤ 160 → root 1장",
    note: "32장은 page 한 장의 fanout 160 안에 들어가므로 root 한 장이 모든 parent를 가리킵니다. 100만 entry가 5,000 → 32 → 1로 접혔습니다.",
  },
  {
    label: "한 key를 찾는 경로",
    summary: "root → parent → leaf = 3 pages",
    note: "Point lookup은 층마다 page를 한 장만 읽습니다. Root·parent·leaf가 모두 cache에 없는(cold) page라면 3장이고, 식으로는 1 + ⌈log₁₆₀ 5,000⌉ = 1 + 2 = 3입니다.",
  },
  {
    label: "층 하나 = 160배",
    summary: "160 → 25,600 leaves",
    note: "Fanout을 160으로 잡으면 internal 층이 하나일 때 leaf를 최대 160장, 둘일 때 160 × 160 = 25,600장까지 가리킵니다. 5,000장은 두 층이면 충분합니다. 그래서 높이는 entry 수가 아니라 그 수의 로그를 따라 늘어납니다.",
  },
] as const;

function Connector({ x1, x2, yTop, yBottom }: { x1: number; x2: number; yTop: number; yBottom: number }) {
  return (
    <g stroke={LINE} strokeWidth={1} strokeDasharray="3 3">
      <line x1={x1} y1={yTop} x2={X0} y2={yBottom} />
      <line x1={x2} y1={yTop} x2={X0 + SPAN} y2={yBottom} />
    </g>
  );
}

function RowLabel({ y, text, read }: { y: number; text: string; read?: string }) {
  return (
    <>
      <text x={X0} y={y - 5} fontSize={12} fill={MUTED}>{text}</text>
      {read ? <text x={X0 + SPAN} y={y - 5} fontSize={12} fontWeight={700} fill={BLUE} textAnchor="end">{read}</text> : null}
    </>
  );
}

function FoldTree({ active }: { active: number }) {
  const showParents = active >= 1;
  const showRoot = active >= 2;
  const path = active === 3;
  const pickParentX = X0 + PICK_PARENT * PARENT_PITCH;
  const pickLeafX = X0 + PICK_LEAF * LEAF_PITCH;

  return (
    <>
      {showRoot ? (
        <>
          <rect x={ROOT_X} y={ROOT_Y} width={ROOT_W} height={ROW_H + 4} rx={2} fill={path ? BLUE : INK} />
          <text x={ROOT_X + ROOT_W / 2} y={ROOT_Y + 13} fontSize={12} fontWeight={700} fill="#ffffff" textAnchor="middle">root 1장</text>
          {path ? <text x={X0 + SPAN} y={ROOT_Y + 13} fontSize={12} fontWeight={700} fill={BLUE} textAnchor="end">① 읽음</text> : null}
          <Connector x1={ROOT_X} x2={ROOT_X + ROOT_W} yTop={ROOT_Y + ROW_H + 4} yBottom={PARENT_Y} />
        </>
      ) : null}

      {showParents ? (
        <>
          <RowLabel y={PARENT_Y} text="parent 32장" read={path ? "② 읽음" : undefined} />
          {Array.from({ length: PARENTS }, (_, index) => (
            <rect
              key={index}
              x={X0 + index * PARENT_PITCH}
              y={PARENT_Y}
              width={PARENT_PITCH - 1.5}
              height={ROW_H}
              rx={1}
              fill={index === PICK_PARENT ? (path ? BLUE : INK) : LIGHT}
            />
          ))}
          <Connector x1={pickParentX} x2={pickParentX + PARENT_PITCH - 1.5} yTop={PARENT_Y + ROW_H} yBottom={LEAF_Y} />
          <RowLabel y={LEAF_Y} text="그 parent가 가리키는 leaf · 평균 약 156장" read={path ? "③ 읽음" : undefined} />
          {Array.from({ length: LEAVES_UNDER_ONE }, (_, index) => (
            <rect
              key={index}
              x={X0 + index * LEAF_PITCH}
              y={LEAF_Y}
              width={index === PICK_LEAF ? 2.4 : 1.2}
              height={ROW_H}
              fill={index === PICK_LEAF ? (path ? BLUE : INK) : LIGHT}
            />
          ))}
          <Connector x1={pickLeafX} x2={pickLeafX + 2.4} yTop={LEAF_Y + ROW_H} yBottom={ENTRY_Y} />
        </>
      ) : null}

      <RowLabel y={ENTRY_Y} text={showParents ? "그 leaf 안의 entry · 평균 200개" : "leaf 1장 안의 entry · 평균 200개"} read={path ? "key 확인" : undefined} />
      {Array.from({ length: ENTRIES_IN_ONE }, (_, index) => (
        <rect
          key={index}
          x={X0 + index * ENTRY_PITCH}
          y={ENTRY_Y}
          width={index === PICK_ENTRY && path ? 2.4 : 0.9}
          height={ROW_H}
          fill={index === PICK_ENTRY && path ? BLUE : LINE}
        />
      ))}
      <text x={X0} y={ENTRY_Y + ROW_H + 16} fontSize={12} fill={MUTED}>
        {active === 0 ? "이런 leaf가 모두 5,000장" : active === 1 ? "parent 32장 × 최대 160 = 5,120 ≥ 5,000" : "전체: 1,000,000 → 5,000 → 32 → 1"}
      </text>
    </>
  );
}

function CapacityBars() {
  const needX = capX(NEED_LEAVES);
  return (
    <>
      <text x={X0} y={20} fontSize={12} fill={MUTED}>fanout 160일 때 가리킬 수 있는 leaf 수</text>
      <text x={X0} y={50} fontSize={12} fill={INK} fontWeight={700}>internal 1층: 최대 160장</text>
      <text x={X0 + SPAN} y={50} fontSize={12} fill="#b91c1c" textAnchor="end">부족</text>
      <rect x={X0} y={56} width={SPAN} height={ROW_H} rx={1} fill="none" stroke={LIGHT} strokeWidth={1} />
      <rect x={X0} y={56} width={Math.max(capX(ONE_LEVEL) - X0, 2)} height={ROW_H} fill={BLUE} />

      <text x={X0} y={102} fontSize={12} fill={INK} fontWeight={700}>internal 2층: 160 × 160 = 25,600장</text>
      <text x={X0 + SPAN} y={102} fontSize={12} fill={BLUE} textAnchor="end">충분</text>
      <rect x={X0} y={108} width={SPAN} height={ROW_H} fill={BLUE} />

      <line x1={needX} x2={needX} y1={52} y2={74} stroke="#b91c1c" strokeWidth={1.25} strokeDasharray="3 3" />
      <line x1={needX} x2={needX} y1={104} y2={128} stroke="#b91c1c" strokeWidth={1.25} strokeDasharray="3 3" />
      <text x={needX - 6} y={146} fontSize={12} fill="#b91c1c">↑ 필요한 leaf 5,000장</text>
      <text x={X0} y={174} fontSize={12} fill={MUTED}>막대 전체 폭 = 25,600장</text>
      <text x={X0} y={196} fontSize={12} fill={INK} fontWeight={700}>internal 2층 + leaf 1층 = page 3장</text>
    </>
  );
}

export default function BplusHeightFoldViz() {
  return (
    <BplusSceneShell
      eyebrow="높이 접기"
      title="100만 entry가 page 3장짜리 경로로 접힙니다"
      description="줄 하나가 tree의 한 층입니다. 아래 두 줄은 위 줄에서 진하게 칠한 page 한 장을 확대한 것입니다. 숫자는 본문 식의 설명용 가정(fanout 160, leaf 평균 200)이며 실제 fanout은 key 길이와 fill factor에 따라 낮아질 수 있습니다."
      ariaLabel="100만 entry가 leaf 5,000장, parent 32장, root 1장으로 접혀 조회 경로가 page 3장이 되는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 4 ? <CapacityBars /> : <FoldTree active={active} />}
        </svg>
      )}
    />
  );
}
