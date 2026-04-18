import StepViz from '@/components/ui/step-viz';
import ForwardReverseDetailSteps from './ForwardReverseDetailSteps';
import { STEPS } from './ForwardReverseDetailVizData';

export default function ForwardReverseDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ForwardReverseDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
