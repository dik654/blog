import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ChunkingVizData';
import ChunkingVizSteps from './ChunkingVizSteps';

export default function ChunkingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ChunkingVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
