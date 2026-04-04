import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepCpuGpu, StepBlockchain } from './ContextVizSteps';
import { StepMemory, StepWarp } from './ContextVizSteps2';

const R = [StepCpuGpu, StepBlockchain, StepMemory, StepWarp];

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
