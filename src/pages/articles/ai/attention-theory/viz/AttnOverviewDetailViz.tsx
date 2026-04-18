import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AttnOverviewDetailVizData';
import AttnOverviewDetailSteps from './AttnOverviewDetailSteps';

export default function AttnOverviewDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <AttnOverviewDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
