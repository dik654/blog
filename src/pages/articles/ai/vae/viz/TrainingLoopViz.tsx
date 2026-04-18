import StepViz from '@/components/ui/step-viz';
import TrainingLoopSteps from './TrainingLoopSteps';
import { STEPS } from './TrainingLoopVizData';

export default function TrainingLoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <TrainingLoopSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
