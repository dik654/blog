import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepCompare, StepChallenge, StepOnchain } from './ContextVizSteps';

const R = [StepCompare, StepChallenge, StepOnchain];
const REFS = ['pdp-main', 'pdp-main', 'pdp-main'];
const LABELS = ['PDP vs PoRep', 'GenerateProof()', 'VerifyOnChain()'];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 105" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <button onClick={() => onOpenCode(REFS[step])}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer">
                  {'{ }'} 코드 보기
                </button>
                <span className="text-[10px] text-muted-foreground">{LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
