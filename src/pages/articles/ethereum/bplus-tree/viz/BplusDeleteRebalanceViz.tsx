import BplusSceneShell from "./BplusSceneShell";

/**
 * 본문 대응: #updates 둘째 문단 — 교과서적 삭제 모형: minimum occupancy 아래로 내려가면
 * sibling에서 빌리고 parent 경계를 고치거나, 빌릴 수 없으면 합쳐 parent edge를 줄이고,
 * root child가 하나만 남으면 높이를 줄일 수 있다.
 * Leaf 용량 4는 본문의 예. 최소 점유 2개와 key 값은 설명용 가정.
 */
const W = 360;
const H = 196;
const ROOT = { x: 140, y: 34, w: 80, h: 30 };
const LEAF_Y = 118;
const LEAF_H = 32;
const CELL = 28;
const CAP = 4;
const LEFT_X = 22;
const RIGHT_X = 210;

const GRAY = "#94a3b8";
const INK = "#475569";
const MUTED = "#64748b";
const BLUE = "#2563eb";
const RED = "#b91c1c";

type Tone = "plain" | "changed" | "under" | "gone";

interface DeleteState {
  root: string;
  rootTone: Tone;
  left: readonly number[];
  leftTone: Tone;
  leftCaption: string;
  right: readonly number[];
  rightTone: Tone;
  rightCaption: string;
  edges: number;
  pages: number;
}

const STATES: readonly DeleteState[] = [
  { root: "20", rootTone: "plain", left: [10], leftTone: "under", leftCaption: "1개 < 최소 2", right: [20, 25, 30], rightTone: "plain", rightCaption: "3개 · 하나 내줄 수 있음", edges: 2, pages: 2 },
  { root: "25", rootTone: "changed", left: [10, 20], leftTone: "changed", leftCaption: "2개 · 최소 충족", right: [25, 30], rightTone: "changed", rightCaption: "2개 · 최소 충족", edges: 2, pages: 2 },
  { root: "경계 없음", rootTone: "under", left: [10, 25, 30], leftTone: "changed", leftCaption: "[10] + [25,30] 합침", right: [25, 30], rightTone: "gone", rightCaption: "합쳐져 사라짐", edges: 1, pages: 2 },
  { root: "제거", rootTone: "gone", left: [10, 25, 30], leftTone: "changed", leftCaption: "새 root", right: [25, 30], rightTone: "gone", rightCaption: "", edges: 0, pages: 1 },
];

const SCENES = [
  {
    label: "page가 최소 아래로",
    summary: "왼쪽 leaf [10] · 최소 2개(가정)",
    note: "삭제 뒤 왼쪽 leaf에 10 하나만 남았습니다. 이 그림은 leaf 용량 4, 최소 점유 2개를 가정합니다. 오른쪽 sibling은 3개라 하나를 내줄 여유가 있습니다.",
  },
  {
    label: "sibling에서 빌리기",
    summary: "20을 옮기고 경계 20 → 25",
    note: "Sibling의 가장 작은 key 20을 왼쪽 leaf로 옮기면 두 page 모두 최소를 지킵니다. Parent 경계는 오른쪽의 새 첫 key인 25로 고치고, parent edge 수는 그대로입니다.",
  },
  {
    label: "빌릴 수 없으면 합치기",
    summary: "parent edge 2개 → 1개",
    note: "이어서 20을 지우면 왼쪽은 다시 [10]이 되고, sibling [25,30]은 최소 2개뿐이라 내줄 수 없습니다. 둘을 [10,25,30]으로 합치면 parent에서 경계 25와 edge 하나가 빠집니다.",
  },
  {
    label: "root child 하나 → 높이 줄임",
    summary: "root → leaf page 2장 → 1장",
    note: "Root에 child가 하나만 남으면 root를 없애고 그 child를 새 root로 삼아 높이를 줄일 수 있습니다. 이 그림은 교과서적 모형입니다. PostgreSQL nbtree는 부분적으로 찬 두 page를 이렇게 합치지 않고 완전히 빈 page를 삭제합니다.",
  },
] as const;

const toneStroke = (tone: Tone) => (tone === "under" ? RED : tone === "changed" ? BLUE : GRAY);

function LeafBox({ x, values, tone, caption }: { x: number; values: readonly number[]; tone: Tone; caption: string }) {
  const gone = tone === "gone";
  return (
    <g opacity={gone ? 0.45 : 1}>
      {Array.from({ length: CAP }, (_, cell) => (
        <rect
          key={cell}
          x={x + cell * CELL}
          y={LEAF_Y}
          width={CELL - 2}
          height={LEAF_H}
          fill="none"
          stroke={toneStroke(tone)}
          strokeWidth={tone === "plain" || gone ? 1 : 1.25}
          strokeDasharray={gone ? "3 3" : undefined}
        />
      ))}
      {values.map((value, cell) => (
        <text key={value} x={x + cell * CELL + (CELL - 2) / 2} y={LEAF_Y + 21} fontSize={13.5} fontWeight={700} fill={INK} textAnchor="middle" fontFamily="monospace">
          {value}
        </text>
      ))}
      {caption ? (
        <text x={x + (CAP * CELL) / 2} y={LEAF_Y + LEAF_H + 16} fontSize={12} fontWeight={700} fill={tone === "under" ? RED : tone === "changed" ? BLUE : MUTED} textAnchor="middle">
          {caption}
        </text>
      ) : null}
    </g>
  );
}

export default function BplusDeleteRebalanceViz() {
  return (
    <BplusSceneShell
      eyebrow="삭제 뒤 복구"
      title="빌리면 경계만 바뀌고, 합치면 parent edge가 줄어듭니다"
      description="칸 넷이 leaf 용량 4(본문의 예)입니다. 최소 점유 2개와 key 값은 설명용 가정이며, 빨간 테두리는 최소 아래, 파란 테두리는 이번 장면에서 바뀐 page입니다."
      ariaLabel="삭제로 최소 점유 아래가 된 leaf가 sibling에서 빌리거나 합쳐지고 root가 제거되어 높이가 줄어드는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const rootGone = state.rootTone === "gone";
        const rootCenter = ROOT.x + ROOT.w / 2;
        const leftCenter = LEFT_X + (CAP * CELL) / 2;
        const rightCenter = RIGHT_X + (CAP * CELL) / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={16} fontSize={12} fontWeight={700} fill={state.pages === 1 ? BLUE : INK}>root → leaf: page {state.pages}장</text>
            <text x={W - 8} y={16} fontSize={12} fill={MUTED} textAnchor="end">{state.edges === 0 ? "parent page 없음" : `parent edge ${state.edges}개`}</text>

            <g opacity={rootGone ? 0.45 : 1}>
              <rect x={ROOT.x} y={ROOT.y} width={ROOT.w} height={ROOT.h} rx={3} fill="none" stroke={toneStroke(state.rootTone)} strokeWidth={rootGone ? 1 : 1.25} strokeDasharray={rootGone ? "3 3" : undefined} />
              <text x={ROOT.x + 6} y={ROOT.y + 11} fontSize={10} fill={MUTED}>ROOT · 경계</text>
              <text x={rootCenter} y={ROOT.y + 25} fontSize={13.5} fontWeight={700} fill={state.rootTone === "under" ? RED : state.rootTone === "changed" ? BLUE : INK} textAnchor="middle">{state.root}</text>
            </g>

            {state.edges >= 1 ? <line x1={rootCenter} y1={ROOT.y + ROOT.h} x2={leftCenter} y2={LEAF_Y} stroke={GRAY} strokeWidth={1} /> : null}
            {state.edges >= 2 ? <line x1={rootCenter} y1={ROOT.y + ROOT.h} x2={rightCenter} y2={LEAF_Y} stroke={GRAY} strokeWidth={1} /> : null}

            <LeafBox x={LEFT_X} values={state.left} tone={state.leftTone} caption={state.leftCaption} />
            <LeafBox x={RIGHT_X} values={state.right} tone={state.rightTone} caption={state.rightCaption} />
          </svg>
        );
      }}
    />
  );
}
