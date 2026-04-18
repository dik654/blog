import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SGDDetailVizData';
import { StepUpdateRule, StepFourProblems, StepLRSchedules, StepProsConsUsage } from './SGDDetailSteps';

const RENDERERS = [StepUpdateRule, StepFourProblems, StepLRSchedules, StepProsConsUsage];

export default function SGDDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = RENDERERS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Comp />
          </svg>
        );
      }}
    </StepViz>
  );
}
