import Overview from './reth-provider/Overview';
import StateProvider from './reth-provider/StateProvider';
import BundleState from './reth-provider/BundleState';
import Historical from './reth-provider/Historical';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-provider/codeRefs';
import { rethProviderTree } from './reth-provider/fileTrees';

export default function RethProviderArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <StateProvider onCodeRef={sidebar.open} />
      <BundleState onCodeRef={sidebar.open} />
      <Historical onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethProviderTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
