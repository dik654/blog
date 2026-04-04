import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepL2Cost, StepCalldata, StepBlob } from './ContextVizSteps';
import { StepKzg, StepBlobGas } from './ContextVizSteps2';

const R = [StepL2Cost, StepCalldata, StepBlob, StepKzg, StepBlobGas];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
