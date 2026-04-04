import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BlockProcessingVizData';
import { Step0, Step1, Step2 } from './BlockProcessingSteps';
import { Step3, Step4, Step5 } from './BlockProcessingSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function BlockProcessingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
