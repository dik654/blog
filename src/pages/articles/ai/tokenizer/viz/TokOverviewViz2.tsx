import StepViz from '@/components/ui/step-viz';
import { VOCAB_STEPS } from './TokOverviewVizData';
import { VocabStep0, VocabStep1, VocabStep2 } from './TokOverviewSteps';

export function VocabDetailViz() {
  return (
    <StepViz steps={VOCAB_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <VocabStep0 />}
          {step === 1 && <VocabStep1 />}
          {step === 2 && <VocabStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
