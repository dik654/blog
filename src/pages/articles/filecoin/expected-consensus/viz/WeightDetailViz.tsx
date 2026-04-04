import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './WeightVizData';
import { StepParent, StepLog2, StepBonus } from './WeightSteps';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../codeRefs';

const R = [StepParent, StepLog2, StepBonus];

interface Props {
  onOpenCode?: (key: string, ref: CodeRef) => void;
}

export default function WeightDetailViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step], codeRefs[STEP_REFS[step]])} />
                <span className="text-[10px] text-muted-foreground">weight.go — Weight()</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
