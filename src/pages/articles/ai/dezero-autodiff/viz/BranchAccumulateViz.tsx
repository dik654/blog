import SceneShell from "./SceneShell";

/**
 * 본문 대응: #backward — y=x²+x², x=3. 두 branch가 x로 보낸 2x·2x를 prev+gx로 합쳐 12.
 * forward: x=3(gen 0) → Square ①·② → a=9, b=9(gen 1) → Add → y=18(gen 2)
 * backward: y.grad=1 → Add: a.grad=b.grad=1 → Square ①: x.grad=2·3·1=6 → Square ②: 6+6=12 (덮어쓰면 6)
 */
const X = 3;
const SQ = X * X;
const Y = SQ + SQ;
const BRANCH = 2 * X;

type NodeId = "x" | "f1" | "f2" | "a" | "b" | "add" | "y";

const SCENES = [
  {
    label: "Forward: 값과 creator 기록",
    summary: `x=${X} → a=b=${SQ} → y=${Y}`,
    activeFn: null,
    grads: {},
    xGrad: null,
    note: "같은 x가 제곱 연산 두 개로 갈라졌다가 Add에서 합쳐집니다. 출력의 generation은 입력 중 가장 큰 값보다 1 크게 두므로 x는 0, a·b는 1, y는 2입니다.",
  },
  {
    label: "Seed: y.grad = 1",
    summary: "출력에서 시작",
    activeFn: null,
    grads: { y: "1" },
    xGrad: null,
    note: "스칼라 출력 y의 gradient를 1로 두고 creator를 따라 역추적을 시작합니다.",
  },
  {
    label: "Add 먼저 (y는 gen 2)",
    summary: "a.grad = 1, b.grad = 1",
    activeFn: "add",
    grads: { y: "1", a: "1", b: "1" },
    xGrad: null,
    note: "gen 2인 y를 만든 Add가 gen 1인 a·b를 만든 제곱보다 먼저 꺼내집니다. Add의 backward는 받은 1을 두 입력에 그대로 보냅니다.",
  },
  {
    label: "제곱 ①의 backward",
    summary: `x.grad = 2·${X}·1 = ${BRANCH}`,
    activeFn: "f1",
    grads: { y: "1", a: "1", b: "1" },
    xGrad: { acc: `${BRANCH}`, over: `${BRANCH}` },
    note: `제곱의 국소 미분 2x에 받은 gradient 1을 곱해 x에 ${BRANCH}을 보냅니다. x에는 아직 이전 값이 없으므로 그대로 저장됩니다.`,
  },
  {
    label: "제곱 ②의 backward: 합산",
    summary: `prev + gx = ${BRANCH} + ${BRANCH} = ${BRANCH * 2}`,
    activeFn: "f2",
    grads: { y: "1", a: "1", b: "1" },
    xGrad: { acc: `${BRANCH} + ${BRANCH} = ${BRANCH * 2}`, over: `${BRANCH} (틀림)` },
    note: `두 번째 branch도 x에 ${BRANCH}을 보냅니다. prev + gx로 더하면 ${BRANCH * 2}이고, 새 값으로 덮어쓰면 첫 branch의 기여가 사라져 ${BRANCH}만 남습니다.`,
  },
] as const;

const W = 380;
const H = 168;
const POS: Record<NodeId, { x: number; y: number }> = {
  x: { x: 34, y: 80 },
  f1: { x: 116, y: 38 },
  f2: { x: 116, y: 122 },
  a: { x: 196, y: 38 },
  b: { x: 196, y: 122 },
  add: { x: 270, y: 80 },
  y: { x: 344, y: 80 },
};
const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["x", "f1"],
  ["x", "f2"],
  ["f1", "a"],
  ["f2", "b"],
  ["a", "add"],
  ["b", "add"],
  ["add", "y"],
];
const VARS: readonly { id: NodeId; name: string; value: number; gen: number }[] = [
  { id: "x", name: "x", value: X, gen: 0 },
  { id: "a", name: "a", value: SQ, gen: 1 },
  { id: "b", name: "b", value: SQ, gen: 1 },
  { id: "y", name: "y", value: Y, gen: 2 },
];
const FNS: readonly { id: NodeId; name: string }[] = [
  { id: "f1", name: "x² ①" },
  { id: "f2", name: "x² ②" },
  { id: "add", name: "Add" },
];

export default function BranchAccumulateViz() {
  return (
    <SceneShell
      eyebrow="y = x² + x², x = 3"
      title="두 branch의 gradient가 x에서 만나면 더해야 12가 됩니다"
      description="동그라미는 값을 담는 Variable, 네모는 연산 Function입니다. Variable 아래 숫자는 값과 generation(gen, 실행 순서용 정수), 위의 파란 글자는 backward로 받은 gradient입니다."
      ariaLabel="y는 x 제곱 더하기 x 제곱, x는 3일 때 역전파와 gradient 누적"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const grads = scene.grads as Partial<Record<NodeId, string>>;
        const backward = active >= 1;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {EDGES.map(([from, to]) => {
                const p = POS[from];
                const q = POS[to];
                const hot =
                  (scene.activeFn === "add" && (from === "add" || to === "add")) ||
                  (scene.activeFn === "f1" && (from === "f1" || to === "f1")) ||
                  (scene.activeFn === "f2" && (from === "f2" || to === "f2"));
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={p.x}
                    y1={p.y}
                    x2={q.x}
                    y2={q.y}
                    stroke={hot ? "#2563eb" : "#94a3b8"}
                    strokeWidth={hot ? 1.25 : 1}
                    strokeDasharray={backward && !hot ? "3 3" : undefined}
                  />
                );
              })}
              {FNS.map((fn) => {
                const p = POS[fn.id];
                const hot = scene.activeFn === fn.id;
                return (
                  <g key={fn.id}>
                    <rect x={p.x - 24} y={p.y - 13} width={48} height={26} rx={4} fill={hot ? "#dbeafe" : "#ffffff"} stroke={hot ? "#2563eb" : "#64748b"} strokeWidth={hot ? 1.25 : 1} />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">{fn.name}</text>
                  </g>
                );
              })}
              {VARS.map((v) => {
                const p = POS[v.id];
                const g = v.id === "x" ? undefined : grads[v.id];
                return (
                  <g key={v.id}>
                    <circle cx={p.x} cy={p.y} r={15} fill="#ffffff" stroke="#334155" strokeWidth={1} />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">{v.name}</text>
                    <text x={p.x} y={p.y + 29} textAnchor="middle" fontSize={12} fill="#475569">{`${v.value} · gen ${v.gen}`}</text>
                    {g && (
                      <text x={p.x} y={p.y - 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{`grad ${g}`}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-[#2563eb] px-3 py-2">
                <p className="font-bold text-[#2563eb]">x.grad · prev + gx</p>
                <p className="mt-1 font-mono">{scene.xGrad ? scene.xGrad.acc : "—"}</p>
              </div>
              <div className="rounded-lg border border-dashed border-[#dc2626] px-3 py-2">
                <p className="font-bold text-[#dc2626]">x.grad · 덮어쓰기</p>
                <p className="mt-1 font-mono">{scene.xGrad ? scene.xGrad.over : "—"}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
