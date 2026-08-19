import Overview from "./open-r1/Overview";
import SFTProcess from "./open-r1/SFTProcess";
import GRPOProcess from "./open-r1/GRPOProcess";
import RewardSystem from "./open-r1/RewardSystem";
import DataPipeline from "./open-r1/DataPipeline";
import Evaluation from "./open-r1/Evaluation";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./open-r1/codeRefs";
import { openR1Tree, trlTree } from "./open-r1/fileTree";

export default function OpenR1Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <SFTProcess />
      <GRPOProcess onCodeRef={sidebar.open} />
      <RewardSystem onCodeRef={sidebar.open} />
      <DataPipeline />
      <Evaluation />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "open-r1": openR1Tree, trl: trlTree }}
        projectMetas={{
          "open-r1": {
            id: "open-r1",
            label: "open-r1 · Python",
            badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
          },
          trl: {
            id: "trl",
            label: "TRL · Python",
            badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
          },
        }}
      />
    </>
  );
}
