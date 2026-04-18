import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AppsDetailVizData';
import { SearchClassify, ClusterRecommend, TranslateAnomaly, QualityEvaluation } from './AppsDetailSteps';

export default function AppsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <SearchClassify />}
          {step === 1 && <ClusterRecommend />}
          {step === 2 && <TranslateAnomaly />}
          {step === 3 && <QualityEvaluation />}
        </svg>
      )}
    </StepViz>
  );
}
