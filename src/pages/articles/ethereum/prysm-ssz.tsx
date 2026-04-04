import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-ssz/codeRefs';
import { prysmTree } from './prysm-ssz/fileTrees';
import Overview from './prysm-ssz/Overview';
import EncodeDecode from './prysm-ssz/EncodeDecode';
import Merkleize from './prysm-ssz/Merkleize';
import Multiproof from './prysm-ssz/Multiproof';

export default function PrysmSsz() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <EncodeDecode onCodeRef={sidebar.open} />
      <Merkleize onCodeRef={sidebar.open} />
      <Multiproof onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: 'prysm', label: 'Prysm · Go', badgeClass: 'bg-violet-500/10 border-violet-500 text-violet-700' },
        }}
      />
    </>
  );
}
