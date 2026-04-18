import StepViz from '@/components/ui/step-viz';
import { STEPS } from './EmbeddingVizData';
import EmbeddingVizSteps from './EmbeddingVizSteps';

export default function EmbeddingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <EmbeddingVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
