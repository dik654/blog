import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Policy", "현재 θ"],
  ["Rollout", "G completions"],
  ["Verifier", "reward vector"],
  ["Relative signal", "advantage"],
  ["Update", "new θ"],
] as const;

export default function OnlineLoopViz() {
  return (
    <VizFrame
      eyebrow="On-policy RL loop"
      title="현재 student가 만든 completion이 바로 다음 update의 data가 됩니다"
      description="Teacher trace를 미리 고정해 모사하는 SFT distillation과 달리, rollout distribution은 policy가 바뀔 때마다 함께 이동합니다."
    >
      <div className="grid gap-5 md:grid-cols-5">
        {stages.map(([title, body], index) => (
          <div key={title} className="min-w-0">
            <p className="font-mono text-xs text-primary">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
