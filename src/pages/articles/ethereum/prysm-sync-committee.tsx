import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-sync-committee/codeRefs';
import { prysmTree } from './prysm-sync-committee/fileTrees';
import Overview from './prysm-sync-committee/Overview';
import Participation from './prysm-sync-committee/Participation';
import Contribution from './prysm-sync-committee/Contribution';

export default function PrysmSyncCommittee() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Participation onCodeRef={sidebar.open} />
      <Contribution onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: 'prysm', label: 'Prysm · Go', badgeClass: 'bg-violet-500/10 border-violet-500 text-violet-700' },
        }}
      />
    </>
  );
}
