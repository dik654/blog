import Overview from './proofs-snark/Overview';
import Groth16 from './proofs-snark/Groth16';
import GPU from './proofs-snark/GPU';
import SupraSeal from './proofs-snark/SupraSeal';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './proofs-snark/codeRefs';
import { snarkTree } from './proofs-snark/fileTrees';

export default function ProofsSnarkArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Groth16 onCodeRef={sidebar.open} />
      <GPU onCodeRef={sidebar.open} />
      <SupraSeal onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ bellperson: snarkTree }}
        projectMetas={{
          bellperson: { id: 'bellperson', label: 'bellperson · Rust', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
