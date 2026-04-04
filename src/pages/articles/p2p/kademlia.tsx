import Overview from './kademlia/Overview';
import XorDistance from './kademlia/XorDistance';
import Routing from './kademlia/Routing';
import BucketOps from './kademlia/BucketOps';
import Revalidation from './kademlia/Revalidation';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './kademlia/codeRefs';
import { gethTree } from './kademlia/fileTrees';

export default function KademliaArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <XorDistance onCodeRef={sidebar.open} />
      <Routing onCodeRef={sidebar.open} />
      <BucketOps onCodeRef={sidebar.open} />
      <Revalidation onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': gethTree }}
        projectMetas={{
          'go-ethereum': { id: 'go-ethereum', label: 'go-ethereum · Go', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
