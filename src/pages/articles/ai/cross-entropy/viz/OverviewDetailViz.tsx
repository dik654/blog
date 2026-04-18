import StepViz from '@/components/ui/step-viz';
import { SHANNON_STEPS, ML_STEPS } from './OverviewDetailVizData';
import {
  AxiomsStep, UniqueFunctionStep, LogBaseStep, ShannonStep,
  CrossEntropyMLStep, KLDivergenceMLStep, MLEStep, AdvancedConceptsStep, WhyLogStep,
} from './OverviewDetailSteps';

const shannonRenderers = [AxiomsStep, UniqueFunctionStep, LogBaseStep, ShannonStep];
const mlRenderers = [CrossEntropyMLStep, KLDivergenceMLStep, MLEStep, AdvancedConceptsStep, WhyLogStep];

export function ShannonViz() {
  return (
    <StepViz steps={SHANNON_STEPS}>
      {(step) => {
        const Step = shannonRenderers[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function MLConnectionViz() {
  return (
    <StepViz steps={ML_STEPS}>
      {(step) => {
        const Step = mlRenderers[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
