import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-validator-client/codeRefs';
import { prysmTree } from './prysm-validator-client/fileTrees';
import Overview from './prysm-validator-client/Overview';
import DutyAssignment from './prysm-validator-client/DutyAssignment';
import KeyManagement from './prysm-validator-client/KeyManagement';
import SlashingProtection from './prysm-validator-client/SlashingProtection';

export default function PrysmValidatorClient() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <DutyAssignment onCodeRef={sidebar.open} />
      <KeyManagement onCodeRef={sidebar.open} />
      <SlashingProtection onCodeRef={sidebar.open} />
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
