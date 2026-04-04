import Overview from './proofs-porep/Overview';
import PC1 from './proofs-porep/PC1';
import PC2 from './proofs-porep/PC2';
import Commit from './proofs-porep/Commit';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './proofs-porep/codeRefs';
import { porepTree } from './proofs-porep/fileTrees';

export default function ProofsPorepArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PC1 onCodeRef={sidebar.open} />
      <PC2 onCodeRef={sidebar.open} />
      <Commit onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ rust_fil_proofs: porepTree }}
        projectMetas={{
          rust_fil_proofs: { id: 'rust_fil_proofs', label: 'fil-proofs · Rust', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
