import Overview from './commonware-crypto-p2p/Overview';
import BLS12381 from './commonware-crypto-p2p/BLS12381';
import Schemes from './commonware-crypto-p2p/Schemes';
import P2PAuth from './commonware-crypto-p2p/P2PAuth';
import Deterministic from './commonware-crypto-p2p/Deterministic';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './commonware-crypto-p2p/codeRefs';
import { commonwareTree } from './commonware-crypto-p2p/fileTrees';

export default function CommonwareCryptoP2PArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <div className="space-y-12">
        <Overview onCodeRef={sidebar.open} />
        <BLS12381 onCodeRef={sidebar.open} />
        <Schemes onCodeRef={sidebar.open} />
        <P2PAuth onCodeRef={sidebar.open} />
        <Deterministic onCodeRef={sidebar.open} />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareTree }}
        projectMetas={{
          commonware: {
            id: 'commonware',
            label: 'Commonware · Rust',
            badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700',
          },
        }}
      />
    </>
  );
}
