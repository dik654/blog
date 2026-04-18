import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CEDetailVizData';
import { CEMathMeaning, ClassificationCE, PyTorchImpl, BinaryCE, PerplexityStep } from './CEDetailSteps';

export default function CEDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <CEMathMeaning />}
          {step === 1 && <ClassificationCE />}
          {step === 2 && <PyTorchImpl />}
          {step === 3 && <BinaryCE />}
          {step === 4 && <PerplexityStep />}
        </svg>
      )}
    </StepViz>
  );
}
