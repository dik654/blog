import StepViz from '@/components/ui/step-viz';
import { STEPS } from './RegTechVizData';
import {
  RegTechStep0, RegTechStep1, RegTechStep2,
  RegTechStep3, RegTechStep4,
} from './RegTechSteps';

export default function RegTechViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <RegTechStep0 />}
          {step === 1 && <RegTechStep1 />}
          {step === 2 && <RegTechStep2 />}
          {step === 3 && <RegTechStep3 />}
          {step === 4 && <RegTechStep4 />}
        </svg>
      )}
    </StepViz>
  );
}
