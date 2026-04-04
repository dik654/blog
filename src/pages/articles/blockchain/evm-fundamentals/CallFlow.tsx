import EVMArchViz from './viz/EVMArchViz';
import CallFlowViz from './viz/CallFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CallFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="call-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 구조 & Call() 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          EVM은 BlockContext(블록 정보)와 TxContext(트랜잭션 정보)를 내장
          <br />
          각 호출마다 ScopeContext(Memory, Stack)와 Contract를 새로 생성
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('evm-struct', codeRefs['evm-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">EVM struct</span>
        </div>
      </div>
      <div className="not-prose mb-8"><EVMArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4 mt-8">
        <h3 className="text-xl font-semibold mb-3">evm.Call() 상세 흐름</h3>
        <p className="leading-7">
          깊이 검증(1024) → 잔액 확인 → 스냅샷 → 값 전송 → 코드 실행 → 에러 시 롤백
        </p>
      </div>
      <div className="not-prose">
        <CallFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
