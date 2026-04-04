import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ConstructionVizData';
import { StepSquaring, StepWesolowski, StepPietrzak } from './ConstructionVizSteps';

const R = [StepSquaring, StepWesolowski, StepPietrzak];

export default function ConstructionViz() {
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
