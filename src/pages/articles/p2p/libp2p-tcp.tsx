import Overview from './libp2p-tcp/Overview';
import SocketCreation from './libp2p-tcp/SocketCreation';
import DialListen from './libp2p-tcp/DialListen';
import UpgradeChain from './libp2p-tcp/UpgradeChain';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './libp2p/codeRefs';
import { libp2pTree } from './libp2p/libp2pFileTree';

export default function Libp2pTcpArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <SocketCreation onCodeRef={sidebar.open} />
      <DialListen onCodeRef={sidebar.open} />
      <UpgradeChain onCodeRef={sidebar.open} />
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
