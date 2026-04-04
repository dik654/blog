import Overview from './reth-exex/Overview';
import Notification from './reth-exex/Notification';
import UseCases from './reth-exex/UseCases';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-exex/codeRefs';
import { rethTree } from './reth-exex/fileTrees';

export default function RethExEx() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Notification onCodeRef={sidebar.open} />
      <UseCases onCodeRef={sidebar.open} />
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
