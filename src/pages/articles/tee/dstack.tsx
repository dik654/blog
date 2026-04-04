import Overview from './dstack/Overview';
import VmCreation from './dstack/VmCreation';
import Attestation from './dstack/Attestation';
import KeyManagement from './dstack/KeyManagement';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dstack/codeRefs';
import { dstackTree } from './dstack/dstackFileTree';

export default function DstackArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <VmCreation onCodeRef={sidebar.open} />
      <Attestation onCodeRef={sidebar.open} />
      <KeyManagement onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ dstack: dstackTree }}
        projectMetas={{
          dstack: { id: 'dstack', label: 'dstack \u00b7 Python', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
