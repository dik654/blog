import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ChainRuleMathVizData';
import { ChainMathStep0, ChainMathStep1, ChainMathStep2, ChainMathStep3 } from './ChainRuleMathSteps';

export default function ChainRuleMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <ChainMathStep0 />}
          {step === 1 && <ChainMathStep1 />}
          {step === 2 && <ChainMathStep2 />}
          {step === 3 && <ChainMathStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
