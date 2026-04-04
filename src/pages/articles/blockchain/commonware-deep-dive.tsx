import Overview from './commonware-deep-dive/Overview';
import RuntimeFoundation from './commonware-deep-dive/RuntimeFoundation';
import BridgeAssembly from './commonware-deep-dive/BridgeAssembly';
import Simplex from './commonware-deep-dive/Simplex';
import Broadcast from './commonware-deep-dive/Broadcast';
import Storage from './commonware-deep-dive/Storage';
import CryptoP2P from './commonware-deep-dive/CryptoP2P';
import RuntimeAlto from './commonware-deep-dive/RuntimeAlto';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './commonware-deep-dive/codeRefs';
import { fileTrees } from './commonware-deep-dive/fileTrees';

export default function CommonwareDeepDive() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-12">
      <Overview />
      <RuntimeFoundation onCodeRef={sidebar.open} />
      <BridgeAssembly onCodeRef={sidebar.open} />
      <Simplex />
      <Broadcast />
      <Storage />
      <CryptoP2P />
      <RuntimeAlto />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={fileTrees}
      />
    </div>
  );
}
