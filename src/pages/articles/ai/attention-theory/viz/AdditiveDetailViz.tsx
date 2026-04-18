import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AdditiveDetailVizData';
import AdditiveDetailSteps from './AdditiveDetailSteps';

export default function AdditiveDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <AdditiveDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
