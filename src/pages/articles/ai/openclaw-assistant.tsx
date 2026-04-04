import Overview from './openclaw-assistant/Overview';
import PiIntegration from './openclaw-assistant/PiIntegration';
import ChannelSkills from './openclaw-assistant/ChannelSkills';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './openclaw-assistant/codeRefs';
import { openclawTree } from './openclaw-assistant/fileTrees';

export default function OpenClawAssistantArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PiIntegration onCodeRef={sidebar.open} />
      <ChannelSkills onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'openclaw': openclawTree }}
        projectMetas={{
          'openclaw': { id: 'openclaw', label: 'OpenClaw · TS', badgeClass: 'bg-[#f0e6ff] border-[#8b5cf6] text-[#5b21b6]' },
        }}
      />
    </>
  );
}
