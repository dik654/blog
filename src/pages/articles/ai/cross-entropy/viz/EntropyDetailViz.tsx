import StepViz from '@/components/ui/step-viz';
import { STEPS } from './EntropyDetailVizData';
import {
  InformationContentStep,
  ShannonEntropyStep,
  MLUsageStep,
  ConditionalMIStep,
} from './EntropyDetailSteps';

const RENDERERS = [InformationContentStep, ShannonEntropyStep, MLUsageStep, ConditionalMIStep];

export default function EntropyDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Renderer />
          </svg>
        );
      }}
    </StepViz>
  );
}
