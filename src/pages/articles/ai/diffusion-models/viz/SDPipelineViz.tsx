import StepViz from '@/components/ui/step-viz';
import SDPipelineSteps from './SDPipelineSteps';
import { STEPS } from './SDPipelineVizData';

export default function SDPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <SDPipelineSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
