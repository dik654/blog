import Overview from './reth-net/Overview';
import Session from './reth-net/Session';
import EthWire from './reth-net/EthWire';
import Discovery from './reth-net/Discovery';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-net/codeRefs';
import { rethNetTree } from './reth-net/fileTrees';

export default function RethNetArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Session onCodeRef={sidebar.open} />
      <EthWire onCodeRef={sidebar.open} />
      <Discovery onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethNetTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
