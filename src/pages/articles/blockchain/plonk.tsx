import KZG from './plonk/KZG';
import PLONKish from './plonk/PLONKish';
import Plookup from './plonk/Plookup';
import ProverVerifier from './plonk/ProverVerifier';
import FFLONK from './plonk/FFLONK';
import StandardComposer from './plonk/StandardComposer';
import GateTypes from './plonk/GateTypes';
import Constraints from './plonk/Constraints';
import ProverDetail from './plonk/ProverDetail';
import VerifierDetail from './plonk/VerifierDetail';
import ProofStructure from './plonk/ProofStructure';
import IPA from './plonk/IPA';
import HomomorphicCommitment from './plonk/HomomorphicCommitment';
import CircuitCompilation from './plonk/CircuitCompilation';
import ProofGenVerify from './plonk/ProofGenVerify';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './plonk/codeRefs';
import { plonkTree, zkGarageTree } from './plonk/fileTrees';

export default function Plonk() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <KZG onCodeRef={sidebar.open} />
      <PLONKish onCodeRef={sidebar.open} />
      <StandardComposer />
      <GateTypes />
      <Constraints />
      <Plookup />
      <ProverVerifier onCodeRef={sidebar.open} />
      <ProverDetail />
      <VerifierDetail />
      <ProofStructure />
      <IPA />
      <HomomorphicCommitment />
      <CircuitCompilation />
      <ProofGenVerify />
      <FFLONK />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ jellyfish: plonkTree, 'ZK-Garage': zkGarageTree }}
        projectMetas={{
          jellyfish: { id: 'jellyfish', label: 'PLONK · Rust', badgeClass: 'bg-[#ede9fe] border-[#8b5cf6] text-[#4c1d95]' },
          'ZK-Garage': { id: 'ZK-Garage', label: 'PLONK · Rust', badgeClass: 'bg-[#ede9fe] border-[#8b5cf6] text-[#4c1d95]' },
        }}
      />
    </>
  );
}
