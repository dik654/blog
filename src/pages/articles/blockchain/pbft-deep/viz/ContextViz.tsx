import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhy, StepPrePrepare } from './ContextVizStepA';
import { StepPrepare, StepCommit } from './ContextVizStepB';

const R = [StepWhy, StepPrePrepare, StepPrepare, StepCommit];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
