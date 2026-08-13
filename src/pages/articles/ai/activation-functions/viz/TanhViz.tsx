import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./TanhData";

export default function TanhViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-3xl gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12">
          <svg viewBox="0 0 320 150" className="h-auto w-full" aria-hidden="true"><path d="M20 74H302M160 14V132" fill="none" stroke="var(--border)" strokeWidth="1"/><path d="M28 118C90 118 110 102 138 82S184 34 294 30" fill="none" stroke="var(--primary)" strokeWidth="1.25"/>{step === 0 && <path d="M28 104C92 104 108 93 139 74S184 40 294 38" fill="none" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth="1"/>}</svg>
          <div className="min-w-0 border-l border-primary/50 pl-5"><p className="text-xs font-bold text-foreground">{step === 0 ? "Tanh · signed output" : "Zero-centered update"}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{step === 0 ? "실선은 −1부터 1까지 지나고, 점선 sigmoid는 0부터 1까지만 사용합니다." : "양수와 음수 activation이 있어 parameter coordinate별 gradient 부호가 더 독립적으로 나타날 수 있습니다."}</p></div>
        </div>
      )}
    </StepViz>
  );
}
