import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MeasuredBootVizData';
import { BootChainStep } from './MeasuredBootVizParts';
import { PcrExtendStep, AttestationStep } from './MeasuredBootVizSteps2';

export default function MeasuredBootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BootChainStep />}
          {step === 1 && <PcrExtendStep />}
          {step === 2 && <AttestationStep />}
        </svg>
      )}
    </StepViz>
  );
}
