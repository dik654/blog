import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-beacon-state/codeRefs';
import { prysmTree } from './prysm-beacon-state/fileTrees';
import Overview from './prysm-beacon-state/Overview';
import StateInterface from './prysm-beacon-state/StateInterface';
import FieldTrie from './prysm-beacon-state/FieldTrie';
import StateFork from './prysm-beacon-state/StateFork';

export default function PrysmBeaconState() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <StateInterface onCodeRef={sidebar.open} />
      <FieldTrie onCodeRef={sidebar.open} />
      <StateFork onCodeRef={sidebar.open} />
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
