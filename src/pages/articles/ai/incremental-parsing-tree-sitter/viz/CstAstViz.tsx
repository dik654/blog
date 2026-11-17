import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parse-tree-cst-ast — `1 + 2 * 3`의 CST와 AST `+(1, *(2, 3))`.
 * 문법은 본문이 이름만 든 expr·term·factor로 짠 가정이다:
 * expr → expr + term | term, term → term * factor | factor, factor → 숫자 | ( expr ).
 * CST node 13개(규칙 node 8 + 원문 token 5), AST node 5개.
 */
type TreeNode = { id: string; label: string; x: number; y: number; parent?: string; leaf?: boolean };

const CST: readonly TreeNode[] = [
  { id: "e0", label: "expr", x: 220, y: 22 },
  { id: "e1", label: "expr", x: 80, y: 66, parent: "e0" },
  { id: "plus", label: "+", x: 200, y: 66, parent: "e0", leaf: true },
  { id: "t0", label: "term", x: 320, y: 66, parent: "e0" },
  { id: "t1", label: "term", x: 80, y: 110, parent: "e1" },
  { id: "t2", label: "term", x: 250, y: 110, parent: "t0" },
  { id: "star", label: "*", x: 320, y: 110, parent: "t0", leaf: true },
  { id: "f3", label: "factor", x: 395, y: 110, parent: "t0" },
  { id: "f1", label: "factor", x: 80, y: 154, parent: "t1" },
  { id: "f2", label: "factor", x: 250, y: 154, parent: "t2" },
  { id: "n3", label: "3", x: 395, y: 154, parent: "f3", leaf: true },
  { id: "n1", label: "1", x: 80, y: 198, parent: "f1", leaf: true },
  { id: "n2", label: "2", x: 250, y: 198, parent: "f2", leaf: true },
];

const AST: readonly TreeNode[] = [
  { id: "plus", label: "+", x: 220, y: 50 },
  { id: "n1", label: "1", x: 120, y: 120, parent: "plus", leaf: true },
  { id: "star", label: "*", x: 320, y: 120, parent: "plus" },
  { id: "n2", label: "2", x: 270, y: 190, parent: "star", leaf: true },
  { id: "n3", label: "3", x: 370, y: 190, parent: "star", leaf: true },
];

const SCENES = [
  {
    label: "CST는 유도에 쓴 규칙을 모두 남깁니다",
    summary: "node 13개",
    tree: "cst",
    note: "`1` 하나에도 expr → term → factor → 1의 규칙 사다리가 그대로 남습니다. 원문 token 다섯 개(1 + 2 * 3) 위에 규칙 node 여덟 개가 얹힌 모양입니다.",
  },
  {
    label: "AST가 남기는 것은 연산자와 피연산자뿐입니다",
    summary: "규칙 node 8개를 지움",
    tree: "cst-kept",
    note: "진하게 남은 다섯 개만 의미 단위입니다. expr·term·factor 같은 규칙 node는 'AST에서 지워질 것'으로 흐리게 표시했습니다. 입력에 괄호가 있었다면 그것도 지워집니다.",
  },
  {
    label: "AST: +(1, *(2, 3))",
    summary: "node 5개",
    tree: "ast",
    note: "곱셈이 덧셈의 오른쪽 자식으로 들어가 '2 * 3을 먼저'라는 구조만 남습니다. Tree-sitter가 유지하는 것은 원본 위치를 다시 가리켜야 하는 앞의 CST 쪽입니다.",
  },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

function Tree({ nodes, dimRules }: { nodes: readonly TreeNode[]; dimRules: boolean }) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <>
      {nodes.map((n) => {
        const p = n.parent ? byId.get(n.parent) : undefined;
        if (!p) return null;
        return <line key={`l-${n.id}`} x1={p.x} y1={p.y + 11} x2={n.x} y2={n.y - 11} stroke={MUTED} strokeWidth="1" opacity={dimRules ? 0.3 : 1} />;
      })}
      {nodes.map((n) => {
        const faded = dimRules && !n.leaf;
        const w = n.label.length > 2 ? 52 : 26;
        return (
          <g key={n.id} opacity={faded ? 0.3 : 1}>
            <rect
              x={n.x - w / 2}
              y={n.y - 11}
              width={w}
              height={22}
              rx={n.leaf ? 11 : 6}
              fill={n.leaf ? "#dbeafe" : "none"}
              stroke={n.leaf ? ACCENT : MUTED}
              strokeWidth={n.leaf ? 1.25 : 1}
            />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" className={n.leaf ? "fill-slate-900 font-mono font-bold" : "fill-foreground font-mono"}>
              {n.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

export default function CstAstViz() {
  return (
    <SceneShell
      eyebrow="같은 식, 두 나무"
      title="1 + 2 * 3을 CST와 AST로 그리면"
      description="파란 알약은 원문에 있던 token, 네모는 문법 규칙 node입니다. 문법은 본문의 expr·term·factor 이름으로 짠 가정입니다: expr → expr + term | term, term → term * factor | factor, factor → 숫자 | ( expr )."
      ariaLabel="1 + 2 * 3의 concrete syntax tree 13개 node와 abstract syntax tree 5개 node 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 440 214" role="img" aria-label={scene.label} className="block h-auto w-full sm:mx-auto sm:max-w-[32rem]">
            {scene.tree === "ast" ? <Tree nodes={AST} dimRules={false} /> : <Tree nodes={CST} dimRules={scene.tree === "cst-kept"} />}
          </svg>
        );
      }}
    />
  );
}
