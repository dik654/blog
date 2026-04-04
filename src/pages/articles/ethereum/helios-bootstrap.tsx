import Overview from './helios-bootstrap/Overview';
import CheckpointSources from './helios-bootstrap/CheckpointSources';
import WeakSubjectivity from './helios-bootstrap/WeakSubjectivity';
import FetchCheckpoint from './helios-bootstrap/FetchCheckpoint';
import BootstrapResponse from './helios-bootstrap/BootstrapResponse';
import CommitteeBranch from './helios-bootstrap/CommitteeBranch';
import StoreInit from './helios-bootstrap/StoreInit';
import FirstUpdate from './helios-bootstrap/FirstUpdate';
import ErrorCases from './helios-bootstrap/ErrorCases';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './helios-bootstrap/codeRefs';
import { heliosTree } from './helios-bootstrap/fileTrees';

export default function HeliosBootstrapArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CheckpointSources title="체크포인트 소스 (API · 하드코딩 · 사용자)" />
      <WeakSubjectivity title="Weak Subjectivity 유효 기간" />
      <FetchCheckpoint title="fetch_checkpoint() HTTP + SSZ 파싱" onCodeRef={sidebar.open} />
      <BootstrapResponse title="Bootstrap 응답 구조 (header + committee + branch)" />
      <CommitteeBranch title="committee_branch Merkle 증명 검증" onCodeRef={sidebar.open} />
      <StoreInit title="Store 초기화 (각 필드의 의미)" onCodeRef={sidebar.open} />
      <FirstUpdate title="첫 번째 Update 요청" />
      <ErrorCases title="에러 케이스 (만료 · 네트워크 불일치)" />
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
