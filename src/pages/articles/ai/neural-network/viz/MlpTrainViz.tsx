import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MlpTrainVizData';
import { MlpTrainStep0, MlpTrainStep1, MlpTrainStep2, MlpTrainStep3 } from './MlpTrainSteps';

export default function MlpTrainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 430 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <MlpTrainStep0 />}
          {step === 1 && <MlpTrainStep1 />}
          {step === 2 && <MlpTrainStep2 />}
          {step === 3 && <MlpTrainStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
