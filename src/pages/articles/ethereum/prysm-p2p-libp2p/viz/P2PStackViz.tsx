import StepViz from '@/components/ui/step-viz';
import { STEPS } from './P2PStackVizData';
import { Step0, Step1, Step2 } from './P2PStackSteps';
import { Step3, Step4, Step5 } from './P2PStackSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function P2PStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 110" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
