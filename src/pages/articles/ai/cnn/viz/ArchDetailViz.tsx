import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ArchDetailVizData';
import { ArchComparison } from './ArchDetailSteps';

export default function ArchDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ArchComparison />}
        </svg>
      )}
    </StepViz>
  );
}
