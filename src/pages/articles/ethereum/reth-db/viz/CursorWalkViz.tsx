import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CursorWalkVizData';
import { Step0, Step1 } from './CursorWalkSteps';
import { Step2 } from './CursorWalkSteps2';
import { Step3 } from './CursorWalkSteps3';

const R = [Step0, Step1, Step2, Step3];

export default function CursorWalkViz() {
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
