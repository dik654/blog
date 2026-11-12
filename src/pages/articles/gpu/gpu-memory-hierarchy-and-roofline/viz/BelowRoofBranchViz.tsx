import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째·셋째 문단과 #limits — 측정점이 상한 아래일 때
 * 관찰한 counter에 따라 확인할 것과 다음 실험이 갈린다. 원인을 확정하는 표가 아니라 다음 질문의 갈래다.
 * 모든 장면이 같은 나무를 그리고 강조만 바꾸므로 높이가 변하지 않는다.
 */
type Node = { id: string; title: string; body: string };

const ROOT: Node = { id: "root", title: "측정점이 상한 아래", body: "선 아래라는 사실만으로 원인을 알 수 없습니다." };

const BRANCHES: readonly { head: Node; leaves: readonly Node[] }[] = [
  {
    head: { id: "dram", title: "DRAM throughput이 높음", body: "Byte를 줄여 시간도 주는지 봅니다." },
    leaves: [{ id: "dram-leaf", title: "시간도 줄면", body: "대역폭 병목이라는 증거가 쌓입니다." }],
  },
  {
    head: { id: "low", title: "DRAM·계산 pipe 둘 다 낮음", body: "Ready warp, 직렬 의존, 작은 grid, launch 공백을 확인합니다." },
    leaves: [
      { id: "dep", title: "다음 주소가 이전 읽기 값에 달림", body: "독립 작업을 늘리거나 의존 경로를 바꿉니다." },
      { id: "launch", title: "kernel 1000개 × 4μs = 4ms (가정)", body: "Launch 수를 줄여 보고 전체 시간을 다시 잽니다." },
    ],
  },
  {
    head: { id: "pipe", title: "계산 상한 쪽을 의심", body: "실제로 쓴 pipe의 throughput과 명령 구성을 봅니다." },
    leaves: [{ id: "pipe-leaf", title: "같은 연산 종류로 비교", body: "다른 dtype의 peak나 임의 문턱 하나로 확정하지 않습니다." }],
  },
];

const ALL_NODES: readonly Node[] = [ROOT, ...BRANCHES.flatMap((branch) => [branch.head, ...branch.leaves])];

const SCENES = [
  { label: "출발점", summary: "원인은 아직 미정", path: ["root"], note: "측정한 성능이 계산한 상한보다 낮다는 것까지만 알았습니다. 어떤 counter가 높고 낮은지에 따라 다음 질문이 갈립니다." },
  { label: "DRAM이 높을 때", summary: "byte를 줄여 시간 확인", path: ["root", "dram", "dram-leaf"], note: "DRAM throughput이 높으면 byte를 줄이는 실험을 합니다. 시간도 함께 줄 때 대역폭 병목이라는 증거가 쌓입니다. 이미 대역폭을 채웠다면 작업 수만 늘려서는 바이트당 시간이 줄지 않습니다." },
  { label: "둘 다 낮고 의존이 있을 때", summary: "독립 작업 늘리기", path: ["root", "low", "dep"], note: "DRAM과 계산 pipe가 모두 낮다면 기다리는 이유를 찾습니다. 다음 주소가 이전 읽기 값에 달려 있으면 통로가 넓어도 요청을 낼 수 없습니다." },
  { label: "둘 다 낮고 launch가 많을 때", summary: "1000 × 4μs = 4ms (가정)", path: ["root", "low", "launch"], note: "작은 kernel 1000개를 순차로 내면 시작 비용만 4ms가 됩니다. byte를 조금 줄이기보다 launch 수를 줄이는 실험이 유용할 수 있습니다. 다만 fusion은 register와 shared memory를 늘려 spill이나 상주 자원 감소를 부를 수 있으니 전체 시간을 다시 잽니다." },
  { label: "계산 쪽을 의심할 때", summary: "실제 pipe와 dtype로 비교", path: ["root", "pipe", "pipe-leaf"], note: "계산 상한에 가까운지는 실제로 쓴 pipe의 throughput과 명령 구성으로 봅니다. Scalar FP32 덧셈에 FP16 Tensor peak를 넣으면 다른 계산기의 능력을 비교하게 되고, 어느 pipe가 80%를 넘었다는 임의 문턱만으로 compute-bound를 확정하지 않습니다." },
] as const;

function Box({ node, on, strong = false, hideIdleBody = false }: { node: Node; on: boolean; strong?: boolean; hideIdleBody?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-2.5 py-1.5 text-xs leading-5 transition-colors duration-200 motion-reduce:transition-none ${
        on ? "border-[#2563eb] bg-[#2563eb]/10 text-foreground" : "border-border text-muted-foreground"
      }`}
    >
      <p className={`font-semibold ${on || strong ? "text-foreground" : ""}`}>{node.title}</p>
      {(on || !hideIdleBody) && <p className="mt-1">{node.body}</p>}
    </div>
  );
}

export default function BelowRoofBranchViz() {
  return (
    <SceneShell
      eyebrow="상한 아래의 갈래"
      title="어느 counter가 높은지에 따라 다음 실험이 달라집니다"
      description="파란 칸이 지금 따라가는 길이며 설명도 그 칸에만 펼칩니다. 좁은 화면에서는 그 길만 보입니다. 각 칸은 확인할 질문이며, 칸에 도착했다고 원인이 확정되지는 않습니다."
      note="9절과 10절의 관찰을 한 나무로 모았습니다. 4μs와 1000개는 본문의 가정입니다."
      ariaLabel="측정점이 상한 아래일 때 DRAM, 계산 pipe, 의존, launch 비용에 따라 갈리는 다음 실험"
      scenes={SCENES}
      render={(active) => {
        return (
          <div className="min-w-0">
            <div className="sm:hidden">
              <StableSceneStack
                active={active}
                scenes={SCENES.map((scene) => (
                  <div key={scene.label} className="space-y-2">
                    {ALL_NODES.filter((node) => (scene.path as readonly string[]).includes(node.id)).map((node, index) => (
                      <div key={node.id} style={{ marginLeft: `${index * 12}px` }}>
                        <Box node={node} on />
                      </div>
                    ))}
                    {scene.path.length === 1 && <p className="px-1 text-xs leading-5 text-muted-foreground">다음 장면부터 갈래 하나씩 따라갑니다: DRAM이 높을 때 · 둘 다 낮을 때(의존, launch) · 계산 쪽을 의심할 때.</p>}
                  </div>
                ))}
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <StableSceneStack
                active={active}
                scenes={SCENES.map((scene) => {
                  const on = new Set<string>(scene.path);
                  return (
                    <div key={scene.label} className="space-y-2">
                      <p className="rounded-lg border border-[#2563eb] bg-[#2563eb]/10 px-3 py-1.5 text-xs leading-5">
                        <span className="font-semibold">{ROOT.title}</span>
                        <span className="text-muted-foreground"> · {ROOT.body}</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {BRANCHES.map((branch) => (
                          <div key={branch.head.id} className="min-w-0 space-y-1.5 border-l border-border pl-2">
                            <Box node={branch.head} on={on.has(branch.head.id)} hideIdleBody />
                            {branch.leaves.map((leaf) => (
                              <Box key={leaf.id} node={leaf} on={on.has(leaf.id)} hideIdleBody />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
