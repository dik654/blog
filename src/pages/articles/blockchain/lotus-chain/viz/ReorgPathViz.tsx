import SceneShell from "./SceneShell";

/**
 * 본문 대응: #head-reorg — 공통 조상 98, local A99→A100, candidate B99→B100→B101.
 * (100−98) revert + (101−98) apply = 5 steps. Weight 값은 본문에 없어 그리지 않습니다.
 */
type NodeState = "head" | "chain" | "reverted" | "pending" | "applied";

const SCENES = [
  { label: "전환 전", summary: "head A100 · 0 steps", count: 0, note: "Local head는 A100, 더 무거운 candidate의 끝은 B101입니다." },
  { label: "Old branch revert", summary: "100 − 98 = 2 steps", count: 2, note: "98 위의 A99·A100 두 개를 되돌립니다. Subscriber도 함께 되돌립니다." },
  { label: "New branch apply", summary: "2 + (101 − 98) = 5 steps", count: 5, note: "B99·B100·B101을 적용해 B101이 head가 됩니다. Step 수는 chain의 우열이 아닙니다." },
] as const;

const NODES = [
  { id: "98", x: 40, y: 74, branch: "base" },
  { id: "A99", x: 128, y: 34, branch: "A" },
  { id: "A100", x: 216, y: 34, branch: "A" },
  { id: "B99", x: 128, y: 114, branch: "B" },
  { id: "B100", x: 216, y: 114, branch: "B" },
  { id: "B101", x: 304, y: 114, branch: "B" },
] as const;

const EDGES = [["98", "A99"], ["A99", "A100"], ["98", "B99"], ["B99", "B100"], ["B100", "B101"]] as const;

const stateOf = (id: string, branch: string, active: number): NodeState => {
  if (branch === "base") return "chain";
  if (branch === "A") return active === 0 ? (id === "A100" ? "head" : "chain") : "reverted";
  if (active < 2) return "pending";
  return id === "B101" ? "head" : "applied";
};

const STYLE: Record<NodeState, { stroke: string; fill: string; dash?: string; text: string; tag: string }> = {
  head: { stroke: "#2563eb", fill: "#2563eb", text: "#ffffff", tag: "head" },
  chain: { stroke: "#64748b", fill: "#e2e8f0", text: "#334155", tag: "" },
  reverted: { stroke: "#d97706", fill: "#fef3c7", dash: "3 3", text: "#92400e", tag: "revert" },
  pending: { stroke: "#94a3b8", fill: "#f8fafc", dash: "3 3", text: "#64748b", tag: "후보" },
  applied: { stroke: "#2563eb", fill: "#dbeafe", text: "#1e3a8a", tag: "apply" },
};

const BOX_W = 56;
const BOX_H = 26;

export default function ReorgPathViz() {
  return (
    <SceneShell
      eyebrow="공통 조상 98에서 갈라진 두 branch"
      title="Head를 바꾸려면 공통 조상까지 내려갔다가 새 branch를 올라갑니다"
      description="칸 하나가 tipset, 가로 위치가 height입니다. 위는 local branch A, 아래는 candidate B이며 본문처럼 height마다 tipset 하나로 단순화했습니다."
      note="작업량만 셉니다. 높이 101만으로 이기지 않고 validation, weight와 finalized-prefix fence가 모두 필요합니다."
      ariaLabel="공통 조상 98에서 A 두 개를 revert하고 B 세 개를 apply하는 head change"
      scenes={SCENES}
      render={(active) => {
        const count = SCENES[active].count;
        const pos = Object.fromEntries(NODES.map((n) => [n.id, n]));
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {[98, 99, 100, 101].map((h, i) => (
                <text key={h} x={40 + i * 88} y={164} fontSize={11} textAnchor="middle" fill="#64748b">h {h}</text>
              ))}
              {EDGES.map(([a, b]) => {
                const from = pos[a];
                const to = pos[b];
                const st = stateOf(b, to.branch, active);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={from.x + BOX_W / 2}
                    y1={from.y}
                    x2={to.x - BOX_W / 2}
                    y2={to.y}
                    stroke={STYLE[st].stroke}
                    strokeWidth={1}
                    strokeDasharray={STYLE[st].dash}
                  />
                );
              })}
              {NODES.map((n) => {
                const st = stateOf(n.id, n.branch, active);
                const s = STYLE[st];
                return (
                  <g key={n.id}>
                    <rect x={n.x - BOX_W / 2} y={n.y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth={1} strokeDasharray={s.dash} />
                    <text x={n.x} y={n.y + 4} fontSize={12} fontWeight={700} textAnchor="middle" fill={s.text}>{n.id}</text>
                    {s.tag && (
                      <text x={n.x} y={n.branch === "A" ? n.y - 20 : n.y + 28} fontSize={11} textAnchor="middle" fill={s.stroke}>{s.tag}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 whitespace-nowrap text-center text-[11px] sm:text-xs">
              <div className="rounded-lg border border-border bg-background px-2 py-1.5"><span className="mr-1.5 text-muted-foreground">revert</span><span className="font-mono font-bold">{count >= 2 ? 2 : 0}/2</span></div>
              <div className="rounded-lg border border-border bg-background px-2 py-1.5"><span className="mr-1.5 text-muted-foreground">apply</span><span className="font-mono font-bold">{count >= 5 ? 3 : 0}/3</span></div>
              <div className="rounded-lg border border-primary/50 bg-background px-2 py-1.5"><span className="mr-1.5 text-muted-foreground">합계</span><span className="font-mono font-bold">{count} steps</span></div>
            </div>
          </div>
        );
      }}
    />
  );
}
