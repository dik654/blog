import Overview from './iroh/Overview';
import Networking from './iroh/Networking';
import MagicSock from './iroh/MagicSock';
import Discovery from './iroh/Discovery';
import Protocols from './iroh/Protocols';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './iroh/codeRefs';
import { irohTree } from './iroh/irohFileTree';

export default function IrohArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Networking onCodeRef={sidebar.open} />
      <MagicSock onCodeRef={sidebar.open} />
      <Discovery onCodeRef={sidebar.open} />
      <Protocols onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ iroh: irohTree }}
        projectMetas={{
          iroh: { id: 'iroh', label: 'Iroh · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
