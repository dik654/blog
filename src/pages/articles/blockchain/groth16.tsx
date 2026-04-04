import DataStructures from './groth16/DataStructures';
import TrustedSetup from './groth16/TrustedSetup';
import SetupDetail from './groth16/SetupDetail';
import Prove from './groth16/Prove';
import ProvingDetail from './groth16/ProvingDetail';
import Verify from './groth16/Verify';
import R1CStoQAP from './groth16/R1CStoQAP';
import Performance from './groth16/Performance';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './groth16/codeRefs';
import { groth16Tree } from './groth16/fileTrees';

export default function Groth16() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <DataStructures />
      <TrustedSetup onCodeRef={sidebar.open} />
      <SetupDetail />
      <Prove onCodeRef={sidebar.open} />
      <ProvingDetail />
      <Verify onCodeRef={sidebar.open} />
      <R1CStoQAP />
      <Performance />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'arkworks-rs': groth16Tree }}
        projectMetas={{
          'arkworks-rs': { id: 'arkworks-rs', label: 'Groth16 · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
