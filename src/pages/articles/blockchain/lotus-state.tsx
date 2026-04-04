import Overview from './lotus-state/Overview';
import HamtAmt from './lotus-state/HamtAmt';
import StateTree from './lotus-state/StateTree';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './lotus-state/codeRefs';
import { stateTree, hamtTree } from './lotus-state/fileTrees';

export default function LotusStateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <HamtAmt onCodeRef={sidebar.open} />
      <StateTree onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: stateTree, 'go-hamt-ipld': hamtTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
          'go-hamt-ipld': { id: 'go-hamt-ipld', label: 'HAMT · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
