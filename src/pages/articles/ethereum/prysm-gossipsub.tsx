import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-gossipsub/codeRefs';
import { prysmTree } from './prysm-gossipsub/fileTrees';
import Overview from './prysm-gossipsub/Overview';
import Topics from './prysm-gossipsub/Topics';
import MessageValidation from './prysm-gossipsub/MessageValidation';
import SnappyEncoding from './prysm-gossipsub/SnappyEncoding';

export default function PrysmGossipsub() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Topics onCodeRef={sidebar.open} />
      <MessageValidation onCodeRef={sidebar.open} />
      <SnappyEncoding onCodeRef={sidebar.open} />
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
