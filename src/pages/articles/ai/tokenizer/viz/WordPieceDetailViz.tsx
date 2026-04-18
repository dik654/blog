import StepViz from '@/components/ui/step-viz';
import { SCORE_STEPS, HASH_STEPS } from './WordPieceDetailVizData';
import { ScoreStep0, ScoreStep1, ScoreStep2 } from './WordPieceDetailSteps';
import { HashStep0, HashStep1, HashStep2 } from './WordPieceDetailSteps';

export function WordPieceScoreViz() {
  return (
    <StepViz steps={SCORE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ScoreStep0 />}
          {step === 1 && <ScoreStep1 />}
          {step === 2 && <ScoreStep2 />}
        </svg>
      )}
    </StepViz>
  );
}

export function WordPieceHashViz() {
  return (
    <StepViz steps={HASH_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <HashStep0 />}
          {step === 1 && <HashStep1 />}
          {step === 2 && <HashStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
