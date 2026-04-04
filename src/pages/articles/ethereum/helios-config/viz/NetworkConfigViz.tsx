import StepViz from '@/components/ui/step-viz';
import { STEPS } from './NetworkConfigVizData';
import { Step0, Step1, Step2 } from './NetworkConfigVizSteps';

const R = [Step0, Step1, Step2];

export default function NetworkConfigViz() {
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
