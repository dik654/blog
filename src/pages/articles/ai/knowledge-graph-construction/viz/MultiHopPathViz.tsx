import KgSceneShell from "./KgSceneShell";

/**
 * 본문 대응: #graph-traversal — “tenant-a 사용자가 모바일 앱에서 보고한 오류”를
 * U-42 → tenant-a와 U-42 → E401 → 모바일 앱 두 경로로 찾는 장면.
 * node 5·edge 4와 각 edge의 원문(d-17·d-22·d-31)은 이 글의 설명용 사례 그대로입니다.
 */

type EdgeId = "uses" | "reported" | "occurs" | "member";

interface SceneData {
  label: string;
  summary: string;
  note: string;
  edges: readonly EdgeId[];
  docs: readonly string[];
  answer: boolean;
}

const DOCS = [
  { id: "d-17", text: "민준 김은 계정 A-17을 사용한다." },
  { id: "d-22", text: "M. Kim은 모바일 앱에서 오류 E401을 보고했다." },
  { id: "d-31", text: "그 사용자는 tenant-a에 속한다." },
] as const;

const NODES = [
  { id: "U-42", sub: "Person", x: 80, y: 140 },
  { id: "A-17", sub: "Account", x: 330, y: 45 },
  { id: "E401", sub: "Error", x: 330, y: 140 },
  { id: "모바일 앱", sub: "App", x: 330, y: 240 },
  { id: "tenant-a", sub: "Tenant", x: 80, y: 260 },
] as const;

const EDGES: readonly { id: EdgeId; d: string; label: string; lx: number; ly: number; anchor: "start" | "middle" | "end" }[] = [
  { id: "uses", d: "M128 128 L282 56", label: "usesAccount · d-17", lx: 196, ly: 70, anchor: "end" },
  { id: "reported", d: "M128 140 L282 140", label: "reported · d-22", lx: 205, ly: 132, anchor: "middle" },
  { id: "occurs", d: "M330 161 L330 219", label: "occursIn · d-22", lx: 322, ly: 194, anchor: "end" },
  { id: "member", d: "M80 161 L80 239", label: "memberOf · d-31", lx: 90, ly: 204, anchor: "start" },
];

const SCENES: readonly SceneData[] = [
  {
    label: "질문",
    summary: "한 문서에 다 적혀 있지 않음",
    note: "“tenant-a 사용자가 모바일 앱에서 보고한 오류”의 조건은 d-22와 d-31에 나뉘어 있습니다. 어느 문서 하나에도 tenant-a와 모바일 앱이 함께 적혀 있지 않습니다.",
    edges: [],
    docs: [],
    answer: false,
  },
  {
    label: "경로 1 · tenant-a 쪽",
    summary: "U-42 → tenant-a",
    note: "U-42에서 memberOf edge를 따라가면 tenant-a에 닿습니다. 이 edge의 근거는 d-31입니다.",
    edges: ["member"],
    docs: ["d-31"],
    answer: false,
  },
  {
    label: "경로 2 · 오류 쪽",
    summary: "U-42 → E401 → 모바일 앱",
    note: "U-42에서 reported로 E401에, 다시 occursIn으로 모바일 앱에 닿습니다. 두 edge의 근거는 모두 d-22입니다.",
    edges: ["reported", "occurs"],
    docs: ["d-22"],
    answer: false,
  },
  {
    label: "두 경로가 U-42에서 만남",
    summary: "답: E401",
    note: "d-22의 M. Kim과 d-31의 그 사용자가 U-42 하나로 묶였기 때문에 두 경로가 같은 node에서 만납니다. 어떤 경로를 먼저 탐색하고 근거를 어떻게 답변 문맥으로 바꿀지는 구축이 아니라 retrieval의 책임입니다.",
    edges: ["member", "reported", "occurs"],
    docs: ["d-22", "d-31"],
    answer: true,
  },
];

const ON = "#2563eb";
const OFF = "#cbd5e1";

export default function MultiHopPathViz() {
  return (
    <KgSceneShell
      eyebrow="반환 · 설명용 사례"
      title="문서 하나에 없는 답을 두 경로의 합류로 찾습니다"
      description="상자는 kg-v43의 node 5개, 선은 edge 4개이며 선 옆에 그 edge를 주장한 원문을 적었습니다. 파란 선이 그 장면에서 따라가는 경로입니다."
      note="U-42·kg-v43과 세 문서는 설명용 가정입니다. 탐색 순서와 문맥화는 다음 글(GraphRAG와 multi-hop 검색)에서 다룹니다."
      ariaLabel="U-42에서 tenant-a와 E401·모바일 앱으로 이어지는 두 경로"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const onEdges = new Set(scene.edges);
        const onNodes = new Set<string>(
          scene.edges.length === 0
            ? []
            : ["U-42", ...(onEdges.has("member") ? ["tenant-a"] : []), ...(onEdges.has("reported") ? ["E401"] : []), ...(onEdges.has("occurs") ? ["모바일 앱"] : [])],
        );
        return (
          <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
            <svg viewBox="0 0 430 300" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id={`kg-hop-arrow-${index}-on`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill={ON} />
                </marker>
                <marker id={`kg-hop-arrow-${index}-off`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill={OFF} />
                </marker>
              </defs>
              {EDGES.map((edge) => {
                const on = onEdges.has(edge.id);
                return (
                  <g key={edge.id}>
                    <path d={edge.d} stroke={on ? ON : OFF} strokeWidth={on ? 1.25 : 1} fill="none" markerEnd={`url(#kg-hop-arrow-${index}-${on ? "on" : "off"})`} />
                    <text x={edge.lx} y={edge.ly} textAnchor={edge.anchor} fontSize={12} fontWeight={on ? 700 : 500} fill={on ? ON : "#94a3b8"}>
                      {edge.label}
                    </text>
                  </g>
                );
              })}
              {NODES.map((node) => {
                const on = onNodes.has(node.id);
                const isAnswer = scene.answer && node.id === "E401";
                return (
                  <g key={node.id}>
                    <rect
                      x={node.x - 48}
                      y={node.y - 21}
                      width={96}
                      height={42}
                      rx={4}
                      fill={isAnswer ? "#dbeafe" : "none"}
                      stroke={on ? ON : "#94a3b8"}
                      strokeWidth={on ? 1.25 : 1}
                    />
                    <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={isAnswer ? "#1e3a8a" : on ? ON : "#64748b"}>
                      {node.id}
                    </text>
                    <text x={node.x} y={node.y + 13} textAnchor="middle" fontSize={11} fill={isAnswer ? "#1e3a8a" : "#94a3b8"}>
                      {node.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
            <ul className="grid min-w-0 gap-1.5" aria-label="edge를 주장한 원문">
              {DOCS.map((doc) => {
                const used = scene.docs.includes(doc.id);
                return (
                  <li
                    key={doc.id}
                    className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-2 border-l-2 pl-2 text-xs leading-5"
                    style={{ borderColor: used ? ON : OFF }}
                  >
                    <span className="font-mono font-bold" style={{ color: used ? ON : "#94a3b8" }}>{doc.id}</span>
                    <span className={`break-keep ${used ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{doc.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
