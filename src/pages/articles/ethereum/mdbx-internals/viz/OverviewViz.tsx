import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import { Step0, Step1 } from './OverviewSteps';
import { Step2 } from './OverviewSteps2';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 220" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
        </svg>
      )}
    </StepViz>
  );
}
