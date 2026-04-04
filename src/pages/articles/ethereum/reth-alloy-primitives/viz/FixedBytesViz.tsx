import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './FixedBytesVizData';
import { Step0, Step1, Step2, Step3, Step4 } from './FixedBytesVizSteps';

const R = [Step0, Step1, Step2, Step3, Step4];

export default function FixedBytesViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 440 120" className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
