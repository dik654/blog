import InterpreterLoopViz from './viz/InterpreterLoopViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function InterpreterLoop({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="interpreter-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터프리터 루프 (Run)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM.Run()이 바이트코드를 한 opcode씩 실행하는 핵심 루프
          <br />
          매 사이클: <strong>Fetch → Decode → Gas → Execute → pc++</strong>
        </p>
      </div>
      <div className="not-prose">
        <InterpreterLoopViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
