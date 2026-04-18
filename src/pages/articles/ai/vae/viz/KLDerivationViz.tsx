import StepViz from '@/components/ui/step-viz';
import KLDerivationSteps from './KLDerivationSteps';
import { STEPS } from './KLDerivationVizData';

export default function KLDerivationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <KLDerivationSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
