import Overview from './reth-mev/Overview';
import BuilderApi from './reth-mev/BuilderApi';
import Flashbots from './reth-mev/Flashbots';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-mev/codeRefs';
import { rethTree } from './reth-mev/fileTrees';

export default function RethMev() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BuilderApi onCodeRef={sidebar.open} />
      <Flashbots onCodeRef={sidebar.open} />
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
