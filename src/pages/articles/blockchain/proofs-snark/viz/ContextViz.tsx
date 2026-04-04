import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhy, StepPipeline } from './ContextVizSteps';
import { StepGPU, StepSupra } from './ContextVizSteps2';
import { CodeViewButton } from '@/components/code';

const R = [StepWhy, StepPipeline, StepGPU, StepSupra];
const REF_KEYS = ['snark-prover', 'snark-prover', 'snark-prover', ''];
const REF_LABELS = ['SNARK 개요', '증명 파이프라인', 'GPU 가속', ''];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 110" className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && REF_KEYS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">
                  {REF_LABELS[step]}
                </span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
