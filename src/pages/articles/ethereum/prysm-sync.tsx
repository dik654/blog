import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-sync/codeRefs';
import { prysmTree } from './prysm-sync/fileTrees';
import Overview from './prysm-sync/Overview';
import InitialSync from './prysm-sync/InitialSync';
import CheckpointSync from './prysm-sync/CheckpointSync';
import RegularSync from './prysm-sync/RegularSync';

export default function PrysmSync() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <InitialSync onCodeRef={sidebar.open} />
      <CheckpointSync onCodeRef={sidebar.open} />
      <RegularSync onCodeRef={sidebar.open} />
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
