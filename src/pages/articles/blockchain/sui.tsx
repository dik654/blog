import Overview from './sui/Overview';
import ObjectModel from './sui/ObjectModel';
import Consensus from './sui/Consensus';
import MoveSui from './sui/MoveSui';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './sui/codeRefs';

export default function SuiArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ObjectModel onCodeRef={sidebar.open} />
      <Consensus onCodeRef={sidebar.open} />
      <MoveSui onCodeRef={sidebar.open} />
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
