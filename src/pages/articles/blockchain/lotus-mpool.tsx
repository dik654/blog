import Overview from './lotus-mpool/Overview';
import GasEstimation from './lotus-mpool/GasEstimation';
import NonceManagement from './lotus-mpool/NonceManagement';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './lotus-mpool/codeRefs';
import { mpoolTree } from './lotus-mpool/fileTrees';

export default function LotusMpoolArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <GasEstimation onCodeRef={sidebar.open} />
      <NonceManagement onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: mpoolTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
