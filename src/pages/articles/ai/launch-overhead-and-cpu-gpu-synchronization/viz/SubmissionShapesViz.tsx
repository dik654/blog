import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #graph-comparison — Fusion은 kernel을 합치고, batch는 한 작업의 데이터 양을 바꾸며,
 * graph는 이 사례처럼 kernel을 그대로 두고 반복 제출 경로를 줄일 수 있다.
 * 칸 수는 본문 사례의 kernel 두 개를 기준으로 한 그림이다(가정).
 */
const SHAPES: readonly { name: string; changed: string; submits: number; kernels: readonly string[]; data: number }[] = [
  { name: "하나씩 제출", changed: "기준", submits: 2, kernels: ["K", "K"], data: 1 },
  { name: "Graph", changed: "이 사례처럼 kernel은 그대로 두고 반복 제출 경로를 줄일 수 있음", submits: 1, kernels: ["K", "K"], data: 1 },
  { name: "Fusion", changed: "kernel을 합침, 전달 횟수와 중간 데이터 이동 등이 바뀜", submits: 1, kernels: ["K+K"], data: 1 },
  { name: "Batch", changed: "한 작업에 넣는 데이터 양이 바뀜", submits: 2, kernels: ["K", "K"], data: 3 },
];

export default function SubmissionShapesViz() {
  return (
    <VizFrame
      eyebrow="무엇이 바뀌나"
      title="세 방법은 같은 곳을 바꾸지 않습니다"
      description="진회색 칸이 CPU의 제출 한 번, 파란 칸이 GPU가 실행하는 kernel, 초록 점이 한 작업에 든 데이터입니다."
      note="칸과 점의 수는 차이를 보이기 위한 그림입니다(가정). 실제 제출 비용이나 속도 차이를 뜻하지 않으며, 각 방법이 더하는 새 비용은 그리지 않았습니다."
      documentFlow
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {SHAPES.map((shape) => (
          <div key={shape.name} className="rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-bold">{shape.name}</p>
            <div className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-2 gap-y-2 text-xs">
              <span className="font-bold text-muted-foreground">제출</span>
              <div className="flex gap-1">
                {Array.from({ length: shape.submits }, (_, i) => (
                  <span key={i} className="h-5 w-8 rounded-sm bg-[#64748b]" />
                ))}
              </div>
              <span className="font-bold text-muted-foreground">실행</span>
              <div className="flex gap-1">
                {shape.kernels.map((kernel, i) => (
                  <span key={i} className={`flex h-7 items-center justify-center gap-1 rounded-sm bg-[#2563eb] px-2 font-mono text-[11px] font-bold text-white ${kernel === "K" ? "min-w-14" : "min-w-[7.25rem]"}`}>
                    {kernel}
                    {Array.from({ length: shape.data }, (_, d) => (
                      <span key={d} className="size-1.5 rounded-full bg-[#86efac]" />
                    ))}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{shape.changed}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
