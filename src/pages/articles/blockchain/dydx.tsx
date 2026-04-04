import Overview from './dydx/Overview';
import OrderbookArch from './dydx/OrderbookArch';
import MatchingEngine from './dydx/MatchingEngine';
import CosmosIntegration from './dydx/CosmosIntegration';
import Indexer from './dydx/Indexer';
import Frontend from './dydx/Frontend';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dydx/codeRefs';
import { dydxTree } from './dydx/fileTrees';

export default function DydxArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <OrderbookArch onCodeRef={sidebar.open} />
      <MatchingEngine onCodeRef={sidebar.open} />
      <CosmosIntegration onCodeRef={sidebar.open} />
      <Indexer onCodeRef={sidebar.open} />
      <Frontend onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'dydx-v4': dydxTree }}
        projectMetas={{
          'dydx-v4': { id: 'dydx-v4', label: 'dYdX v4 · Go/TS', badgeClass: 'bg-[#dbeafe] border-[#3b82f6] text-[#1e40af]' },
        }}
      />
    </>
  );
}
