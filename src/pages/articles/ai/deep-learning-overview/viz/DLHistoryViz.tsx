import StepViz from '@/components/ui/step-viz';
import { STEPS } from './DLHistoryVizData';
import { DawnStep, RevivalStep, RevolutionStep, WintersStep, LLMEraStep } from './DLHistorySteps';

export default function DLHistoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <DawnStep />}
          {step === 1 && <RevivalStep />}
          {step === 2 && <RevolutionStep />}
          {step === 3 && <WintersStep />}
          {step === 4 && <LLMEraStep />}
        </svg>
      )}
    </StepViz>
  );
}
