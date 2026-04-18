import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TanhDetailVizData';
import { FormulaAndValues, ThreeAdvantages, LimitAndLSTM } from './TanhDetailSteps';

export default function TanhDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <FormulaAndValues />}
          {step === 1 && <ThreeAdvantages />}
          {step === 2 && <LimitAndLSTM />}
        </svg>
      )}
    </StepViz>
  );
}
