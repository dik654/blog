import StepViz from '@/components/ui/step-viz';
import DDPMMathSteps from './DDPMMathSteps';
import { STEPS } from './DDPMMathVizData';

export default function DDPMMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <DDPMMathSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
