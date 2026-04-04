import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MVCCSnapshotVizData';
import { Step0, Step1 } from './MVCCSnapshotSteps';
import { Step2, Step3 } from './MVCCSnapshotSteps2';

const R = [Step0, Step1, Step2, Step3];

export default function MVCCSnapshotViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
