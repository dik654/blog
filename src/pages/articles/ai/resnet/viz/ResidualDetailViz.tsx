import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ResidualDetailVizData';
import { TwoPathGradient, StabilityCompare } from './ResidualDetailSteps';

export default function ResidualDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <TwoPathGradient />}
          {step === 1 && <StabilityCompare />}
        </svg>
      )}
    </StepViz>
  );
}
