import StepViz from '@/components/ui/step-viz';
import GANFailureSteps from './GANFailureSteps';
import { STEPS } from './GANFailureVizData';

export default function GANFailureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <GANFailureSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
