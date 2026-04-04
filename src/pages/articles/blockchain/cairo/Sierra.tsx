import CodePanel from '@/components/ui/code-panel';
import SierraTypeViz from './viz/SierraTypeViz';
import {
  SIERRA_CODE, SIERRA_ANNOTATIONS,
  LIBFUNC_CODE, LIBFUNC_ANNOTATIONS,
} from './SierraData';

export default function Sierra({ title }: { title?: string }) {
  return (
    <section id="sierra" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sierra 중간표현 (Safe IR)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Sierra</strong>(Safe Intermediate Representation for Rust-like Assembly)는
          Cairo와 CASM 사이의 중간 표현입니다. 구조적 안전성을 보장하면서
          효율적인 컴파일을 가능하게 하는 핵심 역할을 담당합니다.
        </p>
      </div>

      <SierraTypeViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Sierra 프로그램 구조</h3>
        <CodePanel title="Program 구조체" code={SIERRA_CODE}
          annotations={SIERRA_ANNOTATIONS} />

        <h3>라이브러리 함수 계층 (CoreLibfunc)</h3>
        <CodePanel title="define_libfunc_hierarchy!" code={LIBFUNC_CODE}
          annotations={LIBFUNC_ANNOTATIONS} />
      </div>
    </section>
  );
}
