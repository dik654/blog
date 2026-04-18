import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CEvsMSEDetailVizData';
import {
  GradientFormulas,
  NumericComparison,
  GradientRatioChart,
  SigmoidSaturation,
  SaturationComparison,
} from './CEvsMSEDetailSteps';

export default function CEvsMSEDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <GradientFormulas />}
          {step === 1 && <NumericComparison />}
          {step === 2 && <GradientRatioChart />}
          {step === 3 && <SigmoidSaturation />}
          {step === 4 && <SaturationComparison />}
        </svg>
      )}
    </StepViz>
  );
}
