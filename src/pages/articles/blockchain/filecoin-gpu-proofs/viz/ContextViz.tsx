import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepProofs, StepBottleneck } from './ContextVizSteps';
import { StepLibs, StepGPU } from './ContextVizSteps2';

const R = [StepProofs, StepBottleneck, StepLibs, StepGPU];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
