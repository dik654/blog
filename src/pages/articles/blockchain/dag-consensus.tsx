import Overview from './dag-consensus/Overview';
import Narwhal from './dag-consensus/Narwhal';
import Bullshark from './dag-consensus/Bullshark';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dag-consensus/codeRefs';
import { suiTree } from './dag-consensus/fileTrees';

export default function DAGConsensusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Narwhal onCodeRef={sidebar.open} />
      <Bullshark onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ sui: suiTree }}
        projectMetas={{
          sui: { id: 'sui', label: 'Sui · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
