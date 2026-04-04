import SectorDetailViz from './viz/SectorDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SectorLifecycle({ onCodeRef }: Props) {
  return (
    <section id="sector-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">섹터 라이프사이클 — 8단계 상태 머신</h2>
      <p className="text-sm text-muted-foreground mb-4">
        각 섹터가 Empty → Proving까지 독립적으로 상태 전이<br />
        PC1은 CPU 3-5시간, PC2와 Commit은 GPU 가속
      </p>
      <div className="not-prose mb-8">
        <SectorDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
