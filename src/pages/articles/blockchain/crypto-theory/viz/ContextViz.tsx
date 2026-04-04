import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhyCrypto, StepSymmetric, StepAsymmetric, StepApplications } from './ContextVizSteps';

const R = [StepWhyCrypto, StepSymmetric, StepAsymmetric, StepApplications];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
