import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SkipDetailVizData';
import { SkipMath, BlockTypes } from './SkipDetailSteps';

export default function SkipDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <SkipMath />}
          {step === 1 && <BlockTypes />}
        </svg>
      )}
    </StepViz>
  );
}
