import StepViz from '@/components/ui/step-viz';
import { STEPS } from '../PerceptronVizData';
import { Step0, Step1, Step2Calc, Step3Calc } from './PerceptronVizParts';

export default function PerceptronViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && (
            <svg viewBox="0 0 400 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <Step2Calc />
            </svg>
          )}
          {step === 3 && (
            <svg viewBox="0 0 400 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <Step3Calc />
            </svg>
          )}
        </>
      )}
    </StepViz>
  );
}
