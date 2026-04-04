import Overview from './lotus-chain/Overview';
import TipsetValidation from './lotus-chain/TipsetValidation';
import StateComputation from './lotus-chain/StateComputation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './lotus-chain/codeRefs';
import { chainTree } from './lotus-chain/fileTrees';

export default function LotusChainArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <TipsetValidation onCodeRef={sidebar.open} />
      <StateComputation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: chainTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
