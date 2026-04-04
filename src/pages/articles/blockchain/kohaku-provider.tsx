import Overview from './kohaku-provider/Overview';
import ProviderTrait from './kohaku-provider/ProviderTrait';
import PrivateRPC from './kohaku-provider/PrivateRPC';
import KeyDerivation from './kohaku-provider/KeyDerivation';
import TxSubmission from './kohaku-provider/TxSubmission';
import ENSResolution from './kohaku-provider/ENSResolution';
import TokenTracking from './kohaku-provider/TokenTracking';
import GasEstimation from './kohaku-provider/GasEstimation';
import Multichain from './kohaku-provider/Multichain';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './kohaku-provider/codeRefs';
import { kohakuTree } from './kohaku-provider/fileTrees';

export default function KohakuProviderArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProviderTrait onCodeRef={sidebar.open} />
      <PrivateRPC onCodeRef={sidebar.open} />
      <KeyDerivation onCodeRef={sidebar.open} />
      <TxSubmission onCodeRef={sidebar.open} />
      <ENSResolution onCodeRef={sidebar.open} />
      <TokenTracking onCodeRef={sidebar.open} />
      <GasEstimation onCodeRef={sidebar.open} />
      <Multichain onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ kohaku: kohakuTree }}
        projectMetas={{
          kohaku: { id: 'kohaku', label: 'Kohaku · Rust', badgeClass: 'bg-purple-500/10 border-purple-500 text-purple-700' },
        }}
      />
    </>
  );
}
