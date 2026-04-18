import StepViz from '@/components/ui/step-viz';
import { UNIGRAM_STEPS, SP_STEPS } from './SentencePieceDetailVizData';
import { UnigramStep0, UnigramStep1, UnigramStep2, UnigramStep3 } from './SentencePieceDetailSteps';
import { SPStep0, SPStep1, SPStep2 } from './SentencePieceDetailSteps';

export function UnigramTrainViz() {
  return (
    <StepViz steps={UNIGRAM_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <UnigramStep0 />}
          {step === 1 && <UnigramStep1 />}
          {step === 2 && <UnigramStep2 />}
          {step === 3 && <UnigramStep3 />}
        </svg>
      )}
    </StepViz>
  );
}

export function SPFeatureViz() {
  return (
    <StepViz steps={SP_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SPStep0 />}
          {step === 1 && <SPStep1 />}
          {step === 2 && <SPStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
