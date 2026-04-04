import Overview from './reth-chainspec/Overview';
import Hardfork from './reth-chainspec/Hardfork';
import Genesis from './reth-chainspec/Genesis';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-chainspec/codeRefs';
import { rethTree } from './reth-chainspec/fileTrees';

export default function RethChainSpec() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Hardfork onCodeRef={sidebar.open} />
      <Genesis onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
