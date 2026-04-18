import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TrainingDetailVizData';
import { SoftmaxBottleneck, NegSamplingDerivation, HierarchicalSoftmaxTree, SubsamplingStep, CostComparison } from './TrainingDetailSteps';

export default function TrainingDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <SoftmaxBottleneck />}
          {step === 1 && <NegSamplingDerivation />}
          {step === 2 && <HierarchicalSoftmaxTree />}
          {step === 3 && <SubsamplingStep />}
          {step === 4 && <CostComparison />}
        </svg>
      )}
    </StepViz>
  );
}
