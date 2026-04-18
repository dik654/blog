import StepViz from '@/components/ui/step-viz';
import VQVAESteps from './VQVAESteps';
import { STEPS } from './VQVAEVizData';

export default function VQVAEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <VQVAESteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
