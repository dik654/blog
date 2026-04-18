import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FFTAIVizData';
import { Spectrogram, ConvTheorem, FNetAttention, NoiseRemoval, DiffusionFreq } from './FFTAISteps';

export default function FFTAIViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Spectrogram />}
          {step === 1 && <ConvTheorem />}
          {step === 2 && <FNetAttention />}
          {step === 3 && <NoiseRemoval />}
          {step === 4 && <DiffusionFreq />}
        </svg>
      )}
    </StepViz>
  );
}
