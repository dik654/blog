import Overview from './omni-octane/Overview';
import EngineIntegration from './omni-octane/EngineIntegration';
import CrossChain from './omni-octane/CrossChain';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './omni-octane/codeRefs';
import { omniTree } from './omni-octane/fileTrees';

export default function OmniOctaneArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <EngineIntegration onCodeRef={sidebar.open} />
      <CrossChain onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ omni: omniTree }}
        projectMetas={{
          omni: { id: 'omni', label: 'Omni Network · Go', badgeClass: 'bg-[#dbeafe] border-[#3b82f6] text-[#1e40af]' },
        }}
      />
    </>
  );
}
