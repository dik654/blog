import VizFrame from "@/components/viz/VizFrame";

const loop = [
  ["Artifact", "versioned output", "candidate"],
  ["Verifier", "test · schema · rubric", "evidence"],
  ["Diagnosis", "failure cause", "targeted feedback"],
  ["Replan", "change affected task", "next attempt"],
] as const;

export default function VerificationLoopViz() {
  return (
    <VizFrame
      eyebrow="Feedback loop"
      title="Reflection은 외부 판정 결과를 다음 state 변경으로 연결할 때 의미가 있습니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loop.map(([name, input, output], index) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {input}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {output}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
