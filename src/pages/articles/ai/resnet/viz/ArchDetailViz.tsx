import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ArchDetailVizData';
import { ResNet50Structure, BatchNormRole } from './ArchDetailSteps';

export default function ArchDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 176" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ResNet50Structure />}
          {step === 1 && <BatchNormRole />}
        </svg>
      )}
    </StepViz>
  );
}
