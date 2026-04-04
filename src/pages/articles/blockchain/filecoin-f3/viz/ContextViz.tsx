import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepProblem, StepWhy } from './ContextVizSteps';
import { StepSolution, StepVoting, StepCert } from './ContextVizSteps2';

const R = [StepProblem, StepWhy, StepSolution, StepVoting, StepCert];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
