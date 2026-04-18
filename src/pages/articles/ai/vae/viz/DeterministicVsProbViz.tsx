import StepViz from '@/components/ui/step-viz';
import DeterministicVsProbSteps from './DeterministicVsProbSteps';
import { STEPS } from './DeterministicVsProbVizData';

export default function DeterministicVsProbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <DeterministicVsProbSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
