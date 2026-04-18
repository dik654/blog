import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TripletVizData';
import { Step0, Step1, Step2, Step3 } from './TripletSteps';

const views = [Step0, Step1, Step2, Step3];

export default function TripletViz() {
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
