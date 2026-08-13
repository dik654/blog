import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["01", "Batch", "(x, y)", "입력과 target을 묶음"],
  ["02", "Forward", "ŷ = fθ(x)", "현재 θ로 prediction 계산"],
  ["03", "Loss", "L(ŷ, y)", "오차를 scalar로 요약"],
  ["04", "Backward", "∇θL", "파라미터별 책임 계산"],
  ["05", "Update", "θ ← θ − η∇θL", "다음 step의 θ를 만듦"],
] as const;

export default function LearningLoopViz() {
  return (
    <VizFrame
      eyebrow="Training loop"
      title="딥러닝 학습은 다섯 계산을 같은 batch에서 반복하는 일입니다"
      description="각 단계의 출력이 다음 단계의 입력이 되며, update가 끝나야 한 training step이 완료됩니다."
      note="Inference에서는 학습된 θ를 고정하므로 forward만 실행하고 backward·update는 수행하지 않습니다."
    >
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-7">
        {stages.map(([order, title, value, detail]) => (
          <div key={title} className="min-w-0 border-l border-border/80 pl-4">
            <p className="font-mono text-xs font-bold text-primary">{order}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words font-mono text-xs leading-5 text-foreground/80">
              {value}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
