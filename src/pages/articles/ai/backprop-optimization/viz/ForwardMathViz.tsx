import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ForwardMathVizData';
import { ForwardMathStep0, ForwardMathStep1, ForwardMathStep2, ForwardMathStep3, ForwardMathStep4 } from './ForwardMathSteps';

export default function ForwardMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <ForwardMathStep0 />}
          {step === 1 && <ForwardMathStep1 />}
          {step === 2 && <ForwardMathStep2 />}
          {step === 3 && <ForwardMathStep3 />}
          {step === 4 && <ForwardMathStep4 />}
        </svg>
      )}
    </StepViz>
  );
}
