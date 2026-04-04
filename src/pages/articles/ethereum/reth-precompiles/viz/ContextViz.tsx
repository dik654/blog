import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepEvmLimit, StepGasExplosion, StepForkAdd } from './ContextVizSteps';
import { StepAddrMap, StepPureRust } from './ContextVizSteps2';

const R = [StepEvmLimit, StepGasExplosion, StepForkAdd, StepAddrMap, StepPureRust];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
