import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepData, StepLSM, StepMixed } from './ContextVizSteps';
import { StepMDBX, StepStaticFiles } from './ContextVizSteps2';

const R = [StepData, StepLSM, StepMixed, StepMDBX, StepStaticFiles];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 440 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
