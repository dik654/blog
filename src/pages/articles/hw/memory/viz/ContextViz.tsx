import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhy, StepDDR } from './ContextVizSteps';
import { StepECC, StepFilecoin } from './ContextVizSteps2';

const R = [StepWhy, StepDDR, StepECC, StepFilecoin];

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
