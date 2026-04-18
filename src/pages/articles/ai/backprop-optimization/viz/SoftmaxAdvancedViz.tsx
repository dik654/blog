import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SoftmaxAdvancedVizData';
import {
  SoftmaxAdvStep0, SoftmaxAdvStep1, SoftmaxAdvStep2,
  SoftmaxAdvStep3, SoftmaxAdvStep4,
} from './SoftmaxAdvancedSteps';

export default function SoftmaxAdvancedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <SoftmaxAdvStep0 />}
          {step === 1 && <SoftmaxAdvStep1 />}
          {step === 2 && <SoftmaxAdvStep2 />}
          {step === 3 && <SoftmaxAdvStep3 />}
          {step === 4 && <SoftmaxAdvStep4 />}
        </svg>
      )}
    </StepViz>
  );
}
