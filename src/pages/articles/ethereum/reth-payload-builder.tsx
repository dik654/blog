import Overview from './reth-payload-builder/Overview';
import BuildJob from './reth-payload-builder/BuildJob';
import EngineApi from './reth-payload-builder/EngineApi';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-payload-builder/codeRefs';
import { rethPayloadTree } from './reth-payload-builder/fileTrees';

export default function RethPayloadBuilderArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BuildJob onCodeRef={sidebar.open} />
      <EngineApi onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethPayloadTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
