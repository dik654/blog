import StepViz from '@/components/ui/step-viz';
import { ANCHOR_STEPS } from './BullsharkDetailData';
import { AnchorElectStep, CommitRuleStep, LinearizeStep, WaveStep } from './BullsharkDetailSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [AnchorElectStep, CommitRuleStep, LinearizeStep, WaveStep];
const REFS = ['sui-committer', 'sui-committer', 'sui-linearizer', 'sui-committer'];
const LABELS = ['base_committer.rs', 'commit rule', 'linearizer.rs', 'wave 구조'];

export default function BullsharkDetailViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={ANCHOR_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <Renderer />
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
