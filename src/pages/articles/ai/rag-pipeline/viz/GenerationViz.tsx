import StepViz from '@/components/ui/step-viz';
import { STEPS } from './GenerationVizData';
import GenerationVizSteps from './GenerationVizSteps';

export default function GenerationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <GenerationVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
