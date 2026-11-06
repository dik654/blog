import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel-source — pick_eevdf의 트리 탐색.
 * (가정) 작업 일곱 개. a·b·c·d·f는 nice 0(마감 = v + 0.75), e·g는 nice 5(마감 = v + 2.29).
 * V = (1024 × 13.5 + 335 × 2.55) ÷ 5790 = 2.535 → 2.54. 자격이 있는 작업은 e(1.25)와 g(1.30)뿐.
 * 부분 트리 최소 vruntime: b = 2.60, f = 1.25, d = 1.25.
 */
type Id = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const NODES: readonly { id: Id; x: number; y: number; v: string; d: string; min?: string }[] = [
  { id: "d", x: 180, y: 10, v: "2.75", d: "3.50", min: "1.25" },
  { id: "b", x: 88, y: 76, v: "2.65", d: "3.40", min: "2.60" },
  { id: "f", x: 272, y: 76, v: "2.80", d: "3.55", min: "1.25" },
  { id: "a", x: 42, y: 142, v: "2.60", d: "3.35" },
  { id: "c", x: 134, y: 142, v: "2.70", d: "3.45" },
  { id: "e", x: 226, y: 142, v: "1.25", d: "3.54" },
  { id: "g", x: 318, y: 142, v: "1.30", d: "3.59" },
];

const EDGES: readonly [Id, Id][] = [
  ["d", "b"],
  ["d", "f"],
  ["b", "a"],
  ["b", "c"],
  ["f", "e"],
  ["f", "g"],
];

const NODE_W = 84;
const NODE_H = 46;
const BLUE = "#2563eb";
const GRAY = "#64748b";
const RED = "#dc2626";
const GREEN = "#16a34a";

interface Scene {
  label: string;
  summary: string;
  note: string;
  here: Id | null;
  visited: readonly Id[];
  skipped: readonly Id[];
  picked: Id | null;
  test: string;
}

const SCENES: readonly Scene[] = [
  { label: "트리의 모양", summary: "왼쪽일수록 마감이 이릅니다", here: null, visited: [], skipped: [], picked: null, test: "V = 2.54 · v ≤ V면 자격 있음", note: "(가정) a·b·c·d·f는 nice 0, e·g는 nice 5이고 도는 작업은 따로 없습니다. 마감은 v에 slice 몫을 더한 값, V는 일곱 작업의 가중 평균입니다. '최소'는 자기와 그 아래 가지(서브트리)를 통틀어 가장 작은 vruntime입니다." },
  { label: "d에서 왼쪽 가지를 봅니다", summary: "b의 최소 2.60 > V 2.54", here: "d", visited: ["d"], skipped: ["b", "a", "c"], picked: null, test: "왼쪽 가지 최소 2.60 > 2.54 → 건너뜀", note: "가지에서 가장 작은 vruntime조차 V를 넘으므로 그 가지에 자격 있는 작업은 없습니다. a·b·c를 하나씩 보지 않고 통째로 건너뜁니다." },
  { label: "d 자신을 검사합니다", summary: "2.75 > 2.54 → 오른쪽으로", here: "d", visited: ["d"], skipped: ["b", "a", "c"], picked: null, test: "d의 v 2.75 > 2.54 → 자격 없음", note: "왼쪽 가지가 빠졌으니 현재 노드를 검사합니다. d도 자격이 없어 오른쪽으로 내려갑니다." },
  { label: "f에서 왼쪽 가지를 봅니다", summary: "e의 최소 1.25 ≤ V 2.54", here: "f", visited: ["d", "f"], skipped: ["b", "a", "c"], picked: null, test: "왼쪽 가지 최소 1.25 ≤ 2.54 → 왼쪽으로", note: "왼쪽 가지에 자격 있는 작업이 있습니다. 왼쪽이 마감이 더 이르므로 f 자신을 검사하지 않고 바로 왼쪽으로 갑니다." },
  { label: "e를 고릅니다", summary: "자격 있는 최단 마감 3.54", here: "e", visited: ["d", "f", "e"], skipped: ["b", "a", "c"], picked: "e", test: "e의 v 1.25 ≤ 2.54 → 선택", note: "e에는 왼쪽 가지가 없어 자신을 검사하고 고릅니다. g도 자격이 있지만 마감 3.59로 더 늦어 볼 필요가 없습니다. 일곱 개 가운데 세 노드만 거쳤습니다." },
];

const nodeOf = (id: Id) => NODES.find((node) => node.id === id) ?? NODES[0];

export default function PickTreeViz() {
  return (
    <SceneShell
      eyebrow="pick_eevdf · 트리 탐색"
      title="가지의 최소 vruntime 하나로 자격 없는 작업을 통째로 건너뜁니다"
      description="(가정) 탐색 순서를 보이려고 고른 값이고 단위는 ms입니다. 파란 테두리가 지나온 길, 점선이 건너뛴 가지입니다."
      ariaLabel="가상 마감 순서로 정렬된 트리에서 자격 있는 최단 마감 작업을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              {EDGES.map(([from, to]) => {
                const a = nodeOf(from);
                const b = nodeOf(to);
                const onPath = s.visited.includes(from) && s.visited.includes(to);
                const off = s.skipped.includes(to);
                return <line key={`${from}-${to}`} x1={a.x} y1={a.y + NODE_H} x2={b.x} y2={b.y} stroke={onPath ? BLUE : GRAY} strokeWidth={onPath ? 1.25 : 1} strokeDasharray={off ? "3 3" : undefined} opacity={off ? 0.5 : 1} />;
              })}
              {NODES.map((node) => {
                const off = s.skipped.includes(node.id);
                const picked = s.picked === node.id;
                const onPath = s.visited.includes(node.id);
                const stroke = picked ? GREEN : onPath ? BLUE : GRAY;
                return (
                  <g key={node.id} opacity={off ? 0.45 : 1}>
                    <rect x={node.x - NODE_W / 2} y={node.y} width={NODE_W} height={NODE_H} rx={4} fill={picked ? `${GREEN}22` : "none"} stroke={stroke} strokeWidth={s.here === node.id ? 1.25 : 1} strokeDasharray={off ? "3 3" : undefined} />
                    <text x={node.x} y={node.y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={stroke}>
                      {node.id} · 마감 {node.d}
                    </text>
                    <text x={node.x} y={node.y + 27} textAnchor="middle" fontSize={11} fill={GRAY}>
                      v {node.v}
                    </text>
                    {node.min && (
                      <text x={node.x} y={node.y + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                        최소 {node.min}
                      </text>
                    )}
                  </g>
                );
              })}
              <line x1={10} x2={350} y1={200} y2={200} stroke={GRAY} strokeWidth={1} />
              <path d="M345 196 L350 200 L345 204" fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={10} y={213} fontSize={11} fill={GRAY}>
                마감이 이름
              </text>
              <text x={350} y={213} textAnchor="end" fontSize={11} fill={GRAY}>
                마감이 늦음
              </text>
            </svg>
            <p className="mt-2 rounded-sm border border-border bg-background px-2 py-1 text-center font-mono text-xs font-bold leading-5 sm:text-sm">{s.test}</p>
          </div>
        );
      }}
    />
  );
}
