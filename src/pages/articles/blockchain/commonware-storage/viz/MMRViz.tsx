import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './MMRVizData';
import { TreeBase, BatchFlow, AppendAnim, ProofPath } from './MMRVizParts';

interface Props { onOpenCode?: (key: string) => void }

export default function MMRViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 460 115" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <TreeBase step={step} />
            {step === 1 && <BatchFlow />}
            {step === 2 && <AppendAnim />}
            {step === 3 && <ProofPath />}
            <defs>
              <marker id="mmr-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5" fill="#10b981" />
              </marker>
            </defs>
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
