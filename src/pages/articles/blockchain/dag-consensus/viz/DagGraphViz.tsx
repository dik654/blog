import type { ReactNode } from "react";
import DagSceneShell from "./DagSceneShell";

/**
 * 본문 대응: #narwhal(부모 집합 겹침), #bullshark(앵커 표·간접 결정), #linearization(인과적 과거 수집).
 * 모든 그림은 글의 n=4, f=1 예시를 쓴다. 위가 높은 라운드, 화살표는 "자식 블록 → 참조한 부모 인증서" 방향이다.
 */

const BLUE = "#2563eb";
const ORANGE = "#d97706";
const RED = "#dc2626";
const GREY = "#94a3b8";

const W = 360;
const NODE_W = 58;
const NODE_H = 26;
const COLS = [82, 152, 222, 292] as const;
const AUTHORS = ["A", "B", "C", "D"] as const;

type Tone = "plain" | "dim" | "blue" | "orange" | "both" | "red";

interface NodeSpec {
  id: string;
  col: number;
  y: number;
  tone: Tone;
  text?: string;
}

interface EdgeSpec {
  from: string;
  to: string;
  color: string;
  dashed?: boolean;
}

interface TagSpec {
  x: number;
  y: number;
  text: string;
  color: string;
  anchor?: "start" | "middle" | "end";
}

const TONE_STROKE: Record<Tone, string> = {
  plain: GREY,
  dim: GREY,
  blue: BLUE,
  orange: ORANGE,
  both: BLUE,
  red: RED,
};

function DagGraph({
  height,
  rows,
  nodes,
  edges,
  tags = [],
  label,
  children,
}: {
  height: number;
  rows: readonly { y: number; text: string }[];
  nodes: readonly NodeSpec[];
  edges: readonly EdgeSpec[];
  tags?: readonly TagSpec[];
  label: string;
  children?: ReactNode;
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={label}>
      {rows.map((row) => (
        <text key={row.text} x={6} y={row.y + 4} fontSize={11} fontWeight={700} fill="#64748b">
          {row.text}
        </text>
      ))}
      {edges.map((edge) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) return null;
        const x1 = COLS[from.col];
        const y1 = from.y + NODE_H / 2;
        const x2 = COLS[to.col];
        const y2 = to.y - NODE_H / 2;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const head = 6;
        const left = `${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)}`;
        const right = `${x2 - head * Math.cos(angle + 0.45)},${y2 - head * Math.sin(angle + 0.45)}`;
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={edge.color} strokeWidth={1.25} strokeDasharray={edge.dashed ? "4 3" : undefined} />
            <polygon points={`${x2},${y2} ${left} ${right}`} fill={edge.color} />
          </g>
        );
      })}
      {nodes.map((node) => {
        const stroke = TONE_STROKE[node.tone];
        const filled = node.tone !== "plain" && node.tone !== "dim";
        return (
          <g key={node.id} opacity={node.tone === "dim" ? 0.35 : 1}>
            <rect
              x={COLS[node.col] - NODE_W / 2}
              y={node.y - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill={filled ? stroke : "none"}
              fillOpacity={filled ? 0.16 : 0}
              stroke={stroke}
              strokeWidth={filled ? 1.25 : 1}
              strokeDasharray={node.tone === "dim" ? "3 3" : undefined}
            />
            <text x={COLS[node.col]} y={node.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
              {node.text ?? node.id}
            </text>
          </g>
        );
      })}
      {tags.map((tag) => (
        <text key={`${tag.x}-${tag.y}-${tag.text}`} x={tag.x} y={tag.y} textAnchor={tag.anchor ?? "middle"} fontSize={11} fontWeight={700} fill={tag.color}>
          {tag.text}
        </text>
      ))}
      {children}
    </svg>
  );
}

function roundNodes(round: number, y: number, toneOf: (author: number) => Tone, textOf?: (author: number) => string | undefined): NodeSpec[] {
  return AUTHORS.map((author, col) => ({ id: `${author}${round}`, col, y, tone: toneOf(col), text: textOf?.(col) }));
}

/* ── 1. 부모 집합 겹침 ─────────────────────────────────────────── */

const OVERLAP_SCENES = [
  {
    label: "A2가 고른 부모",
    summary: "q = 2f+1 = 3개",
    note: "부모는 다음 라운드 블록이 참조하는 직전 라운드 인증서입니다. A2는 라운드 1의 인증서 넷 가운데 A1·B1·C1 세 개를 가리킵니다.",
  },
  {
    label: "B2가 고른 부모",
    summary: "역시 3개 · 다른 조합",
    note: "B2는 B1·C1·D1을 가리킵니다. 두 블록이 서로 상의하지 않고 각자 세 개를 골라도 규칙은 만족합니다.",
  },
  {
    label: "반드시 겹치는 부모",
    summary: "3 + 3 − 4 = 2 = f+1",
    note: "후보는 넷뿐인데 두 집합 크기의 합은 여섯이므로 적어도 두 개(B1·C1)가 겹칩니다. 다만 A1과 D1의 앞뒤는 이 겹침으로 정해지지 않아 별도 ordering 규칙이 필요합니다.",
  },
] as const;

const A2_PARENTS = ["A1", "B1", "C1"] as const;
const B2_PARENTS = ["B1", "C1", "D1"] as const;

export function DagParentOverlapViz() {
  return (
    <DagSceneShell
      eyebrow="부모 집합 · n=4, f=1"
      title="두 블록이 각자 부모 세 개를 골라도 둘 이상은 겹칩니다"
      description="칸 하나가 인증된 블록이고, 화살표는 위 라운드 블록이 아래 라운드 인증서를 참조한다는 뜻입니다. 부모 조합은 본문의 예입니다."
      ariaLabel="A2와 B2의 부모 집합과 두 집합의 겹침"
      scenes={OVERLAP_SCENES}
      render={(active) => {
        const showA = active !== 1;
        const showB = active >= 1;
        const toneOf = (col: number): Tone => {
          const id = `${AUTHORS[col]}1`;
          const inA = showA && (A2_PARENTS as readonly string[]).includes(id);
          const inB = showB && (B2_PARENTS as readonly string[]).includes(id);
          if (inA && inB) return "both";
          if (inA) return "blue";
          if (inB) return "orange";
          return "plain";
        };
        const nodes: NodeSpec[] = [
          { id: "A2", col: 0, y: 40, tone: showA ? "blue" : "plain" },
          { id: "B2", col: 1, y: 40, tone: showB ? "orange" : "plain" },
          { id: "C2", col: 2, y: 40, tone: "dim" },
          { id: "D2", col: 3, y: 40, tone: "dim" },
          ...roundNodes(1, 130, toneOf),
        ];
        const edges: EdgeSpec[] = [
          ...(showA ? A2_PARENTS.map((to) => ({ from: "A2", to, color: BLUE })) : []),
          ...(showB ? B2_PARENTS.map((to) => ({ from: "B2", to, color: ORANGE, dashed: true })) : []),
        ];
        const tags: TagSpec[] =
          active === 2
            ? [
                { x: COLS[1], y: 166, text: "공통", color: BLUE },
                { x: COLS[2], y: 166, text: "공통", color: BLUE },
                { x: COLS[0], y: 166, text: "A2만", color: "#64748b" },
                { x: COLS[3], y: 166, text: "B2만", color: "#64748b" },
              ]
            : [
                { x: COLS[0] - NODE_W / 2, y: 20, text: active === 0 ? "A2 → 실선" : "B2 → 점선", color: active === 0 ? BLUE : ORANGE, anchor: "start" },
              ];
        return (
          <DagGraph
            height={180}
            rows={[
              { y: 40, text: "라운드 2" },
              { y: 130, text: "라운드 1" },
            ]}
            nodes={nodes}
            edges={edges}
            tags={tags}
            label={`${OVERLAP_SCENES[active].label}: ${OVERLAP_SCENES[active].summary}`}
          />
        );
      }}
    />
  );
}

/* ── 2. 앵커 표와 간접 결정 ───────────────────────────────────── */

const VOTE_SCENES = [
  {
    label: "라운드 2의 앵커",
    summary: "짝수 라운드 · 미리 정한 작성자",
    note: "부분 동기식 Bullshark는 짝수 라운드마다 미리 정한 검증자의 블록을 앵커로 봅니다. 본문의 예처럼 A2로 둡니다.",
  },
  {
    label: "표 두 개 → 직접 commit",
    summary: "표 2 ≥ f+1 = 2",
    note: "라운드 3 블록이 A2를 가리키는 edge 하나가 표 하나입니다. 서로 다른 작성자 B3·C3의 두 표로 A2를 직접 commit합니다.",
  },
  {
    label: "표가 하나뿐일 때 (가정)",
    summary: "표 1 < f+1 = 2 → 아직 아님",
    note: "다른 경우를 가정합니다. 로컬 DAG에서 A2를 가리키는 블록이 B3 하나뿐이면 직접 commit 조건에 못 미칩니다.",
  },
  {
    label: "다음 앵커에서 경로가 있으면",
    summary: "C4 → B3 → A2 · A2도 commit",
    note: "라운드 4 앵커 C4가 나중에 결정됐다고 가정합니다. C4에서 A2로 내려가는 경로가 있으면 중간 앵커 A2를 commit합니다.",
  },
  {
    label: "경로가 없으면",
    summary: "C4에서 A2에 닿지 않음 · 건너뜀",
    note: "C4의 부모 A3·C3·D3이 A2를 가리키지 않는다고 가정하면 C4에서 A2로 가는 경로가 없고, A2는 건너뜁니다.",
  },
] as const;

export function DagAnchorVoteViz() {
  return (
    <DagSceneShell
      eyebrow="앵커 결정 · n=4, f=1"
      title="앵커를 가리키는 edge가 표가 되고, 표가 모자라면 다음 앵커의 경로로 정합니다"
      description="위가 높은 라운드입니다. 라운드 3 → 2 화살표는 A2로 가는 표만, 라운드 4 → 3 화살표는 C4의 부모만 그렸습니다. C4와 표가 하나인 경우는 가정입니다."
      note="부분 동기식 Bullshark의 정상 경로만 그립니다. 전체 비동기 Bullshark의 wave·fallback leader 규칙은 다릅니다."
      ariaLabel="앵커 A2에 대한 표 세기, 직접 commit, 다음 앵커 경로를 통한 commit 또는 건너뜀"
      scenes={VOTE_SCENES}
      render={(active) => {
        const voters = active === 1 ? ["B3", "C3"] : active >= 2 ? ["B3"] : [];
        const c4Parents = active === 3 ? ["B3", "C3", "D3"] : active === 4 ? ["A3", "C3", "D3"] : [];
        const pathOn = active === 3;
        const anchorTone: Tone = active === 1 || active === 3 ? "blue" : active === 4 ? "red" : active === 2 ? "orange" : "blue";
        const anchorText = active === 1 || active === 3 ? "A2 ✓" : active === 4 ? "A2 ✕" : "A2 ★";
        const nodes: NodeSpec[] = [
          ...roundNodes(4, 26, (col) => (col === 2 && active >= 3 ? "blue" : "dim"), (col) => (col === 2 && active >= 3 ? "C4 ★" : undefined)),
          ...roundNodes(3, 88, (col) => {
            const id = `${AUTHORS[col]}3`;
            if (active === 0) return "dim";
            if (pathOn && id === "B3") return "blue";
            if (voters.includes(id) && active <= 2) return "blue";
            return "plain";
          }),
          ...roundNodes(2, 150, (col) => (col === 0 ? anchorTone : "dim"), (col) => (col === 0 ? anchorText : undefined)),
        ];
        const edges: EdgeSpec[] = [
          ...voters.map((from) => ({ from, to: "A2", color: pathOn || active <= 2 ? BLUE : GREY })),
          ...c4Parents.map((to) => ({ from: "C4", to, color: pathOn && to === "B3" ? BLUE : GREY, dashed: !(pathOn && to === "B3") })),
        ];
        const statusText = ["앵커 후보", "직접 commit", "대기", "간접 commit", "건너뜀"][active];
        const statusColor = active === 4 ? RED : active === 2 ? ORANGE : BLUE;
        return (
          <DagGraph
            height={186}
            rows={[
              { y: 26, text: "라운드 4" },
              { y: 88, text: "라운드 3" },
              { y: 150, text: "라운드 2" },
            ]}
            nodes={nodes}
            edges={edges}
            tags={[{ x: COLS[0], y: 180, text: statusText, color: statusColor }]}
            label={`${VOTE_SCENES[active].label}: ${VOTE_SCENES[active].summary}`}
          />
        );
      }}
    />
  );
}

/* ── 3. 인과적 과거를 한 줄로 ─────────────────────────────────── */

const LINE_SCENES = [
  {
    label: "A2에서 거슬러 내려가기",
    summary: "닿는 블록: A1 · B1 · C1",
    note: "앵커 A2가 결정되면 A2에서 edge를 따라 내려가 닿는 블록을 모읍니다. A2의 부모는 A1·B1·C1이고, D1은 A2에서 닿지 않습니다. 더 아래 라운드는 이미 처리했다고 가정합니다.",
  },
  {
    label: "같은 규칙으로 한 줄",
    summary: "A1 → B1 → C1 → A2",
    note: "로컬 도착 순서 대신 모든 검증자가 같은 값으로 계산하는 규칙을 씁니다. 여기서는 (라운드, 작성자) 순서를 예로 들었습니다(가정). 실제 tie-break는 구현의 자료구조까지 확인해야 합니다.",
  },
  {
    label: "D1은 이번 줄에 없음",
    summary: "A2에서 닿지 않음 → 이번 prefix 밖",
    note: "D1은 유효한 인증 블록이지만 A2의 인과적 과거가 아니므로 이번에 펼친 줄에 들어가지 않습니다. 이후 결정된 앵커에서 닿으면 그때 '아직 처리하지 않은 블록'으로 모입니다(가정).",
  },
] as const;

const LINE_ORDER = ["A1", "B1", "C1", "A2"] as const;
const SLOT_W = 62;
const SLOT_X0 = (W - (LINE_ORDER.length * SLOT_W + (LINE_ORDER.length - 1) * 14)) / 2;

export function DagCausalLineViz() {
  return (
    <DagSceneShell
      eyebrow="선형화 · 앵커 A2"
      title="앵커에서 닿는 블록만 모아 모두가 같은 한 줄로 펼칩니다"
      description="위 그림은 A2와 그 부모, 아래 칸은 펼친 실행 순서입니다. 부모 조합은 본문의 예이고 정렬 규칙은 설명용 가정입니다."
      ariaLabel="앵커 A2의 인과적 과거를 모으고 결정적 규칙으로 한 줄로 정렬하는 과정"
      scenes={LINE_SCENES}
      render={(active) => {
        const toneOf = (col: number): Tone => (col === 3 ? (active === 2 ? "red" : "plain") : "blue");
        const nodes: NodeSpec[] = [
          { id: "A2", col: 0, y: 30, tone: "blue", text: "A2 ★" },
          { id: "B2", col: 1, y: 30, tone: "dim" },
          { id: "C2", col: 2, y: 30, tone: "dim" },
          { id: "D2", col: 3, y: 30, tone: "dim" },
          ...roundNodes(1, 105, toneOf),
        ];
        const edges: EdgeSpec[] = A2_PARENTS.map((to) => ({ from: "A2", to, color: BLUE }));
        const showLine = active >= 1;
        return (
          <DagGraph
            height={214}
            rows={[
              { y: 30, text: "라운드 2" },
              { y: 105, text: "라운드 1" },
            ]}
            nodes={nodes}
            edges={edges}
            tags={[{ x: COLS[3], y: 138, text: "A2에서 닿지 않음", color: active === 2 ? RED : "#64748b" }]}
            label={`${LINE_SCENES[active].label}: ${LINE_SCENES[active].summary}`}
          >
            <line x1={10} x2={W - 10} y1={152} y2={152} stroke={GREY} strokeWidth={1} strokeDasharray="3 3" />
            <text x={10} y={170} fontSize={11} fontWeight={700} fill="#64748b">
              실행 순서
            </text>
            {LINE_ORDER.map((id, index) => {
              const x = SLOT_X0 + index * (SLOT_W + 14);
              return (
                <g key={id}>
                  <rect x={x} y={178} width={SLOT_W} height={26} rx={6} fill={showLine ? BLUE : "none"} fillOpacity={showLine ? 0.16 : 0} stroke={showLine ? BLUE : GREY} strokeWidth={1} strokeDasharray={showLine ? undefined : "3 3"} />
                  <text x={x + SLOT_W / 2} y={195} textAnchor="middle" fontSize={12} fontWeight={700} className={showLine ? "fill-foreground" : undefined} fill={showLine ? undefined : GREY}>
                    {showLine ? `${index + 1}. ${id}` : `${index + 1}. ?`}
                  </text>
                  {index < LINE_ORDER.length - 1 && (
                    <text x={x + SLOT_W + 7} y={195} textAnchor="middle" fontSize={11} fill="#64748b">
                      →
                    </text>
                  )}
                </g>
              );
            })}
          </DagGraph>
        );
      }}
    />
  );
}
