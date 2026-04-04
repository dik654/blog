import CreateFlowViz from './viz/CreateFlowViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CreateFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="create-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨트랙트 생성: CREATE & CREATE2</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          msg.To == nil이면 Call() 대신 Create()가 호출됨
          <br />
          init code를 실행하여 런타임 바이트코드를 배포하는 과정
        </p>
      </div>
      <div className="not-prose">
        <CreateFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
