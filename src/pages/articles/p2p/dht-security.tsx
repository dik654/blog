import Overview from './dht-security/Overview';
import Sybil from './dht-security/Sybil';
import Eclipse from './dht-security/Eclipse';
import GethDefense from './dht-security/GethDefense';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dht-security/codeRefs';
import { gethTree } from './dht-security/fileTrees';

export default function DhtSecurityArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Sybil onCodeRef={sidebar.open} />
      <Eclipse onCodeRef={sidebar.open} />
      <GethDefense onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': gethTree }}
        projectMetas={{
          'go-ethereum': {
            id: 'go-ethereum',
            label: 'go-ethereum · Go',
            badgeClass: 'bg-[#e0f2fe] border-[#38bdf8] text-[#0369a1]',
          },
        }}
      />
    </>
  );
}
