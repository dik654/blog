import Overview from './cometbft-crypto/Overview';
import Ed25519 from './cometbft-crypto/Ed25519';
import Merkle from './cometbft-crypto/Merkle';
import Hash from './cometbft-crypto/Hash';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-crypto/codeRefs';
import { cometbftCryptoTree } from './cometbft-crypto/fileTrees';

export default function CometBFTCryptoArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Ed25519 onCodeRef={sidebar.open} />
      <Merkle onCodeRef={sidebar.open} />
      <Hash onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftCryptoTree }}
        projectMetas={{ cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' } }}
      />
    </>
  );
}
