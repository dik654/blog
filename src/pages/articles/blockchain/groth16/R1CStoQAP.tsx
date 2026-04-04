import CodePanel from '@/components/ui/code-panel';
import R1CStoQAPViz from './viz/R1CStoQAPViz';
import { LAGRANGE_CODE, QAP_CODE, QUOTIENT_CODE, VANISHING_CODE } from './R1CStoQAPData';

export default function R1CStoQAP() {
  return (
    <section id="r1cs-to-qap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → QAP 변환</h2>
      <div className="not-prose mb-8"><R1CStoQAPViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          R1CS의 행렬 제약을 <strong>다항식 기반 QAP</strong>로 변환하는 과정입니다.<br />
          Lagrange 보간으로 다항식을 구성하고, 몫 다항식 h(x)를 FFT 기반으로 효율 계산합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Lagrange 보간</h3>
        <CodePanel
          title="R1CS 계수 → 다항식 복원"
          code={LAGRANGE_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'R1CS 제약 구조' },
            { lines: [4, 7], color: 'emerald', note: '변수별 3개 다항식 생성' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">QAP 다항식 구성</h3>
        <CodePanel
          title="A(x)·B(x) - C(x) = h(x)·t(x)"
          code={QAP_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: 'witness 가중합 다항식' },
            { lines: [6, 8], color: 'amber', note: 'QAP 만족 조건' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">몫 다항식 h(x) — 코셋 FFT</h3>
        <CodePanel
          title="h(x) = [A·B - C] / t(x)"
          code={QUOTIENT_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'vanishing polynomial' },
            { lines: [5, 10], color: 'emerald', note: '5단계 코셋 FFT 최적화' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">Vanishing Polynomial</h3>
        <CodePanel
          title="t(x) = xⁿ - 1 — 건전성의 근거"
          code={VANISHING_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 't(x) 정의' },
            { lines: [4, 7], color: 'emerald', note: 'R1CS 만족 ⟺ h(x) 존재' },
          ]}
        />
      </div>
    </section>
  );
}
