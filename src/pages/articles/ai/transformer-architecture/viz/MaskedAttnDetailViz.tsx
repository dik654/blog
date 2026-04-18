import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MaskedAttnDetailVizData';
import MaskedAttnDetailSteps from './MaskedAttnDetailSteps';

export default function MaskedAttnDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <MaskedAttnDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
