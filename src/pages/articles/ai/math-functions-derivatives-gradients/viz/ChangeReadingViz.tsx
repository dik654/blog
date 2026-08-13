import VizFrame from "@/components/viz/VizFrame";

const steps = [
  { no: "01", title: "함수", detail: "입력에서 출력으로 가는 규칙", value: "x → f(x)" },
  { no: "02", title: "작은 변화", detail: "입력과 출력의 차이를 관찰", value: "Δx → Δf" },
  { no: "03", title: "변화율", detail: "출력 변화 ÷ 입력 변화", value: "Δf / Δx" },
  { no: "04", title: "Gradient", detail: "여러 손잡이의 변화율을 vector로", value: "∇f" },
] as const;

export default function ChangeReadingViz() {
  return (
    <VizFrame eyebrow="Calculus reading path" title="한 입력의 변화율에서 수백만 parameter의 gradient까지" description="새 기호를 별개로 외우지 않고, 입력 변화가 출력에 전달되는 같은 질문을 단계별로 확장합니다.">
      <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.no} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] font-bold text-primary">{step.no}</span>
              <span className="font-mono text-xs text-foreground">{step.value}</span>
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">{step.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
