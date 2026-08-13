import Math from "@/components/ui/math";
import VizFrame from "@/components/viz/VizFrame";

const steps = [
  { token: "개가", before: "h₀", kept: "주어=개", faded: "—" },
  { token: "사람을", before: "h₁", kept: "주어=개 · 목적어=사람", faded: "표면형 일부" },
  { token: "물었다", before: "h₂", kept: "개가 사람을 물음", faded: "오래된 세부" },
] as const;

export default function RNNStateCompressionViz() {
  return (
    <VizFrame
      eyebrow="상태가 하는 일"
      title="RNN은 과거 token을 보관하지 않고 고정 크기 state를 계속 덮어쓴다"
      description="각 시점의 cell은 현재 token과 직전 state만 받습니다. 과거는 h에 남은 표현을 통해서만 다음 시점에 영향을 줍니다."
      note="state dimension이 고정되어 있으므로 이 그림의 h는 원문 전체가 아니라 task에 유용하도록 학습된 손실 압축입니다."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.token} className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xs font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">현재 입력</p>
                <p className="mt-0.5 break-keep text-sm font-bold text-foreground">{step.token}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="shrink-0 rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
                <Math>{step.before}</Math>
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">›</span>
            </div>
            <div className="mt-3 rounded-lg border border-primary/30 bg-background p-4">
              <p className="text-xs font-bold text-primary">새 hidden state</p>
              <p className="mt-2 break-keep text-sm font-semibold leading-6 text-foreground">
                {step.kept}
              </p>
              <div className="mt-4 border-t border-border/60 pt-3">
                <p className="text-[11px] text-muted-foreground">약해지거나 사라질 수 있는 것</p>
                <p className="mt-1 text-xs text-muted-foreground/75">{step.faded}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
