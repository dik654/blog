import StepViz from '@/components/ui/step-viz';
import { STEPS } from './NeuralDeepVizData';
import { Step0, Step1, Step2, Step3 } from './NeuralDeepSteps';

const COMPONENTS = [Step0, Step1, Step2, Step3];

export default function NeuralDeepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {Comp ? <Comp /> : null}
          </svg>
        );
      }}
    </StepViz>
  );
}
