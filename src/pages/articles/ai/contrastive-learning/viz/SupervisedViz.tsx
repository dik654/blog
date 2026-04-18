import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SupervisedVizData';
import { Step0, Step1, Step2, Step3 } from './SupervisedSteps';

const views = [Step0, Step1, Step2, Step3];

export default function SupervisedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const View = views[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <View />
          </svg>
        );
      }}
    </StepViz>
  );
}
