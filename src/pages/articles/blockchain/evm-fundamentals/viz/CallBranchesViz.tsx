import StepViz from '@/components/ui/step-viz';
import { BRANCH_STEPS } from './CallBranchesVizData';
import { SnapshotStep, TransferStep, PrecompileStep } from './CallBranchesVizSteps';
import { NewContractStep, RunEntryStep, ErrorHandleStep } from './CallBranchesVizSteps2';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [SnapshotStep, TransferStep, PrecompileStep, NewContractStep, RunEntryStep, ErrorHandleStep];
const STEP_REFS = ['snapshot-revert', 'transfer', 'precompile-run', 'new-contract', 'interp-run', 'evm-call'];
const STEP_LABELS = ['journal.go — Snapshot/Revert', 'evm.go — Transfer()', 'contracts.go — RunPrecompiledContract()', 'contract.go — NewContract()', 'interpreter.go — Run()', 'evm.go — Call() 에러 처리'];

export default function CallBranchesViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={BRANCH_STEPS}>
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
