import StepViz from '@/components/ui/step-viz';
import SkipPathViz from './viz/SkipPathViz';
import { skipSteps } from './SkipConnectionData';

export default function SkipConnection() {
  return (
    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킵 커넥션 원리</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        y = F(x) + x — 입력을 변환 결과에 직접 더함.<br />
        dy/dx = dF/dx + 1 — "+1" 덕분에 기울기가 최소 1 이상 보장.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={skipSteps}>
          {(step) => <SkipPathViz step={step} />}
        </StepViz>
      </div>
    </section>
  );
}
