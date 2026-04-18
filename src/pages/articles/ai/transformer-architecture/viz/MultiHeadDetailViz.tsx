import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MultiHeadDetailVizData';
import MultiHeadDetailSteps from './MultiHeadDetailSteps';

export default function MultiHeadDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <MultiHeadDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
