import StepViz from '@/components/ui/step-viz';
import { STRATEGY_STEPS, BEST_STEPS } from './StructuredOutputDetailVizData';
import { JsonSchemaStep, XmlTagStep, FunctionCallingStep, PracticalTipsStep, TemplateStep, ModelCompareStep } from './StructuredOutputDetailSteps';

const strategyRenderers = [JsonSchemaStep, XmlTagStep, FunctionCallingStep];
const bestRenderers = [PracticalTipsStep, TemplateStep, ModelCompareStep];

export function StrategyViz() {
  return (
    <StepViz steps={STRATEGY_STEPS}>
      {(step) => {
        const Step = strategyRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function BestPracticesViz() {
  return (
    <StepViz steps={BEST_STEPS}>
      {(step) => {
        const Step = bestRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
