import Overview from './nova/Overview';
import NIFS from './nova/NIFS';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './nova/codeRefs';
import { novaTree } from './nova/fileTrees';

export default function NovaArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <NIFS onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ nova: novaTree }}
        projectMetas={{
          nova: { id: 'nova', label: 'Nova · Rust', badgeClass: 'bg-[#ede9fe] border-[#8b5cf6] text-[#4c1d95]' },
        }}
      />
    </>
  );
}
