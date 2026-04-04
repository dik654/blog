import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BlockProposalFlowVizData';
import { Step0, Step1, Step2 } from './BlockProposalFlowSteps';
import { Step3, Step4, Step5 } from './BlockProposalFlowSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function BlockProposalFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
