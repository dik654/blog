import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SyncModesVizData';
import { Step0, Step1, Step2 } from './SyncModesSteps';
import { Step3, Step4, Step5 } from './SyncModesSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function SyncModesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 115" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
