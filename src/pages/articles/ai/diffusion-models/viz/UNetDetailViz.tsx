import StepViz from '@/components/ui/step-viz';
import UNetDetailSteps from './UNetDetailSteps';
import { STEPS } from './UNetDetailVizData';

export default function UNetDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <UNetDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
