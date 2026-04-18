import StepViz from '@/components/ui/step-viz';
import { STEPS } from './GradientDetailVizData';
import { GradientNumerics, DepthDecay } from './GradientDetailSteps';

export default function GradientDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <GradientNumerics />}
          {step === 1 && <DepthDecay />}
        </svg>
      )}
    </StepViz>
  );
}
