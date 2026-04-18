import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SelfAttnImplDetailVizData';
import SelfAttnImplDetailSteps from './SelfAttnImplDetailSteps';

export default function SelfAttnImplDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <SelfAttnImplDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
