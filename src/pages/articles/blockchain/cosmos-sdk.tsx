import Overview from './cosmos-sdk/Overview';
import BaseAppSection from './cosmos-sdk/BaseAppSection';
import ABCIIntegration from './cosmos-sdk/ABCIIntegration';
import RunTxPipeline from './cosmos-sdk/RunTxPipeline';
import ModuleArchitecture from './cosmos-sdk/ModuleArchitecture';
import StateManagement from './cosmos-sdk/StateManagement';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cosmos-sdk/codeRefs';
import { cosmosTree } from './cosmos-sdk/fileTrees';

export default function CosmosSDKArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BaseAppSection onCodeRef={sidebar.open} />
      <ABCIIntegration onCodeRef={sidebar.open} />
      <RunTxPipeline onCodeRef={sidebar.open} />
      <ModuleArchitecture onCodeRef={sidebar.open} />
      <StateManagement onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'cosmos-sdk': cosmosTree }}
        projectMetas={{
          'cosmos-sdk': { id: 'cosmos-sdk', label: 'Cosmos SDK \u00b7 Go', badgeClass: 'bg-[#f0fdf4] border-[#22c55e] text-[#166534]' },
        }}
      />
    </>
  );
}
