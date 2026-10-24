import VizFrame from "@/components/viz/VizFrame";

function PodSlots({ active, slots, tone }: { active: number; slots: number; tone: "max" | "min" }) {
  const color = tone === "max" ? "#2563eb" : "#059669";
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }} aria-label={`${active}개의 Pod 칸`}>
      {Array.from({ length: slots }, (_, index) => (
        <span
          key={index}
          className={`flex h-11 items-center justify-center rounded-md border text-[10px] font-bold ${index >= active ? "border-dashed border-border text-muted-foreground" : "text-white"}`}
          style={index < active ? { borderColor: color, backgroundColor: color } : undefined}
        >
          {index < active ? `Pod ${index + 1}` : "여유"}
        </span>
      ))}
    </div>
  );
}

export function RolloutBoundsViz({ replicas = 3 }: { replicas?: number }) {
  const percentage = replicas * 0.25;
  const surge = Math.ceil(percentage);
  const unavailable = Math.floor(percentage);
  const maxPods = replicas + surge;
  const minReady = replicas - unavailable;
  return (
    <VizFrame
      eyebrow="가정과 계산"
      title={`replicas ${replicas}에 25%를 적용하면 상한은 ${maxPods}, 하한은 ${minReady}입니다`}
      description={`가정값은 replicas ${replicas}와 기본 RollingUpdate 25%입니다. surge는 올림하고 unavailable은 내립니다.`}
      note="[A] Kubernetes v1.37.1 기본값과 ResolveFenceposts 식을 손으로 계산한 값이며, 클러스터 실측값이 아닙니다."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold text-foreground">{replicas} × 25% = {percentage} Pod</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs leading-5">
            <div className="border-l-2 border-[#2563eb] pl-3">
              <span className="text-muted-foreground">maxSurge</span>
              <strong className="block font-mono text-base text-[#2563eb]">ceil({percentage}) = {surge}</strong>
            </div>
            <div className="border-l-2 border-[#059669] pl-3">
              <span className="text-muted-foreground">maxUnavailable</span>
              <strong className="block font-mono text-base text-[#059669]">floor({percentage}) = {unavailable}</strong>
            </div>
          </div>
        </div>
        <div className="hidden text-center text-xl text-muted-foreground lg:block" aria-hidden="true">→</div>
        <div className="min-w-0 space-y-5">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
              <span className="font-semibold">전체 Pod 상한</span>
              <strong className="font-mono text-[#2563eb]">{replicas} + {surge} = {maxPods}</strong>
            </div>
            <PodSlots active={maxPods} slots={maxPods} tone="max" />
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
              <span className="font-semibold">가용 Pod 하한</span>
              <strong className="font-mono text-[#059669]">{replicas} − {unavailable} = {minReady}</strong>
            </div>
            <PodSlots active={minReady} slots={maxPods} tone="min" />
          </div>
        </div>
      </div>
    </VizFrame>
  );
}

const DELAYS = [10, 20, 40, 80, 160, 320] as const;

export function JobBackoffTimelineViz() {
  return (
    <VizFrame
      eyebrow="가정과 시간축"
      title="실패 여섯 번 뒤까지 기다리고, 일곱 번째 실패에서 멈춥니다"
      description="가정값은 completions 1, parallelism 1, backoffLimit 6입니다. 각 막대는 다음 Pod를 만들기 전 대기입니다."
      note="[A] 막대 너비는 지수 증가를 읽기 쉽게 로그 눈금으로 그렸습니다. 합계 630초는 Pod 실행 시간을 포함하지 않은 계산값입니다."
    >
      <div className="space-y-3" aria-label="Job 실패 횟수에 따른 재시도 대기 시간">
        {DELAYS.map((delay, index) => (
          <div key={delay} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs">
            <span className="font-semibold text-muted-foreground">실패 {index + 1}회</span>
            <div className="h-5 rounded-sm bg-muted" aria-hidden="true">
              <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(index + 1) / DELAYS.length * 100}%` }} />
            </div>
            <strong className="text-right font-mono text-foreground">{delay}초</strong>
          </div>
        ))}
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 border-t border-border pt-3 text-xs">
          <span className="font-semibold text-muted-foreground">실패 7회</span>
          <div className="border-l-2 border-[#dc2626] pl-3 font-semibold text-[#dc2626]">7 &gt; backoffLimit 6 → Job Failed</div>
          <strong className="text-right font-mono text-foreground">종료</strong>
        </div>
        <p className="pt-1 text-right font-mono text-xs font-bold text-foreground">대기 합계 10 + 20 + 40 + 80 + 160 + 320 = 630초</p>
      </div>
    </VizFrame>
  );
}
