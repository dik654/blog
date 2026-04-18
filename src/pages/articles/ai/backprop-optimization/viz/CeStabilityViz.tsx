import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CeStabilityVizData';
import {
  CeStabStep0, CeStabStep1, CeStabStep2,
  CeStabStep3, CeStabStep4,
} from './CeStabilitySteps';

export default function CeStabilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <CeStabStep0 />}
          {step === 1 && <CeStabStep1 />}
          {step === 2 && <CeStabStep2 />}
          {step === 3 && <CeStabStep3 />}
          {step === 4 && <CeStabStep4 />}
        </svg>
      )}
    </StepViz>
  );
}
