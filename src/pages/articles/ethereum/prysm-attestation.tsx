import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-attestation/codeRefs';
import { prysmTree } from './prysm-attestation/fileTrees';
import Overview from './prysm-attestation/Overview';
import AttestationCreation from './prysm-attestation/AttestationCreation';
import Aggregation from './prysm-attestation/Aggregation';
import PoolInclusion from './prysm-attestation/PoolInclusion';

export default function PrysmAttestation() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <AttestationCreation onCodeRef={sidebar.open} />
      <Aggregation onCodeRef={sidebar.open} />
      <PoolInclusion onCodeRef={sidebar.open} />
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
