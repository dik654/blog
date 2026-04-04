import Overview from './helios-consensus/Overview';
import VerifyTrace from './helios-consensus/VerifyTrace';
import CommitteeLifecycle from './helios-consensus/CommitteeLifecycle';
import SyncLoop from './helios-consensus/SyncLoop';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './helios-consensus/codeRefs';
import { heliosTree } from './helios-consensus/fileTrees';

export default function HeliosConsensusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <VerifyTrace title="verify_sync_committee_sig() 5단계 추적" onCodeRef={sidebar.open} />
      <CommitteeLifecycle title="위원회 교체와 핸드오프" onCodeRef={sidebar.open} />
      <SyncLoop title="Sync Loop — 폴링 · 검증 · 적용 순환" onCodeRef={sidebar.open} />
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
