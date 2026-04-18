import StepViz from '@/components/ui/step-viz';
import { COMPONENTS_STEPS } from './OverviewDetailVizData';
import { ComponentsStep, BudgetCostStep, PrinciplesStep, TrendsStep } from './OverviewDetailSteps';

const renderers = [ComponentsStep, BudgetCostStep, PrinciplesStep, TrendsStep];

export default function OverviewDetailViz() {
  return (
    <StepViz steps={COMPONENTS_STEPS}>
      {(step) => {
        const Step = renderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
