import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepRole, StepDbPerTx, StepRevert } from './ContextVizSteps';
import { StepBundle, StepTrait } from './ContextVizSteps2';

const R = [StepRole, StepDbPerTx, StepRevert, StepBundle, StepTrait];

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
