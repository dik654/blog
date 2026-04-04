import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepTZ, StepProblem, StepCCA } from './ContextVizSteps';
import { StepRME, StepAttest } from './ContextVizSteps2';

const R = [StepTZ, StepProblem, StepCCA, StepRME, StepAttest];

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
