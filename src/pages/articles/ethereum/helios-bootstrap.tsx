import Overview from "./helios-bootstrap/Overview";
import CheckpointSources from "./helios-bootstrap/CheckpointSources";
import WeakSubjectivity from "./helios-bootstrap/WeakSubjectivity";
import FetchCheckpoint from "./helios-bootstrap/FetchCheckpoint";
import BootstrapResponse from "./helios-bootstrap/BootstrapResponse";
import CommitteeBranch from "./helios-bootstrap/CommitteeBranch";
import StoreInit from "./helios-bootstrap/StoreInit";
import FirstUpdate from "./helios-bootstrap/FirstUpdate";
import ErrorCases from "./helios-bootstrap/ErrorCases";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./helios-bootstrap/codeRefs";
import { heliosTree } from "./helios-bootstrap/fileTrees";

export default function HeliosBootstrapArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CheckpointSources title="체크포인트 소스와 provenance" />
      <WeakSubjectivity title="Weak subjectivity와 freshness" />
      <FetchCheckpoint title="Bootstrap 요청·decode 경계" onCodeRef={sidebar.open} />
      <BootstrapResponse title="Bootstrap 응답의 세 증거" />
      <CommitteeBranch
        title="Committee Merkle branch 검증"
        onCodeRef={sidebar.open}
      />
      <StoreInit
        title="LightClientStore 원자적 초기화"
        onCodeRef={sidebar.open}
      />
      <FirstUpdate title="첫 update와 확정성 분리" />
      <ErrorCases title="실패 분류와 release gate" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ helios: heliosTree }}
        projectMetas={{
          helios: {
            id: "helios",
            label: "Helios · Rust",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
