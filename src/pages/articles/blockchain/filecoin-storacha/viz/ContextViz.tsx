import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepTransition, StepNodes } from './ContextVizSteps';
import { StepUCAN, StepForge } from './ContextVizSteps2';

const R = [StepTransition, StepNodes, StepUCAN, StepForge];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 105" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
