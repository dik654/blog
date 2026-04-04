import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ProofDBVizData';
import { Step0, Step1 } from './ProofDBVizSteps';

const R = [Step0, Step1];

export default function ProofDBViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 230" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
