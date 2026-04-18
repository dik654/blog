import StepViz from '@/components/ui/step-viz';
import { STEPS } from './RNNArchDetailVizData';
import { Step0, Step1, Step2, Step3 } from './RNNArchDetailSteps';

export default function RNNArchDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
