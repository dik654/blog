import Overview from './libp2p-quic/Overview';
import QuinnIntegration from './libp2p-quic/QuinnIntegration';
import DialMechanism from './libp2p-quic/DialMechanism';
import HolePunching from './libp2p-quic/HolePunching';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './libp2p/codeRefs';
import { libp2pTree } from './libp2p/libp2pFileTree';

export default function LibP2PQuicArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <QuinnIntegration onCodeRef={sidebar.open} />
      <DialMechanism onCodeRef={sidebar.open} />
      <HolePunching onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ libp2p: libp2pTree }}
        projectMetas={{
          libp2p: {
            id: 'libp2p',
            label: 'rust-libp2p',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
