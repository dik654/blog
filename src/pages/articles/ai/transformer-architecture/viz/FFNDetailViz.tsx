import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FFNDetailVizData';
import { Step0, Step1, Step2 } from './FFNDetailSteps';

export default function FFNDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
        </svg>
      )}
    </StepViz>
  );
}
