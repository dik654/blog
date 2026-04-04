import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-engine-api/codeRefs';
import { prysmTree } from './prysm-engine-api/fileTrees';
import Overview from './prysm-engine-api/Overview';
import NewPayload from './prysm-engine-api/NewPayload';
import ForkchoiceUpdated from './prysm-engine-api/ForkchoiceUpdated';
import PayloadRetrieval from './prysm-engine-api/PayloadRetrieval';

export default function PrysmEngineApi() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <NewPayload onCodeRef={sidebar.open} />
      <ForkchoiceUpdated onCodeRef={sidebar.open} />
      <PayloadRetrieval onCodeRef={sidebar.open} />
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
