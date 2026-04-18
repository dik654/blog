import StepViz from '@/components/ui/step-viz';
import { STEPS } from './PosEncDetailVizData';
import PosEncDetailSteps from './PosEncDetailSteps';

export default function PosEncDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <PosEncDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
