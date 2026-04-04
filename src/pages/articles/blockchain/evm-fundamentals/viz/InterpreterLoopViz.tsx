import StepViz from '@/components/ui/step-viz';
import { LOOP_STEPS } from './InterpreterLoopVizData';
import { ScopeCreateStep, FetchStep, DecodeStep } from './InterpreterLoopVizSteps';
import { GasStep, ExecuteStep, LoopBackStep } from './InterpreterLoopVizSteps2';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [ScopeCreateStep, FetchStep, DecodeStep, GasStep, ExecuteStep, LoopBackStep];
const STEP_REFS = ['scope-context', 'interp-run', 'jump-table', 'interp-run', 'op-add', 'interp-run'];
const STEP_LABELS = ['interpreter.go — ScopeContext', 'interpreter.go — Run() L20-21', 'jump_table.go — JumpTable[256]', 'interpreter.go — Run() L30-41', 'instructions.go — opAdd()', 'interpreter.go — Run() 메인 루프'];

export default function InterpreterLoopViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={LOOP_STEPS}>
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
