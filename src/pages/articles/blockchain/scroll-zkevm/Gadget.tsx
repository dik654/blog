import GadgetLifecycleViz from '../components/GadgetLifecycleViz';
import EVMProvingViz from './viz/EVMProvingViz';
import CodePanel from '@/components/ui/code-panel';
import { GADGET_TRAIT_CODE, ADD_SUB_CODE, BUS_MAPPING_CODE } from './GadgetData';
import { gadgetTraitAnnotations, addSubAnnotations, busMappingAnnotations } from './GadgetAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Gadget({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="gadget" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'ExecutionGadget — 오퍼코드 회로 구현'}</h2>
      <div className="not-prose mb-8"><GadgetLifecycleViz /></div>
      <div className="not-prose mb-8"><EVMProvingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 EVM 오퍼코드는 <code>ExecutionGadget</code> 트레이트를 구현합니다.
          <code>configure</code>에서 제약을 등록하고,
          <code>assign_exec_step</code>에서 실제 실행 트레이스로 셀을 채웁니다.
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('add-sub-gadget', codeRefs['add-sub-gadget'])} />
            <span className="text-[10px] text-muted-foreground self-center">add_sub.rs</span>
            <CodeViewButton onClick={() => _onCodeRef('add-sub-assign', codeRefs['add-sub-assign'])} />
            <span className="text-[10px] text-muted-foreground self-center">assign</span>
          </div>
        )}
        <CodePanel title="ExecutionGadget 트레이트 (execution.rs)" code={GADGET_TRAIT_CODE} annotations={gadgetTraitAnnotations} />
        <CodePanel title="ADD/SUB 가젯 구현 (execution/add_sub.rs)" code={ADD_SUB_CODE} annotations={addSubAnnotations} />
        <CodePanel title="bus-mapping 연계" code={BUS_MAPPING_CODE} annotations={busMappingAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Gadget Pattern — DRY for 140+ Opcodes</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EVM: 140+ opcodes, 각각 회로 필요
// Naive: 140+ 개별 회로 → 중복 코드, 버그 위험

// Gadget Pattern 해결
// 1) Common constraints 추상화
//    - PC increment
//    - Stack push/pop
//    - Gas consumption
//    - Memory access

// 2) Reusable gadgets
//    - AddWordsGadget: 256-bit 덧셈
//    - CmpGadget: 비교 연산
//    - RangeCheck: 값 범위 검증
//    - LookupGadget: table lookup

// 3) Opcode-specific gadget
//    - AddGadget: AddWordsGadget 재사용
//    - SubGadget: AddGadget 역연산
//    - MulGadget: AddWordsGadget 반복

// 코드 재사용 예시
// ADD (opcode 0x01)
// = Pop x, y → Push x+y → PC+=1 → gas-=3
// 모든 step이 common gadget으로 구성

// 효과
// - 코드 중복 1/10로 감소
// - 버그는 gadget 레벨에서 fix (전파)
// - 새 opcode 추가 시 기존 gadget 조합`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: configure vs assign 분리</p>
          <p>
            <strong>configure (compile-time)</strong>: 제약식 등록, 회로 구조 정의<br />
            <strong>assign (runtime)</strong>: 실제 witness 값 할당, 증명 생성<br />
            둘을 분리하는 이유: 회로 자체는 한 번만 구성 → prove 반복 시 재사용
          </p>
        </div>

      </div>
    </section>
  );
}
