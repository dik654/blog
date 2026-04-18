import StepViz from '@/components/ui/step-viz';
import { VARIANTS_STEPS, THEORY_STEPS } from './CoTDetailVizData';
import { StandardVsZeroStep, FewShotCoTSCStep, ToTReActStep, ComputeDecompStep, AttentionEmergentStep, LimitsStep } from './CoTDetailSteps';

const variantsRenderers = [StandardVsZeroStep, FewShotCoTSCStep, ToTReActStep];
const theoryRenderers = [ComputeDecompStep, AttentionEmergentStep, LimitsStep];

export function VariantsViz() {
  return (
    <StepViz steps={VARIANTS_STEPS}>
      {(step) => {
        const Step = variantsRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function TheoryViz() {
  return (
    <StepViz steps={THEORY_STEPS}>
      {(step) => {
        const Step = theoryRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
