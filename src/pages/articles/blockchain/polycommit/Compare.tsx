import CodePanel from '@/components/ui/code-panel';
import CompareTableViz from './viz/CompareTableViz';
import { COMPARE_CODE, COMPARE_ANNOTATIONS } from './FRIData';

export default function Compare({ title }: { title?: string }) {
  return (
    <section id="compare" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '비교 분석'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          6가지 다항식 커밋먼트 스킴은 각각 다른 보안 가정과 성능 특성을 가집니다.<br />
          증명 크기, 검증 시간, 설정 투명성, 양자 안전성 등
          유스케이스에 따라 최적의 스킴을 선택해야 합니다.
        </p>
      </div>

      <CompareTableViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스킴별 비교 & 선택 가이드</h3>
        <CodePanel title="비교 분석 요약" code={COMPARE_CODE}
          annotations={COMPARE_ANNOTATIONS} />
      </div>
    </section>
  );
}
