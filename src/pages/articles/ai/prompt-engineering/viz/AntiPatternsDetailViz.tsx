import StepViz from '@/components/ui/step-viz';
import { ANTIPATTERN_STEPS, TROUBLESHOOT_STEPS } from './AntiPatternsDetailVizData';
import { AntiPattern1to3Step, AntiPattern4to7Step, AntiPattern8to10Step, OutputInconsistencyStep, IgnoreWasteStep, DebugChecklistStep } from './AntiPatternsDetailSteps';

const antiRenderers = [AntiPattern1to3Step, AntiPattern4to7Step, AntiPattern8to10Step];
const troubleRenderers = [OutputInconsistencyStep, IgnoreWasteStep, DebugChecklistStep];

export function AntiPatternListViz() {
  return (
    <StepViz steps={ANTIPATTERN_STEPS}>
      {(step) => {
        const Step = antiRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}

export function TroubleshootViz() {
  return (
    <StepViz steps={TROUBLESHOOT_STEPS}>
      {(step) => {
        const Step = troubleRenderers[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Step />
          </svg>
        );
      }}
    </StepViz>
  );
}
