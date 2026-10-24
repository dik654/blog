import Overview from "./dezero-advanced/Overview";
import RnnVsLstm from "./dezero-advanced/RnnVsLstm";
import LstmCell from "./dezero-advanced/LstmCell";
import Normalization from "./dezero-advanced/Normalization";
import DropoutEmbedding from "./dezero-advanced/DropoutEmbedding";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./dezero-advanced/codeRefs";
import { dezeroAdvTree } from "./dezero-advanced/fileTrees";
import {
  DezeroImplementationLocator,
  DezeroImplementationMapReturn,
} from "./shared/DezeroImplementationLocator";

export default function DezeroAdvanced() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <DezeroImplementationLocator current="advanced" />
      <Overview />
      <RnnVsLstm onCodeRef={sidebar.open} />
      <LstmCell onCodeRef={sidebar.open} />
      <Normalization onCodeRef={sidebar.open} />
      <DropoutEmbedding onCodeRef={sidebar.open} />
      <DezeroImplementationMapReturn current="advanced" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ dezero: dezeroAdvTree }}
        projectMetas={{
          dezero: {
            id: "dezero",
            label: "dezero_rs · Rust",
            badgeClass: "bg-[#fef3c7] border-[#f59e0b] text-[#92400e]",
          },
        }}
      />
    </div>
  );
}
