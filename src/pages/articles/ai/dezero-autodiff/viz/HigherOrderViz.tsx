import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './HigherOrderVizData';
import { Step0, Step1, Step2, Step3 } from './HigherOrderVizSteps';

const RENDERERS = [Step0, Step1, Step2, Step3];

export default function HigherOrderViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const C = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <C />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
