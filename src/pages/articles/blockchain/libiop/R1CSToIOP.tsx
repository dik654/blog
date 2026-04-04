import CodePanel from '@/components/ui/code-panel';
import R1CSTransformViz from './viz/R1CSTransformViz';
import { R1CS_CODE, POLYNOMIAL_CODE } from './R1CSToIOPData';

export default function R1CSToIOP() {
  return (
    <section id="r1cs-iop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → IOP 변환</h2>
      <div className="not-prose mb-8">
        <R1CSTransformViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          R1CS(Rank-1 Constraint System)는
          <code>A*z o B*z = C*z</code> 형태의 제약 시스템입니다.<br />
          이를 다항식 IOP로 변환하는 과정이
          libiop의 핵심 변환 단계입니다.
        </p>
        <h3>R1CS 제약 시스템</h3>
        <CodePanel title="r1cs.hpp 구조" code={R1CS_CODE}
          annotations={[
            { lines: [5, 7], color: 'sky', note: '입력/증인 크기 정의' },
            { lines: [8, 8] as [number, number], color: 'emerald', note: '제약 조건 벡터' },
            { lines: [10, 13], color: 'amber', note: '만족 검사 함수' },
          ]} />
        <h3>다항식 IOP 변환 과정</h3>
        <CodePanel title="R1CS -> 다항식 IOP" code={POLYNOMIAL_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '라그랑주 보간으로 다항식화' },
            { lines: [6, 8], color: 'emerald', note: 'vanishing polynomial 분해' },
            { lines: [10, 12], color: 'amber', note: 'RS 인코딩 적용' },
            { lines: [15, 15] as [number, number], color: 'violet', note: '머클 트리 커밋' },
          ]} />
      </div>
    </section>
  );
}
