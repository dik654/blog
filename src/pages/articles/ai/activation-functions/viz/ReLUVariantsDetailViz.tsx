import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ReLUVariantsDetailVizData';
import {
  LeakyPreluCompare,
  EluSeluCurves,
  GeluDiagram,
  SwishDiagram,
  GluSwigluFlow,
} from './ReLUVariantsDetailSteps';

export default function ReLUVariantsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <LeakyPreluCompare />}
          {step === 1 && <EluSeluCurves />}
          {step === 2 && <GeluDiagram />}
          {step === 3 && <SwishDiagram />}
          {step === 4 && <GluSwigluFlow />}
        </svg>
      )}
    </StepViz>
  );
}
