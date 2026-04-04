import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhy, StepPC1 } from './ContextVizSteps';
import { StepPC2, StepCommit, StepTimeline } from './ContextVizSteps2';
import { CodeViewButton } from '@/components/code';

const R = [StepWhy, StepPC1, StepPC2, StepCommit, StepTimeline];
const REF_KEYS = ['', 'seal-porep', 'seal-porep', 'seal-porep', 'seal-porep'];
const REF_LABELS = ['', 'PC1: SDR', 'PC2: 칼럼 해시', 'C2: Groth16', '전체 흐름'];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 115" className="w-full max-w-2xl"
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
