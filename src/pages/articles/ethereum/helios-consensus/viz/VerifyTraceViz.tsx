import StepViz from '@/components/ui/step-viz';
import { STEPS } from './VerifyTraceVizData';
import { Step0, Step1, Step2 } from './VerifyTraceVizSteps';
import { Step3, Step4, Step5 } from './VerifyTraceVizSteps2';

export default function VerifyTraceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}
        </svg>
      )}
    </StepViz>
  );
}
