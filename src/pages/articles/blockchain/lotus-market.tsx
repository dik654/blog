import Overview from './lotus-market/Overview';
import StorageDeal from './lotus-market/StorageDeal';
import Retrieval from './lotus-market/Retrieval';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './lotus-market/codeRefs';
import { marketTree } from './lotus-market/fileTrees';

export default function LotusMarketArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <StorageDeal onCodeRef={sidebar.open} />
      <Retrieval onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: marketTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
