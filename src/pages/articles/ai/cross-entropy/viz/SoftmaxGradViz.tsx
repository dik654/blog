import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SoftmaxGradVizData';
import {
  DerivationStep,
  IntuitionStep,
  ElementWiseStep,
  PyTorchStep,
  SigmoidBCEStep,
} from './SoftmaxGradSteps';

const STEP_COMPONENTS = [
  DerivationStep,
  IntuitionStep,
  ElementWiseStep,
  PyTorchStep,
  SigmoidBCEStep,
];

export default function SoftmaxGradViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const StepComponent = STEP_COMPONENTS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <StepComponent />
          </svg>
        );
      }}
    </StepViz>
  );
}
