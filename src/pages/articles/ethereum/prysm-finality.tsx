import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-finality/codeRefs';
import { prysmTree } from './prysm-finality/fileTrees';
import Overview from './prysm-finality/Overview';
import CheckpointManagement from './prysm-finality/CheckpointManagement';
import FinalizationPruning from './prysm-finality/FinalizationPruning';
import WeakSubjectivity from './prysm-finality/WeakSubjectivity';

export default function PrysmFinality() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CheckpointManagement onCodeRef={sidebar.open} />
      <FinalizationPruning onCodeRef={sidebar.open} />
      <WeakSubjectivity onCodeRef={sidebar.open} />
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
