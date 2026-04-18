import StepViz from '@/components/ui/step-viz';
import GANMathSteps from './GANMathSteps';
import { STEPS } from './GANMathVizData';

export default function GANMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <GANMathSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
