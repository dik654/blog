import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import OverviewVizSteps from './OverviewVizSteps';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <OverviewVizSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
