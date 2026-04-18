import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FFTOverviewVizData';
import { TimeDomain, DFTFormula, ComplexityCompare, AIUseCases } from './FFTOverviewSteps';

export default function FFTOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <TimeDomain />}
          {step === 1 && <DFTFormula />}
          {step === 2 && <ComplexityCompare />}
          {step === 3 && <AIUseCases />}
        </svg>
      )}
    </StepViz>
  );
}
