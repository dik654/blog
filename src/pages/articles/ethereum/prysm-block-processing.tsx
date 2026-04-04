import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-block-processing/codeRefs';
import { prysmTree } from './prysm-block-processing/fileTrees';
import Overview from './prysm-block-processing/Overview';
import ProcessBlock from './prysm-block-processing/ProcessBlock';
import Operations from './prysm-block-processing/Operations';
import ExecutionPayload from './prysm-block-processing/ExecutionPayload';

export default function PrysmBlockProcessing() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProcessBlock onCodeRef={sidebar.open} />
      <Operations onCodeRef={sidebar.open} />
      <ExecutionPayload onCodeRef={sidebar.open} />
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
