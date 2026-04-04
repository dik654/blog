import Overview from './reth-cli/Overview';
import NodeBuilder from './reth-cli/NodeBuilder';
import Components from './reth-cli/Components';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-cli/codeRefs';
import { rethTree } from './reth-cli/fileTrees';

export default function RethCli() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <NodeBuilder onCodeRef={sidebar.open} />
      <Components onCodeRef={sidebar.open} />
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
