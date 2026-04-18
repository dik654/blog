import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BackpropMathVizData';
import { BackpropMathStep0, BackpropMathStep1, BackpropMathStep2, BackpropMathStep3 } from './BackpropMathSteps';

export default function BackpropMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <BackpropMathStep0 />}
          {step === 1 && <BackpropMathStep1 />}
          {step === 2 && <BackpropMathStep2 />}
          {step === 3 && <BackpropMathStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
