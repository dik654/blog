import StepViz from '@/components/ui/step-viz';
import { STEPS } from './WarmupVizData';
import {
  WarmupStep0, WarmupStep1, WarmupStep2, WarmupStep3,
} from './WarmupSteps';

export default function WarmupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <WarmupStep0 />}
          {step === 1 && <WarmupStep1 />}
          {step === 2 && <WarmupStep2 />}
          {step === 3 && <WarmupStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
