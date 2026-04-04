import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ProofTraceVizData';
import { Step0, Step1, Step2 } from './ProofTraceVizSteps';
import { Step3, Step4 } from './ProofTraceVizSteps2';

export default function ProofTraceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
