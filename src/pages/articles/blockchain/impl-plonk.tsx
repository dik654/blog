import Overview from './impl-plonk/Overview';
import KZG from './impl-plonk/KZG';
import Permutation from './impl-plonk/Permutation';
import Lookup from './impl-plonk/Lookup';
import Prover from './impl-plonk/Prover';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './impl-plonk/codeRefs';
import { zkPlonkTree } from './impl-plonk/fileTrees';

export default function ImplPlonk() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <KZG onCodeRef={sidebar.open} />
      <Permutation onCodeRef={sidebar.open} />
      <Lookup onCodeRef={sidebar.open} />
      <Prover onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkPlonk: zkPlonkTree }}
        projectMetas={{
          zkPlonk: {
            id: 'zkPlonk',
            label: 'zk_from_scratch · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
