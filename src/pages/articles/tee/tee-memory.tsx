import Overview from './tee-memory/Overview';
import SgxEpc from './tee-memory/SgxEpc';
import SevSme from './tee-memory/SevSme';
import TdxMktme from './tee-memory/TdxMktme';
import CodeMemory from './tee-memory/CodeMemory';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './tee-memory/codeRefs';
import { teeMemoryTree } from './tee-memory/fileTrees';

export default function TeeMemory() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <SgxEpc onCodeRef={sidebar.open} />
      <SevSme onCodeRef={sidebar.open} />
      <TdxMktme onCodeRef={sidebar.open} />
      <CodeMemory />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'tee-memory': teeMemoryTree }}
        projectMetas={{
          'tee-memory': { id: 'tee-memory', label: 'TEE Memory · C', badgeClass: 'bg-[#dbeafe] border-[#6366f1] text-[#3730a3]' },
        }}
      />
    </>
  );
}
