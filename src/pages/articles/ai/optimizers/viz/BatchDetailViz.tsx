import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BatchDetailVizData';
import {
  VariantsCompare,
  BatchSizeSpectrum,
  GradAccumulation,
  Recommendations,
} from './BatchDetailSteps';

const RENDERERS = [VariantsCompare, BatchSizeSpectrum, GradAccumulation, Recommendations];

export default function BatchDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = RENDERERS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Comp />
          </svg>
        );
      }}
    </StepViz>
  );
}
