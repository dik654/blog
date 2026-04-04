import Overview from './filecoin-pdp/Overview';
import Protocol from './filecoin-pdp/Protocol';
import Onchain from './filecoin-pdp/Onchain';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-pdp/codeRefs';
import { pdpTree } from './filecoin-pdp/fileTrees';

export default function FilecoinPdpArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Protocol onCodeRef={sidebar.open} />
      <Onchain onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ curio: pdpTree }}
        projectMetas={{
          curio: { id: 'curio', label: 'Curio · Go', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
