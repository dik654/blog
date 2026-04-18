import StepViz from '@/components/ui/step-viz';
import { PRINCIPLES_STEPS, HISTORY_STEPS } from './OverviewDetailVizData';
import {
  ClarityContextStep, ExamplesRoleStep, StructureIterationStep, TemplateBlocksStep,
  EarlyEraStep, CoTEraStep, AgentEraStep, CurrentStateStep,
} from './OverviewDetailSteps';

const principlesRenderers = [ClarityContextStep, ExamplesRoleStep, StructureIterationStep, TemplateBlocksStep];
const historyRenderers = [EarlyEraStep, CoTEraStep, AgentEraStep, CurrentStateStep];

export function PrinciplesViz() {
  return (
    <StepViz steps={PRINCIPLES_STEPS}>
      {(step) => {
        const Step = principlesRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function HistoryViz() {
  return (
    <StepViz steps={HISTORY_STEPS}>
      {(step) => {
        const Step = historyRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
