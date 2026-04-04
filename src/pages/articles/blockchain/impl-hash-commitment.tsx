import Overview from './impl-hash-commitment/Overview';
import Poseidon from './impl-hash-commitment/Poseidon';
import Merkle from './impl-hash-commitment/Merkle';
import Commitment from './impl-hash-commitment/Commitment';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './impl-hash-commitment/codeRefs';
import { zkHashTree } from './impl-hash-commitment/fileTrees';

export default function ImplHashCommitment() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Poseidon onCodeRef={sidebar.open} />
      <Merkle onCodeRef={sidebar.open} />
      <Commitment onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkHash: zkHashTree }}
        projectMetas={{
          zkHash: {
            id: 'zkHash',
            label: 'zk_from_scratch · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
