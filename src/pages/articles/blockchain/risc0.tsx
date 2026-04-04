import Overview from './risc0/Overview';
import Execution from './risc0/Execution';
import ProofSystem from './risc0/ProofSystem';
import Ethereum from './risc0/Ethereum';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './risc0/codeRefs';
import { risc0Tree } from './risc0/risc0FileTree';

export default function Risc0Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Execution onCodeRef={sidebar.open} />
      <ProofSystem onCodeRef={sidebar.open} />
      <Ethereum />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ risc0: risc0Tree }}
        projectMetas={{
          risc0: { id: 'risc0', label: 'RISC Zero \u00b7 Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
