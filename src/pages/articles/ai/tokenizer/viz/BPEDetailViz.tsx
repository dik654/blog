import StepViz from '@/components/ui/step-viz';
import { TRAIN_STEPS, BYTE_STEPS } from './BPEDetailVizData';
import { TrainStep0, TrainStep1, TrainStep2, TrainStep3 } from './BPEDetailSteps';
import { ByteStep0, ByteStep1, ByteStep2 } from './BPEDetailSteps';

export function BPETrainViz() {
  return (
    <StepViz steps={TRAIN_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <TrainStep0 />}
          {step === 1 && <TrainStep1 />}
          {step === 2 && <TrainStep2 />}
          {step === 3 && <TrainStep3 />}
        </svg>
      )}
    </StepViz>
  );
}

export function ByteLevelBPEViz() {
  return (
    <StepViz steps={BYTE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ByteStep0 />}
          {step === 1 && <ByteStep1 />}
          {step === 2 && <ByteStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
