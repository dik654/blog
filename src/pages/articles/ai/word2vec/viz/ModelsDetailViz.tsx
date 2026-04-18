import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ModelsDetailVizData';
import { CBOWFlow, SkipgramFlow, ModelComparison, EmbeddingExtraction } from './ModelsDetailSteps';

export default function ModelsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <CBOWFlow />}
          {step === 1 && <SkipgramFlow />}
          {step === 2 && <ModelComparison />}
          {step === 3 && <EmbeddingExtraction />}
        </svg>
      )}
    </StepViz>
  );
}
