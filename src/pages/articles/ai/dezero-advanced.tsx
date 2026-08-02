import Article from './dezero-advanced/Article';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { runtimeCodeRefs, runtimeFileTree } from './dezero-shared/runtimeCodeRefs';

export default function DezeroAdvanced() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Article onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={runtimeCodeRefs}
        fileTrees={{ 'dezero-rs': runtimeFileTree }}
        projectMetas={{
          'dezero-rs': {
            id: 'dezero-rs',
            label: '교육용 재구성 · Rust',
            badgeClass: 'bg-cyan-50 border-cyan-600/35 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100',
          },
        }}
      />
    </>
  );
}
