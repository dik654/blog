import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-p2p-libp2p/codeRefs';
import { prysmTree } from './prysm-p2p-libp2p/fileTrees';
import Overview from './prysm-p2p-libp2p/Overview';
import PeerDiscovery from './prysm-p2p-libp2p/PeerDiscovery';
import PeerScoring from './prysm-p2p-libp2p/PeerScoring';
import ConnectionGating from './prysm-p2p-libp2p/ConnectionGating';

export default function PrysmP2PLibp2p() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PeerDiscovery onCodeRef={sidebar.open} />
      <PeerScoring onCodeRef={sidebar.open} />
      <ConnectionGating onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: 'prysm', label: 'Prysm · Go', badgeClass: 'bg-violet-500/10 border-violet-500 text-violet-700' },
        }}
      />
    </>
  );
}
