import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./StepFunctionData";

function Plot({ derivative }: { derivative: boolean }) {
  return (
    <svg viewBox="0 0 300 140" className="h-auto w-full" aria-hidden="true">
      <path d="M22 14V116H282" fill="none" stroke="var(--border)" strokeWidth="1" />
      {derivative ? (
        <path d="M28 108H276" fill="none" stroke="var(--primary)" strokeWidth="1.25" />
      ) : (
        <><path d="M28 108H150M150 36H276" fill="none" stroke="var(--primary)" strokeWidth="1.25" /><path d="M150 108V36" fill="none" stroke="var(--muted-foreground)" strokeDasharray="3 4" strokeWidth="1" /></>
      )}
    </svg>
  );
}

export default function StepFunctionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-3xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
          <div className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-xs font-bold text-foreground">{step === 0 ? "Forward: hard threshold" : "Backward: flat derivative"}</p>
            <Plot derivative={step === 1} />
          </div>
          <div className="min-w-0 border-l border-primary/50 pl-5">
            <p className="text-[10px] font-bold text-primary">학습 신호</p>
            <p className="mt-2 text-lg font-bold text-foreground">{step === 0 ? "출력은 즉시 바뀝니다" : "기울기는 전달되지 않습니다"}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{step === 0 ? "0을 지나는 순간에만 output이 0에서 1로 점프합니다." : "Threshold 밖의 local derivative가 0이어서 chain rule의 곱도 0이 됩니다."}</p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
