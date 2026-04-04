import Overview from './cometbft-execution/Overview';
import ValidateBlock from './cometbft-execution/ValidateBlock';
import ExecuteBlock from './cometbft-execution/ExecuteBlock';
import SaveState from './cometbft-execution/SaveState';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './cometbft-execution/codeRefs';
import { cometbftExecutionTree } from './cometbft-execution/fileTrees';

export default function CometBFTExecutionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <ValidateBlock onCodeRef={sidebar.open} />
      <ExecuteBlock onCodeRef={sidebar.open} />
      <SaveState onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftExecutionTree }}
        projectMetas={{
          cometbft: { id: 'cometbft', label: 'CometBFT · Go', badgeClass: 'bg-teal-500/10 border-teal-500 text-teal-700' },
        }}
      />
    </>
  );
}
