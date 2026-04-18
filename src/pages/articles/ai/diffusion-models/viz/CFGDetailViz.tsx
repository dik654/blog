import StepViz from '@/components/ui/step-viz';
import CFGDetailSteps from './CFGDetailSteps';
import { STEPS } from './CFGDetailVizData';

export default function CFGDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <CFGDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
