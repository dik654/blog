import StepViz from '@/components/ui/step-viz';
import { BLIP_STEPS } from './AutobahnDetailData';
import { TraditionalBlipStep, DAGBlipStep, AutobahnBlipStep } from './AutobahnBlipSteps';

const RENDERERS = [TraditionalBlipStep, DAGBlipStep, AutobahnBlipStep];

export default function AutobahnBlipViz() {
  return (
    <StepViz steps={BLIP_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return <Renderer />;
      }}
    </StepViz>
  );
}
