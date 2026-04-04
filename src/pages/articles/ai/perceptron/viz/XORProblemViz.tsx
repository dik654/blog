import StepViz from '@/components/ui/step-viz';
import { STEPS } from '../XORVizData';
import { Step0, Step1, Step2 } from './XORVizParts';

export default function XORProblemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 310" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
        </svg>
      )}
    </StepViz>
  );
}
