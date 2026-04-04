import Overview from './plonky3/Overview';
import FieldArithmetic from './plonky3/FieldArithmetic';
import AIR from './plonky3/AIR';
import FRI from './plonky3/FRI';
import Hash from './plonky3/Hash';
import Poseidon2Hash from './plonky3/Poseidon2Hash';
import MerkleCommit from './plonky3/MerkleCommit';
import UniSTARK from './plonky3/UniSTARK';
import Challenger from './plonky3/Challenger';
import Performance from './plonky3/Performance';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './plonky3/codeRefs';
import { plonky3Tree } from './plonky3/fileTrees';

export default function Plonky3Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <FieldArithmetic onCodeRef={sidebar.open} />
      <AIR onCodeRef={sidebar.open} />
      <FRI onCodeRef={sidebar.open} />
      <Hash />
      <Poseidon2Hash />
      <MerkleCommit />
      <UniSTARK onCodeRef={sidebar.open} />
      <Challenger />
      <Performance />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ plonky3: plonky3Tree }}
        projectMetas={{
          plonky3: { id: 'plonky3', label: 'Plonky3 · Rust', badgeClass: 'bg-[#ede9fe] border-[#8b5cf6] text-[#4c1d95]' },
        }}
      />
    </>
  );
}
