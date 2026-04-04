import Sortition from './expected-consensus/Sortition';
import Tipset from './expected-consensus/Tipset';
import BlockValidation from './expected-consensus/BlockValidation';
import WeightCalculation from './expected-consensus/WeightCalculation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './expected-consensus/codeRefs';
import { ecTree } from './expected-consensus/fileTrees';

export default function ExpectedConsensus() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Sortition onCodeRef={sidebar.open} />
      <Tipset onCodeRef={sidebar.open} />
      <BlockValidation onCodeRef={sidebar.open} />
      <WeightCalculation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ lotus: ecTree }}
        projectMetas={{
          lotus: { id: 'lotus', label: 'Lotus · Go', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0c4a6e]' },
        }}
      />
    </>
  );
}
