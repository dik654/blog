import Overview from './amd-sev/Overview';
import Evolution from './amd-sev/Evolution';
import SEVBasics from './amd-sev/SEVBasics';
import SMEArchitecture from './amd-sev/SMEArchitecture';
import ASP from './amd-sev/ASP';
import GuestManagement from './amd-sev/GuestManagement';
import MigrationLive from './amd-sev/MigrationLive';
import KernelSupport from './amd-sev/KernelSupport';
import SNP from './amd-sev/SNP';
import Attestation from './amd-sev/Attestation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './amd-sev/codeRefs';
import { sevTree } from './amd-sev/sevFileTree';

export default function AmdSevArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Evolution />
      <SEVBasics />
      <SMEArchitecture />
      <ASP />
      <GuestManagement />
      <MigrationLive />
      <KernelSupport />
      <SNP onCodeRef={sidebar.open} />
      <Attestation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'linux-sev': sevTree }}
        projectMetas={{
          'linux-sev': { id: 'linux-sev', label: 'AMD SEV \u00b7 ASM', badgeClass: 'bg-[#fee2e2] border-[#ef4444] text-[#991b1b]' },
        }}
      />
    </>
  );
}
