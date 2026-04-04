import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_KEYS, STEP_LABELS } from './SwitchVizData';
import { SwitchStep0, SwitchStep1, SwitchStep2 } from './SwitchSteps';

const R = [SwitchStep0, SwitchStep1, SwitchStep2];

interface Props { onOpenCode?: (key: string) => void }

export default function SwitchViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 105" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
