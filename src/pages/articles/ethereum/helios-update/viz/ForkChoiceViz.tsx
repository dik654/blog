import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ForkChoiceVizData';
import { Step0, Step1 } from './ForkChoiceVizSteps';

const R = [Step0, Step1];

export default function ForkChoiceViz() {
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
