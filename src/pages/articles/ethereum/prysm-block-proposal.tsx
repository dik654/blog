import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-block-proposal/codeRefs';
import { prysmTree } from './prysm-block-proposal/fileTrees';
import Overview from './prysm-block-proposal/Overview';
import ProposerSelection from './prysm-block-proposal/ProposerSelection';
import BlockConstruction from './prysm-block-proposal/BlockConstruction';
import GraffitiRandao from './prysm-block-proposal/GraffitiRandao';

export default function PrysmBlockProposal() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProposerSelection onCodeRef={sidebar.open} />
      <BlockConstruction onCodeRef={sidebar.open} />
      <GraffitiRandao onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: 'prysm', label: 'Prysm · Go', badgeClass: 'bg-violet-500/10 border-violet-500 text-violet-700' },
        }}
      />
    </>
  );
}
