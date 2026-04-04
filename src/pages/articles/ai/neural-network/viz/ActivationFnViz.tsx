import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ActivationFnVizData';
import { SigmoidStep, ReLUStep, TanhStep } from './ActivationFnSteps';

export default function ActivationFnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SigmoidStep />}
          {step === 1 && <ReLUStep />}
          {step === 2 && <TanhStep />}
        </svg>
      )}
    </StepViz>
  );
}
