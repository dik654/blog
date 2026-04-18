import StepViz from '@/components/ui/step-viz';
import ReparamDetailSteps from './ReparamDetailSteps';
import { STEPS } from './ReparamDetailVizData';

export default function ReparamDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ReparamDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
