import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BTreeVizData';
import { Step0, Step1 } from './BTreeSteps';
import { Step2 } from './BTreeSteps1b';
import { Step3, Step4 } from './BTreeSteps2';

export default function BTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 200" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </svg>
      )}
    </StepViz>
  );
}
