import Overview from './reth-rpc/Overview';
import EthApi from './reth-rpc/EthApi';
import EngineApi from './reth-rpc/EngineApi';
import Middleware from './reth-rpc/Middleware';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-rpc/codeRefs';
import { rethRpcTree } from './reth-rpc/fileTrees';

export default function RethRpcArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <EthApi onCodeRef={sidebar.open} />
      <EngineApi onCodeRef={sidebar.open} />
      <Middleware />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethRpcTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
