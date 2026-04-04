import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_KEYS, STEP_LABELS } from './ContextVizData';
import { StepWhy, StepProblem, StepMConn } from './ContextVizSteps';
import { StepSwitch, StepReactor } from './ContextVizSteps2';

const R = [StepWhy, StepProblem, StepMConn, StepSwitch, StepReactor];

interface Props { onOpenCode?: (key: string) => void }

export default function ContextViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 125" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_KEYS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_KEYS[step]!)} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
