import Overview from './cometbft-p2p/Overview';
import MConnection from './cometbft-p2p/MConnection';
import Switch from './cometbft-p2p/Switch';
import Reactor from './cometbft-p2p/Reactor';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-p2p/codeRefs';
import { cometbftP2PTree } from './cometbft-p2p/fileTrees';

export default function CometBFTP2PArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <MConnection onCodeRef={sidebar.open} />
      <Switch onCodeRef={sidebar.open} />
      <Reactor onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftP2PTree }}
        projectMetas={{ cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' } }}
      />
    </>
  );
}
