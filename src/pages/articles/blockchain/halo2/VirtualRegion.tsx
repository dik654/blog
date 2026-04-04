import VirtualRegionViz from './viz/VirtualRegionViz';
import CodePanel from '@/components/ui/code-panel';
import { MANAGER_CODE, COPY_MANAGER_CODE } from './VirtualRegionData';
import { managerAnnotations, copyManagerAnnotations } from './VirtualRegionAnnotations';

export default function VirtualRegion({ title }: { title?: string }) {
  return (
    <section id="virtual-region" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '가상 영역 관리 (Virtual Region)'}</h2>
      <div className="not-prose mb-8"><VirtualRegionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          halo2-lib의 핵심 설계 철학은 <strong>가상 영역(Virtual Region)</strong> 관리입니다.
          <br />
          개발자는 물리적 컬럼/행 배치를 신경 쓰지 않고 논리적 연산 흐름에만 집중하며,
          <code>SinglePhaseCoreManager</code>가 여러 <code>Context</code>를 물리적 컬럼으로
          자동 chunking합니다.
        </p>
        <p>
          <code>CopyConstraintManager</code>는 advice 셀 간, 그리고 상수-advice 셀 간의
          equality constraint를 전역적으로 관리합니다.
          <br />
          <code>LookupAnyManager</code>는
          lookup argument를 별도 advice 컬럼으로 복사하여 처리합니다.
        </p>
        <CodePanel title="SinglePhaseCoreManager — 가상→물리 Chunking" code={MANAGER_CODE} annotations={managerAnnotations} />
        <CodePanel title="CopyConstraintManager — 전역 등가 제약" code={COPY_MANAGER_CODE} annotations={copyManagerAnnotations} />
      </div>
    </section>
  );
}
