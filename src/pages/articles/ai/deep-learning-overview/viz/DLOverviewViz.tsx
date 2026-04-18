import StepViz from '@/components/ui/step-viz';
import { STEPS } from './DLOverviewVizData';
import { ClassicMLStep, DeepLearningStep, DepthSeparationStep, ImageNetProgressStep } from './DLOverviewSteps';

export default function DLOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ClassicMLStep />}
          {step === 1 && <DeepLearningStep />}
          {step === 2 && <DepthSeparationStep />}
          {step === 3 && <ImageNetProgressStep />}
        </svg>
      )}
    </StepViz>
  );
}
