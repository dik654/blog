import Overview from './discv5/Overview';
import Handshake from './discv5/Handshake';
import Session from './discv5/Session';
import FindNode from './discv5/FindNode';
import Talk from './discv5/Talk';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './discv5/codeRefs';
import { gethTree } from './discv5/fileTrees';

export default function Discv5Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Handshake onCodeRef={sidebar.open} />
      <Session onCodeRef={sidebar.open} />
      <FindNode onCodeRef={sidebar.open} />
      <Talk onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': gethTree }}
        projectMetas={{
          'go-ethereum': { id: 'go-ethereum', label: 'discv5 · Go', badgeClass: 'bg-[#e0f2fe] border-[#38bdf8] text-[#0369a1]' },
        }}
      />
    </>
  );
}
