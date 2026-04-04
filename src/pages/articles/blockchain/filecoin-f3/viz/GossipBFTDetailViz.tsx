import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './GossipBFTVizData';
import { StepRunLoop, StepQualityConverge } from './GossipBFTSteps';
import { StepPrepareCommit, StepDecide, StepGossipSub } from './GossipBFTSteps2';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../codeRefs';

const R = [StepRunLoop, StepQualityConverge, StepPrepareCommit, StepDecide, StepGossipSub];
const LABELS = ['gpbft.go — RunToCompletion', 'QUALITY→CONVERGE', 'PREPARE→COMMIT', 'f3.go — certStore', 'GossipSub 확장'];

interface Props {
  onOpenCode?: (key: string, ref: CodeRef) => void;
}

export default function GossipBFTDetailViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step], codeRefs[STEP_REFS[step]])} />
                <span className="text-[10px] text-muted-foreground">{LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
