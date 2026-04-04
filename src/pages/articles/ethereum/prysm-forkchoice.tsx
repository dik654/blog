import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-forkchoice/codeRefs';
import { prysmTree } from './prysm-forkchoice/fileTrees';
import Overview from './prysm-forkchoice/Overview';
import ProtoArray from './prysm-forkchoice/ProtoArray';
import OnBlock from './prysm-forkchoice/OnBlock';
import GetHead from './prysm-forkchoice/GetHead';

export default function PrysmForkchoice() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProtoArray onCodeRef={sidebar.open} />
      <OnBlock onCodeRef={sidebar.open} />
      <GetHead onCodeRef={sidebar.open} />
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
