import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import { Step0, Step1 } from './OverviewVizSteps';

const R = [Step0, Step1];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
