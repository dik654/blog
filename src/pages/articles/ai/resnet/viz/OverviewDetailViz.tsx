import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewDetailVizData';
import { DegradationProblem, DepthPerformance } from './OverviewDetailSteps';

export default function OverviewDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <DegradationProblem />}
          {step === 1 && <DepthPerformance />}
        </svg>
      )}
    </StepViz>
  );
}
