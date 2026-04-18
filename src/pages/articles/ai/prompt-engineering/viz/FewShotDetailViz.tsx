import StepViz from '@/components/ui/step-viz';
import { DESIGN_STEPS, ICL_STEPS } from './FewShotDetailVizData';
import { NshotStep, DiversityStep, OrderBiasStep, BayesianStep, InductionStep, ClaudeFewShotStep } from './FewShotDetailSteps';

const designRenderers = [NshotStep, DiversityStep, OrderBiasStep];
const iclRenderers = [BayesianStep, InductionStep, ClaudeFewShotStep];

export function DesignViz() {
  return (
    <StepViz steps={DESIGN_STEPS}>
      {(step) => {
        const Step = designRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function ICLViz() {
  return (
    <StepViz steps={ICL_STEPS}>
      {(step) => {
        const Step = iclRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
