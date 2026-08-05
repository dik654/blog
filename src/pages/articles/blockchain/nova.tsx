import Overview from './nova/Overview';
import RelaxedR1CS from './nova/RelaxedR1CS';
import NIFS from './nova/NIFS';
import RecursiveCircuit from './nova/RecursiveCircuit';
import SpartanCompression from './nova/SpartanCompression';
import UseCases from './nova/UseCases';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './nova/codeRefs';
import { novaTree } from './nova/fileTrees';

export default function NovaArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <RelaxedR1CS onCodeRef={sidebar.open} />
      <NIFS onCodeRef={sidebar.open} />
      <RecursiveCircuit onCodeRef={sidebar.open} />
      <SpartanCompression onCodeRef={sidebar.open} />
      <UseCases />
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
