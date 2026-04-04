import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepReceive, StepOps, StepELDelegation, StepPipeline, StepBatchBLS } from './ContextVizSteps';

const R = [StepReceive, StepOps, StepELDelegation, StepPipeline, StepBatchBLS];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
