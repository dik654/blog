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
      </div>
    </section>
  );
}
