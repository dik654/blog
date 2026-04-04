import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SlotProcessingVizData';
import { Step0, Step1, Step2, Step3 } from './SlotProcessingSteps';
import { Step4, Step5 } from './SlotProcessingSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function SlotProcessingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 115" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
