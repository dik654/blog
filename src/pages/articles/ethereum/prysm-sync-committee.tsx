import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./prysm-sync-committee/codeRefs";
import {
  consensusTree,
  prysmTree,
} from "./prysm-sync-committee/fileTrees";
import Overview from "./prysm-sync-committee/Overview";
import Participation from "./prysm-sync-committee/Participation";
import Contribution from "./prysm-sync-committee/Contribution";
import LightClientVerification from "./prysm-sync-committee/LightClientVerification";

export default function PrysmSyncCommittee() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Participation onCodeRef={sidebar.open} />
      <Contribution onCodeRef={sidebar.open} />
      <LightClientVerification onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree, "consensus-specs": consensusTree }}
        projectMetas={{
          prysm: {
            id: "prysm",
            label: "Prysm v7.3.1 · 96d418cd",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
          "consensus-specs": {
            id: "consensus-specs",
            label: "Consensus specs · aa16bb4c",
            badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
          },
        }}
      />
    </>
  );
}
