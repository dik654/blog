import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["HPA decision", "desired Pod"],
  ["Scheduling", "Pending / placement"],
  ["Node provision", "machine · network"],
  ["GPU ready", "driver · plugin · labels"],
  ["Model ready", "artifact · warm-up"],
] as const;

export default function FleetCapacityViz() {
  return (
    <VizFrame
      eyebrow="Capacity activation"
      title="Replica 요청과 실제 serving capacity 사이에는 준비 경로가 있습니다"
      description="어느 단계가 병목인지 구분하지 않으면 HPA가 Pod 수만 늘리고 사용자 지연은 그대로 남을 수 있습니다."
    >
      <div className="grid gap-5 md:grid-cols-5">
        {stages.map(([title, body], index) => (
          <div
            key={title}
            className="min-w-0 border-b border-border/80 pb-4 md:border-b-0 md:border-l md:pb-0 md:pl-4"
          >
            <p className="font-mono text-xs text-primary">T{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
