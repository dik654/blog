import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  { index: "01", input: "x₁=1", before: "h₀=0", state: "h₁=.462" },
  { index: "02", input: "x₂=0", before: "h₁=.462", state: "h₂=.354" },
  { index: "03", input: "x₃=1", before: "h₂=.354", state: "h₃=.654" },
] as const;

export default function RNNUnrollViz() {
  return (
    <VizFrame
      eyebrow="접힌 self-loop를 실행 순서로 펼칩니다"
      title="세 시점의 값은 다르지만 transition parameter는 한 벌입니다"
      description="각 칸은 직전 state를 기다린 뒤 같은 식을 한 번 호출합니다."
      note="Stacked layer의 깊이와 sequence를 펼친 time depth는 다른 축입니다. 아래 세 칸은 서로 다른 layer가 아닙니다."
    >
      <div className="grid grid-cols-3 gap-px bg-border p-px">
        {STEPS.map((step, index) => (
          <div key={step.index} className="relative min-w-0 bg-background px-2 py-4 text-center">
            <p className="font-mono text-[9px] text-muted-foreground">STEP {step.index}</p>
            <p className="mt-2 break-keep font-mono text-xs font-bold">{step.input}</p>
            <p className="mt-2 break-keep text-[9px] text-muted-foreground">{step.before}</p>
            <p className="mt-2 break-keep font-mono text-xs font-black text-primary">{step.state}</p>
            {index < STEPS.length - 1 ? <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 text-primary">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-4 border-l-2 border-primary pl-3">
        <p className="text-[10px] font-bold text-muted-foreground">모든 시점이 공유하는 식</p>
        <p className="mt-1 break-keep font-mono text-xs font-bold sm:text-sm">hₜ = tanh(0.8hₜ₋₁ + 0.5xₜ)</p>
      </div>
    </VizFrame>
  );
}
