import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-epoch-processing/codeRefs';
import { prysmTree } from './prysm-epoch-processing/fileTrees';
import Overview from './prysm-epoch-processing/Overview';
import JustificationFinalization from './prysm-epoch-processing/JustificationFinalization';
import RewardsPenalties from './prysm-epoch-processing/RewardsPenalties';
import RegistrySlashings from './prysm-epoch-processing/RegistrySlashings';

export default function PrysmEpochProcessing() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <JustificationFinalization onCodeRef={sidebar.open} />
      <RewardsPenalties onCodeRef={sidebar.open} />
      <RegistrySlashings onCodeRef={sidebar.open} />
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
