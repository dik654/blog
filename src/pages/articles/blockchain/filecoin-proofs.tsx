import Overview from './filecoin-proofs/Overview';
import SDR from './filecoin-proofs/SDR';
import PoSt from './filecoin-proofs/PoSt';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-proofs/codeRefs';
import { filProofsTree } from './filecoin-proofs/fileTree';

export default function FilecoinProofsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <SDR onCodeRef={sidebar.open} />
      <PoSt onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ rust_fil_proofs: filProofsTree }}
        projectMetas={{
          rust_fil_proofs: { id: 'rust_fil_proofs', label: 'fil-proofs · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
