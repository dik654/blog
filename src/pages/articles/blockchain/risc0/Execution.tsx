import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import RISC0ReceiptViz from '../components/RISC0ReceiptViz';
import CodePanel from '@/components/ui/code-panel';
import { PIPELINE_CODE, SEGMENT_CODE, IO_CODE, MEMORY_CODE } from './ExecutionData';
import { pipelineAnnotations, segmentAnnotations, ioAnnotations, memoryAnnotations } from './ExecutionAnnotations';
import { codeRefs } from './codeRefs';

export default function Execution({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 엔진 &amp; 세그먼트</h2>
      <div className="not-prose mb-8"><RISC0ReceiptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RISC Zero의 zkVM은 <strong>Executor</strong>와 <strong>Prover</strong> 두 단계로 실행됩니다.<br />
          Executor는 RISC-V 명령어를 실행해 Execution Trace를 생성하고,
          Prover는 이 Trace를 zk-STARK 증명으로 변환합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('prover-prove', codeRefs['prover-prove'])} />
          <span className="text-[10px] text-muted-foreground self-center">prove() 진입점</span>
          <CodeViewButton onClick={() => onCodeRef('prover-session', codeRefs['prover-session'])} />
          <span className="text-[10px] text-muted-foreground self-center">prove_session()</span>
          <CodeViewButton onClick={() => onCodeRef('session-struct', codeRefs['session-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Session 구조체</span>
          <CodeViewButton onClick={() => onCodeRef('segment-struct', codeRefs['segment-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Segment 구조체</span>
        </div>
        <CodePanel title="실행 파이프라인" code={PIPELINE_CODE} annotations={pipelineAnnotations} />
        <CodePanel title="세그먼트 분할" code={SEGMENT_CODE} annotations={segmentAnnotations} />
        <CodePanel title="호스트-게스트 통신" code={IO_CODE} annotations={ioAnnotations} />
        <CodePanel title="메모리 시스템" code={MEMORY_CODE} annotations={memoryAnnotations} />
      </div>
    </section>
  );
}
