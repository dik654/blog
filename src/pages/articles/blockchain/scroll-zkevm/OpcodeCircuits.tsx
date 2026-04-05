import OpcodeFlowViz from './viz/OpcodeFlowViz';
import CodePanel from '@/components/ui/code-panel';
import {
  OPCODE_DISPATCH_CODE, dispatchAnnotations,
  STACK_OP_CODE, stackOpAnnotations,
  STORAGE_OP_CODE, storageAnnotations,
} from './OpcodeCircuitsData';

export default function OpcodeCircuits() {
  return (
    <section id="opcode-circuits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Opcode 처리 회로</h2>
      <div className="not-prose mb-8"><OpcodeFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bus-mapping의 <code>fn_gen_associated_ops</code>가 각 <code>OpcodeId</code>를
          적절한 처리 함수로 디스패칭합니다. 오퍼코드는 4가지 패턴으로 분류됩니다:
          <strong> 스택 전용</strong>(ADD, POP), <strong>메모리</strong>(MLOAD, MSTORE),
          <strong> 스토리지</strong>(SLOAD, SSTORE), <strong>CALL 계열</strong>(CALL, CREATE).
        </p>
        <CodePanel title="Opcode 디스패칭" code={OPCODE_DISPATCH_CODE}
          annotations={dispatchAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">스택 전용 연산</h3>
        <CodePanel title="StackPopOnlyOpcode 패턴" code={STACK_OP_CODE}
          annotations={stackOpAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">스토리지 연산</h3>
        <CodePanel title="SLOAD 구현 상세" code={STORAGE_OP_CODE}
          annotations={storageAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">4가지 Opcode 패턴 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Pattern 1: Stack-only (ADD, MUL, SUB, DIV, AND, OR, XOR, ...)
// - 입력: stack에서 pop
// - 출력: stack에 push
// - 메모리·스토리지 접근 없음
// - 가장 단순, 회로도 작음

// Pattern 2: Memory ops (MLOAD, MSTORE, MSTORE8)
// - Memory expansion 처리 (gas 계산)
// - RWTable에 memory read/write 기록
// - Copy circuit과 연동

// Pattern 3: Storage ops (SLOAD, SSTORE)
// - MPT circuit으로 state root 변경
// - Warm/cold access 구분 (EIP-2929)
// - 가장 비싼 opcode

// Pattern 4: Call/Create (CALL, DELEGATECALL, CREATE, CREATE2)
// - 새 call frame 생성
// - Gas forwarding (63/64 rule)
// - Return data 처리
// - 가장 복잡한 회로

// 각 패턴별 회로 비용
// Stack-only: ~100 rows per op
// Memory: ~200 rows
// Storage: ~500 rows
// Call/Create: ~2000+ rows

// 성능 최적화
// - 자주 쓰이는 opcode (PUSH, ADD, MLOAD) 최적화 우선
// - Rare opcode (SELFDESTRUCT) 간소화
// - Lookup으로 common check 재사용`}</pre>

      </div>
    </section>
  );
}
