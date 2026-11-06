import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gpu-queue-monitoring — queue depth가 늘어도 처리 속도가 함께 빨라지면 queue time은 늘지 않을 수 있다.
 * 4개·8개와 초당 4개·8개는 설명용 가정. 대기 시간 ≈ 줄 길이 ÷ 처리 속도로 단순화해 4/4=1, 8/8=1, 8/4=2초.
 */
const SCENES = [
  { label: "출발점", summary: "4개 ÷ 초당 4개 = 1초", depth: 4, rate: 4, note: "칸 하나가 기다리는 요청입니다. 맨 뒤 요청은 앞의 줄이 다 빠질 때까지 약 1초 기다립니다." },
  { label: "줄이 늘고 처리도 빨라짐", summary: "8개 ÷ 초당 8개 = 1초", depth: 8, rate: 8, note: "Queue depth는 두 배가 됐지만 처리 속도도 두 배라 queue time은 그대로입니다. Depth만 봐서는 밀린다고 단정할 수 없습니다." },
  { label: "줄만 늘어남", summary: "8개 ÷ 초당 4개 = 2초", depth: 8, rate: 4, note: "Depth가 똑같이 8개여도 처리 속도가 그대로면 대기는 2초로 늘어납니다. 두 지표를 같이 봐야 “밀리고 있다”를 확인할 수 있습니다." },
] as const;

export default function QueueDepthTimeViz() {
  return (
    <SceneShell
      eyebrow="Queue depth와 queue time"
      title="줄이 길어져도 기다리는 시간은 그대로일 수 있습니다"
      description="개수와 처리 속도는 설명용(가정)이고, 대기 시간을 줄 길이 ÷ 처리 속도로 단순화했습니다. Queue depth는 대기 중인 요청 수, queue time은 한 요청이 실제로 기다린 시간입니다."
      ariaLabel="대기 요청 수와 처리 속도에 따른 대기 시간 세 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wait = scene.depth / scene.rate;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="grid min-w-0 flex-1 grid-cols-8 gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={`h-8 rounded-sm border ${i >= 8 - scene.depth ? "border-primary bg-primary/30" : "border-dashed border-border/40"}`} />
                ))}
              </div>
              <span aria-hidden="true" className="text-muted-foreground">→</span>
              <div className="w-20 shrink-0 rounded border border-border bg-background px-1 py-1 text-center text-xs leading-4">
                <span className="block font-bold">GPU</span>
                <span className="block font-mono">초당 {scene.rate}개</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="rounded border border-border/70 p-2"><span className="block text-xs text-muted-foreground">Queue depth</span><strong className="font-mono">{scene.depth}개</strong></p>
              <p className={`rounded border p-2 ${wait > 1 ? "border-red-600" : "border-border/70"}`}><span className="block text-xs text-muted-foreground">Queue time(맨 뒤)</span><strong className="font-mono">약 {wait}초</strong></p>
            </div>
          </div>
        );
      }}
    />
  );
}
