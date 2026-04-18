import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AppsDetailVizData';
import { ApplicationCases, TransferStrategies } from './AppsDetailSteps';

export default function AppsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ApplicationCases />}
          {step === 1 && <TransferStrategies />}
        </svg>
      )}
    </StepViz>
  );
}
