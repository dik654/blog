import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ApplicationsVizData';
import { StepDrand, StepIrys, StepEthereum } from './ApplicationsVizSteps';

const R = [StepDrand, StepIrys, StepEthereum];

export default function ApplicationsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
