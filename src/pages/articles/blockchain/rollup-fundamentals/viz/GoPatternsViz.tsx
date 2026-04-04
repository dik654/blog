import StepViz from '@/components/ui/step-viz';
import { GO_PATTERNS } from '../GoPatternsData';
import { StructEmbedStep, ChannelStep, ContextStep } from './GoPatternsVizParts';
import { ErrorStep, PointerRecvStep } from './GoPatternsVizParts2';

const STEPS = GO_PATTERNS.map(p => ({
  label: p.title,
  body: p.why,
}));

const RENDERERS = [StructEmbedStep, ChannelStep, ContextStep, ErrorStep, PointerRecvStep];

export default function GoPatternsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="go-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.6} />
              </marker>
            </defs>
            <Renderer />
          </svg>
        );
      }}
    </StepViz>
  );
}
