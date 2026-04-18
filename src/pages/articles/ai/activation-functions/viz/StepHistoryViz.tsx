import StepViz from '@/components/ui/step-viz';
import { STEPS } from './StepHistoryVizData';
import {
  McCullochPitts,
  XorLimit,
  PerceptronLearning,
  DeadGradient,
  FourSolutions,
} from './StepHistorySteps';

export default function StepHistoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <McCullochPitts />}
          {step === 1 && <XorLimit />}
          {step === 2 && <PerceptronLearning />}
          {step === 3 && <DeadGradient />}
          {step === 4 && <FourSolutions />}
        </svg>
      )}
    </StepViz>
  );
}
