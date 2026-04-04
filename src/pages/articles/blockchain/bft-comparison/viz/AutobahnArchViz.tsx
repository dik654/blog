import StepViz from '@/components/ui/step-viz';
import { ARCH_STEPS } from './AutobahnDetailData';
import { HighwayStep, LanesStep, RideSharingStep } from './AutobahnArchSteps';

const RENDERERS = [HighwayStep, LanesStep, RideSharingStep];

export default function AutobahnArchViz() {
  return (
    <StepViz steps={ARCH_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return <Renderer />;
      }}
    </StepViz>
  );
}
