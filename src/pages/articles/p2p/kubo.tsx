import Overview from './kubo/Overview';
import Bitswap from './kubo/Bitswap';
import ContentRouting from './kubo/ContentRouting';
import PinningGC from './kubo/PinningGC';
import Gateway from './kubo/Gateway';
import Config from './kubo/Config';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './kubo/codeRefs';
import { kuboTree } from './kubo/kuboFileTree';

export default function KuboArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Bitswap onCodeRef={sidebar.open} />
      <ContentRouting onCodeRef={sidebar.open} />
      <PinningGC onCodeRef={sidebar.open} />
      <Gateway onCodeRef={sidebar.open} />
      <Config onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ kubo: kuboTree }}
        projectMetas={{
          kubo: { id: 'kubo', label: 'Kubo (Go-IPFS)', badgeClass: 'bg-[#dbeafe] border-[#3b82f6] text-[#1e40af]' },
        }}
      />
    </>
  );
}
