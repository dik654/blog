import Overview from './filecoin-f3/Overview';
import GossipBFT from './filecoin-f3/GossipBFT';
import Integration from './filecoin-f3/Integration';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-f3/codeRefs';
import { f3Tree } from './filecoin-f3/fileTrees';

export default function FilecoinF3Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <GossipBFT onCodeRef={sidebar.open} />
      <Integration onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-f3': f3Tree }}
        projectMetas={{
          'go-f3': { id: 'go-f3', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
