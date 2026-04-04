import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepNetworks, StepThreeConditions, StepGethNil } from './ContextVizSteps';
import { StepForkCondition, StepChainSpec } from './ContextVizSteps2';

const R = [StepNetworks, StepThreeConditions, StepGethNil, StepForkCondition, StepChainSpec];

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
