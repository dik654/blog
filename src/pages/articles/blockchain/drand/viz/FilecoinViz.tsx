import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FilecoinVizData';
import { StepWinningPoSt, StepElection, StepTipset } from './FilecoinVizSteps';

const R = [StepWinningPoSt, StepElection, StepTipset];

export default function FilecoinViz() {
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
