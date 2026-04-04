import Overview from './intel-sgx/Overview';
import EcallOcall from './intel-sgx/EcallOcall';
import Sealing from './intel-sgx/Sealing';
import Attestation from './intel-sgx/Attestation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './intel-sgx/codeRefs';
import { sgxFileTree } from './intel-sgx/fileTrees';

export default function IntelSGXArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <EcallOcall onCodeRef={sidebar.open} />
      <Sealing onCodeRef={sidebar.open} />
      <Attestation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'linux-sgx': sgxFileTree }}
        projectMetas={{
          'linux-sgx': { id: 'linux-sgx', label: 'Intel SGX · C', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
