import Overview from './evmos/Overview';
import EVMModule from './evmos/EVMModule';
import RevenueModule from './evmos/RevenueModule';
import IBCIntegration from './evmos/IBCIntegration';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './evmos/codeRefs';
import { cosmosEvmTree } from './evmos/fileTrees';

export default function EvmosArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <EVMModule onCodeRef={sidebar.open} />
      <RevenueModule onCodeRef={sidebar.open} />
      <IBCIntegration onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'cosmos-evm': cosmosEvmTree }}
        projectMetas={{
          'cosmos-evm': { id: 'cosmos-evm', label: 'Cosmos EVM · Go', badgeClass: 'bg-[#d1fae5] border-[#10b981] text-[#065f46]' },
        }}
      />
    </>
  );
}
