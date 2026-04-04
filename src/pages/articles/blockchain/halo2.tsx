import Overview from './halo2/Overview';
import Keygen from './halo2/Keygen';
import Prover from './halo2/Prover';
import ConstraintSystem from './halo2/ConstraintSystem';
import VirtualRegion from './halo2/VirtualRegion';
import Halo2Ecc from './halo2/Halo2Ecc';
import Examples from './halo2/Examples';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './halo2/codeRefs';
import { halo2Tree } from './halo2/fileTree';

export default function Halo2Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Keygen onCodeRef={sidebar.open} />
      <Prover onCodeRef={sidebar.open} />
      <ConstraintSystem />
      <VirtualRegion />
      <Halo2Ecc />
      <Examples />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ halo2_proofs: halo2Tree }}
        projectMetas={{
          halo2_proofs: { id: 'halo2_proofs', label: 'Halo2 · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
