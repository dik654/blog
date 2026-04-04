import StepViz from '@/components/ui/step-viz';
import { STEPS } from './EpochPipelineVizData';
import { Step0, Step1, Step2 } from './EpochPipelineSteps';
import { Step3, Step4, Step5 } from './EpochPipelineSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function EpochPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 470 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
