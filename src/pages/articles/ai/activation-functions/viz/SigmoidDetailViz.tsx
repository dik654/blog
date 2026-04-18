import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SigmoidDetailVizData';
import { FormulaAndCurve, ZigzagProblem, ModernUsages, PyTorchPattern } from './SigmoidDetailSteps';

export default function SigmoidDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <FormulaAndCurve />}
          {step === 1 && <ZigzagProblem />}
          {step === 2 && <ModernUsages />}
          {step === 3 && <PyTorchPattern />}
        </svg>
      )}
    </StepViz>
  );
}
