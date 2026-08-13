import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./LinearVsNonlinearData";

function MiniPlot({ curved, active }: { curved?: boolean; active: boolean }) {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full" aria-hidden="true">
      <path d="M24 12V98H224" fill="none" stroke="var(--border)" strokeWidth="1" />
      {curved ? (
        <path d="M28 92C82 92 88 78 116 55S165 20 218 18" fill="none" stroke={active ? "var(--primary)" : "var(--muted-foreground)"} strokeWidth="1.25" />
      ) : (
        <path d="M30 92L216 18" fill="none" stroke={active ? "var(--primary)" : "var(--muted-foreground)"} strokeWidth="1.25" />
      )}
    </svg>
  );
}

export default function LinearVsNonlinearViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-3xl gap-8 md:grid-cols-2 md:gap-10">
          <div className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-xs font-bold text-foreground">Affine layer만 합성</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">깊어져도 effective transform 하나</p>
            <MiniPlot active={step < 2} />
            <p className="mt-2 font-mono text-xs text-muted-foreground">y = 3x + 4</p>
          </div>
          <div className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-xs font-bold text-foreground">중간에 nonlinear activation</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">입력 영역별로 다른 local slope</p>
            <MiniPlot curved active={step === 2} />
            <p className="mt-2 font-mono text-xs text-muted-foreground">affine → activation → affine</p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
