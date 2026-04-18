import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TransformerDetailVizData';
import { ViTStructure, HybridTrends } from './TransformerDetailSteps';

export default function TransformerDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ViTStructure />}
          {step === 1 && <HybridTrends />}
        </svg>
      )}
    </StepViz>
  );
}
