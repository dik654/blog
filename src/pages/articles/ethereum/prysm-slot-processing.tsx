import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-slot-processing/codeRefs';
import { prysmTree } from './prysm-slot-processing/fileTrees';
import Overview from './prysm-slot-processing/Overview';
import ProcessSlot from './prysm-slot-processing/ProcessSlot';
import StateRootCaching from './prysm-slot-processing/StateRootCaching';

export default function PrysmSlotProcessing() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProcessSlot onCodeRef={sidebar.open} />
      <StateRootCaching onCodeRef={sidebar.open} />
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
