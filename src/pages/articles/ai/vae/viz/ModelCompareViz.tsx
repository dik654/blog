import StepViz from '@/components/ui/step-viz';
import ModelCompareSteps from './ModelCompareSteps';
import { STEPS } from './ModelCompareVizData';

export default function ModelCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModelCompareSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
