import CoreArchitectureViz from './viz/CoreArchitectureViz';
import NodeTypesViz from './viz/NodeTypesViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function CoreArchitecture({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="core-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis Core는 <strong>합의 계층</strong>과 <strong>런타임 계층(ParaTime)</strong>을
          분리한 2계층 구조입니다.<br />
          합의 계층은 CometBFT 기반 BFT 합의로 네트워크 상태를 관리합니다.<br />
          런타임 계층은 독립된 ParaTime들이 병렬로 트랜잭션을 실행합니다.
        </p>
      </div>

      <CoreArchitectureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('abci-mux', codeRefs['abci-mux'])} />
            <span className="text-[10px] text-muted-foreground self-center">ABCI 멀티플렉서</span>
            <CodeViewButton onClick={() => onCodeRef('abci-mux-inner', codeRefs['abci-mux-inner'])} />
            <span className="text-[10px] text-muted-foreground self-center">abciMux 내부</span>
          </div>
        )}

        <h3>노드 유형</h3>
      </div>
      <NodeTypesViz />
    </section>
  );
}
