import Overview from './reth-precompiles/Overview';
import Crypto from './reth-precompiles/Crypto';
import EipPrecompiles from './reth-precompiles/EipPrecompiles';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-precompiles/codeRefs';
import { rethTree } from './reth-precompiles/fileTrees';

export default function RethPrecompiles() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Crypto onCodeRef={sidebar.open} />
      <EipPrecompiles onCodeRef={sidebar.open} />
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
