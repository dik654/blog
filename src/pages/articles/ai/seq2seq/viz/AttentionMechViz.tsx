import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AttentionMechVizData';
import { HBoxes, BottleneckStep, ScoreStep } from './AttentionMechParts';
import ContextStep from './AttentionMechContextStep';

export default function AttentionMechViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <HBoxes />
          {step === 0 && <BottleneckStep />}
          {step >= 1 && step < 2 && <ScoreStep />}
          {step >= 2 && <ContextStep />}
        </svg>
      )}
    </StepViz>
  );
}
