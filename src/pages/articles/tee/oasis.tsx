import Overview from './oasis/Overview';
import CoreArchitecture from './oasis/CoreArchitecture';
import ConsensusServices from './oasis/ConsensusServices';
import RuntimeSystem from './oasis/RuntimeSystem';
import P2PNetworking from './oasis/P2PNetworking';
import StorageSystem from './oasis/StorageSystem';
import TEESecurity from './oasis/TEESecurity';
import Sapphire from './oasis/Sapphire';
import SapphireDetail from './oasis/SapphireDetail';
import KeyManager from './oasis/KeyManager';
import DeveloperTools from './oasis/DeveloperTools';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './oasis/codeRefs';
import { oasisCoreTree } from './oasis/fileTree';

export default function OasisArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CoreArchitecture onCodeRef={sidebar.open} />
      <ConsensusServices onCodeRef={sidebar.open} />
      <RuntimeSystem onCodeRef={sidebar.open} />
      <P2PNetworking />
      <StorageSystem />
      <TEESecurity />
      <Sapphire />
      <SapphireDetail />
      <KeyManager onCodeRef={sidebar.open} />
      <DeveloperTools />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'oasis-core': oasisCoreTree }}
        projectMetas={{
          'oasis-core': { id: 'oasis-core', label: 'Oasis · Go', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
