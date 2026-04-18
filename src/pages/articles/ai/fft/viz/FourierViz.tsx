import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FourierVizData';
import { SineSum, EulerFormula, ContinuousToDiscrete, SpectrumExample } from './FourierSteps';

export default function FourierViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SineSum />}
          {step === 1 && <EulerFormula />}
          {step === 2 && <ContinuousToDiscrete />}
          {step === 3 && <SpectrumExample />}
        </svg>
      )}
    </StepViz>
  );
}
