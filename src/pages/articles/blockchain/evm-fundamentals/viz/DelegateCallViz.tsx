import StepViz from '@/components/ui/step-viz';
import { DELEGATE_STEPS } from './CreateFlowVizData';
import { DelegateCallStep, AsDelegateStep, StaticCallStep, SelfdestructStep } from './DelegateCallVizSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [DelegateCallStep, AsDelegateStep, StaticCallStep, SelfdestructStep];
const STEP_REFS = ['evm-delegatecall', 'evm-delegatecall', 'evm-staticcall', 'op-selfdestruct'];
const STEP_LABELS = ['evm.go — DelegateCall()', 'evm.go — AsDelegate()', 'evm.go — StaticCall()', 'instructions.go — opSelfdestruct'];

export default function DelegateCallViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={DELEGATE_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <Renderer />
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
