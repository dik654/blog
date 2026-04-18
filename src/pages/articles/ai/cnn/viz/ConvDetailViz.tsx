import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ConvDetailVizData';
import { ConvFormula, KernelAndPooling } from './ConvDetailSteps';

export default function ConvDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ConvFormula />}
          {step === 1 && <KernelAndPooling />}
        </svg>
      )}
    </StepViz>
  );
}
