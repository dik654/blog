import CosmosStackViz from './viz/CosmosStackViz';
import CosmosArchFlowViz from './viz/CosmosArchFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosmos SDK 개요</h2>
      <div className="not-prose mb-8"><CosmosStackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cosmos SDK — CometBFT 위에서 동작하는 <strong>모듈식 블록체인 프레임워크</strong><br />
          이더리움 EVM이 범용 바이트코드를 실행하는 것과 달리, <strong>네이티브 Go 코드</strong>로 상태 변경<br />
          성능상 유리하지만, 누구나 배포 가능한 스마트 컨트랙트 유연성은 부족
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('baseapp-struct', codeRefs['baseapp-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">BaseApp struct</span>
          <CodeViewButton onClick={() => onCodeRef('baseapp-new', codeRefs['baseapp-new'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewBaseApp()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">아키텍처 흐름</h3>
      </div>
      <div className="not-prose mb-8"><CosmosArchFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핵심 계층 구조:<br />
          <strong>gRPC/REST API</strong> → <strong>BaseApp</strong>(ABCI) → <strong>SDK Modules</strong>(Keeper) → <strong>MultiStore</strong>(IAVL) → <strong>CometBFT</strong>
        </p>
      </div>
    </section>
  );
}
