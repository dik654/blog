import Overview from './cometbft-mempool/Overview';
import CList from './cometbft-mempool/CList';
import CheckTx from './cometbft-mempool/CheckTx';
import Recheck from './cometbft-mempool/Recheck';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-mempool/codeRefs';
import { cometbftMempoolTree } from './cometbft-mempool/fileTrees';

export default function CometBFTMempoolArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CList onCodeRef={sidebar.open} />
      <CheckTx onCodeRef={sidebar.open} />
      <Recheck onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftMempoolTree }}
        projectMetas={{ cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' } }}
      />
    </>
  );
}
