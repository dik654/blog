import Overview from './reth-eip4844/Overview';
import BlobPool from './reth-eip4844/BlobPool';
import BlobStore from './reth-eip4844/BlobStore';
import Kzg from './reth-eip4844/Kzg';
import BlobGas from './reth-eip4844/BlobGas';
import Lifecycle from './reth-eip4844/Lifecycle';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-eip4844/codeRefs';
import { rethEip4844Tree } from './reth-eip4844/fileTrees';

export default function RethEip4844Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BlobPool onCodeRef={sidebar.open} />
      <BlobStore onCodeRef={sidebar.open} />
      <Kzg onCodeRef={sidebar.open} />
      <BlobGas onCodeRef={sidebar.open} />
      <Lifecycle onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethEip4844Tree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
