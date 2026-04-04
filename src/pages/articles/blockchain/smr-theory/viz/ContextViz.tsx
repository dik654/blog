import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepSingleFailure, StepDeterministic, StepOrderConflict, StepSolution } from './ContextVizSteps';

const R = [StepSingleFailure, StepDeterministic, StepOrderConflict, StepSolution];

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
