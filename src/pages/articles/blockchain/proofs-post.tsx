import Overview from './proofs-post/Overview';
import WindowPost from './proofs-post/WindowPost';
import WinningPost from './proofs-post/WinningPost';
import FaultRecovery from './proofs-post/FaultRecovery';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './proofs-post/codeRefs';
import { postTree } from './proofs-post/fileTrees';

export default function ProofsPostArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <WindowPost onCodeRef={sidebar.open} />
      <WinningPost onCodeRef={sidebar.open} />
      <FaultRecovery onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ rust_fil_proofs: postTree }}
        projectMetas={{
          rust_fil_proofs: { id: 'rust_fil_proofs', label: 'fil-proofs · Rust', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
