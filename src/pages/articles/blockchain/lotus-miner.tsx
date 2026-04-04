import Overview from './lotus-miner/Overview';
import SectorLifecycle from './lotus-miner/SectorLifecycle';
import WinningPoSt from './lotus-miner/WinningPoSt';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './lotus-miner/codeRefs';
import { minerTree } from './lotus-miner/fileTrees';

export default function LotusMinerArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <SectorLifecycle onCodeRef={sidebar.open} />
      <WinningPoSt onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: minerTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
