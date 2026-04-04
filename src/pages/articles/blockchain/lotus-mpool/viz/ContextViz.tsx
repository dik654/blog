import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepPool, StepGas, StepNonce, StepDiff } from './ContextVizSteps';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['mpool-add', 'mpool-estimate', 'mpool-add', 'mpool-estimate'];
const REF_LABELS = ['Add()', 'GasEstimate', 'verifyNonce()', 'BaseFee 비교'];
const R = [StepPool, StepGas, StepNonce, StepDiff];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">{REF_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
