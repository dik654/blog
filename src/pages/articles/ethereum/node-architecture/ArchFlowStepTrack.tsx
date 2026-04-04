import { codeRefs } from './archCodeRefs';

export default function ArchFlowStepTrack({
  moduleId, steps, step, setStep,
}: {
  moduleId: string;
  steps: { desc: string; modules: string[] }[];
  step: number;
  setStep: (i: number) => void;
}) {
  const total = steps.length;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center flex-1 min-w-0">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setStep(i)}
              className={`relative w-5 h-5 rounded-full text-[9px] font-bold shrink-0 transition-all cursor-pointer
                ${i === step     ? 'bg-foreground text-background shadow-sm scale-110'
                  : i < step     ? 'bg-foreground/30 text-foreground/60'
                  :                'bg-muted text-foreground/75 hover:bg-muted-foreground/20'}`}
            >
              {i + 1}
              {codeRefs[`${moduleId}-${i}`] && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 border border-background" />
              )}
            </button>
            {i < total - 1 && (
              <div className={`flex-1 h-px mx-0.5 transition-colors ${i < step ? 'bg-foreground/30' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
