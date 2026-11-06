import SceneShell from "./SceneShell";

/**
 * 본문 대응: #eviction — 공통 6과 끝 q1·q2·q3(각 2). 잠금 0이면 3자리 요구에 q1·q2를 지워 4를 반환.
 * 별도 상태에서 R3 경로를 잠그면 protected 8·evictable 4라 5자리 요구를 채우지 못한다.
 * 자식을 모두 잃고 잠금도 0인 부모는 후보가 된다.
 */
type NodeState = "free" | "gone" | "locked" | "candidate";
interface Scene {
  label: string;
  summary: string;
  note: string;
  root: NodeState;
  leaves: readonly [NodeState, NodeState, NodeState];
  evictable: number;
  protectedCount: number;
  returned: string;
}

const SCENES: readonly Scene[] = [
  { label: "잠금 0", summary: "지울 수 있는 수 12 · 보호 0", note: "세 요청이 끝나 잠금이 0입니다. 자식이 없는 끝 구간(leaf) q1·q2·q3가 후보이고, 오래된 순서도 같다고 둡니다(가정).", root: "free", leaves: ["candidate", "candidate", "candidate"], evictable: 12, protectedCount: 0, returned: "반환 0" },
  { label: "3자리 요구", summary: "q1 + q2 → 4자리 반환", note: "q1만으로는 2자리라 q2까지 지웁니다. 구간 단위로 반환하므로 정확히 3에서 멈추지 않고 4자리를 돌려줍니다.", root: "free", leaves: ["gone", "gone", "candidate"], evictable: 8, protectedCount: 0, returned: "요구 3 · 반환 4" },
  { label: "R3 경로를 잠그면", summary: "지울 수 있는 수 4 · 보호 8", note: "별도 상태로 돌아가 R3 경로를 잠급니다. 처음 0에서 잠기는 공통 6과 q3의 2, 합계 8이 지울 수 있는 수에서 보호 수로 옮겨 갑니다.", root: "locked", leaves: ["candidate", "candidate", "locked"], evictable: 4, protectedCount: 8, returned: "반환 0" },
  { label: "5자리 요구", summary: "4자리뿐 · 1자리 부족", note: "q1·q2의 4자리만 돌려줄 수 있습니다. 잠긴 경로를 내주어 수량을 맞추지 않으므로 5자리 요구는 채우지 못합니다.", root: "locked", leaves: ["gone", "gone", "locked"], evictable: 0, protectedCount: 8, returned: "요구 5 · 반환 4" },
  { label: "부모도 후보가 될 때", summary: "자식 없음 + 잠금 0", note: "R3 잠금이 없는 상태로 다시 돌아가 끝 구간을 모두 지웠다고 합시다. 공통 6은 자식이 없고 잠금도 0이라 후보가 됩니다. 실제 순서는 이 버전이 선택한 eviction_strategy를 따릅니다.", root: "candidate", leaves: ["gone", "gone", "gone"], evictable: 6, protectedCount: 0, returned: "끝 구간 6 반환 뒤" },
];

const STYLE: Record<NodeState, { stroke: string; dash?: string; text: string; tag: string }> = {
  free: { stroke: "#64748b", text: "currentColor", tag: "" },
  candidate: { stroke: "#b45309", text: "currentColor", tag: "후보" },
  locked: { stroke: "#15803d", text: "currentColor", tag: "잠금" },
  gone: { stroke: "#94a3b8", dash: "4 3", text: "#94a3b8", tag: "반환" },
};

function Node({ x, y, w, title, state }: { x: number; y: number; w: number; title: string; state: NodeState }) {
  const style = STYLE[state];
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={5} fill="none" stroke={style.stroke} strokeWidth={1.25} strokeDasharray={style.dash} />
      <text x={x + 8} y={y + 21} fontSize={12} fontWeight={700} fill={style.text}>{title}</text>
      {style.tag && <text x={x + w - 8} y={y + 21} textAnchor="end" fontSize={11} fontWeight={700} fill={style.stroke}>{style.tag}</text>}
    </g>
  );
}

const LEAVES = [["q1 · 2", 12], ["q2 · 2", 66], ["q3 · 2", 120]] as const;

function Meter({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_1.5rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{name}</span>
      <div className="grid h-3 grid-cols-12 gap-px">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="rounded-[1px]" style={{ backgroundColor: i < value ? color : "#94a3b833" }} />
        ))}
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

export default function EvictionLockViz() {
  return (
    <SceneShell
      eyebrow="(가정) 작은 사례의 반환"
      title="잠긴 길은 반환 후보에서 빠지고 수량이 모자라면 멈춥니다"
      description="왼쪽이 공통 6, 오른쪽이 끝 구간입니다. 아래 한 칸이 한 자리이며 지울 수 있는 수(evictable)와 보호 수(protected)를 셉니다."
      ariaLabel="사용 잠금에 따라 반환할 수 있는 구간과 자리 수가 바뀌는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div>
            <svg viewBox="0 0 320 166" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {LEAVES.map(([, y]) => (
                <path key={y} d={`M134 83L190 ${y + 17}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
              ))}
              <Node x={4} y={66} w={130} title="공통 6" state={scene.root} />
              {LEAVES.map(([title, y], i) => (
                <Node key={title} x={190} y={y} w={120} title={title} state={scene.leaves[i]} />
              ))}
            </svg>
            <div className="mt-2 space-y-1.5">
              <Meter name="지울 수 있음" value={scene.evictable} color="#b45309" />
              <Meter name="보호" value={scene.protectedCount} color="#15803d" />
            </div>
            <p className="mt-2 text-right font-mono text-xs font-bold">{scene.returned}</p>
          </div>
        );
      }}
    />
  );
}
