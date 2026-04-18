import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MultiplicativeDetailVizData';
import MultiplicativeDetailSteps from './MultiplicativeDetailSteps';

export default function MultiplicativeDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <MultiplicativeDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
