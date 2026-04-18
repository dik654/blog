import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ReLUDetailVizData';
import { ReLUDefinition, ReLUAdvantages, DyingReLUBrief, PyTorchCode } from './ReLUDetailSteps';

export default function ReLUDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ReLUDefinition />}
          {step === 1 && <ReLUAdvantages />}
          {step === 2 && <DyingReLUBrief />}
          {step === 3 && <PyTorchCode />}
        </svg>
      )}
    </StepViz>
  );
}
