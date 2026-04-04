import Overview from './helios-state/Overview';
import ProofTrace from './helios-state/ProofTrace';
import MptTraversal from './helios-state/MptTraversal';
import ProofDB from './helios-state/ProofDB';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './helios-state/codeRefs';
import { heliosTree } from './helios-state/fileTrees';

export default function HeliosStateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProofTrace title="계정 + 스토리지 증명 코드 추적" onCodeRef={sidebar.open} />
      <MptTraversal title="verify_proof() — MPT 순회 알고리즘" onCodeRef={sidebar.open} />
      <ProofDB title="ProofDB — 캐싱과 에러" onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ helios: heliosTree }}
        projectMetas={{
          helios: { id: 'helios', label: 'Helios · Rust', badgeClass: 'bg-blue-500/10 border-blue-500 text-blue-700' },
        }}
      />
    </>
  );
}
