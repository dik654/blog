import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepPartialSync, StepAsyncNeed, StepRandomCoin, StepTusk } from './ContextVizSteps';

const R = [StepPartialSync, StepAsyncNeed, StepRandomCoin, StepTusk];

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
