import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepActor, StepHamt, StepAmt, StepTree } from './ContextVizSteps';
import { CodeViewButton } from '@/components/code';

const R = [StepActor, StepHamt, StepAmt, StepTree];
const REF_KEYS = ['state-tree', 'hamt-find', 'hamt-find', 'state-tree'];
const REF_LABELS = ['Actor 구조체', 'HAMT 탐색', 'AMT 배열', 'StateTree'];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 110" className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
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
