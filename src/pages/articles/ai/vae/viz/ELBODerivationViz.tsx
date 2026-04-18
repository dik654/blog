import StepViz from '@/components/ui/step-viz';
import ELBODerivationSteps from './ELBODerivationSteps';
import { STEPS } from './ELBODerivationVizData';

export default function ELBODerivationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ELBODerivationSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
