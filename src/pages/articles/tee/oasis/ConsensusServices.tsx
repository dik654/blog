import ConsensusServicesViz from './viz/ConsensusServicesViz';
import ConsensusServicesStepViz from './viz/ConsensusServicesStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ConsensusServices({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-services" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 서비스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis의 합의는 <strong>CometBFT</strong> 엔진 기반입니다.<br />
          Propose → Prevote → Precommit → Commit 4단계로 블록을 확정합니다.<br />
          ABCI(Application Blockchain Interface)를 통해 합의 로직과 애플리케이션 로직이 분리됩니다.
        </p>
      </div>

      <ConsensusServicesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('full-service', codeRefs['full-service'])} />
            <span className="text-[10px] text-muted-foreground self-center">full.go · 풀 노드</span>
            <CodeViewButton onClick={() => onCodeRef('abci-mux', codeRefs['abci-mux'])} />
            <span className="text-[10px] text-muted-foreground self-center">ABCI 앱 서버</span>
          </div>
        )}

        <h3>핵심 서비스 구성</h3>
      </div>
      <ConsensusServicesStepViz />
    </section>
  );
}
