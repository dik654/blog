import StepViz from '@/components/ui/step-viz';
import { PIPELINE_STEPS } from './TokOverviewVizData';
import { PipeStep0, PipeStep1, PipeStep2, PipeStep3 } from './TokOverviewSteps';

export function PipelineDetailViz() {
  return (
    <StepViz steps={PIPELINE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <PipeStep0 />}
          {step === 1 && <PipeStep1 />}
          {step === 2 && <PipeStep2 />}
          {step === 3 && <PipeStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
