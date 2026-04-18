import StepViz from '@/components/ui/step-viz';
import { STEPS } from './GradTrainVizData';
import { GradTrainStep0, GradTrainStep1, GradTrainStep2, GradTrainStep3 } from './GradTrainSteps';

export default function GradTrainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <GradTrainStep0 />}
          {step === 1 && <GradTrainStep1 />}
          {step === 2 && <GradTrainStep2 />}
          {step === 3 && <GradTrainStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
