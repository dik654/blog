import StepViz from '@/components/ui/step-viz';
import LatentWalkSteps from './LatentWalkSteps';
import { STEPS } from './LatentWalkVizData';

export default function LatentWalkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <LatentWalkSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
