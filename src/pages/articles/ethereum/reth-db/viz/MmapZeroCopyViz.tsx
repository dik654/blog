import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MmapZeroCopyVizData';
import { Step0, Step1 } from './MmapZeroCopySteps';
import { Step2, Step3 } from './MmapZeroCopySteps2';

const R = [Step0, Step1, Step2, Step3];

export default function MmapZeroCopyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
