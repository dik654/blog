import VizFrame from "@/components/viz/VizFrame";

const PODS = [
  { label: "Pod 1", state: "Ready", tone: "ready" },
  { label: "Pod 2", state: "Ready", tone: "ready" },
  { label: "Pod 3", state: "준비 중", tone: "pending" },
] as const;

export default function CapacityGapViz() {
  return (
    <VizFrame
      eyebrow="용량 계산"
      title="Pod 객체가 세 개여도 Ready가 둘이면 처리 용량은 둘 분만 나옵니다"
      description="replicas는 만들 Pod 수를 적지만, 사용자 요청은 준비 검사를 통과한 Pod에만 전달됩니다."
      note="Pod당 35 req/s와 입력 90 req/s는 경로를 설명하기 위한 가정입니다."
      canvasClassName="p-3 sm:p-6"
    >
      <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,0.8fr)_2rem_minmax(0,1.35fr)_2rem_minmax(0,0.9fr)] md:items-center">
        <div className="border border-border bg-background p-4 text-center">
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground">입력</span>
          <strong className="mt-1 block text-2xl tabular-nums text-foreground">90 req/s</strong>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">사용자 요청</span>
        </div>

        <div className="flex items-center justify-center text-muted-foreground" aria-hidden="true">
          <span className="md:hidden">↓</span>
          <span className="hidden md:inline">→</span>
        </div>

        <div className="border border-border bg-background p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <strong className="text-sm text-foreground">checkout Deployment</strong>
            <span className="text-[10px] font-bold text-muted-foreground">replicas: 3</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PODS.map((pod) => (
              <div
                key={pod.label}
                className={`min-w-0 border px-2 py-3 text-center ${
                  pod.tone === "ready"
                    ? "border-emerald-500/45 bg-emerald-500/[0.06]"
                    : "border-amber-500/45 bg-amber-500/[0.06]"
                }`}
              >
                <strong className="block text-xs text-foreground">{pod.label}</strong>
                <span className="mt-1 block break-keep text-[10px] font-bold text-muted-foreground">
                  {pod.state}
                </span>
                <span className="mt-2 block text-[10px] tabular-nums text-muted-foreground">
                  {pod.tone === "ready" ? "35 req/s" : "0 req/s"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-muted-foreground" aria-hidden="true">
          <span className="md:hidden">↓</span>
          <span className="hidden md:inline">→</span>
        </div>

        <div className="grid gap-2">
          <div className="border border-emerald-500/45 bg-emerald-500/[0.06] p-3 text-center">
            <span className="text-[10px] font-bold text-muted-foreground">현재 처리</span>
            <strong className="mt-1 block text-xl tabular-nums text-foreground">70 req/s</strong>
          </div>
          <div className="border border-rose-500/45 bg-rose-500/[0.06] p-3 text-center">
            <span className="text-[10px] font-bold text-muted-foreground">대기·거절 가능</span>
            <strong className="mt-1 block text-xl tabular-nums text-foreground">20 req/s</strong>
          </div>
        </div>
      </div>

      <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
        Controller가 맞추는 값은 <strong className="text-foreground">존재하는 Pod 수</strong>이고, 사용자 용량을 만드는 값은 <strong className="text-foreground">Ready endpoint 수</strong>입니다. 두 숫자 사이를 다섯 단계로 쪼개 어디서 멈춰 있는지 찾아야 합니다.
      </p>
    </VizFrame>
  );
}
