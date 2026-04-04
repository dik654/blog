import Overview from './filecoin-ipc/Overview';
import Subnet from './filecoin-ipc/Subnet';
import Checkpointing from './filecoin-ipc/Checkpointing';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-ipc/codeRefs';
import { ipcTree } from './filecoin-ipc/fileTrees';

export default function FilecoinIpcArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Subnet onCodeRef={sidebar.open} />
      <Checkpointing onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ ipc: ipcTree }}
        projectMetas={{
          ipc: { id: 'ipc', label: 'IPC · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
