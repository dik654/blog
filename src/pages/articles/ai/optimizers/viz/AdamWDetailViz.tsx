import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AdamWDetailVizData';
import { AdamL2Problem, AdamWFix, LLMTraining, Alternatives } from './AdamWDetailSteps';

export default function AdamWDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 175" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <AdamL2Problem />}
          {step === 1 && <AdamWFix />}
          {step === 2 && <LLMTraining />}
          {step === 3 && <Alternatives />}
        </svg>
      )}
    </StepViz>
  );
}
