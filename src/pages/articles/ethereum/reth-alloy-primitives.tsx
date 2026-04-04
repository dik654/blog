import Overview from './reth-alloy-primitives/Overview';
import Rlp from './reth-alloy-primitives/Rlp';
import Primitives from './reth-alloy-primitives/Primitives';
import FixedBytesInternal from './reth-alloy-primitives/FixedBytesInternal';
import U256Arithmetic from './reth-alloy-primitives/U256Arithmetic';
import Keccak256Address from './reth-alloy-primitives/Keccak256Address';
import BytesAndBloom from './reth-alloy-primitives/BytesAndBloom';
import RlpDecoding from './reth-alloy-primitives/RlpDecoding';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-alloy-primitives/codeRefs';
import { rethTree } from './reth-alloy-primitives/fileTrees';

export default function RethAlloyPrimitives() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Rlp onCodeRef={sidebar.open} />
      <Primitives onCodeRef={sidebar.open} />
      <FixedBytesInternal onCodeRef={sidebar.open} />
      <U256Arithmetic onCodeRef={sidebar.open} />
      <Keccak256Address onCodeRef={sidebar.open} />
      <BytesAndBloom onCodeRef={sidebar.open} />
      <RlpDecoding onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
