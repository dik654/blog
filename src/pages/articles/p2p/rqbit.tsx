import Overview from './rqbit/Overview';
import TorrentParsing from './rqbit/TorrentParsing';
import PieceManagement from './rqbit/PieceManagement';
import DHTImpl from './rqbit/DHTImpl';
import PeerConnection from './rqbit/PeerConnection';
import FileIO from './rqbit/FileIO';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './rqbit/codeRefs';
import { rqbitTree } from './rqbit/rqbitFileTree';

export default function RqbitArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <TorrentParsing onCodeRef={sidebar.open} />
      <PieceManagement onCodeRef={sidebar.open} />
      <DHTImpl onCodeRef={sidebar.open} />
      <PeerConnection onCodeRef={sidebar.open} />
      <FileIO onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ rqbit: rqbitTree }}
        projectMetas={{
          rqbit: { id: 'rqbit', label: 'rqbit · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
