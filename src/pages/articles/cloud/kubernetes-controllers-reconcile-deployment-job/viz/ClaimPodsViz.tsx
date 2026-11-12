import SceneShell from "./SceneShell";

/**
 * 본문 대응: #edit-pod — ClaimPods가 소유 여부 × selector 일치로 Pod를 나누고 개수만 비교한다.
 * 라벨을 app=web-debug로 바꾸면 release → 소유 2 → diff −1 → 새 Pod → 전체 4.
 * selector에 맞는 bare Pod는 adopt → 소유 4 → diff +1 → 덜 준비된 Pod(Pending인 수동 Pod)부터 1개 삭제.
 * 칸은 소유 여부 2줄 × selector 2열로 고정하고, Pod 다섯 칸을 같은 자리에 둔다.
 */
type Quad = "owned-match" | "owned-miss" | "orphan-match" | "orphan-miss";

interface Pod {
  id: string;
  quad: Quad;
  note?: string;
  tone: string;
  dashed?: boolean;
  struck?: boolean;
}

const RS = "#2563eb";
const DEBUG = "#d97706";
const BARE = "#7c3aed";
const MUTED = "#94a3b8";
const HOT = "#0891b2";
const GONE = "#dc2626";

const PODS: readonly (readonly Pod[])[] = [
  [
    { id: "A", quad: "owned-match", tone: RS },
    { id: "B", quad: "owned-match", tone: RS },
    { id: "C", quad: "owned-match", tone: RS },
  ],
  [
    { id: "A", quad: "owned-match", tone: RS },
    { id: "B", quad: "owned-match", tone: RS },
    { id: "C", quad: "orphan-miss", note: "web-debug · release됨", tone: DEBUG },
    { id: "D", quad: "owned-match", note: "새로 생성", tone: RS, dashed: true },
  ],
  [
    { id: "A", quad: "owned-match", tone: RS },
    { id: "B", quad: "owned-match", tone: RS },
    { id: "C", quad: "owned-match", tone: RS },
    { id: "M", quad: "owned-match", note: "adopt됨 · Pending → 삭제", tone: BARE, struck: true },
  ],
];

const SCENES = [
  {
    label: "네 갈래로 나눔",
    summary: "소유 3 = replicas 3",
    note: "ReplicaSet은 Pod마다 '내가 ownerReferences에 적혀 있나'와 'selector에 맞나'를 봅니다. 둘 다 맞는 Pod만 셉니다. spec이 template과 같은지는 보지 않습니다.",
  },
  {
    label: "라벨을 바꾸면",
    summary: "release → 소유 2 → 하나 더 생성 → 전체 4",
    note: "Pod C의 라벨을 app=web-debug로 바꾸면 '소유하지만 selector 불일치'가 되어 ownerReferences가 지워집니다. 소유 Pod가 2이니 차이 −1로 D를 만들어, 클러스터의 Pod는 넷이 됩니다.",
  },
  {
    label: "bare Pod를 만들면",
    summary: "adopt → 소유 4 → 1개 삭제",
    note: "selector에 맞는 라벨로 직접 만든 Pod M은 '고아이고 selector 일치'라 입양됩니다. 소유 4, 차이 +1이므로 하나를 지우는데, 미배치 → Pending → NotReady 순으로 고르므로 Pending인 M이 먼저 지워집니다(M만 Pending이고 A·B·C는 Ready라고 가정).",
  },
] as const;

const QUADS: readonly { key: Quad; title: string; action: string }[] = [
  { key: "owned-match", title: "소유 · selector 일치", action: "내 Pod로 셈" },
  { key: "owned-miss", title: "소유 · selector 불일치", action: "release: ownerReferences 지움" },
  { key: "orphan-match", title: "소유자 없음 · selector 일치", action: "adopt: 소유자로 적고 셈" },
  { key: "orphan-miss", title: "소유자 없음 · selector 불일치", action: "세지 않음" },
];

const COUNT_LINE = [
  "소유 3 − replicas 3 = 0 → 아무 일도 안 함 · 클러스터의 Pod 3",
  "소유 2 − replicas 3 = −1 → D 생성 · 클러스터의 Pod 4",
  "소유 4 − replicas 3 = +1 → M 삭제 · 클러스터의 Pod 3",
] as const;

const SCENE_FLOW: readonly (readonly Quad[])[] = [[], ["owned-miss"], ["orphan-match"]];

function PodChip({ pod }: { pod: Pod }) {
  return (
    <span
      className="inline-flex min-h-8 min-w-[2rem] items-center justify-center gap-1 rounded-md border px-2 py-1 font-mono text-xs font-bold"
      style={
        pod.struck
          ? { borderColor: GONE, borderStyle: "dashed", color: GONE }
          : pod.dashed
            ? { borderColor: pod.tone, borderStyle: "dashed", color: pod.tone }
            : { borderColor: pod.tone, backgroundColor: pod.tone, color: "#ffffff" }
      }
    >
      <span className={pod.struck ? "line-through" : undefined}>{pod.id}</span>
      {pod.note ? <span className="font-sans text-[10px] font-semibold">{pod.note}</span> : null}
    </span>
  );
}

export default function ClaimPodsViz() {
  return (
    <SceneShell
      eyebrow="ClaimPods"
      title="ReplicaSet은 소유와 selector 두 질문으로 Pod를 나누고 개수만 맞춥니다"
      description="replicas 3, selector app=web인 ReplicaSet 하나입니다. 네 칸은 '이 ReplicaSet이 ownerReferences에 적혀 있나' × 'selector에 맞나'이고, 칩은 Pod입니다. 파랑은 소유된 Pod, 주황은 라벨을 바꾼 Pod, 점선 테두리는 이번 reconcile이 만들거나(파랑) 지우는(빨강, 직접 만든 bare Pod M) Pod입니다. 청록 테두리 칸이 이번 장면에서 Pod가 지나간 갈래입니다."
      note="장면 2와 3은 따로 일어나는 두 사례입니다. 장면 2의 C는 release 직후 위치이며, 그 뒤 새 Pod D가 소유 칸에 들어옵니다."
      ariaLabel="소유 여부와 selector 일치로 Pod를 나누는 네 갈래와 라벨 변경, bare Pod 입양 사례"
      scenes={SCENES}
      render={(active) => {
        const pods = PODS[active];
        const flow = SCENE_FLOW[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {QUADS.map((quad) => {
                const inQuad = pods.filter((pod) => pod.quad === quad.key);
                const hot = flow.includes(quad.key);
                return (
                  <div key={quad.key} className="min-w-0 rounded-lg border px-3 py-2" style={{ borderColor: hot ? HOT : quad.key === "owned-match" ? RS : MUTED }}>
                    <p className="text-xs font-bold">{quad.title}</p>
                    <p className={`text-[11px] leading-4 sm:text-xs ${hot ? "font-semibold text-[#0e7490]" : "text-muted-foreground"}`}>{quad.action}</p>
                    <div className="mt-2 flex min-h-[2rem] flex-wrap gap-1">
                      {inQuad.map((pod) => (
                        <PodChip key={pod.id} pod={pod} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded-lg border border-border px-3 py-2 font-mono text-xs font-bold leading-5 sm:text-sm">
              {COUNT_LINE[active]}
            </p>
          </div>
        );
      }}
    />
  );
}
