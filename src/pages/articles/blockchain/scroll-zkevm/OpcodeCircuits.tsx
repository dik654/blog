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
      </div>
    </section>
  );
}
