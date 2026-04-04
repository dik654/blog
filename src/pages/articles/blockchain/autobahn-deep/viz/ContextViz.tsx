import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepHotStuffDelay, StepPBFTBroadcast, StepHybrid, StepPipeline } from './ContextVizSteps';

const R = [StepHotStuffDelay, StepPBFTBroadcast, StepHybrid, StepPipeline];

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
