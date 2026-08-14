import Overview from "./helios-consensus/Overview";
import VerifyTrace from "./helios-consensus/VerifyTrace";
import CommitteeLifecycle from "./helios-consensus/CommitteeLifecycle";
import SyncLoop from "./helios-consensus/SyncLoop";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./helios-consensus/codeRefs";
import { heliosTree } from "./helios-consensus/fileTrees";

export default function HeliosConsensusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <VerifyTrace
        title="Light-client update validation trace"
        onCodeRef={sidebar.open}
      />
      <CommitteeLifecycle
        title="Committee period와 핸드오프"
        onCodeRef={sidebar.open}
      />
      <SyncLoop
        title="Sync loop와 원자적 store 갱신"
        onCodeRef={sidebar.open}
      />
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
