import StepViz from '@/components/ui/step-viz';
import { VERTEX_STEPS } from './NarwhalDetailData';
import { VertexStep, CertificateStep, RoundFlowStep } from './NarwhalVertexSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [VertexStep, CertificateStep, RoundFlowStep];
const REFS = ['sui-block', 'sui-block', 'sui-dag-state'];
const LABELS = ['block.rs (Vertex)', 'Certificate', 'dag_state.rs'];

export default function NarwhalVertexViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={VERTEX_STEPS}>
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
