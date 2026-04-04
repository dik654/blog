import Overview from './cometbft-abci/Overview';
import ABCIClient from './cometbft-abci/ABCIClient';
import PrepareProcess from './cometbft-abci/PrepareProcess';
import FinalizeCommit from './cometbft-abci/FinalizeCommit';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-abci/codeRefs';
import { cometbftAbciTree } from './cometbft-abci/fileTrees';

export default function CometBFTAbciArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <ABCIClient onCodeRef={sidebar.open} />
      <PrepareProcess onCodeRef={sidebar.open} />
      <FinalizeCommit onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftAbciTree }}
        projectMetas={{
          cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' },
        }}
      />
    </>
  );
}
