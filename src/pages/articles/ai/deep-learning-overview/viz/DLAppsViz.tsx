import StepViz from '@/components/ui/step-viz';
import { STEPS } from './DLAppsVizData';
import { IndustryAppsStep, ClosedSourceStep, OpenSourceStep, BenchmarkStep } from './DLAppsSteps';

export default function DLAppsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <IndustryAppsStep />}
          {step === 1 && <ClosedSourceStep />}
          {step === 2 && <OpenSourceStep />}
          {step === 3 && <BenchmarkStep />}
        </svg>
      )}
    </StepViz>
  );
}
