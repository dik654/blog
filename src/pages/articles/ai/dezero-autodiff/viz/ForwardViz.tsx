import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './ForwardVizData';
import { Step0, Step1, Step2, Step3 } from './ForwardVizSteps';

const RENDERERS = [Step0, Step1, Step2, Step3];

export default function ForwardViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const R = RENDERERS[step];
        return (
          <div className="w-full">
            <svg data-dezero-forward-viz viewBox="0 0 400 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <g transform={step === 0 ? 'translate(30 0)' : undefined}>
                <R />
              </g>
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[11px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
