import StepViz from '@/components/ui/step-viz';
import { STEPS } from './DLAccelVizData';
import { CpuVsGpuStep, MixedPrecisionStep, DistributedStep, FlashAttentionStep, OptimizationsStep } from './DLAccelSteps';

export default function DLAccelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CpuVsGpuStep />}
          {step === 1 && <MixedPrecisionStep />}
          {step === 2 && <DistributedStep />}
          {step === 3 && <FlashAttentionStep />}
          {step === 4 && <OptimizationsStep />}
        </svg>
      )}
    </StepViz>
  );
}
