import ChannelFlowViz from './viz/ChannelFlowViz';
import ChannelMessageFlowViz from './viz/ChannelMessageFlowViz';
import ChannelArchitecture from './ChannelArchitecture';
import SkillSystem from './SkillSystem';
import SubAgentSandbox from './SubAgentSandbox';
import CodeStructure from './CodeStructure';
import type { CodeRef } from '@/components/code/types';

export default function ChannelSkills({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="channel-skills" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">채널 시스템 & 스킬</h2>
      <div className="not-prose mb-8"><ChannelMessageFlowViz /></div>
      <div className="not-prose mb-8"><ChannelFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ChannelArchitecture onCodeRef={onCodeRef} />
        <SkillSystem onCodeRef={onCodeRef} />
        <SubAgentSandbox onCodeRef={onCodeRef} />
        <CodeStructure />
      </div>
    </section>
  );
}
