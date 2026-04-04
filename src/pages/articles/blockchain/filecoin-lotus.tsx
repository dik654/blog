import Overview from './filecoin-lotus/Overview';
import ConsensusProofs from './filecoin-lotus/ConsensusProofs';
import ChainStore from './filecoin-lotus/ChainStore';
import BlockCreation from './filecoin-lotus/BlockCreation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-lotus/codeRefs';
import { lotusTree } from './filecoin-lotus/fileTrees';

export default function FilecoinLotusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ConsensusProofs onCodeRef={sidebar.open} />
      <ChainStore onCodeRef={sidebar.open} />
      <BlockCreation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'lotus': lotusTree }}
        projectMetas={{
          'lotus': { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
