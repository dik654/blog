import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import {
  OverviewStep0, OverviewStep1, OverviewStep2, OverviewStep3,
} from './OverviewSteps';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <OverviewStep0 />}
          {step === 1 && <OverviewStep1 />}
          {step === 2 && <OverviewStep2 />}
          {step === 3 && <OverviewStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
