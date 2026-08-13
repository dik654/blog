import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ReLUData";

export default function ReLUViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-3xl">
          {step === 0 && <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center"><svg viewBox="0 0 320 150" className="h-auto w-full" aria-hidden="true"><path d="M20 116H302M152 14V132" fill="none" stroke="var(--border)" strokeWidth="1"/><path d="M28 116H152L294 26" fill="none" stroke="var(--primary)" strokeWidth="1.25"/></svg><div className="border-l border-primary/50 pl-5"><p className="text-xs font-bold text-foreground">Piecewise local slope</p><p className="mt-2 font-mono text-sm text-primary">x&lt;0 → 0 · x&gt;0 → 1</p></div></div>}
          {step === 1 && <div className="grid gap-6 md:grid-cols-2"><div className="border-t border-primary/60 pt-4"><p className="text-xs font-bold text-foreground">활성 경로</p><p className="mt-2 font-mono text-xl font-bold text-primary">1 × 1 × …</p><p className="mt-2 text-xs text-muted-foreground">Activation local derivative가 추가로 줄이지 않음</p></div><div className="border-t border-border/80 pt-4"><p className="text-xs font-bold text-foreground">전체 경로</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Weight matrix·normalization·residual Jacobian은 여전히 gradient를 키우거나 줄일 수 있습니다.</p></div></div>}
          {step === 2 && <div className="grid gap-5 md:grid-cols-4">{["z가 계속 음수", "output 0", "local derivative 0", "update path 단절"].map((item, i) => <div key={item} className="border-t border-border/80 pt-4"><span className="font-mono text-[10px] font-bold text-primary">0{i+1}</span><p className="mt-2 text-xs font-bold leading-5 text-foreground">{item}</p></div>)}</div>}
        </div>
      )}
    </StepViz>
  );
}
