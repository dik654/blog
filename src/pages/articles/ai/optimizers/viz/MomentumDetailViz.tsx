import StepViz from '@/components/ui/step-viz';
import { STEPS } from './MomentumDetailVizData';
import { FormulaStep, BetaEffectStep, TrajectoryStep, ProsConsStep } from './MomentumDetailSteps';

const RENDERERS = [FormulaStep, BetaEffectStep, TrajectoryStep, ProsConsStep];

export default function MomentumDetailViz() {
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
