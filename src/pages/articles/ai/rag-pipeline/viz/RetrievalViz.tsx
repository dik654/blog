import StepViz from '@/components/ui/step-viz';
import { STEPS } from './RetrievalVizData';
import RetrievalVizSteps from './RetrievalVizSteps';

export default function RetrievalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <RetrievalVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
