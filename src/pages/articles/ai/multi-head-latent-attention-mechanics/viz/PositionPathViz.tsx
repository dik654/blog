import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decoupled-rope의 수식과 AlgorithmBlock.
 * c_t^KV=W^DKV h_t, k_t^R=RoPE(W^KR h_t), c_t^Q=W^DQ h_t, q_t^C=W^UQ c_t^Q, q_t^R=RoPE(W^QR c_t^Q).
 * 캐시 합 512+64=576. key 위치 벡터를 head별로 뒀다면 64×128=8192.
 */
type Node = { id: string; x: number; y: number; text: string; rope?: boolean; cached?: boolean };

const NODES: readonly Node[] = [
  { id: "h", x: 6, y: 86, text: "h_t" },
  { id: "dkv", x: 70, y: 20, text: "W^DKV" },
  { id: "c", x: 176, y: 20, text: "c_t^KV 512", cached: true },
  { id: "kr", x: 70, y: 66, text: "W^KR" },
  { id: "krr", x: 176, y: 66, text: "RoPE", rope: true },
  { id: "k", x: 268, y: 66, text: "k_t^R 64", cached: true },
  { id: "dq", x: 70, y: 112, text: "W^DQ" },
  { id: "cq", x: 150, y: 134, text: "c_t^Q" },
  { id: "uq", x: 218, y: 112, text: "W^UQ" },
  { id: "qc", x: 288, y: 112, text: "q_t^C" },
  { id: "qr", x: 218, y: 158, text: "W^QR" },
  { id: "rq", x: 288, y: 158, text: "RoPE→q_t^R", rope: true },
];

const EDGES = [
  ["h", "dkv", 0], ["dkv", "c", 0],
  ["h", "kr", 1], ["kr", "krr", 1], ["krr", "k", 1],
  ["h", "dq", 2], ["dq", "cq", 2], ["cq", "uq", 2], ["uq", "qc", 2], ["cq", "qr", 2], ["qr", "rq", 2],
] as const;

const GROUP: Record<string, number> = { dkv: 0, c: 0, kr: 1, krr: 1, k: 1, dq: 2, cq: 2, uq: 2, qc: 2, qr: 2, rq: 2 };

const widthOf = (node: Node) => (node.id === "rq" ? 66 : node.id === "c" ? 76 : node.id === "k" ? 66 : node.id === "h" ? 34 : node.id === "krr" ? 44 : 48);

const SCENES = [
  { label: "내용 경로", summary: "h_t → c_t^KV 512", note: "앞 절의 down-projection입니다. 회전이 지나가지 않아 뒤 절의 W^UK 접기가 가능합니다. 이 latent는 캐시에 남습니다." },
  { label: "위치 key 경로", summary: "h_t → k_t^R 64", note: "W^KR은 latent를 거치지 않고 h_t에서 곧장 작은 벡터를 만듭니다. RoPE 회전은 여기에만 걸립니다. 모든 head가 이 벡터 하나를 함께 쓰며 캐시에 남습니다." },
  { label: "query 경로", summary: "c_t^Q → q_t^C, q_t^R", note: "query는 자기 latent c_t^Q에서 head별 content query와 위치 query로 갈라집니다. 위치 query의 차원은 64입니다. 매 decode step 새로 계산하므로 캐시되지 않습니다." },
  { label: "캐시 합계", summary: "512 + 64 = 576", note: "토큰당 캐시에 쌓이는 것은 두 칸뿐이라 합이 576입니다. 위치 key를 head마다 따로 뒀다면 64×128=8192개가 되었을 텐데, 공유 덕분에 64개만 늘어납니다." },
] as const;

export default function PositionPathViz() {
  return (
    <SceneShell
      eyebrow="세 갈래 경로"
      title="회전은 위치 전용 작은 벡터에만 걸리고 캐시에는 두 칸만 쌓입니다"
      description="왼쪽 h_t에서 세 갈래로 나뉩니다. W로 시작하는 칸은 학습된 행렬, 숫자는 DeepSeek-V2(236B)의 차원입니다. 파란 칸이 캐시에 남고 주황 글자에서 회전이 일어납니다."
      ariaLabel="내용 latent, 위치 key, query 경로와 캐시되는 칸"
      scenes={SCENES}
      render={(active) => {
        const byId = (id: string) => NODES.find((node) => node.id === id) as Node;
        const lit = (group: number) => active === 3 ? group !== 2 : group === active;
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {EDGES.map(([from, to, group]) => {
              const a = byId(from);
              const b = byId(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x + widthOf(a)}
                  y1={a.y + 12}
                  x2={b.x}
                  y2={b.y + 12}
                  stroke={lit(group) ? "#475569" : "#94a3b8"}
                  strokeWidth={1}
                  opacity={lit(group) ? 1 : 0.35}
                />
              );
            })}
            {NODES.map((node) => {
              const on = node.id === "h" || lit(GROUP[node.id]);
              const color = node.cached ? "#2563eb" : node.rope ? "#d97706" : "#475569";
              return (
                <g key={node.id} opacity={on ? 1 : 0.35}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={widthOf(node)}
                    height={24}
                    rx={4}
                    fill={node.cached && on ? "#2563eb" : "none"}
                    fillOpacity={node.cached ? 0.14 : 0}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <text x={node.x + widthOf(node) / 2} y={node.y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{node.text}</text>
                </g>
              );
            })}
            <text x={356} y={38} textAnchor="end" fontSize={11} fill="#2563eb" opacity={active === 3 || active === 0 ? 1 : 0}>캐시</text>
            <text x={356} y={102} textAnchor="end" fontSize={11} fill="#2563eb" opacity={active === 3 || active === 1 ? 1 : 0}>캐시·공유</text>
            <text x={356} y={148} textAnchor="end" fontSize={11} fill="#64748b" opacity={active === 2 ? 1 : 0}>캐시 안 함</text>
          </svg>
        );
      }}
    />
  );
}
