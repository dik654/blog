import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CooleyTukeyVizData';
import {
  CooleyTukeyStep0,
  CooleyTukeyStep1,
  CooleyTukeyStep2,
  CooleyTukeyStep3,
  CooleyTukeyStep4,
} from './CooleyTukeySteps';

export default function CooleyTukeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <CooleyTukeyStep0 />}
          {step === 1 && <CooleyTukeyStep1 />}
          {step === 2 && <CooleyTukeyStep2 />}
          {step === 3 && <CooleyTukeyStep3 />}
          {step === 4 && <CooleyTukeyStep4 />}
        </svg>
      )}
    </StepViz>
  );
}
