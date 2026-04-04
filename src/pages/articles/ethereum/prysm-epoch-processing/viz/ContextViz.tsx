import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepEpochNeed, StepCompute, StepOrder, StepPrecompute, StepPipeline } from './ContextVizSteps';

const R = [StepEpochNeed, StepCompute, StepOrder, StepPrecompute, StepPipeline];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
