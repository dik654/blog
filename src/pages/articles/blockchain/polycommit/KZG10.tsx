import CodePanel from '@/components/ui/code-panel';
import KZG10FlowViz from './viz/KZG10FlowViz';
import {
  SETUP_CODE, SETUP_ANNOTATIONS,
  COMMIT_CODE, COMMIT_ANNOTATIONS,
} from './KZG10Data';

export default function KZG10({ title }: { title?: string }) {
  return (
    <section id="kzg10" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'KZG10 구현 상세'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KZG10</strong>(Kate-Zaverucha-Goldberg, 2010)은 가장 기본적인 페어링 기반
          다항식 커밋먼트 스킴입니다. O(1) 크기의 증명과 O(1) 검증 시간이 핵심 장점이며,
          trusted setup이 필요합니다.
        </p>
      </div>

      <KZG10FlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Trusted Setup (SRS 생성)</h3>
        <CodePanel title="setup() — powers of beta 계산" code={SETUP_CODE}
          annotations={SETUP_ANNOTATIONS} />

        <h3>커밋 & Hiding 메커니즘</h3>
        <CodePanel title="commit() — MSM + hiding" code={COMMIT_CODE}
          annotations={COMMIT_ANNOTATIONS} />
      </div>
    </section>
  );
}
