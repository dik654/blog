import Overview from './berachain/Overview';
import PoLArchitecture from './berachain/PoLArchitecture';
import BeaconKitArch from './berachain/BeaconKitArch';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './berachain/codeRefs';
import { beaconKitTree } from './berachain/fileTrees';

export default function BerachainArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PoLArchitecture onCodeRef={sidebar.open} />
      <BeaconKitArch onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'beacon-kit': beaconKitTree }}
        projectMetas={{
          'beacon-kit': { id: 'beacon-kit', label: 'BeaconKit · Go', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
