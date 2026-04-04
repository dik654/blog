import Overview from './op-tee/Overview';
import WorldSwitch from './op-tee/WorldSwitch';
import TASession from './op-tee/TASession';
import Keys from './op-tee/Keys';
import MemoryManagement from './op-tee/MemoryManagement';
import CryptoOperations from './op-tee/CryptoOperations';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './op-tee/codeRefs';
import { opteeTree } from './op-tee/opteeFileTree';

export default function OpTeeArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <WorldSwitch onCodeRef={sidebar.open} />
      <TASession onCodeRef={sidebar.open} />
      <Keys onCodeRef={sidebar.open} />
      <MemoryManagement />
      <CryptoOperations />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ optee_os: opteeTree }}
        projectMetas={{
          optee_os: { id: 'optee_os', label: 'OP-TEE \u00b7 C', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
