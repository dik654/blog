import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './BridgeVizData';
import { RuntimeInitStep, ContextStep, P2PChannelStep } from './BridgeVizSteps';
import { AssemblyStep, ConcurrentStep } from './BridgeVizSteps2';

const RENDERERS = [RuntimeInitStep, ContextStep, P2PChannelStep, AssemblyStep, ConcurrentStep];

export default function BridgeAssemblyViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const R = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 440 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <R />
            </svg>
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
