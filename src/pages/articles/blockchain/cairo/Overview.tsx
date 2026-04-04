import CodePanel from '@/components/ui/code-panel';
import CairoPipelineViz from './viz/CairoPipelineViz';
import {
  PIPELINE_CODE, PIPELINE_ANNOTATIONS,
  TYPE_CODE, TYPE_ANNOTATIONS,
} from './OverviewData';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 컴파일 파이프라인'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Cairo</strong>는 StarkWare가 개발한 증명 가능한 프로그램(provable program)
          작성을 위한 언어입니다. Rust 스타일의 소유권 시스템과 felt252 기반 타입 시스템을 갖추며,
          Salsa 쿼리 DB 기반의 증분 컴파일 파이프라인을 통해 CASM으로 변환됩니다.
        </p>
      </div>

      <CairoPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>컴파일 파이프라인 (Database Group 기반)</h3>
        <CodePanel title="Salsa 쿼리 기반 컴파일 단계" code={PIPELINE_CODE}
          annotations={PIPELINE_ANNOTATIONS} />

        <h3>타입 시스템 & felt252</h3>
        <CodePanel title="Cairo 핵심 타입과 소유권" code={TYPE_CODE}
          annotations={TYPE_ANNOTATIONS} />
      </div>
    </section>
  );
}
