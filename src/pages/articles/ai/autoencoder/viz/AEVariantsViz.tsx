import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AEVariantsVizData';
import { Step0, Step1, Step2, Step3 } from './AEVariantsSteps';

const views = [Step0, Step1, Step2, Step3];

export default function AEVariantsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const View = views[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <View />
          </svg>
        );
      }}
    </StepViz>
  );
}
