import IntegrationDetailViz from './viz/IntegrationDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Integration({ onCodeRef }: Props) {
  return (
    <section id="integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EC + F3 통합</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC와 F3는 완전히 분리된 레이어<br />
        F3는 별도 goroutine으로 실행 — 비활성화해도 EC의 확률적 확정성 유지
      </p>
      <div className="not-prose mb-8">
        <IntegrationDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
