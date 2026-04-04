import StepViz from '@/components/ui/step-viz';
import { STEPS } from './PipelineVizData';
import { StepLoop, StepHeaders, StepBodies } from './PipelineVizSteps';
import { StepSenders, StepExecution, StepMerkle } from './PipelineVizSteps2';

const R = [StepLoop, StepHeaders, StepBodies, StepSenders, StepExecution, StepMerkle];

export default function PipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 430 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
