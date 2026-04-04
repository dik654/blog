import Overview from './aptos/Overview';
import BlockSTM from './aptos/BlockSTM';
import MoveVM from './aptos/MoveVM';
import DiemBFT from './aptos/DiemBFT';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './aptos/codeRefs';

export default function AptosArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BlockSTM onCodeRef={sidebar.open} />
      <MoveVM onCodeRef={sidebar.open} />
      <DiemBFT onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
      />
    </>
  );
}
