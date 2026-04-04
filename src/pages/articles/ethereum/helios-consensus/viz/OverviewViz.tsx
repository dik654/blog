import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import { Step0, Step1, Step2 } from './OverviewVizSteps';

const RENDERERS = [Step0, Step1, Step2];
const VIEW_HEIGHTS = [170, 130, 195];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = RENDERERS[step];
        const h = VIEW_HEIGHTS[step];
        return (
          <svg viewBox={`0 0 480 ${h}`} className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
