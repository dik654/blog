import StepViz from '@/components/ui/step-viz';
import { DETAIL_STEPS } from './HotStuffDetailVizData';
import { StarTopologyStep, ThresholdQCStep } from './HotStuffDetailSteps';
import { ChainRuleStep, ViewChangeCompareStep } from './HotStuffDetailSteps2';

const RENDERERS = [StarTopologyStep, ThresholdQCStep, ChainRuleStep, ViewChangeCompareStep];

export default function HotStuffDetailViz() {
  return (
    <StepViz steps={DETAIL_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return <Renderer />;
      }}
    </StepViz>
  );
}
