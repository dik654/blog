import Overview from './bulletproofs/Overview';
import InnerProduct from './bulletproofs/InnerProduct';
import RangeProof from './bulletproofs/RangeProof';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './bulletproofs/codeRefs';
import { bulletproofsTree } from './bulletproofs/fileTree';

export default function BulletproofsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <InnerProduct onCodeRef={sidebar.open} />
      <RangeProof onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ bulletproofs: bulletproofsTree }}
        projectMetas={{
          bulletproofs: { id: 'bulletproofs', label: 'Bulletproofs · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
