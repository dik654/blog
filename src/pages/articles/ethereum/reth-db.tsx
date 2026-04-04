import Overview from './reth-db/Overview';
import Tables from './reth-db/Tables';
import Cursor from './reth-db/Cursor';
import StaticFiles from './reth-db/StaticFiles';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-db/codeRefs';
import { rethDbTree } from './reth-db/fileTrees';

export default function RethDbArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Tables onCodeRef={sidebar.open} />
      <Cursor onCodeRef={sidebar.open} />
      <StaticFiles onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethDbTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
