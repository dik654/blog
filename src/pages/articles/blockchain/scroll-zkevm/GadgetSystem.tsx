import GadgetTreeViz from './viz/GadgetTreeViz';
import CodePanel from '@/components/ui/code-panel';
import {
  GADGET_OVERVIEW_CODE, gadgetOverviewAnnotations,
  IS_ZERO_CODE, isZeroAnnotations,
  COMPARATOR_CODE, comparatorAnnotations,
  MULADD_CODE, mulAddAnnotations,
} from './GadgetSystemData';

export default function GadgetSystem() {
  return (
    <section id="gadget-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gadget 시스템</h2>
      <div className="not-prose mb-8"><GadgetTreeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Gadget은 zkEVM에서 <strong>재사용 가능한 회로 컴포넌트</strong>입니다.
          <code>gadgets/</code> 크레이트가 IsZero, LessThan, MulAdd 등 기본 검증 블록을 제공하고,
          각 ExecutionGadget이 이를 조합하여 복잡한 오퍼코드 제약을 구축합니다.
        </p>
        <CodePanel title="Gadget 시스템 계층" code={GADGET_OVERVIEW_CODE}
          annotations={gadgetOverviewAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">IsZeroGadget</h3>
        <CodePanel title="IsZero — 0 판별" code={IS_ZERO_CODE}
          annotations={isZeroAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">Comparator & LtGadget</h3>
        <CodePanel title="비교 Gadget 체계" code={COMPARATOR_CODE}
          annotations={comparatorAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">MulAddGadget</h3>
        <CodePanel title="256비트 곱셈+덧셈" code={MULADD_CODE}
          annotations={mulAddAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Gadget Library의 철학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Core gadgets (primitives)
// - IsZeroGadget: x == 0 판별
// - LtGadget: a < b 비교
// - CmpGadget: a == b 판별
// - MulAddWords: 256-bit 산술
// - RandomLinearCombination: byte array 압축

// Composed gadgets (primitives 조합)
// - LtWordGadget: 256-bit 비교
// - MinMaxGadget: min/max 선택
// - ConstantDivisionGadget: 상수 나누기
// - PairSelectGadget: 조건 분기

// High-level gadgets
// - TransferGadget: EVM transfer 로직
// - CallGadget: call frame 설정
// - GasCostGadget: 가스 계산
// - MemoryAddressGadget: 메모리 주소 검증

// Gadget 설계 원칙
// 1) Single responsibility (하나의 명확한 책임)
// 2) Constraint minimization (최소 제약)
// 3) Reusability (여러 opcode에서 사용)
// 4) Testability (단위 테스트)

// 장점
// - 140+ opcode를 ~30 gadgets로 구현
// - 코드 중복 대폭 감소
// - 버그는 gadget 레벨에서 수정
// - 새 opcode 추가 용이`}</pre>

      </div>
    </section>
  );
}
