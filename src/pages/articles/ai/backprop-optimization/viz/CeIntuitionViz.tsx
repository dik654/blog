import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CeIntuitionVizData';
import {
  CeIntuitionStep0, CeIntuitionStep1, CeIntuitionStep2,
} from './CeIntuitionSteps';

export default function CeIntuitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 168" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <CeIntuitionStep0 />}
          {step === 1 && <CeIntuitionStep1 />}
          {step === 2 && <CeIntuitionStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
