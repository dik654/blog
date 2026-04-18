import StepViz from '@/components/ui/step-viz';
import GANTimelineSteps from './GANTimelineSteps';
import { STEPS } from './GANTimelineVizData';

export default function GANTimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <GANTimelineSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
