import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SszInternalVizData';
import { Step0, Step1 } from './SszInternalVizSteps';
import { Step2, Step3 } from './SszInternalVizSteps2';

const R = [Step0, Step1, Step2, Step3];

export default function SszInternalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
