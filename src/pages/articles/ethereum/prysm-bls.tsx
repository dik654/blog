import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-bls/codeRefs';
import { prysmTree } from './prysm-bls/fileTrees';
import Overview from './prysm-bls/Overview';
import BlstBinding from './prysm-bls/BlstBinding';
import SignVerify from './prysm-bls/SignVerify';
import BatchVerification from './prysm-bls/BatchVerification';

export default function PrysmBls() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BlstBinding onCodeRef={sidebar.open} />
      <SignVerify onCodeRef={sidebar.open} />
      <BatchVerification onCodeRef={sidebar.open} />
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
