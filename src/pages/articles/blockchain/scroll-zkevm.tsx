import Overview from './scroll-zkevm/Overview';
import Gadget from './scroll-zkevm/Gadget';
import CircuitOverview from './scroll-zkevm/CircuitOverview';
import OpcodeCircuits from './scroll-zkevm/OpcodeCircuits';
import TableSystem from './scroll-zkevm/TableSystem';
import WitnessSystem from './scroll-zkevm/WitnessSystem';
import LookupMechanisms from './scroll-zkevm/LookupMechanisms';
import ProofPipeline from './scroll-zkevm/ProofPipeline';
import Halo2Integration from './scroll-zkevm/Halo2Integration';
import GadgetSystem from './scroll-zkevm/GadgetSystem';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './scroll-zkevm/codeRefs';
import { zkevmTree } from './scroll-zkevm/fileTree';

export default function ScrollZkevmArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Gadget onCodeRef={sidebar.open} />
      <CircuitOverview />
      <OpcodeCircuits />
      <TableSystem />
      <WitnessSystem />
      <LookupMechanisms />
      <ProofPipeline />
      <Halo2Integration />
      <GadgetSystem />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkevm_circuits: zkevmTree }}
        projectMetas={{
          zkevm_circuits: { id: 'zkevm_circuits', label: 'Scroll zkEVM · Rust', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
