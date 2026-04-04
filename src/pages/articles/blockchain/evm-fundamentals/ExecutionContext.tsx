import ExecContextViz from './viz/ExecContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionContext({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 컨텍스트: CALL vs DELEGATECALL</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM은 컨트랙트 간 호출 시 새로운 실행 프레임 생성
          <br />
          CALL — 대상 컨트랙트의 storage 사용, msg.sender = 호출자
          <br />
          DELEGATECALL — 호출자의 storage 사용, msg.sender 유지 → 프록시 패턴의 핵심
        </p>
      </div>
      <div className="not-prose">
        <ExecContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
