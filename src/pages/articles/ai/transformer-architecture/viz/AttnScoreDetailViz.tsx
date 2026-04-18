import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AttnScoreDetailVizData';
import AttnScoreDetailSteps from './AttnScoreDetailSteps';

export default function AttnScoreDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <AttnScoreDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
