import CodePanel from '@/components/ui/code-panel';
import ConstraintFlowViz from './viz/ConstraintFlowViz';
import { SELECTOR_POLY_CODE, GATE_CONSTRAINT_CODE, COPY_CONSTRAINT_CODE, VERIFICATION_CODE } from './ConstraintsData';

export default function Constraints() {
  return (
    <section id="constraints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">제약 조건 시스템</h2>
      <div className="not-prose mb-8"><ConstraintFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">선택자 다항식</h3>
        <p>각 게이트의 선택자 값을 <strong>Lagrange 보간</strong>하여 다항식으로 만든다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">q_M(ωⁱ)</code>는 i번째 게이트의 곱셈 계수이다.</p>
        <CodePanel
          title="선택자 / 와이어 다항식"
          code={SELECTOR_POLY_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '선택자 → Lagrange 보간' },
            { lines: [6, 7], color: 'emerald', note: '와이어 다항식도 동일 방식' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">게이트 제약</h3>
        <p>모든 게이트 행에서 산술 등식이 성립해야 한다. 이를 <strong>vanishing polynomial</strong> <code className="bg-accent px-1.5 py-0.5 rounded text-sm">Zₕ(X)=Xⁿ-1</code>로 검증한다.</p>
        <CodePanel
          title="게이트 제약 등식"
          code={GATE_CONSTRAINT_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '범용 게이트 등식' },
            { lines: [5, 6], color: 'amber', note: 'vanishing으로 모든 행 검증' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Copy Constraints</h3>
        <CodePanel
          title="순열 기반 Copy Constraint"
          code={COPY_CONSTRAINT_CODE}
          annotations={[
            { lines: [1, 2], color: 'violet', note: '순열 σ로 와이어 위치 매핑' },
            { lines: [6, 8], color: 'emerald', note: 'Z(X) accumulator 검증' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">검증 과정 요약</h3>
        <CodePanel title="제약 검증 4단계" code={VERIFICATION_CODE} />
      </div>
    </section>
  );
}
