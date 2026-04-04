import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CoreTypesVizData';
import { Step0, Step1 } from './CoreTypesVizSteps';
import { Step2, Step3 } from './CoreTypesVizSteps2';

const R = [Step0, Step1, Step2, Step3];

export default function CoreTypesViz() {
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
