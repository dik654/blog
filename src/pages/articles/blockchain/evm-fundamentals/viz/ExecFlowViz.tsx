import StepViz from '@/components/ui/step-viz';
import { FLOW_STEPS } from './ExecFlowVizData';
import { PreCheckStep, IntrinsicGasStep, CallSetupStep } from './ExecFlowVizSteps';
import { RunLoopStep, RefundStep } from './ExecFlowVizSteps2';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [PreCheckStep, IntrinsicGasStep, CallSetupStep, RunLoopStep, RefundStep];
const STEP_REFS = ['st-execute', 'intrinsic-gas', 'evm-call', 'interp-run', 'st-execute'];
const STEP_LABELS = ['state_transition.go — execute()', 'state_transition.go — IntrinsicGas()', 'evm.go — Call()', 'interpreter.go — Run()', 'state_transition.go — execute()'];

export default function ExecFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={FLOW_STEPS}>
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
