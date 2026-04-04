import { useState, type ReactNode } from 'react';

export type StepDef = string | { label: string; body?: string };

interface Props {
  steps: StepDef[];
  children: (step: number) => ReactNode;
}

export default function StepViz({ steps, children }: Props) {
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const label = typeof cur === 'string' ? cur : cur.label;
  const body = typeof cur === 'string' ? undefined : cur.body;

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <div className="flex gap-1.5 mb-5">
        {steps.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <div className="min-h-[160px] flex items-center justify-center">
        {children(step)}
      </div>
      <div className="mt-4 px-2">
        <p className="text-sm font-semibold text-foreground text-center leading-snug">{label}</p>
        {body && (
          <p className="text-xs text-foreground/75 mt-3 leading-relaxed border-t border-border/50 pt-3">
            {body}
          </p>
        )}
      </div>
      <div className="flex justify-center items-center gap-3 mt-4">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="px-4 py-1.5 text-xs rounded-lg border disabled:opacity-30 hover:bg-accent cursor-pointer transition-colors">
          ← 이전
        </button>
        <span className="text-xs text-foreground/75 tabular-nums">{step + 1} / {steps.length}</span>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          className="px-4 py-1.5 text-xs rounded-lg border disabled:opacity-30 hover:bg-accent cursor-pointer transition-colors">
          다음 →
        </button>
      </div>
    </div>
  );
}
