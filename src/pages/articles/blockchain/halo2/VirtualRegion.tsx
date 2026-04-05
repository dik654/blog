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

        <h3 className="text-xl font-semibold mt-8 mb-3">Virtual vs Physical Region</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Halo2 two-layer model

// Physical layer (circuit 최종 형태)
// - Rectangular grid (columns × rows)
// - Column 간 advice rotation (r_ω)
// - Selector polynomials
// - Proof가 실제 작동하는 영역

// Virtual layer (개발자 API)
// - Linear "context" (시퀀스)
// - Abstract cell references
// - Constraint just in order written
// - Layout은 manager가 자동

// halo2-lib의 Virtual Region
ctx = Context::new();
let a = ctx.load_witness(3);
let b = ctx.load_witness(4);
let sum = gate.add(&mut ctx, a, b);
let product = gate.mul(&mut ctx, a, b);

// 내부 동작
// 1) Context에 cells 순차 저장
// 2) Manager가 chunk 단위로 physical column에 배치
// 3) CopyConstraint로 cell 연결
// 4) 최종 synthesize 시 physical layout 확정

// 장점
// ✓ 개발자 생산성 증가
// ✓ Column 수 자동 최적화
// ✓ Constraint 재사용 최대화

// 단점
// ✗ Physical layout 제어 어려움
// ✗ Performance tuning 제한
// ✗ Debug 복잡도`}</pre>

      </div>
    </section>
  );
}
