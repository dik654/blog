import Overview from './libp2p/Overview';
import TransportTrait from './libp2p/TransportTrait';
import SwarmLoop from './libp2p/SwarmLoop';
import BehaviourTrait from './libp2p/BehaviourTrait';
import HandlerTrait from './libp2p/HandlerTrait';
import ConnectionPoll from './libp2p/ConnectionPoll';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './libp2p/codeRefs';
import { libp2pTree } from './libp2p/libp2pFileTree';

export default function LibP2PArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <TransportTrait onCodeRef={sidebar.open} />
      <SwarmLoop onCodeRef={sidebar.open} />
      <BehaviourTrait onCodeRef={sidebar.open} />
      <HandlerTrait onCodeRef={sidebar.open} />
      <ConnectionPoll onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ libp2p: libp2pTree }}
        projectMetas={{
          libp2p: { id: 'libp2p', label: 'rust-libp2p', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
