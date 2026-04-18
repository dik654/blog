import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SelfAttnDetailVizData';
import SelfAttnDetailSteps from './SelfAttnDetailSteps';

export default function SelfAttnDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <SelfAttnDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
