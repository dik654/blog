import Overview from './reth-block-execution/Overview';
import Executor from './reth-block-execution/Executor';
import EvmConfig from './reth-block-execution/EvmConfig';
import StateChanges from './reth-block-execution/StateChanges';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-block-execution/codeRefs';
import { rethBlockExecTree } from './reth-block-execution/fileTrees';

export default function RethBlockExecutionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Executor onCodeRef={sidebar.open} />
      <EvmConfig onCodeRef={sidebar.open} />
      <StateChanges onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethBlockExecTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
