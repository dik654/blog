import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ImpactDetailVizData';
import { AcademicImpact, LossLandscape } from './ImpactDetailSteps';

export default function ImpactDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <AcademicImpact />}
          {step === 1 && <LossLandscape />}
        </svg>
      )}
    </StepViz>
  );
}
