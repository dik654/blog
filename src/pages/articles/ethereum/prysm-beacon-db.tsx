import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-beacon-db/codeRefs';
import { prysmTree } from './prysm-beacon-db/fileTrees';
import Overview from './prysm-beacon-db/Overview';
import KvSchema from './prysm-beacon-db/KvSchema';
import BlockStateOps from './prysm-beacon-db/BlockStateOps';
import PruningArchival from './prysm-beacon-db/PruningArchival';

export default function PrysmBeaconDB() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <KvSchema onCodeRef={sidebar.open} />
      <BlockStateOps onCodeRef={sidebar.open} />
      <PruningArchival onCodeRef={sidebar.open} />
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
