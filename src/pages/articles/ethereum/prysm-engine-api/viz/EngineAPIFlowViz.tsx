import StepViz from '@/components/ui/step-viz';
import { STEPS } from './EngineAPIFlowVizData';
import { Step0, Step1, Step2 } from './EngineAPIFlowSteps';
import { Step3, Step4, Step5 } from './EngineAPIFlowSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function EngineAPIFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
