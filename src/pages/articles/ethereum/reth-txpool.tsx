import Overview from './reth-txpool/Overview';
import Validation from './reth-txpool/Validation';
import Ordering from './reth-txpool/Ordering';
import Subpool from './reth-txpool/Subpool';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-txpool/codeRefs';
import { rethTxpoolTree } from './reth-txpool/fileTrees';

export default function RethTxpoolArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Validation onCodeRef={sidebar.open} />
      <Ordering onCodeRef={sidebar.open} />
      <Subpool onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethTxpoolTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
