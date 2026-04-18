import StepViz from '@/components/ui/step-viz';
import { STEPS } from './EvalVizData';
import EvalVizSteps from './EvalVizSteps';

export default function EvalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <EvalVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
