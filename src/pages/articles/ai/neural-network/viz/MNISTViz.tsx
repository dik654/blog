import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MNISTVizData';
import { MNISTStep0, MNISTStep1, MNISTStep2 } from './MNISTSteps';

export default function MNISTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 280 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <MNISTStep0 />}
          {step === 1 && <MNISTStep1 />}
          {step === 2 && <MNISTStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
