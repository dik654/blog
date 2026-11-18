import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifacts — compile(source, profile) → r1cs, witness generator, sym (06절 첫 단계),
 * keygen(r1cs) → proving·verifying key (06절 셋째 단계). 표의 "새 source에 오래된 key"와
 * "새 R1CS + 오래된 key" 실패, 그리고 manifest가 함께 기록할 항목.
 */
type NodeId = "source" | "profile" | "r1cs" | "wasm" | "sym" | "zkey" | "vkey" | "schema";

const NODES: Record<NodeId, { x: number; y: number; label: string }> = {
  source: { x: 8, y: 34, label: ".circom" },
  profile: { x: 8, y: 112, label: "profile" },
  r1cs: { x: 132, y: 20, label: ".r1cs" },
  wasm: { x: 132, y: 74, label: ".wasm/C++" },
  sym: { x: 132, y: 128, label: ".sym" },
  zkey: { x: 256, y: 20, label: "zkey" },
  vkey: { x: 256, y: 74, label: "vkey" },
  schema: { x: 256, y: 128, label: "public [out]" },
};

const NW = 96;
const NH = 30;

const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["source", "r1cs"],
  ["source", "wasm"],
  ["source", "sym"],
  ["profile", "r1cs"],
  ["profile", "wasm"],
  ["profile", "sym"],
  ["r1cs", "zkey"],
  ["r1cs", "vkey"],
];

type Scene = {
  label: string;
  summary: string;
  note: string;
  shown: readonly NodeId[];
  fresh: readonly NodeId[];
  stale: readonly NodeId[];
  manifest: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "한 번의 compile",
    summary: "compile(source, profile) → r1cs · wasm · sym",
    shown: ["source", "profile", "r1cs", "wasm", "sym"],
    fresh: [],
    stale: [],
    manifest: false,
    note: "profile은 compiler version, field, optimization입니다. 같은 .circom이라도 profile이 다르면 artifact가 달라질 수 있으므로, 세 결과물은 같은 profile의 한 번 compile에서 나와야 합니다.",
  },
  {
    label: "key는 r1cs에 묶임",
    summary: "keygen(r1cs) → zkey · vkey",
    shown: ["source", "profile", "r1cs", "wasm", "sym", "zkey", "vkey", "schema"],
    fresh: [],
    stale: [],
    manifest: false,
    note: "proving key(zkey)와 verifying key(vkey)는 특정 R1CS와 proof backend를 위해 만들어집니다. public schema는 out이라는 이름·순서·encoding을 API에 결속합니다.",
  },
  {
    label: "source만 바뀌면",
    summary: "새 r1cs + 오래된 key → 결속 실패",
    shown: ["source", "profile", "r1cs", "wasm", "sym", "zkey", "vkey", "schema"],
    fresh: ["source", "r1cs", "wasm", "sym"],
    stale: ["zkey", "vkey"],
    manifest: false,
    note: "source를 고쳐 다시 compile하면 r1cs·wasm·sym은 새것이 되지만, key를 다시 만들지 않으면 옛 R1CS 기준으로 남습니다. 이 조합은 다른 R1CS의 proof·verify를 섞는 것이므로 fail closed(맞지 않으면 통과시키지 않고 거절)해야 합니다.",
  },
  {
    label: "manifest로 한 묶음",
    summary: "hash · flags · schema · backend를 함께 기록",
    shown: ["source", "profile", "r1cs", "wasm", "sym", "zkey", "vkey", "schema"],
    fresh: [],
    stale: [],
    manifest: true,
    note: "manifest는 compiler commit, source hash, compile flags, field, R1CS와 witness generator hash, public signal 이름·순서·encoding, proof backend와 key hash를 함께 적습니다. private witness 값은 넣지 않습니다.",
  },
];

export default function ArtifactDriftViz() {
  return (
    <SceneShell
      eyebrow="artifact 결속 · 3×4=12 회로"
      title="source 하나에서 나온 결과물이 서로 같은 회로를 가리켜야 합니다"
      description="상자 하나가 출시 파일 하나이고 화살표는 '이것으로 만들어짐'입니다. 파란 상자는 고쳤거나 다시 만든 것, 빨간 상자는 옛 R1CS 기준으로 남은 것입니다."
      ariaLabel="Circom source와 profile에서 R1CS, witness generator, sym, key가 만들어지는 관계와 drift"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const has = (id: NodeId) => scene.shown.includes(id);
        const fresh = (id: NodeId) => scene.fresh.includes(id);
        const stale = (id: NodeId) => scene.stale.includes(id);
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="artifact-arrow" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="#94a3b8" />
              </marker>
            </defs>
            {scene.manifest && (
              <rect x={2} y={10} width={356} height={156} rx={8} fill="none" stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="4 3" />
            )}
            {scene.manifest && (
              <text x={354} y={8} textAnchor="end" fontSize={10} fontWeight={700} fill="#7c3aed">manifest</text>
            )}
            {EDGES.map(([from, to]) => {
              const a = NODES[from];
              const b = NODES[to];
              const broken = from === "r1cs" && stale(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x + NW}
                  y1={a.y + NH / 2}
                  x2={b.x}
                  y2={b.y + NH / 2}
                  stroke={broken ? "#dc2626" : "#94a3b8"}
                  strokeWidth={1}
                  strokeDasharray={broken ? "3 3" : undefined}
                  markerEnd={broken ? undefined : "url(#artifact-arrow)"}
                  opacity={has(from) && has(to) ? 1 : 0}
                />
              );
            })}
            {(Object.keys(NODES) as NodeId[]).map((id) => {
              const node = NODES[id];
              const stroke = stale(id) ? "#dc2626" : fresh(id) ? "#2563eb" : "#64748b";
              const fill = stale(id) ? "#fee2e2" : fresh(id) ? "#dbeafe" : "#f8fafc";
              const label = fresh(id) ? `${node.label} (새)` : stale(id) ? `${node.label} (옛)` : node.label;
              return (
                <g key={id} opacity={has(id) ? 1 : 0}>
                  <rect x={node.x} y={node.y} width={NW} height={NH} rx={6} fill={fill} stroke={stroke} strokeWidth={1} />
                  <text x={node.x + NW / 2} y={node.y + NH / 2 + 4.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">
                    {label}
                  </text>
                </g>
              );
            })}
            {scene.stale.length > 0 && (
              <text x={NODES.vkey.x + NW / 2} y={NODES.vkey.y + NH + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
                ✗ 새 r1cs와 맞지 않음
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
