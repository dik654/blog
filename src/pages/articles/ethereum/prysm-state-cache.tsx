import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-state-cache/codeRefs';
import { prysmTree } from './prysm-state-cache/fileTrees';
import Overview from './prysm-state-cache/Overview';
import HotState from './prysm-state-cache/HotState';
import StateSummary from './prysm-state-cache/StateSummary';
import ColdArchive from './prysm-state-cache/ColdArchive';

export default function PrysmStateCache() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <HotState onCodeRef={sidebar.open} />
      <StateSummary onCodeRef={sidebar.open} />
      <ColdArchive onCodeRef={sidebar.open} />
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
