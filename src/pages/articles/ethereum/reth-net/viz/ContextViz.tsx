import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepP2P, StepManyPeers, StepGoroutine } from './ContextVizSteps';
import { StepTokio, StepLayers } from './ContextVizSteps2';

const R = [StepP2P, StepManyPeers, StepGoroutine, StepTokio, StepLayers];

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
