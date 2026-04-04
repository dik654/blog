import Overview from './monad/Overview';
import ParallelExecution from './monad/ParallelExecution';
import NativeCompilation from './monad/NativeCompilation';
import TrieDB from './monad/TrieDB';
import Performance from './monad/Performance';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './monad/codeRefs';

export default function MonadArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ParallelExecution onCodeRef={sidebar.open} />
      <NativeCompilation onCodeRef={sidebar.open} />
      <TrieDB onCodeRef={sidebar.open} />
      <Performance onCodeRef={sidebar.open} />
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
