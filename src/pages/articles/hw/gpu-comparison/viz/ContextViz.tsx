import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepNeed, StepProblem } from './ContextVizSteps';
import { StepMetrics, StepTrap } from './ContextVizSteps2';

const R = [StepNeed, StepProblem, StepMetrics, StepTrap];

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
