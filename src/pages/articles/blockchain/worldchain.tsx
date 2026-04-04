import Overview from './worldchain/Overview';
import WorldIdVerification from './worldchain/WorldIdVerification';
import OpStackIntegration from './worldchain/OpStackIntegration';
import PriorityBlockspace from './worldchain/PriorityBlockspace';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './worldchain/codeRefs';

export default function WorldChainArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <WorldIdVerification onCodeRef={sidebar.open} />
      <OpStackIntegration onCodeRef={sidebar.open} />
      <PriorityBlockspace onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
      />
    </>
  );
}
