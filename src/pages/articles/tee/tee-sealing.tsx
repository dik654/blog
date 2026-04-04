import Overview from './tee-sealing/Overview';
import KeyDerivation from './tee-sealing/KeyDerivation';
import Policy from './tee-sealing/Policy';
import AesGcm from './tee-sealing/AesGcm';
import CodeSealing from './tee-sealing/CodeSealing';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './tee-sealing/codeRefs';
import { sealingFileTree } from './tee-sealing/fileTrees';

export default function TeeSealingArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <KeyDerivation onCodeRef={sidebar.open} />
      <Policy />
      <AesGcm />
      <CodeSealing onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'sgx-sealing': sealingFileTree }}
        projectMetas={{
          'sgx-sealing': { id: 'sgx-sealing', label: 'SGX Sealing · C', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
