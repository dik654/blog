import StepViz from '@/components/ui/step-viz';
import { COMPARE_STEPS, KO_STEPS, GUIDE_STEPS } from './TokComparisonVizData';
import { CompareStep0, CompareStep1, CompareStep2 } from './TokComparisonSteps';
import { KoStep0, KoStep1 } from './TokComparisonSteps';
import { GuideStep0, GuideStep1, GuideStep2 } from './TokComparisonSteps';

export function AlgorithmCompareViz() {
  return (
    <StepViz steps={COMPARE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CompareStep0 />}
          {step === 1 && <CompareStep1 />}
          {step === 2 && <CompareStep2 />}
        </svg>
      )}
    </StepViz>
  );
}

export function KoreanEfficiencyViz() {
  return (
    <StepViz steps={KO_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <KoStep0 />}
          {step === 1 && <KoStep1 />}
        </svg>
      )}
    </StepViz>
  );
}

export function SelectionGuideViz() {
  return (
    <StepViz steps={GUIDE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <GuideStep0 />}
          {step === 1 && <GuideStep1 />}
          {step === 2 && <GuideStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
