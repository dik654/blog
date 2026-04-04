import Overview from './filecoin-gpu-proofs/Overview';
import GPUAcceleration from './filecoin-gpu-proofs/GPUAcceleration';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-gpu-proofs/codeRefs';
import { bellpersonTree } from './filecoin-gpu-proofs/fileTrees';

export default function FilecoinGPUProofsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <GPUAcceleration onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'bellperson': bellpersonTree }}
        projectMetas={{
          'bellperson': { id: 'bellperson', label: 'bellperson · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
