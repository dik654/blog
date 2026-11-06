import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gpu-queue-monitoring — utilization은 시간 비율, memory는 공간 점유.
 * 78%(1초 중 780ms)와 80GB 중 KV cache 52GB는 본문의 별개 예시. 뒤 두 장면의 30%·100%·50%는
 * 본문에 없는 수치이므로 (가정)으로 표시한다.
 */
const SCENES = [
  { label: "시간 축과 공간 축", summary: "78% · 52GB/80GB", util: 78, memory: 65, memoryLabel: "KV cache 52GB / 80GB", tail: "막대는 KV cache 몫만 그렸습니다", assumed: false, note: "Utilization은 1초 중 780ms처럼 연산 중인 시간의 비율이고, memory는 KV cache·weight·activation이 차지한 양입니다. 두 수치는 본문의 별개 예시입니다. KV cache는 앞서 계산한 token 정보를 다시 쓰려고 보관하는 메모리입니다." },
  { label: "Memory 가득, utilization 낮음", summary: "batch를 못 키움", util: 30, memory: 100, memoryLabel: "가득 참", tail: "batch에 더 넣을 자리 없음", assumed: true, note: "같은 GPU에서 나온 신호인데 병목이 다릅니다. 메모리가 가득 차 batch를 키우지 못하고, 그래서 GPU가 노는 시간이 생긴 경우입니다." },
  { label: "Memory 여유, utilization 낮음", summary: "scheduling을 의심", util: 30, memory: 50, memoryLabel: "여유 있음", tail: "자리는 있는데 GPU가 놂", assumed: true, note: "메모리에 여유가 있는데도 utilization이 낮다면 batch 크기 자체가 아니라 scheduling이 원인일 수 있습니다." },
] as const;

function Timeline({ percent }: { percent: number }) {
  return (
    <div className="mt-1 h-6 border border-border/70 p-px">
      <div className="h-full bg-primary/70" style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function GpuTimeMemoryViz() {
  return (
    <SceneShell
      eyebrow="GPU 신호 두 개"
      title="Utilization은 시간을, memory는 공간을 잽니다"
      description="위 띠 전체가 1초이고 칠한 길이가 연산 중인 시간 합계이며, 아래 막대는 GPU 메모리에서 찬 양입니다. (가정) 표시의 수치는 설명용입니다."
      ariaLabel="GPU utilization 시간 띠와 memory 막대의 세 가지 조합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mark = scene.assumed ? " (가정)" : "";
        return (
          <div className="space-y-4">
            <div>
              <p className="flex justify-between gap-2 text-xs"><span className="font-bold">Utilization · 1초 중 연산 시간</span><span className="font-mono font-bold">{scene.util}%{mark}</span></p>
              <Timeline percent={scene.util} />
            </div>
            <div>
              <p className="flex justify-between gap-2 text-xs"><span className="font-bold">Memory · 찬 양</span><span className="font-mono font-bold">{scene.memoryLabel}{mark}</span></p>
              <div className="mt-1 h-6 border border-border/70 p-px">
                <div className="h-full bg-amber-600/70" style={{ width: `${scene.memory}%` }} />
              </div>
            </div>
            <p className="min-h-6 text-sm font-semibold">{scene.tail}</p>
          </div>
        );
      }}
    />
  );
}
