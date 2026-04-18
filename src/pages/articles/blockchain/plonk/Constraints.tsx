import M from '@/components/ui/math';
import ConstraintFlowViz from './viz/ConstraintFlowViz';

export default function Constraints() {
  return (
    <section id="constraints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">제약 조건 시스템</h2>
      <div className="not-prose mb-8"><ConstraintFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">선택자 다항식</h3>
        <p>각 게이트의 선택자 값을 <strong>Lagrange 보간</strong>하여 다항식으로 만든다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">q_M(&omega;^i)</code>는 i번째 게이트의 곱셈 계수이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">선택자 / 와이어 다항식</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="font-semibold text-sm text-sky-400 mb-1">선택자 → Lagrange 보간</p>
                <p className="text-sm text-muted-foreground"><M>{'q_M(X), q_L(X), q_R(X), q_O(X), q_C(X)'}</M></p>
                <p className="text-sm text-muted-foreground">각 게이트 <M>{'i'}</M>에서의 값을 Lagrange 보간</p>
                <p className="text-sm text-muted-foreground"><M>{'q_M(\\omega^i)'}</M> = i번째 게이트의 곱셈 계수</p>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">와이어 다항식도 동일 방식</p>
                <p className="text-sm text-muted-foreground"><M>{'a(X), b(X), c(X)'}</M></p>
                <p className="text-sm text-muted-foreground"><M>{'a(\\omega^i)'}</M> = i번째 게이트의 left wire 값</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">게이트 제약</h3>
        <p>모든 게이트 행에서 산술 등식이 성립해야 한다. 이를 <strong>vanishing polynomial</strong> <M>{'Z_H(X) = X^n - 1'}</M>로 검증한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">게이트 제약 등식 (Gate Identity)</p>
            <M display>{'q_M(X) \\cdot a(X) \\cdot b(X) + q_L(X) \\cdot a(X) + q_R(X) \\cdot b(X) + q_O(X) \\cdot c(X) + q_C(X) = 0 \\pmod{Z_H(X)}'}</M>
            <div className="mt-2 rounded border border-amber-500/30 p-2">
              <p className="text-sm text-amber-400 font-medium">Vanishing polynomial</p>
              <p className="text-sm text-muted-foreground"><M>{'Z_H(X) = X^n - 1'}</M> → 모든 <M>{'\\omega^i'}</M>에서 등식이 성립해야 함</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Copy Constraints</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">순열 기반 Copy Constraint</p>
            <p className="text-sm text-muted-foreground mb-2">순열 <M>{'\\sigma = (\\sigma_a, \\sigma_b, \\sigma_c)'}</M>로 와이어 위치 매핑</p>
            <p className="text-sm text-muted-foreground mb-2">순열 다항식: <M>{'\\sigma_a(\\omega^i)'}</M> = j번째 와이어의 위치 (a→b→c 간 연결)</p>
            <div className="mt-2 rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">Z(X) accumulator 검증</p>
              <M display>{'Z(\\omega^0) = 1'}</M>
              <M display>{'Z(\\omega^n) = 1 \\quad \\text{(전체 곱이 상쇄)}'}</M>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">검증 과정 요약</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">제약 검증 4단계</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal pl-5">
              <li><strong>게이트 제약:</strong> 각 행에서 산술 등식 성립 확인</li>
              <li><strong>Copy 제약:</strong> 서로 다른 위치의 값이 동일한지 확인</li>
              <li><strong>Public input:</strong> 공개 입력이 올바른 위치에 배치 확인</li>
              <li><strong>Vanishing:</strong> 모든 제약이 <M>{'Z_H(X)'}</M>로 나누어떨어지는지 확인</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
