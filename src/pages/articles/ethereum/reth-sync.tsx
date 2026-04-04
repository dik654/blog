import Overview from './reth-sync/Overview';
import FullSync from './reth-sync/FullSync';
import SnapSync from './reth-sync/SnapSync';
import LiveSync from './reth-sync/LiveSync';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-sync/codeRefs';
import { rethSyncTree } from './reth-sync/fileTrees';

export default function RethSyncArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <FullSync onCodeRef={sidebar.open} />
      <SnapSync onCodeRef={sidebar.open} />
      <LiveSync onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethSyncTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
