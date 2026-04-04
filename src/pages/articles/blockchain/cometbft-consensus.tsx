import Overview from './cometbft-consensus/Overview';
import ReceiveRoutine from './cometbft-consensus/ReceiveRoutine';
import RoundState from './cometbft-consensus/RoundState';
import VoteHandling from './cometbft-consensus/VoteHandling';
import Timeout from './cometbft-consensus/Timeout';
import Byzantine from './cometbft-consensus/Byzantine';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-consensus/codeRefs';
import { cometbftConsensusTree } from './cometbft-consensus/fileTrees';

export default function CometBFTConsensusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <ReceiveRoutine onCodeRef={sidebar.open} />
      <RoundState onCodeRef={sidebar.open} />
      <VoteHandling onCodeRef={sidebar.open} />
      <Timeout onCodeRef={sidebar.open} />
      <Byzantine onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftConsensusTree }}
        projectMetas={{
          cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' },
        }}
      />
    </>
  );
}
