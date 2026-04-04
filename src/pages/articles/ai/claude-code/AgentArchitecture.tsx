import { CodeViewButton } from '@/components/code';
import SubAgentTreeViz from './viz/SubAgentTreeViz';
import AgentLoopSequenceViz from './viz/AgentLoopSequenceViz';
import ContextManagement from './ContextManagement';
import MCPIntegration from './MCPIntegration';
import HooksSystem from './HooksSystem';
import {subAgentCode} from './AgentArchitectureData';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function AgentArchitecture({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="agent-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전트 아키텍처</h2>
      <div className="not-prose mb-8"><AgentLoopSequenceViz /></div>
      <div className="not-prose mb-8"><SubAgentTreeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 시스템</h3>
        <p>
          Main Agent → Explore(탐색 전문), Plan(설계), General(범용) 서브에이전트.<br />
          각 에이전트는 용도에 맞는 도구 세트만 사용.
        </p>
        <div className="flex gap-2 mt-2">
          <CodeViewButton onClick={() => onCodeRef('agent-1', codeRefs['agent-1'])} />
          <span className="text-[10px] text-muted-foreground self-center">이슈 관리 에이전트 워크플로우</span>
        </div>
        <ContextManagement />
        <MCPIntegration />
        <HooksSystem onCodeRef={onCodeRef} />
      </div>
    </section>
  );
}
