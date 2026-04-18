import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OneCycleVizData';
import {
  OneCycleStep0, OneCycleStep1, OneCycleStep2, OneCycleStep3,
} from './OneCycleSteps';

export default function OneCycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <OneCycleStep0 />}
          {step === 1 && <OneCycleStep1 />}
          {step === 2 && <OneCycleStep2 />}
          {step === 3 && <OneCycleStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
