import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepRole, StepScale, StepMonolith } from './ContextVizSteps';
import { StepCrash, StepStageSplit, StepCheckpoint } from './ContextVizSteps2';

const R = [StepRole, StepScale, StepMonolith, StepCrash, StepStageSplit, StepCheckpoint];

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
