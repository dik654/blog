import CodePanel from '@/components/ui/code-panel';
import CASMMapViz from './viz/CASMMapViz';
import {
  CASM_CODE, CASM_ANNOTATIONS,
  MAPPING_CODE, MAPPING_ANNOTATIONS,
} from './CASMData';

export default function CASM({ title }: { title?: string }) {
  return (
    <section id="casm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CASM 생성 & 레지스터 모델'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>CASM</strong>(Cairo Assembly) 생성은 컴파일 파이프라인의 마지막 단계로,
          Sierra 중간표현을 Cairo VM에서 실행 가능한 저수준 어셈블리 명령어로 매핑합니다.
          <code>cairo-lang-sierra-to-casm</code> crate가 이를 담당합니다.
        </p>
      </div>

      <CASMMapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>compile() — CASM 생성 메인 루프</h3>
        <CodePanel title="Sierra → CASM 컴파일 과정" code={CASM_CODE}
          annotations={CASM_ANNOTATIONS} />

        <h3>매핑 규칙 & 레지스터 모델</h3>
        <CodePanel title="Sierra→CASM 매핑 & 최적화" code={MAPPING_CODE}
          annotations={MAPPING_ANNOTATIONS} />
      </div>
    </section>
  );
}
