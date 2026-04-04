import Overview from './cometbft-state/Overview';
import StateStruct from './cometbft-state/StateStruct';
import BlockStoreSection from './cometbft-state/BlockStore';
import Evidence from './cometbft-state/Evidence';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-state/codeRefs';
import { cometbftStateTree } from './cometbft-state/fileTrees';

export default function CometBFTStateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <StateStruct onCodeRef={sidebar.open} />
      <BlockStoreSection onCodeRef={sidebar.open} />
      <Evidence onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftStateTree }}
        projectMetas={{
          cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' },
        }}
      />
    </>
  );
}
