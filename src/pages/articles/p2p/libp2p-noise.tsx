import Overview from './libp2p-noise/Overview';
import KeypairSigning from './libp2p-noise/KeypairSigning';
import HandshakeFlow from './libp2p-noise/HandshakeFlow';
import FinishVerify from './libp2p-noise/FinishVerify';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './libp2p/codeRefs';
import { libp2pTree } from './libp2p/libp2pFileTree';

export default function LibP2PNoiseArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <KeypairSigning onCodeRef={sidebar.open} />
      <HandshakeFlow onCodeRef={sidebar.open} />
      <FinishVerify onCodeRef={sidebar.open} />
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
