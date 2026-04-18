import StepViz from '@/components/ui/step-viz';
import { STEPS } from './StepExpVizData';
import {
  StepExpStep0, StepExpStep1, StepExpStep2, StepExpStep3,
} from './StepExpSteps';

export default function StepExpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <StepExpStep0 />}
          {step === 1 && <StepExpStep1 />}
          {step === 2 && <StepExpStep2 />}
          {step === 3 && <StepExpStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
