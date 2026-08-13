import VizFrame from "@/components/viz/VizFrame";

const phases = [
  ["Artifact", "weight · tokenizer · template"],
  ["Initialize", "load · distributed init · warm-up"],
  ["Admit", "startup → readiness"],
  ["Canary", "quality · format · SLI"],
  ["Drain", "stop admission · finish streams"],
] as const;

export default function DeploymentLifecycleViz() {
  return (
    <VizFrame
      eyebrow="Deployment lifecycle"
      title="배포는 새 process를 띄우는 일이 아니라 traffic을 안전하게 넘기는 과정입니다"
    >
      <div className="grid gap-5 md:grid-cols-5">
        {phases.map(([title, body], index) => (
          <div key={title} className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
              <p className="text-sm font-bold text-foreground">{title}</p>
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
